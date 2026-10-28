// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MeetupAssurance
 * @notice Assurance contract for "Road to Devcon XI — The Meetup That Only Happens If We All Chip In".
 *         Implements trustless, community-powered crowdfunding with immutable terms.
 *         Outcomes:
 *         - SUCCESS: If total pledges >= target by the deadline, only the designated beneficiary
 *                    can collect the campaign funds (once).
 *         - FAILURE: If total pledges < target after the deadline, each participant can
 *                    independently claim their own refund (plus proportional bonus if funded).
 *                    No looping, no beneficiary permission needed.
 */
contract MeetupAssurance is ReentrancyGuard {
    // -------------------------------------------------------------------------
    // Types & Enums
    // -------------------------------------------------------------------------

    enum CampaignStatus {
        FUNDING, // 0: Campaign active, pledging open until deadline
        SUCCESS, // 1: Deadline passed, target reached, awaiting beneficiary collection
        FAILED, // 2: Deadline passed, target not reached, refunds available
        COMPLETED // 3: Funds collected by beneficiary after success
    }

    // -------------------------------------------------------------------------
    // Immutable Campaign Terms
    // -------------------------------------------------------------------------

    /// @notice Minimum ETH (in wei) required for campaign success.
    uint256 public immutable target;

    /// @notice Unix timestamp after which pledging is no longer permitted.
    uint256 public immutable deadline;

    /// @notice Address entitled to collect campaign funds if target is met.
    address payable public immutable beneficiary;

    // -------------------------------------------------------------------------
    // Mutable Campaign State
    // -------------------------------------------------------------------------

    /// @notice Total ETH pledged by participants (excludes bonus pool).
    uint256 public totalPledged;

    /// @notice Whether the beneficiary has collected the campaign funds.
    bool public collected;

    /// @notice Active refundable pledge balance per participant.
    mapping(address => uint256) public pledges;

    /// @notice Total cumulative pledge per participant (preserved even after refund).
    mapping(address => uint256) public originalPledges;

    /// @notice Whether a participant has claimed their refund.
    mapping(address => bool) public refundClaimed;

    /// @notice List of unique pledgers.
    address[] private _pledgers;
    mapping(address => bool) private _isPledger;

    // -------------------------------------------------------------------------
    // Stretch Goal: Dominant Assurance State
    // -------------------------------------------------------------------------

    /// @notice Bonus pool funded before deadline to incentivize participation.
    uint256 public totalBonus;

    /// @notice Cumulative bonus claimed by refund recipients.
    uint256 public totalBonusClaimed;

    /// @notice Cumulative pledges that have been refunded.
    uint256 public totalRefundedPledges;

    /// @notice Primary bonus funder address.
    address public bonusFunder;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event Pledged(address indexed pledger, uint256 amount);
    event Collected(address indexed beneficiary, uint256 amount);
    event RefundClaimed(address indexed pledger, uint256 amount);
    event BonusFunded(address indexed funder, uint256 amount);
    event BonusClaimed(address indexed pledger, uint256 amount);

    // -------------------------------------------------------------------------
    // Custom Errors
    // -------------------------------------------------------------------------

    error TargetMustBeGreaterThanZero();
    error DeadlineMustBeInFuture();
    error BeneficiaryCannotBeZeroAddress();
    error ZeroValuePledge();
    error CampaignEnded();
    error CampaignStillActive();
    error TargetNotReached();
    error CampaignSucceeded();
    error AlreadyCollected();
    error OnlyBeneficiary();
    error NoRefundableContribution();
    error TransferFailed();
    error DirectTransfersNotAllowed();
    error ZeroValueBonus();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /**
     * @notice Initializes the MeetupAssurance campaign with immutable parameters.
     * @param _target Minimum ETH (in wei) required for success.
     * @param _deadline Unix timestamp after which pledging closes.
     * @param _beneficiary Address authorized to collect funds upon success.
     */
    constructor(uint256 _target, uint256 _deadline, address payable _beneficiary) {
        if (_target == 0) revert TargetMustBeGreaterThanZero();
        if (_deadline <= block.timestamp) revert DeadlineMustBeInFuture();
        if (_beneficiary == address(0)) revert BeneficiaryCannotBeZeroAddress();

        target = _target;
        deadline = _deadline;
        beneficiary = _beneficiary;
    }

    // -------------------------------------------------------------------------
    // External Functions
    // -------------------------------------------------------------------------

    /**
     * @notice Pledge ETH toward the campaign target before the deadline.
     *         Requires non-zero ETH. The exact msg.value received is recorded.
     */
    function pledge() external payable nonReentrant {
        if (block.timestamp >= deadline) revert CampaignEnded();
        if (msg.value == 0) revert ZeroValuePledge();

        if (!_isPledger[msg.sender]) {
            _isPledger[msg.sender] = true;
            _pledgers.push(msg.sender);
        }

        pledges[msg.sender] += msg.value;
        originalPledges[msg.sender] += msg.value;
        totalPledged += msg.value;

        emit Pledged(msg.sender, msg.value);
    }

    /**
     * @notice Fund the dominant-assurance bonus pool before the deadline.
     *         Tracked separately from campaign pledges and does not count toward target.
     */
    function fundBonus() external payable nonReentrant {
        if (block.timestamp >= deadline) revert CampaignEnded();
        if (msg.value == 0) revert ZeroValueBonus();

        totalBonus += msg.value;
        if (bonusFunder == address(0)) {
            bonusFunder = msg.sender;
        }

        emit BonusFunded(msg.sender, msg.value);
    }

    /**
     * @notice Collect campaign funds after a successful campaign.
     *         Can only be called by the beneficiary, after the deadline, if target is met.
     *         Can only be collected once.
     */
    function collect() external nonReentrant {
        if (msg.sender != beneficiary) revert OnlyBeneficiary();
        if (block.timestamp < deadline) revert CampaignStillActive();
        if (totalPledged < target) revert TargetNotReached();
        if (collected) revert AlreadyCollected();

        // Follow checks-effects-interactions
        collected = true;

        // Beneficiary collects the total pledged funds plus any remaining bonus pool
        uint256 payout = totalPledged + (totalBonus - totalBonusClaimed);

        emit Collected(beneficiary, payout);

        (bool success,) = beneficiary.call{ value: payout }("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Independently claim a refund (and proportional bonus share) if campaign fails.
     *         Can be called after deadline if target was not met.
     *         Never loops over participants.
     */
    function claimRefund() external nonReentrant {
        if (block.timestamp < deadline) revert CampaignStillActive();
        if (totalPledged >= target) revert CampaignSucceeded();

        uint256 refundAmount = pledges[msg.sender];
        if (refundAmount == 0) revert NoRefundableContribution();

        // Checks-Effects-Interactions: clear state before transfer
        pledges[msg.sender] = 0;
        refundClaimed[msg.sender] = true;
        totalRefundedPledges += refundAmount;

        // Dominant assurance bonus calculation (if bonus was funded)
        uint256 bonusShare = 0;
        if (totalBonus > 0 && totalPledged > 0) {
            uint256 origPledge = originalPledges[msg.sender];
            bonusShare = (totalBonus * origPledge) / totalPledged;

            // Rounding policy: If this is the final refunded participant, award any remainder dust
            if (totalRefundedPledges == totalPledged) {
                uint256 remainingBonus = totalBonus - totalBonusClaimed;
                if (remainingBonus > bonusShare) {
                    bonusShare = remainingBonus;
                }
            }
            totalBonusClaimed += bonusShare;
        }

        uint256 totalPayout = refundAmount + bonusShare;

        emit RefundClaimed(msg.sender, refundAmount);
        if (bonusShare > 0) {
            emit BonusClaimed(msg.sender, bonusShare);
        }

        (bool success,) = payable(msg.sender).call{ value: totalPayout }("");
        if (!success) revert TransferFailed();
    }

    // -------------------------------------------------------------------------
    // View Functions
    // -------------------------------------------------------------------------

    /**
     * @notice Current status of the campaign.
     *         FUNDING: deadline not passed
     *         SUCCESS: deadline passed, target met, not yet collected
     *         FAILED: deadline passed, target not met
     *         COMPLETED: beneficiary has collected funds
     */
    function getCampaignStatus() public view returns (CampaignStatus) {
        if (collected) {
            return CampaignStatus.COMPLETED;
        }
        if (block.timestamp < deadline) {
            return CampaignStatus.FUNDING;
        }
        if (totalPledged >= target) {
            return CampaignStatus.SUCCESS;
        }
        return CampaignStatus.FAILED;
    }

    /**
     * @notice Whether the campaign has met its funding target.
     */
    function isSuccessful() external view returns (bool) {
        return totalPledged >= target;
    }

    /**
     * @notice Amount of ETH (in wei) still required to hit target. Returns 0 if met.
     */
    function getRemainingAmountNeeded() external view returns (uint256) {
        if (totalPledged >= target) {
            return 0;
        }
        return target - totalPledged;
    }

    /**
     * @notice Seconds remaining until the campaign deadline. Returns 0 once expired.
     */
    function getTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        return deadline - block.timestamp;
    }

    /**
     * @notice Returns the active refundable pledge of an address.
     */
    function getParticipantContribution(address participant) external view returns (uint256) {
        return pledges[participant];
    }

    /**
     * @notice Returns the total count of unique pledgers.
     */
    function getPledgerCount() external view returns (uint256) {
        return _pledgers.length;
    }

    /**
     * @notice Returns all unique pledger addresses.
     */
    function getPledgers() external view returns (address[] memory) {
        return _pledgers;
    }

    /**
     * @notice Estimates the bonus share for a participant if the campaign fails.
     */
    function calculateBonusShare(address participant) external view returns (uint256) {
        if (totalBonus == 0 || totalPledged == 0 || totalPledged >= target) {
            return 0;
        }
        uint256 orig = originalPledges[participant];
        if (orig == 0 || refundClaimed[participant]) {
            return 0;
        }
        return (totalBonus * orig) / totalPledged;
    }

    // -------------------------------------------------------------------------
    // Fallback & Receive
    // -------------------------------------------------------------------------

    /// @notice Direct transfers are rejected to ensure all contributions are accounted via pledge().
    receive() external payable {
        revert DirectTransfersNotAllowed();
    }

    /// @notice Fallback reverts on any unexpected call.
    fallback() external payable {
        revert DirectTransfersNotAllowed();
    }
}
