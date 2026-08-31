"use client";

import Navbar from "@/components/Navbar";
import DepositUSDC from "@/components/DepositUSDC";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { erc20Abi } from "@/contracts/erc20Abi";
import { usdcDepositAbi } from "@/contracts/usdcDepositAbi";
import { TOKEN_CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ADDRESS } from "@/config/constants";

export default function DepositVaultPage() {
  const { address, isConnected } = useAccount();

  const depositContractAddr = DEPOSIT_CONTRACT_ADDRESS;
  const usdcTokenAddr = TOKEN_CONTRACT_ADDRESS;

  const { data: decimals } = useReadContract({
    address: usdcTokenAddr,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const { data: symbol } = useReadContract({
    address: usdcTokenAddr,
    abi: erc20Abi,
    functionName: "symbol",
  });

  // Individual user deposit
  const { data: userVaultDepositRaw } = useReadContract({
    address: depositContractAddr,
    abi: usdcDepositAbi,
    functionName: "deposits",
    args: address ? [address] : undefined,
  });

  // Total vault contract balance (All users combined)
  const { data: totalContractReserveRaw } = useReadContract({
    address: usdcTokenAddr,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [depositContractAddr],
  });

  const dec = decimals || 6;

  const formattedVaultDeposit =
    userVaultDepositRaw !== undefined ? formatUnits(userVaultDepositRaw, dec) : "0";

  const formattedTotalVaultReserve =
    totalContractReserveRaw !== undefined ? formatUnits(totalContractReserveRaw, dec) : "0";

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="ambient-glow top-[-100px] left-[-50px] bg-indigo-600"></div>
      <div className="ambient-glow bottom-[-100px] right-[-50px] bg-purple-600"></div>

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

          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            USDCDeposit Contract Portal
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            USDC Vault <span className="gradient-text">Deposit Page</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Deposit USDC tokens directly into the deployed `USDCDeposit` smart contract vault.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contract Architecture Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                  Contract Deployed Address
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  USDCDeposit Architecture
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-400 block">USDCDeposit Contract</span>
                  <span className="font-mono text-indigo-400 font-bold break-all select-all">
                    {depositContractAddr}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-400 block">Underlying IERC20 Token</span>
                  <span className="font-mono text-emerald-400 font-bold break-all select-all">
                    {usdcTokenAddr}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-purple-500/30">
                  <span className="text-xs text-purple-300 font-bold uppercase tracking-wider block mb-1">
                    Total Contract Reserve (All Users)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{formattedTotalVaultReserve}</span>
                    <span className="text-sm font-bold text-purple-400">{symbol?.toString() || "USDC"}</span>
                  </div>
                </div>

                {isConnected && (
                  <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30">
                    <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-1">
                      Your Personal Deposited Vault Balance
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">{formattedVaultDeposit}</span>
                      <span className="text-sm font-bold text-indigo-400">{symbol?.toString() || "USDC"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Solidity Code Breakdown */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Solidity Storage Mapping Mechanics
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The smart contract stores deposits in a mapping: <code className="text-indigo-300 font-mono">mapping(address =&gt; uint256) public deposits;</code>. When you deposit, it updates <code className="text-indigo-300 font-mono">deposits[msg.sender] += amount;</code>. Therefore, switching wallets changes <code className="text-indigo-300 font-mono">msg.sender</code> to query that specific wallet&apos;s individual balance.
              </p>
              <div className="bg-slate-950 p-4 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto border border-white/5">
                <pre>{`contract USDCDeposit {
    IERC20 public usdc;
    mapping(address => uint256) public deposits; // Tracks per wallet

    function deposit(uint256 amount) external {
        usdc.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount; // Specific to msg.sender
    }
}`}</pre>
              </div>
            </div>
          </div>

          {/* Deposit Form Component */}
          <div className="lg:col-span-6 flex justify-center">
            <DepositUSDC />
          </div>

        </div>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10 mt-12">
        Web3 Wallet Application &bull; USDCDeposit Vault Portal
      </footer>
    </div>
  );
}
