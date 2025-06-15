const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Demo Contract (allows any address)...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deployer address:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("💰 Deployer balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  const DeFiWatchdogAuditNFTDemo = await hre.ethers.getContractFactory("DeFiWatchdogAuditNFTDemo");
  const auditNFT = await DeFiWatchdogAuditNFTDemo.deploy();
  await auditNFT.deployed();
  
  console.log("✅ Demo contract deployed to:", auditNFT.address);
  console.log("🔧 Update these environment variables:");
  console.log(`NEXT_PUBLIC_AUDIT_NFT_CONTRACT=${auditNFT.address}`);
  console.log(`\n📋 This demo contract allows:`);
  console.log("- ANY address (not just contracts with bytecode)");
  console.log("- Multiple certificates per address");
  console.log("- Free minting (gas only)");
  
  // Wait for confirmations
  await auditNFT.deployTransaction.wait(5);
  
  // Verify on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: auditNFT.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }
  
  return auditNFT.address;
}

main()
  .then((address) => {
    console.log("\n📝 Demo Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
