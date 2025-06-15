// scripts/verify-deployment.js
const hre = require("hardhat");

async function main() {
  console.log("🔍 Verifying DeFi Watchdog Audit NFT Contract deployment...");
  
  // Contract address from environment or command line
  const contractAddress = process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || 
                         process.argv[2] || 
                         '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118';
  
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  
  // Get the contract instance
  const DeFiWatchdogAuditNFT = await hre.ethers.getContractFactory("DeFiWatchdogAuditNFT");
  const contract = DeFiWatchdogAuditNFT.attach(contractAddress);
  
  try {
    // Test basic contract functions
    console.log("\n📊 Contract Information:");
    console.log("========================");
    
    // Get contract name and symbol
    const name = await contract.name();
    const symbol = await contract.symbol();
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    
    // Get pricing information
    const staticPrice = await contract.STATIC_AUDIT_PRICE();
    const aiPrice = await contract.AI_AUDIT_PRICE();
    console.log("Static Audit Price:", hre.ethers.utils.formatEther(staticPrice), "ETH");
    console.log("AI Audit Price:", hre.ethers.utils.formatEther(aiPrice), "ETH");
    
    // Get statistics
    const totalAudits = await contract.getTotalAudits();
    const [staticCount, aiCount] = await contract.getAuditTypeStats();
    console.log("Total Audits:", totalAudits.toString());
    console.log("Static Audits:", staticCount.toString());
    console.log("AI Audits:", aiCount.toString());
    
    // Get owner
    const owner = await contract.owner();
    console.log("Contract Owner:", owner);
    
    console.log("\n✅ Contract verification successful!");
    console.log("🎯 Contract is deployed and responding correctly");
    
    // Test minting permissions (read-only check)
    const testAddress = "0x742d35Cc6634C0532925a3b8D42C5D7c5041234d".toLowerCase(); // Use lowercase to avoid checksum issues
    console.log(`Test address certificate status: checking ${testAddress}...`);
    
    try {
      const hasCertificate = await contract.hasCertificate(testAddress);
      console.log(`Test address certificate status: ${hasCertificate}`);
    } catch (error) {
      console.log(`⚠️ Could not check certificate status: ${error.message}`);
    }
    
    // Get risk level stats
    const [lowCount, mediumCount, highCount, criticalCount] = await contract.getRiskLevelStats();
    console.log("\n📈 Risk Level Statistics:");
    console.log("Low Risk:", lowCount.toString());
    console.log("Medium Risk:", mediumCount.toString());
    console.log("High Risk:", highCount.toString());
    console.log("Critical Risk:", criticalCount.toString());
    
    // Check contract code
    const code = await hre.ethers.provider.getCode(contractAddress);
    console.log("\n📋 Contract Code Size:", code.length - 2, "bytes"); // -2 for 0x prefix
    
    console.log("\n🚀 Deployment Verification Complete!");
    console.log("The contract is ready for production use.");
    
  } catch (error) {
    console.error("❌ Contract verification failed:", error.message);
    
    // Check if contract exists
    const code = await hre.ethers.provider.getCode(contractAddress);
    if (code === '0x') {
      console.error("💀 No contract found at this address");
      console.log("🔧 Please check the contract address or deploy the contract first");
    } else {
      console.error("🐛 Contract exists but function calls failed");
      console.log("🔧 Check if the ABI matches the deployed contract");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n✅ Verification completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });
