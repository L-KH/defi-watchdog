// Deploy script for AuditPayment contract
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting AuditPayment deployment...");
  
  // Get the contract factory
  const AuditPayment = await hre.ethers.getContractFactory("AuditPayment");
  
  // Deploy the contract
  console.log("📝 Deploying AuditPayment contract...");
  const auditPayment = await AuditPayment.deploy();
  
  // Wait for deployment
  await auditPayment.deployed();
  
  console.log("✅ AuditPayment deployed to:", auditPayment.address);
  console.log("📊 Audit Price:", hre.ethers.utils.formatEther(await auditPayment.AUDIT_PRICE()), "ETH");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: auditPayment.address,
    deploymentTime: new Date().toISOString(),
    auditPrice: "0.003 ETH",
    deployer: (await hre.ethers.getSigners())[0].address
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info to file
  const deploymentPath = path.join(deploymentsDir, `${hre.network.name}-AuditPayment.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n📁 Deployment info saved to:", deploymentPath);
  
  // Update .env.local file with contract address
  const envPath = path.join(__dirname, "../.env.local");
  const envContent = `\n# AuditPayment Contract (${hre.network.name})\nNEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${auditPayment.address}\n`;
  
  console.log("\n⚠️  IMPORTANT: Add the following to your .env.local file:");
  console.log(envContent);
  
  // Verify contract on Etherscan (if not on localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n🔍 Waiting for block confirmations before verification...");
    await auditPayment.deployTransaction.wait(5);
    
    console.log("📝 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: auditPayment.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.error("❌ Verification failed:", error.message);
      console.log("You can verify manually using:");
      console.log(`npx hardhat verify --network ${hre.network.name} ${auditPayment.address}`);
    }
  }
  
  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Add the contract address to your .env.local file");
  console.log("2. Run 'npm run dev' to test the payment integration");
  console.log("3. Make sure you have test ETH on Sepolia for testing");
  
  return auditPayment.address;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
