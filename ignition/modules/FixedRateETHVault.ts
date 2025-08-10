import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FixedRateETHVaultModule = buildModule("FixedRateETHVaultModule", (m) => {
  // Parameters
  const rewardTokenAddress = m.getParameter("rewardTokenAddress");
  const annualRateBps = m.getParameter("annualRateBps", 500); // 5% default

  // Deploy FixedRateETHVault
  const ethVault = m.contract("FixedRateETHVault", [rewardTokenAddress, annualRateBps]);

  return { ethVault };
});

export default FixedRateETHVaultModule;
