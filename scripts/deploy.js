// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DeFi Watchdog Audit NFT Contract...");
  
  // Check if we have a private key
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in environment variables. Please add it to .env.local");
  }
  
  // Get signers
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("❌ No signers available. Check your PRIVATE_KEY configuration.");
  }
  
  const deployer = signers[0];
  console.log("📝 Deployer address:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("💰 Deployer balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
    console.warn("⚠️  Warning: Low balance. You might need more ETH for deployment.");
  }
  
  // Get the contract factory
  console.log("🔨 Getting contract factory...");
  const DeFiWatchdogAuditNFT = await hre.ethers.getContractFactory("DeFiWatchdogAuditNFT");
  
  console.log("📝 Deploying contract...");
  
  // Deploy the contract
  const auditNFT = await DeFiWatchdogAuditNFT.deploy();
  
  console.log("⏳ Waiting for deployment transaction...");
  
  // Wait for deployment to complete
  await auditNFT.deployed();
  
  const contractAddress = auditNFT.address;
  
  console.log("✅ DeFiWatchdogAuditNFT deployed to:", contractAddress);
  console.log("🔍 Transaction hash:", auditNFT.deployTransaction.hash);
  
  // Wait for a few block confirmations before verification
  console.log("⏳ Waiting for block confirmations...");
  await auditNFT.deployTransaction.wait(5);
  
  // Verify contract on Etherscan if not on localhost
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("🔍 Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [],
        });
        console.log("✅ Contract verified on Etherscan");
      } catch (error) {
        console.log("❌ Error verifying contract:", error.message);
      }
    } else {
      console.log("⚠️  Skipping verification - ETHERSCAN_API_KEY not found");
    }
  }
  
  // Display deployment summary
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("Contract Name: DeFiWatchdogAuditNFT");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("AI Audit Price: 0.003 ETH");
  console.log("Static Audit Price: Free");
  
  // Get initial contract state
  try {
    const totalAudits = await auditNFT.getTotalAudits();
    const staticCount = await auditNFT.auditTypeCount(0); // STATIC = 0
    const aiCount = await auditNFT.auditTypeCount(1); // AI_POWERED = 1
    
    console.log("\n📊 Initial Contract State:");
    console.log("Total Audits:", totalAudits.toString());
    console.log("Static Audits:", staticCount.toString());
    console.log("AI Audits:", aiCount.toString());
  } catch (error) {
    console.log("⚠️  Could not fetch initial contract state:", error.message);
  }
  
  console.log("\n🔧 Environment Variables to Add:");
  console.log("================================");
  console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}`);
  console.log(`NEXT_PUBLIC_SEPOLIA_CHAIN_ID=11155111`);
  
  return contractAddress;
}

// Execute deployment
main()
  .then((contractAddress) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📝 Contract Address:", contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
