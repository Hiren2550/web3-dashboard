"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

export default function Navbar() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEthereum = chain?.id === mainnet.id;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center space-x-8">
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-black gradient-text">W3</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                  Web3 Wallet
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  Dashboard Hub
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/home"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  pathname === "/home" || pathname === "/"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/eth"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/eth"
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Native ETH
              </Link>
              <Link
                href="/usdc"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/usdc"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                USDC Contract
              </Link>
              <Link
                href="/deposit"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/deposit"
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                USDC Vault
              </Link>
            </nav>
          </div>

          {/* Account Details & Wallet Actions */}
          <div className="flex items-center gap-3">
            {isConnected && address ? (
              <div className="flex items-center gap-3 flex-wrap justify-end">
                
                {/* Network Indicator & Switch Button */}
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-slate-300 font-semibold">
                    {chain?.name || `Chain ${chainId}`}
                  </span>

                  <button
                    disabled={isSwitching}
                    onClick={() => {
                      switchChain({ chainId: isEthereum ? sepolia.id : mainnet.id });
                    }}
                    className="ml-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
                    title={isEthereum ? "Switch to Sepolia testnet" : "Switch to Ethereum Mainnet"}
                  >
                    {isSwitching
                      ? "Switching..."
                      : isEthereum
                      ? "Switch to Sepolia"
                      : "Switch to Ethereum"}
                  </button>
                </div>

                {/* Account Pill with Copy */}
                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <button
                    onClick={copyAddress}
                    className="text-xs font-mono text-slate-200 hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Click to copy address"
                  >
                    {formatAddress(address)}
                    <span className="text-[10px] text-slate-400">
                      {copied ? "✓ Copied" : "📋"}
                    </span>
                  </button>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Disconnect
                </button>
              </div>
            ) : (
              <ConnectButton showBalance={false} chainStatus="icon" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
