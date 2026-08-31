"use client";

import { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { erc20Abi } from "@/contracts/erc20Abi";
import { TOKEN_CONTRACT_ADDRESS, DEFAULT_RECEIVER_ADDRESS } from "@/config/constants";

interface TransferFromTokenProps {
  isModal?: boolean;
}

export default function TransferFromToken({ isModal = false }: TransferFromTokenProps) {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("1");

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

  // Query allowance granted by fromAddress to current connected wallet (address)
  const { data: allowanceRaw, isRefetching: isAllowanceLoading } = useReadContract({
    address: contractAddr,
    abi: erc20Abi,
    functionName: "allowance",
    args: fromAddress && address ? [fromAddress as `0x${string}`, address] : undefined,
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

  // Auto invalidate queries when transferFrom succeeds
  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries();
    }
  }, [isConfirmed, queryClient]);

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect your wallet as a spender to execute `transferFrom`.
      </div>
    );
  }

  const formattedAllowance =
    allowanceRaw !== undefined && decimals !== undefined
      ? formatUnits(allowanceRaw, decimals)
      : "0";

  const handleTransferFrom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAddress || !toAddress || !tokenAmount) return;

    writeContract({
      address: contractAddr,
      abi: erc20Abi,
      functionName: "transferFrom",
      args: [
        fromAddress as `0x${string}`,
        toAddress as `0x${string}`,
        parseUnits(tokenAmount, decimals || 6),
      ],
    });
  };

  const content = (
    <>
      {!isModal && (
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-pink-400">
              Write Smart Contract (Spender Action)
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Execute `transferFrom()`
            </h2>
          </div>
          <div className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-semibold border border-pink-500/20">
            Spender Transfer
          </div>
        </div>
      )}


      <form onSubmit={handleTransferFrom} className="space-y-4 mt-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Token Owner (`from` address that approved you)
          </label>
          <input
            type="text"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-pink-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="0x... (Owner address)"
            value={fromAddress}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setFromAddress(e.target.value);
              handleClearError();
            }}
            required
          />
        </div>

        {/* Live Allowance Status Badge */}
        {fromAddress && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Your Approved Allowance</span>
            <span className="font-mono font-bold text-pink-400">
              {isAllowanceLoading ? "Checking..." : `${formattedAllowance} ${symbol?.toString() || "USDC"}`}
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Recipient (`to` address)
          </label>
          <input
            type="text"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-pink-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="0x... (Recipient address)"
            value={toAddress}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setToAddress(e.target.value);
              handleClearError();
            }}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Amount to Transfer ({symbol?.toString() || "USDC"})
          </label>
          <input
            type="number"
            min="0.000001"
            step="0.000001"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-pink-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
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
          disabled={isPending || isConfirming || !fromAddress || !toAddress || !tokenAmount}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 transition-all disabled:opacity-50 cursor-pointer mt-2"
        >
          {isPending
            ? "Confirm transferFrom in Wallet..."
            : isConfirming
            ? "Executing transferFrom on Chain..."
            : `Execute transferFrom (${tokenAmount || "0"} ${symbol?.toString() || "USDC"})`}
        </button>
      </form>

      {hash && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-pink-500/30 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">transferFrom Tx Hash</span>
            <span className="text-pink-400 font-mono break-all">{hash.slice(0, 12)}...{hash.slice(-8)}</span>
          </div>

          {isConfirming && (
            <p className="text-amber-400 font-medium animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Broadcasting transferFrom to network...
            </p>
          )}

          {isConfirmed && (
            <p className="text-emerald-400 font-semibold flex items-center gap-2">
              <span>transferFrom Executed Successfully ✅</span>
            </p>
          )}
        </div>
      )}

    </>
  );

  if (isModal) {
    return <div className="w-full space-y-4">{content}</div>;
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full border border-pink-500/20 shadow-2xl relative overflow-hidden">
      {content}
    </div>
  );
}

