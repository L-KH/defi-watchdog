// Enhanced Audit History Component with Recovery Capabilities
// File: src/components/audit/EnhancedAuditHistory.js

import React, { useState, useEffect } from 'react';
import { useAuditRecovery } from '../../hooks/useAuditRecovery';
import { useAuditStorage } from '../../hooks/useAuditStorage';
import { useAccount } from 'wagmi';

export default function EnhancedAuditHistory({ onSelectAudit }) {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [showRecoveryPanel, setShowRecoveryPanel] = useState(false);
  const [recoveryTxHash, setRecoveryTxHash] = useState('');

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { getUserAuditHistory } = useAuditStorage();

  // Enhanced recovery hook
  const {
    isRecovering,
    recoveryError,
    recoveredAudit,
    recoverySource,
    recoverByTxHash,
    recoverByRequestId,
    recoverUserAudits,
    recoverFromSession,
    clearRecovery,
    getRecoveryStats
  } = useAuditRecovery();

  // Get recovery statistics
  const recoveryStats = getRecoveryStats();

  useEffect(() => {
    loadAuditHistory();
    checkWalletConnection();
    
    // Listen for audit completion events
    const handleAuditCompleted = (event) => {
      console.log('🎉 Audit completed event received:', event.detail);
      loadAuditHistory(); // Refresh the history
    };
    
    window.addEventListener('auditCompleted', handleAuditCompleted);
    
    return () => {
      window.removeEventListener('auditCompleted', handleAuditCompleted);
    };
  }, []);

  // Handle recovered audit
  useEffect(() => {
    if (recoveredAudit) {
      console.log('✅ Audit recovered, refreshing history...');
      loadAuditHistory(); // Refresh history after recovery
      
      // Auto-select the recovered audit if it's complete
      if (recoveredAudit.completed && onSelectAudit) {
        onSelectAudit(recoveredAudit);
      }
    }
  }, [recoveredAudit, onSelectAudit]);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
      setUserAddress(window.ethereum.selectedAddress);
    }
  };

  const loadAuditHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user address from Web3 hook
      const connectedAddress = address;
      if (!connectedAddress || !isConnected) {
        console.log('No wallet connected, checking localStorage only');
        loadFromLocalStorage();
        return;
      }

      console.log('🔍 Loading audit history for user:', connectedAddress.slice(0, 10) + '...');

      const allAudits = [];

      // 1. Load from blockchain (Web3)
      try {
        console.log('🔗 Loading from blockchain...');
        const blockchainAudits = await getUserAuditHistory();
        if (blockchainAudits.length > 0) {
          console.log(`✅ Loaded ${blockchainAudits.length} audits from blockchain`);
          allAudits.push(...blockchainAudits.map(audit => ({ ...audit, source: 'blockchain' })));
        }
      } catch (blockchainError) {
        console.warn('⚠️ Blockchain load failed:', blockchainError.message);
      }

      // 2. Try to load from API with enhanced persistence
      try {
        const response = await fetch(`/api/user-audit-history?userAddress=${connectedAddress}&limit=20`);
        const data = await response.json();

        if (data.success && data.audits) {
          console.log(`✅ Loaded ${data.audits.length} audits from API`);
          // Merge API audits, avoiding duplicates from blockchain
          const apiAudits = data.audits.filter(apiAudit => 
            !allAudits.some(existingAudit => 
              existingAudit.contractAddress?.toLowerCase() === apiAudit.contractAddress?.toLowerCase() &&
              Math.abs(new Date(existingAudit.timestamp) - new Date(apiAudit.timestamp)) < 60000 // Within 1 minute
            )
          ).map(audit => ({ ...audit, source: 'api' }));
          allAudits.push(...apiAudits);
        }
      } catch (apiError) {
        console.warn('⚠️ API load failed:', apiError.message);
      }

      // 3. Load from localStorage as final fallback
      const localAudits = loadFromLocalStorageData();
      if (localAudits.length > 0) {
        // Merge local audits, avoiding duplicates
        const uniqueLocalAudits = localAudits.filter(localAudit => 
          !allAudits.some(existingAudit => 
            existingAudit.contractAddress?.toLowerCase() === localAudit.contractAddress?.toLowerCase() &&
            Math.abs(new Date(existingAudit.timestamp) - new Date(localAudit.timestamp)) < 60000
          )
        ).map(audit => ({ ...audit, source: 'localStorage' }));
        allAudits.push(...uniqueLocalAudits);
      }

      // Sort all audits by timestamp
      allAudits.sort((a, b) => {
        const timeA = new Date(a.completedAt || a.timestamp || a.createdAt || 0);
        const timeB = new Date(b.completedAt || b.timestamp || b.createdAt || 0);
        return timeB - timeA;
      });

      console.log(`📁 Total unique audits loaded: ${allAudits.length}`);
      setAudits(allAudits);

    } catch (error) {
      console.error('❌ Failed to load audit history:', error);
      setError(error.message);
      // Final fallback to localStorage only
      const localAudits = loadFromLocalStorageData();
      setAudits(localAudits.map(audit => ({ ...audit, source: 'localStorage' })));
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorageData = () => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available');
      return [];
    }

    console.log('📱 Loading audits from localStorage...');
    
    const localAudits = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('audit_')) {
          try {
            const auditData = JSON.parse(localStorage.getItem(key));
            // Only include completed audits or those with results
            if (auditData.completed || auditData.auditResult) {
              localAudits.push(auditData);
            }
          } catch (error) {
            console.warn('Failed to parse localStorage audit:', key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }

    // Sort by completion time
    localAudits.sort((a, b) => {
      const timeA = a.completedAt || a.timestamp || a.createdAt || 0;
      const timeB = b.completedAt || b.timestamp || b.createdAt || 0;
      return new Date(timeB) - new Date(timeA);
    });

    console.log(`📱 Found ${localAudits.length} local audits`);
    return localAudits;
  };

  const loadFromLocalStorage = () => {
    const localAudits = loadFromLocalStorageData();
    setAudits(localAudits.map(audit => ({ ...audit, source: 'localStorage' })));
  };

  const handleRecoverByTxHash = async () => {
    if (!recoveryTxHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }

    try {
      clearRecovery();
      await recoverByTxHash(recoveryTxHash.trim());
      setRecoveryTxHash('');
      setShowRecoveryPanel(false);
    } catch (error) {
      setError(`Recovery failed: ${error.message}`);
    }
  };

  const handleRecoverFromSession = () => {
    try {
      clearRecovery();
      const recovered = recoverFromSession();
      if (recovered) {
        setShowRecoveryPanel(false);
      }
    } catch (error) {
      setError(`Session recovery failed: ${error.message}`);
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Audit History</h2>
            <p className="text-sm text-gray-600">Your previous security analyses</p>
          </div>
        </div>
        
        {/* Recovery Panel Toggle */}
        <button
          onClick={() => setShowRecoveryPanel(!showRecoveryPanel)}
          className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <span className="mr-2">🔄</span>
          Recovery
          {recoveryStats.incomplete > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
              {recoveryStats.incomplete}
            </span>
          )}
        </button>
      </div>

      {/* Recovery Panel */}
      {showRecoveryPanel && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Audit Recovery</h3>
          
          {/* Recovery Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-green-600">{recoveryStats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-orange-600">{recoveryStats.incomplete}</div>
              <div className="text-xs text-gray-600">Incomplete</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-blue-600">{recoveryStats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className={`text-lg font-bold ${recoveryStats.hasSessionData ? 'text-purple-600' : 'text-gray-400'}`}>
                {recoveryStats.hasSessionData ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-600">Session Data</div>
            </div>
          </div>

          {/* Recovery Options */}
          <div className="space-y-4">
            {/* Recover by Transaction Hash */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter transaction hash (0x...)"
                value={recoveryTxHash}
                onChange={(e) => setRecoveryTxHash(e.target.value)}
                className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={isRecovering}
              />
              <button
                onClick={handleRecoverByTxHash}
                disabled={isRecovering || !recoveryTxHash.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRecovering ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Recovering...
                  </div>
                ) : (
                  'Recover by TX Hash'
                )}
              </button>
            </div>

            {/* Session Recovery */}
            {recoveryStats.hasSessionData && (
              <button
                onClick={handleRecoverFromSession}
                disabled={isRecovering}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                🔄 Recover from Browser Session
              </button>
            )}

            {/* Recovery Status */}
            {recoveryError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                ❌ {recoveryError}
              </div>
            )}

            {recoveredAudit && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✅ Successfully recovered audit from {recoverySource?.method}
                {recoverySource?.ipfsRecovered && ' (including IPFS data)'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
          <span className="text-gray-600">Loading audit history...</span>
        </div>
      ) : audits.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">📊</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Audits Yet</h3>
          <p className="text-gray-600 mb-4">
            {userAddress 
              ? "You haven't completed any audits yet. Start by analyzing a smart contract!"
              : "Connect your wallet to see your audit history."
            }
          </p>
          {!userAddress && (
            <button
              onClick={checkWalletConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      ) : (
        /* Audit List */
        <div className="space-y-4">
          {audits.map((audit, index) => (
            <div
              key={audit._id || audit.requestId || index}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectAudit && onSelectAudit(audit)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Contract Info */}
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {audit.contractName || 'Unknown Contract'}
                    </h3>
                    {audit.source === 'blockchain' && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        🔗 Blockchain
                      </span>
                    )}
                    {audit.source === 'api' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full ml-2">
                        💾 Database
                      </span>
                    )}
                    {audit.source === 'localStorage' && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full ml-2">
                        📱 Local
                      </span>
                    )}
                    {audit.recoveredFromIPFS && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full ml-2">
                        🌐 IPFS
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <p className="text-sm text-gray-600 font-mono mb-2">
                    {(audit.contractAddress || audit.address)?.slice(0, 42) || 'Unknown Address'}
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mb-2">
                    {audit.securityScore !== undefined && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-1">Security Score:</span>
                        <span className={`text-sm font-semibold ${getScoreColor(audit.securityScore)}`}>
                          {audit.securityScore}/100
                        </span>
                      </div>
                    )}
                    
                    {audit.riskLevel && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(audit.riskLevel)}`}>
                        {audit.riskLevel} Risk
                      </span>
                    )}
                  </div>

                  {/* Timestamp and Transaction */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {formatTimeAgo(audit.completedAt || audit.timestamp || audit.createdAt)}
                    </span>
                    {audit.txHash && (
                      <span className="font-mono">
                        TX: {audit.txHash.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-4">
                  <button className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                    View Report
                  </button>
                </div>
              </div>

              {/* IPFS Information */}
              {audit.reportIPFSHash && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">🌐 IPFS:</span>
                    <span className="font-mono">{audit.reportIPFSHash.slice(0, 12)}...</span>
                    <a
                      href={audit.reportIPFSUrl || `https://gateway.pinata.cloud/ipfs/${audit.reportIPFSHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-purple-600 hover:text-purple-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on IPFS ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Persistence Info */}
      {audits.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            <p>
              🔒 All audit reports are automatically saved with persistent storage.
              {audits.filter(a => a.reportIPFSHash).length > 0 && (
                <> {audits.filter(a => a.reportIPFSHash).length} reports backed up to IPFS.</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
