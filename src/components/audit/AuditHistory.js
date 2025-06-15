// Modern audit history component with enhanced Web3
import React, { useState, useEffect } from 'react';
import { useEnhancedWeb3 } from '../../hooks/useEnhancedWeb3';
import { formatDistanceToNow } from 'date-fns';
import UnifiedWeb3Button from '../UnifiedWeb3Button';

export default function AuditHistory({ onSelectAudit }) {
  const [isMounted, setIsMounted] = useState(false);
  const { 
    userHistory, 
    isConnected,
    address,
    CONTRACT_ADDRESS,
    refetchHistory
  } = useEnhancedWeb3();
  
  const [showHistory, setShowHistory] = useState(false);
  
  // Debug logging to help diagnose history issues
  useEffect(() => {
    if (isConnected && isMounted) {
      console.log('🔍 AuditHistory Debug:', {
        isConnected,
        address: address?.slice(0, 10) + '...',
        CONTRACT_ADDRESS: !!CONTRACT_ADDRESS,
        userHistoryLength: userHistory.length,
        showHistory,
        userHistory: userHistory.map(audit => ({
          requestId: audit.requestId,
          contractName: audit.contractName,
          completed: audit.completed,
          hasIPFS: audit.hasIPFSReport || !!audit.reportIPFSHash
        }))
      });
      
      // Store debug data globally for console access
      window._auditHistoryDebug = {
        isConnected,
        address,
        CONTRACT_ADDRESS,
        userHistoryLength: userHistory.length,
        userHistory
      };
    }
  }, [isConnected, address, CONTRACT_ADDRESS, userHistory, showHistory, isMounted]);
  
  // Handle SSR hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Listen for audit completion events to refresh history
  useEffect(() => {
    const handleAuditCompleted = (event) => {
      console.log('🔄 Audit completed, refreshing history...', event.detail);
      if (isConnected && CONTRACT_ADDRESS) {
        setTimeout(() => {
          refetchHistory();
        }, 1000); // Small delay to ensure localStorage is updated
      }
    };
    
    window.addEventListener('auditCompleted', handleAuditCompleted);
    
    return () => {
      window.removeEventListener('auditCompleted', handleAuditCompleted);
    };
  }, [isConnected, CONTRACT_ADDRESS, refetchHistory]);
  
  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Don't render during SSR to avoid hydration issues
  if (!isMounted) {
    return null;
  }
  
  // Always show the component, but conditionally show payment features
  // Not connected state
  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border border-purple-200 p-8 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Audit History</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {CONTRACT_ADDRESS 
              ? "Connect your wallet to view all your previous smart contract audits and access saved reports"
              : "Connect your wallet to track your audit history when payment features are enabled"
            }
          </p>
          <div className="flex justify-center">
            <UnifiedWeb3Button showBalance={false} showChain={true} />
          </div>
        </div>
      </div>
    );
  }
  
  // Connected state
  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Audit History</h3>
              <p className="text-purple-100 text-sm">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                {!CONTRACT_ADDRESS && (
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">Demo Mode</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>
      </div>
      
      {/* History Content */}
      {showHistory && (
        <div className="p-6">
          {CONTRACT_ADDRESS ? (
            // Show real audit history when payment contract is configured
            userHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Audits Yet</h4>
                <p className="text-gray-600 mb-6">Start your first premium audit to see it here</p>
                
                {/* Debug info for troubleshooting */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-left max-w-md mx-auto">
                  <div className="font-medium text-gray-700 mb-2">🔍 Debug Info:</div>
                  <div className="space-y-1 text-gray-600">
                    <div>Connected: {isConnected ? '✅' : '❌'}</div>
                    <div>Address: {address?.slice(0, 10)}...{address?.slice(-4)}</div>
                    <div>Contract: {CONTRACT_ADDRESS ? '✅ Configured' : '❌ Not configured'}</div>
                    <div>History Length: {userHistory.length}</div>
                  </div>
                </div>
                
                {/* Manual refresh button */}
                <div className="mb-4">
                  <button
                    onClick={() => {
                      console.log('🔄 Manual refresh triggered');
                      refetchHistory();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm mr-3"
                  >
                    🔄 Refresh History
                  </button>
                  <button
                    onClick={() => {
                      // Load and run quick fix + emergency save
                      const script = document.createElement('script');
                      script.src = '/debug/emergency-audit-save.js';
                      script.onload = () => {
                        // Run emergency save system first
                        if (window.ensureAuditIsSaved && window.checkForOrphanedAudits) {
                          window.checkForOrphanedAudits();
                          window.setupAuditInterceptors();
                        }
                        
                        // Then run regular quick fix
                        const quickFixScript = document.createElement('script');
                        quickFixScript.src = '/debug/quick-fix.js';
                        quickFixScript.onload = () => {
                          if (window.quickFixAuditHistory) {
                            const result = window.quickFixAuditHistory();
                            console.log('🔧 Quick fix result:', result);
                            if (result.success) {
                              setTimeout(() => refetchHistory(), 500);
                            }
                          }
                        };
                        document.head.appendChild(quickFixScript);
                      };
                      document.head.appendChild(script);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm mr-3"
                  >
                    🔧 Quick Fix
                  </button>
                  <button
                    onClick={() => {
                      console.log('📊 Current debug state:', window._auditHistoryDebug);
                      // Open debug script
                      const script = document.createElement('script');
                      script.src = '/debug/audit-history-debug.js';
                      document.head.appendChild(script);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🔍 Debug
                  </button>
                </div>
                
                <div className="inline-flex items-center text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Load a contract above and click "Pay & Start Analysis"
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userHistory.map((audit, index) => (
                  <div
                    key={audit.requestId || index}
                    className="group border-2 border-gray-200 hover:border-purple-300 rounded-xl p-5 transition-all duration-200 cursor-pointer hover:shadow-lg"
                    onClick={() => onSelectAudit && onSelectAudit(audit)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Contract Name and Status */}
                        <div className="flex items-center mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg mr-3">
                            {audit.contractName || 'Unknown Contract'}
                          </h4>
                          {audit.completed ? (
                            <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700 mr-1"></div>
                              Processing
                            </span>
                          )}
                        </div>
                        
                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {/* Contract Address */}
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="font-mono text-xs">
                              {audit.contractAddress.slice(0, 10)}...{audit.contractAddress.slice(-8)}
                            </span>
                          </div>
                          
                          {/* Time */}
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatDistanceToNow(audit.timestamp)} ago</span>
                          </div>
                          
                          {/* Transaction Hash */}
                          {audit.txHash && (
                            <div className="flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <a 
                                href={`https://sepolia.etherscan.io/tx/${audit.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-700 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View TX
                              </a>
                            </div>
                          )}
                          
                          {/* Security Score */}
                          {audit.completed && audit.securityScore > 0 && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span className={`font-semibold ${getScoreColor(audit.securityScore)}`}>
                                Score: {audit.securityScore}/100
                              </span>
                              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRiskColor(audit.riskLevel)}`}>
                                {audit.riskLevel}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="ml-6">
                        {audit.completed ? (
                          audit.hasIPFSReport || audit.reportIPFSHash ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const reportUrl = audit.ipfsViewUrl || audit.reportIPFSUrl || `https://gateway.pinata.cloud/ipfs/${audit.reportIPFSHash}`;
                                window.open(reportUrl, '_blank');
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>IPFS Report</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          ) : (
                            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                              Report Available
                            </div>
                          )
                        ) : (
                          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                            Pending...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Refresh Button */}
                <div className="pt-4 text-center">
                  <button
                    onClick={refetchHistory}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh History
                  </button>
                </div>
              </div>
            )
          ) : (
            // Show demo/explanation when payment contract is not configured
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Demo Mode</h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Audit history tracking will be available when the payment contract is deployed. 
                For now, you can run free analysis without payment.
              </p>
              <div className="inline-flex items-center text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Load a contract above to run free analysis
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}