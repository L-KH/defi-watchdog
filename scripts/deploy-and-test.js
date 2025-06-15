// scripts/deploy-and-test.js - Quick deploy and test script

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Quick Deploy & Test - DeFi Watchdog Audit NFT");
  console.log("=".repeat(50));
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);
  
  // Check balance
  const balance = await deployer.getBalance();
  const balanceEth = hre.ethers.utils.formatEther(balance);
  console.log(`💰 Balance: ${balanceEth} ETH`);
  
  if (balance.lt(hre.ethers.utils.parseEther("0.005"))) {
    console.warn("⚠️  Warning: Low balance for deployment");
    console.log("💡 Get Sepolia ETH from https://sepoliafaucet.com/");
  }
  
  console.log("\n🔨 Deploying contract...");
  
  try {
    // Compile and deploy
    await hre.run('compile');
    
    const DeFiWatchdogAuditNFT = await hre.ethers.getContractFactory("DeFiWatchdogAuditNFT");
    const contract = await DeFiWatchdogAuditNFT.deploy();
    
    console.log(`⏳ Deployment transaction: ${contract.deployTransaction.hash}`);
    await contract.deployed();
    
    console.log(`✅ Contract deployed at: ${contract.address}`);
    console.log(`🌐 Etherscan: https://sepolia.etherscan.io/address/${contract.address}`);
    
    // Test contract functions
    console.log("\n🧪 Testing contract functions...");
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalAudits = await contract.getTotalAudits();
    const aiPrice = await contract.AI_AUDIT_PRICE();
    const staticPrice = await contract.STATIC_AUDIT_PRICE();
    
    console.log(`✅ Name: ${name}`);
    console.log(`✅ Symbol: ${symbol}`);
    console.log(`✅ Total Audits: ${totalAudits}`);
    console.log(`✅ AI Price: ${hre.ethers.utils.formatEther(aiPrice)} ETH`);
    console.log(`✅ Static Price: ${hre.ethers.utils.formatEther(staticPrice)} ETH`);
    
    // Update environment file
    console.log("\n📝 Updating .env.local...");
    await updateEnvFile(contract.address);
    
    console.log("\n🎉 Deployment Complete!");
    console.log("=".repeat(30));
    console.log(`Contract Address: ${contract.address}`);
    console.log("Environment variables updated");
    console.log("Ready to test Web3 integration!");
    
    console.log("\n📋 Next Steps:");
    console.log("1. npm run dev");
    console.log("2. Go to http://localhost:3000/audit");
    console.log("3. Run an audit and try minting");
    
    return contract.address;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes('insufficient funds')) {
      console.log("💡 Get more Sepolia ETH from https://sepoliafaucet.com/");
    }
    
    throw error;
  }
}

async function updateEnvFile(contractAddress) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update contract addresses
    const updates = [
      'NEXT_PUBLIC_AUDIT_NFT_CONTRACT',
      'NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS'
    ];
    
    updates.forEach(envVar => {
      const regex = new RegExp(`^${envVar}=.*$`, 'm');
      const newLine = `${envVar}=${contractAddress}`;
      
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, newLine);
        console.log(`✅ Updated ${envVar}`);
      } else {
        envContent += `\n${newLine}\n`;
        console.log(`✅ Added ${envVar}`);
      }
    });
    
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Environment file updated");
    
  } catch (error) {
    console.error("⚠️ Failed to update .env.local:", error.message);
    console.log(`\nPlease manually update your .env.local:`);
    console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}`);
    console.log(`NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${contractAddress}`);
  }
}

main()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error.message);
    process.exit(1);
  });
