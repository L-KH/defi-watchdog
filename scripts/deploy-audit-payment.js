const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AuditPayment contract to Sepolia...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    throw new Error("❌ Insufficient balance for deployment. Need at least 0.01 ETH for gas fees.");
  }

  // Deploy the contract
  const AuditPayment = await ethers.getContractFactory("AuditPayment");
  
  console.log("📦 Deploying contract...");
  const auditPayment = await AuditPayment.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await auditPayment.deployed();

  console.log("✅ AuditPayment deployed to:", auditPayment.address);
  console.log("🔗 Contract owner:", await auditPayment.owner());
  console.log("💰 Audit price:", ethers.utils.formatEther(await auditPayment.AUDIT_PRICE()), "ETH");

  // Verify the contract on Etherscan (if API key is available)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("🔍 Waiting for block confirmations...");
    await auditPayment.deployTransaction.wait(6);
    
    console.log("✅ Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: auditPayment.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment Summary:");
  console.log("========================");
  console.log("Contract Address:", auditPayment.address);
  console.log("Owner:", await auditPayment.owner());
  console.log("Audit Price:", ethers.utils.formatEther(await auditPayment.AUDIT_PRICE()), "ETH");
  console.log("Gas Used:", auditPayment.deployTransaction.gasLimit.toString());
  console.log("\n📝 Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS=${auditPayment.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });