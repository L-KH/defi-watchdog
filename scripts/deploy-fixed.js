// scripts/deploy-fixed.js - Enhanced deployment script with better error handling

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting DeFi Watchdog Audit NFT Deployment...");
  console.log("==========================================");
  
  // Environment checks
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in .env.local");
  }
  
  // Get network info
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;
  console.log(`📡 Network: ${network} (Chain ID: ${chainId})`);
  
  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);
  
  // Check balance
  const balance = await deployer.getBalance();
  const balanceEth = hre.ethers.utils.formatEther(balance);
  console.log(`💰 Balance: ${balanceEth} ETH`);
  
  if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
    console.warn("⚠️  Warning: Low balance for deployment");
  }
  
  // Check if contract is already deployed
  const existingAddress = process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT;
  if (existingAddress && network !== 'localhost') {
    console.log(`🔍 Checking existing contract at ${existingAddress}...`);
    
    try {
      const code = await hre.ethers.provider.getCode(existingAddress);
      if (code !== '0x') {
        console.log("✅ Contract already deployed and verified");
        console.log(`📋 Address: ${existingAddress}`);
        return existingAddress;
      }
    } catch (error) {
      console.log("⚠️  Existing contract not found, proceeding with deployment");
    }
  }
  
  console.log("\n🔨 Compiling contracts...");
  await hre.run('compile');
  
  // Deploy contract
  console.log("📝 Deploying DeFiWatchdogAuditNFT...");
  
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
    await updateFrontendConfig(contract.address, network, chainId);
    
    // Verify on explorer
    if (network !== "localhost" && network !== "hardhat") {
      if (process.env.ETHERSCAN_API_KEY) {
        console.log("\n🔍 Verifying contract on explorer...");
        try {
          await hre.run("verify:verify", {
            address: contract.address,
            constructorArguments: [],
          });
          console.log("✅ Contract verified on explorer");
        } catch (error) {
          console.log("⚠️  Verification failed:", error.message);
          console.log("💡 You can verify manually later");
        }
      } else {
        console.log("⚠️  No ETHERSCAN_API_KEY found, skipping verification");
      }
    }
    
    // Summary
    console.log("\n🎉 Deployment Summary");
    console.log("====================");
    console.log(`Contract: DeFiWatchdogAuditNFT`);
    console.log(`Address: ${contract.address}`);
    console.log(`Network: ${network} (${chainId})`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`Block: ${receipt.blockNumber}`);
    
    return contract.address;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    
    // Provide helpful error messages
    if (error.message.includes('insufficient funds')) {
      console.log("💡 Solution: Add more ETH to your wallet");
    } else if (error.message.includes('gas')) {
      console.log("💡 Solution: Try increasing gas limit or lowering gas price");
    } else if (error.message.includes('nonce')) {
      console.log("💡 Solution: Reset your wallet's nonce or wait for pending transactions");
    }
    
    throw error;
  }
}

async function updateFrontendConfig(contractAddress, network, chainId) {
  try {
    // Update the contract configuration file
    const configPath = path.join(__dirname, '../src/contracts/AuditNFT.js');
    
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update the appropriate network address
    const networkKey = getNetworkKey(network, chainId);
    if (networkKey) {
      const regex = new RegExp(`${networkKey}:\\s*["'][^"']*["']`);
      configContent = configContent.replace(
        regex, 
        `${networkKey}: "${contractAddress}"`
      );
    }
    
    fs.writeFileSync(configPath, configContent);
    console.log(`✅ Updated ${configPath}`);
    
    // Update environment variables
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    const envVar = getEnvVarName(network, chainId);
    if (envVar) {
      const regex = new RegExp(`^${envVar}=.*$`, 'm');
      const newLine = `${envVar}=${contractAddress}`;
      
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, newLine);
      } else {
        envContent += `\n${newLine}\n`;
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log(`✅ Updated ${envPath}`);
    }
    
  } catch (error) {
    console.error("⚠️  Failed to update frontend config:", error.message);
  }
}

function getNetworkKey(network, chainId) {
  switch (chainId) {
    case 11155111: return 'sepolia';
    case 59144: return 'linea';
    case 146: return 'sonic';
    case 31337: return 'localhost';
    default: return network;
  }
}

function getEnvVarName(network, chainId) {
  switch (chainId) {
    case 11155111: return 'NEXT_PUBLIC_AUDIT_NFT_CONTRACT';
    case 59144: return 'NEXT_PUBLIC_LINEA_AUDIT_NFT_CONTRACT';
    case 146: return 'NEXT_PUBLIC_SONIC_AUDIT_NFT_CONTRACT';
    case 31337: return 'NEXT_PUBLIC_LOCALHOST_AUDIT_NFT_CONTRACT';
    default: return 'NEXT_PUBLIC_AUDIT_NFT_CONTRACT';
  }
}

// Execute deployment
main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log(`📋 Contract Address: ${address}`);
    console.log("\n💡 Next Steps:");
    console.log("1. Update your frontend environment variables");
    console.log("2. Test the minting functionality");
    console.log("3. Add the contract to your wallet to view NFTs");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
  });
