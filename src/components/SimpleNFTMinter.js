// src/components/SimpleNFTMinter.js
// Simple NFT minting component that can be added to any audit result
import React, { useState } from 'react';

export default function SimpleNFTMinter({ auditData, contractInfo }) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [error, setError] = useState(null);

  // Simple mock minting for now - will be replaced with real contract interaction
  const handleMint = async (type) => {
    setIsMinting(true);
    setError(null);
    
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        success: true,
        tokenId: Math.floor(Math.random() * 1000),
        transactionHash: '0x' + Math.random().toString(16).substring(2, 66),
        type: type,
        cost: type === 'static' ? '0 ETH' : '0.003 ETH'
      };
      
      setMintResult(mockResult);
      console.log('Mock NFT minted:', mockResult);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsMinting(false);
    }
  };

  if (!auditData || !contractInfo) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mt-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🏆 Mint Audit Certificate NFT
        </h3>
        <p className="text-gray-600 text-sm">
          Create a permanent blockchain certificate of this security audit
        </p>
      </div>
      
      {mintResult ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-500 text-xl mr-3">🎉</span>
            <div>
              <p className="font-semibold text-green-800">Certificate Minted Successfully!</p>
              <p className="text-green-700 text-sm">
                Token #{mintResult.tokenId} • {mintResult.type} • {mintResult.cost}
              </p>
              <p className="text-green-700 text-xs font-mono">
                TX: {mintResult.transactionHash.slice(0, 20)}...
              </p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <p className="font-semibold text-red-800">Minting Failed</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Static Certificate */}
          <button
            onClick={() => handleMint('static')}
            disabled={isMinting}
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🆓</div>
              <h4 className="font-semibold text-gray-900 mb-1">Static Analysis Certificate</h4>
              <p className="text-sm text-gray-600 mb-2">Basic security analysis report</p>
              <div className="text-lg font-bold text-green-600">FREE</div>
              {isMinting && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
                </div>
              )}
            </div>
          </button>
          
          {/* AI Certificate */}
          <button
            onClick={() => handleMint('ai')}
            disabled={isMinting}
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">💎</div>
              <h4 className="font-semibold text-gray-900 mb-1">AI Analysis Certificate</h4>
              <p className="text-sm text-gray-600 mb-2">Advanced AI-powered analysis</p>
              <div className="text-lg font-bold text-purple-600">0.003 ETH</div>
              {isMinting && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              )}
            </div>
          </button>
        </div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          NFT certificates are minted on Sepolia testnet and stored permanently on IPFS
        </p>
      </div>
    </div>
  );
}

// Helper component to easily add to existing results
export function AddNFTMintingToResults({ auditResult, contractInfo }) {
  // Only show if we have valid audit data
  if (!auditResult || !contractInfo) {
    return null;
  }

  return (
    <SimpleNFTMinter
      auditData={auditResult}
      contractInfo={contractInfo}
    />
  );
}
