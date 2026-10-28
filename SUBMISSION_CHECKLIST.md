# Stepwell — Buildathon Submission Checklist

> **Event:** Road to Devcon XI — Indore Chapter  
> **Project:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** Everyone Chips In. The Promise Is Onchain.  
> **Repository:** [https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1)  
> **Workspace Path:** `C:\Users\nikita\OneDrive\Desktop\d1`  

---

## 1. Submission Status Summary

| Item | Status | Verification & Evidence |
|---|---|---|
| **GitHub Repository** | ✅ **VERIFIED** | [https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1) |
| **Problem & Solution Overview** | ✅ **VERIFIED** | Documented in `README.md` (Indore venue deposit coordination dilemma) |
| **Technology Stack** | ✅ **VERIFIED** | Solidity 0.8.24, OpenZeppelin v5.0, Foundry, React 19, TypeScript, Vite, Wagmi v3, Viem v2 |
| **Smart Contract Code** | ✅ **VERIFIED** | `contracts/MeetupAssurance.sol` (All-or-nothing assurance + Dominant Assurance bonus) |
| **Contract Invariants & Security** | ✅ **VERIFIED** | Checks-Effects-Interactions, OpenZeppelin `ReentrancyGuard`, pull-pattern refunds, dust handling |
| **Foundry Test Suite** | ✅ **VERIFIED** | **31/31 passed** (25 in `MeetupAssuranceTest`, 6 in `DominantAssuranceTest`) |
| **Frontend Codebase** | ✅ **VERIFIED** | `oxlint` 0 warnings/0 errors; `tsc -b && vite build` built clean production bundle in `dist/` |
| **Local Anvil Verification** | ✅ **VERIFIED** | Scenarios A & B executed and verified on Anvil (Chain ID `31337`) with actual state changes |
| **Demo Spoken Script** | ✅ **VERIFIED** | `FINAL_RECORDING_SCRIPT.md` (Verbatim 2:30 narration paired with UI actions & roles) |
| **Demo Runbook & Walkthrough** | ✅ **VERIFIED** | `FINAL_DEMO_RUNBOOK.md` (Beginner-friendly step-by-step setup & scenario execution) |
| **Demo Troubleshooting** | ✅ **VERIFIED** | `DEMO_TROUBLESHOOTING.md` (MetaMask setup, contract switcher, error fixes) |
| **Interactive Demo Deployer** | ✅ **VERIFIED** | `scratch/deploy_interactive_scenarios.ps1` (Deploys fresh active contracts for live recording) |
| **Final Recording Checklist** | ✅ **VERIFIED** | `FINAL_RECORDING_CHECKLIST.md` (Master pre-recording, walkthrough, video checks & tracker) |
| **Demo Video Recording (< 3 min MP4)** | ⏳ **PENDING** | Script and interactive starting states ready; screen recording pending user execution |
| **Demo Video URL** | ⏳ **PENDING** | Awaiting user recording and video upload |
| **Public Sepolia Deployment** | 🛑 **NOT DEPLOYED** | Deployment is deliberately on hold pending independent organizer wallet verification |
| **Sepolia Explorer Link** | ⏳ **PENDING** | Awaiting authorized broadcast to Ethereum Sepolia |
| **Submission Portal Status** | ⏳ **PENDING** | Awaiting video link and organizer address confirmation before final submission |
| **Secret & Credential Isolation** | ✅ **VERIFIED** | `.env` is ignored by Git; zero private keys or secrets tracked |
| **Mainnet Safety** | ✅ **VERIFIED** | Ethereum Mainnet is strictly excluded |

---

## 2. Smart Contract Architecture & Invariants

The contract state machine enforces two distinct outcomes:
1. **Pledging Phase:** Participants contribute ETH toward the `0.1 ETH` target before the deadline.
2. **Outcome A — Success (`totalPledged >= target`):** After the deadline, the immutable beneficiary calls `collect()` to withdraw the pooled funds (and any unspent bonus pool) in a single transaction.
3. **Outcome B — Failure (`totalPledged < target`):** After the deadline, contributors individually call `claimRefund()` (gas-efficient pull pattern) to retrieve 100% of their pledge plus their proportional share of the sponsor bonus pool.
4. **Rounding Dust Invariant:** If integer division yields remaining bonus dust, the final claimant receives the remainder when `totalRefundedPledges == totalPledged`. Zero wei is stranded.

---

## 3. Verified Test & Build Results

All automated checks have been executed and verified in the local workspace:

- **Solidity Formatting:** `forge fmt --check` passed cleanly (0 formatting diffs).
- **Contract Compilation:** `forge build` compiled with Solc 0.8.24 (optimizer: 200 runs) with 0 errors.
- **Foundry Test Results:** `forge test -vv` executed 31 tests across 2 suites:
  - `MeetupAssuranceTest`: **25 passed, 0 failed, 0 skipped**.
  - `DominantAssuranceTest`: **6 passed, 0 failed, 0 skipped**.
  - Total: **31 passed, 0 failed, 0 skipped**.
- **Frontend Linter:** `npm run lint` (`oxlint`) passed with **0 errors and 0 warnings** across 22 files.
- **Frontend Production Build:** `npm run build` (`tsc -b && vite build`) built cleanly in 2.02s, outputting to `frontend/dist/`.

---

## 4. Local Anvil Simulation Verification Summary

