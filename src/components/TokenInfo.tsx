"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { erc20Abi } from "@/contracts/erc20Abi";
import { TOKEN_CONTRACT_ADDRESS } from "@/config/constants";

export default function TokenInfo() {
  const { address, isConnected } = useAccount();

  const contractAddr = TOKEN_CONTRACT_ADDRESS;

  const { data: name, isLoading: nameLoading, refetch: refetchName } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "name",
  });

  const { data: symbol, isLoading: symbolLoading, refetch: refetchSymbol } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: decimals, isLoading: decimalsLoading, refetch: refetchDecimals } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const {
    data: rawBalance,
    isLoading: balanceLoading,
    isRefetching: balanceRefetching,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect wallet to inspect smart contract token data.
      </div>
    );
  }

  const isLoading = nameLoading || symbolLoading || decimalsLoading || balanceLoading;

  const formattedBalance =
    rawBalance !== undefined && decimals !== undefined
      ? formatUnits(rawBalance, decimals)
      : "0";

  const handleRefreshAll = () => {
    refetchName();
    refetchSymbol();
    refetchDecimals();
    refetchBalance();
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full border border-emerald-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
            ERC-20 Smart Contract
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Token Contract Metadata
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            disabled={balanceRefetching}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
            title="Refresh Token Info from Blockchain"
          >
            <svg
              className={`w-3.5 h-3.5 ${balanceRefetching ? "animate-spin text-emerald-400" : "text-slate-400"}`}
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
            {balanceRefetching ? "Refreshing..." : "Refresh"}
          </button>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
            Read Contract
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Contract Address</span>
        <span className="text-xs font-mono text-emerald-400 truncate max-w-[200px]">
          {contractAddr}
        </span>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-slate-400 animate-pulse text-sm">
          Reading contract storage from blockchain...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block mb-1">Token Name</span>
            <span className="text-lg font-bold text-white">{name?.toString() || "USDC"}</span>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block mb-1">Ticker Symbol</span>
            <span className="text-lg font-bold text-emerald-400">{symbol?.toString() || "USDC"}</span>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block mb-1">Decimals</span>
            <span className="text-lg font-bold text-white">{decimals?.toString() || "6"}</span>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium block mb-1">Raw Balance (Wei)</span>
            <span className="text-sm font-mono text-slate-300 break-all">
              {rawBalance?.toString() || "0"}
            </span>
          </div>

          <div className="sm:col-span-2 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-emerald-500/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Formatted Token Balance
              </span>
              <button
                onClick={() => refetchBalance()}
                className="text-[10px] text-slate-400 hover:text-emerald-300 transition-colors"
              >
                Sync Now 🔄
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{formattedBalance}</span>
              <span className="text-sm font-bold text-emerald-400">{symbol?.toString() || "USDC"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
