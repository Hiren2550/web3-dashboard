# 🌐 Web3 Wallet Hub & Smart Contract Suite

A modern, high-performance Web3 Wallet Dashboard built with **Next.js 16 (App Router)**, **TypeScript**, **TailwindCSS**, **Wagmi v2**, **Viem**, and **RainbowKit**. 

This application provides native Ethereum balance management, a complete ERC-20 smart contract interaction suite (`transfer`, `approve`, `allowance`, `transferFrom`), and a custom **`USDCDeposit`** vault integration.

---

## ✨ Features

- 🎨 **Dark Mode Glassmorphism Aesthetics**: Sleek dark aesthetic (`#07090e`) with glowing radial gradients, ambient mesh backdrop blur, and custom typography.
- ⚡ **Global Wallet Header (`Navbar`)**:
  - Displays connected wallet address with quick copy-to-clipboard functionality.
  - Active network badge (Ethereum Mainnet / Sepolia Testnet) with live status dot.
  - One-click **"Switch to Ethereum / Sepolia"** network switcher.
  - **Disconnect** button & RainbowKit `ConnectButton`.
- 💎 **Native ETH Page (`/eth`)**:
  - Real-time native ETH wallet balance, network details, and chain ID.
  - Form to send ETH transactions with recipient input, quick amount selectors, gas price estimation, and confirmed block receipts.
- 📜 **Full ERC-20 Contract Suite (`/usdc`)**:
  - **Read Methods (`view`)**: `name`, `symbol`, `decimals`, `balanceOf`, `allowance`.
  - **Write Methods (`nonpayable`)**: 
    - `transfer(to, value)`: Direct token transfers.
    - `approve(spender, amount)`: Authorizes spenders with preset options or Unlimited Max Allowance (`2^256 - 1`).
    - `transferFrom(from, to, value)`: Spender token transfers utilizing granted allowances.
- 🏦 **USDC Deposit Vault (`/deposit`)**:
  - Integrated with deployed `USDCDeposit` smart contract (`0x985723B94888e3fE8F1fEEF70aC61F48E6307B3b`).
  - Interactive **2-Step Flow**:
    1. **Step 1: Approve Vault Contract**
    2. **Step 2: Deposit USDC into Vault**
  - Live displays for **Your Personal Deposit** (`deposits[msg.sender]`) and **Total Contract Reserve / TVL** (`balanceOf(USDCDepositContract)`).
- 🪟 **Interactive Modals with Close Button**:
  - Reusable modal component (`Modal.tsx`) featuring an explicit **Close button (`✕`)**, backdrop overlay click-to-close, and `Escape` key listener.
- 🔄 **Real-Time Data Syncing**:
  - Automatic query cache invalidation via `@tanstack/react-query` as soon as transactions are confirmed on-chain.
  - Manual **Sync / Refresh** buttons on all balance cards.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Web3 / Ethereum**: 
  - [Wagmi v2](https://wagmi.sh/)
  - [Viem v2](https://viem.sh/)
  - [RainbowKit v2](https://www.rainbowkit.com/)
  - [TanStack React Query v5](https://tanstack.com/query)

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── deposit/       # USDC Vault Deposit Page (/deposit)
│   ├── eth/           # Native ETH Page (/eth)
│   ├── home/          # Main Dashboard Page (/home & /)
│   ├── usdc/          # ERC-20 Smart Contract Hub (/usdc)
│   ├── globals.css    # Web3 theme, glassmorphism & ambient glow styles
│   ├── icon.svg       # Custom Web3 SVG Favicon
│   └── layout.tsx     # Root layout with Web3 providers & metadata
├── components/
│   ├── ApproveToken.tsx       # ERC-20 approve() component
│   ├── DepositUSDC.tsx        # USDCDeposit vault component
│   ├── Modal.tsx              # Reusable Modal dialog with Close button (✕)
│   ├── Navbar.tsx             # Global top navigation header
│   ├── SendETH.tsx            # Native ETH transaction component
│   ├── TokenAllowance.tsx     # ERC-20 allowance() view component
│   ├── TokenBalance.tsx       # ERC-20 balanceOf() view component
│   ├── TokenInfo.tsx          # ERC-20 metadata view component
│   ├── TransferFromToken.tsx  # ERC-20 transferFrom() component
│   ├── TransferToken.tsx      # ERC-20 transfer() component
│   └── WalletInfo.tsx         # Account status & network summary widget
├── config/
│   ├── constants.ts   # Centralized contract addresses & env constants
│   └── wagmi.ts       # Wagmi & RainbowKit chain configuration
├── contracts/
│   ├── erc20Abi.ts       # ERC-20 smart contract ABI
│   ├── tokenAbi.ts       # Token contract ABI
│   └── usdcDepositAbi.ts # USDCDeposit smart contract ABI
└── providers/
    └── Web3Provider.tsx  # Wagmi, RainbowKit & React Query provider wrapper
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory of the project:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
NEXT_PUBLIC_DEPOSIT_CONTRACT_ADDRESS="0x985723B94888e3fE8F1fEEF70aC61F48E6307B3b"
NEXT_PUBLIC_RECEIVER_ADDRESS="0xd9BFCa8aA39e123Bb07e733B66b5792E6Eb302AB"
```

---

## 🚀 Getting Started

1. **Clone the Repository & Install Dependencies**:
   ```bash
   git clone <repository_url>
   cd web3-wallet-app
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📜 Smart Contract References

- **USDC ERC-20 Token Contract**: [`0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`](file:///.env)
- **USDCDeposit Vault Contract**: [`0x985723B94888e3fE8F1fEEF70aC61F48E6307B3b`](file:///.env)

---

## 📄 License

This project is open-source under the MIT License.
