import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RewardTokenModule = buildModule("RewardTokenModule", (m) => {
  // Parameters with default values
  const rewardName = m.getParameter("rewardName", "RewardToken");
  const rewardSymbol = m.getParameter("rewardSymbol", "RWD");

  // Deploy RewardToken
  const rewardToken = m.contract("RewardToken", [rewardName, rewardSymbol]);

  return { rewardToken };
});

export default RewardTokenModule;
