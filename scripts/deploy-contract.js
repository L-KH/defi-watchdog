// deploy-contract.js
// Simple deployment script for the AuditStorage contract

const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Starting AuditStorage contract deployment...');
  
  // Get the contract factory
  const AuditStorage = await ethers.getContractFactory('AuditStorage');
  
  // Deploy the contract
  console.log('📦 Deploying contract...');
  const auditStorage = await AuditStorage.deploy();
  
  // Wait for deployment to complete
  await auditStorage.deployed();
  
  console.log('✅ AuditStorage deployed to:', auditStorage.address);
  console.log('🔧 Transaction hash:', auditStorage.deployTransaction.hash);
  
  // Wait for a few confirmations
  console.log('⏳ Waiting for confirmations...');
  await auditStorage.deployTransaction.wait(5);
  
  console.log('📋 Deployment Summary:');
  console.log('='.repeat(50));
  console.log(`Contract Address: ${auditStorage.address}`);
  console.log(`Owner: ${await auditStorage.owner()}`);
  console.log(`Storage Fee: ${ethers.utils.formatEther(await auditStorage.getStorageFee())} ETH`);
  console.log(`Total Audits: ${await auditStorage.getTotalAudits()}`);
  
  console.log('\n🔧 Environment Variable:');
  console.log(`NEXT_PUBLIC_AUDIT_STORAGE_CONTRACT=${auditStorage.address}`);
  
  console.log('\n🌐 Verification:');
  console.log(`https://sepolia.etherscan.io/address/${auditStorage.address}`);
  
  return auditStorage.address;
}

// Execute deployment
main()
  .then((address) => {
    console.log('\n✅ Deployment completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });
