const { ethers } = require("hardhat");

// Helper function to retry operations
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

async function main() {
  console.log("🚀 Deploying SimpleAuditPayment contract to Sepolia...");
  console.log("🌐 Using reliable RPC endpoints with retry logic...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);

  // Check balance with retry
  const balance = await retryOperation(async () => {
    return await deployer.getBalance();
  });
  
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.005"))) {
    console.log("\n❌ Insufficient balance for deployment.");
    console.log("💡 You need at least 0.005 ETH for gas fees.");
    console.log("🔗 Get Sepolia ETH from: https://sepoliafaucet.com/");
    process.exit(1);
  }

  // Deploy the contract with retry logic
  console.log("📦 Deploying contract...");
  
  const auditPayment = await retryOperation(async () => {
    const SimpleAuditPayment = await ethers.getContractFactory("SimpleAuditPayment");
    const contract = await SimpleAuditPayment.deploy({
      gasLimit: 2000000,
      gasPrice: ethers.utils.parseUnits("30", "gwei")
    });
    
    console.log("⏳ Waiting for deployment confirmation...");
    await contract.deployed();
    return contract;
  });

  console.log("✅ SimpleAuditPayment deployed to:", auditPayment.address);

  // Test the contract functions with retry
  console.log("\n🧪 Testing contract functions...");
  
  try {
    const owner = await retryOperation(async () => await auditPayment.owner());
    console.log("✅ Contract owner:", owner);
    
    const price = await retryOperation(async () => await auditPayment.AUDIT_PRICE());
    console.log("✅ Audit price:", ethers.utils.formatEther(price), "ETH");
    
    const count = await retryOperation(async () => await auditPayment.getRequestCount());
    console.log("✅ Request count:", count.toString());
    
    const contractBalance = await retryOperation(async () => await auditPayment.getBalance());
    console.log("✅ Contract balance:", ethers.utils.formatEther(contractBalance), "ETH");
    
  } catch (error) {
    console.log("⚠️ Function test failed:", error.message);
    console.log("📝 Contract deployed but some functions couldn't be tested due to network issues");
  }

  console.log("\n🎉 Deployment Summary:");
  console.log("========================");
  console.log("✅ Contract Address:", auditPayment.address);
  console.log("🌐 Network: Sepolia Testnet");
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${auditPayment.address}`);
  
  console.log("\n📝 IMPORTANT: Update your .env.local file:");
  console.log("============================================");
  console.log(`NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${auditPayment.address}`);
  
  console.log("\n🔄 Next Steps:");
  console.log("===============");
  console.log("1. Copy the contract address above");
  console.log("2. Update NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS in .env.local");
  console.log("3. Restart your development server: npm run dev");
  console.log("4. Test the payment flow in your app");
  
  console.log("\n🔍 Manual Verification:");
  console.log("=======================");
  console.log(`1. Visit: https://sepolia.etherscan.io/address/${auditPayment.address}`);
  console.log("2. Click 'Contract' tab to see if it's verified");
  console.log("3. Click 'Read Contract' to test view functions");
  console.log("4. Click 'Write Contract' to test the requestAudit function");
  
  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Final deployment failure:", error.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("========================");
    console.log("1. Check your internet connection");
    console.log("2. Try a different RPC URL in hardhat.config.js");
    console.log("3. Make sure you have enough Sepolia ETH");
    console.log("4. Try deploying during off-peak hours");
    process.exit(1);
  });