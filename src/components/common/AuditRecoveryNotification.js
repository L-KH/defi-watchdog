// Audit Recovery Notification Component
// File: src/components/common/AuditRecoveryNotification.js

import React, { useState, useEffect } from 'react';
import { useAuditRecovery } from '../../hooks/useAuditRecovery';

export default function AuditRecoveryNotification({ onRecover }) {
  const [showNotification, setShowNotification] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const {
    isRecovering,
    recoveryError,
    recoveredAudit,
    recoverByTxHash,
    recoverFromSession,
    getRecoveryStats
  } = useAuditRecovery();

  useEffect(() => {
    checkForRecoverableAudits();
  }, []);

  useEffect(() => {
    if (recoveredAudit && onRecover) {
      onRecover(recoveredAudit);
      setShowNotification(false);
    }
  }, [recoveredAudit, onRecover]);

  const checkForRecoverableAudits = () => {
    if (isDismissed) return;

    const stats = getRecoveryStats();
    
    // Check URL parameters for recovery hints
    const urlParams = new URLSearchParams(window.location.search);
    const txHash = urlParams.get('txHash') || urlParams.get('tx');
    const requestId = urlParams.get('requestId') || urlParams.get('request');
    
    // Determine what recovery options are available
    const recoveryOptions = [];
    
    if (txHash) {
      recoveryOptions.push({
        type: 'txHash',
        value: txHash,
        description: 'Transaction hash found in URL',
        priority: 1
      });
    }
    
    if (requestId) {
      recoveryOptions.push({
        type: 'requestId',
        value: requestId,
        description: 'Request ID found in URL',
        priority: 1
      });
    }
    
    if (stats.incomplete > 0) {
      recoveryOptions.push({
        type: 'incomplete',
        value: stats.incomplete,
        description: `${stats.incomplete} incomplete audit${stats.incomplete > 1 ? 's' : ''} found`,
        priority: 2
      });
    }
    
    if (stats.hasSessionData) {
      recoveryOptions.push({
        type: 'session',
        value: true,
        description: 'Recent audit data found in browser session',
        priority: 3
      });
    }
    
    if (recoveryOptions.length > 0) {
      // Sort by priority (lower number = higher priority)
      recoveryOptions.sort((a, b) => a.priority - b.priority);
      
      setRecoveryData({
        options: recoveryOptions,
        stats: stats,
        primaryOption: recoveryOptions[0]
      });
      setShowNotification(true);
    }
  };

  const handleRecover = async (option) => {
    try {
      switch (option.type) {
        case 'txHash':
          await recoverByTxHash(option.value);
          break;
        case 'session':
          recoverFromSession();
          break;
        case 'incomplete':
          // Try to recover the first incomplete audit
          const incompleteAudits = [];
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('audit_')) {
                  try {
                    const auditData = JSON.parse(localStorage.getItem(key));
                    if (auditData.txHash && !auditData.completed) {
                      incompleteAudits.push(auditData);
                    }
                  } catch (error) {
                    // Ignore invalid entries
                  }
                }
              }
            } catch (error) {
              console.error('Failed to access localStorage:', error);
            }
          }
          
          if (incompleteAudits.length > 0) {
            await recoverByTxHash(incompleteAudits[0].txHash);
          }
          break;
        default:
          console.warn('Unknown recovery option:', option.type);
      }
    } catch (error) {
      console.error('Recovery failed:', error);
    }
  };

  const dismissNotification = () => {
    setIsDismissed(true);
    setShowNotification(false);
    
    // Store dismissal in sessionStorage to avoid re-showing during this session
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('auditRecoveryDismissed', 'true');
      } catch (error) {
        console.warn('Failed to access sessionStorage:', error);
      }
    }
  };

  // Don't show if dismissed in this session
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const dismissed = sessionStorage.getItem('auditRecoveryDismissed');
        if (dismissed) {
          setIsDismissed(true);
        }
      } catch (error) {
        // sessionStorage not available
      }
    }
  }, []);

  if (!showNotification || !recoveryData || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-xl border border-purple-200 p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">🔄</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Audit Recovery Available</h3>
              <p className="text-xs text-gray-600">Previous audit data found</p>
            </div>
          </div>
          <button
            onClick={dismissNotification}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary Recovery Option */}
        <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {recoveryData.primaryOption.description}
              </p>
              {recoveryData.primaryOption.type === 'txHash' && (
                <p className="text-xs text-gray-600 font-mono">
                  {recoveryData.primaryOption.value.slice(0, 16)}...
                </p>
              )}
            </div>
            <button
              onClick={() => handleRecover(recoveryData.primaryOption)}
              disabled={isRecovering}
              className="ml-3 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRecovering ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                  Recovering...
                </div>
              ) : (
                'Recover Now'
              )}
            </button>
          </div>
        </div>

        {/* Additional Options */}
        {recoveryData.options.length > 1 && (
          <div className="space-y-2">
            {recoveryData.options.slice(1).map((option, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{option.description}</span>
                <button
                  onClick={() => handleRecover(option)}
                  disabled={isRecovering}
                  className="text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
                >
                  Recover
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {recoveryError && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            ❌ {recoveryError}
          </div>
        )}

        {/* Recovery Stats */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total audits: {recoveryData.stats.total}</span>
            <span>Incomplete: {recoveryData.stats.incomplete}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
