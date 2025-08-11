"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useVault } from "../../hooks/useVault";

export default function VaultPage() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const {
    vaultAddress,
    underlyingAddress,
    rewardTokenAddress,
    shares,
    assets,
    pendingReward,
    underlyingBalance,
    rewardTokenBalance,
    annualRateBps,
    isApproving,
    isDepositing,
    isWithdrawing,
    isClaiming,
    isConfirming,
    isRefreshing,
    approve,
    deposit,
    withdraw,
    claim,
    refreshData,
  } = useVault();

  const isLoading = isApproving || isDepositing || isWithdrawing || isClaiming || isConfirming;

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ERC4626 固定利率金库</h1>
          <p className="text-slate-400 mt-1">存入代币获得固定年化收益</p>
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <button
              onClick={refreshData}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-medium transition-colors"
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
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
              {isRefreshing ? "刷新中..." : "刷新数据"}
            </button>
          )}
          <ConnectButton />
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-12">
          <p className="text-xl text-slate-400">请连接钱包开始使用</p>
        </div>
      ) : (
        <>
          {/* 合约信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Vault 合约</h3>
              <a 
                href={`https://sepolia.etherscan.io/address/${vaultAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {vaultAddress}
              </a>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Underlying Token</h3>
              <a 
                href={`https://sepolia.etherscan.io/address/${underlyingAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {underlyingAddress}
              </a>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Reward Token</h3>
              <a 
                href={`https://sepolia.etherscan.io/address/${rewardTokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {rewardTokenAddress}
              </a>
            </div>
          </div>

          {/* 余额信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-400">年化利率</p>
              <p className="text-2xl font-bold text-emerald-400">{(annualRateBps / 100).toFixed(2)}%</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-400">我的 Shares</p>
              <p className="text-xl font-semibold">{parseFloat(shares).toFixed(4)}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-400">对应 Assets</p>
              <p className="text-xl font-semibold">{parseFloat(assets).toFixed(4)}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-400">待领奖励</p>
              <p className="text-xl font-semibold text-yellow-400">{parseFloat(pendingReward).toFixed(4)}</p>
            </div>
          </div>

          {/* 钱包余额 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Underlying Token 余额</h3>
              <p className="text-lg">{parseFloat(underlyingBalance).toFixed(4)} Tokens</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-2">已领取 Reward Token</h3>
              <p className="text-lg text-green-400">{parseFloat(rewardTokenBalance).toFixed(4)} Reward Tokens</p>
            </div>
          </div>

          {/* 操作区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 存款 */}
            <div className="bg-slate-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-emerald-400">💰 存款</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">存款金额</label>
                  <input
                    type="number"
                    step="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="输入存款金额"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={() => depositAmount && deposit(depositAmount)}
                  disabled={isLoading || !depositAmount}
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-medium"
                >
                  {isDepositing ? "存款中..." : isApproving ? "授权中..." : "存款"}
                </button>
              </div>
            </div>

            {/* 提款 */}
            <div className="bg-slate-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">💸 提款</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">提款金额</label>
                  <input
                    type="number"
                    step="1"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="输入提款金额"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={() => withdrawAmount && withdraw(withdrawAmount)}
                  disabled={isLoading || !withdrawAmount || parseFloat(assets) === 0}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-medium"
                >
                  {isWithdrawing ? "提款中..." : "提款"}
                </button>
              </div>
            </div>

            {/* 领取奖励 */}
            <div className="bg-slate-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">🎁 领取奖励</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-slate-400">可领取奖励</p>
                  <p className="text-2xl font-bold text-yellow-400">{parseFloat(pendingReward).toFixed(4)}</p>
                </div>
                <button
                  onClick={claim}
                  disabled={isLoading || parseFloat(pendingReward) === 0}
                  className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-medium"
                >
                  {isClaiming ? "领取中..." : "领取奖励"}
                </button>
              </div>
            </div>
          </div>

          {/* 状态指示器 */}
          {isLoading && (
            <div className="bg-blue-900/50 border border-blue-500 p-4 rounded-lg">
              <p className="text-blue-200">
                ⏳ 交易处理中，请稍候...
                {isConfirming && " (等待区块确认)"}
              </p>
            </div>
          )}
          
          {isRefreshing && (
            <div className="bg-purple-900/50 border border-purple-500 p-4 rounded-lg">
              <p className="text-purple-200">
                🔄 正在从区块链获取最新数据...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}