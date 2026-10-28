# Stepwell — Final Spoken Recording Script

> **Event:** Road to Devcon XI — Indore Chapter  
> **Project:** Stepwell — Community-Powered Meetup Funding  
> **Tagline:** *Everyone Chips In. The Promise Is Onchain.*  
> **Total Target Duration:** 2 minutes 30 seconds (maximum 3:00)  
> **Demo Network:** Local Anvil Node (Chain ID `31337`)  

---

## Storyboard & Spoken Narration

```
========================================================================================================
TIMESTAMPS    SCREEN ACTIONS & METAMASK ROLE               VERBATIM SPOKEN NARRATION
========================================================================================================
```

### 1. Introduction [00:00 – 00:15] — 15 Seconds

- **On Screen:** Open browser at `http://localhost:5173`. Show the Stepwell homepage and hero banner: *"Road to Devcon XI — The Meetup That Only Happens If We All Chip In"*.
- **MetaMask Account:** Any account connected to `Anvil Localhost` (Chain ID `31337`).
- **UI State Visible:** Header shows connected network as **Foundry Anvil (31337)**.
- **Spoken Narration:**
  > *"Hi judges, welcome to Stepwell! In student Web3 communities like Indore, organizers like Meera face a tough dilemma: booking a venue requires an upfront deposit, but organizers risk losing personal funds if attendees drop out at the last minute. Web2 forms lack commitment, and sending money to a personal UPI or wallet requires blind trust.*
  > 
  > *Stepwell solves this with trustless onchain assurance. Everyone chips in, but funds are only released if the target is reached!"*

---

### 2. Scenario A: Successful Campaign [00:15 – 01:05] — 50 Seconds

- **On Screen:** 
  1. Highlight the Progress Card showing Target: `0.1000 ETH`, Remaining: `0.1000 ETH`, and the amber status badge: **`FUNDING ACTIVE`**.
  2. Switch MetaMask to **Account #2 (Alice — `0x3C44...`)**. On `PledgeCard`, enter **`0.06`** ETH, click **Pledge 0.06 ETH**, and confirm in MetaMask. Show progress update to `0.0600 ETH` (60%).
  3. Switch MetaMask to **Account #3 (Bob — `0x90F7...`)**. On `PledgeCard`, enter **`0.05`** ETH, click **Pledge 0.05 ETH**, and confirm in MetaMask. Show progress reach **`0.1100 ETH`** (Goal reached!).
  4. In your PowerShell terminal, advance local time past the deadline:
     ```powershell
     cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
     cast rpc evm_mine --rpc-url http://127.0.0.1:8545
     ```
  5. Refresh the browser (`F5`). Status badge updates to **`CAMPAIGN SUCCESS`** (emerald).
  6. Point out that `BeneficiaryCard` shows "Collection Restricted" while Bob is connected.
  7. Switch MetaMask to **Account #1 (Beneficiary / Meera — `0x7099...`)**. Click **Collect 0.1100 ETH as Beneficiary** and confirm in MetaMask. Status badge switches to **`FUNDS COLLECTED`** (indigo).
- **Spoken Narration:**
  > *"Here is Scenario A running on our local Anvil testnet. The campaign target is 0.1 ETH, and the status is `FUNDING ACTIVE`. First, Alice connects and pledges 0.06 ETH. Next, Bob connects and pledges 0.05 ETH. Our total reaches 0.11 ETH, crossing our goal!*
  > 
  > *Now, let's fast-forward our local Anvil clock past the deadline. When we refresh, the smart contract evaluates the outcome and switches the status to `CAMPAIGN SUCCESS`. Pledging is permanently locked.*
  > 
  > *Only the immutable organizer account can collect the funds. When Meera connects her beneficiary wallet, she clicks 'Collect as Beneficiary'. The 0.11 ETH transfers directly to her wallet in a single reentrancy-guarded transaction. The status updates to `FUNDS COLLECTED`, and the venue deposit is secured!"*

---

### 3. Scenario B: Failed Campaign with Bonus [01:05 – 02:00] — 55 Seconds

