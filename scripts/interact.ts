import { ethers, network } from "hardhat";

async function increaseTime(seconds: number) {
  if (network.name === "hardhat") {
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
  }
}

async function main() {
  const [user] = await ethers.getSigners();
  console.log(`User: ${user.address}`);

  // Read last deployment from logs or set manually here
  const rewardTokenAddr = process.env.REWARD_TOKEN_ADDRESS as string | undefined;
  const erc4626VaultAddr = process.env.ERC4626_VAULT_ADDRESS as string | undefined;
  const underlyingAddr = process.env.ERC20_UNDERLYING_ADDRESS as string | undefined;

  if (!rewardTokenAddr || !erc4626VaultAddr || !underlyingAddr) {
    console.log("Please set REWARD_TOKEN_ADDRESS, ERC4626_VAULT_ADDRESS, ERC20_UNDERLYING_ADDRESS in env.");
    return;
  }

  const rewardToken = await ethers.getContractAt("RewardToken", rewardTokenAddr);
  const vault = await ethers.getContractAt("FixedRateERC4626Vault", erc4626VaultAddr);
  const underlying = await ethers.getContractAt("MockERC20", underlyingAddr);

  // Ensure funds
  const amount = ethers.parseEther("100");
  const bal = await underlying.balanceOf(user.address);
  if (bal < amount) {
    try {
      await (await underlying.mint(user.address, amount)).wait();
    } catch {}
  }

  // approve and deposit
  await (await underlying.approve(erc4626VaultAddr, amount)).wait();
  await (await vault.deposit(amount, user.address)).wait();
  console.log("Deposited 100 underlying");

  // fast-forward 30 days on hardhat
  await increaseTime(30 * 24 * 60 * 60);
  const pending = await vault.getPendingReward(user.address);
  console.log(`Pending rewards: ${pending}`);

  // claim
  await (await vault.claim()).wait();
  const rbal = await rewardToken.balanceOf(user.address);
  console.log(`Claimed. Reward balance: ${rbal}`);

  // withdraw
  await (await vault.withdraw(amount, user.address, user.address)).wait();
  const balAfter = await underlying.balanceOf(user.address);
  console.log(`Withdrawn. Underlying balance: ${balAfter}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
