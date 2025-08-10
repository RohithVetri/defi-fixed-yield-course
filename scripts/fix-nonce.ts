import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`🔧 修复账户 nonce 问题`);
  console.log(`账户地址: ${deployer.address}`);
  console.log(`网络: ${network.name}`);
  
  // 获取当前 nonce
  const currentNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log(`当前 nonce: ${currentNonce}`);
  
  // 获取 pending nonce
  const pendingNonce = await ethers.provider.getTransactionCount(deployer.address, "pending");
  console.log(`Pending nonce: ${pendingNonce}`);
  
  if (currentNonce === pendingNonce) {
    console.log("✅ Nonce 已同步，无需修复");
    return;
  }
  
  console.log("⚠️  检测到 nonce 不同步问题");
  console.log("💡 建议的解决方案：");
  console.log("1. 等待当前 pending 交易被确认（推荐）");
  console.log("2. 清理 Ignition 部署状态");
  console.log("3. 使用传统部署脚本");
  
  // 获取最近的交易
  try {
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log(`\n📊 最新区块: ${latestBlock}`);
    
    // 查找该地址的最近交易
    const block = await ethers.provider.getBlock(latestBlock);
    if (block && block.transactions.length > 0) {
      console.log(`最新区块包含 ${block.transactions.length} 笔交易`);
    }
  } catch (error) {
    console.log("无法获取区块信息");
  }
}

main().catch((error) => {
  console.error("❌ 脚本执行失败:", error);
  process.exit(1);
});
