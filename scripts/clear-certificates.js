// Script to remove certificate status from test contracts
const hre = require("hardhat");

async function main() {
  console.log("🧹 Clearing certificate status for demo contracts...");
  
  const contractAddress = process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118';
  
  // Get signer
  const [owner] = await hre.ethers.getSigners();
  console.log("📝 Owner address:", owner.address);
  
  // Connect to contract
  const contract = await hre.ethers.getContractAt("DeFiWatchdogAuditNFT", contractAddress);
  
  // List of addresses to clear
  const addressesToClear = [
    '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  ];
  
  for (const addr of addressesToClear) {
    try {
      const hasCert = await contract.hasCertificate(addr);
      if (hasCert) {
        console.log(`🔍 ${addr} has certificate, removing...`);
        const tx = await contract.removeCertificateStatus(addr);
        await tx.wait();
        console.log(`✅ Removed certificate status for ${addr}`);
      } else {
        console.log(`⏭️  ${addr} doesn't have certificate, skipping...`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${addr}:`, error.message);
    }
  }
  
  console.log("✅ Certificate cleanup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
