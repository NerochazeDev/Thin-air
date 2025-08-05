const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying PolygonDEXWallet - Real DEX Integration");
  console.log("💰 This wallet will hold and swap real funds on Polygon DEXs");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  WARNING: Low balance. Recommended: 0.1+ MATIC for deployment and initial funding");
  }
  
  // Deploy the DEX wallet contract
  const PolygonDEXWallet = await ethers.getContractFactory("PolygonDEXWallet");
  
  console.log("Deploying PolygonDEXWallet...");
  const wallet = await PolygonDEXWallet.deploy();
  await wallet.waitForDeployment();
  
  const contractAddress = await wallet.getAddress();
  const deploymentTx = wallet.deploymentTransaction();
  
  console.log("\n✅ POLYGON DEX WALLET DEPLOYED!");
  console.log("=" * 60);
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", deploymentTx.hash);
  console.log("Network: Polygon Mainnet");
  console.log("Owner:", await wallet.owner());
  
  // Get token addresses for reference
  const tokenAddresses = await wallet.getTokenAddresses();
  console.log("\n🪙 SUPPORTED TOKENS:");
  console.log("WMATIC:", tokenAddresses.wmatic);
  console.log("USDC:", tokenAddresses.usdc);
  console.log("USDT:", tokenAddresses.usdt);
  console.log("DAI:", tokenAddresses.dai);
  console.log("WETH:", tokenAddresses.weth);
  
  // Fund the wallet with initial MATIC
  const initialFunding = ethers.parseEther("0.05"); // 0.05 MATIC for testing
  if (balance > initialFunding) {
    console.log("\n💰 Funding wallet with initial MATIC...");
    const fundTx = await wallet.depositFunds({ value: initialFunding });
    await fundTx.wait();
    console.log("✅ Funded with", ethers.formatEther(initialFunding), "MATIC");
    console.log("Fund transaction:", fundTx.hash);
  }
  
  // Display wallet stats
  const stats = await wallet.getWalletStats();
  console.log("\n📊 WALLET STATS:");
  console.log("MATIC Balance:", ethers.formatEther(stats.maticBalance));
  console.log("Total Deposited:", ethers.formatEther(stats.totalDeposited));
  console.log("Total Swaps:", stats.totalSwaps.toString());
  
  console.log("\n🔧 DEX INTEGRATION FEATURES:");
  console.log("✅ Real QuickSwap integration (0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff)");
  console.log("✅ MATIC ↔ Token swaps");
  console.log("✅ Token ↔ Token swaps");
  console.log("✅ Real-time price quotes");
  console.log("✅ Slippage protection");
  console.log("✅ Emergency withdrawal functions");
  console.log("✅ ReentrancyGuard protection");
  
  console.log("\n🎯 USAGE EXAMPLES:");
  console.log("// Get swap quote");
  console.log(`wallet.getSwapQuote(WMATIC, USDC, parseEther("1"))`);
  console.log("\n// Swap MATIC for USDC");
  console.log(`wallet.swapMaticForToken(USDC, parseEther("0.01"), minUSDC)`);
  console.log("\n// Swap USDC back to MATIC");
  console.log(`wallet.swapTokenForMatic(USDC, usdcAmount, minMatic)`);
  
  console.log("\n📈 REAL DEX TRADING:");
  console.log("• Uses actual QuickSwap liquidity pools");
  console.log("• Real market prices and slippage");
  console.log("• Actual token transfers and balances");
  console.log("• Professional-grade smart contract security");
  
  console.log("\n🔗 MONITORING:");
  console.log(`📊 PolygonScan: https://polygonscan.com/address/${contractAddress}`);
  console.log("💹 QuickSwap: https://quickswap.exchange/");
  console.log("📱 DeFi Pulse: Track your real DeFi positions");
  
  console.log("\n⚡ REAL DEX WALLET READY FOR TRADING! ⚡");
  
  // Demonstrate getting a quote
  try {
    const quoteAmount = ethers.parseEther("0.01"); // 0.01 MATIC
    const usdcAddress = tokenAddresses.usdc;
    const quote = await wallet.getSwapQuote(tokenAddresses.wmatic, usdcAddress, quoteAmount);
    console.log(`\n💱 LIVE QUOTE: 0.01 MATIC = ${ethers.formatUnits(quote, 6)} USDC`);
  } catch (error) {
    console.log("💱 Quote system ready (live market data required)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("DEX Wallet deployment failed:", error);
    process.exit(1);
  });