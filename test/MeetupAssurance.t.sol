// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Test } from "forge-std/Test.sol";
import { MeetupAssurance } from "../contracts/MeetupAssurance.sol";

/**
 * @notice Malicious receiver contract attempting reentrancy during claimRefund()
 */
contract MaliciousReentrantPledger {
    MeetupAssurance public campaign;
    bool public hasReentered;

    constructor(MeetupAssurance _campaign) {
        campaign = _campaign;
    }

    function doPledge() external payable {
        campaign.pledge{ value: msg.value }();
    }

    function doRefund() external {
        campaign.claimRefund();
    }

    receive() external payable {
        if (!hasReentered) {
            hasReentered = true;
            campaign.claimRefund();
        }
    }
}

/**
 * @notice Malicious receiver contract attempting reentrancy during collect()
 */
contract MaliciousReentrantBeneficiary {
    MeetupAssurance public campaign;
    bool public hasReentered;

    constructor() { }

    function setCampaign(MeetupAssurance _campaign) external {
        campaign = _campaign;
    }

    function doCollect() external {
        campaign.collect();
    }

    receive() external payable {
        if (!hasReentered) {
            hasReentered = true;
            campaign.collect();
        }
    }
}

/**
 * @notice Receiver contract that rejects all incoming ETH to test failed refund transfers
 */
contract RejectEtherPledger {
    MeetupAssurance public campaign;

    constructor(MeetupAssurance _campaign) {
        campaign = _campaign;
    }

    function doPledge() external payable {
        campaign.pledge{ value: msg.value }();
    }

    function doRefund() external {
        campaign.claimRefund();
    }

    receive() external payable {
        revert("I reject ETH");
    }
}

