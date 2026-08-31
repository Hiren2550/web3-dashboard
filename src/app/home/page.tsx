"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import WalletInfo from "@/components/WalletInfo";
import Modal from "@/components/Modal";
import SendETH from "@/components/SendETH";
import TransferToken from "@/components/TransferToken";
import ApproveToken from "@/components/ApproveToken";
import TransferFromToken from "@/components/TransferFromToken";
import DepositUSDC from "@/components/DepositUSDC";
import Link from "next/link";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { erc20Abi } from "@/contracts/erc20Abi";
import { usdcDepositAbi } from "@/contracts/usdcDepositAbi";
import { TOKEN_CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ADDRESS } from "@/config/constants";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [activeModal, setActiveModal] = useState<
    "eth" | "usdc" | "approve" | "transferFrom" | "deposit" | null
  >(null);

  const { data: ethBalance } = useBalance({
    address,
  });

  const depositContractAddr = DEPOSIT_CONTRACT_ADDRESS;
  const contractAddr = TOKEN_CONTRACT_ADDRESS;

  const { data: tokenSymbol } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: tokenDecimals } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const { data: rawBalance } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: userVaultDepositRaw } = useReadContract({
    address: depositContractAddr,
    abi: usdcDepositAbi,
    functionName: "deposits",
    args: address ? [address] : undefined,
  });

  const formattedUsdc =
    rawBalance !== undefined && tokenDecimals !== undefined
      ? formatUnits(rawBalance, tokenDecimals)
      : "0";

  const formattedVaultDeposit =
    userVaultDepositRaw !== undefined && tokenDecimals !== undefined
      ? formatUnits(userVaultDepositRaw, tokenDecimals)
      : "0";

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glow Effects */}
      <div className="ambient-glow top-[-100px] left-[-100px] bg-indigo-600"></div>
      <div className="ambient-glow bottom-[-100px] right-[-100px] bg-purple-600"></div>
      <div className="ambient-glow top-[40%] left-[50%] transform -translate-x-1/2 bg-sky-600"></div>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Ethereum & Sepolia Web3 Portal
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Web3 Wallet <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Manage native Ethereum balances, inspect ERC-20 smart contracts, and deposit USDC into the <code className="text-indigo-400 font-mono text-sm bg-slate-900 px-2 py-0.5 rounded">USDCDeposit</code> vault contract.
          </p>
        </div>

        {/* Connected Wallet Info Card */}
        <div className="flex justify-center">
          <WalletInfo />
        </div>

        {/* Navigation / Feature Cards Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Quick Navigation & Smart Contract Actions
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Select a feature card below to view detailed token balances and execute contract operations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Native ETH Balance & Transfer */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-500/20 flex flex-col justify-between relative group">
              <div className="absolute top-0 right-0 p-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Native ETH
                </span>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2L3 12l9 10 9-10-9-10z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2v20" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 eth-gradient-text">
                  Native ETH Page
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                  View native wallet balance, network details, and send ETH transactions.
                </p>

                {/* Quick Balance Preview */}
                {isConnected && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 mb-6 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">ETH Balance</span>
                    <span className="text-sm font-mono font-bold text-white">
                      {ethBalance ? `${Number(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}` : "---"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/eth"
                  className="w-full py-3 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-xs border border-sky-500/30 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-sky-500/10"
                >
                  Go to Native ETH Page
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <button
                  onClick={() => setActiveModal("eth")}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
                >
                  Send ETH Modal ⚡
                </button>
              </div>
            </div>

            {/* Card 2: USDC & ERC-20 Suite */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/20 flex flex-col justify-between relative group">
              <div className="absolute top-0 right-0 p-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ERC-20 Contract
                </span>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 usdc-gradient-text">
                  USDC Contract Suite
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                  Interact with ERC-20 contracts: `transfer`, `approve`, `allowance`, `transferFrom`.
                </p>

                {/* Quick Token Balance Preview */}
                {isConnected && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 mb-6 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">USDC Balance</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {formattedUsdc} {tokenSymbol?.toString() || "USDC"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/usdc"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/10"
                >
                  Go to Contract Hub
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveModal("usdc")}
                    className="flex-1 py-2 px-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[11px] border border-purple-500/30 transition-all cursor-pointer"
                  >
                    Transfer 💸
                  </button>
                  <button
                    onClick={() => setActiveModal("approve")}
                    className="flex-1 py-2 px-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-[11px] border border-indigo-500/30 transition-all cursor-pointer"
                  >
                    Approve 🔑
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: USDCDeposit Smart Contract Vault */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 flex flex-col justify-between relative group">
              <div className="absolute top-0 right-0 p-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Custom Vault
                </span>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 gradient-text">
                  USDCDeposit Vault Page
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                  Deposit USDC into the <code className="text-indigo-300 font-mono">USDCDeposit</code> contract (<code className="text-slate-300 font-mono text-[10px]">0x9857...7B3b</code>).
                </p>

                {/* Quick Vault Deposit Preview */}
                {isConnected && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 mb-6 flex items-center justify-between">
                    <span className="text-xs text-indigo-300 font-medium">Vault Deposit</span>
                    <span className="text-sm font-mono font-bold text-white">
                      {formattedVaultDeposit} {tokenSymbol?.toString() || "USDC"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/deposit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/10"
                >
                  Go to USDC Vault Page
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <button
                  onClick={() => setActiveModal("deposit")}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Quick Deposit Vault 🏦
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modals with Close Button ('✕') */}
      <Modal
        isOpen={activeModal === "eth"}
        onClose={() => setActiveModal(null)}
        title="Quick Send Native ETH"
      >
        <SendETH isModal />
      </Modal>

      <Modal
        isOpen={activeModal === "usdc"}
        onClose={() => setActiveModal(null)}
        title="Quick Transfer USDC Token"
      >
        <TransferToken isModal />
      </Modal>

      <Modal
        isOpen={activeModal === "approve"}
        onClose={() => setActiveModal(null)}
        title="Approve Spender Allowance"
      >
        <ApproveToken isModal />
      </Modal>

      <Modal
        isOpen={activeModal === "transferFrom"}
        onClose={() => setActiveModal(null)}
        title="Execute transferFrom (Spender Action)"
      >
        <TransferFromToken isModal />
      </Modal>

      <Modal
        isOpen={activeModal === "deposit"}
        onClose={() => setActiveModal(null)}
        title="Deposit USDC into Vault Contract"
      >
        <DepositUSDC isModal />
      </Modal>


      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10 mt-12">
        Web3 Wallet Application &bull; Powered by Next.js, Wagmi & RainbowKit
      </footer>
    </div>
  );
}
