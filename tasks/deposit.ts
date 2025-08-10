import { task } from "hardhat/config";

task("deposit", "Deposit ERC20 into FixedRateERC4626Vault")
  .addParam("vault", "ERC4626 vault address")
  .addParam("underlying", "Underlying ERC20 address")
  .addParam("amount", "Amount in ether units", undefined, undefined, true)
  .setAction(async (args, hre) => {
    const amount = args.amount ? hre.ethers.parseEther(args.amount) : hre.ethers.parseEther("100");
    const [signer] = await hre.ethers.getSigners();
    const vault = await hre.ethers.getContractAt("FixedRateERC4626Vault", args.vault);
    const erc20 = await hre.ethers.getContractAt("MockERC20", args.underlying);
    try { await (await erc20.mint(signer.address, amount)).wait(); } catch {}
    await (await erc20.approve(args.vault, amount)).wait();
    await (await vault.deposit(amount, signer.address)).wait();
    console.log(`Deposited ${args.amount || "100"} to ${args.vault}`);
  });
