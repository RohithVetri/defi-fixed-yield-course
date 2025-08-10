import { ethers, network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const annualRateBps = Number(500);
  const rewardName = "RewardToken";
  const rewardSymbol = "RWD";
  const underlyingAddressEnv = process.env.ERC20_UNDERLYING_ADDRESS;

  // Reward token
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(rewardName, rewardSymbol);
  await rewardToken.waitForDeployment();
  console.log(`RewardToken: ${await rewardToken.getAddress()}`);

  // Underlying for ERC4626
  let underlyingAddress: string;
  if (underlyingAddressEnv) {
    underlyingAddress = underlyingAddressEnv;
  } else {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mock = await MockERC20.deploy("Mock USD", "mUSD", 18);
    await mock.waitForDeployment();
    underlyingAddress = await mock.getAddress();
    // Fund deployer for demo
    await (await mock.mint(deployer.address, ethers.parseEther("1000000"))).wait();
    console.log(`MockERC20: ${underlyingAddress}`);
  }

  // ERC4626 Vault
  const FixedRateERC4626Vault = await ethers.getContractFactory("FixedRateERC4626Vault");
  const vault4626 = await FixedRateERC4626Vault.deploy(underlyingAddress, await rewardToken.getAddress(), annualRateBps);
  await vault4626.waitForDeployment();
  console.log(`FixedRateERC4626Vault: ${await vault4626.getAddress()}`);

  // Set minters
  await (await rewardToken.setMinter(await vault4626.getAddress(), true)).wait();
  console.log("Set minters done");

  console.log("\nAddresses:");
  console.log(JSON.stringify({
    network: network.name,
    rewardToken: await rewardToken.getAddress(),
    erc4626Vault: await vault4626.getAddress(),
    underlying: underlyingAddress,
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
