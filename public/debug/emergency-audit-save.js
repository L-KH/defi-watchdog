// Emergency fix to ensure all audits are saved regardless of payment status
// This addresses the core issue where completed audits aren't saved to localStorage

export function ensureAuditIsSaved(auditResults, contractInfo, userAddress, requestId = null, txHash = null) {
  console.log('🆘 Emergency audit save triggered...', {
    hasResults: !!auditResults,
    contractAddress: contractInfo?.address?.slice(0, 10) + '...',
    userAddress: userAddress?.slice(0, 10) + '...',
    requestId,
    txHash: txHash?.slice(0, 10) + '...'
  });
  
  try {
    // Generate a request ID if none provided
    const finalRequestId = requestId || 'emergency_' + Date.now();
    
    // Create comprehensive audit record
    const auditRecord = {
      requestId: finalRequestId,
      contractAddress: contractInfo?.address || 'unknown',
      contractName: contractInfo?.contractName || 'Unknown Contract',
      user: userAddress?.toLowerCase() || 'unknown',
      userAddress: userAddress?.toLowerCase() || 'unknown',
      timestamp: Date.now(),
      completed: true,
      
      // Audit results
      auditResult: auditResults,
      securityScore: auditResults?.analysis?.securityScore || 75,
      riskLevel: auditResults?.analysis?.riskLevel || 'Medium',
      
      // Payment info
      txHash: txHash || null,
      paidAmount: txHash ? '0.003' : '0.000', // Free if no txHash
      paymentConfirmed: !!txHash,
      
      // IPFS placeholders (will be updated if uploaded)
      reportIPFSHash: '',
      reportIPFSUrl: '',
      hasIPFSReport: false,
      
      // Metadata
      network: 'sepolia',
      createdAt: new Date().toISOString(),
      completedAt: Date.now(),
      emergencySave: true,
      savedBy: 'ensureAuditIsSaved'
    };
    
    // Save to localStorage immediately
    localStorage.setItem(`audit_${finalRequestId}`, JSON.stringify(auditRecord));
    console.log('✅ Emergency audit saved to localStorage:', finalRequestId);
    
    // Try to save via API as well (for IPFS upload)
    fetch('/api/save-audit-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: finalRequestId,
        contractAddress: contractInfo?.address || 'unknown',
        contractName: contractInfo?.contractName || 'Unknown Contract', 
        userAddress: userAddress || 'unknown',
        txHash: txHash,
        auditResult: auditResults,
        securityScore: auditResults?.analysis?.securityScore || 75,
        riskLevel: auditResults?.analysis?.riskLevel || 'Medium',
        reportData: auditResults
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        console.log('✅ Emergency audit also saved via API with IPFS:', result.ipfs?.hash?.slice(0, 10) + '...');
        
        // Update localStorage with IPFS data
        if (result.ipfs?.hash) {
          const existingEntry = localStorage.getItem(`audit_${finalRequestId}`);
          if (existingEntry) {
            const parsed = JSON.parse(existingEntry);
            const updated = {
              ...parsed,
              reportIPFSHash: result.ipfs.hash,
              reportIPFSUrl: result.ipfs.url,
              hasIPFSReport: true,
              ipfsUploadSuccess: true
            };
            localStorage.setItem(`audit_${finalRequestId}`, JSON.stringify(updated));
            console.log('✅ Updated localStorage with IPFS data');
          }
        }
      } else {
        console.warn('⚠️ API save failed, but localStorage save successful:', result.error);
      }
    })
    .catch(error => {
      console.warn('⚠️ API save failed, but localStorage save successful:', error.message);
    });
    
    // Trigger history refresh
    window.dispatchEvent(new CustomEvent('auditCompleted', { 
      detail: { 
        requestId: finalRequestId,
        emergencySave: true
      } 
    }));
    
    return {
      success: true,
      requestId: finalRequestId,
      savedToLocalStorage: true,
      apiSaveAttempted: true
    };
    
  } catch (error) {
    console.error('❌ Emergency audit save failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Check for orphaned audit results and save them
export function checkForOrphanedAudits() {
  console.log('🔍 Checking for orphaned audit results...');
  
  // Look for audit results in various places
  const potentialResults = [];
  
  // Check if there are recent results in memory/global variables
  if (window._lastAuditResult) {
    potentialResults.push({
      source: 'window._lastAuditResult',
      data: window._lastAuditResult
    });
  }
  
  // Check sessionStorage for temporary results
  try {
    const sessionAudit = sessionStorage.getItem('lastAuditResult');
    if (sessionAudit) {
      potentialResults.push({
        source: 'sessionStorage',
        data: JSON.parse(sessionAudit)
      });
    }
  } catch (e) {
    // Ignore
  }
  
  console.log(`Found ${potentialResults.length} potential orphaned results`);
  
  // Try to save any found results
  potentialResults.forEach((result, index) => {
    const userAddress = window.ethereum?.selectedAddress;
    if (userAddress && result.data) {
      console.log(`💾 Attempting to save orphaned result ${index + 1}`);
      ensureAuditIsSaved(
        result.data,
        window._lastContractInfo || { address: 'unknown', contractName: 'Recovered Audit' },
        userAddress,
        'recovered_' + Date.now() + '_' + index
      );
    }
  });
}

// Set up global interceptors to catch audit results
export function setupAuditInterceptors() {
  console.log('🔧 Setting up audit result interceptors...');
  
  // Intercept common audit result patterns
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    // Intercept audit API responses
    if (args[0]?.includes('/api/') && args[0]?.includes('audit')) {
      const clonedResponse = response.clone();
      try {
        const data = await clonedResponse.json();
        if (data.analysis || data.success) {
          console.log('💾 Intercepted audit result from API');
          window._lastAuditResult = data;
          sessionStorage.setItem('lastAuditResult', JSON.stringify(data));
        }
      } catch (e) {
        // Ignore non-JSON responses
      }
    }
    
    return response;
  };
  
  // Set up periodic check for orphaned audits
  setInterval(() => {
    const userAddress = window.ethereum?.selectedAddress;
    if (userAddress) {
      checkForOrphanedAudits();
    }
  }, 30000); // Check every 30 seconds
  
  console.log('✅ Audit interceptors active');
}

// Auto-setup when loaded
if (typeof window !== 'undefined') {
  window.ensureAuditIsSaved = ensureAuditIsSaved;
  window.checkForOrphanedAudits = checkForOrphanedAudits;
  window.setupAuditInterceptors = setupAuditInterceptors;
  
  // Auto-setup interceptors
  setTimeout(setupAuditInterceptors, 1000);
  
  console.log('🆘 Emergency audit save system loaded and active');
}

export default ensureAuditIsSaved;
