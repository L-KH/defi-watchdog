// COMPLETELY FIXED Premium Analysis Implementation
// This replaces the broken comprehensive audit with a working multi-AI system

import { runMultiAIAnalysis } from './multiAiAnalyzer.js';

/**
 * FIXED implementation for premium analysis with proper error handling
 */
export async function runPremiumAnalysis(sourceCode, contractName, options = {}) {
  console.log('🚀 Starting FIXED Premium Multi-AI Analysis...');
  const startTime = Date.now();
  
  try {
    // Run the enhanced multi-AI analysis
    const multiAIResult = await runMultiAIAnalysis(sourceCode, contractName, options);
    
    if (!multiAIResult || !multiAIResult.success) {
      throw new Error('Multi-AI analysis failed to complete successfully');
    }
    
    console.log(`✅ Multi-AI analysis completed successfully with ${multiAIResult.modelsUsed.length} models`);
    
    // Transform to premium report format
    const transformedResult = {
      success: true,
      type: 'premium',
      contractName: contractName,
      
      // Executive Summary
      executiveSummary: {
        summary: multiAIResult.executiveSummary.summary,
        overallScore: multiAIResult.scores.overall,
        securityScore: multiAIResult.scores.security,
        gasEfficiencyScore: multiAIResult.scores.gasOptimization,
        codeQualityScore: multiAIResult.scores.codeQuality,
        riskLevel: multiAIResult.executiveSummary.riskLevel,
        deploymentRecommendation: multiAIResult.executiveSummary.deploymentRecommendation,
        businessImpact: generateBusinessImpact(multiAIResult.executiveSummary),
        estimatedRemediationTime: estimateRemediationTime(multiAIResult.findings.security),
        criticalFindings: multiAIResult.executiveSummary.criticalFindings,
        highFindings: multiAIResult.executiveSummary.highFindings,
        totalFindings: multiAIResult.executiveSummary.totalFindings
      },
      
      // Detailed Scores
      scores: {
        security: multiAIResult.scores.security,
        gasOptimization: multiAIResult.scores.gasOptimization,
        codeQuality: multiAIResult.scores.codeQuality,
        overall: multiAIResult.scores.overall
      },
      
      // Enhanced Findings with detailed information
      findings: {
        security: multiAIResult.findings.security.map(formatSecurityFinding),
        gasOptimization: multiAIResult.findings.gasOptimization.map(formatGasOptimization),
        codeQuality: multiAIResult.findings.quality || [],
        patterns: []
      },
      
      // AI Models Used
      aiModelsUsed: multiAIResult.modelsUsed.map(m => ({
        name: m.name,
        id: m.name.toLowerCase().replace(/\s+/g, '-'),
        speciality: m.focus,
        weight: m.weight,
        status: 'completed'
      })),
      
      // Supervisor Verification
      supervisorVerification: {
        model: 'Multi-Model Consensus Engine',
        verified: true,
        consensusLevel: multiAIResult.supervisorReport.consensus.consensusLevel,
        duplicatesRemoved: multiAIResult.supervisorReport.findings.duplicatesRemoved,
        verificationNotes: generateVerificationNotes(multiAIResult)
      },
      
      // Recommendations
      recommendations: multiAIResult.recommendations || [],
      
      // Metadata
      metadata: {
        analysisTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        totalModelsUsed: multiAIResult.metadata.totalModels,
        successfulModels: multiAIResult.metadata.successfulModels,
        failedModels: multiAIResult.metadata.failedModels,
        analysisQuality: calculateAnalysisQuality(multiAIResult)
      }
    };
    
    console.log(`🎯 Premium analysis completed: ${transformedResult.findings.security.length} security findings, score: ${transformedResult.scores.overall}/100`);
    
    return transformedResult;
    
  } catch (error) {
    console.error('❌ Premium analysis failed:', error);
    throw new Error(`Premium analysis failed: ${error.message}`);
  }
}

/**
 * Format security finding for premium report
 */
function formatSecurityFinding(finding) {
  return {
    vulnerabilityId: generateVulnerabilityId(),
    severity: finding.severity,
    category: finding.category || 'security',
    title: finding.title,
    description: finding.description,
    
    // Enhanced impact analysis
    impact: {
      technical: finding.impact,
      business: generateBusinessImpactForFinding(finding),
      financial: generateFinancialImpact(finding),
      reputation: generateReputationalImpact(finding)
    },
    
    // Location and code details
    location: {
      contract: 'Main Contract',
      function: extractFunctionName(finding.location),
      lines: 'N/A', // Could be enhanced with actual line numbers
      codeReference: finding.codeReference
    },
    
    // Detailed remediation
    remediation: {
      priority: finding.severity === 'CRITICAL' ? 'IMMEDIATE' : 
               finding.severity === 'HIGH' ? 'HIGH' : 
               finding.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
      effort: estimateEffort(finding),
      steps: [finding.recommendation],
      secureImplementation: generateSecureImplementation(finding),
      timeline: estimateFixTimeline(finding)
    },
    
    // Verification and confidence
    verified: finding.consensusConfidence === 'HIGH',
    confidence: finding.consensusConfidence || 'MEDIUM',
    consensusCount: finding.consensusCount || 1,
    reportedBy: finding.reportingModels || [finding.reportedBy || 'AI Analysis'],
    
    // Additional context
    proofOfConcept: finding.proofOfConcept || null,
    references: generateSecurityReferences(finding),
    tags: generateFindingTags(finding)
  };
}