- **On Screen:**
  1. In the header, click the **Gear Icon**, paste the **Scenario B contract address** printed by the deployment script, and click **Save Configuration**.
  2. The page reloads: Target shows `1.0000 ETH`, Pledges: `0.0000 ETH`, Status: **`FUNDING ACTIVE`**.
  3. In `DominantAssuranceCard`, click **+ Organizer: Fund the Bonus Pool**. Enter **`0.02`** ETH and click **Deposit Bonus** (confirm in MetaMask using Account #0 or #1). Card updates to show **Bonus Pool: 0.0200 ETH**.
  4. Switch MetaMask to **Account #2 (Alice — `0x3C44...`)**. On `PledgeCard`, enter **`0.04`** ETH, click **Pledge 0.04 ETH**, and confirm in MetaMask. Total pledged updates to `0.0400 ETH` (< 1.0 ETH goal).
  5. In PowerShell terminal, advance local time past the deadline:
     ```powershell
     cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
     cast rpc evm_mine --rpc-url http://127.0.0.1:8545
     ```
  6. Refresh the browser (`F5`). Status badge updates to **`CAMPAIGN FAILED`** (rose).
  7. On `RefundCard`, show Alice's verified breakdown:
     - *Original Pledge:* `0.0400 ETH`
     - *Dominant Assurance Bonus:* `+0.0200 ETH`
     - *Total Available to Claim:* `0.0600 ETH`
  8. Click **Claim 0.0600 ETH Refund** and confirm in MetaMask. Card updates to: **Refund Successfully Claimed!**.
- **Spoken Narration:**
  > *"Now, what happens if turnout falls short? Let's switch to Scenario B: an ambitious 1.0 ETH target where an organizer deposited a 0.02 ETH Dominant Assurance bonus to overcome hesitation.*
  > 
  > *Alice pledges 0.04 ETH, but no one else joins before the deadline passes. Let's fast-forward the clock and refresh. The status immediately switches to `CAMPAIGN FAILED`.*
  > 
  > *In a failed campaign, Stepwell uses an individual pull refund pattern. There are no loops over arrays, eliminating any denial-of-service risk. Notice the breakdown on Alice's refund card: she receives her full 0.04 ETH principal back, plus 100% of the bonus pool, totaling 0.06 ETH returned! Any division rounding dust is automatically swept to the final claimant, ensuring zero wei is ever trapped onchain."*

---

### 4. Technical Proof [02:00 – 02:20] — 20 Seconds

- **On Screen:** Switch to your terminal window displaying the completed output of:
  ```powershell
  forge test -vv
  ```
- **Visible Terminal Output:** Highlight the summary line:
  ```text
  Ran 2 test suites in 12.50ms: 31 tests passed, 0 failed, 0 skipped (31 total tests)
  ```
- **Spoken Narration:**
  > *"Under the hood, Stepwell is thoroughly tested with 31 passing Foundry tests covering state transitions, reentrancy protection, dust handling, and invariant bounds. The frontend is built in React 19, Vite, and Wagmi with zero linter errors and a clean production build.*
  > 
  > *For safety, our Sepolia broadcast is deliberately paused until organizer wallet ownership is independently verified through our cryptographic challenge checklist."*

---

### 5. Closing [02:20 – 02:30] — 10 Seconds

- **On Screen:** Switch back to the Stepwell web application, showing the logo and footer.
- **Spoken Narration:**
  > *"With Stepwell, organizers never risk personal funds, and participants never risk losing their ETH.*
  > 
  > *Stepwell — Everyone Chips In. The Promise Is Onchain. Thank you!"*

---

## Quick Reference: MetaMask Accounts & Local Roles

| Account Index | Address | Local Role in Demo | Private Key (Local Anvil Only) |
|---|---|---|---|
| **Account #0** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | Deployer / Sponsor | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| **Account #1** | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | Beneficiary (Meera) | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| **Account #2** | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | Backer 1 (Alice) | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| **Account #3** | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | Backer 2 (Bob) | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |

---

## Recording Export Specs

- **File Format:** MP4 (`.mp4`)
- **Target Duration:** 2 minutes 30 seconds (maximum 3:00)
- **Audio:** Clear voiceover following the verbatim narration blocks above
- **Network Notice:** Local Anvil testnet (Chain ID `31337`) clearly framed throughout
