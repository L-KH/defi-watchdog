// Test component exports
import React from 'react';

// Test if components are properly exported
try {
  const AIScanCardPremium = require('../src/components/audit/AIScanCardPremium');
  console.log('AIScanCardPremium type:', typeof AIScanCardPremium);
  console.log('AIScanCardPremium.default type:', typeof AIScanCardPremium.default);
  
  const EnhancedScanResults = require('../src/components/audit/EnhancedScanResults');
  console.log('EnhancedScanResults type:', typeof EnhancedScanResults);
  console.log('EnhancedScanResults.default type:', typeof EnhancedScanResults.default);
  
  console.log('\n✅ Component imports successful!');
} catch (error) {
  console.error('❌ Error importing components:', error);
}
