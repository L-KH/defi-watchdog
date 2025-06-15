// Modern Web3 payment hook using wagmi v2 and RainbowKit
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useToast } from '../components/common/Toast';
import { sepolia } from 'wagmi/chains';

// Contract ABI - only the functions we need
const AUDIT_PAYMENT_ABI = [
  {
    name: 'AUDIT_PRICE',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'requestAudit',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: '_contractToAudit', type: 'address' },
      { name: '_contractName', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getUserAuditHistory',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'user', type: 'address' },
          { name: 'contractToAudit', type: 'address' },
          { name: 'contractName', type: 'string' },
          { name: 'paidAmount', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'completed', type: 'bool' },
          { name: 'reportIPFSHash', type: 'string' },
          { name: 'securityScore', type: 'uint256' },
          { name: 'riskLevel', type: 'string' },
        ],
      },
    ],
  },
  {
    name: 'AuditPaid',
    type: 'event',
    inputs: [
      { name: 'requestId', type: 'uint256', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'contractToAudit', type: 'address', indexed: true },
      { name: 'contractName', type: 'string', indexed: false },
      { name: 'paidAmount', type: 'uint256', indexed: false },
    ],
  },
];

export function useWeb3Payment() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { showError, showSuccess, showInfo } = useToast();
  
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS;
  
  // Check if on correct network
  const isCorrectNetwork = chain?.id === sepolia.id;
  
  // Read audit price
  const { data: auditPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AUDIT_PAYMENT_ABI,
    functionName: 'AUDIT_PRICE',
    chainId: sepolia.id,
  });
  
  // Read user history
  const { data: userHistory, refetch: refetchHistory } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AUDIT_PAYMENT_ABI,
    functionName: 'getUserAuditHistory',
    args: [address],
    chainId: sepolia.id,
  });
  
  // Contract write for payment
  const { 
    data: hash,
    writeContract,
    isPending: isPaymentLoading,
    error: paymentError
  } = useWriteContract();
  
  // Wait for transaction
  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: transactionData 
  } = useWaitForTransactionReceipt({
    hash,
  });
  
  // Extract request ID when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && transactionData) {
      // Find the AuditPaid event in the logs
      const event = transactionData.logs.find(log => {
        // Match by event signature or address + topics
        return log.address.toLowerCase() === CONTRACT_ADDRESS?.toLowerCase();
      });
      
      if (event && event.topics[1]) {
        const requestId = parseInt(event.topics[1], 16);
        setCurrentRequestId(requestId);
        showSuccess(`Payment confirmed! Audit #${requestId} started.`);
        refetchHistory();
      }
    }
  }, [isConfirmed, transactionData]);
  
  // Switch to Sepolia
  const switchToSepolia = async () => {
    try {
      await switchChain({ chainId: sepolia.id });
      return true;
    } catch (error) {
      showError('Failed to switch network. Please switch to Sepolia manually.');
      return false;
    }
  };
  
  // Pay for audit
  const payForAudit = async (contractAddress, contractName) => {
    try {
      // Check if connected
      if (!isConnected) {
        showError('Please connect your wallet first');
        return null;
      }
      
      // Check network
      if (!isCorrectNetwork) {
        showInfo('Switching to Sepolia network...');
        const switched = await switchToSepolia();
        if (!switched) return null;
      }
      
      // Check if contract exists
      if (!CONTRACT_ADDRESS) {
        showError('Payment contract not configured');
        return null;
      }
      
      // Make payment
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: AUDIT_PAYMENT_ABI,
        functionName: 'requestAudit',
        args: [contractAddress, contractName || 'Unknown Contract'],
        value: auditPrice || parseEther('0.003'),
      });
      
      showInfo('Transaction sent! Waiting for confirmation...');
      
      return { success: true };
      
    } catch (error) {
      console.error('Payment failed:', error);
      showError(error.message || 'Payment failed');
      return { success: false, error: error.message };
    }
  };
  
  // Format history for display
  const formattedHistory = userHistory?.map((audit, index) => ({
    requestId: userHistory.length - index,
    contractAddress: audit.contractToAudit,
    contractName: audit.contractName,
    timestamp: Number(audit.timestamp) * 1000,
    completed: audit.completed,
    reportIPFSHash: audit.reportIPFSHash,
    securityScore: Number(audit.securityScore),
    riskLevel: audit.riskLevel,
    paidAmount: formatEther(audit.paidAmount),
  })).reverse() || [];
  
  return {
    // State
    address,
    isConnected,
    isCorrectNetwork,
    currentRequestId,
    chain,
    
    // Payment
    payForAudit,
    isProcessing: isPaymentLoading || isConfirming,
    isConfirmed,
    
    // History
    userHistory: formattedHistory,
    refetchHistory,
    
    // Network
    switchToSepolia,
    
    // Constants
    AUDIT_PRICE: auditPrice ? formatEther(auditPrice) : '0.003',
    CONTRACT_ADDRESS,
  };
}
