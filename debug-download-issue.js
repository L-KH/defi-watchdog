// Simple diagnosis script for download issue
// Add this temporarily to your EnhancedScanResults.js to debug

// Add this function at the top of your EnhancedScanResults component
const diagnoseDownloadIssue = (aiResult, analysis) => {
  console.log('🩺 DIAGNOSIS: Download Issue Debug');
  console.log('=================================');
  
  console.log('1. Raw aiResult:', {
    exists: !!aiResult,
    type: typeof aiResult,
    keys: aiResult ? Object.keys(aiResult) : 'none',
    success: aiResult?.success,
    hasAnalysis: !!aiResult?.analysis
  });
  
  console.log('2. Analysis object:', {
    exists: !!analysis,
    type: typeof analysis,
    keys: analysis ? Object.keys(analysis) : 'none',
    hasOverview: !!analysis?.overview,
    hasSummary: !!analysis?.summary,
    hasKeyFindings: !!analysis?.keyFindings,
    hasSecurityScore: !!analysis?.securityScore
  });
  
  console.log('3. Content check:', {
    overviewLength: analysis?.overview?.length || 0,
    summaryLength: analysis?.summary?.length || 0,
    keyFindingsCount: analysis?.keyFindings?.length || 0,
    securityScore: analysis?.securityScore || 'none'
  });
  
  console.log('4. Expected paths for basic scan:');
  console.log('   - aiResult.analysis.overview:', !!aiResult?.analysis?.overview);
  console.log('   - aiResult.analysis.summary:', !!aiResult?.analysis?.summary);
  console.log('   - aiResult.analysis.securityScore:', !!aiResult?.analysis?.securityScore);
  console.log('   - aiResult.success:', aiResult?.success);
  
  // Test the exact condition used in the component
  const testCondition = aiResult && (aiResult.success !== false) && 
    (analysis?.overview || analysis?.summary || analysis?.keyFindings?.length > 0);
  
  console.log('5. hasValidData test result:', testCondition);
  console.log('=================================');
  
  return testCondition;
};

// Add this to the beginning of your handleDownloadReport function:
console.log('🔍 DOWNLOAD DEBUG: Button clicked, checking data...');
diagnoseDownloadIssue(aiResult, analysis);

// If you want to force a download for testing, add this:
const forceDownloadTest = () => {
  console.log('🚀 FORCE DOWNLOAD TEST');
  
  const testData = {
    metadata: { contractName: 'TestContract', generatedAt: new Date().toISOString() },
    executiveSummary: {
      summary: 'Test report generation',
      overallScore: 75,
      securityScore: 75,
      gasEfficiencyScore: 80,
      codeQualityScore: 85,
      overallRisk: 'LOW',
      deploymentRecommendation: 'DEPLOY',
      businessImpact: 'Test contract for download functionality'
    },
    securityFindings: [],
    gasOptimizations: [],
    codeQualityIssues: [],
    auditMetadata: {
      auditorInfo: { lead: 'Test AI', models: ['Test Model'] },
      analysisTime: new Date().toISOString()
    }
  };
  
  try {
    // Test if report generation functions work
    const { generateEnhancedHTMLReport } = require('../../lib/enhanced-report-generator');
    const htmlReport = generateEnhancedHTMLReport(testData);
    
    const blob = new Blob([htmlReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Force download test successful!');
  } catch (error) {
    console.error('❌ Force download test failed:', error);
  }
};

// Instructions for use:
console.log(`
📋 DEBUGGING INSTRUCTIONS:

1. Add the diagnoseDownloadIssue function to your EnhancedScanResults.js component
2. Call it right after the data extraction logic
3. Check the browser console after a scan completes
4. Look for the "DIAGNOSIS" output to see what data is available
5. If you want to test the download functionality directly, 
   add a temporary button that calls forceDownloadTest()

The issue is likely that the data structure from your AI scan 
is different than expected. The diagnosis will show the exact 
structure so we can fix the extraction logic.
`);
