"use client";

import { useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "@/contracts/erc20Abi";
import { TOKEN_CONTRACT_ADDRESS, DEFAULT_RECEIVER_ADDRESS } from "@/config/constants";

export default function TokenAllowance() {
  const { address, isConnected } = useAccount();
  const [spenderInput, setSpenderInput] = useState("");

  const contractAddr = TOKEN_CONTRACT_ADDRESS;

  const { data: decimals } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const { data: symbol } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const {
    data: allowanceRaw,
    isLoading,
    isRefetching,
    refetch,
  } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && spenderInput ? [address, spenderInput as `0x${string}`] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect wallet to view token spending allowance.
      </div>
    );
  }

  const formattedAllowance =
    allowanceRaw !== undefined && decimals !== undefined
      ? formatUnits(allowanceRaw, decimals)
      : "0";

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full border border-sky-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-sky-400">
            Read Smart Contract
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Check Token Allowance
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
            title="Refetch Allowance"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-sky-400" : "text-slate-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefetching ? "Checking..." : "Sync"}
          </button>
          <div className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/20">
            `allowance()` View
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Spender Address to Query
          </label>
          <input
            type="text"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="Enter spender address 0x..."
            value={spenderInput}
            onChange={(e) => setSpenderInput(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="py-4 text-center text-slate-400 text-sm animate-pulse">
            Querying contract allowance storage...
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Owner (You)</span>
              <span className="font-mono text-slate-300">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
              <span className="text-slate-400 font-medium">Spender</span>
              <span className="font-mono text-sky-400 break-all">
                {spenderInput ? `${spenderInput.slice(0, 6)}...${spenderInput.slice(-4)}` : "No Spender Entered"}
              </span>
            </div>

            <div className="pt-2 flex items-baseline justify-between">
              <span className="text-xs text-sky-300 font-bold uppercase tracking-wider">
                Approved Allowance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {formattedAllowance}
                </span>
                <span className="text-sm font-bold text-sky-400">
                  {symbol?.toString() || "USDC"}
                </span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 text-right">
              Raw Uint256: {allowanceRaw?.toString() || "0"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
