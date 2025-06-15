// Enhanced audit recovery hook - handles persistent audit retrieval
// File: src/hooks/useAuditRecovery.js

import { useState, useEffect, useCallback } from 'react';

// Generate UUID for browser environment
const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Enhanced hook for recovering audit reports from multiple sources
 * Supports recovery by txHash, requestId, userAddress, and IPFS fallback
 * Now includes backward compatibility with old audit formats
 */
export function useAuditRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState(null);
  const [recoveredAudit, setRecoveredAudit] = useState(null);
  const [recoverySource, setRecoverySource] = useState(null);

  /**
   * Migrate old audit format to new enhanced format
   */
  const migrateOldAudit = useCallback((oldAudit, txHash) => {
    if (!oldAudit) return null;
    
    // Check if it's already in new format
    if (oldAudit.persistent && oldAudit.recoverable) {
      return oldAudit;
    }
    
    // Migrate old format to new format
    const migratedAudit = {
      ...oldAudit,
      _id: oldAudit._id || oldAudit.requestId || generateUUID(),
      requestId: oldAudit.requestId || oldAudit._id,
      contractAddress: oldAudit.contractAddress || oldAudit.address,
      userAddress: oldAudit.userAddress || oldAudit.user,
      txHash: txHash || oldAudit.txHash,
      persistent: true,
      recoverable: true,
      migratedFromOld: true,
      migrationTimestamp: new Date().toISOString(),
      reportVersion: '2.0',
      recoveryMethods: ['localStorage', 'migration']
    };
    
    console.log('📦 Migrated old audit format to enhanced format');
    return migratedAudit;
  }, []);

  /**
   * Try to recover from localStorage by transaction hash
   */
  const recoverFromLocalStorageByTxHash = useCallback(async (txHash) => {
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('LocalStorage not available');
    }

    console.log('🔍 Searching localStorage for txHash:', txHash.slice(0, 10) + '...');
    
    // Search through all localStorage audit entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('audit_')) {
        try {
          const auditData = JSON.parse(localStorage.getItem(key));
          
          // Check if this audit matches the transaction hash
          if (auditData.txHash === txHash || auditData.transactionHash === txHash) {
            console.log('✅ Found matching audit in localStorage:', key);
            
            // Migrate to new format if needed
            const migratedAudit = migrateOldAudit(auditData, txHash);
            
            // Update localStorage with migrated version
            if (migratedAudit.migratedFromOld) {
              localStorage.setItem(key, JSON.stringify(migratedAudit));
            }
            
            return migratedAudit;
          }
        } catch (error) {
          console.warn('Failed to parse audit entry:', key, error);
        }
      }
    }
    
    throw new Error('No audit found in localStorage with this transaction hash');
  }, [migrateOldAudit]);

  /**
   * Recover audit by transaction hash
   */
  const recoverByTxHash = useCallback(async (txHash) => {
    if (!txHash) {
      throw new Error('Transaction hash is required');
    }

    console.log('🔄 Recovering audit by txHash:', txHash.slice(0, 10) + '...');
    
    setIsRecovering(true);
    setRecoveryError(null);
    
    try {
      // First, try to recover from localStorage (for backward compatibility)
      try {
        console.log('📱 Trying localStorage recovery first...');
        const localAudit = await recoverFromLocalStorageByTxHash(txHash);
        if (localAudit) {
          console.log('✅ Successfully recovered audit from localStorage');
          setRecoveredAudit(localAudit);
          setRecoverySource({
            method: 'localStorage',
            migrated: localAudit.migratedFromOld || false,
            hasIPFSBackup: !!localAudit.reportIPFSHash
          });
          return localAudit;
        }
      } catch (localError) {
        console.log('⚠️ LocalStorage recovery failed, trying API...', localError.message);
      }
      
      // If localStorage fails, try the enhanced API
      console.log('🌐 Trying enhanced API recovery...');
      const response = await fetch(`/api/enhanced-audit-persistence?txHash=${txHash}&includeIPFS=true`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Successfully recovered audit from enhanced API');
        setRecoveredAudit(data.audit);
        setRecoverySource({
          method: 'api',
          ipfsRecovered: data.recovery?.ipfsRecovered || false,
          hasIPFSBackup: data.recovery?.hasIPFSBackup || false
        });
        return data.audit;
      } else {
        throw new Error(data.error || 'Failed to recover audit by txHash from API');
      }
    } catch (error) {
      console.error('❌ Audit recovery by txHash failed:', error);
      setRecoveryError(error.message);
      throw error;
    } finally {
      setIsRecovering(false);
    }
  }, [recoverFromLocalStorageByTxHash]);

  /**
   * Recover audit by request ID
   */
  const recoverByRequestId = useCallback(async (requestId) => {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    console.log('🔄 Recovering audit by requestId:', requestId.slice(0, 10) + '...');
    
    setIsRecovering(true);
    setRecoveryError(null);
    
    try {
      const response = await fetch(`/api/enhanced-audit-persistence?requestId=${requestId}&includeIPFS=true`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Successfully recovered audit by requestId');
        setRecoveredAudit(data.audit);
        setRecoverySource({
          method: 'requestId',
          ipfsRecovered: data.recovery?.ipfsRecovered || false,
          hasIPFSBackup: data.recovery?.hasIPFSBackup || false
        });
        return data.audit;
      } else {
        throw new Error(data.error || 'Failed to recover audit by requestId');
      }
    } catch (error) {
      console.error('❌ Audit recovery by requestId failed:', error);
      setRecoveryError(error.message);
      throw error;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  /**
   * Recover user's audit history
   */
  const recoverUserAudits = useCallback(async (userAddress, limit = 10) => {
    if (!userAddress) {
      throw new Error('User address is required');
    }

    console.log('🔄 Recovering user audits:', userAddress.slice(0, 10) + '...');
    
    setIsRecovering(true);
    setRecoveryError(null);
    
    try {
      const response = await fetch(`/api/enhanced-audit-persistence?userAddress=${userAddress}&includeIPFS=true`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Successfully recovered user audits');
        setRecoveredAudit(data.audit);
        setRecoverySource({
          method: 'userAddress',
          ipfsRecovered: data.recovery?.ipfsRecovered || false,
          hasIPFSBackup: data.recovery?.hasIPFSBackup || false
        });
        return data.audit;
      } else {
        throw new Error(data.error || 'Failed to recover user audits');
      }
    } catch (error) {
      console.error('❌ User audit recovery failed:', error);
      setRecoveryError(error.message);
      throw error;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  /**
   * Auto-recovery on page load - checks for incomplete audits and attempts recovery
   */
  const autoRecover = useCallback(async () => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    console.log('🔄 Starting auto-recovery check...');
    
    try {
      // Check URL parameters for recovery hints
      const urlParams = new URLSearchParams(window.location.search);
      const txHash = urlParams.get('txHash') || urlParams.get('tx');
      const requestId = urlParams.get('requestId') || urlParams.get('request');
      
      // Check localStorage for incomplete audits (safely)
      const incompleteAudits = [];
      if (window.localStorage) {
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
                console.warn('Failed to parse audit data from localStorage:', key);
              }
            }
          }
        } catch (error) {
          console.warn('Failed to access localStorage:', error);
        }
      }
      
      // Try recovery by URL parameters first
      if (txHash) {
        console.log('🔍 Found txHash in URL, attempting recovery...');
        try {
          await recoverByTxHash(txHash);
          return;
        } catch (error) {
          console.warn('URL txHash recovery failed:', error.message);
        }
      }
      
      if (requestId) {
        console.log('🔍 Found requestId in URL, attempting recovery...');
        try {
          await recoverByRequestId(requestId);
          return;
        } catch (error) {
          console.warn('URL requestId recovery failed:', error.message);
        }
      }
      
      // Try recovery of incomplete audits
      if (incompleteAudits.length > 0) {
        console.log(`🔍 Found ${incompleteAudits.length} incomplete audits, attempting recovery...`);
        
        for (const incompleteAudit of incompleteAudits) {
          try {
            if (incompleteAudit.txHash) {
              const recovered = await recoverByTxHash(incompleteAudit.txHash);
              if (recovered && recovered.completed) {
                console.log('✅ Recovered incomplete audit:', incompleteAudit.txHash.slice(0, 10) + '...');
                // Update localStorage with completed data
                localStorage.setItem(
                  `audit_${incompleteAudit.requestId}`, 
                  JSON.stringify({
                    ...incompleteAudit,
                    completed: true,
                    auditResult: recovered.auditResult,
                    recoveredAt: Date.now()
                  })
                );
                return;
              }
            }
          } catch (error) {
            console.warn('Failed to recover incomplete audit:', error.message);
          }
        }
      }
      
      // Try recovery by connected wallet address (safely)
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
        console.log('🔍 Checking for user audit history...');
        try {
          await recoverUserAudits(window.ethereum.selectedAddress, 1);
        } catch (error) {
          console.warn('User audit history recovery failed:', error.message);
        }
      }
      
      console.log('✅ Auto-recovery check completed');
      
    } catch (error) {
      console.error('❌ Auto-recovery failed:', error);
      setRecoveryError(error.message);
    }
  }, [recoverByTxHash, recoverByRequestId, recoverUserAudits]);

  /**
   * Recover from sessionStorage fallback
   */
  const recoverFromSession = useCallback(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || !window.sessionStorage) {
      console.warn('SessionStorage not available');
      setRecoveryError('Session recovery not available');
      return null;
    }

    console.log('🔄 Attempting recovery from sessionStorage...');
    
    try {
      const lastAuditResult = sessionStorage.getItem('lastAuditResult');
      const lastContractInfo = sessionStorage.getItem('lastContractInfo');
      
      if (lastAuditResult && lastContractInfo) {
        const auditResult = JSON.parse(lastAuditResult);
        const contractInfo = JSON.parse(lastContractInfo);
        
        const recoveredAudit = {
          auditResult: auditResult,
          contractInfo: contractInfo,
          recoveredFromSession: true,
          recoveredAt: new Date().toISOString(),
          incomplete: true // Mark as incomplete since it wasn't properly saved
        };
        
        console.log('✅ Successfully recovered audit from sessionStorage');
        setRecoveredAudit(recoveredAudit);
        setRecoverySource({
          method: 'sessionStorage',
          incomplete: true
        });
        
        return recoveredAudit;
      } else {
        throw new Error('No audit data found in sessionStorage');
      }
    } catch (error) {
      console.warn('❌ Session recovery failed:', error.message);
      setRecoveryError(error.message);
      return null;
    }
  }, []);

  /**
   * Clear recovery state
   */
  const clearRecovery = useCallback(() => {
    setRecoveredAudit(null);
    setRecoverySource(null);
    setRecoveryError(null);
  }, []);

  /**
   * Get recovery statistics
   */
  const getRecoveryStats = useCallback(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        incomplete: 0,
        completed: 0,
        total: 0,
        hasSessionData: false
      };
    }

    const incompleteAudits = [];
    const completedAudits = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('audit_')) {
          try {
            const auditData = JSON.parse(localStorage.getItem(key));
            if (auditData.completed) {
              completedAudits.push(auditData);
            } else {
              incompleteAudits.push(auditData);
            }
          } catch (error) {
            // Ignore invalid entries
          }
        }
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
    
    // Check session storage safely
    let hasSessionData = false;
    try {
      hasSessionData = !!(sessionStorage && sessionStorage.getItem('lastAuditResult') && sessionStorage.getItem('lastContractInfo'));
    } catch (error) {
      // sessionStorage not available
    }
    
    return {
      incomplete: incompleteAudits.length,
      completed: completedAudits.length,
      total: incompleteAudits.length + completedAudits.length,
      hasSessionData
    };
  }, []);

  // Auto-recovery on mount (only in browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      autoRecover();
    }
  }, [autoRecover]);

  return {
    // State
    isRecovering,
    recoveryError,
    recoveredAudit,
    recoverySource,
    
    // Methods
    recoverByTxHash,
    recoverByRequestId,
    recoverUserAudits,
    autoRecover,
    recoverFromSession,
    clearRecovery,
    getRecoveryStats
  };
}