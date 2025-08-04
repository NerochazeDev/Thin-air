const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MockAirdropToken contract...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");
  
  // Get the contract factory
  const MockAirdropToken = await ethers.getContractFactory("MockAirdropToken");
  
  // Deploy the contract
  console.log("Deploying contract...");
  const mockAirdropToken = await MockAirdropToken.deploy();
  
  // Wait for deployment
  await mockAirdropToken.waitForDeployment();
  
  const contractAddress = await mockAirdropToken.getAddress();
  console.log("MockAirdropToken deployed to:", contractAddress);
  console.log("Contract owner:", await mockAirdropToken.getOwner());
  console.log("Min claim amount:", ethers.formatEther(await mockAirdropToken.getMinClaimAmount()), "MATIC");
  
  // Display contract info
  console.log("\n=== Contract Information ===");
  console.log("Name:", await mockAirdropToken.name());
  console.log("Symbol:", await mockAirdropToken.symbol());
  console.log("Decimals:", await mockAirdropToken.decimals());
  console.log("Total Supply:", ethers.formatEther(await mockAirdropToken.totalSupply()));
  console.log("Remaining Tokens:", ethers.formatEther(await mockAirdropToken.getRemainingTokens()));
  
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
  console.log(`Transaction Hash: ${mockAirdropToken.deploymentTransaction().hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
