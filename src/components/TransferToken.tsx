"use client";

import { useState, useEffect } from "react";
import { parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { erc20Abi } from "@/contracts/erc20Abi";
import { TOKEN_CONTRACT_ADDRESS, DEFAULT_RECEIVER_ADDRESS } from "@/config/constants";

export default function TransferToken() {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const [recipient, setRecipient] = useState("");
  const [tokenAmount, setTokenAmount] = useState("1");

  const contractAddr = TOKEN_CONTRACT_ADDRESS;

  const { data: decimals } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const {
    data: hash,
    writeContract,
    isPending,
    isError,
    error,
    reset,
  } = useWriteContract();

  const handleClearError = () => {
    if (isError) reset();
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Automatically invalidate & refetch all token balance queries once transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries();
    }
  }, [isConfirmed, queryClient]);

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect your wallet first to execute contract write operations.
      </div>
    );
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !tokenAmount) return;

    writeContract({
      address: contractAddr,
      abi: erc20Abi,
      functionName: "transfer",
      args: [recipient as `0x${string}`, parseUnits(tokenAmount, decimals || 6)],
    });
  };

  const handleManualRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full border border-purple-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
            Write Smart Contract
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Transfer Token (USDC)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
            title="Force refresh all contract queries"
          >
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Balance
          </button>
          <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
            `transfer()`
          </div>
        </div>
      </div>

      <form onSubmit={handleTransfer} className="space-y-4 mt-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="0x..."
            value={recipient}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setRecipient(e.target.value);
              handleClearError();
            }}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Amount (USDC)
            </label>
            <div className="flex gap-1">
              {["1", "5", "10", "21"].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setTokenAmount(val);
                    handleClearError();
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  {val} USDC
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            min="0.000001"
            step="0.000001"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="1.0"
            value={tokenAmount}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setTokenAmount(e.target.value);
              handleClearError();
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !recipient || !tokenAmount}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 cursor-pointer mt-2"
        >
          {isPending
            ? "Confirm Smart Contract Call in Wallet..."
            : isConfirming
            ? "Executing Transfer on Chain..."
            : `Execute Transfer of ${tokenAmount || "0"} USDC`}
        </button>
      </form>

      {hash && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Contract Tx Hash</span>
            <span className="text-purple-400 font-mono break-all">{hash.slice(0, 12)}...{hash.slice(-8)}</span>
          </div>

          {isConfirming && (
            <p className="text-amber-400 font-medium animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Waiting for contract execution confirmation...
            </p>
          )}

          {isConfirmed && (
            <div className="space-y-2">
              <p className="text-emerald-400 font-semibold flex items-center gap-2">
                <span>Token Transfer Confirmed & Balances Updated ✅</span>
              </p>
              <button
                type="button"
                onClick={handleManualRefresh}
                className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-colors cursor-pointer"
              >
                🔄 Refresh Token Info Now
              </button>
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
          <span>Smart Contract Error: {error?.message}</span>
          <button
            type="button"
            onClick={handleClearError}
            className="text-red-400 hover:text-white font-bold ml-2 cursor-pointer"
            title="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
