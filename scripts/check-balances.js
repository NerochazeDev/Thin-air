const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Admin Address:", deployer.address);
  console.log("=" * 50);
  
  // Check Polygon (current deployment)
  try {
    const polygonProvider = new ethers.JsonRpcProvider('https://polygon-rpc.com/');
    const polygonBalance = await polygonProvider.getBalance(deployer.address);
    console.log("✅ Polygon MATIC:", ethers.formatEther(polygonBalance));
  } catch (error) {
    console.log("❌ Polygon check failed");
  }
  
  // Check Base
  try {
    const baseProvider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const baseBalance = await baseProvider.getBalance(deployer.address);
    console.log("💙 Base ETH:", ethers.formatEther(baseBalance));
  } catch (error) {
    console.log("❌ Base check failed");
  }
  
  // Check BSC
  try {
    const bscProvider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org/');
    const bscBalance = await bscProvider.getBalance(deployer.address);
    console.log("🟡 BSC BNB:", ethers.formatEther(bscBalance));
  } catch (error) {
    console.log("❌ BSC check failed");
  }
  
  // Check Arbitrum
  try {
    const arbProvider = new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
    const arbBalance = await arbProvider.getBalance(deployer.address);
    console.log("🔷 Arbitrum ETH:", ethers.formatEther(arbBalance));
  } catch (error) {
    console.log("❌ Arbitrum check failed");
  }
  
  console.log("=" * 50);
  console.log("DEPLOYMENT REQUIREMENTS:");
  console.log("• Base: ~0.005 ETH ($12-15)");
  console.log("• BSC: ~0.01 BNB ($6-8)");
  console.log("• Arbitrum: ~0.002 ETH ($6-8)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });