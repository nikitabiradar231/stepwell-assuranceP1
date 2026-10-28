# Stepwell — Local Demo Setup & Troubleshooting Guide

This guide provides instructions for setting up, recording, and troubleshooting the **Stepwell** local demonstration on Foundry Anvil (Chain ID `31337`).

---

## 1. Quick Start: Running the Local Demo Environment

### Step 1: Start the Local Anvil Node
Open your first terminal window in the project root:
```bash
anvil --port 8545
```
> **Default Anvil RPC URL:** `http://127.0.0.1:8545`  
> **Chain ID:** `31337`  
> **Currency Symbol:** `ETH`

### Step 2: Start the Frontend Application
Open a second terminal window in the `frontend/` directory:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 2. Configuring MetaMask for Local Anvil

### Add the Anvil Local Network to MetaMask
1. Open the MetaMask browser extension.
2. Click the network dropdown (top-left) -> **Add network** -> **Add a network manually**.
3. Fill in the network details:
   - **Network name:** `Anvil Localhost`
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency symbol:** `ETH`
4. Click **Save** and switch to `Anvil Localhost`.

### Import Anvil Demo Accounts
To demonstrate the full workflow, import the following accounts into MetaMask using **Account Menu -> Add account or hardware wallet -> Import account -> Private Key**:

| Role in Demo | Account Index | Public Address | Private Key |
|---|---|---|---|
| **Deployer / Sponsor** | Account #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| **Beneficiary (Meera)** | Account #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| **Backer 1 (Alice)** | Account #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| **Backer 2 (Bob)** | Account #3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |

> ⚠️ **CRITICAL SECURITY RULE:** These private keys are standard, publicly known Anvil development test keys. **NEVER use these keys on Sepolia, Ethereum Mainnet, or any public blockchain.**

> 💡 **Tip on MetaMask Account Switching:** When switching accounts in MetaMask, ensure each imported account is connected to `http://localhost:5173`. If MetaMask displays a "Not connected" badge next to the site domain, click the status indicator and select **Connect**.

---

## 3. Deploying & Switching Demo Contracts

### Deploying Fresh Interactive Contracts for Demo Recording
To deploy fresh contracts for live screen recording (leaving both contracts active with 30-minute deadlines and 0 wei pledged):
```powershell
powershell -ExecutionPolicy Bypass -File scratch/deploy_interactive_scenarios.ps1
```
This prints the deployed contract addresses for both **Scenario A** (0.1 ETH target) and **Scenario B** (1.0 ETH target).

*(Note: `scratch/verify_both_scenarios.ps1` exists for automated verification, but it runs the full lifecycle to completion. Always use `deploy_interactive_scenarios.ps1` when preparing to record!)*

### Switching Active Contracts in the UI
You do not need to restart the frontend to test different contracts:
1. In the Stepwell header, click the **Settings / Gear icon** or the contract address pill.
2. Paste the target contract address (or click **Use Local Anvil Default Preset**).
3. The dashboard re-reads all onchain parameters immediately.

---

## 4. Common Errors & Fast Resolutions

### Error 1: "Nonce too high" or "Internal JSON-RPC error"
- **Cause:** When you restart Anvil, the blockchain state resets to block 0, but MetaMask remembers past transaction nonces.
- **Fix:** In MetaMask:
  1. Click **Account icon** (top-right) -> **Settings**.
  2. Select **Advanced**.
  3. Click **Clear activity tab data** (or **Reset account** in older versions).
  4. This clears cached nonces without losing your imported accounts.

### Error 2: "Wrong Network / Please switch to supported network"
- **Cause:** MetaMask is connected to Ethereum Mainnet, Sepolia, or another chain while viewing the local app.
- **Fix:** Click the network selector in MetaMask and switch to **Anvil Localhost** (Chain ID `31337`).

### Error 3: `CampaignStillActive()` when attempting to Collect or Refund
- **Cause:** The campaign deadline is still in the future. Onchain rules strictly forbid beneficiary collection or contributor refunds until the deadline has passed.
- **Fix:** Fast-forward EVM time in terminal past the 30-minute deadline:
  ```bash
  cast rpc evm_increaseTime 2100 --rpc-url http://127.0.0.1:8545
  cast rpc evm_mine --rpc-url http://127.0.0.1:8545
  ```
  Refresh the webpage (`F5`); the UI status will update to `CAMPAIGN SUCCESS` or `CAMPAIGN FAILED`.

### Error 4: `DeadlineMustBeInFuture()` during local deployment
- **Cause:** You ran `evm_increaseTime` earlier, so the EVM clock is ahead of standard UTC time.
- **Fix:** Always calculate the deadline relative to Anvil's current block timestamp rather than system clock:
  ```powershell
  $now = [int]((cast block latest --rpc-url http://127.0.0.1:8545 -f timestamp).Trim())
  $deadline = $now + 1800 # 30 minutes in future
  ```

### Error 5: `OnlyBeneficiary()` when clicking Collect
- **Cause:** You are connected with Backer 1 or Deployer instead of Meera's beneficiary account.
- **Fix:** Switch your active account in MetaMask to Account #1 (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`), then reload or proceed with collection.

### Error 6: `DirectTransfersNotAllowed()`
- **Cause:** Attempting to send ETH directly to the contract address via MetaMask "Send".
- **Fix:** The contract's `receive()` and `fallback()` functions explicitly revert to prevent untracked donations. Always contribute via the UI **Pledge** button or call `pledge()` / `fundBonus()` via ABI.

---

## 5. Safe Resetting of the Local Environment

If you ever need a clean slate before recording your demo video:
1. Stop Anvil (`Ctrl+C` in the terminal).
2. Start a fresh Anvil node:
   ```bash
   anvil --port 8545
   ```
3. In MetaMask, click **Settings -> Advanced -> Clear activity tab data**.
4. Re-run `powershell -ExecutionPolicy Bypass -File scratch/deploy_interactive_scenarios.ps1` to deploy fresh contracts.
5. Paste the new contract address into the Stepwell UI.
