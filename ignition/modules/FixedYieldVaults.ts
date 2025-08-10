import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FixedYieldVaultsModule = buildModule("FixedYieldVaultsModule", (m) => {
  // Parameters with default values
  const rewardName = m.getParameter("rewardName", "Fixed Yield Reward Token");
  const rewardSymbol = m.getParameter("rewardSymbol", "FYRT");
  const annualRateBps = m.getParameter("annualRateBps", 500); // 5% default
  
  // Mock token parameters
  const mockTokenName = m.getParameter("mockTokenName", "Mock USD");
  const mockTokenSymbol = m.getParameter("mockTokenSymbol", "mUSD");
  const mockTokenDecimals = m.getParameter("mockTokenDecimals", 18);
  const mintAmount = m.getParameter("mintAmount", "1000000000000000000000000"); // 1M tokens

  // Step 1: Deploy RewardToken
  const rewardToken = m.contract("RewardToken", [rewardName, rewardSymbol]);

  // Step 2: Deploy MockERC20 (wait for rewardToken to complete)
  const mockERC20 = m.contract("MockERC20", [mockTokenName, mockTokenSymbol, mockTokenDecimals]);
  
  // Step 3: Mint tokens to deployer (wait for mockERC20)
  const deployer = m.getAccount(0);
  const mintTokens = m.call(mockERC20, "mint", [deployer, mintAmount], {
    id: "mint_initial_tokens",
    after: [mockERC20]
  });

  // Step 4: Deploy ERC4626 Vault (wait for mint to complete)
  const erc4626Vault = m.contract("FixedRateERC4626Vault", [
    mockERC20,
    rewardToken,
    annualRateBps
  ], {
    after: [mockERC20]
  });

  // Step 5: Set ERC4626 Vault minter permission (wait for vault deployment)
  m.call(rewardToken, "setMinter", [erc4626Vault, true], {
    id: "set_erc4626_vault_minter",
    after: [rewardToken]  // 等待合约部署完成
  });

  return {
    rewardToken,
    mockERC20,
    erc4626Vault
  };
});

export default FixedYieldVaultsModule;
