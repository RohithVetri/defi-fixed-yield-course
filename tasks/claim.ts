import { task } from "hardhat/config";

task("claim:eth", "Claim rewards from FixedRateETHVault")
  .addParam("vault", "ETH vault address")
  .setAction(async (args, hre) => {
    const vault = await hre.ethers.getContractAt("FixedRateETHVault", args.vault);
    await (await vault.claim()).wait();
    console.log("Claimed rewards (ETH vault)");
  });

task("claim:erc4626", "Claim rewards from FixedRateERC4626Vault")
  .addParam("vault", "ERC4626 vault address")
  .setAction(async (args, hre) => {
    const vault = await hre.ethers.getContractAt("FixedRateERC4626Vault", args.vault);
    await (await vault.claim()).wait();
    console.log("Claimed rewards (ERC4626 vault)");
  });
