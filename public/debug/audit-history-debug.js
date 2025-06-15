// Debug script to check audit history issue
console.log('🔍 Debugging Audit History Issue...');

// Check 1: Is CONTRACT_ADDRESS configured?
const contractAddress = window.location.hostname === 'localhost' 
  ? 'configured_in_env' 
  : 'check_env_vars';
console.log('1️⃣ CONTRACT_ADDRESS availability:', contractAddress);

// Check 2: What's in localStorage?
console.log('2️⃣ LocalStorage audit entries:');
const auditEntries = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key?.startsWith('audit_')) {
    try {
      const audit = JSON.parse(localStorage.getItem(key));
      auditEntries.push({ key, audit });
      console.log(`  - ${key}:`, {
        user: audit.user?.slice(0, 10) + '...',
        contractName: audit.contractName,
        completed: audit.completed,
        timestamp: new Date(audit.timestamp).toLocaleString()
      });
    } catch (e) {
      console.log(`  - ${key}: Invalid JSON`);
    }
  }
}

if (auditEntries.length === 0) {
  console.log('  - No audit entries found in localStorage');
}

// Check 3: Current wallet address
const currentAddress = window.ethereum?.selectedAddress;
console.log('3️⃣ Current wallet address:', currentAddress?.slice(0, 10) + '...');

// Check 4: Test API call
async function testAPI() {
  if (!currentAddress) {
    console.log('4️⃣ Cannot test API - no wallet connected');
    return;
  }
  
  try {
    console.log('4️⃣ Testing API call...');
    const response = await fetch(`/api/user-audit-history?address=${currentAddress}`);
    const data = await response.json();
    console.log('  - API Response:', data);
  } catch (error) {
    console.log('  - API Error:', error.message);
  }
}

// Check 5: Component state (if available)
function checkComponentState() {
  console.log('5️⃣ Component state check:');
  
  // Check if useEnhancedWeb3 data is available anywhere
  if (window._auditHistoryDebug) {
    console.log('  - Component debug data:', window._auditHistoryDebug);
  } else {
    console.log('  - No component debug data available');
  }
}

// Run all checks
async function runDiagnostics() {
  console.log('🚨 AUDIT HISTORY DIAGNOSTIC STARTED\n');
  
  checkComponentState();
  await testAPI();
  
  console.log('\n📋 SUMMARY:');
  console.log('- LocalStorage entries:', auditEntries.length);
  console.log('- Current address:', currentAddress ? 'Connected' : 'Not connected');
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (auditEntries.length === 0) {
    console.log('- No audit entries found - make sure audit completed and saved');
  }
  if (!currentAddress) {
    console.log('- Connect wallet to see history');
  }
  if (auditEntries.length > 0 && currentAddress) {
    const matchingEntries = auditEntries.filter(entry => 
      entry.audit.user?.toLowerCase() === currentAddress.toLowerCase()
    );
    console.log(`- Found ${matchingEntries.length} matching audit(s) for current address`);
    if (matchingEntries.length === 0) {
      console.log('- Audits exist but for different wallet addresses');
    }
  }
}

// Export for browser console
window.debugAuditHistory = runDiagnostics;
window.testUserHistoryAPI = testAPI;

// Auto-run
runDiagnostics();
