// scripts/check-env.js - Environment validation script

require('dotenv').config({ path: '.env.local' });

console.log('🔍 DeFi Watchdog Environment Check');
console.log('=====================================');

const requiredVars = [
  'PRIVATE_KEY',
  'SEPOLIA_RPC_URL',
  'PINATA_API_KEY',
  'PINATA_SECRET_KEY'
];

const optionalVars = [
  'NEXT_PUBLIC_AUDIT_NFT_CONTRACT',
  'ETHERSCAN_API_KEY',
  'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'
];

console.log('\n📋 Required Variables:');
let allRequiredPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = value ? 
    (varName.includes('KEY') ? value.substring(0, 10) + '...' : value.substring(0, 20) + '...') : 
    'MISSING';
  
  console.log(`${status} ${varName}: ${displayValue}`);
  
  if (!value) {
    allRequiredPresent = false;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  const displayValue = value ? 
    (varName.includes('KEY') ? value.substring(0, 10) + '...' : value.substring(0, 30) + '...') : 
    'NOT SET';
  
  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\n🔍 Contract Configuration:');
const contractAddress = process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT;
if (contractAddress) {
  console.log(`✅ Contract Address: ${contractAddress}`);
  console.log(`📡 Ready for blockchain transactions`);
} else {
  console.log(`⚠️  No contract address configured`);
  console.log(`📝 Run deployment script first: node scripts/deploy-fixed.js`);
}

console.log('\n🌐 Network Configuration:');
const rpcUrl = process.env.SEPOLIA_RPC_URL;
console.log(`📡 Sepolia RPC: ${rpcUrl || 'Using default'}`);

console.log('\n📦 IPFS Configuration:');
const pinataKey = process.env.PINATA_API_KEY;
const pinataSecret = process.env.PINATA_SECRET_KEY;
if (pinataKey && pinataSecret) {
  console.log(`✅ Pinata configured for IPFS storage`);
} else {
  console.log(`❌ Pinata not configured - reports won't upload to IPFS`);
}

console.log('\n🎯 Next Steps:');
if (!allRequiredPresent) {
  console.log('❌ Missing required environment variables');
  console.log('📝 Update your .env.local file with the missing variables');
  console.log('💡 Check .env.example for reference');
} else if (!contractAddress) {
  console.log('🚀 Environment ready for deployment');
  console.log('📝 Run: node scripts/deploy-fixed.js');
} else {
  console.log('✅ All set! Ready for testing');
  console.log('🧪 Run: npm run dev');
  console.log('🌐 Visit: http://localhost:3000/test-web3');
}

console.log('\n=====================================');
