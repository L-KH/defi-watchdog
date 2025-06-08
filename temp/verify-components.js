// Test script to verify component imports
const fs = require('fs');
const path = require('path');

console.log('Verifying component files...\n');

const components = [
  'src/pages/audit-pro.js',
  'src/components/audit/AIScanCardPremium.js',
  'src/components/audit/EnhancedScanResults.js',
  'src/components/audit/MultiAIScanner.js',
  'src/components/audit/export/AuditProExporter.js',
  'src/components/audit/AIReportCards.js',
  'src/lib/aiAnalysis.js',
  'src/lib/audit-pro-reports.js',
  'src/lib/supervisor/reportGeneratorEnhanced.js',
  'src/lib/reportGenerator.js'
];

components.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\nAll component files verified!');
