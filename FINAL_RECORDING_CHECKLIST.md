# Stepwell — Final Recording & Quality Checklist

> **Event:** Road to Devcon XI — Indore Chapter  
> **Project:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** *Everyone Chips In. The Promise Is Onchain.*  
> **Repository:** [https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1)  
> **Target Video Length:** 2:30 (strictly under 3:00 limit)  
> **Export Container:** MP4 (`.mp4`)  

Use this checklist before pressing record, during your live walkthrough, and before submitting your final video to the Road to Devcon XI Indore Chapter portal.

---

## 1. Pre-Recording Setup: Three PowerShell Terminals

Open three separate PowerShell terminal windows in the project root (`C:\Users\nikita\OneDrive\Desktop\d1`):

- [ ] **Terminal 1 — Local Anvil Blockchain Node:**
  - Command:
    ```powershell
    anvil --port 8545
    ```
  - Verify status: Running locally on `http://127.0.0.1:8545` with Chain ID `31337`. Leave running.
- [ ] **Terminal 2 — Frontend Dev Server:**
  - Command:
    ```powershell
    cd frontend
    npm run dev
    ```
  - Verify status: Vite serving the React 19 app at `http://localhost:5173`. Open in Chrome or Brave.
- [ ] **Terminal 3 — Interactive Deployment, Test Proof & Time-Warp CLI:**
  - Run the fresh interactive deployment script:
    ```powershell
    powershell -ExecutionPolicy Bypass -File scratch/deploy_interactive_scenarios.ps1
    ```
  - Verify output: Prints **Scenario A** (0.1 ETH target) and **Scenario B** (1.0 ETH target) addresses, both showing `Status: 0 (FUNDING ACTIVE)` with `Pledges: 0 wei`.
  - Keep this terminal window ready for time-warp commands during recording:
    ```powershell
    cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
    cast rpc evm_mine --rpc-url http://127.0.0.1:8545
    ```
  - *(Pre-recording verification check)*: Confirm all 31 tests pass by running:
    ```powershell
    forge test -vv
    ```
    Ensure the output shows: `31 tests passed, 0 failed, 0 skipped`. Leave this output scrollable or accessible to showcase during the Technical Proof section.

---

## 2. Anvil Network and MetaMask Configuration

- [ ] **Anvil Localhost Network Configured in MetaMask:**
  - Network Name: `Anvil Localhost`
  - RPC URL: `http://127.0.0.1:8545`
  - Chain ID: `31337`
  - Currency Symbol: `ETH`
- [ ] **MetaMask Cache Reset (Prevent Nonce Desyncs):**
  - In MetaMask: **Settings -> Advanced -> Clear activity tab data**.
