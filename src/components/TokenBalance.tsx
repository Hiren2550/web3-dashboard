"use client";

import { useAccount, useReadContract } from "wagmi";
import { tokenAbi } from "@/contracts/tokenAbi";
import { TOKEN_CONTRACT_ADDRESS } from "@/config/constants";

export default function TokenBalance() {
  const { address, isConnected } = useAccount();

  const contractAddr = TOKEN_CONTRACT_ADDRESS;

  const { data, isLoading, isError, isRefetching, refetch } = useReadContract({
    address: contractAddr,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect wallet to view token balance.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 w-full border border-purple-500/20 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
          Smart Contract Read
        </span>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="text-[10px] text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <svg className={`w-3 h-3 ${isRefetching ? "animate-spin text-purple-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefetching ? "Refetching..." : "Sync"}
        </button>
      </div>
      <h3 className="text-lg font-bold text-white mb-3">Live Token Balance</h3>

      {isLoading ? (
        <p className="text-sm text-slate-400 animate-pulse py-4">Reading balance from contract...</p>
      ) : isError ? (
        <p className="text-xs text-red-400 py-2">Failed to read smart contract balance.</p>
      ) : (
        <div className="py-2">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {data?.toString() || "0"}
          </span>
          <span className="text-xs text-slate-400 block mt-1 font-mono">
            Raw Contract Output
          </span>
        </div>
      )}
    </div>
  );
}
