"use client";

import { useState, useEffect } from "react";
import { formatUnits, parseUnits, maxUint256 } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { erc20Abi } from "@/contracts/erc20Abi";
import { usdcDepositAbi } from "@/contracts/usdcDepositAbi";
import { TOKEN_CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ADDRESS } from "@/config/constants";

export default function DepositUSDC() {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const [depositAmount, setDepositAmount] = useState("5");

  const depositContractAddr = DEPOSIT_CONTRACT_ADDRESS;
  const usdcTokenAddr = TOKEN_CONTRACT_ADDRESS;

  // Read USDC decimals and symbol
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

  // Read user's USDC balance in wallet
  const { data: walletBalanceRaw } = useReadContract({
    address: usdcTokenAddr,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Read user's existing vault deposit in USDCDeposit contract (specific to msg.sender)
  const { data: userVaultDepositRaw, isLoading: isDepositLoading } = useReadContract({
    address: depositContractAddr,
    abi: usdcDepositAbi,
    functionName: "deposits",
    args: address ? [address] : undefined,
  });

  // Read TOTAL USDC locked inside the USDCDeposit contract across ALL wallets (TVL)
  const { data: totalContractReserveRaw } = useReadContract({
    address: usdcTokenAddr,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [depositContractAddr],
  });

  // Read allowance granted to USDCDeposit contract by connected user
  const { data: allowanceRaw } = useReadContract({
    address: usdcTokenAddr,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, depositContractAddr] : undefined,
  });

  // Contract write actions: Approve & Deposit
  const {
    data: approveHash,
    writeContract: writeApprove,
    isPending: isApprovePending,
    isError: isApproveError,
    error: approveError,
  } = useWriteContract();

  const {
    data: depositHash,
    writeContract: writeDeposit,
    isPending: isDepositPending,
    isError: isDepositError,
    error: depositError,
  } = useWriteContract();

  // Transaction confirmations
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } =
    useWaitForTransactionReceipt({ hash: depositHash });

  // Invalidate & refresh all queries on transaction confirmation or wallet account switch
  useEffect(() => {
    if (isApproveConfirmed || isDepositConfirmed || address) {
      queryClient.invalidateQueries();
    }
  }, [isApproveConfirmed, isDepositConfirmed, address, queryClient]);

  if (!isConnected) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        Connect your wallet to deposit USDC into the USDCDeposit smart contract.
      </div>
    );
  }

  const dec = decimals || 6;
  const parsedAmount = parseUnits(depositAmount || "0", dec);

  const formattedWalletBalance =
    walletBalanceRaw !== undefined ? formatUnits(walletBalanceRaw, dec) : "0";

  const formattedVaultDeposit =
    userVaultDepositRaw !== undefined ? formatUnits(userVaultDepositRaw, dec) : "0";

  const formattedTotalVaultReserve =
    totalContractReserveRaw !== undefined ? formatUnits(totalContractReserveRaw, dec) : "0";

  const currentAllowance = allowanceRaw !== undefined ? allowanceRaw : BigInt(0);
  const needsApproval = currentAllowance < parsedAmount;

  const isUnlimitedAllowance = currentAllowance > maxUint256 / BigInt(2);

  const formattedCurrentAllowance = isUnlimitedAllowance
    ? "Unlimited (MaxUint256)"
    : `${Number(formatUnits(currentAllowance, dec)).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${symbol?.toString() || "USDC"}`;

  const calcRemainingAllowance =
    currentAllowance >= parsedAmount ? currentAllowance - parsedAmount : BigInt(0);

  const formattedRemainingAllowance = isUnlimitedAllowance
    ? "Unlimited"
    : `${Number(formatUnits(calcRemainingAllowance, dec)).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${symbol?.toString() || "USDC"}`;

  // Handle Step 1: Approve Vault Contract (Exact vs Max Allowance)
  const handleApprove = (useMaxAllowance: boolean = false) => {
    if (!depositAmount && !useMaxAllowance) return;
    const amountToApprove = useMaxAllowance ? maxUint256 : parsedAmount;

    writeApprove({
      address: usdcTokenAddr,
      abi: erc20Abi,
      functionName: "approve",
      args: [depositContractAddr, amountToApprove],
    });
  };

  // Handle Step 2: Deposit into Vault Contract
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;
    writeDeposit({
      address: depositContractAddr,
      abi: usdcDepositAbi,
      functionName: "deposit",
      args: [parsedAmount],
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Smart Contract Vault
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            USDC Vault Deposit
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
          `USDCDeposit`
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="my-6 space-y-2">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Vault Contract Address</span>
          <span className="font-mono text-indigo-400 truncate max-w-[200px]">
            {depositContractAddr}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">USDC Token Address</span>
          <span className="font-mono text-emerald-400 truncate max-w-[200px]">
            {usdcTokenAddr}
          </span>
        </div>
      </div>

      {/* Vault & Wallet Balance Displays (Individual Deposit vs Total Vault TVL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Connected Wallet Personal Deposit */}
        <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">
              Your Personal Deposit
            </span>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
              msg.sender
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {isDepositLoading ? "..." : formattedVaultDeposit}
            </span>
            <span className="text-xs font-bold text-indigo-400">{symbol?.toString() || "USDC"}</span>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">
            Your Wallet Balance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formattedWalletBalance}</span>
            <span className="text-xs font-bold text-emerald-400">{symbol?.toString() || "USDC"}</span>
          </div>
        </div>

        {/* Total Vault TVL (All Users Combined) */}
        <div className="sm:col-span-2 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-purple-500/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-purple-300 font-bold uppercase tracking-wider">
              Total Contract Reserve (All Wallets Combined)
            </span>
            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
              balanceOf(Vault)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{formattedTotalVaultReserve}</span>
            <span className="text-sm font-bold text-purple-400">{symbol?.toString() || "USDC"}</span>
          </div>
        </div>

        {/* Current Granted Allowance Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 p-4 rounded-2xl border border-amber-500/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              Allowance
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              allowance()
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-white font-mono truncate">
              {formattedCurrentAllowance}
            </span>
          </div>
        </div>

        {/* Estimated Remaining Allowance Card */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-4 rounded-2xl border border-indigo-500/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">
              Remaining Allowance
            </span>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              After Deposit
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-white font-mono truncate">
              {formattedRemainingAllowance}
            </span>
          </div>
        </div>
      </div>

      {/* Form & 2-Step Deposit Buttons */}
      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Deposit Amount ({symbol?.toString() || "USDC"})
            </label>
            <div className="flex gap-1">
              {["1", "5", "10", "21"].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  {val} {symbol?.toString() || "USDC"}
                </button>
              ))}
            </div>
          </div>

          <input
            type="number"
            min="0.000001"
            step="0.000001"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono"
            placeholder="5.0"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
          />
        </div>

        {/* Status Alert & Allowance Details */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Vault Allowance Status:</span>
            {needsApproval ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Step 1 Approval Required
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ Approved & Ready for Deposit
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block font-medium">Total Granted Allowance:</span>
              <span className="font-mono font-bold text-amber-300 truncate block mt-0.5">
                {formattedCurrentAllowance}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Est. Remaining Allowance:</span>
              <span className="font-mono font-bold text-indigo-300 truncate block mt-0.5">
                {formattedRemainingAllowance}
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Approve Buttons (Exact Amount or Unlimited Max Allowance) */}
        {needsApproval ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleApprove(false)}
              disabled={isApprovePending || isApproveConfirming || !depositAmount}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isApprovePending
                ? "Confirm Approval in Wallet..."
                : isApproveConfirming
                ? "Executing Approval on Chain..."
                : `Step 1: Approve Exact ${depositAmount} USDC`}
            </button>
            <button
              type="button"
              onClick={() => handleApprove(true)}
              disabled={isApprovePending || isApproveConfirming}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚡</span> Approve Unlimited Max Allowance (Skip Step 1 for Future Deposits)
            </button>
          </div>
        ) : (
          /* Step 2: Deposit Button */
          <button
            type="submit"
            disabled={isDepositPending || isDepositConfirming || !depositAmount}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isDepositPending
              ? "Confirm Deposit in Wallet..."
              : isDepositConfirming
              ? "Executing Vault Deposit on Chain..."
              : `Step 2: Deposit ${depositAmount} USDC into Vault`}
          </button>
        )}
      </form>

      {/* Approve Transaction Status */}
      {approveHash && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Approve Tx Hash</span>
            <span className="text-amber-400 font-mono break-all">{approveHash.slice(0, 10)}...{approveHash.slice(-8)}</span>
          </div>
          {isApproveConfirmed && (
            <p className="text-emerald-400 font-bold">Step 1 Approval Confirmed! Proceed to Deposit ✅</p>
          )}
        </div>
      )}

      {/* Deposit Transaction Status */}
      {depositHash && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Deposit Tx Hash</span>
            <span className="text-indigo-400 font-mono break-all">{depositHash.slice(0, 10)}...{depositHash.slice(-8)}</span>
          </div>
          {isDepositConfirmed && (
            <p className="text-emerald-400 font-bold">Deposit Executed Successfully & Vault Balance Updated! 🎉</p>
          )}
        </div>
      )}

      {/* Errors */}
      {(isApproveError || isDepositError) && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          Transaction Error: {approveError?.message || depositError?.message}
        </div>
      )}
    </div>
  );
}
