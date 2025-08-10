import { expect } from "chai";
import { ethers } from "hardhat";

const ONE_DAY = 24 * 60 * 60;

async function increase(days: number) {
  await ethers.provider.send("evm_increaseTime", [days * ONE_DAY]);
  await ethers.provider.send("evm_mine", []);
}

describe("Fixed Yield Vaults", () => {
  it("ERC4626 vault accrues on assets and claims", async () => {
    const [user] = await ethers.getSigners();

    // 合约部署
    const Reward = await ethers.getContractFactory("RewardToken");
    const reward = await Reward.deploy("RewardToken", "RWD");
    await reward.waitForDeployment();

    const Mock = await ethers.getContractFactory("MockERC20");
    const underlying = await Mock.deploy("Mock USD", "mUSD", 18);
    await underlying.waitForDeployment();

    await (await underlying.mint(user.address, ethers.parseEther("1000"))).wait();

    const Vault4626 = await ethers.getContractFactory("FixedRateERC4626Vault");
    const vault = await Vault4626.deploy(await underlying.getAddress(), await reward.getAddress(), 500);
    await vault.waitForDeployment();

    // 设置 minter
    await (await reward.setMinter(await vault.getAddress(), true)).wait();

    // 存入 mock 代币
    await (await underlying.connect(user).approve(await vault.getAddress(), ethers.parseEther("200"))).wait();
    await (await vault.connect(user).deposit(ethers.parseEther("200"), user.address)).wait();

    // 快进 60 天
    await increase(60);

    const pending = await vault.getPendingReward(user.address);
    expect(Number(ethers.formatEther(pending))).to.be.greaterThan(0.15);

    // 领取奖励
    await (await vault.connect(user).claim()).wait();
    const bal = await reward.balanceOf(user.address);
    const diff = bal > pending ? bal - pending : pending - bal;
    const tolerance = 10n ** 12n;
    console.log("diff", diff);
    console.log("tolerance", tolerance);
    expect(diff <= tolerance).to.be.true;
  });
});
