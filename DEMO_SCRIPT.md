# Stepwell — 2–3 Minute Demo Video Script

> **Event:** Road to Devcon XI — Indore Chapter  
> **Project:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** Everyone Chips In. The Promise Is Onchain.  
> **Demo Environment:** Local Anvil Node (Chain ID `31337`)  
> **Live Deployment Status:** Ethereum Sepolia (Chain ID `11155111`) remains **BLOCKED** pending independent organizer address verification.

---

## Demo Overview & Narration Strategy

This video demonstrates how **Stepwell** solves the classic Web3 community coordination failure in Indore using an all-or-nothing assurance contract with an optional Dominant Assurance bonus mechanism.

- **Target Duration:** 2 minutes 30 seconds (maximum 3 minutes).
- **Format:** Split-screen or alternating view between the **Stepwell React Dashboard** (`http://localhost:5173`) and the **Terminal / MetaMask**.
- **Important Note for Narrator:** Always clearly state that this demonstration is performed on a **local Anvil simulation (Chain ID 31337)**, while production deployment to Ethereum Sepolia is safely paused awaiting organizer wallet confirmation.

---

## Storyboard & Narration Timeline

```
========================================================================================================
TIMESTAMP     SCREEN / VISUAL ACTION                       AUDIO / NARRATION SCRIPT
========================================================================================================
```

### [00:00 – 00:25] Introduction & The Coordination Problem
- **Visual:** Open browser on the Stepwell dashboard (`http://localhost:5173`). Highlight the Hero Banner: *"Road to Devcon XI — The Meetup That Only Happens If We All Chip In"*.
- **Narration:**
  > *"Hi everyone, this is Stepwell for Road to Devcon XI Indore Chapter. Meetup organizers like Meera face a recurring dilemma: booking a quality venue requires an upfront deposit of 0.1 ETH, but community members hesitate to RSVP or send funds without knowing if enough people will show up. Web2 RSVPs have high dropouts, and sending money to a personal wallet requires blind trust.*
  > 
  > *Stepwell solves this with trustless onchain assurance. Everyone chips in, but funds are only released if the target is met. If not, everyone gets their money back automatically."*

---

### [00:25 – 00:55] Architecture & Active Campaign (Scenario A: Part 1)
- **Visual:** Show the Status Badge displaying `FUNDING ACTIVE`. Point out the Progress Card: Target `0.1000 ETH`, Remaining Needed `0.1000 ETH`, Countdown Timer ticking down, and Beneficiary wallet address (`0x7099...`).
- **Narration:**
  > *"Here is the live Stepwell dashboard running on our local Anvil test environment. The smart contract has three immutable rules set at construction: a funding target of 0.1 ETH, a strict deadline, and a designated beneficiary.*
  > 
  > *Notice the campaign status: `FUNDING ACTIVE`. Now, let's watch two participants pledge. Backer 1 connects in MetaMask and pledges 0.06 ETH. Next, Backer 2 connects and pledges 0.05 ETH. Our total pledged reaches 0.11 ETH, crossing our 0.1 ETH goal with two verified contributors."*

---

### [00:55 – 01:25] Deadline Expiry & Beneficiary Payout (Scenario A: Part 2)
- **Visual:** In terminal, fast-forward local time past deadline (`cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545` & `cast rpc evm_mine --rpc-url http://127.0.0.1:8545`). Refresh browser (`F5`): Status Badge immediately switches from `FUNDING ACTIVE` to `CAMPAIGN SUCCESS`. Connect Account 1 (Beneficiary). Click *"Collect 0.11 ETH as Beneficiary"*. Transaction confirms, status updates to `FUNDS COLLECTED`.
- **Narration:**
  > *"When the deadline arrives, the contract evaluates the outcome. Because pledges reached 0.11 ETH, the status switches to `CAMPAIGN SUCCESS`. Pledging is permanently locked.*
  > 
  > *Only the immutable beneficiary account can collect the funds. Non-organizer accounts see a restricted notice. When Meera connects her wallet and clicks 'Collect as Beneficiary', the full 0.11 ETH transfers directly to her wallet in a single reentrancy-guarded transaction. The status updates to `FUNDS COLLECTED`, and the venue deposit is secured!"*

---

