// src/components/MintAuditNFTButton.js
import React, { useState } from 'react';
import useAuditNFT from '../hooks/useAuditNFT';

/**
 * Component for minting audit report NFTs
 * Supports both Static (free) and AI (paid) minting
 */
export default function MintAuditNFTButton({ 
  auditResult, 
  auditType = 'STATIC', 
  disabled = false,
  onMintSuccess,
  onMintError,
  className = ''
}) {
  const {
    mintStaticAudit,
    mintAIAudit,
    isLoading,
    isConnected,
    error,
    clearError,
    staticPrice,
    aiPrice,
    checkCertificate
  } = useAuditNFT();

  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [hasCertificate, setHasCertificate] = useState(false);

  // Check if contract already has certificate
  React.useEffect(() => {
    async function checkExistingCertificate() {
      if (auditResult?.contractInfo?.address) {
        const exists = await checkCertificate(auditResult.contractInfo.address);
        setHasCertificate(exists);
      }
    }
    checkExistingCertificate();
  }, [auditResult?.contractInfo?.address, checkCertificate]);

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!auditResult) {
      alert('No audit result available to mint');
      return;
    }

    if (hasCertificate) {
      alert('This contract already has a certificate NFT');
      return;
    }

    try {
      setIsMinting(true);
      clearError();

      // Prepare audit data for minting
      const auditData = {
        contractAddress: auditResult.contractInfo?.address || auditResult.address,
        contractName: auditResult.contractInfo?.contractName || 
                     auditResult.contractName || 
                     `Contract-${(auditResult.contractInfo?.address || auditResult.address || '').slice(0, 8)}`,
        securityScore: calculateSecurityScore(auditResult),
        riskLevel: determineRiskLevel(auditResult),
        timestamp: Date.now(),
        auditType: auditType,
        
        // Include the full audit result for IPFS storage
        ...auditResult,
        
        // Add metadata for IPFS
        metadata: {
          auditedAt: new Date().toISOString(),
          auditTool: 'DeFi Watchdog',
          version: '2.0',
          network: auditResult.contractInfo?.network || 'unknown'
        }
      };

      console.log('🚀 Minting audit NFT with data:', auditData);

      let result;
      if (auditType === 'STATIC') {
        result = await mintStaticAudit(auditData);
      } else {
        result = await mintAIAudit(auditData);
      }

      setMintResult(result);
      
      if (onMintSuccess) {
        onMintSuccess(result);
      }

      console.log('🎉 NFT minted successfully:', result);

    } catch (error) {
      console.error('❌ Minting failed:', error);
      
      if (onMintError) {
        onMintError(error);
      }
    } finally {
      setIsMinting(false);
    }
  };

  // Calculate security score from audit result
  const calculateSecurityScore = (result) => {
    if (result.securityScore !== undefined) {
      return Math.min(Math.max(result.securityScore, 0), 100);
    }
    
    if (result.analysis?.securityScore !== undefined) {
      return Math.min(Math.max(result.analysis.securityScore, 0), 100);
    }

    // Fallback calculation based on findings
    const findings = result.analysis?.keyFindings || result.findings || [];
    const criticalFindings = findings.filter(f => 
      f.severity === 'CRITICAL' || f.severity === 'HIGH'
    ).length;
    
    const mediumFindings = findings.filter(f => 
      f.severity === 'MEDIUM'
    ).length;
    
    // Simple scoring algorithm
    let score = 100;
    score -= criticalFindings * 20;
    score -= mediumFindings * 10;
    
    return Math.max(score, 0);
  };

  // Determine risk level from audit result
  const determineRiskLevel = (result) => {
    if (result.riskLevel) {
      return result.riskLevel.toUpperCase();
    }
    
    if (result.analysis?.riskLevel) {
      return result.analysis.riskLevel.toUpperCase();
    }

    const securityScore = calculateSecurityScore(result);
    
    if (securityScore >= 90) return 'LOW';
    if (securityScore >= 70) return 'MEDIUM';
    if (securityScore >= 50) return 'HIGH';
    return 'CRITICAL';
  };

  const isDisabled = disabled || isMinting || isLoading || !isConnected || hasCertificate;
  const price = auditType === 'STATIC' ? staticPrice : aiPrice;
  const buttonText = auditType === 'STATIC' ? 'Mint Static Report NFT' : 'Mint AI Report NFT';

  return (
    <div className="space-y-4">
      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isDisabled}
        className={`
          w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200
          ${auditType === 'STATIC' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
          }
          text-white shadow-lg hover:shadow-xl transform hover:scale-105
          disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isMinting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            {auditType === 'STATIC' ? 'Minting Free NFT...' : 'Processing Payment & Minting...'}
          </div>
        ) : hasCertificate ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">✅</span>
            Certificate Already Exists
          </div>
        ) : !isConnected ? (
          'Connect Wallet to Mint'
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2">{auditType === 'STATIC' ? '🆓' : '💎'}</span>
            {buttonText} ({price})
          </div>
        )}
      </button>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <p className="font-semibold text-red-800">Minting Failed</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {mintResult && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-green-500 text-xl mr-3">🎉</span>
            <div className="flex-1">
              <p className="font-semibold text-green-800">NFT Minted Successfully!</p>
              <div className="text-green-700 text-sm mt-2 space-y-1">
                <p><strong>Token ID:</strong> #{mintResult.tokenId}</p>
                <p><strong>Type:</strong> {mintResult.auditType} Audit</p>
                <p><strong>Cost:</strong> {mintResult.cost}</p>
                <p><strong>IPFS:</strong> 
                  <a 
                    href={mintResult.ipfsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View Report
                  </a>
                </p>
                <p><strong>Transaction:</strong> 
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${mintResult.transactionHash}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View on Etherscan
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCertificate && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-yellow-500 text-xl mr-3">ℹ️</span>
            <div>
              <p className="font-semibold text-yellow-800">Certificate Already Exists</p>
              <p className="text-yellow-700 text-sm mt-1">
                This contract already has an audit certificate NFT. Only one certificate per contract is allowed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Info */}
      <div className="text-center text-sm text-gray-600">
        <p>
          {auditType === 'STATIC' ? (
            <>🆓 Static analysis reports are <strong>completely free</strong> to mint</>
          ) : (
            <>💎 AI analysis reports cost <strong>0.003 ETH</strong> to mint</>
          )}
        </p>
        <p className="mt-1">
          All reports are stored permanently on IPFS and can be viewed in your audit history
        </p>
      </div>
    </div>
  );
}

// Utility component for displaying mint button in results
export function MintButtonForResults({ auditResult, auditType = 'STATIC' }) {
  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🏆 Mint Your Audit Certificate
        </h3>
        <p className="text-gray-600 text-sm">
          Create a permanent NFT certificate of this security audit on the blockchain
        </p>
      </div>
      
      <MintAuditNFTButton 
        auditResult={auditResult}
        auditType={auditType}
        onMintSuccess={(result) => {
          console.log('✅ Mint completed:', result);
          // You can add additional success handling here
        }}
        onMintError={(error) => {
          console.error('❌ Mint failed:', error);
          // You can add additional error handling here
        }}
      />
    </div>
  );
}
