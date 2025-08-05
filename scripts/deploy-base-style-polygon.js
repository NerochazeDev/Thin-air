const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying BaseRewardDistributor to Polygon...");
  console.log("🎯 Targeting Base bot patterns on Polygon network");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");
  
  const BaseRewardDistributor = await ethers.getContractFactory("BaseRewardDistributor");
  
  console.log("Deploying Base-style contract...");
  const contract = await BaseRewardDistributor.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();
  
  console.log("\n✅ BASE-STYLE POLYGON DEPLOYMENT SUCCESSFUL!");
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", deploymentTx.hash);
  console.log("Network: Polygon Mainnet");
  
  console.log("\n🔍 Contract Information:");
  console.log("Name:", await contract.name());
  console.log("Symbol:", await contract.symbol());
  console.log("Participation Fee:", ethers.formatEther(await contract.getParticipationFee()), "MATIC");
  
  // Activate with Base-style functions
  console.log("\n🎯 Activating Base-style functions...");
  const participationFee = await contract.getParticipationFee();
  
  const tx1 = await contract.degen({ value: participationFee });
  await tx1.wait();
  console.log("✅ Degen transaction:", tx1.hash);
  
  const tx2 = await contract.brett({ value: participationFee });
  await tx2.wait();
  console.log("✅ Brett transaction:", tx2.hash);
  
  const tx3 = await contract.sniper({ value: participationFee });
  await tx3.wait();
  console.log("✅ Sniper transaction:", tx3.hash);
  
  console.log("\n🎪 BASE-STYLE BOT MAGNET ACTIVATED!");
  console.log(`🔗 PolygonScan: https://polygonscan.com/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });