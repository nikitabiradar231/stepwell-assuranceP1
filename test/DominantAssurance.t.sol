// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Test } from "forge-std/Test.sol";
import { MeetupAssurance } from "../contracts/MeetupAssurance.sol";

contract DominantAssuranceTest is Test {
    MeetupAssurance public campaign;

    address payable public beneficiary = payable(makeAddr("beneficiary"));
    address public meera = makeAddr("meera"); // Organizer / bonus funder
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public carol = makeAddr("carol");

    uint256 public constant TARGET = 2 ether;
    uint256 public constant DURATION = 5 days;
    uint256 public deadline;

    event BonusFunded(address indexed funder, uint256 amount);
    event BonusClaimed(address indexed pledger, uint256 amount);

    function setUp() public {
        vm.warp(2_000_000);
        deadline = block.timestamp + DURATION;

        campaign = new MeetupAssurance(TARGET, deadline, beneficiary);

        vm.deal(meera, 10 ether);
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(carol, 10 ether);
    }

    // -------------------------------------------------------------------------
    // Test 20.1: Bonus Funding Before Deadline
    // -------------------------------------------------------------------------

    function test_FundBonus() public {
        uint256 bonusAmount = 0.2 ether;

        vm.startPrank(meera);
        vm.expectEmit(true, false, false, true);
        emit BonusFunded(meera, bonusAmount);

        campaign.fundBonus{ value: bonusAmount }();
        vm.stopPrank();

        assertEq(campaign.totalBonus(), bonusAmount);
        assertEq(campaign.bonusFunder(), meera);
        // Bonus must not count toward campaign totalPledged
        assertEq(campaign.totalPledged(), 0);
        assertEq(campaign.getRemainingAmountNeeded(), TARGET);
        assertEq(address(campaign).balance, bonusAmount);
    }

    // -------------------------------------------------------------------------
    // Test 20.2: Bonus Funding Rejections
    // -------------------------------------------------------------------------

    function test_RevertWhen_ZeroBonusFunding() public {
        vm.prank(meera);
        vm.expectRevert(MeetupAssurance.ZeroValueBonus.selector);
        campaign.fundBonus{ value: 0 }();
    }

    function test_RevertWhen_BonusFundedAfterDeadline() public {
        vm.warp(deadline + 1);
        vm.prank(meera);
        vm.expectRevert(MeetupAssurance.CampaignEnded.selector);
        campaign.fundBonus{ value: 0.1 ether }();
    }

    // -------------------------------------------------------------------------
    // Test 20.3: Proportional Bonus Distribution on Failed Campaign
    // -------------------------------------------------------------------------

    function test_ProportionalBonusDistributionOnFailure() public {
        uint256 bonusPool = 0.3 ether;
        vm.prank(meera);
        campaign.fundBonus{ value: bonusPool }();

        // Alice pledges 0.4 ether (40% of 1 ether total)
        vm.prank(alice);
        campaign.pledge{ value: 0.4 ether }();

        // Bob pledges 0.6 ether (60% of 1 ether total)
        vm.prank(bob);
        campaign.pledge{ value: 0.6 ether }();

        // Total pledged = 1 ether, target = 2 ether -> Campaign Fails
        vm.warp(deadline + 1);
        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.FAILED));

        // Alice claims refund: expected 0.4 ETH pledge + (0.3 * 0.4 / 1.0) = 0.12 ETH bonus = 0.52 ETH
        uint256 aliceBefore = alice.balance;
        vm.expectEmit(true, false, false, true);
        emit BonusClaimed(alice, 0.12 ether);

        vm.prank(alice);
        campaign.claimRefund();
        assertEq(alice.balance, aliceBefore + 0.52 ether);

        // Bob claims refund: expected 0.6 ETH pledge + 0.18 ETH bonus = 0.78 ETH
        uint256 bobBefore = bob.balance;
        vm.expectEmit(true, false, false, true);
        emit BonusClaimed(bob, 0.18 ether);

        vm.prank(bob);
        campaign.claimRefund();
        assertEq(bob.balance, bobBefore + 0.78 ether);

        // Entire contract balance should be 0
        assertEq(address(campaign).balance, 0);
        assertEq(campaign.totalBonusClaimed(), bonusPool);
    }

    // -------------------------------------------------------------------------
    // Test 20.4: Rounding Dust Preservation & Exact Payout
    // -------------------------------------------------------------------------

    function test_RoundingDustAllocationToFinalClaimant() public {
        // Bonus pool = 1 wei
        // 3 participants each pledge 1 wei (total 3 wei)
        // 1 * 1 / 3 = 0 for the first two; final claimant gets remainder 1 wei dust
        uint256 bonusPool = 100 wei;
        vm.prank(meera);
        campaign.fundBonus{ value: bonusPool }();

        vm.prank(alice);
        campaign.pledge{ value: 30 wei }();

        vm.prank(bob);
        campaign.pledge{ value: 30 wei }();

        vm.prank(carol);
        campaign.pledge{ value: 40 wei }();

        vm.warp(deadline + 1);

        uint256 aliceBefore = alice.balance;
        vm.prank(alice);
        campaign.claimRefund();
        // Alice bonus: 100 * 30 / 100 = 30 wei
        assertEq(alice.balance, aliceBefore + 60 wei);

        uint256 bobBefore = bob.balance;
        vm.prank(bob);
        campaign.claimRefund();
        // Bob bonus: 100 * 30 / 100 = 30 wei
        assertEq(bob.balance, bobBefore + 60 wei);

        uint256 carolBefore = carol.balance;
        vm.prank(carol);
        campaign.claimRefund();
        // Carol bonus: 100 * 40 / 100 = 40 wei (plus any remaining dust if existed)
        assertEq(carol.balance, carolBefore + 80 wei);

        // Zero stranded dust
        assertEq(address(campaign).balance, 0);
        assertEq(campaign.totalBonusClaimed(), bonusPool);
    }

    // -------------------------------------------------------------------------
    // Test 20.5: Successful Campaign Collects Pledges + Bonus Pool
    // -------------------------------------------------------------------------

    function test_SuccessfulCampaignCollectionWithBonus() public {
        uint256 bonusPool = 0.5 ether;
        vm.prank(meera);
        campaign.fundBonus{ value: bonusPool }();

        // Reach target (2 ether)
        vm.prank(alice);
        campaign.pledge{ value: 1.2 ether }();

        vm.prank(bob);
        campaign.pledge{ value: 0.8 ether }();

        vm.warp(deadline + 1);

        assertEq(uint8(campaign.getCampaignStatus()), uint8(MeetupAssurance.CampaignStatus.SUCCESS));

        uint256 benBefore = beneficiary.balance;
        vm.prank(beneficiary);
        campaign.collect();

        // Beneficiary collects both pledges and bonus
        assertEq(beneficiary.balance, benBefore + 2.5 ether);
        assertEq(address(campaign).balance, 0);
    }
}
