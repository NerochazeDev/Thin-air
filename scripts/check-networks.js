const { ethers } = require("hardhat");

async function checkNetwork(networkName, config) {
  console.log(`\n🌐 Testing ${networkName}...`);
  console.log(`RPC: ${config.url}`);
  
  try {
    const provider = new ethers.JsonRpcProvider(config.url);
    
    // Test basic connectivity
    const network = await provider.getNetwork();
    console.log(`✅ Connected to chain ${network.chainId}`);
    
    // Test block number
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Latest block: ${blockNumber}`);
    
    // Test gas price
    const gasPrice = await provider.getGasPrice();
    console.log(`✅ Gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
    
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🔍 NETWORK CONNECTIVITY TEST");
  console.log("=" * 50);
  
  const networks = {
    "Polygon Mainnet": {
      url: "https://polygon.llamarpc.com"
    },
    "Polygon (Alt 1)": {
      url: "https://polygon-rpc.com/"
    },
    "Polygon (Alt 2)": {
      url: "https://matic-mainnet.chainstacklabs.com"
    },
    "Mumbai Testnet": {
      url: "https://rpc.ankr.com/polygon_mumbai"
    },
    "Mumbai (Alt 1)": {
      url: "https://rpc-mumbai.matic.today"
    }
  };
  
  const results = {};
  
  for (const [name, config] of Object.entries(networks)) {
    results[name] = await checkNetwork(name, config);
  }
  
  console.log("\n📊 NETWORK TEST RESULTS");
  console.log("=" * 50);
  
  const working = Object.entries(results).filter(([name, status]) => status);
  const failed = Object.entries(results).filter(([name, status]) => !status);
  
  if (working.length > 0) {
    console.log("✅ Working Networks:");
    working.forEach(([name]) => console.log(`  • ${name}`));
  }
  
  if (failed.length > 0) {
    console.log("\n❌ Failed Networks:");
    failed.forEach(([name]) => console.log(`  • ${name}`));
  }
  
  if (working.length === 0) {
    console.log("\n⚠️  No networks accessible. Check internet connection.");
    console.log("💡 Try deploying to local hardhat network instead:");
    console.log("   npx hardhat node --hostname 0.0.0.0 &");
    console.log("   npx hardhat run scripts/deploy.js --network hardhat");
  } else {
    console.log(`\n🎯 Recommended: Use any of the ${working.length} working networks above`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Network test failed:", error);
    process.exit(1);
  });