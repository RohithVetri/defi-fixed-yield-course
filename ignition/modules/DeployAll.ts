import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import RewardTokenModule from "./RewardToken";
import MockERC20Module from "./MockERC20";
import FixedRateETHVaultModule from "./FixedRateETHVault";
import FixedRateERC4626VaultModule from "./FixedRateERC4626Vault";

const DeployAllModule = buildModule("DeployAllModule", (m) => {
  // Deploy RewardToken first
  const { rewardToken } = m.useModule(RewardTokenModule);

  // Deploy MockERC20 (can be skipped if using existing underlying token)
  const useExistingUnderlying = m.getParameter("useExistingUnderlying", false);
  const existingUnderlyingAddress = m.getParameter("existingUnderlyingAddress", "");
  
  let underlyingAddress;
  if (useExistingUnderlying && existingUnderlyingAddress) {
    underlyingAddress = existingUnderlyingAddress;
  } else {
    const { mockERC20 } = m.useModule(MockERC20Module);
    underlyingAddress = mockERC20;
  }

  // Deploy ETH Vault
  const { ethVault } = m.useModule(FixedRateETHVaultModule, {
    parameters: {
      FixedRateETHVaultModule: {
        rewardTokenAddress: rewardToken,
        annualRateBps: m.getParameter("annualRateBps", 500)
      }
    }
  });

  // Deploy ERC4626 Vault  
  const { erc4626Vault } = m.useModule(FixedRateERC4626VaultModule, {
    parameters: {
      FixedRateERC4626VaultModule: {
        underlyingAddress: underlyingAddress,
        rewardTokenAddress: rewardToken,
        annualRateBps: m.getParameter("annualRateBps", 500)
      }
    }
  });

  // Set minter permissions
  m.call(rewardToken, "setMinter", [ethVault, true], {
    id: "set_eth_vault_minter"
  });

  m.call(rewardToken, "setMinter", [erc4626Vault, true], {
    id: "set_erc4626_vault_minter"
  });

  return {
    rewardToken,
    underlyingAddress,
    ethVault,
    erc4626Vault
  };
});

export default DeployAllModule;
