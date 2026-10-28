# Stepwell — Final Buildathon Submission Checklist & Portal Guide

> **Event:** Road to Devcon XI — Indore Chapter  
> **Project:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** *Everyone Chips In. The Promise Is Onchain.*  
> **GitHub Repository:** [https://github.com/nikitabiradar231/stepwell-assuranceP1](https://github.com/nikitabiradar231/stepwell-assuranceP1)  
> **Sepolia Deployment Status:** 🛑 **NOT DEPLOYED** (Deliberately paused pending independent organizer wallet verification)  
> **Submission Status:** ⏳ **PENDING USER VIDEO UPLOAD & PORTAL SUBMISSION**  

---

## 1. Quick-Copy Portal Submission Information

Use the text below directly in your submission portal form:

```text
Project Name:
Stepwell — Community-Powered Meetup Funding

Tagline:
Everyone Chips In. The Promise Is Onchain.

Repository URL:
https://github.com/nikitabiradar231/stepwell-assuranceP1

Project Description:
Stepwell solves the grassroots Web3 community coordination failure in student hubs like Indore. Meetup organizers need upfront venue deposits (e.g., 0.1 ETH for 60 students), but attendees hesitate to commit funds without knowing if the event will succeed. Informal RSVPs have high dropout rates, while sending money to personal wallets requires blind trust.

Stepwell introduces trustless assurance crowdfunding via an immutable smart contract (MeetupAssurance.sol):
1. Target-Driven Escrow: Participants pledge test ETH toward a fixed target before an immutable deadline.
2. Success Outcome: If total pledges reach or exceed the target, only the designated organizer beneficiary can collect the pooled funds (along with any deposited bonus) to secure the venue.
3. Failure & Pull Refunds: If pledges fall short, every backer independently claims 100% of their pledge back through an individual pull-refund pattern, permanently preventing gas-exhaustion Denial of Service (DoS) attacks.
4. Dominant Assurance Bonus: An organizer or sponsor can fund an assurance bonus pool. If the campaign fails, 100% of this bonus is distributed proportionally to pledgers on top of their full refund, ensuring early participants face zero downside. Rounding dust is automatically swept to the final claimant, leaving zero stranded ETH.

Technology Stack:
Solidity 0.8.24, OpenZeppelin Contracts v5.0 (ReentrancyGuard), Foundry (Forge, Cast, Anvil), React 19, TypeScript, Vite, Wagmi v3, Viem v2, and bespoke Vanilla CSS design.

Test & Quality Results:
- 31/31 passing Foundry tests (25 in MeetupAssuranceTest, 6 in DominantAssuranceTest).
- 0 compiler warnings/errors (Solc 0.8.24 with 200 optimizer runs).
- 0 lint errors/warnings (oxlint across 22 frontend files).
- Clean production build in frontend/dist/.
- Live demo verified on local Anvil testnode (Chain ID 31337). Public Sepolia broadcast is currently paused awaiting organizer wallet confirmation.
```

---

## 2. Local Demo Setup Instructions

To demonstrate Stepwell locally on Foundry Anvil:

1. **Terminal 1 — Anvil Node:**
   ```powershell
   anvil --port 8545
   ```
2. **Terminal 2 — Frontend Dev Server:**
   ```powershell
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
3. **Terminal 3 — Interactive Deployment:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File scratch/deploy_interactive_scenarios.ps1
   ```
   *Deploys fresh Scenario A (0.1 ETH target) and Scenario B (1.0 ETH target) contracts with 30-minute deadlines and 0 wei pledged.*
4. **MetaMask Configuration:**
   - Network: `Anvil Localhost` (RPC `http://127.0.0.1:8545`, Chain ID `31337`, Symbol `ETH`).
   - Clear old nonces: **Settings -> Advanced -> Clear activity tab data**.
   - Import local test accounts (Account #0 Deployer, Account #1 Beneficiary, Account #2 Alice, Account #3 Bob).
   - Ensure accounts are connected to `http://localhost:5173` (click "Connect" if prompted).
5. **Advancing Time Past Deadline:**
   In Terminal 3, execute:
   ```powershell
   cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
   cast rpc evm_mine --rpc-url http://127.0.0.1:8545
   ```
   Refresh browser (`F5`) to observe status change to `CAMPAIGN SUCCESS` or `CAMPAIGN FAILED`.

---

## 3. Video Recording Checklist

- [ ] **Recording Tool:** OBS Studio, Loom, or Windows Game Bar (`Win+G`).
- [ ] **Audio:** Clear microphone sound with no echo, background noise, or clipping.
- [ ] **Resolution:** Clean 1080p display capture.
- [ ] **Duration:** Strictly between **2:15 and 2:50** (hard limit: 3:00).
- [ ] **Narration Alignment:** Followed the verbatim spoken script in [`FINAL_RECORDING_SCRIPT.md`](FINAL_RECORDING_SCRIPT.md).
- [ ] **Scenario A Walkthrough:**
  - [ ] Show `FUNDING ACTIVE` status badge.
  - [ ] Alice pledges `0.06 ETH`; Bob pledges `0.05 ETH` (Total: `0.11 ETH`).
  - [ ] Fast-forward Anvil time (`cast rpc evm_increaseTime 2100 && cast rpc evm_mine`).
  - [ ] Refresh (`F5`) -> Status updates to `CAMPAIGN SUCCESS`.
  - [ ] Beneficiary Meera (Account #1) clicks `Collect 0.1100 ETH` -> Status updates to `FUNDS COLLECTED`.
- [ ] **Scenario B Walkthrough:**
  - [ ] Switch contract address in UI header gear icon to Scenario B address (`0xe7f1...`).
  - [ ] Deposit `0.02 ETH` into Dominant Assurance bonus pool.
  - [ ] Alice pledges `0.04 ETH` (Target: 1.0 ETH).
  - [ ] Fast-forward Anvil time (`cast rpc evm_increaseTime 2100 && cast rpc evm_mine`).
  - [ ] Refresh (`F5`) -> Status updates to `CAMPAIGN FAILED`.
  - [ ] Alice claims refund: receives `0.04 ETH` principal + `0.02 ETH` bonus = `0.06 ETH`.
- [ ] **Technical Proof:**
  - [ ] Show Terminal displaying genuine output of `forge test -vv` with **31 tests passed, 0 failed, 0 skipped**.
- [ ] **Spoken Closing:**
  - [ ] Delivered closing tagline: *"Stepwell — Everyone Chips In. The Promise Is Onchain. Thank you!"*

---

## 4. Video Export & Upload Instructions

### A. Export Container
- Export your recording as an **MP4 (`.mp4`)** file using the H.264 video codec and AAC audio codec.

### B. Uploading Your Video

Choose one of the following hosting options:

#### Option 1: YouTube (Recommended)
1. Go to [YouTube Studio](https://studio.youtube.com/) and click **Create -> Upload videos**.
2. Select your exported `.mp4` file.
3. Title: `Stepwell — Road to Devcon XI Indore Chapter Demo`.
4. In the **Visibility** step, select **Unlisted** (anyone with the link can view; not listed publicly in search).
5. Copy the video link (e.g., `https://youtu.be/...`).

#### Option 2: Loom
1. Upload your `.mp4` to Loom or record directly using the Loom desktop app.
2. Under Share settings, set access to **"Anyone with the link can view"**.
3. Copy the public link.

#### Option 3: Google Drive
1. Upload your `.mp4` to Google Drive.
2. Right-click the uploaded video -> **Share -> Share**.
3. Under **General access**, change **Restricted** to **"Anyone with the link"** with role set to **Viewer**.
4. Click **Copy link**.

---

## 5. Mandatory Incognito Link Test

Before submitting your form, perform this verification check:

1. Open a new **Incognito / Private Window** in your browser.
2. Paste your copied video link and press Enter.
3. **Verify:**
   - [ ] The video plays immediately without prompting you to log in to Google, YouTube, or Loom.
   - [ ] The video has no "Access Denied" or "Request Access" permission banners.
   - [ ] The audio and video playback are crisp and synchronous.

---

## 6. Official Buildathon Submission Tracking Fields

Fill in these fields as you finalize your submission:

| Submission Item | Required Information | Your Recorded Value |
|---|---|---|
| **Event Name** | Road to Devcon XI — Indore Chapter | Road to Devcon XI — Indore Chapter |
| **Project Title** | Stepwell — Community-Powered Meetup Funding | Stepwell |
| **Project Tagline** | Everyone Chips In. The Promise Is Onchain. | Everyone Chips In. The Promise Is Onchain. |
| **GitHub Repository** | Public GitHub URL | `https://github.com/nikitabiradar231/stepwell-assuranceP1` |
| **Foundry Test Results** | Verified unit/invariant tests | 31 passed, 0 failed, 0 skipped |
| **Sepolia Status** | Public testnet status | 🛑 **NOT DEPLOYED** (Pending organizer wallet confirmation) |
| **Exported Video File** | Local file name | `Filename: ________________________________` |
| **Video Duration** | MM:SS format (< 3:00) | `Duration: _____ min _____ sec` |
| **Public Demo Video URL** | YouTube / Loom / Drive link | `URL: _____________________________________` |
| **Incognito Link Verified** | Access confirmed without login | `[  ] Verified in Private/Incognito Window` |
| **Portal Submission Status** | Form confirmation | `[  ] Submitted on ______________________` |
| **Confirmation / Reference ID** | Portal receipt ID (if provided) | `ID: ______________________________________` |
