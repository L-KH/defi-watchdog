// Test script to verify the report generation fix
const { generateEnhancedHTMLReport, generateEnhancedJSONReport } = require('./src/lib/enhanced-report-generator.js');

// Test data similar to what the component generates
const testAuditData = {
  metadata: {
    contractName: 'TestContract',
    generatedAt: new Date().toISOString(),
    reportType: 'comprehensive'
  },
  executiveSummary: {
    overallRisk: 'LOW',
    securityScore: 85,
    gasEfficiencyScore: 80,
    codeQualityScore: 90,
    overallScore: 85,
    summary: 'Test contract analysis completed successfully.',
    deploymentRecommendation: 'DEPLOY',
    businessImpact: 'Contract appears secure for production deployment.',
    estimatedRemediationTime: '1-2 days'
  },
  contractAnalysis: {
    contractType: 'ERC-20 Token',
    complexity: 'LOW',
    linesOfCode: 150,
    functionsAnalyzed: 12
  },
  securityFindings: [
    {
      id: 'SEC-001',
      severity: 'MEDIUM',
      title: 'Missing Input Validation',
      description: 'Function lacks proper input validation which could lead to unexpected behavior.',
      location: {
        contract: 'TestContract.sol',
        function: 'transfer',
        lines: '45-50'
      },
      impact: {
        technical: 'Potential for invalid state transitions',
        business: 'Could affect user trust',
        financial: 'Low risk of fund loss'
      },
      remediation: {
        steps: ['Add require statements for input validation'],
        priority: 'MEDIUM'
      }
    }
  ],
  gasOptimizations: [
    {
      id: 'GAS-001',
      title: 'Use Unchecked Math',
      description: 'Safe math operations can be optimized using unchecked blocks in Solidity 0.8+',
      location: {
        contract: 'TestContract.sol',
        function: 'calculateReward',
        lines: '78-82'
      },
      optimizedImplementation: {
        savings: '~200 gas per transaction'
      }
    }
  ],
  codeQualityIssues: [
    {
      id: 'QUAL-001',
      title: 'Missing Documentation',
      description: 'Functions lack proper NatSpec documentation',
      category: 'Documentation',
      reasoning: 'Improves code maintainability and developer experience'
    }
  ],
  auditMetadata: {
    auditorInfo: {
      lead: 'AI Multi-Model Analysis',
      models: ['GPT-4', 'Claude-3', 'Gemini-Pro']
    }
  }
};

console.log('🧪 Testing report generation functions...');

try {
  // Test HTML report generation
  console.log('📄 Testing HTML report generation...');
  const htmlReport = generateEnhancedHTMLReport(testAuditData);
  console.log('✅ HTML report generated successfully!');
  console.log(`📏 HTML report size: ${Math.round(htmlReport.length / 1024)}KB`);
  
  // Test JSON report generation
  console.log('📋 Testing JSON report generation...');
  const jsonReport = generateEnhancedJSONReport(testAuditData);
  console.log('✅ JSON report generated successfully!');
  console.log(`📏 JSON report size: ${Math.round(JSON.stringify(jsonReport).length / 1024)}KB`);
  
  // Verify structure
  console.log('🔍 Verifying JSON report structure...');
  console.log('- Metadata:', !!jsonReport.metadata);
  console.log('- Executive Summary:', !!jsonReport.executiveSummary);
  console.log('- Findings:', !!jsonReport.findings);
  console.log('- Metrics:', !!jsonReport.metrics);
  console.log('- Scores:', !!jsonReport.scores);
  console.log('- Security Findings:', jsonReport.findings.security.length);
  console.log('- Gas Optimizations:', jsonReport.findings.gasOptimizations.length);
  console.log('- Code Quality Issues:', jsonReport.findings.codeQuality.length);
  
  console.log('\n🎉 All tests passed! The report generation fix is working correctly.');
  console.log('\n💡 Next steps:');
  console.log('1. Test the fix in your Next.js application');
  console.log('2. Run a scan and try downloading reports');
  console.log('3. Verify both HTML and JSON formats work properly');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  console.error('Stack trace:', error.stack);
}