- [ ] **Four Demo Test Accounts Imported via Private Key:**
  - [ ] **Account #0 (Deployer / Sponsor):** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`  
    *(Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`)*
  - [ ] **Account #1 (Beneficiary / Meera):** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`  
    *(Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`)*
  - [ ] **Account #2 (Backer 1 / Alice):** `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`  
    *(Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`)*
  - [ ] **Account #3 (Backer 2 / Bob):** `0x90F79bf6EB2c4f870365E785982E1f101E93b906`  
    *(Key: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`)*
  - [ ] **Account Connection to Localhost:** Ensure each imported account is connected to `http://localhost:5173` (click "Connect" in MetaMask if prompted when switching accounts).
  - ⚠️ *Security rule: These are standard public Anvil test keys. Never use on live networks!*

---

## 3. Scenario A Walkthrough: Successful Campaign (Target: 0.1 ETH)

- [ ] **Initial State Verification:**
  - Stepwell UI configured to **Scenario A address** (printed by `deploy_interactive_scenarios.ps1`).
  - Status badge: **`FUNDING ACTIVE`** (amber).
  - Target: `0.1000 ETH` | Total Pledged: `0.0000 ETH` | Remaining: `0.1000 ETH`.
- [ ] **Alice Pledges 0.06 ETH:**
  - Switch MetaMask to **Account #2 (Alice — `0x3C44...`)**.
  - In `PledgeCard`, enter **`0.06`** ETH -> Click **Pledge 0.06 ETH** -> Confirm in MetaMask.
  - Progress card updates to: `0.0600 ETH` (60%).
- [ ] **Bob Pledges 0.05 ETH:**
  - Switch MetaMask to **Account #3 (Bob — `0x90F7...`)**.
  - In `PledgeCard`, enter **`0.05`** ETH -> Click **Pledge 0.05 ETH** -> Confirm in MetaMask.
  - Progress card updates to: **`0.1100 ETH`** (110%, Goal Reached!).
- [ ] **Advance Local Time Past Deadline (+35 minutes):**
  - In Terminal 3, execute:
    ```powershell
    cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
    cast rpc evm_mine --rpc-url http://127.0.0.1:8545
    ```
- [ ] **Refresh UI & Show Success:**
  - Refresh the browser (`F5`).
  - Status badge switches to **`CAMPAIGN SUCCESS`** (emerald).
  - Point out that `BeneficiaryCard` shows "Collection Restricted" while Bob is connected.
- [ ] **Beneficiary Collects 0.11 ETH:**
  - Switch MetaMask to **Account #1 (Beneficiary / Meera — `0x7099...`)**.
  - Click **Collect 0.1100 ETH as Beneficiary** -> Confirm in MetaMask.
  - Status badge updates to **`FUNDS COLLECTED`** (indigo). Venue deposit is secured!

---

## 4. Scenario B Walkthrough: Failed Campaign with Dominant Assurance Bonus

- [ ] **Switch UI to Scenario B Contract:**
  - In header, click the **Gear Icon** -> Paste the **Scenario B address** -> Click **Save Configuration**.
  - UI reloads: Target `1.0000 ETH`, Status **`FUNDING ACTIVE`**, Bonus Pool `0.0000 ETH`.
- [ ] **Deposit 0.02 ETH Dominant Assurance Bonus:**
  - In `DominantAssuranceCard`, click **+ Organizer: Fund the Bonus Pool**.
  - Enter **`0.02`** ETH -> Click **Deposit Bonus** -> Confirm in MetaMask (using Account #0 or #1).
  - Card updates: **Bonus Pool: 0.0200 ETH**.
- [ ] **Alice Pledges 0.04 ETH:**
  - Switch MetaMask to **Account #2 (Alice — `0x3C44...`)**.
  - In `PledgeCard`, enter **`0.04`** ETH -> Click **Pledge 0.04 ETH** -> Confirm in MetaMask.
  - Total pledged updates to `0.0400 ETH` (< 1.0 ETH target).
- [ ] **Advance Local Time Past Deadline (+35 minutes):**
  - In Terminal 3, execute:
    ```powershell
    cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
    cast rpc evm_mine --rpc-url http://127.0.0.1:8545
    ```
- [ ] **Refresh UI & Show Failure:**
  - Refresh the browser (`F5`).
  - Status badge switches to **`CAMPAIGN FAILED`** (rose).
- [ ] **Alice Claims Refund and Proportional Bonus:**
  - On `RefundCard`, observe verified breakdown:
    - *Original Pledge:* `0.0400 ETH`
    - *Dominant Assurance Bonus:* `+0.0200 ETH`
    - *Total Available to Claim:* `0.0600 ETH`
  - Click **Claim 0.0600 ETH Refund** -> Confirm in MetaMask.
  - Card updates: **Refund Successfully Claimed!** (Alice received 0.06 ETH back).
  - *Highlight on audio:* Pull-pattern prevents gas exhaustion DoS; rounding dust sweep awards remainder to final claimant.

---

## 5. Technical Proof & Spoken Closing

- [ ] **Show Genuine Test Output:**
  - Switch screen to Terminal 3 showing genuine output of:
    ```powershell
    forge test -vv
    ```
  - Highlight the test summary line:
    `Ran 2 test suites in 12.50ms: 31 tests passed, 0 failed, 0 skipped (31 total tests)`
- [ ] **Spoken Closing:**
  - Deliver closing tagline:  
    > *"Stepwell — Everyone Chips In. The Promise Is Onchain. Thank you!"*

---

## 6. Audio, Screen Visibility & Playback Verification

- [ ] **Microphone Audio Quality:** Clear, crisp narration with no background echo, distortion, or clipping.
- [ ] **Screen Visibility & Text Legibility:** 1080p resolution; dashboard numbers, MetaMask confirmation popups, and terminal text are sharp.
- [ ] **Local Framing Clear:** Narration explicitly notes this is a local Anvil testnet simulation (Chain ID `31337`), and Sepolia broadcast is paused pending organizer address verification.
- [ ] **Duration Check:** Total recorded length is between **2:15 and 2:50** (strictly under the 3:00 hard limit).
- [ ] **Playback Check:** Played the recorded video all the way through to ensure no desynced audio, stutter, or skipped frames.

---

## 7. Final MP4 Export and Upload Checklist

- [ ] **Export Settings:**
  - Format: MP4 (`.mp4`)
  - Video Codec: H.264
  - Audio Codec: AAC
  - File Size: Reasonable for streaming (< 250 MB)
- [ ] **Upload Video:**
  - Upload to: YouTube (Unlisted), Loom, or Google Drive.
  - *If Google Drive:* Ensure link sharing permissions are set to **"Anyone with the link can view"**.
- [ ] **Incognito Link Test:**
  - Open an Incognito / Private browser window.
  - Paste the video link and verify it plays directly without requiring an account login or permissions request.

---

## 8. Buildathon Submission Tracker

Record your actual submission details in the fields below:

| Submission Field | Verification Status | Recorded Value (Fill In After Execution) |
|---|---|---|
| **Project Name** | ✅ Stepwell — Community-Powered Meetup Funding | Stepwell |
| **Event** | ✅ Road to Devcon XI — Indore Chapter | Road to Devcon XI |
| **GitHub Repository** | ✅ Verified Passing QA | `https://github.com/nikitabiradar231/stepwell-assuranceP1` |
| **Foundry Test Suite** | ✅ 31/31 passing tests | 31 passed, 0 failed, 0 skipped |
| **Frontend Build & Lint** | ✅ 0 errors, 0 warnings | Clean build in `dist/` |
| **Local Anvil Simulation** | ✅ Verified on Chain ID 31337 | Scenarios A & B verified |
| **Exported MP4 File** | ⏳ PENDING User Recording | `Filename: ________________________` |
| **Video Actual Duration** | ⏳ PENDING User Recording | `Duration: ___ min ___ sec` |
| **Demo Video URL** | ⏳ PENDING User Upload | `URL: ___________________________________` |
| **Sepolia Broadcast** | 🛑 NOT DEPLOYED | Blocked pending Meera's address confirmation |
| **Beneficiary Address** | ⚠️ UNCONFIRMED | `0xda9F69364a8cd4ed63d9F9886419A0CCb75bD719` |
| **Indore Chapter Portal** | ⏳ PENDING User Submission | `Status: [  ] Submitted on ______________` |
