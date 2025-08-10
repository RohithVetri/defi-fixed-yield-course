# Hardhat Ignition 部署

本项目已集成 Hardhat Ignition 用于智能合约的部署和验证。

## 功能特性

- ✅ **声明式部署**: 使用模块定义合约部署流程
- ✅ **依赖管理**: 自动处理合约间的依赖关系
- ✅ **状态管理**: 跟踪部署状态，支持中断后恢复
- ✅ **网络支持**: 支持多网络部署和验证
- ✅ **参数化**: 支持灵活的参数配置

## 目录结构

```
ignition/
├── modules/                    # Ignition 模块文件
│   ├── FixedYieldVaults.ts    # 主部署模块
│   ├── RewardToken.ts         # 奖励代币模块
│   ├── MockERC20.ts           # Mock ERC20 模块
│   ├── FixedRateETHVault.ts   # ETH 金库模块
│   └── FixedRateERC4626Vault.ts # ERC4626 金库模块
├── deploy.ts                   # 自定义部署脚本
└── README.md                   # 本文档
```

## 使用方法

### 1. 基础 Ignition 部署

```bash
# 本地网络部署
npm run deploy:ignition

# Sepolia 测试网部署
npm run deploy:ignition:sepolia

# Sepolia 测试网部署 + 验证（推荐）
npm run deploy:ignition:verify

# 其他网络
npx hardhat ignition deploy ignition/modules/FixedYieldVaults.ts --network <network-name>
```

### 2. 自定义脚本部署（推荐）

```bash
# 本地网络
npm run deploy:script

# Sepolia 测试网
npm run deploy:script:sepolia

# 其他网络
npx hardhat run ignition/deploy.ts --network <network-name>
```

### 3. 参数自定义

可以通过参数文件自定义部署参数：

```bash
npx hardhat ignition deploy ignition/modules/FixedYieldVaults.ts --parameters parameters.json
```

参数文件示例 (`parameters.json`):
```json
{
  "FixedYieldVaultsModule": {
    "rewardName": "My Reward Token",
    "rewardSymbol": "MRT",
    "annualRateBps": 750,
    "mockTokenName": "Test USDC",
    "mockTokenSymbol": "tUSDC",
    "mintAmount": "10000000000000000000000000"
  }
}
```

## 部署输出

部署完成后会输出：

1. **合约地址**: 所有部署的合约地址
2. **地址文件**: 保存在 `deployments/<network>-addresses.json`
3. **环境变量**: 前端使用的环境变量配置

## 验证合约

### 自动验证（推荐）

```bash
# 直接部署并验证
npm run deploy:ignition:verify

# 或使用完整命令
npx hardhat ignition deploy ignition/modules/FixedYieldVaults.ts --network sepolia --verify
```

### 手动验证

```bash
# 验证已部署的模块
npm run verify

# 或使用完整命令
npx hardhat ignition verify FixedYieldVaultsModule --network sepolia
```

### 部署状态管理

```bash
# 查看部署状态
npm run status

# 完整命令
npx hardhat ignition status FixedYieldVaultsModule --network sepolia
```

## 网络配置

确保在 `.env` 文件中配置网络参数：

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 优势对比

### 传统脚本 vs Ignition

| 特性 | 传统脚本 | Ignition |
|------|----------|----------|
| 错误恢复 | ❌ 需要手动处理 | ✅ 自动恢复 |
| 依赖管理 | ❌ 手动编写 | ✅ 自动处理 |
| 状态跟踪 | ❌ 无状态 | ✅ 持久化状态 |
| 参数管理 | ❌ 硬编码 | ✅ 参数化 |
| 验证支持 | ❌ 需要额外脚本 | ✅ 内置支持 |

## 故障排除

### 常见问题

1. **参数错误**: 检查参数文件格式和模块名称
2. **网络连接**: 确认 RPC URL 和私钥配置
3. **Gas 不足**: 确保账户有足够的 ETH
4. **合约验证失败**: 检查 Etherscan API key 配置

### 重新部署

如果需要重新部署，可以删除 Ignition 状态：

```bash
rm -rf ignition/deployments/<network-name>
```

## 更多信息

- [Hardhat Ignition 文档](https://hardhat.org/ignition)
- [参数配置指南](https://hardhat.org/ignition/docs/guides/parameters)
- [网络配置](https://hardhat.org/ignition/docs/guides/networks)
