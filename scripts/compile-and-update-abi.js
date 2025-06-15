// scripts/compile-and-update-abi.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function main() {
  console.log('🔨 Compiling contracts...');
  
  try {
    // Run hardhat compile
    await execAsync('npx hardhat compile');
    console.log('✅ Contracts compiled successfully!');
  } catch (error) {
    console.error('❌ Compilation failed:', error.message);
    return;
  }
  
  // Path to the compiled artifact
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'DeFiWatchdogAuditNFT.sol', 'DeFiWatchdogAuditNFT.json');
  
  // Check if artifact exists
  if (!fs.existsSync(artifactPath)) {
    console.error('❌ Artifact not found at:', artifactPath);
    console.log('💡 Make sure the contract compiled successfully');
    return;
  }
  
  // Read the artifact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // Extract the ABI
  const abi = artifact.abi;
  
  // Update the frontend ABI file
  const frontendAbiPath = path.join(__dirname, '..', 'src', 'contracts', 'AuditNFT.js');
  
  // Create the new content
  const newContent = `// src/contracts/AuditNFT.js - Contract ABI for frontend integration

// This file is auto-generated from the compiled contract artifact

export const AUDIT_NFT_ABI = ${JSON.stringify(abi, null, 2)};

// Contract addresses for different networks
export const AUDIT_NFT_ADDRESSES = {
  sepolia: process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || "",
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default localhost address
};

// Contract configuration
export const AUDIT_NFT_CONFIG = {
  name: "DeFi Watchdog Audit Report",
  symbol: "DWARN",
  aiAuditPrice: "0.003", // ETH
  staticAuditPrice: "0", // Free
  
  // Audit types
  AUDIT_TYPES: {
    STATIC: 0,
    AI_POWERED: 1
  },
  
  // Risk levels
  RISK_LEVELS: {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    CRITICAL: 3
  }
};

export default {
  ABI: AUDIT_NFT_ABI,
  ADDRESSES: AUDIT_NFT_ADDRESSES,
  CONFIG: AUDIT_NFT_CONFIG
};
`;
  
  // Write the new content
  fs.writeFileSync(frontendAbiPath, newContent);
  
  console.log('✅ ABI updated successfully at:', frontendAbiPath);
  console.log('📊 ABI contains', abi.length, 'functions/events');
  
  // Also create a backup of the full artifact
  const backupPath = path.join(__dirname, '..', 'src', 'contracts', 'DeFiWatchdogAuditNFT.artifact.json');
  fs.writeFileSync(backupPath, JSON.stringify(artifact, null, 2));
  
  console.log('💾 Full artifact backup saved at:', backupPath);
}

main()
  .then(() => {
    console.log('🎉 Compilation and ABI update completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
