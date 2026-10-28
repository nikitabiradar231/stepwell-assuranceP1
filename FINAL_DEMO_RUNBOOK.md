# Stepwell — Final Demo Runbook & Recording Guide

> **Event:** Road to Devcon XI — Indore Chapter  
> **Project:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** *Everyone Chips In. The Promise Is Onchain.*  
> **Repository:** [https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1)  
> **Local Environment:** Foundry Anvil (Chain ID `31337`)  

This is your step-by-step runbook to start the local environment, execute both demo scenarios, record your 2–3 minute video presentation, and prepare your final submission.

---

## Part A: Start the Application

Open three separate PowerShell terminal windows in the project directory: `C:\Users\nikita\OneDrive\Desktop\d1`.

### 1. Terminal 1 — Start the Local Anvil Blockchain
```powershell
anvil --port 8545
```
Leave this terminal running. It hosts your local Ethereum test chain:
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency:** `ETH`

---

### 2. Terminal 2 — Start the Frontend Dev Server
```powershell
cd frontend
npm run dev
```
Open your web browser (Chrome or Brave) and navigate to:
👉 **`http://localhost:5173`**

---

### 3. Terminal 3 — Deploy Fresh Interactive Demo Contracts
In your third PowerShell terminal, execute:
```powershell
powershell -ExecutionPolicy Bypass -File scratch/deploy_interactive_scenarios.ps1
```

#### Where to Find the Contract Addresses:
Look at the terminal output block. It clearly prints both deployed addresses:
```text
----------------------------------------------------------------
>>> SCENARIO A CONTRACT ADDRESS: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    Target:           100000000000000000 wei (0.1 ETH)
    Deadline:         now + 1800s (30 minutes)
    Beneficiary:      0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    Status:           0 (0 = FUNDING ACTIVE)
    Pledges:          0 wei
----------------------------------------------------------------
>>> SCENARIO B CONTRACT ADDRESS: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
    Target:           1000000000000000000 wei (1.0 ETH)
    Deadline:         now + 1800s (30 minutes)
    Beneficiary:      0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    Status:           0 (0 = FUNDING ACTIVE)
    Pledges:          0 wei
----------------------------------------------------------------
```
*(On a fresh Anvil node, the addresses will match the defaults above. Always use whatever address your terminal output prints).*

> ⚠️ **Important:** Do **not** run `scratch/verify_both_scenarios.ps1` before recording. That script executes the full lifecycle to completion. Running `scratch/deploy_interactive_scenarios.ps1` leaves both contracts fresh and ready for live UI clicks.

---

## Part B: Configure MetaMask for Local Anvil

### 1. Add / Switch to Anvil Localhost Network
1. Open MetaMask. Click the network dropdown (top-left) -> **Add network** -> **Add a network manually**.
2. Fill in:
   - **Network name:** `Anvil Localhost`
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency symbol:** `ETH`
3. Click **Save** and select `Anvil Localhost`.

### 2. Import the Demo Test Accounts
Import these accounts into MetaMask (**Account menu -> Add account -> Import account -> Private Key**):

| Demo Role | Account Index | Public Address | Private Key (Local Dev Only) |
|---|---|---|---|
| **Deployer / Sponsor** | Account #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| **Beneficiary (Meera)** | Account #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| **Backer 1 (Alice)** | Account #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| **Backer 2 (Bob)** | Account #3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |

> 🔒 **Security Notice:** These keys are public, deterministic Anvil test keys. **Never use them on Sepolia, Ethereum Mainnet, or any real network.**

> 💡 **Tip on Account Switching:** When switching accounts in MetaMask, ensure each imported account is connected to `http://localhost:5173`. If MetaMask displays a "Not connected" badge next to the domain, click the status indicator and select **Connect**.

### 3. Clear MetaMask Cache (If Nonces Ever Desync)
If you restarted Anvil, MetaMask may remember old transaction counters.  
Go to MetaMask **Settings -> Advanced -> Clear activity tab data**.  
*(This only resets the local transaction counter; your imported accounts remain intact).*

### 4. How to Select Contracts in the UI
In the Stepwell header, click the **Gear Icon** (or the contract address pill). Paste the contract address you want to inspect and click **Save Configuration**. The UI updates instantly.

---

## Part C: Demonstrate Scenario A — Successful Campaign

**Goal:** Show two backers chip in to reach the `0.1 ETH` target, the campaign passes its deadline, and the beneficiary collects the venue deposit.

1. **Verify Initial State:**
   - Contract address set to **Scenario A** (`0x5FbDB2315678afecb367f032d93F642f64180aa3`).
   - Status badge shows: **`FUNDING ACTIVE`** (amber).
   - Target displays: `0.1000 ETH` | Pledged: `0.0000 ETH`.
2. **Alice Pledges:**
   - In MetaMask, switch to **Account #2 (Alice)**.
   - On the `PledgeCard`, enter **`0.06`** ETH.
   - Click **Pledge 0.06 ETH** and confirm in MetaMask.
   - Total pledged updates to `0.0600 ETH` (60%).
