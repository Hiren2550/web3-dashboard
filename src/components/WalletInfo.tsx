"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useBalance,
  useChainId,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import Modal from "./Modal";
import SendETH from "./SendETH";

export default function WalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({
    address,
  });

  const {
    switchChain,
    isPending,
    isError: switchError,
    error: switchErrorDetails,
  } = useSwitchChain();

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center max-w-md w-full border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Wallet Disconnected</h3>
        <p className="text-slate-400 text-sm mb-4">Please connect your Web3 wallet to access account details and network balance.</p>
      </div>
    );
  }

  const isEthereum = chain?.id === mainnet.id;

  return (
    <>
      <div className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Top ambient highlight */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Connected Wallet</span>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              Account Status
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => disconnect()}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5">
            <span className="text-xs font-medium text-slate-400 block mb-1">Account Address</span>
            <p className="text-xs font-mono text-slate-200 break-all select-all">{address}</p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5">
            <span className="text-xs font-medium text-slate-400 block mb-1">Active Network</span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{chain?.name || "Unknown Network"}</p>
              <span className="text-xs text-slate-500 font-mono">ID: {chainId}</span>
            </div>
          </div>
        </div>

        {/* Balance Box */}
        <div className="bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-purple-900/20 rounded-2xl p-5 border border-indigo-500/20 my-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Native Balance</span>
          <div className="flex items-baseline gap-3 mt-1">
            {isLoading ? (
              <span className="text-xl text-slate-400 animate-pulse">Loading balance...</span>
            ) : isError ? (
              <span className="text-sm text-red-400">Failed to load balance</span>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {Number(balance?.formatted).toFixed(4)}
                </span>
                <span className="text-lg font-bold text-indigo-400">{balance?.symbol}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            disabled={isPending}
            onClick={() => {
              switchChain({ chainId: isEthereum ? sepolia.id : mainnet.id });
            }}
            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer text-center"
          >
            {isPending
              ? "Switching Network..."
              : isEthereum
              ? "Switch to Sepolia Network"
              : "Switch to Ethereum Mainnet"}
          </button>

          <button
            onClick={() => setIsSendModalOpen(true)}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold text-sm border border-sky-500/30 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Transaction (Modal)
          </button>
        </div>

        {switchError && (
          <p className="mt-4 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            Switch Error: {switchErrorDetails?.message}
          </p>
        )}
      </div>

      {/* Modal with Close Button */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Native ETH Transaction"
      >
        <SendETH isModal />
      </Modal>

    </>
  );
}
