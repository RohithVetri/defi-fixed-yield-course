import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`检查账户: ${deployer.address}`);
  
  // 获取当前 nonce
  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log(`当前 nonce: ${nonce}`);
  
  // 获取账户余额
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`账户余额: ${ethers.formatEther(balance)} ETH`);
  
  // 获取网络信息
  const network = await ethers.provider.getNetwork();
  console.log(`网络: ${network.name} (chainId: ${network.chainId})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