contract MeetupAssuranceTest is Test {
    MeetupAssurance public campaign;

    address payable public beneficiary = payable(makeAddr("beneficiary"));
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public carol = makeAddr("carol");
    address public stranger = makeAddr("stranger");

    uint256 public constant TARGET = 1 ether;
    uint256 public constant DURATION = 7 days;
    uint256 public deadline;

    event Pledged(address indexed pledger, uint256 amount);
    event Collected(address indexed beneficiary, uint256 amount);
    event RefundClaimed(address indexed pledger, uint256 amount);

    function setUp() public {
        vm.warp(1_000_000);
        deadline = block.timestamp + DURATION;

        campaign = new MeetupAssurance(TARGET, deadline, beneficiary);

        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(carol, 10 ether);
        vm.deal(stranger, 10 ether);
    }

    // -------------------------------------------------------------------------
    // Constructor Validation Tests
    // -------------------------------------------------------------------------

    function test_RevertWhen_ConstructorZeroTarget() public {
        vm.expectRevert(MeetupAssurance.TargetMustBeGreaterThanZero.selector);
        new MeetupAssurance(0, deadline, beneficiary);
    }

    function test_RevertWhen_ConstructorPastDeadline() public {
        vm.expectRevert(MeetupAssurance.DeadlineMustBeInFuture.selector);
        new MeetupAssurance(TARGET, block.timestamp, beneficiary);
    }

    function test_RevertWhen_ConstructorZeroBeneficiary() public {
        vm.expectRevert(MeetupAssurance.BeneficiaryCannotBeZeroAddress.selector);
        new MeetupAssurance(TARGET, deadline, payable(address(0)));
    }

    // -------------------------------------------------------------------------
    // Test 1: Successful pledge
    // -------------------------------------------------------------------------

    function test_SuccessfulPledge() public {
        uint256 pledgeAmount = 0.5 ether;

        vm.startPrank(alice);
        vm.expectEmit(true, false, false, true);
        emit Pledged(alice, pledgeAmount);

        campaign.pledge{ value: pledgeAmount }();
        vm.stopPrank();

        assertEq(campaign.pledges(alice), pledgeAmount);
        assertEq(campaign.originalPledges(alice), pledgeAmount);
        assertEq(campaign.totalPledged(), pledgeAmount);
        assertEq(address(campaign).balance, pledgeAmount);
        assertEq(campaign.getPledgerCount(), 1);
        assertEq(campaign.getParticipantContribution(alice), pledgeAmount);
        assertEq(campaign.getRemainingAmountNeeded(), TARGET - pledgeAmount);
    }

    // -------------------------------------------------------------------------
    // Test 2: Multiple pledgers
    // -------------------------------------------------------------------------

    function test_MultiplePledgers() public {
        vm.prank(alice);
        campaign.pledge{ value: 0.3 ether }();

        vm.prank(bob);
        campaign.pledge{ value: 0.4 ether }();

        vm.prank(alice);
        campaign.pledge{ value: 0.2 ether }(); // Alice pledges a second time

        vm.prank(carol);
        campaign.pledge{ value: 0.5 ether }();

        assertEq(campaign.pledges(alice), 0.5 ether);
        assertEq(campaign.originalPledges(alice), 0.5 ether);
        assertEq(campaign.pledges(bob), 0.4 ether);
        assertEq(campaign.pledges(carol), 0.5 ether);
        assertEq(campaign.totalPledged(), 1.4 ether);
        assertEq(campaign.getPledgerCount(), 3);
        assertEq(address(campaign).balance, 1.4 ether);
    }

    // -------------------------------------------------------------------------
    // Test 3: Zero pledge rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_ZeroPledge() public {
        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.ZeroValuePledge.selector);
        campaign.pledge{ value: 0 }();
    }

    // -------------------------------------------------------------------------
    // Test 4: Pledge after deadline rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_PledgeAfterDeadline() public {
        vm.warp(deadline); // Boundary: block.timestamp == deadline

        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.CampaignEnded.selector);
        campaign.pledge{ value: 0.5 ether }();

        vm.warp(deadline + 1 days);
        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.CampaignEnded.selector);
        campaign.pledge{ value: 0.5 ether }();
    }

    // -------------------------------------------------------------------------
    // Test 5: Successful campaign collection
    // -------------------------------------------------------------------------

    function test_SuccessfulCampaignCollection() public {
        vm.prank(alice);
        campaign.pledge{ value: 0.6 ether }();

        vm.prank(bob);
        campaign.pledge{ value: 0.5 ether }(); // Total = 1.1 ether >= TARGET (1 ether)

        // Advance past deadline
        vm.warp(deadline + 1);

        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.SUCCESS));
        assertTrue(campaign.isSuccessful());

        uint256 beneficiaryBalanceBefore = beneficiary.balance;

        vm.expectEmit(true, false, false, true);
        emit Collected(beneficiary, 1.1 ether);

        vm.prank(beneficiary);
        campaign.collect();

        assertEq(beneficiary.balance, beneficiaryBalanceBefore + 1.1 ether);
        assertEq(address(campaign).balance, 0);
        assertTrue(campaign.collected());
        assertEq(
            uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.COMPLETED)
        );
    }

    // -------------------------------------------------------------------------
    // Test 6: Collection before deadline rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_CollectionBeforeDeadline() public {
        vm.prank(alice);
        campaign.pledge{ value: TARGET }();

        // Target reached, but deadline has not passed
        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.FUNDING));

        vm.prank(beneficiary);
        vm.expectRevert(MeetupAssurance.CampaignStillActive.selector);
        campaign.collect();
    }

    // -------------------------------------------------------------------------
    // Test 7: Collection below target rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_CollectionBelowTarget() public {
        vm.prank(alice);
        campaign.pledge{ value: 0.8 ether }(); // Less than 1 ether target

        vm.warp(deadline + 1);

        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.FAILED));

        vm.prank(beneficiary);
        vm.expectRevert(MeetupAssurance.TargetNotReached.selector);
        campaign.collect();
    }

    // -------------------------------------------------------------------------
    // Test 8: Collection restricted to beneficiary
    // -------------------------------------------------------------------------

    function test_RevertWhen_CollectionRestrictedToBeneficiary() public {
        vm.prank(alice);
        campaign.pledge{ value: TARGET }();

        vm.warp(deadline + 1);

        vm.prank(stranger);
        vm.expectRevert(MeetupAssurance.OnlyBeneficiary.selector);
        campaign.collect();
    }

    // -------------------------------------------------------------------------
    // Test 9: Duplicate collection rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_DuplicateCollection() public {
        vm.prank(alice);
        campaign.pledge{ value: TARGET }();

        vm.warp(deadline + 1);

        vm.prank(beneficiary);
        campaign.collect();

        // Attempting to collect again
        vm.prank(beneficiary);
        vm.expectRevert(MeetupAssurance.AlreadyCollected.selector);
        campaign.collect();
    }

    // -------------------------------------------------------------------------
    // Test 10: Failed campaign refund
    // -------------------------------------------------------------------------

    function test_FailedCampaignRefund() public {
        uint256 alicePledge = 0.4 ether;
        vm.prank(alice);
        campaign.pledge{ value: alicePledge }();

        vm.warp(deadline + 1);

        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.FAILED));

        uint256 balanceBefore = alice.balance;

        vm.expectEmit(true, false, false, true);
        emit RefundClaimed(alice, alicePledge);

        vm.prank(alice);
        campaign.claimRefund();

        assertEq(alice.balance, balanceBefore + alicePledge);
        assertEq(campaign.pledges(alice), 0);
        assertTrue(campaign.refundClaimed(alice));
        assertEq(address(campaign).balance, 0);
    }

    // -------------------------------------------------------------------------
    // Test 11: Multiple independent refunds
    // -------------------------------------------------------------------------

    function test_MultipleIndependentRefunds() public {
        vm.prank(alice);
        campaign.pledge{ value: 0.2 ether }();

        vm.prank(bob);
        campaign.pledge{ value: 0.3 ether }();

        vm.prank(carol);
        campaign.pledge{ value: 0.1 ether }();

        vm.warp(deadline + 1);

        // Bob claims first
        uint256 bobBefore = bob.balance;
        vm.prank(bob);
        campaign.claimRefund();
        assertEq(bob.balance, bobBefore + 0.3 ether);
        assertEq(campaign.pledges(bob), 0);

        // Carol claims next
        uint256 carolBefore = carol.balance;
        vm.prank(carol);
        campaign.claimRefund();
        assertEq(carol.balance, carolBefore + 0.1 ether);
        assertEq(campaign.pledges(carol), 0);

        // Alice claims last
        uint256 aliceBefore = alice.balance;
        vm.prank(alice);
        campaign.claimRefund();
        assertEq(alice.balance, aliceBefore + 0.2 ether);
        assertEq(campaign.pledges(alice), 0);

        assertEq(address(campaign).balance, 0);
    }

    // -------------------------------------------------------------------------
    // Test 12: Refund before deadline rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_RefundBeforeDeadline() public {
        vm.prank(alice);
        campaign.pledge{ value: 0.5 ether }();

        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.CampaignStillActive.selector);
        campaign.claimRefund();
    }

    // -------------------------------------------------------------------------
    // Test 13: Refund after success rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_RefundAfterSuccess() public {
        vm.prank(alice);
        campaign.pledge{ value: TARGET }();

        vm.warp(deadline + 1);

        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.CampaignSucceeded.selector);
        campaign.claimRefund();
    }

    // -------------------------------------------------------------------------
    // Test 14: Duplicate refund rejected
    // -------------------------------------------------------------------------

    function test_RevertWhen_DuplicateRefund() public {
        vm.prank(alice);
        campaign.pledge{ value: 0.5 ether }();

        vm.warp(deadline + 1);

        vm.prank(alice);
        campaign.claimRefund();

        // Second refund call
        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.NoRefundableContribution.selector);
        campaign.claimRefund();
    }

    // -------------------------------------------------------------------------
    // Test 15: Failed refund transfer reverts safely
    // -------------------------------------------------------------------------

    function test_RevertWhen_RefundTransferFails() public {
        RejectEtherPledger rejectingPledger = new RejectEtherPledger(campaign);
        vm.deal(address(rejectingPledger), 1 ether);

        rejectingPledger.doPledge{ value: 0.5 ether }();

        vm.warp(deadline + 1);

        // Claiming refund must revert because transfer fails
        vm.expectRevert(MeetupAssurance.TransferFailed.selector);
        rejectingPledger.doRefund();

        // State remains intact: contribution was not cleared since tx reverted
        assertEq(campaign.pledges(address(rejectingPledger)), 0.5 ether);
        assertEq(address(campaign).balance, 0.5 ether);
    }

    // -------------------------------------------------------------------------
    // Test 16: Reentrancy protection on refund and collect
    // -------------------------------------------------------------------------

    function test_ReentrancyProtectionOnRefund() public {
        MaliciousReentrantPledger attacker = new MaliciousReentrantPledger(campaign);
        vm.deal(address(attacker), 2 ether);

        // Also have Alice pledge
        vm.prank(alice);
        campaign.pledge{ value: 0.4 ether }();

        attacker.doPledge{ value: 0.2 ether }();

        vm.warp(deadline + 1);

        // Attacker attempts reentrancy during claimRefund()
        vm.expectRevert();
        attacker.doRefund();

        // Campaign balance remains intact
        assertEq(address(campaign).balance, 0.6 ether);
    }

    function test_ReentrancyProtectionOnCollect() public {
        MaliciousReentrantBeneficiary malBeneficiary = new MaliciousReentrantBeneficiary();
        MeetupAssurance testCampaign =
            new MeetupAssurance(TARGET, deadline, payable(address(malBeneficiary)));
        malBeneficiary.setCampaign(testCampaign);

        vm.prank(alice);
        testCampaign.pledge{ value: TARGET }();

        vm.warp(deadline + 1);

        // Malicious beneficiary attempts reentrant collection
        vm.expectRevert();
        malBeneficiary.doCollect();
    }

    // -------------------------------------------------------------------------
    // Test 17: Campaign terms remain unchanged (immutability)
    // -------------------------------------------------------------------------

    function test_CampaignTermsRemainUnchanged() public view {
        assertEq(campaign.target(), TARGET);
        assertEq(campaign.deadline(), deadline);
        assertEq(campaign.beneficiary(), beneficiary);
    }

    // -------------------------------------------------------------------------
    // Test 18: Exact target boundary (totalPledged == target)
    // -------------------------------------------------------------------------

    function test_ExactTargetBoundary() public {
        vm.prank(alice);
        campaign.pledge{ value: TARGET }();

        vm.warp(deadline + 1);

        // Campaign succeeded at exact boundary
        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.SUCCESS));
        assertTrue(campaign.isSuccessful());

        // Refund must revert
        vm.prank(alice);
        vm.expectRevert(MeetupAssurance.CampaignSucceeded.selector);
        campaign.claimRefund();

        // Beneficiary can collect
        vm.prank(beneficiary);
        campaign.collect();
        assertTrue(campaign.collected());
    }

    // -------------------------------------------------------------------------
    // Test 19: Below-target boundary (totalPledged == target - 1 wei)
    // -------------------------------------------------------------------------

    function test_BelowTargetBoundary() public {
        uint256 amount = TARGET - 1; // 1 wei short
        vm.prank(alice);
        campaign.pledge{ value: amount }();

        vm.warp(deadline + 1);

        // Campaign failed
        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.FAILED));
        assertFalse(campaign.isSuccessful());

        // Beneficiary collection must revert
        vm.prank(beneficiary);
        vm.expectRevert(MeetupAssurance.TargetNotReached.selector);
        campaign.collect();

        // Pledger can claim refund
        vm.prank(alice);
        campaign.claimRefund();
        assertEq(campaign.pledges(alice), 0);
    }

    // -------------------------------------------------------------------------
    // Direct Transfer & Fallback Rejection
    // -------------------------------------------------------------------------

    function test_RevertWhen_DirectEthTransferSent() public {
        vm.expectRevert(MeetupAssurance.DirectTransfersNotAllowed.selector);
        (bool success,) = address(campaign).call{ value: 1 ether }("");
        assertTrue(success); // vm.expectRevert intercepts the revert at the EVM call level
    }

    // -------------------------------------------------------------------------
    // Additional Views & Helpers Test
    // -------------------------------------------------------------------------

    function test_ViewsAndHelpers() public {
        assertEq(campaign.getTimeRemaining(), DURATION);

        vm.warp(deadline + 10);
        assertEq(campaign.getTimeRemaining(), 0);

        address[] memory pledgersList = campaign.getPledgers();
        assertEq(pledgersList.length, 0);
    }
}
