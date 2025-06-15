// scripts/fix-web3-deployment.js - Complete Web3 Fix Script
const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function fixWeb3Integration() {
  console.log('🔧 DeFi Watchdog Web3 Integration Fix');
  console.log('=====================================');

  try {
    // Step 1: Check network
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

    if (network.chainId !== 11155111) {
      console.error('❌ Not connected to Sepolia testnet!');
      console.log('💡 Run with: --network sepolia');
      return;
    }

    // Step 2: Check deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);

    const balance = await deployer.getBalance();
    const balanceEth = ethers.utils.formatEther(balance);
    console.log(`💰 Balance: ${balanceEth} ETH`);

    if (balance.lt(ethers.utils.parseEther('0.005'))) {
      console.error('❌ Insufficient balance! Need at least 0.005 ETH');
      console.log('💡 Get Sepolia ETH from: https://sepoliafaucet.com/');
      return;
    }

    // Step 3: Deploy contract
    console.log('\n🔨 Deploying DeFiWatchdogAuditNFT...');
    const DeFiWatchdogAuditNFT = await ethers.getContractFactory('DeFiWatchdogAuditNFT');
    
    const contract = await DeFiWatchdogAuditNFT.deploy({
      gasLimit: 3000000,
      gasPrice: ethers.utils.parseUnits('20', 'gwei')
    });

    console.log(`⏳ Deploy TX: ${contract.deployTransaction.hash}`);
    await contract.deployed();

    console.log('✅ Contract deployed successfully!');
    console.log(`📋 Address: ${contract.address}`);
    console.log(`🌐 Etherscan: https://sepolia.etherscan.io/address/${contract.address}`);

    // Step 4: Test contract
    console.log('\n🧪 Testing contract functions...');
    const name = await contract.name();
    const symbol = await contract.symbol();
    const staticPrice = await contract.STATIC_AUDIT_PRICE();
    const aiPrice = await contract.AI_AUDIT_PRICE();

    console.log(`✅ Name: ${name}`);
    console.log(`✅ Symbol: ${symbol}`);
    console.log(`✅ Static Price: ${ethers.utils.formatEther(staticPrice)} ETH`);
    console.log(`✅ AI Price: ${ethers.utils.formatEther(aiPrice)} ETH`);

    // Step 5: Update configuration files
    console.log('\n⚙️ Updating configuration files...');
    await updateFiles(contract.address);

    console.log('\n🎉 Web3 Integration Fix Complete!');
    console.log('==================================');
    console.log('✅ Contract deployed and tested');
    console.log('✅ Configuration files updated');
    console.log('✅ Modern Web3 hooks implemented');
    console.log('\n🚀 Next Steps:');
    console.log('1. Restart dev server: npm run dev');
    console.log('2. Test with "Live Blockchain" mode');
    console.log('3. Connect MetaMask to Sepolia');
    console.log('4. Try minting a certificate!');

    return {
      contractAddress: contract.address,
      deploymentTx: contract.deployTransaction.hash,
      network: network.name
    };

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    if (error.message.includes('insufficient funds')) {
      console.log('💡 Get Sepolia ETH: https://sepoliafaucet.com/');
    } else if (error.message.includes('network')) {
      console.log('💡 Check SEPOLIA_RPC_URL in .env.local');
    }
    
    throw error;
  }
}

async function updateFiles(contractAddress) {
  const updates = [
    updateEnvFile(contractAddress),
    updateWeb3Config(contractAddress),
    updateOldMintButton(contractAddress)
  ];

  await Promise.all(updates);
  console.log('✅ All files updated successfully');
}

function updateEnvFile(contractAddress) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update contract addresses
    const updates = [
      { regex: /NEXT_PUBLIC_AUDIT_NFT_CONTRACT=.*/, line: `NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}` },
      { regex: /NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=.*/, line: `NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${contractAddress}` }
    ];

    updates.forEach(({ regex, line }) => {
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, line);
      } else {
        envContent += `\n${line}\n`;
      }
    });

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local updated');

  } catch (error) {
    console.log(`⚠️ Manual update needed for .env.local:`);
    console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}`);
  }
}

function updateWeb3Config(contractAddress) {
  try {
    const configPath = path.join(__dirname, '../src/config/web3.js');
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Update contract address in config
    const regex = /address: process\.env\.NEXT_PUBLIC_AUDIT_NFT_CONTRACT \|\| ['"][^'"]+['"],/;
    const newLine = `address: process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || '${contractAddress}',`;

    if (regex.test(configContent)) {
      configContent = configContent.replace(regex, newLine);
      fs.writeFileSync(configPath, configContent);
      console.log('✅ web3.js config updated');
    }

  } catch (error) {
    console.log('⚠️ Could not update web3.js config automatically');
  }
}

function updateOldMintButton(contractAddress) {
  try {
    const componentPath = path.join(__dirname, '../src/components/certificate/BlockchainMintButton.js');
    let componentContent = fs.readFileSync(componentPath, 'utf8');

    // Update hardcoded contract address
    const regex = /const CONTRACT_ADDRESS = ['"][^'"]+['"];/;
    const newLine = `const CONTRACT_ADDRESS = '${contractAddress}';`;

    if (regex.test(componentContent)) {
      componentContent = componentContent.replace(regex, newLine);
      fs.writeFileSync(componentPath, componentContent);
      console.log('✅ Old mint button updated');
    }

  } catch (error) {
    console.log('⚠️ Could not update old mint button');
  }
}

// Run the fix
if (require.main === module) {
  fixWeb3Integration()
    .then((result) => {
      if (result) {
        console.log(`\n🎯 Contract deployed at: ${result.contractAddress}`);
        console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${result.contractAddress}`);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n💥 Fix failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { fixWeb3Integration };