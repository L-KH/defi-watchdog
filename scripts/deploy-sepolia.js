// scripts/deploy-sepolia.js - Deploy specifically to Sepolia testnet

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying DeFi Watchdog Audit NFT to Sepolia...");
  console.log("================================================");
  
  // Force check we're on Sepolia
  if (hre.network.name !== 'sepolia') {
    throw new Error("❌ This script must be run with --network sepolia");
  }
  
  // Environment checks
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in .env.local");
  }
  
  console.log(`📡 Network: ${hre.network.name} (Chain ID: ${hre.network.config.chainId})`);
  
  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);
  
  // Check balance
  const balance = await deployer.getBalance();
  const balanceEth = hre.ethers.utils.formatEther(balance);
  console.log(`💰 Balance: ${balanceEth} ETH`);
  
  if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
    console.warn("⚠️  Warning: Low balance. Get Sepolia ETH from https://sepoliafaucet.com/");
  }
  
  console.log("\n🔨 Compiling contracts...");
  await hre.run('compile');
  
  // Deploy contract
  console.log("📝 Deploying DeFiWatchdogAuditNFT to Sepolia...");
  
  try {
    const DeFiWatchdogAuditNFT = await hre.ethers.getContractFactory("DeFiWatchdogAuditNFT");
    
    // Estimate deployment gas
    const deployTx = DeFiWatchdogAuditNFT.getDeployTransaction();
    const gasEstimate = await hre.ethers.provider.estimateGas(deployTx);
    const gasPrice = await hre.ethers.provider.getGasPrice();
    const deploymentCost = gasEstimate.mul(gasPrice);
    
    console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
    console.log(`💵 Estimated cost: ${hre.ethers.utils.formatEther(deploymentCost)} ETH`);
    
    // Deploy with gas optimization
    const contract = await DeFiWatchdogAuditNFT.deploy({
      gasLimit: gasEstimate.mul(120).div(100), // 20% buffer
    });
    
    console.log(`⏳ Deployment transaction: ${contract.deployTransaction.hash}`);
    console.log("⏳ Waiting for deployment confirmation...");
    
    await contract.deployed();
    
    console.log("✅ Contract deployed successfully!");
    console.log(`📋 Address: ${contract.address}`);
    console.log(`🔍 Transaction: ${contract.deployTransaction.hash}`);
    console.log(`🌐 Etherscan: https://sepolia.etherscan.io/address/${contract.address}`);
    
    // Wait for confirmations
    console.log("⏳ Waiting for block confirmations...");
    const receipt = await contract.deployTransaction.wait(3);
    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
    
    // Test basic contract functions
    console.log("\n🧪 Testing contract functions...");
    
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalAudits = await contract.getTotalAudits();
      const staticPrice = await contract.STATIC_AUDIT_PRICE();
      const aiPrice = await contract.AI_AUDIT_PRICE();
      
      console.log(`✅ Contract Name: ${name}`);
      console.log(`✅ Symbol: ${symbol}`);
      console.log(`✅ Total Audits: ${totalAudits}`);
      console.log(`✅ Static Price: ${hre.ethers.utils.formatEther(staticPrice)} ETH`);
      console.log(`✅ AI Price: ${hre.ethers.utils.formatEther(aiPrice)} ETH`);
      
    } catch (error) {
      console.error("❌ Contract function test failed:", error.message);
    }
    
    // Update frontend config
    console.log("\n📝 Updating frontend configuration...");
    await updateEnvironmentFile(contract.address);
    
    // Verify on Etherscan
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\n🔍 Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: contract.address,
          constructorArguments: [],
        });
        console.log("✅ Contract verified on Etherscan");
      } catch (error) {
        console.log("⚠️  Verification failed:", error.message);
        console.log("💡 You can verify manually later at https://sepolia.etherscan.io/verifyContract");
      }
    } else {
      console.log("⚠️  No ETHERSCAN_API_KEY found, skipping verification");
    }
    
    // Summary
    console.log("\n🎉 Deployment Summary");
    console.log("====================");
    console.log(`Contract: DeFiWatchdogAuditNFT`);
    console.log(`Address: ${contract.address}`);
    console.log(`Network: Sepolia Testnet`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`Block: ${receipt.blockNumber}`);
    console.log(`Etherscan: https://sepolia.etherscan.io/address/${contract.address}`);
    
    console.log("\n🔧 Environment Variable Updated:");
    console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contract.address}`);
    
    console.log("\n🎯 Next Steps:");
    console.log("1. ✅ Contract deployed to Sepolia");
    console.log("2. ✅ Environment variables updated");
    console.log("3. 🧪 Test the integration: npm run dev");
    console.log("4. 🌐 Visit: http://localhost:3000/test-web3");
    console.log("5. 🎮 Connect MetaMask to Sepolia testnet");
    
    return contract.address;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    
    // Provide helpful error messages
    if (error.message.includes('insufficient funds')) {
      console.log("💡 Solution: Get more Sepolia ETH from https://sepoliafaucet.com/");
    } else if (error.message.includes('gas')) {
      console.log("💡 Solution: Try increasing gas limit or wait for lower gas prices");
    } else if (error.message.includes('nonce')) {
      console.log("💡 Solution: Reset your MetaMask nonce or wait for pending transactions");
    }
    
    throw error;
  }
}

async function updateEnvironmentFile(contractAddress) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    const envVar = 'NEXT_PUBLIC_AUDIT_NFT_CONTRACT';
    const newLine = `${envVar}=${contractAddress}`;
    const regex = new RegExp(`^${envVar}=.*$`, 'm');
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
      console.log(`✅ Updated existing ${envVar} in .env.local`);
    } else {
      envContent += `\n# Sepolia Contract Address\n${newLine}\n`;
      console.log(`✅ Added ${envVar} to .env.local`);
    }
    
    fs.writeFileSync(envPath, envContent);
    
    // Also update the contract config file
    const configPath = path.join(__dirname, '../src/contracts/AuditNFT.js');
    if (fs.existsSync(configPath)) {
      let configContent = fs.readFileSync(configPath, 'utf8');
      const sepoliaRegex = /sepolia:\s*["'][^"']*["']/;
      
      if (sepoliaRegex.test(configContent)) {
        configContent = configContent.replace(sepoliaRegex, `sepolia: "${contractAddress}"`);
        fs.writeFileSync(configPath, configContent);
        console.log(`✅ Updated sepolia address in AuditNFT.js`);
      }
    }
    
  } catch (error) {
    console.error("⚠️  Failed to update environment file:", error.message);
    console.log(`\n📝 Please manually add this to your .env.local file:`);
    console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}`);
  }
}

// Execute deployment
main()
  .then((address) => {
    console.log("\n🎉 Sepolia Deployment completed successfully!");
    console.log(`📋 Contract Address: ${address}`);
    console.log(`🌐 Etherscan: https://sepolia.etherscan.io/address/${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Sepolia Deployment failed:", error.message);
    process.exit(1);
  });
