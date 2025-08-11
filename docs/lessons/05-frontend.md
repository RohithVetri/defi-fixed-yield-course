# 05 - 前端集成

本章将实现一个完整的 DApp 前端，重点学习前端→钱包→合约的交互流程。

## 技术栈
- **Next.js 14** + TypeScript
- **wagmi**: 以太坊 React Hooks 库  
- **RainbowKit**: 钱包连接组件

## DApp 交互架构

### Web3 连接层次

```mermaid
graph TD
    A[前端界面] --> B[RainbowKit]
    B --> C[用户钱包]
    C --> D[以太坊网络]
    D --> E[智能合约]
    
    A --> F[wagmi Hook]
    F --> G[合约读取/写入]
    G --> D
```

### 基础配置

**核心 Provider 设置**：
```typescript
// 支持 Sepolia 测试网络
const config = getDefaultConfig({
  appName: "Fixed Yield DeFi",
  chains: [sepolia],
  ssr: false, // 禁用服务端渲染
});
```

## 合约交互核心

### useVault Hook

**数据读取** - 监听合约状态：
```typescript
const { data: shares } = useReadContract({
  address: VAULT_ADDRESS,
  abi: VAULT_ABI,
  functionName: "balanceOf", 
  args: [userAddress],
});
```

**交易执行** - 写入合约：
```typescript
const { writeContract } = useWriteContract();

const deposit = async (amount: string) => {
  // 1. 先授权 ERC20
  await writeContract({
    address: UNDERLYING_ADDRESS,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [VAULT_ADDRESS, parseEther(amount)],
  });
  
  // 2. 调用存款
  await writeContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "deposit",
    args: [parseEther(amount), userAddress],
  });
};
```

## 主要界面组件

### 钱包连接
```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 一键连接多种钱包
<ConnectButton />
```

### 数据展示
```typescript
// 实时读取合约数据
const { data: shares } = useReadContract({
  functionName: "balanceOf",
  args: [userAddress],
});

const { data: pendingReward } = useReadContract({
  functionName: "getPendingReward", 
  args: [userAddress],
});
```

## 前端→钱包→合约交互流程

### 1. 钱包连接流程

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant Frontend as 🖥️ 前端
    participant RainbowKit as 🌈 RainbowKit
    participant Wallet as 👛 钱包 (MetaMask)
    participant Network as 🌐 以太坊网络

    User->>Frontend: 访问 DApp
    Frontend->>RainbowKit: 显示连接按钮
    User->>RainbowKit: 点击连接钱包
    RainbowKit->>Wallet: 请求连接
    Wallet->>User: 弹出授权窗口
    User->>Wallet: 确认连接
    Wallet->>RainbowKit: 返回账户地址
    RainbowKit->>Frontend: 更新连接状态
    Frontend->>Network: 开始监听合约数据
```

### 2. 存款交易流程

```mermaid
sequenceDiagram
    participant User as 👤 用户  
    participant Frontend as 🖥️ 前端
    participant Wallet as 👛 钱包
    participant Contract as 📋 智能合约

    User->>Frontend: 输入存款金额
    User->>Frontend: 点击存款按钮
    
    Note over Frontend: 第1步：ERC20授权
    Frontend->>Wallet: approve(vault, amount)
    Wallet->>User: 弹出交易确认
    User->>Wallet: 确认授权交易
    Wallet->>Contract: 发送授权交易
    Contract->>Frontend: 授权成功
    
    Note over Frontend: 第2步：金库存款
    Frontend->>Wallet: deposit(amount, user)
    Wallet->>User: 弹出交易确认  
    User->>Wallet: 确认存款交易
    Wallet->>Contract: 发送存款交易
    Contract->>Contract: _accrue() 计息
    Contract->>Contract: mint shares
    Contract->>Frontend: 存款成功
    Frontend->>Frontend: 刷新余额显示
```

### 3. 奖励领取流程

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant Frontend as 🖥️ 前端  
    participant Wallet as 👛 钱包
    participant Contract as 📋 智能合约
    participant RewardToken as 🪙 奖励代币

    Frontend->>Contract: getPendingReward(user)
    Contract->>Frontend: 返回待领取奖励
    Frontend->>User: 显示奖励金额
    
    User->>Frontend: 点击领取奖励
    Frontend->>Wallet: claim()
    Wallet->>User: 弹出交易确认
    User->>Wallet: 确认领取交易
    Wallet->>Contract: 发送领取交易
    Contract->>Contract: _accrue() 最终计息
    Contract->>RewardToken: mint(user, amount)
    Contract->>Frontend: 领取成功
    Frontend->>Frontend: 刷新奖励余额
```

### 4. 关键交互要点

**双重确认机制**：
- 每个交易都需要用户在钱包中确认
- 前端显示交易状态（等待确认/处理中/完成）

**实时数据同步**：
```typescript
// wagmi 自动监听链上数据变化
const { data: balance } = useReadContract({
  watch: true, // 实时监听
  functionName: "balanceOf",
});
```

## 启动方式

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

这样，用户就可以通过简洁的界面与我们的 ERC4626 金库合约进行完整交互！