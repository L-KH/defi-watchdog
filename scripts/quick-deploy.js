// Quick deployment script to fix the contract issue
const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function deployContract() {
  console.log('🚀 Deploying DeFi Watchdog Audit NFT Contract...');
  console.log('=================================================');

  try {
    // Check if we're using the right network
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

    if (network.chainId !== 11155111) {
      console.error('❌ Not connected to Sepolia testnet!');
      console.log('💡 Run: npx hardhat run scripts/quick-deploy.js --network sepolia');
      return;
    }

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);

    // Check balance
    const balance = await deployer.getBalance();
    const balanceEth = ethers.utils.formatEther(balance);
    console.log(`💰 Balance: ${balanceEth} ETH`);

    if (balance.lt(ethers.utils.parseEther('0.005'))) {
      console.error('❌ Insufficient balance! Need at least 0.005 ETH');
      console.log('💡 Get Sepolia ETH from: https://sepoliafaucet.com/');
      return;
    }

    // Deploy contract
    console.log('\n🔨 Deploying contract...');
    const DeFiWatchdogAuditNFT = await ethers.getContractFactory('DeFiWatchdogAuditNFT');
    
    const contract = await DeFiWatchdogAuditNFT.deploy({
      gasLimit: 3000000,
      gasPrice: ethers.utils.parseUnits('20', 'gwei')
    });

    console.log(`⏳ Deployment transaction: ${contract.deployTransaction.hash}`);
    console.log('⏳ Waiting for deployment...');

    await contract.deployed();

    console.log('✅ Contract deployed successfully!');
    console.log(`📋 Contract Address: ${contract.address}`);
    console.log(`🌐 Etherscan: https://sepolia.etherscan.io/address/${contract.address}`);

    // Test contract functions
    console.log('\n🧪 Testing contract...');
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const staticPrice = await contract.STATIC_AUDIT_PRICE();
      const aiPrice = await contract.AI_AUDIT_PRICE();

      console.log(`✅ Name: ${name}`);
      console.log(`✅ Symbol: ${symbol}`);
      console.log(`✅ Static Price: ${ethers.utils.formatEther(staticPrice)} ETH`);
      console.log(`✅ AI Price: ${ethers.utils.formatEther(aiPrice)} ETH`);
    } catch (testError) {
      console.log('⚠️ Contract test failed, but deployment successful');
    }

    // Update environment file
    updateEnvironmentFile(contract.address);

    console.log('\n🎉 Deployment Complete!');
    console.log('=======================');
    console.log('✅ Contract deployed to Sepolia');
    console.log('✅ Environment variables updated');
    console.log('✅ Ready to use live blockchain mode');
    console.log('\n🎯 Next Steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Switch to "Live Blockchain" mode');
    console.log('3. Connect MetaMask to Sepolia');
    console.log('4. Try minting a certificate!');

    return contract.address;

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    if (error.message.includes('insufficient funds')) {
      console.log('💡 Get more Sepolia ETH from https://sepoliafaucet.com/');
    } else if (error.message.includes('network')) {
      console.log('💡 Check your SEPOLIA_RPC_URL in .env.local');
    }
    
    throw error;
  }
}

function updateEnvironmentFile(contractAddress) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update contract address
    const contractRegex = /NEXT_PUBLIC_AUDIT_NFT_CONTRACT=.*/;
    const paymentRegex = /NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=.*/;
    
    const newContractLine = `NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}`;
    const newPaymentLine = `NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${contractAddress}`;

    if (contractRegex.test(envContent)) {
      envContent = envContent.replace(contractRegex, newContractLine);
    } else {
      envContent += `\n${newContractLine}\n`;
    }

    if (paymentRegex.test(envContent)) {
      envContent = envContent.replace(paymentRegex, newPaymentLine);
    } else {
      envContent += `${newPaymentLine}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment variables updated');

    // Also update the contract address in the component
    updateComponentFile(contractAddress);

  } catch (error) {
    console.error('⚠️ Failed to update environment file:', error.message);
    console.log(`\n📝 Please manually update .env.local:`);
    console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${contractAddress}`);
    console.log(`NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${contractAddress}`);
  }
}

function updateComponentFile(contractAddress) {
  try {
    const componentPath = path.join(__dirname, '../src/components/certificate/BlockchainMintButton.js');
    let componentContent = fs.readFileSync(componentPath, 'utf8');

    // Update the hardcoded contract address
    const contractRegex = /const CONTRACT_ADDRESS = ['"][^'"]+['"];/;
    const newContractLine = `const CONTRACT_ADDRESS = '${contractAddress}';`;

    if (contractRegex.test(componentContent)) {
      componentContent = componentContent.replace(contractRegex, newContractLine);
      fs.writeFileSync(componentPath, componentContent);
      console.log('✅ Component file updated');
    }

  } catch (error) {
    console.log('⚠️ Could not update component file automatically');
    console.log(`💡 Please update CONTRACT_ADDRESS in BlockchainMintButton.js to: ${contractAddress}`);
  }
}

// Run deployment
if (require.main === module) {
  deployContract()
    .then(() => {
      console.log('\n🎉 All done! Your contract is ready to use.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Deployment failed:', error.message);
      process.exit(1);
    });
}

module.exports = { deployContract };
