你现在扮演一名资深全栈 Web3 教学工程师与解决方案架构师。请为我生成一个完整可运行的 GitHub 仓库，作为"固定年化金库 + 奖励代币"的课程项目（ERC4626 标准实现）。要求如下：

---

#### 1. 仓库定位与配置
- 仓库名：`defi-fixed-yield-course`
- 主打：面向初中级 Solidity/Web3 开发者的完整教学仓库（75–90分钟课堂）
- 含：课程文档（Markdown）、Hardhat 合约、部署与交互脚本、Next.js 前端、结构图/流程图、CI/CD
- 语言：中文为主，代码注释中英双语
- 所有代码可编译运行，单元测试通过
- MIT 开源协议

---

#### 2. 技术栈与工程结构
- 合约与脚本：Hardhat + ethers v6 + OpenZeppelin 5.x（ERC4626、ERC20、ReentrancyGuard、Ownable）
- 前端：Next.js 14（App Router）+ TypeScript + wagmi + viem + RainbowKit + TailwindCSS
- 测试网：Sepolia
- 结构：
```
contracts/
  RewardToken.sol          # ERC20奖励代币
  FixedRateERC4626Vault.sol# ERC4626固定利率金库(ERC20资产)
scripts/
  deploy.ts
  interact.ts
tasks/
  deposit.ts
  withdraw.ts
  claim.ts
test/
  vault.spec.ts
docs/lessons/
  01-intro.md
  02-solidity-basics.md
  03-vault-contract.md
  04-hardhat-deploy.md
  05-frontend.md
  06-notional-deep-dive.md
  07-assignments.md
  08-faq.md
frontend/...
```

---

#### 3. 合约实现要求

**奖励代币 RewardToken**
- 标准 ERC20，Owner 可设置 Minter
- Vault 能调用 mint 给用户发奖励

**ERC4626 标准固定利率金库 FixedRateERC4626Vault**
- 基于 ERC4626（OpenZeppelin `ERC4626`, `ERC20`, `ReentrancyGuard`, `Ownable`）
- 构造参数：ERC20资产地址、年化利率
- 继承 ERC4626，并重写 deposit/withdraw 钩子增加计息与奖励逻辑
- 保存 `rewardAccrued`、`lastAccrue`，调用奖励代币合约 mint
- 符合 ERC4626 接口：`deposit`, `mint`, `withdraw`, `redeem`，遵循份额与资产比例转换
- 加 `onlyOwner` 管理年化利率

---

#### 4. 脚本与测试
- Hardhat 配置（`hardhat.config.ts`）: Solidity 0.8.20, ethers v6, dotenv
- `.env.example`: SEPOLIA_RPC_URL, PRIVATE_KEY, ERC20_UNDERLYING_ADDRESS
- scripts/deploy.ts: 部署奖励代币、ETH Vault、ERC4626 Vault（底层资产用 ERC20，如USDC测试代币），设置 Minter
- scripts/interact.ts: 示范 ERC4626 deposit → claim → withdraw
- tasks/: deposit、withdraw、claim 三个命令行交互
- test/vault.spec.ts: 模拟时间加速（evm_increaseTime）验证奖励计算，覆盖ETH版和ERC4626版

---

#### 5. 前端（frontend/）
- Next.js 14 + TailwindCSS + wagmi + viem + RainbowKit
- `app/vault/page.tsx`: 支持选择金库类型（ETH / ERC4626）
- 显示本金（shares/资产）、待领奖励、利率
- 操作按钮：Deposit / Withdraw / Claim（交互完成刷新数据）
- 使用 hooks（`useVault.ts`）封装 wagmi 读写
- `.env.local.example`: NEXT_PUBLIC_VAULT_ADDRESS, NEXT_PUBLIC_REWARD_TOKEN_ADDRESS, NEXT_PUBLIC_CHAIN_ID
- 对 ERC4626 列出 Shares 和 Assets 的换算显示

---

#### 6. 文档与可视化
- 在 `docs/` 和 README 中，为以下内容生成 **Mermaid 流程图/架构图**：
  - 固定利率 Vault 存取款与奖励流程
  - ERC4626 Vault 与底层资产、奖励代币的数据流
  - 前端 - wagmi - 合约交互流程
  - Notional Finance 工作原理（fCash、AMM、清算流程）
- 图表直接用 Markdown 代码块（` ```mermaid `）插入
- 在 06-notional-deep-dive.md 加入“教学版 Vault vs Notional”表格与流程图

---

#### 7. README 与课程
README.md 包含：
- 项目总览 + 功能截图 + 流程图
- 课程内容目录（对应 docs/lessons/）
- 快速启动：Hardhat 部署 + 前端启动
- 常见命令和案例输出
- 风险提示（仅教学）

课程文档：
- 分 8 篇，按生成、部署、交互、前端、DeFi案例、作业、FAQ
- 对复杂逻辑和数据流用图讲解（Mermaid/序列图/架构图）

---

#### 8. 交付与验证
- 所有代码可在 Cursor 中一次生成，无“TODO”占位
- 打印最终仓库文本树
- 确保 `npx hardhat compile`、`npx hardhat test`、`npm run dev`(前端)可运行