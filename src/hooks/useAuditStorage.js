// src/hooks/useAuditStorage.js
// Hook for handling Web3-based audit report storage with MetaMask integration
// FIXED: Static analysis is FREE, only AI analysis costs 0.003 ETH

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';

// Simple contract ABI for audit storage
const AUDIT_STORAGE_ABI = [
  {
    "inputs": [
      {"name": "contractAddress", "type": "address"},
      {"name": "ipfsHash", "type": "string"},
      {"name": "securityScore", "type": "uint8"},
      {"name": "riskLevel", "type": "uint8"} // 0=LOW, 1=MEDIUM, 2=HIGH
    ],
    "name": "saveAuditReport",
    "outputs": [{"name": "auditId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "auditId", "type": "uint256"}],
    "name": "getAuditReport",
    "outputs": [
      {"name": "contractAddress", "type": "address"},
      {"name": "auditor", "type": "address"},
      {"name": "ipfsHash", "type": "string"},
      {"name": "securityScore", "type": "uint8"},
      {"name": "riskLevel", "type": "uint8"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserAudits",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStorageFee",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address - using a valid format for testing (you'll need to deploy the actual contract)
const AUDIT_STORAGE_CONTRACT = process.env.NEXT_PUBLIC_AUDIT_STORAGE_CONTRACT || null;

// Temporary fallback for development - will be replaced with actual deployed contract
const DEVELOPMENT_MODE = !AUDIT_STORAGE_CONTRACT;

export function useAuditStorage() {
  const { address, isConnected } = useAccount();
  const [isStoringAudit, setIsStoringAudit] = useState(false);
  const [storageError, setStorageError] = useState(null);
  const [lastStoredAudit, setLastStoredAudit] = useState(null);

  // Contract interactions
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read storage fee - only if contract is deployed
  const { data: storageFee } = useReadContract({
    address: AUDIT_STORAGE_CONTRACT,
    abi: AUDIT_STORAGE_ABI,
    functionName: 'getStorageFee',
    enabled: !DEVELOPMENT_MODE && !!AUDIT_STORAGE_CONTRACT,
  });

  // Read user's audit list - only if contract is deployed
  const { data: userAudits, refetch: refetchUserAudits } = useReadContract({
    address: AUDIT_STORAGE_CONTRACT,
    abi: AUDIT_STORAGE_ABI,
    functionName: 'getUserAudits',
    args: address ? [address] : undefined,
    enabled: !!address && !DEVELOPMENT_MODE && !!AUDIT_STORAGE_CONTRACT,
  });

  /**
   * Determine if audit is AI-powered or static analysis
   */
  const getAuditType = (auditData) => {
    // Check various indicators to determine audit type
    const analysisType = auditData.analysisType || auditData.analysis?.analysisType || auditData.type;
    
    // Check if it's explicitly marked as AI
    if (analysisType?.includes('ai') || analysisType?.includes('AI')) {
      return 'AI';
    }
    
    // Check if it's explicitly marked as static/tools
    if (analysisType?.includes('static') || analysisType?.includes('tools') || analysisType?.includes('mock')) {
      return 'STATIC';
    }
    
    // Check model usage
    const modelsUsed = auditData.modelsUsed || auditData.analysis?.modelsUsed || [];
    if (modelsUsed.length > 0 && !modelsUsed.some(model => model.includes('Mock'))) {
      return 'AI';
    }
    
    // Check tools used
    const toolsUsed = auditData.toolsUsed || auditData.analysis?.toolsUsed || [];
    if (toolsUsed.some(tool => tool.includes('Mock'))) {
      return 'STATIC';
    }
    
    // Default to static (free) to be safe
    return 'STATIC';
  };

  /**
   * Save audit report to blockchain + IPFS
   * FREE for static analysis, 0.003 ETH for AI analysis
   */
  const saveAuditToBlockchain = useCallback(async (auditData) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first');
    }

    // Check if contract is deployed
    if (DEVELOPMENT_MODE) {
      throw new Error('Smart contract not deployed yet. Please deploy the AuditStorage contract and set NEXT_PUBLIC_AUDIT_STORAGE_CONTRACT in your environment variables.');
    }

    setIsStoringAudit(true);
    setStorageError(null);

    try {
      console.log('🔐 Starting Web3 audit storage process...', auditData);

      // Determine audit type
      const auditType = getAuditType(auditData);
      console.log('📊 Detected audit type:', auditType);

      // Step 1: Upload to IPFS first
      const ipfsResult = await uploadToIPFS(auditData);
      if (!ipfsResult.success) {
        throw new Error('Failed to upload audit report to IPFS');
      }

      console.log('🌐 IPFS upload successful:', ipfsResult.ipfsHash);

      // Step 2: Prepare contract data
      const contractAddress = auditData.contractAddress;
      const ipfsHash = ipfsResult.ipfsHash;
      const securityScore = Math.min(100, Math.max(0, auditData.securityScore || 75));
      const riskLevel = getRiskLevelEnum(auditData.riskLevel);

      // Step 3: Calculate storage fee based on audit type
      let fee = parseEther('0'); // Default to FREE
      
      if (auditType === 'AI') {
        // Only charge for AI analysis
        fee = storageFee || parseEther('0.003');
        console.log('💰 AI Audit - Fee required:', fee.toString(), 'wei (0.003 ETH)');
      } else {
        // Static analysis is completely FREE
        fee = parseEther('0');
        console.log('🆓 Static Analysis - FREE (0 ETH)');
      }

      console.log('💳 Preparing blockchain transaction...', {
        contractAddress,
        ipfsHash: ipfsHash.slice(0, 12) + '...',
        securityScore,
        riskLevel,
        auditType,
        fee: fee.toString(),
        feeETH: auditType === 'AI' ? '0.003 ETH' : '0 ETH'
      });

      // Step 4: Execute blockchain transaction
      await writeContract({
        address: AUDIT_STORAGE_CONTRACT,
        abi: AUDIT_STORAGE_ABI,
        functionName: 'saveAuditReport',
        args: [contractAddress, ipfsHash, securityScore, riskLevel],
        value: fee, // This will be 0 for static, 0.003 ETH for AI
      });

      console.log('✅ Transaction submitted to blockchain');

      // The transaction confirmation will be handled by the transaction receipt hook
      return {
        success: true,
        ipfsHash: ipfsResult.ipfsHash,
        ipfsUrl: ipfsResult.ipfsUrl,
        txHash: hash,
        auditType,
        fee: fee.toString(),
        feeETH: auditType === 'AI' ? '0.003 ETH' : '0 ETH'
      };

    } catch (error) {
      console.error('❌ Audit storage failed:', error);
      setStorageError(error.message);
      throw error;
    } finally {
      setIsStoringAudit(false);
    }
  }, [isConnected, address, writeContract, storageFee, hash]);

  /**
   * Save audit using simple IPFS + localStorage (for when contract not deployed)
   */
  const saveAuditSimple = useCallback(async (auditData) => {
    try {
      setIsStoringAudit(true);
      setStorageError(null);

      console.log('💾 Saving audit with simple IPFS + localStorage...');

      // Determine audit type
      const auditType = getAuditType(auditData);
      console.log('📊 Detected audit type:', auditType);

      // Save to IPFS + localStorage (always free in development mode)
      const response = await fetch('/api/save-audit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...auditData,
          userAddress: address,
          timestamp: Date.now(),
          auditType,
          cost: auditType === 'AI' ? '0.003 ETH' : '0 ETH',
          method: 'simple'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Audit saved successfully:', result);
        setLastStoredAudit({
          auditId: result.auditId,
          confirmed: true,
          timestamp: Date.now(),
          auditType,
          cost: auditType === 'AI' ? '0.003 ETH' : '0 ETH'
        });

        return {
          success: true,
          auditId: result.auditId,
          ipfsHash: result.ipfs?.hash,
          ipfsUrl: result.ipfs?.url,
          auditType,
          cost: auditType === 'AI' ? '0.003 ETH' : '0 ETH'
        };
      } else {
        throw new Error(result.error || 'Failed to save audit');
      }

    } catch (error) {
      console.error('❌ Simple audit save failed:', error);
      setStorageError(error.message);
      throw error;
    } finally {
      setIsStoringAudit(false);
    }
  }, [address]);

  /**
   * Upload audit data to IPFS
   */
  const uploadToIPFS = async (auditData) => {
    try {
      const response = await fetch('/api/save-audit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...auditData,
          userAddress: address,
          timestamp: Date.now(),
          onlyIPFS: true, // Flag to only upload to IPFS, not save locally yet
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload to IPFS');
      }

      return {
        success: true,
        ipfsHash: result.ipfs.hash,
        ipfsUrl: result.ipfs.url,
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  };

  /**
   * Get user's audit history from blockchain
   */
  const getUserAuditHistory = useCallback(async () => {
    if (!address || !userAudits) return [];

    try {
      console.log('📊 Fetching user audit history from blockchain...');
      
      const auditPromises = userAudits.map(async (auditId) => {
        const auditData = await readContract({
          address: AUDIT_STORAGE_CONTRACT,
          abi: AUDIT_STORAGE_ABI,
          functionName: 'getAuditReport',
          args: [auditId],
        });

        return {
          id: auditId.toString(),
          contractAddress: auditData[0],
          auditor: auditData[1],
          ipfsHash: auditData[2],
          securityScore: auditData[3],
          riskLevel: getRiskLevelString(auditData[4]),
          timestamp: Number(auditData[5]) * 1000, // Convert to milliseconds
          source: 'blockchain',
          hasIPFSReport: !!auditData[2],
          ipfsUrl: `https://gateway.pinata.cloud/ipfs/${auditData[2]}`,
        };
      });

      const audits = await Promise.all(auditPromises);
      console.log(`✅ Loaded ${audits.length} audits from blockchain`);
      
      return audits.sort((a, b) => b.timestamp - a.timestamp);

    } catch (error) {
      console.error('❌ Failed to fetch audit history:', error);
      return [];
    }
  }, [address, userAudits]);

  /**
   * Convert risk level string to enum
   */
  const getRiskLevelEnum = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 0;
      case 'medium': return 1;
      case 'high': return 2;
      default: return 1; // Default to medium
    }
  };

  /**
   * Convert risk level enum to string
   */
  const getRiskLevelString = (riskEnum) => {
    switch (Number(riskEnum)) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      default: return 'Medium';
    }
  };

  // Monitor transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('✅ Audit storage transaction confirmed!', hash);
      
      // Refresh user audits
      refetchUserAudits();
      
      // Set success state
      setLastStoredAudit({
        txHash: hash,
        confirmed: true,
        timestamp: Date.now()
      });

      // Emit event for audit history to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auditStored', {
          detail: { txHash: hash, confirmed: true }
        }));
      }
    }
  }, [isConfirmed, hash, refetchUserAudits]);

  // Monitor transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('❌ Transaction error:', writeError);
      setStorageError(writeError.message);
    }
  }, [writeError]);

  return {
    // State
    isConnected,
    userAddress: address,
    isStoringAudit: isPending || isConfirming || isStoringAudit,
    storageError,
    lastStoredAudit,
    
    // Transaction status
    txHash: hash,
    isConfirming,
    isConfirmed,
    
    // Contract data
    storageFee,
    userAudits,
    
    // Functions
    saveAuditToBlockchain,
    saveAuditSimple, // New simple save function
    getUserAuditHistory,
    refetchUserAudits,
    getAuditType, // Export for external use
    
    // Computed values
    canSaveAudit: isConnected && !isPending && !isConfirming,
    storageFeeEth: storageFee ? (Number(storageFee) / 1e18).toFixed(4) : '0.003',
    isContractDeployed: !DEVELOPMENT_MODE,
    contractAddress: AUDIT_STORAGE_CONTRACT,
  };
}
