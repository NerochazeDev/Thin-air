const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SolanaStyleRewardDistributor to Polygon...");
  console.log("🎯 Targeting Solana bot patterns on Polygon network");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");
  
  const SolanaStyleRewardDistributor = await ethers.getContractFactory("SolanaStyleRewardDistributor");
  
  console.log("Deploying Solana-style contract...");
  const contract = await SolanaStyleRewardDistributor.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();
  
  console.log("\n✅ SOLANA-STYLE POLYGON DEPLOYMENT SUCCESSFUL!");
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", deploymentTx.hash);
  console.log("Network: Polygon Mainnet");
  
  console.log("\n🔍 Contract Information:");
  console.log("Name:", await contract.name());
  console.log("Symbol:", await contract.symbol());
  console.log("Participation Fee:", ethers.formatEther(await contract.getParticipationFee()), "MATIC");
  
  // Activate with Solana-style functions
  console.log("\n🎯 Activating Solana-style functions...");
  const participationFee = await contract.getParticipationFee();
  
  const tx1 = await contract.jupiterSwap({ value: participationFee });
  await tx1.wait();
  console.log("✅ Jupiter transaction:", tx1.hash);
  
  const tx2 = await contract.bonk({ value: participationFee });
  await tx2.wait();
  console.log("✅ Bonk transaction:", tx2.hash);
  
  const tx3 = await contract.mev({ value: participationFee });
  await tx3.wait();
  console.log("✅ MEV transaction:", tx3.hash);
  
  console.log("\n🎪 SOLANA-STYLE BOT MAGNET ACTIVATED!");
  console.log(`🔗 PolygonScan: https://polygonscan.com/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });