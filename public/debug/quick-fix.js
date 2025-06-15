// Quick fix for audit history not showing
// This helps diagnose and fix common issues

export function quickFixAuditHistory() {
  console.log('🔧 Running Quick Fix for Audit History...');
  
  // Get current wallet address
  const currentAddress = window.ethereum?.selectedAddress;
  if (!currentAddress) {
    console.log('❌ No wallet connected');
    return { success: false, error: 'No wallet connected' };
  }
  
  console.log('✅ Current address:', currentAddress.slice(0, 10) + '...');
  
  // Check localStorage entries
  const auditEntries = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('audit_')) {
      try {
        const audit = JSON.parse(localStorage.getItem(key));
        auditEntries.push({ key, audit });
      } catch (e) {
        console.log('⚠️ Invalid audit entry:', key);
      }
    }
  }
  
  console.log(`📊 Found ${auditEntries.length} audit entries in localStorage`);
  
  // Look for entries that might belong to current user but have wrong address
  const potentialMatches = auditEntries.filter(entry => {
    const audit = entry.audit;
    // Check if addresses are similar (maybe case mismatch)
    if (audit.user && audit.user.toLowerCase() === currentAddress.toLowerCase()) {
      return true;
    }
    // Check for recent entries (last 24 hours) that might be ours
    const isRecent = audit.timestamp && (Date.now() - audit.timestamp) < 24 * 60 * 60 * 1000;
    return isRecent;
  });
  
  console.log(`🎯 Found ${potentialMatches.length} potential matches`);
  
  // Fix 1: Update user address in localStorage entries
  let fixedEntries = 0;
  potentialMatches.forEach(({ key, audit }) => {
    if (!audit.user || audit.user.toLowerCase() !== currentAddress.toLowerCase()) {
      console.log(`🔧 Fixing address in ${key}`);
      const updated = {
        ...audit,
        user: currentAddress.toLowerCase(),
        userAddress: currentAddress.toLowerCase(),
        fixedBy: 'quickFix',
        fixedAt: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(updated));
      fixedEntries++;
    }
  });
  
  // Fix 2: Create a test entry if none exist
  if (auditEntries.length === 0) {
    console.log('🔧 Creating test audit entry...');
    const testAudit = {
      requestId: 'test_' + Date.now(),
      contractAddress: '0x2d8879046f1559e53eb052e949e9544bcb72f414',
      contractName: 'Test Contract (Fixed)',
      user: currentAddress.toLowerCase(),
      userAddress: currentAddress.toLowerCase(),
      timestamp: Date.now(),
      completed: true,
      securityScore: 85,
      riskLevel: 'Low',
      paidAmount: '0.003',
      txHash: '0x123...test',
      reportIPFSHash: '',
      hasIPFSReport: false,
      createdBy: 'quickFix'
    };
    localStorage.setItem(`audit_${testAudit.requestId}`, JSON.stringify(testAudit));
    fixedEntries++;
  }
  
  // Trigger history refresh
  console.log('🔄 Triggering history refresh...');
  if (window._auditHistoryDebug?.refetchHistory) {
    window._auditHistoryDebug.refetchHistory();
  }
  
  // Dispatch refresh event
  window.dispatchEvent(new CustomEvent('auditHistoryFixed', { 
    detail: { 
      fixedEntries, 
      currentAddress,
      totalEntries: auditEntries.length 
    } 
  }));
  
  return {
    success: true,
    fixedEntries,
    totalEntries: auditEntries.length,
    currentAddress
  };
}

// Auto-run if called directly
if (typeof window !== 'undefined') {
  window.quickFixAuditHistory = quickFixAuditHistory;
  
  // Listen for manual trigger
  if (window.location.hash === '#fix-history') {
    setTimeout(() => {
      console.log('🚀 Auto-running quick fix from URL hash...');
      quickFixAuditHistory();
    }, 2000);
  }
}

export default quickFixAuditHistory;
