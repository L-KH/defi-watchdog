// Debug script to test report generation with sample data
// This helps identify the exact data structure needed

const { generateEnhancedHTMLReport, generateEnhancedJSONReport } = require('./src/lib/enhanced-report-generator.js');

// Sample data that mimics a basic AI scan result
const sampleBasicScanResult = {
  success: true,
  type: 'basic',
  model: 'DeepSeek Chat V3 (Free)',
  contractName: 'NFT',
  analysis: {
    overview: 'The contract is generally secure with no critical vulnerabilities identified.',
    securityScore: 85,
    riskLevel: 'Low Risk',
    keyFindings: [],
    gasOptimizations: [],
    summary: 'The contract is generally secure with no critical vulnerabilities identified. It follows standard ERC721 practices and includes additional features like token burning and owner controls. The identified issues are low risk and primarily relate to best practices rather than security vulnerabilities. The contract is suitable for production use with minor improvements recommended.'
  },
  promptMode: 'normal',
  timestamp: new Date().toISOString()
};

// Test data extraction logic
function testDataExtraction(aiResult) {
  console.log('🧪 Testing data extraction logic...\n');
  
  const isComprehensive = aiResult?.comprehensiveReport || aiResult?.type === 'comprehensive' || aiResult?.type === 'full-scan';
  const analysis = aiResult?.analysis || {};
  
  let securityFindings = [];
  let gasOptimizations = [];
  let codeQualityIssues = [];
  let scores = {};
  let executiveSummary = '';
  
  console.log('📊 Initial data check:');
  console.log('- isComprehensive:', isComprehensive);
  console.log('- analysis keys:', Object.keys(analysis));
  console.log('- aiResult.success:', aiResult?.success);
  
  if (isComprehensive && analysis.findings) {
    console.log('🎯 Using comprehensive format');
    securityFindings = analysis.findings.security || [];
    gasOptimizations = analysis.findings.gasOptimization || [];
    codeQualityIssues = analysis.findings.codeQuality || [];
    scores = analysis.scores || {};
    executiveSummary = analysis.executiveSummary?.summary || analysis.summary || analysis.overview || '';
  } else if (analysis.keyFindings || analysis.securityScore || analysis.overview) {
    console.log('🎯 Using standard/premium format');
    securityFindings = analysis.keyFindings || [];
    gasOptimizations = analysis.gasOptimizations || [];
    codeQualityIssues = analysis.codeQualityIssues || [];
    scores = {
      security: analysis.securityScore || 75,
      gasOptimization: analysis.gasOptimizationScore || 80,
      codeQuality: analysis.codeQualityScore || 85,
      overall: analysis.overallScore || analysis.securityScore || 75
    };
    executiveSummary = analysis.summary || analysis.overview || '';
  } else if (aiResult && (aiResult.success !== false)) {
    console.log('🎯 Using fallback extraction');
    securityFindings = aiResult.keyFindings || aiResult.vulnerabilities || [];
    gasOptimizations = aiResult.gasOptimizations || [];
    codeQualityIssues = aiResult.codeQualityIssues || [];
    scores = {
      security: aiResult.securityScore || 75,
      gasOptimization: aiResult.gasOptimizationScore || 80, 
      codeQuality: aiResult.codeQualityScore || 85,
      overall: aiResult.overallScore || aiResult.securityScore || 75
    };
    executiveSummary = aiResult.summary || aiResult.overview || 'Analysis completed';
  }
  
  const hasValidData = aiResult && (aiResult.success !== false) && 
    (executiveSummary || securityFindings.length > 0 || analysis.overview || analysis.summary);
  
  console.log('\\n📋 Extracted data:');
  console.log('- hasValidData:', hasValidData);
  console.log('- executiveSummary length:', executiveSummary?.length || 0);
  console.log('- securityFindings count:', securityFindings.length);
  console.log('- gasOptimizations count:', gasOptimizations.length);
  console.log('- codeQualityIssues count:', codeQualityIssues.length);
  console.log('- scores:', scores);
  
  return {
    hasValidData,
    securityFindings,
    gasOptimizations,
    codeQualityIssues,
    scores,
    executiveSummary
  };
}

// Test report generation
function testReportGeneration() {
  console.log('\\n🚀 Testing report generation...\\n');
  
  try {
    const extractedData = testDataExtraction(sampleBasicScanResult);
    
    if (!extractedData.hasValidData) {
      console.error('❌ Data extraction failed - no valid data found');
      return;
    }
    
    // Prepare audit data
    const auditData = {
      metadata: {
        contractName: 'NFT',
        generatedAt: new Date().toISOString(),
        reportType: 'basic'
      },
      executiveSummary: {
        overallRisk: 'LOW',
        securityScore: extractedData.scores.security || 75,
        gasEfficiencyScore: extractedData.scores.gasOptimization || 80,
        codeQualityScore: extractedData.scores.codeQuality || 85,
        overallScore: extractedData.scores.overall || 75,
        keyRecommendations: [
          'No critical security issues found',
          'Gas usage appears optimized',
          'Code quality meets standards'
        ],
        summary: extractedData.executiveSummary,
        deploymentRecommendation: 'DEPLOY',
        businessImpact: 'Contract appears secure for production deployment with minimal risk.',
        estimatedRemediationTime: '1-2 days'
      },
      contractAnalysis: {
        contractType: 'NFT Contract',
        complexity: 'LOW',
        linesOfCode: 0,
        functionsAnalyzed: 0,
        upgradeability: 'UNKNOWN',
        accessControls: {
          hasOwner: false,
          hasMultisig: false,
          hasTimelock: false,
          decentralizationLevel: 'UNKNOWN'
        }
      },
      securityFindings: [],
      gasOptimizations: [],
      codeQualityIssues: [],
      auditMetadata: {
        auditorInfo: {
          lead: 'AI Multi-Model Analysis',
          models: ['DeepSeek Chat V3'],
          supervisor: 'GPT-4 Turbo'
        },
        analysisTime: new Date().toISOString(),
        methodologies: ['Static Analysis', 'Pattern Matching'],
        toolsUsed: ['Multi-AI Analysis Engine'],
        coverage: {
          functionsAnalyzed: '100%',
          branchCoverage: '95%',
          lineCoverage: '98%'
        }
      }
    };
    
    // Test HTML generation
    console.log('📄 Generating HTML report...');
    const htmlReport = generateEnhancedHTMLReport(auditData);
    console.log('✅ HTML report generated successfully');
    console.log('   Length:', htmlReport.length, 'characters');
    
    // Test JSON generation
    console.log('\\n📋 Generating JSON report...');
    const jsonReport = generateEnhancedJSONReport(auditData);
    console.log('✅ JSON report generated successfully');
    console.log('   Keys:', Object.keys(jsonReport));
    
    console.log('\\n🎉 All tests passed! Report generation is working correctly.');
    
    return { htmlReport, jsonReport };
    
  } catch (error) {
    console.error('❌ Report generation failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests
console.log('🧪 Debug: AI Scan Result Report Generation Test\\n');
console.log('='.repeat(60));

testReportGeneration();

console.log('\\n' + '='.repeat(60));
console.log('✅ Test completed. Check the output above for any issues.');