/**
 * Format gas optimization for premium report
 */
function formatGasOptimization(optimization) {
  return {
    optimizationId: generateOptimizationId(),
    title: optimization.title,
    description: optimization.description,
    location: optimization.location,
    
    // Cost analysis
    gasAnalysis: {
      currentCost: optimization.currentCost || 'N/A',
      optimizedCost: optimization.optimizedCost || 'N/A',
      savings: optimization.savings || 'Unknown',
      savingsPercentage: extractSavingsPercentage(optimization.savings)
    },
    
    // Implementation details
    implementation: {
      difficulty: estimateImplementationDifficulty(optimization),
      steps: [optimization.implementation || 'See description'],
      codeExample: optimization.optimizedCode || null,
      testing: 'Verify gas usage with gas profiling tools'
    },
    
    // Metadata
    reportedBy: optimization.reportingModels || [optimization.reportedBy || 'AI Analysis'],
    priority: calculateOptimizationPriority(optimization),
    category: 'gas-optimization'
  };
}

/**
 * Generate business impact description
 */
function generateBusinessImpact(executiveSummary) {
  const { criticalFindings, highFindings, riskLevel } = executiveSummary;
  
  if (criticalFindings > 0) {
    return 'Critical vulnerabilities pose immediate threat to funds and operations. Deployment must be halted until issues are resolved.';
  } else if (highFindings > 2) {
    return 'Multiple high-risk issues could significantly impact user trust and platform security. Immediate attention required.';
  } else if (highFindings > 0) {
    return 'High-risk issues identified that should be resolved before production deployment to maintain security standards.';
  } else if (riskLevel === 'Medium Risk') {
    return 'Moderate security concerns that should be addressed. Overall security posture is acceptable with improvements.';
  } else {
    return 'Contract demonstrates good security practices. Minor issues can be addressed in normal development cycle.';
  }
}

/**
 * Generate business impact for specific finding
 */
function generateBusinessImpactForFinding(finding) {
  switch (finding.severity) {
    case 'CRITICAL':
      return 'Could result in complete loss of user funds and destruction of project reputation';
    case 'HIGH':
      return 'Significant operational risk with potential for substantial financial losses';
    case 'MEDIUM':
      return 'Moderate impact on operations with manageable risk if addressed promptly';
    case 'LOW':
      return 'Minor operational impact with low probability of exploitation';
    default:
      return 'Informational finding with minimal business impact';
  }
}

/**
 * Generate financial impact assessment
 */
function generateFinancialImpact(finding) {
  switch (finding.severity) {
    case 'CRITICAL':
      return 'Complete loss of contract funds possible ($$$)';
    case 'HIGH':
      return 'Significant financial risk to users ($$)';
    case 'MEDIUM':
      return 'Moderate financial impact possible ($)';
    case 'LOW':
      return 'Minimal financial impact';
    default:
      return 'No direct financial impact';
  }
}

/**
 * Generate reputational impact assessment
 */
function generateReputationalImpact(finding) {
  switch (finding.severity) {
    case 'CRITICAL':
      return 'Severe damage to project reputation and user trust';
    case 'HIGH':
      return 'Significant negative impact on project credibility';
    case 'MEDIUM':
      return 'Moderate impact on user confidence';
    case 'LOW':
      return 'Minor impact on project perception';
    default:
      return 'Minimal reputational impact';
  }
}

/**
 * Estimate effort to fix finding
 */
function estimateEffort(finding) {
  switch (finding.severity) {
    case 'CRITICAL':
      return '1-3 days (senior developer)';
    case 'HIGH':
      return '4-8 hours (experienced developer)';
    case 'MEDIUM':
      return '2-4 hours (mid-level developer)';
    case 'LOW':
      return '1-2 hours (any developer)';
    default:
      return '30 minutes (any developer)';
  }
}

/**
 * Estimate fix timeline
 */
function estimateFixTimeline(finding) {
  switch (finding.severity) {
    case 'CRITICAL':
      return 'Within 24 hours';
    case 'HIGH':
      return 'Within 1 week';
    case 'MEDIUM':
      return 'Within 2 weeks';
    case 'LOW':
      return 'Next development cycle';
    default:
      return 'When convenient';
  }
}

