import { ignition, ethers, network } from "hardhat";
import FixedYieldVaultsModule from "./modules/FixedYieldVaults";

async function main() {
  console.log(`🚀 Deploying contracts on ${network.name}...`);
  
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deployer: ${deployer.address}`);
  console.log(`💰 Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  // Deploy parameters
  const parameters = {
    // Use existing underlying token if provided via environment variable
    useExistingUnderlying: !!process.env.ERC20_UNDERLYING_ADDRESS,
    existingUnderlyingAddress: process.env.ERC20_UNDERLYING_ADDRESS || "",
    
    // Default 5% APR
    annualRateBps: 500,
    
    // Reward token config
    rewardName: "Fixed Yield Reward Token",
    rewardSymbol: "FYRT"
  };

  console.log("📋 Deploy parameters:", parameters);

  try {
    // Deploy all contracts
    const { rewardToken, mockERC20, erc4626Vault } = await ignition.deploy(
      FixedYieldVaultsModule,
      {
        parameters: {
          FixedYieldVaultsModule: parameters
        }
      }
    );

    // Get addresses
    const addresses = {
      network: network.name,
      chainId: network.config.chainId,
      rewardToken: await rewardToken.getAddress(),
      erc4626Vault: await erc4626Vault.getAddress(),
      underlying: await mockERC20.getAddress()
    };

    console.log("\n✅ Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log(JSON.stringify(addresses, null, 2));

    // Save addresses to file for easy access
    const fs = require("fs");
    const path = require("path");
    const addressesFile = path.join(__dirname, `../deployments/${network.name}-addresses.json`);
    
    // Create deployments directory if it doesn't exist
    if (!fs.existsSync(path.dirname(addressesFile))) {
      fs.mkdirSync(path.dirname(addressesFile), { recursive: true });
    }
    
    fs.writeFileSync(addressesFile, JSON.stringify(addresses, null, 2));
    console.log(`\n💾 Addresses saved to: ${addressesFile}`);

    // Print environment variables for frontend
    console.log("\n🌐 Environment variables for frontend (.env.local):");
    console.log(`NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=${addresses.rewardToken}`);
    console.log(`NEXT_PUBLIC_VAULT_ADDRESS=${addresses.erc4626Vault}`);
    console.log(`NEXT_PUBLIC_UNDERLYING_ADDRESS=${addresses.underlying}`);
    console.log(`NEXT_PUBLIC_CHAIN_ID=${addresses.chainId}`);

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Execute deployment
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});

export default main;
