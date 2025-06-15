const { ethers } = require("hardhat");

// Multiple RPC endpoints to try
const RPC_ENDPOINTS = [
  "https://eth-sepolia.public.blastapi.io",
  "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  "https://rpc.sepolia.org",
  "https://ethereum-sepolia.publicnode.com",
  "https://1rpc.io/sepolia"
];

async function deployWithRPC(rpcUrl) {
  console.log(`🔗 Trying RPC: ${rpcUrl}`);
  
  // Create a custom provider for this RPC
  const provider = new ethers.providers.JsonRpcProvider({
    url: rpcUrl,
    timeout: 30000
  });
  
  // Connect wallet to this provider
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  // Check connection
  const balance = await wallet.getBalance();
  console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
  
  if (balance.lt(ethers.utils.parseEther("0.005"))) {
    throw new Error("Insufficient balance");
  }
  
  // Deploy contract
  const SimpleAuditPayment = await ethers.getContractFactory("SimpleAuditPayment", wallet);
  const auditPayment = await SimpleAuditPayment.deploy({
    gasLimit: 2000000,
    gasPrice: ethers.utils.parseUnits("25", "gwei")
  });
  
  console.log(`📦 Deployment transaction: ${auditPayment.deployTransaction.hash}`);
  
  // Wait for confirmation
  await auditPayment.deployed();
  
  return auditPayment;
}

async function main() {
  console.log("🚀 Multi-RPC Deployment Script for SimpleAuditPayment");
  console.log("=====================================================");
  
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }
  
  let auditPayment = null;
  let successfulRPC = null;
  
  // Try each RPC endpoint
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      auditPayment = await deployWithRPC(rpcUrl);
      successfulRPC = rpcUrl;
      console.log(`✅ Successfully deployed using: ${rpcUrl}`);
      break;
    } catch (error) {
      console.log(`❌ Failed with ${rpcUrl}: ${error.message}`);
      continue;
    }
  }
  
  if (!auditPayment) {
    throw new Error("❌ All RPC endpoints failed. Please try again later or check your internet connection.");
  }
  
  console.log("\n🎉 Deployment Successful!");
  console.log("==========================");
  console.log("✅ Contract Address:", auditPayment.address);
  console.log("🌐 Successful RPC:", successfulRPC);
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${auditPayment.address}`);
  
  // Test basic functions
  console.log("\n🧪 Testing contract...");
  try {
    const owner = await auditPayment.owner();
    const price = await auditPayment.AUDIT_PRICE();
    const count = await auditPayment.getRequestCount();
    
    console.log("✅ Owner:", owner);
    console.log("✅ Price:", ethers.utils.formatEther(price), "ETH");
    console.log("✅ Count:", count.toString());
  } catch (error) {
    console.log("⚠️ Function test failed, but contract is deployed");
  }
  
  console.log("\n📝 UPDATE YOUR .env.local:");
  console.log("===========================");
  console.log(`NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${auditPayment.address}`);
  console.log(`SEPOLIA_RPC_URL=${successfulRPC}`);
  
  console.log("\n🔄 Next Steps:");
  console.log("===============");
  console.log("1. Copy the contract address above");
  console.log("2. Update your .env.local file with the new address");
  console.log("3. Restart your dev server: npm run dev");
  console.log("4. Test the payment in your app");
  
  return auditPayment.address;
}

main()
  .then((address) => {
    console.log(`\n✅ Final contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment completely failed:", error.message);
    console.log("\n💡 Alternative options:");
    console.log("=======================");
    console.log("1. Try again in a few minutes (network might be congested)");
    console.log("2. Use a different internet connection");
    console.log("3. Get a free Alchemy or Infura API key for better reliability");
    console.log("4. Deploy manually via Remix IDE: https://remix.ethereum.org");
    process.exit(1);
  });