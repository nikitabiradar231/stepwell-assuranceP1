# Stepwell — Community-Powered Meetup Funding
> **Event:** Road to Devcon XI (Indore Chapter)  
> **Tagline:** *Everyone Chips In. The Promise Is Onchain.*

[![Foundry Tests](https://img.shields.io/badge/Foundry-31%2F31%20Passing-brightgreen.svg)](https://getfoundry.sh/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Wagmi-blue.svg)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Problem Statement

Organizing grassroots Web3 events in student communities often faces a critical coordination problem:

**Meera**, the local organizer of the **Road to Devcon XI** chapter in **Indore, India**, wants to host a full-day Ethereum workshop for **60 college students**. To secure the conference hall, the venue manager requires a venue deposit upfront.

In previous events, organizers relied on WhatsApp group commitments or informal UPI promises. When the day arrived:
- Multiple attendees backed out at the last moment.
- The organizer was left covering the venue deposit out of her own pocket.
- Alternatively, if the organizer canceled early to avoid loss, students who had made travel plans were left frustrated.

Informal commitments lack verifiable commitment. Traditional crowdfunding platforms charge steep platform fees, take weeks to pay out, and introduce centralized custody risks.

---

## 2. Solution Overview

**Stepwell** introduces trustless assurance crowdfunding powered by an immutable Ethereum smart contract (`MeetupAssurance.sol`).

- **All-or-Nothing Escrow:** Participants pledge test ETH toward a fixed target before an immutable deadline.
- **Outcome A — Success:** If total community pledges meet or exceed the venue deposit target by the deadline, only the designated organizer/beneficiary can collect the funds in a single transaction.
- **Outcome B — Failure:** If pledges fall short of the target when the deadline passes, every participant can independently claim 100% of their pledged ETH back.
- **Dominant Assurance Bonus:** To overcome student coordination hesitation, the organizer or an ecosystem sponsor can deposit a bonus pool. If the campaign fails, this entire bonus is distributed proportionally to pledgers on top of their full refund. Pledgers face **zero financial downside** to chip in early.

---

## 3. How the Smart Contract Works

### Campaign State Machine

```
                   [ block.timestamp < deadline ]
                                │
                                ▼
                       ┌─────────────────┐
                       │     FUNDING     │  ◄── Pledging & Bonus Open
                       └────────┬────────┘
                                │
                   [ block.timestamp >= deadline ]
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
  [ totalPledged >= target ]              [ totalPledged < target ]
            │                                       │
            ▼                                       ▼
   ┌─────────────────┐                     ┌─────────────────┐
   │     SUCCESS     │                     │     FAILED      │
   └────────┬────────┘                     └────────┬────────┘
            │                                       │
     collect() by beneficiary             claimRefund() by each backer
            │                                       │
            ▼                                       ▼
   ┌─────────────────┐                     Pledger receives pledge +
   │    COMPLETED    │                     proportional bonus share
   └─────────────────┘
```

### Core Invariants

1. **Immutable Terms:** Campaign target, deadline timestamp, and beneficiary address are immutable once deployed.
2. **Pull-Payment Refunds:** Refunds are individual pull-payments. The contract **never** loops over pledgers, eliminating gas limit denial-of-service risks.
3. **No Beneficiary Intervention on Failure:** If the target is missed, pledgers claim refunds directly without organizer permission or action.
4. **Isolated Bonus Pool:** Bonus funds deposited via `fundBonus()` are accounted separately from `totalPledged` and **never** count toward meeting the target.
5. **Exact Accounting & Rounding Dust:** When distributing the failure bonus, integer division rounding dust is strictly allocated to the final refunded claimant (`totalRefundedPledges == totalPledged`), ensuring zero residual locked ETH.
6. **Checks-Effects-Interactions & Reentrancy Guards:** All state mutations occur prior to low-level `.call{value: ...}("")` transfers, guarded with OpenZeppelin's `ReentrancyGuard`.
7. **Direct Transfer Rejection:** Low-level `receive()` and `fallback()` functions revert to ensure all deposited funds are properly mapped to participant accounts.

---

## 4. Technology Stack

- **Smart Contracts:** Solidity `0.8.24` (OpenZeppelin v5.0 `ReentrancyGuard`)
- **Smart Contract Toolkit:** [Foundry](https://getfoundry.sh/) (`forge`, `cast`, `anvil`)
- **Frontend Framework:** React 19 + TypeScript + Vite
- **Web3 Connectivity:** [Wagmi v3](https://wagmi.sh/) + [Viem v2](https://viem.sh/) + TanStack React Query
- **Styling:** Vanilla Tailwind CSS v4 + Lucide Icons
- **Target Networks:** Ethereum Sepolia Testnet (Chain ID `11155111`) & Local Anvil (Chain ID `31337`)

---

## 5. Repository Structure

```
stepwell-assurance/
├── contracts/
│   └── MeetupAssurance.sol         # Main assurance + dominant assurance contract
├── test/
│   ├── MeetupAssurance.t.sol       # 25 core campaign unit & security tests
│   └── DominantAssurance.t.sol     # 6 dominant assurance bonus accounting tests
├── script/
│   └── Deploy.s.sol                # Foundry deployment script (Sepolia / Anvil)
├── deployments/
│   └── sepolia.json                # Sepolia deployment manifest
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── contract.ts         # Contract ABI, types, status labels, default addresses
│   │   │   └── wagmi.ts            # Wagmi client config (Sepolia & Foundry)
│   │   ├── hooks/
│   │   │   ├── useCampaignData.ts  # Onchain reads, balances, pledger queries
│   │   │   └── useContractActions.ts # Transaction dispatches (pledge, refund, collect, bonus)
│   │   ├── components/
│   │   │   ├── Header.tsx          # Wallet connect & network indicator
│   │   │   ├── HeroBanner.tsx      # Indore meetup backstory
│   │   │   ├── ProgressCard.tsx    # Live target progress bar & pledger count
│   │   │   ├── CountdownTimer.tsx  # Dynamic countdown to deadline
│   │   │   ├── PledgeCard.tsx      # ETH pledging with quick presets
│   │   │   ├── RefundCard.tsx      # Pull-pattern refund claim + bonus calculation
│   │   │   ├── DominantAssuranceCard.tsx # Bonus pool visualization & funding
│   │   │   ├── BeneficiaryCard.tsx # Organizer payout collection
│   │   │   ├── StatusBadge.tsx     # Current campaign state badge
│   │   │   ├── TransparencyExplainer.tsx # Onchain rules breakdown
│   │   │   ├── ContractConfigModal.tsx   # Custom contract address switcher
│   │   │   ├── TransactionModal.tsx      # Pending/confirmed state modals
│   │   │   └── NetworkBanner.tsx   # Network validation banner
│   │   ├── utils/
│   │   │   └── formatters.ts       # ETH, address, timestamp formatters
│   │   ├── App.tsx                 # Main Stepwell DApp assembly
│   │   └── main.tsx                # React Query & WagmiProvider entry
│   ├── package.json
│   └── vite.config.ts
├── foundry.toml                    # Foundry compilation & formatting configuration
├── .env.example                    # Environment variable template
└── README.md
```

---

## 6. Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`curl -L https://foundry.paradigm.xyz | bash` followed by `foundryup`)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)

---

### Step 1: Install Dependencies

```bash
# Clone the repository
git clone <REPO_URL>
cd stepwell-assurance

# Install smart contract libraries via git submodules
git submodule update --init --recursive

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### Step 2: Run Smart Contract Tests

Run the complete test suite:

```bash
forge test -vv
```

Check code formatting:

```bash
forge fmt --check
```

Build smart contracts:

```bash
forge build
```

**Test Coverage Summary:**
- Total tests: **31 passed, 0 failed, 0 skipped**
  - `MeetupAssuranceTest`: 25 passing tests (pledges, boundaries, reentrancy attacks, double claims, access controls)
  - `DominantAssuranceTest`: 6 passing tests (proportional bonus calculation, dust allocation, pre-deadline checks)

---

### Step 3: Run the Frontend Locally

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 7. Local Testing with Anvil (Complete Workflow)

You can test the entire lifecycle locally using Foundry's Anvil testnode.

### Scenario A: Successful Campaign Flow

1. **Start Anvil** in a separate terminal:
   ```bash
   anvil
   ```

2. **Deploy with a short deadline** (Windows PowerShell):
   ```powershell
   $env:CAMPAIGN_TARGET_WEI = "100000000000000000" # 0.1 ETH
   $env:CAMPAIGN_DEADLINE = [string]([DateTimeOffset]::UtcNow.ToUnixTimeSeconds() + 120) # 2 minutes from now
   $env:CAMPAIGN_BENEFICIARY = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" # Anvil Account #1

   forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

   *(On macOS / Linux Bash:)*
   ```bash
   CAMPAIGN_TARGET_WEI=100000000000000000 \
   CAMPAIGN_DEADLINE=$(($(date +%s) + 120)) \
   CAMPAIGN_BENEFICIARY=0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
   forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

3. **Configure Frontend:**
   - In the frontend Header, click **Set Contract** and paste the deployed address.
   - Connect MetaMask to **Localhost 8545** (Chain ID `31337`).

4. **Pledge ETH:**
   - From Account #2, pledge `0.06 ETH`.
   - From Account #3, pledge `0.05 ETH`.
   - The UI shows `110%` progress: Target reached!

5. **Warp Time Past Deadline:**
   ```bash
   cast rpc evm_increaseTime 130 --rpc-url http://127.0.0.1:8545
   cast rpc evm_mine --rpc-url http://127.0.0.1:8545
   ```

6. **Collect Funds as Beneficiary:**
   - Switch wallet to Account #1 (`0x7099...`).
   - The **Beneficiary Payout Collection** card activates.
   - Click **Collect 0.11 ETH as Beneficiary**.
   - Status updates to `FUNDS COLLECTED (COMPLETED)`.
   - A second collection attempt will be rejected by the smart contract.

---

### Scenario B: Failed Campaign Flow with Dominant Assurance

1. **Deploy with a high target:**
   ```powershell
   $env:CAMPAIGN_TARGET_WEI = "1000000000000000000" # 1.0 ETH target
   $env:CAMPAIGN_DEADLINE = [string]([DateTimeOffset]::UtcNow.ToUnixTimeSeconds() + 120)
   forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

2. **Deposit Dominant Assurance Bonus:**
   - From Account #1 (Organizer), deposit `0.05 ETH` into the bonus pool via the **Dominant Assurance** card.

3. **Pledge Below Target:**
   - Alice pledges `0.2 ETH`.
   - Bob pledges `0.2 ETH`.
   - Total pledged is `0.4 ETH` (< `1.0 ETH` target).

4. **Warp Time Past Deadline:**
   ```bash
   cast rpc evm_increaseTime 130 --rpc-url http://127.0.0.1:8545
   cast rpc evm_mine --rpc-url http://127.0.0.1:8545
   ```

5. **Claim Independent Refunds:**
   - Switch to Alice: The **Refund Claim Interface** unlocks.
   - Shows:
     - Original Pledge: `0.2 ETH`
     - Dominant Assurance Bonus Share: `+0.025 ETH` (50% of the `0.05 ETH` pool)
     - Total Available to Claim: `0.225 ETH`
   - Click **Claim Refund**. ETH is safely credited back to Alice.
   - Duplicate refund attempts revert with `NoRefundableContribution()`.

---

## 8. Ethereum Sepolia Deployment

### Deployment Preparation

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set the configuration parameters in `.env`:
   ```ini
   SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
   PRIVATE_KEY=<YOUR_TESTNET_DEPLOYER_PRIVATE_KEY>
   CAMPAIGN_TARGET_WEI=100000000000000000 # 0.1 ETH
   CAMPAIGN_DEADLINE=1794000000            # Future Unix timestamp
   CAMPAIGN_BENEFICIARY=0xMeeraOrganizerAddress
   ETHERSCAN_API_KEY=<OPTIONAL_ETHERSCAN_KEY>
   ```

> [!CAUTION]
> Never commit your `.env` file or disclose testnet private keys. The `.gitignore` file is configured to exclude all `.env*` files automatically.

### Broadcast Command

**Windows PowerShell:**
```powershell
$env:SEPOLIA_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"
$env:PRIVATE_KEY = "<YOUR_PRIVATE_KEY>"
$env:CAMPAIGN_TARGET_WEI = "100000000000000000"
$env:CAMPAIGN_DEADLINE = "1794000000"
$env:CAMPAIGN_BENEFICIARY = "<BENEFICIARY_ADDRESS>"

forge script script/Deploy.s.sol --rpc-url $env:SEPOLIA_RPC_URL --broadcast --verify
```

**macOS / Linux:**
```bash
source .env
forge script script/Deploy.s.sol --rpc-url "$SEPOLIA_RPC_URL" --broadcast --verify
```

### Deployment Status

- **Status:** Ready for broadcast / Pending Deployer Gas
- **Sepolia Network:** Ethereum Sepolia (Chain ID `11155111`)
- **Manifest:** [deployments/sepolia.json](deployments/sepolia.json)
- Once broadcast, update `deployments/sepolia.json` and set `DEFAULT_SEPOLIA_ADDRESS` in `frontend/src/config/contract.ts`.

---

## 9. Security & Auditing Review

- **Reentrancy Protection:** Both `collect()` and `claimRefund()` utilize OpenZeppelin `ReentrancyGuard` and follow strict Checks-Effects-Interactions (CEI) where user balances and claim statuses are reset **before** external Ether transfers.
- **DoS Prevention:** Pull-pattern refund distribution prevents one malicious address from reverting a bulk payout.
- **Dust Handling:** Strict math ensures integer division truncation dust cannot remain trapped in the contract.
- **Access Control:** `collect()` strictly validates `msg.sender == beneficiary`.
- **Secret Scan:** Verified clean. No sensitive credentials, private keys, or API tokens exist in Git tracking.

---

## 10. Verification Commands

| Command | Environment | Description |
|---|---|---|
| `forge build` | Root | Compiles Solidity contracts with solc 0.8.24 |
| `forge test -vv` | Root | Runs all 31 unit, reentrancy, and edge-case tests |
| `forge fmt --check` | Root | Validates Solidity code formatting |
| `npm run lint` | `frontend/` | Runs Oxlint across all TypeScript and React files (0 warnings, 0 errors) |
| `npm run build` | `frontend/` | Type-checks and bundles production assets via Vite |

---

## 11. License

This project is licensed under the [MIT License](LICENSE).
