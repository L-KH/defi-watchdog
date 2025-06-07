// Premium Comprehensive Audit System for DeFi Watchdog
// Integrates Supervisor Analysis with Professional Report Generation

/**
 * 🚀 PREMIUM COMPREHENSIVE AUDIT SYSTEM
 * 
 * This system combines:
 * 1. Multi-AI Supervised Analysis (6+ Models)
 * 2. Advanced Pattern Matching
 * 3. Gas & Code Quality Analysis
 * 4. Professional Report Generation
 * 5. Risk Assessment & Business Impact
 * 6. Executive & Technical Reports
 * 7. Export in Multiple Formats
 */

import { runSupervisedPremiumAnalysis } from './supervisorAnalysis.js';
import { generateProfessionalReports } from './reportGenerator.js';

/**
 * 🎯 MAIN COMPREHENSIVE AUDIT ENTRY POINT
 */
export async function runComprehensiveAudit(sourceCode, contractName, options = {}) {
  console.log('🚀 Starting Comprehensive Premium Audit...');
  
  const {
    tier = 'premium',
    promptMode = 'normal',
    customPrompt = null,
    reportFormats = ['html', 'json', 'executive'],
    includeRiskMatrix = true,
    includeStatistics = true
  } = options;
  
  const auditStartTime = Date.now();
  
  try {
    // Phase 1: Run Supervised Premium Analysis
    console.log('📊 Phase 1: Running supervised multi-AI analysis...');
    const analysisResult = await runSupervisedPremiumAnalysis(sourceCode, contractName, {
      tier,
      promptMode,
      customPrompt
    });
    
    if (!analysisResult.success) {
      throw new Error(`Analysis failed: ${analysisResult.error || 'Unknown error'}`);
    }
    
    // Phase 2: Generate Professional Reports
    console.log('📋 Phase 2: Generating professional reports...');
    const reportResult = generateProfessionalReports(analysisResult.report, {
      formats: reportFormats,
      includeRiskMatrix,
      includeStatistics
    });
    
    if (!reportResult.success) {
      throw new Error(`Report generation failed: ${reportResult.error || 'Unknown error'}`);
    }
    
    // Phase 3: Create Final Comprehensive Result
    const comprehensiveResult = {
      success: true,
      auditType: 'comprehensive-premium',
      auditId: analysisResult.analysisId,
      contractName: contractName,
      
      // Executive Summary for Quick Access
      executiveSummary: analysisResult.report.executiveSummary,
      
      // Detailed Scores
      scores: analysisResult.report.scores,
      
      // All Findings Categorized
      findings: {
        security: analysisResult.report.findings.security,
        gasOptimization: analysisResult.report.findings.gasOptimization,
        codeQuality: analysisResult.report.findings.codeQuality,
        patterns: analysisResult.report.findings.patterns
      },
      
      // AI Analysis Details
      aiModelsUsed: analysisResult.report.analysisMetadata.aiModelsUsed,
      supervisorVerification: analysisResult.report.analysisMetadata.supervisorVerification,
      
      // Professional Reports
      reports: reportResult.reports,
      
      // Risk Assessment
      riskAssessment: reportResult.reports.riskMatrix,
      
      // Performance Statistics
      statistics: reportResult.reports.statistics,
      
      // Actionable Recommendations
      recommendations: analysisResult.report.recommendations,
      
      // Audit Metadata
      auditMetadata: {
        totalTime: Date.now() - auditStartTime,
        analysisTime: analysisResult.analysisTime,
        reportGenerationTime: Date.now() - auditStartTime - analysisResult.analysisTime,
        tier: tier,
        promptMode: promptMode,
        reportsGenerated: Object.keys(reportResult.reports).length,
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    };
    
    console.log(`✅ Comprehensive audit completed in ${Math.round(comprehensiveResult.auditMetadata.totalTime / 1000)}s`);
    console.log(`📊 Generated ${comprehensiveResult.auditMetadata.reportsGenerated} professional reports`);
    console.log(`🤖 Used ${comprehensiveResult.aiModelsUsed.length} AI models with ${comprehensiveResult.supervisorVerification} verification`);
    
    return comprehensiveResult;
    
  } catch (error) {
    console.error('❌ Comprehensive audit failed:', error);
    
    return {
      success: false,
      error: error.message,
      auditType: 'comprehensive-premium',
      contractName: contractName,
      auditMetadata: {
        totalTime: Date.now() - auditStartTime,
        failed: true,
        failureReason: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * 📊 GENERATE AUDIT SUMMARY
 */
export function generateAuditSummary(comprehensiveResult) {
  if (!comprehensiveResult.success) {
    return {
      status: 'FAILED',
      message: `Audit failed: ${comprehensiveResult.error}`,
      contractName: comprehensiveResult.contractName
    };
  }
  
  const { executiveSummary, scores, findings, auditMetadata } = comprehensiveResult;
  
  // Count findings by severity
  const securityFindings = Object.values(findings.security).flat();
  const criticalCount = securityFindings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = securityFindings.filter(f => f.severity === 'HIGH').length;
  const totalFindings = securityFindings.length;
  
  // Determine audit status
  let auditStatus = 'PASSED';
  if (criticalCount > 0) auditStatus = 'CRITICAL_ISSUES';
  else if (highCount > 2) auditStatus = 'HIGH_RISK';
  else if (scores.security < 70) auditStatus = 'MEDIUM_RISK';
  
  return {
    // Audit Status
    status: auditStatus,
    contractName: comprehensiveResult.contractName,
    auditId: comprehensiveResult.auditId,
    
    // Key Metrics
    overallScore: scores.overall,
    securityScore: scores.security,
    riskLevel: executiveSummary.riskLevel,
    
    // Findings Summary
    totalFindings: totalFindings,
    criticalFindings: criticalCount,
    highFindings: highCount,
    gasOptimizations: findings.gasOptimization.length,
    qualityIssues: findings.codeQuality.length,
    
    // AI Analysis Summary
    aiModelsUsed: comprehensiveResult.aiModelsUsed.length,
    supervisorVerified: comprehensiveResult.supervisorVerification === 'SUPERVISOR_VERIFIED',
    consensusReached: comprehensiveResult.aiModelsUsed.length >= 3,
    
    // Performance Summary
    analysisTime: `${Math.round(auditMetadata.totalTime / 1000)}s`,
    reportsGenerated: auditMetadata.reportsGenerated,
    
    // Key Recommendations (Top 3)
    topRecommendations: comprehensiveResult.recommendations.slice(0, 3).map(rec => ({
      priority: rec.priority,
      title: rec.title,
      estimatedTime: rec.estimatedTime
    })),
    
    // Quick Actions Required
    immediateActions: criticalCount > 0 ? [
      'Address critical security vulnerabilities immediately',
      'Conduct additional security review',
      'Consider delaying deployment until issues resolved'
    ] : highCount > 0 ? [
      'Review and fix high-severity issues',
      'Implement security recommendations',
      'Test fixes thoroughly before deployment'
    ] : [
      'Review medium/low priority improvements',
      'Consider gas optimizations',
      'Maintain current security practices'
    ],
    
    // Report Availability
    reportsAvailable: {
      executive: 'executive' in comprehensiveResult.reports,
      technical: 'html' in comprehensiveResult.reports,
      json: 'json' in comprehensiveResult.reports,
      riskMatrix: 'riskMatrix' in comprehensiveResult.reports
    }
  };
}

/**
 * 📁 EXPORT AUDIT PACKAGE
 */
export function exportAuditPackage(comprehensiveResult, format = 'zip') {
  console.log(`📦 Exporting audit package in ${format} format...`);
  
  if (!comprehensiveResult.success) {
    throw new Error('Cannot export failed audit');
  }
  
  const { reports, contractName, auditId } = comprehensiveResult;
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const exportData = {
    metadata: {
      contractName: contractName,
      auditId: auditId,
      exportDate: new Date().toISOString(),
      auditType: 'comprehensive-premium',
      version: '2.0'
    },
    
    files: []
  };
  
  // Add Executive Report
  if (reports.executive) {
    exportData.files.push({
      filename: `${contractName}_Executive_Report_${timestamp}.html`,
      content: reports.executive.content,
      type: 'text/html',
      description: 'Executive summary report for C-level stakeholders'
    });
  }
  
  // Add Technical Report
  if (reports.html) {
    exportData.files.push({
      filename: `${contractName}_Technical_Report_${timestamp}.html`,
      content: reports.html.content,
      type: 'text/html',
      description: 'Detailed technical security analysis'
    });
  }
  
  // Add JSON Report
  if (reports.json) {
    exportData.files.push({
      filename: `${contractName}_Analysis_Data_${timestamp}.json`,
      content: reports.json.content,
      type: 'application/json',
      description: 'Machine-readable analysis data'
    });
  }
  
  // Add Risk Matrix
  if (reports.riskMatrix) {
    exportData.files.push({
      filename: `${contractName}_Risk_Matrix_${timestamp}.json`,
      content: JSON.stringify(reports.riskMatrix, null, 2),
      type: 'application/json',
      description: 'Security risk assessment matrix'
    });
  }
  
  // Add Statistics
  if (reports.statistics) {
    exportData.files.push({
      filename: `${contractName}_Statistics_${timestamp}.json`,
      content: JSON.stringify(reports.statistics, null, 2),
      type: 'application/json',
      description: 'Audit performance statistics'
    });
  }
  
  // Add Summary
  const summary = generateAuditSummary(comprehensiveResult);
  exportData.files.push({
    filename: `${contractName}_Audit_Summary_${timestamp}.json`,
    content: JSON.stringify(summary, null, 2),
    type: 'application/json',
    description: 'High-level audit summary'
  });
  
  console.log(`✅ Export package prepared with ${exportData.files.length} files`);
  
  return exportData;
}

/**
 * 📊 COMPARE AUDIT RESULTS
 */
export function compareAuditResults(previousResult, currentResult) {
  console.log('📊 Comparing audit results...');
  
  if (!previousResult.success || !currentResult.success) {
    return {
      error: 'Cannot compare failed audits',
      comparison: null
    };
  }
  
  const prevFindings = Object.values(previousResult.findings.security).flat();
  const currFindings = Object.values(currentResult.findings.security).flat();
  
  // Score comparison
  const scoreImprovement = {
    overall: currentResult.scores.overall - previousResult.scores.overall,
    security: currentResult.scores.security - previousResult.scores.security,
    gasOptimization: currentResult.scores.gasOptimization - previousResult.scores.gasOptimization,
    codeQuality: currentResult.scores.codeQuality - previousResult.scores.codeQuality
  };
  
  // Findings comparison
  const findingComparison = {
    previousTotal: prevFindings.length,
    currentTotal: currFindings.length,
    difference: currFindings.length - prevFindings.length,
    
    critical: {
      previous: prevFindings.filter(f => f.severity === 'CRITICAL').length,
      current: currFindings.filter(f => f.severity === 'CRITICAL').length
    },
    
    high: {
      previous: prevFindings.filter(f => f.severity === 'HIGH').length,
      current: currFindings.filter(f => f.severity === 'HIGH').length
    }
  };
  
  // Overall trend
  const overallTrend = scoreImprovement.overall > 5 ? 'IMPROVED' :
                     scoreImprovement.overall < -5 ? 'DEGRADED' : 'STABLE';
  
  return {
    success: true,
    comparison: {
      contractName: currentResult.contractName,
      comparisonDate: new Date().toISOString(),
      
      scoreImprovement: scoreImprovement,
      findingComparison: findingComparison,
      overallTrend: overallTrend,
      
      keyChanges: [
        scoreImprovement.security !== 0 ? 
          `Security score ${scoreImprovement.security > 0 ? 'improved' : 'decreased'} by ${Math.abs(scoreImprovement.security)} points` : null,
        
        findingComparison.critical.current !== findingComparison.critical.previous ?
          `Critical findings ${findingComparison.critical.current > findingComparison.critical.previous ? 'increased' : 'decreased'} from ${findingComparison.critical.previous} to ${findingComparison.critical.current}` : null,
        
        findingComparison.difference !== 0 ?
          `Total findings ${findingComparison.difference > 0 ? 'increased' : 'decreased'} by ${Math.abs(findingComparison.difference)}` : null
      ].filter(Boolean),
      
      recommendations: generateComparisonRecommendations(overallTrend, scoreImprovement, findingComparison)
    }
  };
}

/**
 * 💡 GENERATE COMPARISON RECOMMENDATIONS
 */
function generateComparisonRecommendations(trend, scoreImprovement, findingComparison) {
  const recommendations = [];
  
  if (trend === 'DEGRADED') {
    recommendations.push({
      priority: 'HIGH',
      action: 'Investigate security regression',
      description: 'The overall security posture has declined since the last audit'
    });
  }
  
  if (findingComparison.critical.current > findingComparison.critical.previous) {
    recommendations.push({
      priority: 'CRITICAL',
      action: 'Address new critical vulnerabilities',
      description: `${findingComparison.critical.current - findingComparison.critical.previous} new critical issues detected`
    });
  }
  
  if (scoreImprovement.security > 10) {
    recommendations.push({
      priority: 'LOW',
      action: 'Maintain security improvements',
      description: 'Security score has significantly improved - continue current practices'
    });
  }
  
  if (scoreImprovement.gasOptimization < -10) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Review gas optimization regression',
      description: 'Gas optimization score has declined - review recent changes'
    });
  }
  
  return recommendations;
}

/**
 * 🔄 BATCH AUDIT MULTIPLE CONTRACTS
 */
export async function runBatchAudit(contracts, options = {}) {
  console.log(`🔄 Starting batch audit for ${contracts.length} contracts...`);
  
  const batchStartTime = Date.now();
  const results = [];
  
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    console.log(`📊 [${i + 1}/${contracts.length}] Auditing ${contract.name}...`);
    
    try {
      const auditResult = await runComprehensiveAudit(
        contract.sourceCode,
        contract.name,
        {
          ...options,
          reportFormats: ['json', 'executive'] // Lighter reports for batch
        }
      );
      
      results.push({
        contractName: contract.name,
        address: contract.address || null,
        network: contract.network || null,
        auditResult: auditResult,
        batchIndex: i + 1,
        processingTime: auditResult.auditMetadata?.totalTime || 0
      });
      
      console.log(`✅ [${i + 1}/${contracts.length}] ${contract.name} completed`);
      
    } catch (error) {
      console.error(`❌ [${i + 1}/${contracts.length}] ${contract.name} failed:`, error);
      
      results.push({
        contractName: contract.name,
        address: contract.address || null,
        network: contract.network || null,
        auditResult: {
          success: false,
          error: error.message,
          contractName: contract.name
        },
        batchIndex: i + 1,
        processingTime: 0
      });
    }
    
    // Brief pause between audits to prevent API rate limiting
    if (i < contracts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const batchSummary = generateBatchSummary(results, batchStartTime);
  
  console.log(`✅ Batch audit completed: ${batchSummary.successCount}/${contracts.length} successful`);
  
  return {
    success: true,
    batchId: `batch-${Date.now()}`,
    totalContracts: contracts.length,
    results: results,
    summary: batchSummary,
    completedAt: new Date().toISOString()
  };
}

/**
 * 📊 GENERATE BATCH SUMMARY
 */
function generateBatchSummary(results, startTime) {
  const totalTime = Date.now() - startTime;
  const successfulAudits = results.filter(r => r.auditResult.success);
  const failedAudits = results.filter(r => !r.auditResult.success);
  
  // Aggregate statistics from successful audits
  const aggregateStats = {
    totalCriticalFindings: 0,
    totalHighFindings: 0,
    averageSecurityScore: 0,
    contractsWithCriticalIssues: 0,
    contractsWithHighRisk: 0
  };
  
  if (successfulAudits.length > 0) {
    successfulAudits.forEach(audit => {
      const result = audit.auditResult;
      if (result.findings && result.findings.security) {
        const securityFindings = Object.values(result.findings.security).flat();
        const criticalCount = securityFindings.filter(f => f.severity === 'CRITICAL').length;
        const highCount = securityFindings.filter(f => f.severity === 'HIGH').length;
        
        aggregateStats.totalCriticalFindings += criticalCount;
        aggregateStats.totalHighFindings += highCount;
        
        if (criticalCount > 0) aggregateStats.contractsWithCriticalIssues++;
        if (result.executiveSummary?.riskLevel === 'High Risk' || result.executiveSummary?.riskLevel === 'Critical Risk') {
          aggregateStats.contractsWithHighRisk++;
        }
      }
      
      if (result.scores?.security) {
        aggregateStats.averageSecurityScore += result.scores.security;
      }
    });
    
    aggregateStats.averageSecurityScore = Math.round(
      aggregateStats.averageSecurityScore / successfulAudits.length
    );
  }
  
  return {
    // Batch Overview
    totalContracts: results.length,
    successCount: successfulAudits.length,
    failureCount: failedAudits.length,
    successRate: Math.round((successfulAudits.length / results.length) * 100),
    
    // Timing
    totalTime: totalTime,
    averageTimePerContract: Math.round(totalTime / results.length),
    
    // Security Overview
    aggregateStats: aggregateStats,
    
    // Risk Distribution
    riskDistribution: calculateBatchRiskDistribution(successfulAudits),
    
    // Failed Audits
    failedContracts: failedAudits.map(audit => ({
      name: audit.contractName,
      error: audit.auditResult.error
    })),
    
    // Top Issues
    topIssues: identifyTopIssuesAcrossBatch(successfulAudits)
  };
}

/**
 * 📊 CALCULATE BATCH RISK DISTRIBUTION
 */
function calculateBatchRiskDistribution(successfulAudits) {
  const distribution = {
    'Safe': 0,
    'Low Risk': 0,
    'Medium Risk': 0,
    'High Risk': 0,
    'Critical Risk': 0
  };
  
  successfulAudits.forEach(audit => {
    const riskLevel = audit.auditResult.executiveSummary?.riskLevel || 'Unknown';
    if (distribution[riskLevel] !== undefined) {
      distribution[riskLevel]++;
    }
  });
  
  return distribution;
}

/**
 * 🔍 IDENTIFY TOP ISSUES ACROSS BATCH
 */
function identifyTopIssuesAcrossBatch(successfulAudits) {
  const issueFrequency = {};
  
  successfulAudits.forEach(audit => {
    const result = audit.auditResult;
    if (result.findings && result.findings.security) {
      Object.values(result.findings.security).flat().forEach(finding => {
        const issueKey = finding.title.toLowerCase();
        if (!issueFrequency[issueKey]) {
          issueFrequency[issueKey] = {
            title: finding.title,
            severity: finding.severity,
            count: 0,
            contracts: []
          };
        }
        issueFrequency[issueKey].count++;
        issueFrequency[issueKey].contracts.push(audit.contractName);
      });
    }
  });
  
  // Sort by frequency and return top 10
  return Object.values(issueFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(issue => ({
      title: issue.title,
      severity: issue.severity,
      frequency: issue.count,
      affectedContracts: issue.contracts.length,
      contractNames: issue.contracts.slice(0, 3) // Show first 3 contracts
    }));
}

/**
 * 🎯 PREMIUM AUDIT API INTEGRATION
 */
export async function createPremiumAuditAPI() {
  return {
    // Single contract comprehensive audit
    auditContract: async (sourceCode, contractName, options = {}) => {
      return await runComprehensiveAudit(sourceCode, contractName, {
        tier: 'premium',
        reportFormats: ['html', 'json', 'executive'],
        ...options
      });
    },
    
    // Batch audit multiple contracts
    auditBatch: async (contracts, options = {}) => {
      return await runBatchAudit(contracts, {
        tier: 'premium',
        ...options
      });
    },
    
    // Compare two audit results
    compareAudits: (previousResult, currentResult) => {
      return compareAuditResults(previousResult, currentResult);
    },
    
    // Generate audit summary
    generateSummary: (comprehensiveResult) => {
      return generateAuditSummary(comprehensiveResult);
    },
    
    // Export audit package
    exportPackage: (comprehensiveResult, format = 'zip') => {
      return exportAuditPackage(comprehensiveResult, format);
    },
    
    // Generate professional reports only
    generateReports: (analysisResult, options = {}) => {
      return generateProfessionalReports(analysisResult, options);
    }
  };
}

/**
 * 📋 AUDIT CONFIGURATION PRESETS
 */
export const AUDIT_PRESETS = {
  // Quick audit for development
  development: {
    tier: 'premium',
    promptMode: 'normal',
    reportFormats: ['json'],
    includeRiskMatrix: false,
    includeStatistics: false
  },
  
  // Standard audit for testing
  testing: {
    tier: 'premium',
    promptMode: 'focused',
    reportFormats: ['html', 'json'],
    includeRiskMatrix: true,
    includeStatistics: true
  },
  
  // Production audit for deployment
  production: {
    tier: 'premium',
    promptMode: 'aggressive',
    reportFormats: ['html', 'json', 'executive'],
    includeRiskMatrix: true,
    includeStatistics: true
  },
  
  // Executive audit for stakeholders
  executive: {
    tier: 'premium',
    promptMode: 'normal',
    reportFormats: ['executive'],
    includeRiskMatrix: true,
    includeStatistics: false
  },
  
  // Comprehensive audit (all features)
  comprehensive: {
    tier: 'premium',
    promptMode: 'aggressive',
    reportFormats: ['html', 'json', 'executive'],
    includeRiskMatrix: true,
    includeStatistics: true
  }
};

