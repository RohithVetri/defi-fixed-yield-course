import { task } from "hardhat/config";

task("withdraw", "Withdraw ERC20 assets from FixedRateERC4626Vault")
  .addParam("vault", "ERC4626 vault address")
  .addParam("amount", "Asset amount in ether units")
  .setAction(async (args, hre) => {
    const amount = hre.ethers.parseEther(args.amount);
    const [owner] = await hre.ethers.getSigners();
    const vault = await hre.ethers.getContractAt("FixedRateERC4626Vault", args.vault);
    await (await vault.withdraw(amount, owner.address, owner.address)).wait();
    console.log(`Withdrawn ${args.amount} from ${args.vault}`);
  });
