// API endpoint to complete audit and update contract
import { ethers } from 'ethers';
import { reportStorage } from '../../services/reportStorage';

const AUDIT_PAYMENT_ABI = [
  "function completeAudit(uint256, string, uint256, string) external",
  "function auditRequests(uint256) view returns (address user, address contractToAudit, string contractName, uint256 paidAmount, uint256 timestamp, bool completed, string reportIPFSHash, uint256 securityScore, string riskLevel)"
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { 
    requestId, 
    report, 
    securityScore, 
    riskLevel,
    contractAddress,
    contractName 
  } = req.body;
  
  if (!requestId || !report) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // 1. Upload report to IPFS
    console.log('Uploading report to IPFS...');
    const uploadResult = await reportStorage.uploadReport(report, {
      requestId,
      contractAddress,
      contractName,
      securityScore,
      riskLevel
    });
    
    if (!uploadResult.success) {
      throw new Error('Failed to upload report to IPFS');
    }
    
    // 2. Update contract with IPFS hash (only if not mock)
    if (!uploadResult.mock && process.env.PRIVATE_KEY) {
      console.log('Updating contract with IPFS hash...');
      
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'
      );
      
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS,
        AUDIT_PAYMENT_ABI,
        wallet
      );
      
      // Complete audit on-chain
      const tx = await contract.completeAudit(
        requestId,
        uploadResult.ipfsHash,
        securityScore || 0,
        riskLevel || 'Unknown'
      );
      
      await tx.wait();
      console.log('Contract updated successfully');
    }
    
    // 3. Return success response
    return res.status(200).json({
      success: true,
      ipfsHash: uploadResult.ipfsHash,
      reportUrl: uploadResult.url,
      requestId,
      mock: uploadResult.mock || false
    });
    
  } catch (error) {
    console.error('Audit completion error:', error);
    return res.status(500).json({ 
      error: error.message,
      details: 'Failed to complete audit'
    });
  }
}
