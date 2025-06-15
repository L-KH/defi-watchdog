import React, { useState } from 'react';
import { useEnhancedWeb3 } from '../hooks/useEnhancedWeb3';

export default function ContractDiagnostics() {
  const { 
    CONTRACT_ADDRESS, 
    contractDiagnostics, 
    diagnoseContract, 
    isConnected, 
    isCorrectNetwork 
  } = useEnhancedWeb3();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!CONTRACT_ADDRESS) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">ℹ</span>
          </div>
          <div>
            <p className="font-medium text-blue-800">Demo Mode</p>
            <p className="text-blue-600 text-sm">No payment contract configured - running in free analysis mode</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isConnected || !isCorrectNetwork) {
    return null;
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">🔍</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">Contract Diagnostics</p>
            <p className="text-gray-600 text-sm">Contract: {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-6)}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {contractDiagnostics ? (
            <div className="space-y-3">
              {contractDiagnostics.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 font-medium">❌ Contract Error</p>
                  <p className="text-red-600 text-sm">{contractDiagnostics.error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded p-3 border">
                    <p className="text-sm text-gray-600">Contract Exists</p>
                    <p className="font-medium text-green-600">
                      ✅ Yes (Code: {contractDiagnostics.codeLength} bytes)
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-3 border">
                    <p className="text-sm text-gray-600">Audit Price</p>
                    <p className={`font-medium ${contractDiagnostics.auditPrice ? 'text-green-600' : 'text-red-600'}`}>
                      {contractDiagnostics.auditPrice ? (
                        `✅ ${contractDiagnostics.auditPrice} ETH`
                      ) : (
                        `❌ ${contractDiagnostics.auditPriceError}`
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-3 border">
                    <p className="text-sm text-gray-600">Request Count</p>
                    <p className={`font-medium ${contractDiagnostics.requestCount !== undefined ? 'text-green-600' : 'text-red-600'}`}>
                      {contractDiagnostics.requestCount !== undefined ? (
                        `✅ ${contractDiagnostics.requestCount} requests`
                      ) : (
                        `❌ ${contractDiagnostics.requestCountError}`
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-3 border">
                    <p className="text-sm text-gray-600">Contract Owner</p>
                    <p className={`font-medium text-xs ${contractDiagnostics.owner ? 'text-green-600' : 'text-red-600'}`}>
                      {contractDiagnostics.owner ? (
                        `✅ ${contractDiagnostics.owner.slice(0, 10)}...${contractDiagnostics.owner.slice(-6)}`
                      ) : (
                        `❌ ${contractDiagnostics.ownerError}`
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={diagnoseContract}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
                >
                  🔄 Re-run Diagnostics
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Running contract diagnostics...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}