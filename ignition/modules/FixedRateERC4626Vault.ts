import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FixedRateERC4626VaultModule = buildModule("FixedRateERC4626VaultModule", (m) => {
  // Parameters
  const underlyingAddress = m.getParameter("underlyingAddress");
  const rewardTokenAddress = m.getParameter("rewardTokenAddress");
  const annualRateBps = m.getParameter("annualRateBps", 500); // 5% default

  // Deploy FixedRateERC4626Vault
  const erc4626Vault = m.contract("FixedRateERC4626Vault", [
    underlyingAddress,
    rewardTokenAddress,
    annualRateBps
  ]);

  return { erc4626Vault };
});

export default FixedRateERC4626VaultModule;
