# Stepwell — Final Buildathon Submission Description

> **Project Name:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** *Everyone Chips In. The Promise Is Onchain.*  
> **Event:** Road to Devcon XI — Indore Chapter  
> **Repository:** [https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1)  

---

## 1. Project Overview & Problem Statement

Organizing grassroots Web3 events in student communities like Indore faces a classic coordination problem:

Community organizers (such as Meera hosting a workshop for 60 students) must pay an upfront venue deposit (e.g., 0.1 ETH) before attendance is certain. Meanwhile, community members hesitate to commit funds or RSVP without knowing whether enough peers will join to make the event viable. Informal commitments on messaging apps suffer from high dropouts, while sending funds to a personal UPI or wallet requires blind trust and leaves organizers personally covering deficits.

**Stepwell** solves this dilemma through **trustless onchain assurance crowdfunding**. Community members pool their funds in an immutable smart contract escrow: funds are only released if the meetup achieves its funding target. If turnout falls short, everyone gets their money back automatically.

---

## 2. How the Crowdfunding Campaign Works

Each Stepwell campaign is governed by an immutable smart contract (`MeetupAssurance.sol`) instantiated with three permanent parameters:
1. **Target Amount (`target`):** The exact ETH amount required to cover the event expenses (e.g., 0.1 ETH).
2. **Strict Deadline (`deadline`):** An immutable Unix timestamp after which pledging closes.
3. **Designated Beneficiary (`beneficiary`):** The verified organizer wallet authorized to receive funds.

During the active pledging window, contributors invoke `pledge()` to deposit ETH. All funds remain locked securely in the contract escrow.

---

## 3. What Happens When the Funding Target Succeeds

If total community pledges meet or exceed the target before the deadline expires (`totalPledged >= target`):
- The campaign state automatically shifts to **`CAMPAIGN SUCCESS`** (status `1`). Pledging permanently locks.
- Only the immutable **beneficiary address** can call `collect()` in a reentrancy-guarded transaction.
- The smart contract transfers 100% of the pledged funds (plus any unspent sponsor bonus pool) to the beneficiary.
- The campaign status advances to **`FUNDS COLLECTED`** (status `3`), and the venue deposit is secured without personal financial risk to the organizer.

---

## 4. What Happens When the Funding Target Fails

If total community pledges fall short of the target when the deadline arrives (`totalPledged < target`):
- The campaign state automatically transitions to **`CAMPAIGN FAILED`** (status `2`).
- Stepwell utilizes an **individual pull-refund pattern** via `claimRefund()`. Contributors independently withdraw their funds rather than relying on automated batch loops (which could run out of gas or cause Denial of Service).
- Every participant receives **100% of their pledged principal back**.

---

## 5. How the Optional Dominant Assurance Bonus Works

To overcome early-contributor hesitation, Stepwell implements **Dominant Assurance**:
- An organizer or ecosystem sponsor can fund an assurance bonus pool at any time before the deadline via `fundBonus()`.
- If the campaign fails, 100% of this bonus pool is distributed proportionally to pledgers on top of their full refund:
  $$\text{Bonus Share} = \frac{\text{Total Bonus} \times \text{User Pledge}}{\text{Total Pledged}}$$
- Contributors face **zero financial downside** to chip in early: if the event succeeds, they attend the meetup; if the event fails, they receive their principal plus a bonus reward.
- **Dust Protection:** To prevent ETH from becoming stranded due to integer division rounding, any remaining wei dust is automatically swept to the final claimant when `totalRefundedPledges == totalPledged`.

---

## 6. Technology Stack

- **Smart Contracts:** Solidity `0.8.24`, OpenZeppelin Contracts `v5.0` (`ReentrancyGuard`, custom errors).
- **Development & Testing:** Foundry (`forge`, `cast`, `anvil`) with comprehensive invariant and unit test coverage.
- **Frontend Architecture:** React 19, TypeScript, Vite, Wagmi `v3`, Viem `v2`, `@tanstack/react-query`.
- **Styling:** Custom bespoke Vanilla CSS design system with rich glassmorphism, responsive status badges, and zero third-party utility bloat.
- **Local Simulation:** Foundry Anvil (Chain ID `31337`) with live time-warping via `evm_increaseTime`.

---

## 7. Verified Test & Build Results

All automated QA checks have been executed and verified in the local workspace:
- **Foundry Test Suite:** **31 passed, 0 failed, 0 skipped** (25 in `MeetupAssuranceTest`, 6 in `DominantAssuranceTest`).
- **Solidity Formatting & Compilation:** `forge fmt --check` (0 diffs), `forge build` (0 compiler warnings/errors with 200 optimizer runs).
- **Frontend Code Quality:** `oxlint` passed with **0 errors and 0 warnings** across 22 source files.
- **Production Build:** `npm run build` (`tsc -b && vite build`) built cleanly into `frontend/dist/`.

---

## 8. Local Demo Setup & Prototype Scope

- **Demonstration Environment:** Stepwell is currently demonstrated on a local Foundry Anvil testnode (Chain ID `31337`) where judges can observe live MetaMask transactions, time-warp deadline evaluations, beneficiary payouts, and bonus refunds.
- **Prototype Scope & Limitations:** Stepwell is a buildathon MVP. It has not yet undergone formal external third-party security audits. 
- **Public Testnet Status:** Deployment to Ethereum Sepolia is deliberately marked **NOT DEPLOYED** / **ON HOLD** pending independent verification of organizer Meera's public wallet ownership. Ethereum Mainnet is strictly excluded.
