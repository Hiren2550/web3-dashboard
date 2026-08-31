"use client";

import { useState } from "react";
import { formatEther, formatGwei, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { DEFAULT_RECEIVER_ADDRESS } from "@/config/constants";

interface SendETHProps {
  isModal?: boolean;
}

export default function SendETH({ isModal = false }: SendETHProps) {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");

  const {
    data: hash,
    sendTransaction,
    isPending,
    isError,
    error,
    reset,
  } = useSendTransaction();

  const handleClearError = () => {
    if (isError) reset();
  };

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect your wallet to send native ETH.
      </div>
    );
  }

  const gasCost = receipt
    ? receipt.gasUsed * receipt.effectiveGasPrice
    : undefined;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    });
  };

  const content = (
    <>
      {!isModal && (
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-sky-400">
              ETH Transfer
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Send Native ETH
            </h2>
          </div>
          <div className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/20">
            Native Currency
          </div>
        </div>
      )}

      {/* Balance Summary */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Available Balance</span>
        <span className="text-sm font-bold text-white font-mono">
          {ethBalance ? `${Number(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}` : "Loading..."}
        </span>
      </div>


      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
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
              Amount (ETH)
            </label>
            <div className="flex gap-1">
              {["0.001", "0.005", "0.01"].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    handleClearError();
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="0.001"
            value={amount}
            onFocus={handleClearError}
            onClick={handleClearError}
            onChange={(e) => {
              setAmount(e.target.value);
              handleClearError();
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !recipient || !amount}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer mt-2"
        >
          {isPending
            ? "Confirming in Wallet..."
            : isConfirming
            ? "Broadcasting Transaction..."
            : `Send ${amount || "0"} ETH`}
        </button>
      </form>

      {/* Transaction Details */}
      {hash && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Tx Hash</span>
            <span className="text-sky-400 font-mono break-all">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
          </div>

          {isConfirming && (
            <p className="text-amber-400 font-medium animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Waiting for blockchain confirmation...
            </p>
          )}

          {isConfirmed && receipt && (
            <div className="pt-2 border-t border-white/10 space-y-1.5 text-slate-300">
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Status</span>
                <span>Transaction Confirmed ✅</span>
              </div>
              <div className="flex justify-between">
                <span>Block Number</span>
                <span className="font-mono text-white">{receipt.blockNumber.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Gas Price</span>
                <span className="font-mono text-white">{formatGwei(receipt.effectiveGasPrice)} Gwei</span>
              </div>
              {gasCost !== undefined && (
                <div className="flex justify-between">
                  <span>Gas Fee</span>
                  <span className="font-mono text-white">{formatEther(gasCost)} ETH</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </>
  );

  if (isModal) {
    return <div className="w-full space-y-4">{content}</div>;
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-xl border border-sky-500/20 shadow-2xl relative overflow-hidden">
      {content}
    </div>
  );
}

