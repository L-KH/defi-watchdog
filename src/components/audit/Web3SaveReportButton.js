// src/components/audit/Web3SaveReportButton.js
// Enhanced save report button with Web3 integration and MetaMask transaction flow
// FIXED: Static analysis is FREE, only AI analysis costs 0.003 ETH

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuditStorage } from '../../hooks/useAuditStorage';
import { useAccount } from 'wagmi';

export default function Web3SaveReportButton({ 
  auditResult, 
  contractInfo, 
  disabled = false,
  onSaveStart,
  onSaveComplete,
  onSaveError
}) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    saveAuditToBlockchain,
    saveAuditSimple,
    isStoringAudit,
    storageError,
    canSaveAudit,
    storageFeeEth,
    txHash,
    isConfirmed,
    isConfirming,
    isContractDeployed,
    getAuditType
  } = useAuditStorage();

  const [saveStep, setSaveStep] = useState('ready'); // ready, preparing, uploading, confirming, success, error
  const [saveProgress, setSaveProgress] = useState(0);
  const [auditType, setAuditType] = useState('STATIC');
  const [estimatedCost, setEstimatedCost] = useState('0 ETH');

  // Analyze audit type when auditResult changes
  useEffect(() => {
    if (auditResult) {
      const detectedType = getAuditType(auditResult);
      setAuditType(detectedType);
      setEstimatedCost(detectedType === 'AI' ? '0.003 ETH' : '0 ETH');
      console.log('🔍 Detected audit type:', detectedType, '- Cost:', detectedType === 'AI' ? '0.003 ETH' : 'FREE');
    }
  }, [auditResult, getAuditType]);

  // Handle save button click
  const handleSave = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!auditResult || !contractInfo) {
      alert('No audit data available to save');
      return;
    }

    try {
      setSaveStep('preparing');
      setSaveProgress(10);
      onSaveStart?.();

      // Prepare audit data for storage
      const auditData = {
        requestId: `req_${Date.now()}`,
        contractAddress: contractInfo.address || contractInfo.contractAddress,
        contractName: contractInfo.contractName || 'Unknown Contract',
        userAddress: address,
        auditResult: auditResult,
        securityScore: auditResult.analysis?.securityScore || 75,
        riskLevel: auditResult.analysis?.riskLevel || 'Medium',
        network: contractInfo.network || 'sepolia',
        timestamp: Date.now(),
        analysisType: auditResult.analysisType || auditResult.type || 'static',
        modelsUsed: auditResult.modelsUsed || [],
        toolsUsed: auditResult.toolsUsed || [],
        reportData: {
          htmlReport: auditResult.htmlReport,
          jsonReport: auditResult.jsonReport,
          modelsUsed: auditResult.modelsUsed || [],
          processingTime: auditResult.processingTime
        }
      };

      console.log('💾 Preparing to save audit...', {
        contract: auditData.contractAddress?.slice(0, 10) + '...',
        score: auditData.securityScore,
        risk: auditData.riskLevel,
        type: auditType,
        cost: estimatedCost,
        contractDeployed: isContractDeployed
      });

      setSaveStep('uploading');
      setSaveProgress(30);

      let result;

      if (isContractDeployed) {
        // Web3 flow: Save to blockchain + IPFS
        result = await saveAuditToBlockchain(auditData);
        setSaveStep('confirming');
        setSaveProgress(70);
        console.log('🚀 Transaction submitted, waiting for confirmation...', result.txHash);
      } else {
        // Simple flow: Save to IPFS + localStorage (always free in development)
        result = await saveAuditSimple(auditData);
        setSaveStep('success');
        setSaveProgress(100);
        console.log('✅ Audit saved with simple method:', result);
        onSaveComplete?.(result.auditId);
        
        // Redirect to certificate page after short delay
        setTimeout(() => {
          router.push(`/certificate/${result.auditId}`);
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Save failed:', error);
      setSaveStep('error');
      setSaveProgress(0);
      onSaveError?.(error);
    }
  };

  // Monitor transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash) {
      setSaveStep('success');
      setSaveProgress(100);
      onSaveComplete?.(txHash);

      // Redirect to certificate page after short delay
      setTimeout(() => {
        router.push(`/certificate/${txHash}`);
      }, 2000);
    }
  }, [isConfirmed, txHash, router, onSaveComplete]);

  // Monitor storage errors
  useEffect(() => {
    if (storageError) {
      setSaveStep('error');
      setSaveProgress(0);
      onSaveError?.(new Error(storageError));
    }
  }, [storageError, onSaveError]);

  // Reset state when new audit result arrives
  useEffect(() => {
    if (auditResult && saveStep !== 'ready') {
      setSaveStep('ready');
      setSaveProgress(0);
    }
  }, [auditResult]);

  const getButtonContent = () => {
    switch (saveStep) {
      case 'preparing':
        return (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Preparing Report...
          </div>
        );
      
      case 'uploading':
        return (
          <div className="flex items-center">
            <div className="animate-pulse text-xl mr-3">🌐</div>
            Uploading to IPFS...
          </div>
        );
      
      case 'confirming':
        return (
          <div className="flex items-center">
            <div className="animate-pulse text-xl mr-3">⛓️</div>
            Confirming Transaction...
          </div>
        );
      
      case 'success':
        return (
          <div className="flex items-center">
            <span className="text-xl mr-3">✅</span>
            Saved Successfully!
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-center">
            <span className="text-xl mr-3">❌</span>
            Save Failed - Retry
          </div>
        );
      
      default:
        const icon = auditType === 'AI' ? '💎' : '🆓';
        const action = isContractDeployed ? 'Save Report & Create Certificate' : 'Save Report to IPFS';
        return (
          <div className="flex items-center">
            <span className="text-xl mr-3">{icon}</span>
            {action} ({estimatedCost})
          </div>
        );
    }
  };

  const getButtonStyle = () => {
    const baseStyle = "w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed";
    
    switch (saveStep) {
      case 'success':
        return `${baseStyle} bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg`;
      
      case 'error':
        return `${baseStyle} bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700`;
      
      case 'preparing':
      case 'uploading':
      case 'confirming':
        return `${baseStyle} bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg cursor-wait`;
      
      default:
        if (!isConnected) {
          return `${baseStyle} bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600`;
        }
        
        // Style based on audit type
        if (auditType === 'AI') {
          return `${baseStyle} bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700`;
        } else {
          return `${baseStyle} bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600`;
        }
    }
  };

  const isButtonDisabled = disabled || !canSaveAudit || isStoringAudit || ['preparing', 'uploading', 'confirming'].includes(saveStep);

  return (
    <div className="space-y-4">
      {/* Main Save Button */}
      <button
        onClick={handleSave}
        disabled={isButtonDisabled}
        className={getButtonStyle()}
      >
        {getButtonContent()}
      </button>

      {/* Progress Bar */}
      {saveProgress > 0 && saveStep !== 'success' && saveStep !== 'error' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${saveProgress}%` }}
          ></div>
        </div>
      )}

      {/* Status Information */}
      <div className="space-y-3">
        {/* Audit Type & Cost Information */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${
          auditType === 'AI' 
            ? 'bg-purple-50 border-purple-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center">
            <span className={`font-medium text-sm ${
              auditType === 'AI' ? 'text-purple-600' : 'text-green-600'
            }`}>
              {auditType === 'AI' ? '🤖 AI Analysis' : '🛠️ Static Analysis'}
            </span>
            <span className={`ml-2 font-bold ${
              auditType === 'AI' ? 'text-purple-800' : 'text-green-800'
            }`}>
              {estimatedCost}
            </span>
          </div>
          <div className={`text-xs ${
            auditType === 'AI' ? 'text-purple-600' : 'text-green-600'
          }`}>
            {auditType === 'AI' ? 'Premium Analysis' : 'Free Analysis'}
          </div>
        </div>

        {/* Wallet Connection Status */}
        {!isConnected && (
          <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-yellow-600 text-sm">
              🔐 Connect your wallet to save audit reports
            </span>
          </div>
        )}

        {/* Contract Deployment Status */}
        {isConnected && !isContractDeployed && (
          <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <div className="text-blue-600 font-medium text-sm mb-2">
                📦 Development Mode
              </div>
              <div className="text-blue-700 text-sm mb-3">
                Reports will be saved to IPFS for now. Blockchain features coming soon!
              </div>
              <div className="text-xs text-blue-600">
                Static analysis is FREE, AI analysis pricing will apply when blockchain is enabled.
              </div>
            </div>
          </div>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium text-sm">Transaction:</span>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 font-mono text-sm underline"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </div>
            {isConfirming && (
              <div className="mt-2 text-xs text-blue-600">
                ⏳ Waiting for confirmation...
              </div>
            )}
            {isConfirmed && (
              <div className="mt-2 text-xs text-green-600">
                ✅ Transaction confirmed!
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {storageError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 text-sm">
              <strong>Error:</strong> {storageError}
            </div>
            <div className="text-xs text-red-500 mt-1">
              Please try again or check your wallet connection.
            </div>
          </div>
        )}

        {/* Success Message */}
        {saveStep === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 font-medium">
              🎉 Audit Report Saved Successfully!
            </div>
            <div className="text-green-600 text-sm mt-1">
              Your {auditType.toLowerCase()} audit is now permanently stored {isContractDeployed ? 'on the blockchain and IPFS' : 'on IPFS'}.
            </div>
            <div className="text-green-600 text-xs mt-2">
              Redirecting to certificate page...
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">What you get:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-2">🌐</span>
            Permanent IPFS storage
          </div>
          <div className="flex items-center">
            <span className="mr-2">📜</span>
            Digital security certificate
          </div>
          <div className="flex items-center">
            <span className="mr-2">📊</span>
            Accessible from Audit History
          </div>
          <div className="flex items-center">
            <span className="mr-2">{auditType === 'AI' ? '💎' : '🆓'}</span>
            {auditType === 'AI' ? 'Premium AI Analysis' : 'Free Static Analysis'}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          💡 <strong>Pricing:</strong> Static analysis reports are completely FREE. AI analysis reports cost 0.003 ETH for advanced multi-model analysis.
        </div>
      </div>
    </div>
  );
}
