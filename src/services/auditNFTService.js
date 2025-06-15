// src/services/auditNFTService.js
import { ethers } from 'ethers';
import { AUDIT_NFT_ABI, AUDIT_NFT_ADDRESSES, AUDIT_NFT_CONFIG } from '../contracts/AuditNFT.js';
import pinataService from './pinataService';

/**
 * Service for interacting with the DeFi Watchdog Audit NFT contract
 */
class AuditNFTService {
  constructor() {
    this.contractAddress = null;
    this.contract = null;
    this.provider = null;
    this.signer = null;
  }

  /**
   * Initialize the service with provider and network
   */
  async initialize(provider, network = 'sepolia') {
    try {
      this.provider = provider;
      this.contractAddress = AUDIT_NFT_ADDRESSES[network];
      
      if (!this.contractAddress) {
        throw new Error(`Contract address not found for network: ${network}`);
      }

      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        AUDIT_NFT_ABI,
        provider
      );

      console.log('✅ AuditNFTService initialized:', {
        network,
        contractAddress: this.contractAddress
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AuditNFTService:', error);
      throw error;
    }
  }

  /**
   * Connect signer for transactions
   */
  async connectSigner(signer) {
    this.signer = signer;
    if (this.contract) {
      this.contract = this.contract.connect(signer);
    }
  }

  /**
   * Upload audit report to IPFS and mint Static NFT (Free)
   */
  async mintStaticAuditReport(auditData) {
    try {
      if (!this.signer) {
        throw new Error('Signer not connected. Please connect wallet.');
      }

      console.log('🚀 Starting static audit NFT mint process...');

      // Step 1: Upload to IPFS
      console.log('📤 Uploading audit report to IPFS...');
      const ipfsResult = await pinataService.uploadAuditReport(auditData);
      
      if (!ipfsResult.success) {
        throw new Error('Failed to upload report to IPFS');
      }

      console.log('✅ IPFS upload successful:', ipfsResult.ipfsHash);

      // Step 2: Convert risk level to enum
      const riskLevel = this._convertRiskLevel(auditData.riskLevel);
      
      // Step 3: Mint NFT
      console.log('⛽ Estimating gas...');
      const gasEstimate = await this.contract.estimateGas.mintStaticAuditReport(
        auditData.contractAddress,
        auditData.contractName || 'Unknown Contract',
        ipfsResult.ipfsHash,
        Math.min(Math.max(auditData.securityScore || 0, 0), 100),
        riskLevel
      );

      console.log('💎 Minting Static Audit NFT...');
      const transaction = await this.contract.mintStaticAuditReport(
        auditData.contractAddress,
        auditData.contractName || 'Unknown Contract',
        ipfsResult.ipfsHash,
        Math.min(Math.max(auditData.securityScore || 0, 0), 100),
        riskLevel,
        {
          gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
        }
      );

      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await transaction.wait();

      // Extract token ID from events
      const tokenId = this._extractTokenIdFromReceipt(receipt);

      console.log('🎉 Static Audit NFT minted successfully!', {
        tokenId: tokenId.toString(),
        transactionHash: receipt.transactionHash,
        ipfsHash: ipfsResult.ipfsHash
      });

      return {
        success: true,
        tokenId: tokenId.toString(),
        transactionHash: receipt.transactionHash,
        ipfsHash: ipfsResult.ipfsHash,
        ipfsUrl: ipfsResult.ipfsUrl,
        contractAddress: this.contractAddress,
        gasUsed: receipt.gasUsed.toString(),
        auditType: 'STATIC',
        cost: '0 ETH'
      };

    } catch (error) {
      console.error('❌ Failed to mint static audit NFT:', error);
      throw this._formatError(error);
    }
  }

  /**
   * Upload audit report to IPFS and mint AI NFT (0.003 ETH)
   */
  async mintAIAuditReport(auditData) {
    try {
      if (!this.signer) {
        throw new Error('Signer not connected. Please connect wallet.');
      }

      console.log('🚀 Starting AI audit NFT mint process...');

      // Step 1: Upload to IPFS
      console.log('📤 Uploading audit report to IPFS...');
      const ipfsResult = await pinataService.uploadAuditReport(auditData);
      
      if (!ipfsResult.success) {
        throw new Error('Failed to upload report to IPFS');
      }

      console.log('✅ IPFS upload successful:', ipfsResult.ipfsHash);

      // Step 2: Convert risk level to enum
      const riskLevel = this._convertRiskLevel(auditData.riskLevel);
      
      // Step 3: Prepare payment
      const paymentAmount = ethers.utils.parseEther(AUDIT_NFT_CONFIG.aiAuditPrice);
      
      // Step 4: Estimate gas
      console.log('⛽ Estimating gas...');
      const gasEstimate = await this.contract.estimateGas.mintAIAuditReport(
        auditData.contractAddress,
        auditData.contractName || 'Unknown Contract',
        ipfsResult.ipfsHash,
        Math.min(Math.max(auditData.securityScore || 0, 0), 100),
        riskLevel,
        { value: paymentAmount }
      );

      console.log('💎 Minting AI Audit NFT...');
      const transaction = await this.contract.mintAIAuditReport(
        auditData.contractAddress,
        auditData.contractName || 'Unknown Contract',
        ipfsResult.ipfsHash,
        Math.min(Math.max(auditData.securityScore || 0, 0), 100),
        riskLevel,
        {
          value: paymentAmount,
          gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
        }
      );

      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await transaction.wait();

      // Extract token ID from events
      const tokenId = this._extractTokenIdFromReceipt(receipt);

      console.log('🎉 AI Audit NFT minted successfully!', {
        tokenId: tokenId.toString(),
        transactionHash: receipt.transactionHash,
        ipfsHash: ipfsResult.ipfsHash,
        paymentAmount: AUDIT_NFT_CONFIG.aiAuditPrice + ' ETH'
      });

      return {
        success: true,
        tokenId: tokenId.toString(),
        transactionHash: receipt.transactionHash,
        ipfsHash: ipfsResult.ipfsHash,
        ipfsUrl: ipfsResult.ipfsUrl,
        contractAddress: this.contractAddress,
        gasUsed: receipt.gasUsed.toString(),
        auditType: 'AI_POWERED',
        cost: AUDIT_NFT_CONFIG.aiAuditPrice + ' ETH'
      };

    } catch (error) {
      console.error('❌ Failed to mint AI audit NFT:', error);
      throw this._formatError(error);
    }
  }

  /**
   * Get user's audit history
   */
  async getUserAudits(userAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      console.log('📊 Fetching user audit history for:', userAddress);
      
      const tokenIds = await this.contract.getUserAudits(userAddress);
      const audits = [];

      for (const tokenId of tokenIds) {
        try {
          const auditSummary = await this.contract.getAuditSummary(tokenId);
          audits.push({
            tokenId: tokenId.toString(),
            contractAddress: auditSummary.contractAddr,
            contractName: auditSummary.contractName,
            auditType: auditSummary.auditType === 0 ? 'STATIC' : 'AI_POWERED',
            securityScore: auditSummary.securityScore,
            riskLevel: this._convertRiskLevelFromEnum(auditSummary.riskLevel),
            timestamp: new Date(auditSummary.timestamp.toNumber() * 1000),
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${await this.contract.tokenURI(tokenId)}`
          });
        } catch (error) {
          console.warn(`Failed to fetch audit ${tokenId}:`, error.message);
        }
      }

      console.log('✅ User audit history fetched:', audits.length, 'audits');
      return audits;

    } catch (error) {
      console.error('❌ Failed to fetch user audits:', error);
      throw this._formatError(error);
    }
  }

  /**
   * Get contract statistics
   */
  async getContractStats() {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const [totalAudits, auditTypeStats, riskLevelStats] = await Promise.all([
        this.contract.getTotalAudits(),
        this.contract.getAuditTypeStats(),
        this.contract.getRiskLevelStats()
      ]);

      return {
        totalAudits: totalAudits.toNumber(),
        staticAudits: auditTypeStats.staticCount.toNumber(),
        aiAudits: auditTypeStats.aiCount.toNumber(),
        riskDistribution: {
          low: riskLevelStats.lowCount.toNumber(),
          medium: riskLevelStats.mediumCount.toNumber(),
          high: riskLevelStats.highCount.toNumber(),
          critical: riskLevelStats.criticalCount.toNumber()
        }
      };
    } catch (error) {
      console.error('❌ Failed to fetch contract stats:', error);
      throw this._formatError(error);
    }
  }

  /**
   * Check if contract already has certificate
   */
  async hasCertificate(contractAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      return await this.contract.hasCertificate(contractAddress);
    } catch (error) {
      console.error('❌ Failed to check certificate status:', error);
      return false;
    }
  }

  // ============ Helper Methods ============

  /**
   * Convert risk level string to enum number
   */
  _convertRiskLevel(riskLevel) {
    const riskMap = {
      'LOW': 0,
      'MEDIUM': 1,
      'HIGH': 2,
      'CRITICAL': 3,
      'low': 0,
      'medium': 1,
      'high': 2,
      'critical': 3
    };
    return riskMap[riskLevel] || 0;
  }

  /**
   * Convert risk level enum to string
   */
  _convertRiskLevelFromEnum(enumValue) {
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return riskLevels[enumValue] || 'LOW';
  }

  /**
   * Extract token ID from transaction receipt
   */
  _extractTokenIdFromReceipt(receipt) {
    for (const log of receipt.logs) {
      try {
        const parsedLog = this.contract.interface.parseLog(log);
        if (parsedLog.name === 'AuditReportMinted') {
          return parsedLog.args.tokenId;
        }
      } catch (error) {
        // Skip unparseable logs
      }
    }
    throw new Error('Token ID not found in transaction receipt');
  }

  /**
   * Format error messages for user display
   */
  _formatError(error) {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return new Error('Insufficient funds for transaction and gas fees');
    }
    
    if (error.code === 'USER_REJECTED') {
      return new Error('Transaction rejected by user');
    }

    if (error.message.includes('execution reverted')) {
      const revertReason = error.message.match(/execution reverted: (.+)$/);
      if (revertReason) {
        return new Error(revertReason[1]);
      }
    }

    return error;
  }
}

// Export singleton instance
const auditNFTService = new AuditNFTService();
export default auditNFTService;

// Also export the class for testing
export { AuditNFTService };