### [01:25 – 02:00] Scenario B: Failed Campaign & Dominant Assurance Bonus
- **Visual:** Switch contract address in the UI using the header gear icon to the Scenario B deployment (Target: 1.0 ETH). In `DominantAssuranceCard`, click *"+ Organizer: Fund the Bonus Pool"*, enter `0.02` ETH, and click *Deposit Bonus* (or run `cast send <ScenarioB> "fundBonus()" --value 0.02ether`). Connect Alice (`0x3C44...`) and pledge `0.0400 ETH`. In terminal, fast-forward time past deadline (`cast rpc evm_increaseTime 2100` & `cast rpc evm_mine`). Refresh browser: status updates to `CAMPAIGN FAILED`.
- **Narration:**
  > *"Now, what happens if community turnout falls short? Let's switch to Scenario B: an ambitious 1.0 ETH target where an organizer deposited a 0.02 ETH Dominant Assurance bonus to incentivize early contributors.*
  > 
  > *A backer pledges 0.04 ETH, but no one else joins before the deadline expires. Once the deadline passes, the contract shifts status to `CAMPAIGN FAILED`. Pledges never get stuck in limbo, and no central organizer permission is needed."*

---

### [02:00 – 02:30] Individual Pull Refunds & Dust Distribution
- **Visual:** On the Refund Card, show the breakdown: *Your Original Pledge: 0.0400 ETH*, *Dominant Assurance Bonus: +0.0200 ETH*, *Total Available to Claim: 0.0600 ETH*. Click *"Claim 0.0600 ETH Refund"*. Transaction confirms, and refund card displays *"Refund Successfully Claimed!"*.
- **Narration:**
  > *"In a failed campaign, Stepwell enforces an individual pull-pattern refund. Instead of looping over contributors—which could run out of gas or cause Denial of Service—each participant independently withdraws their own funds.*
  > 
  > *Even better, thanks to Dominant Assurance, the backer doesn't just get their 0.04 ETH back; they also receive their proportional share of the bonus pool. In this case, 100% of the bonus, totaling 0.06 ETH returned! Furthermore, our contract logic awards any integer division rounding dust to the final claimant, ensuring zero wei is ever trapped onchain."*

---

### [02:30 – 02:50] Security Invariants & Submission Wrap-Up
- **Visual:** Display terminal showing `forge test -vv` with **31 passing tests**, and the clean frontend `oxlint` and production build outputs. Highlight the transparency modal explaining CEI, ReentrancyGuard, and immutable terms.
- **Narration:**
  > *"Under the hood, Stepwell is thoroughly tested with 31 Foundry tests covering state transitions, reentrancy resistance, dust handling, and invariant bounds. The frontend is built in React 19, Vite, and Wagmi.*
  > 
  > *For safety, our Sepolia broadcast is deliberately paused until organizer wallet ownership is independently verified through our cryptographic challenge checklist.*
  > 
  > *With Stepwell, organizers never risk personal funds, and participants never risk losing their ETH. Everyone chips in. The promise is onchain. Thank you!"*

---

## Key Terminology & UI Labels Cheat-Sheet

| Event / State | UI Status Badge | Smart Contract Value | Screen Action |
|---|---|---|---|
| Pledging active | `FUNDING ACTIVE` | `CampaignStatus.FUNDING` (0) | Participants enter ETH and click Pledge |
| Target reached after deadline | `CAMPAIGN SUCCESS` | `CampaignStatus.SUCCESS` (1) | Beneficiary clicks "Collect Funds" |
| Target missed after deadline | `CAMPAIGN FAILED` | `CampaignStatus.FAILED` (2) | Contributor clicks "Claim Refund" |
| Beneficiary collected payout | `FUNDS COLLECTED` | `CampaignStatus.COMPLETED` (3) | Success badge displayed; venue confirmed |

---

## Narration Safety & Accuracy Checklist

- [x] **No False Deployment Claims:** Emphasize that live demo steps use **local Anvil simulation (Chain ID 31337)**. Sepolia deployment is pending organizer confirmation.
- [x] **Exact Function Names:** Refer to `pledge()`, `fundBonus()`, `collect()`, and `claimRefund()`.
- [x] **Accurate Math:**
  - Scenario A: 0.06 ETH + 0.05 ETH = 0.11 ETH collected (target: 0.1 ETH).
  - Scenario B: 0.04 ETH pledge + 0.02 ETH bonus pool = 0.06 ETH refunded (target: 1.0 ETH).
- [x] **Dust Policy:** Accurately explains that rounding dust is credited to the final claimant when `totalRefundedPledges == totalPledged`.
- [x] **Test Counts:** Exactly 31 tests passed across `MeetupAssuranceTest` (25) and `DominantAssuranceTest` (6).
