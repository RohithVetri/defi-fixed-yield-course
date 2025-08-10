import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MockERC20Module = buildModule("MockERC20Module", (m) => {
  // Parameters with default values
  const name = m.getParameter("name", "Mock USD");
  const symbol = m.getParameter("symbol", "mUSD");
  const decimals = m.getParameter("decimals", 18);

  // Deploy MockERC20
  const mockERC20 = m.contract("MockERC20", [name, symbol, decimals]);

  // Mint tokens to deployer for demo purposes
  const mintAmount = m.getParameter("mintAmount", "1000000000000000000000000"); // 1M tokens
  const deployer = m.getAccount(0);
  
  m.call(mockERC20, "mint", [deployer, mintAmount], {
    id: "mint_initial_tokens"
  });

  return { mockERC20 };
});

export default MockERC20Module;
