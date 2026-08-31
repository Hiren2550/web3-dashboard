"use client";

import Navbar from "@/components/Navbar";
import TokenBalance from "@/components/TokenBalance";
import TokenInfo from "@/components/TokenInfo";
import TransferToken from "@/components/TransferToken";
import ApproveToken from "@/components/ApproveToken";
import TokenAllowance from "@/components/TokenAllowance";
import TransferFromToken from "@/components/TransferFromToken";
import Link from "next/link";

export default function UsdcContractPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="ambient-glow top-[-100px] right-[-50px] bg-emerald-600"></div>
      <div className="ambient-glow bottom-[-100px] left-[-50px] bg-purple-600"></div>
      <div className="ambient-glow top-[40%] left-[30%] bg-indigo-600"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-10">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Full ERC-20 Smart Contract Suite
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            USDC & <span className="usdc-gradient-text">Smart Contract</span> Hub
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
            Complete smart contract suite for standard ERC-20 tokens. Read contract storage (`name`, `symbol`, `decimals`, `balanceOf`, `allowance`) and execute state-changing functions (`transfer`, `approve`, `transferFrom`).
          </p>
        </div>

        {/* Section 1: Read Contract Storage Methods */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-400"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              1. Read Smart Contract Methods (`view`)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <TokenInfo />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <TokenBalance />
              <TokenAllowance />
            </div>
          </div>
        </div>

        {/* Section 2: Write Smart Contract Methods */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              2. Write Smart Contract Methods (`nonpayable`)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <TransferToken />
            <ApproveToken />
            <TransferFromToken />
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10 mt-12">
        Web3 Wallet Application &bull; ERC-20 Contract Suite
      </footer>
    </div>
  );
}
