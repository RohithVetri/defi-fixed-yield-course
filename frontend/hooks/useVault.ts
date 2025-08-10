import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther } from "viem";

// 环境变量
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;
const UNDERLYING_ADDRESS = process.env.NEXT_PUBLIC_UNDERLYING_ADDRESS as `0x${string}`;
const REWARD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS as `0x${string}`;

// ERC20 ABI
const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ERC4626 Vault ABI
const VAULT_ABI = [
  {
    inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }],
    name: "deposit",
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }, { name: "owner", type: "address" }],
    name: "withdraw",
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getPendingReward",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "shares", type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "annualRateBps",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useVault() {
  const { address } = useAccount();
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // 读取合约数据
  const { data: shares } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: assets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "convertToAssets",
    args: shares ? [shares] : undefined,
  });

  const { data: pendingReward } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getPendingReward",
    args: address ? [address] : undefined,
  });

  const { data: annualRateBps } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "annualRateBps",
  });

  const { data: underlyingBalance } = useReadContract({
    address: UNDERLYING_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: rewardTokenBalance } = useReadContract({
    address: REWARD_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // 写入合约
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const approve = async (amount: string) => {
    if (!address) return;
    setIsApproving(true);
    try {
      writeContract({
        address: UNDERLYING_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VAULT_ADDRESS, parseEther(amount)],
      });
    } catch (error) {
      console.error("Approve failed:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const deposit = async (amount: string) => {
    if (!address) return;
    setIsDepositing(true);
    try {
      // 先授权
      await approve(amount);
      // 等待一下再存款
      setTimeout(() => {
        writeContract({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: "deposit",
          args: [parseEther(amount), address],
        });
        setIsDepositing(false);
      }, 2000);
    } catch (error) {
      console.error("Deposit failed:", error);
      setIsDepositing(false);
    }
  };

  const withdraw = async (amount: string) => {
    if (!address) return;
    setIsWithdrawing(true);
    try {
      writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [parseEther(amount), address, address],
      });
    } catch (error) {
      console.error("Withdraw failed:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const claim = async () => {
    if (!address) return;
    setIsClaiming(true);
    try {
      writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "claim",
      });
    } catch (error) {
      console.error("Claim failed:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    // 地址
    vaultAddress: VAULT_ADDRESS,
    underlyingAddress: UNDERLYING_ADDRESS,
    rewardTokenAddress: REWARD_TOKEN_ADDRESS,
    
    // 余额数据
    shares: shares ? formatEther(shares) : "0",
    assets: assets ? formatEther(assets) : "0",
    pendingReward: pendingReward ? formatEther(pendingReward) : "0",
    underlyingBalance: underlyingBalance ? formatEther(underlyingBalance) : "0",
    rewardTokenBalance: rewardTokenBalance ? formatEther(rewardTokenBalance) : "0",
    annualRateBps: annualRateBps ? Number(annualRateBps) : 0,
    
    // 加载状态
    isApproving,
    isDepositing,
    isWithdrawing,
    isClaiming,
    isConfirming,
    
    // 操作函数
    approve,
    deposit,
    withdraw,
    claim,
  };
}