3. **Bob Pledges:**
   - In MetaMask, switch to **Account #3 (Bob)**.
   - On the `PledgeCard`, enter **`0.05`** ETH.
   - Click **Pledge 0.05 ETH** and confirm in MetaMask.
   - Total pledged updates to **`0.1100 ETH`** (110%, Goal Reached!).
4. **Advance Time Past Deadline:**
   - In Terminal 3, run:
     ```powershell
     cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
     cast rpc evm_mine --rpc-url http://127.0.0.1:8545
     ```
   - *Note for narrator:* Explain that time travel is a local Anvil development RPC method (`evm_increaseTime`), not a real Ethereum transaction.
5. **Show Success State:**
   - Refresh the browser (`F5`).
   - Status badge immediately switches to **`CAMPAIGN SUCCESS`** (emerald).
   - Notice `BeneficiaryCard` shows "Collection Restricted" because Bob is currently connected.
6. **Beneficiary Collects:**
   - In MetaMask, switch to **Account #1 (Beneficiary / Meera — `0x7099...`)**.
   - `BeneficiaryCard` activates the green button: **Collect 0.1100 ETH as Beneficiary**.
   - Click the button and confirm in MetaMask.
   - Status badge updates to **`FUNDS COLLECTED`** (indigo). The venue deposit is secured!

---

## Part D: Demonstrate Scenario B — Failed Campaign with Bonus

**Goal:** Show a campaign falling short of a `1.0 ETH` target, where a sponsor deposited a `0.02 ETH` assurance bonus, and the backer receives 100% of their pledge back PLUS the bonus.

1. **Switch Contract Address:**
   - In the Stepwell header, click the **Gear Icon**.
   - Paste the **Scenario B address** (`0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`) and click **Save**.
   - Dashboard reloads: Target `1.0000 ETH`, Status **`FUNDING ACTIVE`**, Bonus Pool `0.0000 ETH`.
2. **Fund the Dominant Assurance Bonus:**
   - In `DominantAssuranceCard`, click **+ Organizer: Fund the Bonus Pool**.
   - Enter **`0.02`** ETH and click **Deposit Bonus** -> confirm in MetaMask (using Account #0 or #1).
   - *(CLI alternative: `cast send <ScenarioB_Addr> "fundBonus()" --value 0.02ether --private-key 0xac09... --rpc-url http://127.0.0.1:8545`)*.
   - Dominant Assurance Card updates to: **Bonus Pool: 0.0200 ETH**.
3. **Alice Pledges:**
   - In MetaMask, switch to **Account #2 (Alice)**.
   - On `PledgeCard`, enter **`0.04`** ETH and click **Pledge 0.04 ETH** -> confirm in MetaMask.
   - Total pledged updates to `0.0400 ETH` (4% of target).
4. **Advance Time Past Deadline:**
   - In Terminal 3, run:
     ```powershell
     cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
     cast rpc evm_mine --rpc-url http://127.0.0.1:8545
     ```
5. **Show Failure State:**
   - Refresh the browser (`F5`).
   - Status badge updates to **`CAMPAIGN FAILED`** (rose).
6. **Claim Refund + Bonus:**
   - Look at `RefundCard`. Alice's verified breakdown shows:
     - *Your Original Pledge:* **`0.0400 ETH`**
     - *Dominant Assurance Bonus:* **`+0.0200 ETH`**
     - *Total Available to Claim:* **`0.0600 ETH`**
   - Click **Claim 0.0600 ETH Refund** -> confirm in MetaMask.
   - Card updates to: **Refund Successfully Claimed!**.
   - *Note for narrator:* Highlight that pull-based refunds prevent gas-exhaustion DoS, and rounding dust is awarded to the final claimant so zero wei is trapped.

---

## Part E: Finish Recording

1. **Show Test Suite Results:**
   - Switch your screen to a terminal showing:
     ```powershell
     forge test -vv
     ```
   - Highlight: **31 passed, 0 failed, 0 skipped** (25 in `MeetupAssuranceTest`, 6 in `DominantAssuranceTest`).
2. **Final Verbal Closing:**
   - Conclude clearly:  
     > *"Stepwell — Everyone Chips In. The Promise Is Onchain. Thank you!"*
3. **Stop & Export:**
   - Stop your screen recording software (OBS, Loom, etc.).
   - Export container format: **MP4 (`.mp4`)**.
   - Confirm duration is **under 3 minutes** (ideal: 2:20 to 2:45).

---

## Part F: Submission Checklist & Next Steps

| Step | Action Item | Status |
|---|---|---|
| **1** | Record the 2–3 minute video following this runbook | ⏳ **PENDING** (Your manual recording) |
| **2** | Upload MP4 video to YouTube (Unlisted), Loom, or Google Drive | ⏳ **PENDING** (Your manual upload) |
| **3** | Update `SUBMISSION_CHECKLIST.md` with your video URL | ⏳ **PENDING** |
| **4** | Confirm Beneficiary with Meera before any live Sepolia broadcast | 🛑 **NOT DEPLOYED** (On hold for wallet confirmation) |
| **5** | Submit repo link ([https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1)) & video URL to Indore Chapter Portal | ⏳ **PENDING** (Your manual submission) |