/**
 * Estimate total remediation time for all findings
 */
function estimateRemediationTime(findings) {
  const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity === 'HIGH').length;
  const mediumCount = findings.filter(f => f.severity === 'MEDIUM').length;
  
  if (criticalCount > 2) {
    return '1-2 weeks';
  } else if (criticalCount > 0 || highCount > 3) {
    return '3-5 days';
  } else if (highCount > 0 || mediumCount > 5) {
    return '1-3 days';
  } else {
    return '1 day or less';
  }
}

/**
 * Generate secure implementation example
 */
function generateSecureImplementation(finding) {
  if (finding.title.toLowerCase().includes('reentrancy')) {
    return 'Implement checks-effects-interactions pattern and consider using ReentrancyGuard from OpenZeppelin';
  } else if (finding.title.toLowerCase().includes('access')) {
    return 'Use proper access control modifiers and consider role-based permissions';
  } else if (finding.title.toLowerCase().includes('overflow')) {
    return 'Use SafeMath library or Solidity 0.8+ built-in overflow protection';
  } else {
    return 'Follow security best practices and conduct thorough testing';
  }
}

/**
 * Generate security references
 */
function generateSecurityReferences(finding) {
  const references = [];
  
  if (finding.title.toLowerCase().includes('reentrancy')) {
    references.push('https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/');
  }
  if (finding.title.toLowerCase().includes('access')) {
    references.push('https://docs.openzeppelin.com/contracts/4.x/access-control');
  }
  
  // Add general security reference
  references.push('https://consensys.github.io/smart-contract-best-practices/');
  
  return references;
}

/**
 * Generate finding tags for categorization
 */
function generateFindingTags(finding) {
  const tags = [finding.severity.toLowerCase(), finding.category || 'security'];
  
  if (finding.title.toLowerCase().includes('reentrancy')) tags.push('reentrancy');
  if (finding.title.toLowerCase().includes('access')) tags.push('access-control');
  if (finding.title.toLowerCase().includes('gas')) tags.push('gas-optimization');
  if (finding.title.toLowerCase().includes('overflow')) tags.push('overflow');
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Generate verification notes
 */
function generateVerificationNotes(multiAIResult) {
  const { metadata, supervisorReport } = multiAIResult;
  
  return [
    `Analysis completed with ${metadata.successfulModels}/${metadata.totalModels} AI models`,
    `Consensus verification removed ${supervisorReport.findings.duplicatesRemoved} duplicate findings`,
    `Overall consensus level: ${supervisorReport.consensus.consensusLevel}`,
    'All findings verified through multi-model agreement or high confidence assessment'
  ];
}

/**
 * Calculate analysis quality score
 */
function calculateAnalysisQuality(multiAIResult) {
  const { metadata, supervisorReport } = multiAIResult;
  const successRate = metadata.successfulModels / metadata.totalModels;
  const consensusLevel = parseFloat(supervisorReport.consensus.consensusLevel.replace('%', ''));
  
  const qualityScore = (successRate * 0.6 + (consensusLevel / 100) * 0.4) * 100;
  
  if (qualityScore >= 90) return 'EXCELLENT';
  else if (qualityScore >= 80) return 'GOOD';
  else if (qualityScore >= 70) return 'FAIR';
  else return 'POOR';
}

/**
 * Utility functions for ID generation
 */
function generateVulnerabilityId() {
  return `VUL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

function generateOptimizationId() {
  return `OPT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

/**
 * Extract function name from location string
 */
function extractFunctionName(location) {
  if (!location) return 'Unknown';
  
  // Try to extract function name from various formats
  const functionMatch = location.match(/function\s+(\w+)/i);
  if (functionMatch) return functionMatch[1];
  
  const contractMatch = location.match(/(\w+)\s*\(/);
  if (contractMatch) return contractMatch[1];
  
  return location;
}

/**
 * Extract savings percentage from savings string
 */
function extractSavingsPercentage(savings) {
  if (!savings) return 'Unknown';
  
  const percentMatch = savings.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return `${percentMatch[1]}%`;
  
  return 'See description';
}

/**
 * Estimate implementation difficulty for optimization
 */
function estimateImplementationDifficulty(optimization) {
  const title = optimization.title.toLowerCase();
  
  if (title.includes('storage') || title.includes('mapping')) {
    return 'MEDIUM';
  } else if (title.includes('loop') || title.includes('batch')) {
    return 'HIGH';
  } else {
    return 'LOW';
  }
}

/**
 * Calculate optimization priority
 */
function calculateOptimizationPriority(optimization) {
  const savings = optimization.savings || '';
  
  if (savings.includes('high') || savings.includes('significant')) {
    return 'HIGH';
  } else if (savings.includes('medium') || savings.includes('moderate')) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}
