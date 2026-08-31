"use client";

import Navbar from "@/components/Navbar";
import SendETH from "@/components/SendETH";
import Link from "next/link";
import { useAccount, useBalance, useChainId } from "wagmi";

export default function NativeEthPage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="ambient-glow top-[-100px] left-[-50px] bg-sky-600"></div>
      <div className="ambient-glow bottom-[-100px] right-[-50px] bg-indigo-600"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8">
        
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

          <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            Native Layer 1 Token
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Native <span className="eth-gradient-text">ETH Balance</span> & Transfer
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Detailed information regarding your native Ethereum holdings, gas tracking, and transaction signing on the current network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Information & Wallet Details Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl relative overflow-hidden">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-400 block mb-1">
                Account Information
              </span>
              <h2 className="text-2xl font-bold text-white mb-6">Native ETH Summary</h2>

              {isConnected ? (
                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs text-slate-400 block mb-1">Connected Address</span>
                    <span className="text-xs font-mono text-slate-200 break-all select-all">{address}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5">
                      <span className="text-xs text-slate-400 block mb-1">Active Network</span>
                      <span className="text-sm font-semibold text-white">{chain?.name || "Unknown"}</span>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5">
                      <span className="text-xs text-slate-400 block mb-1">Chain ID</span>
                      <span className="text-sm font-mono font-bold text-sky-400">{chainId}</span>
                    </div>
                  </div>

                  {/* Large Balance Display */}
                  <div className="bg-gradient-to-br from-sky-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-sky-500/30">
                    <span className="text-xs text-sky-300 font-bold uppercase tracking-wider block mb-1">
                      Total ETH Balance
                    </span>
                    <div className="flex items-baseline gap-3">
                      {isBalanceLoading ? (
                        <span className="text-2xl text-slate-400 animate-pulse">Loading ETH...</span>
                      ) : (
                        <>
                          <span className="text-4xl font-black text-white tracking-tight">
                            {Number(balance?.formatted).toFixed(5)}
                          </span>
                          <span className="text-xl font-bold text-sky-400">{balance?.symbol}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Please connect your wallet to view native balance information.
                </div>
              )}
            </div>

            {/* Information Box */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Native ETH
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ether (ETH) is the native cryptocurrency of the Ethereum network. Unlike ERC-20 smart contract tokens, native ETH transfers do not require contract call approvals and execute standard 21,000 gas transfer transactions.
              </p>
            </div>
          </div>

          {/* Send ETH Form */}
          <div className="lg:col-span-6 flex justify-center">
            <SendETH />
          </div>

        </div>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10 mt-12">
        Web3 Wallet Application &bull; Native ETH Interface
      </footer>
    </div>
  );
}
