"use client";

import { useState, useEffect } from "react";
import { parseUnits, maxUint256 } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { erc20Abi } from "@/contracts/erc20Abi";
import { TOKEN_CONTRACT_ADDRESS, DEFAULT_RECEIVER_ADDRESS } from "@/config/constants";

export default function ApproveToken() {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("100");
  const [isUnlimited, setIsUnlimited] = useState(false);

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

  // Auto invalidate queries when approval is confirmed on chain
  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries();
    }
  }, [isConfirmed, queryClient]);

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect your wallet to approve token spending allowances.
      </div>
    );
  }

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spender) return;

    const approveAmount = isUnlimited
      ? maxUint256
      : parseUnits(amount || "0", decimals || 6);

    writeContract({
      address: contractAddr,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender as `0x${string}`, approveAmount],
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full border border-indigo-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Write Smart Contract
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Approve Spender Allowance
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
          `approve()` Function
        </div>
      </div>

      <form onSubmit={handleApprove} className="space-y-4 mt-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Spender Contract / Wallet Address
          </label>
          <input
            type="text"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="0x..."
            value={spender}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setSpender(e.target.value);
              handleClearError();
            }}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Approval Amount ({symbol?.toString() || "USDC"})
            </label>
            <div className="flex gap-1">
              {["10", "100", "500"].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setIsUnlimited(false);
                    setAmount(val);
                    handleClearError();
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                    !isUnlimited && amount === val
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsUnlimited(!isUnlimited);
                  handleClearError();
                }}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                  isUnlimited
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                Max / Unlimited ∞
              </button>
            </div>
          </div>

          <input
            type="text"
            disabled={isUnlimited}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono disabled:opacity-50"
            placeholder={isUnlimited ? "Unlimited (2^256 - 1)" : "100"}
            value={isUnlimited ? "Unlimited Allowance (Max uint256)" : amount}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setAmount(e.target.value);
              handleClearError();
            }}
            required={!isUnlimited}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !spender}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer mt-2"
        >
          {isPending
            ? "Confirm Approval in Wallet..."
            : isConfirming
            ? "Executing Approval on Chain..."
            : `Approve ${isUnlimited ? "Unlimited" : (amount || "0") + " " + (symbol?.toString() || "USDC")}`}
        </button>
      </form>

      {hash && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Approve Tx Hash</span>
            <span className="text-indigo-400 font-mono break-all">{hash.slice(0, 12)}...{hash.slice(-8)}</span>
          </div>

          {isConfirming && (
            <p className="text-amber-400 font-medium animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Waiting for blockchain approval confirmation...
            </p>
          )}

          {isConfirmed && (
            <p className="text-emerald-400 font-semibold flex items-center gap-2">
              <span>Approval Confirmed & Allowance Updated ✅</span>
            </p>
          )}
        </div>
      )}

      {isError && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
          <span>Approve Error: {error?.message}</span>
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