### Scenario A — Successful Campaign (0.1 ETH Target Met)
- **Target:** `0.1 ETH` | **Deadline:** `now + 1800s` (30 minutes) | **Beneficiary:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Initial Status:** `0` (`FUNDING ACTIVE`)
- **Backer 1 Pledge:** `0.06 ETH` (`0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`)
- **Backer 2 Pledge:** `0.05 ETH` (`0x90F79bf6EB2c4f870365E785982E1f101E93b906`)
- **Total Pledged:** `0.11 ETH` (Exceeds `0.1 ETH` target; 2 pledgers)
- **Post-Deadline Status:** `1` (`CAMPAIGN SUCCESS`)
- **Collection Call:** Beneficiary invoked `collect()`
- **Post-Collection Status:** `3` (`FUNDS COLLECTED` / `COMPLETED`)
- **Final Contract Balance:** `0 wei`
- **Net Gain to Beneficiary:** `0.11 ETH` (minus transaction gas)

### Scenario B — Failed Campaign with Dominant Assurance Bonus
- **Target:** `1.0 ETH` | **Deadline:** `now + 1800s` (30 minutes) | **Beneficiary:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Dominant Assurance Bonus:** Sponsor deposited `0.02 ETH` (`0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`)
- **Backer 1 Pledge:** `0.04 ETH` (`0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`)
- **Total Pledged:** `0.04 ETH` (Target was `1.0 ETH`)
- **Post-Deadline Status:** `2` (`CAMPAIGN FAILED`)
- **Refund Share:** `0.04 ETH` (principal) + `0.02 ETH` (100% of bonus pool) = `0.06 ETH`
- **Refund Call:** Backer 1 invoked `claimRefund()`
- **Backer 1 Net Payout:** `0.06 ETH` (minus transaction gas)
- **Final Contract Balance:** `0 wei`

---

## 5. Live Interactive Screen Recording Guide

### Required Workspace Windows
1. **Terminal 1 (Anvil Node):**
   ```bash
   anvil --port 8545
   ```
2. **Terminal 2 (Frontend Dev Server):**
   ```bash
   cd frontend && npm run dev
   ```
3. **Terminal 3 (Commands & Time Warps):**
   - Run interactive deployment:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scratch/deploy_interactive_scenarios.ps1
     ```
   - Advance EVM time past deadline (+35 minutes):
     ```bash
     cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
     cast rpc evm_mine --rpc-url http://127.0.0.1:8545
     ```
4. **Terminal 4 (Test Results):**
   - Keep `forge test -vv` output visible showing **31 passing tests**.
5. **Browser Window (`http://localhost:5173`):**
   - Connected to **Anvil Localhost** (Chain ID `31337`).
   - Split-screen with MetaMask for transaction approvals.

### Expected Demonstration Sequence
1. **Scenario A (Target 0.1 ETH):**
   - Start with contract address printed by script (`status: FUNDING ACTIVE`).
   - Alice pledges `0.06 ETH`; Bob pledges `0.05 ETH` -> Total reaches `0.11 ETH`.
   - Run `cast rpc evm_increaseTime 2100 && cast rpc evm_mine` in Terminal 3.
   - Refresh browser (`F5`): Status changes to `CAMPAIGN SUCCESS`.
   - Switch to Beneficiary Account #1 (`0x7099...`) -> Click `Collect 0.11 ETH as Beneficiary`.
   - Status updates to `FUNDS COLLECTED`.
2. **Scenario B (Target 1.0 ETH):**
   - Switch contract address in UI to Scenario B address via header gear icon.
   - Deposit `0.02 ETH` bonus in Dominant Assurance Card (or via CLI).
   - Alice pledges `0.04 ETH` (Target is 1.0 ETH).
   - Run `cast rpc evm_increaseTime 2100 && cast rpc evm_mine` in Terminal 3.
   - Refresh browser (`F5`): Status changes to `CAMPAIGN FAILED`.
   - Alice clicks `Claim 0.0600 ETH Refund` -> receives `0.04 ETH` principal + `0.02 ETH` bonus.
3. **Test Results & Conclusion:**
   - Show terminal displaying `forge test -vv` with **31 passed tests**.
   - Conclude with the tagline: *"Everyone Chips In. The Promise Is Onchain."*

### Video Export Requirements
- **Container Format:** MP4 (`.mp4`)
- **Duration:** 2 to 3 minutes (maximum 3:00)
- **Audio:** Clear narration following [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md)
- **Disclaimer:** Explicitly frame all demonstrations on local Anvil simulation (Chain ID `31337`).

---

## 6. Deployment Safety Gate Status

- **Configured Beneficiary:** `0xda9F69364a8cd4ed63d9F9886419A0CCb75bD719`
- **Confirmation Status:** **UNCONFIRMED**
- **Action:** Broadcast to Ethereum Sepolia remains strictly **BLOCKED** until the organizer independently confirms this exact address and authorizes deployment.
- **Mainnet Exclusion:** Ethereum Mainnet is strictly prohibited.

---

## 7. Remaining Manual Submission Steps for User

1. **Record Video:** Follow [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) and the guide above; export as an MP4 under 3 minutes.
2. **Upload Video:** Upload the recording to YouTube (Unlisted), Loom, or Google Drive, and copy the link.
3. **Confirm Beneficiary (Sepolia Deployment):** Verify with organizer Meera that `0xda9F69364a8cd4ed63d9F9886419A0CCb75bD719` is her public wallet. Once confirmed and authorized, broadcast to Sepolia using `forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify`.
4. **Submit Portal Form:** Submit repository URL (`https://github.com/nikitabiradar231/stepwell-assuranceP1`) and video link to the Road to Devcon XI Indore Chapter portal.
