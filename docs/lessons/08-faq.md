# 08 - FAQ

## 合约相关

**Q: 奖励单位为何等于底层资产单位？**
A: 为了教学简化（1:1 计量），生产上应有独立的奖励单位与速率配置。

**Q: APR 如何换算？**
A: 使用 bps（万分制），线性按 `elapsed/365d` 计算。例如 500 bps = 5% 年化利率。

**Q: 是否安全可上主网？**
A: 本仓库仅教学用途，代码未经审计，请勿直接用于生产环境。

**Q: ERC4626 的 shares 和 assets 有什么区别？**
A: shares 是用户在金库中的份额，assets 是对应的底层资产价值。在我们的实现中，1:1 兑换。

## 前端相关

**Q: 为什么连接钱包后看不到余额？**
A: 请确保：
1. 钱包连接的是 Sepolia 测试网
2. `.env.local` 中的合约地址配置正确
3. 刷新页面重新连接钱包

**Q: 交易一直处于"pending"状态怎么办？**
A: 可能原因：
1. Gas 费用设置过低
2. 网络拥堵
3. Nonce 值异常
建议在 MetaMask 中查看交易状态或重新发起交易。

**Q: 为什么点击合约地址无法跳转到 Etherscan？**
A: 请确认：
1. 使用的是 Sepolia 测试网
2. 合约已成功部署
3. 浏览器没有阻止弹窗

**Q: 存款时提示授权失败？**
A: 请确保：
1. 钱包中有足够的 Underlying Token
2. 有足够的 ETH 支付 Gas 费用
3. 合约地址配置正确

## 部署相关

**Q: 如何获取测试网 ETH？**
A: 可以使用以下水龙头：
- Alchemy Sepolia Faucet
- Chainlink Sepolia Faucet
- 官方 Sepolia Faucet

**Q: 部署失败怎么办？**
A: 常见解决方案：
1. 检查 `.env` 文件配置
2. 确认私钥格式正确（0x开头）
3. 账户有足够的测试网 ETH
4. 网络连接正常

**Q: 如何验证合约？**
A: 使用命令：
```bash
npm run deploy:ignition:verify
```
或手动验证：
```bash
npx hardhat verify --network sepolia <合约地址> <构造函数参数>
```

## 开发相关

**Q: 如何本地测试？**
A: 运行：
```bash
npm install
npx hardhat compile
npx hardhat test
```

**Q: 如何添加新的网络？**
A: 在 `hardhat.config.ts` 中添加网络配置，并在 `.env` 中添加对应的 RPC URL。

**Q: 前端如何连接本地网络？**
A: 修改 `frontend/app/web3-providers.tsx` 中的链配置，添加本地 Hardhat 网络。

**Q: 如何修改利率？**
A: 合约部署后，owner 可以调用 `setAnnualRateBps(newBps)` 修改利率。

## 错误排查

**Q: "insufficient funds" 错误**
A: 检查账户 ETH 余额是否足够支付 Gas 费用。

**Q: "execution reverted" 错误**
A: 常见原因：
1. 授权金额不足
2. 余额不足
3. 合约条件不满足

**Q: 前端显示 "loading..." 不消失**
A: 检查：
1. 网络连接
2. RPC 节点状态
3. 浏览器控制台错误信息

**Q: "nonce too high" 错误**
A: 在 MetaMask 中重置账户交易历史。

## 性能优化

**Q: 如何减少 Gas 费用？**
A: 建议：
1. 批量操作而非频繁小额交易
2. 在网络空闲时进行交易
3. 适当调整 Gas Limit

**Q: 前端加载很慢怎么办？**
A: 优化建议：
1. 使用可靠的 RPC 节点
2. 实现数据缓存
3. 减少不必要的合约调用

**Q: 如何提高交易确认速度？**
A: 可以适当提高 Gas Price，但要注意成本控制。
