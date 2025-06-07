// Enhanced Supervisor AI - Creates High-Quality Structured Reports
// This supervisor reads multiple AI outputs and generates comprehensive, duplicate-free reports

/**
 * Advanced Supervisor AI that generates high-quality reports from multiple AI analyses
 */
export async function createSupervisorReport(aiResults, contractName, sourceCode) {
  console.log('🎯 Starting Advanced Supervisor Report Generation...');
  
  const supervisor = new SupervisorAI();
  return await supervisor.generateComprehensiveReport(aiResults, contractName, sourceCode);
}

class SupervisorAI {
  constructor() {
    this.duplicateThreshold = 0.8; // Similarity threshold for duplicate detection
    this.confidenceWeights = {
      'HIGH': 1.2,
      'MEDIUM': 1.0,
      'LOW': 0.7
    };
  }
  
  /**
   * Generate comprehensive supervisor report
   */
  async generateComprehensiveReport(aiResults, contractName, sourceCode) {
    console.log(`🧠 Supervisor analyzing ${aiResults.length} AI model results...`);
    
    // Step 1: Extract and categorize all findings
    const rawFindings = this.extractAllFindings(aiResults);
    console.log(`📊 Extracted ${rawFindings.length} total findings from all models`);
    
    // Step 2: Advanced duplicate detection and consolidation
    const consolidatedFindings = this.advancedDuplicateDetection(rawFindings);
    console.log(`🔍 Consolidated to ${consolidatedFindings.length} unique findings`);
    
    // Step 3: Verify findings with code analysis
    const verifiedFindings = this.verifyFindingsWithCode(consolidatedFindings, sourceCode);
    console.log(`✅ Verified ${verifiedFindings.length} findings against actual code`);
    
    // Step 4: Generate detailed analysis
    const detailedAnalysis = this.generateDetailedAnalysis(verifiedFindings, aiResults);
    
    // Step 5: Create executive summary
    const executiveSummary = this.createExecutiveSummary(detailedAnalysis, contractName);
    
    // Step 6: Generate actionable recommendations
    const recommendations = this.generateActionableRecommendations(verifiedFindings);
    
    return {
      contractName,
      executiveSummary,
      detailedAnalysis,
      verifiedFindings,
      recommendations,
      supervisorMetadata: {
        totalAIModels: aiResults.length,
        rawFindings: rawFindings.length,
        duplicatesRemoved: rawFindings.length - consolidatedFindings.length,
        verifiedFindings: verifiedFindings.length,
        analysisTimestamp: new Date().toISOString()
      }
    };
  }
  
  /**
   * Extract all findings from AI results
   */
  extractAllFindings(aiResults) {
    const allFindings = [];
    
    aiResults.forEach((result, index) => {
      if (result.success && result.result) {
        const findings = result.result.findings || result.result.keyFindings || [];
        
        findings.forEach(finding => {
          allFindings.push({
            ...finding,
            sourceModel: result.model || `Model ${index + 1}`,
            modelFocus: result.result.modelFocus || 'General Analysis',
            originalIndex: allFindings.length,
            confidence: finding.confidence || this.inferConfidence(finding),
            category: finding.category || this.categorizeVulnerability(finding)
          });
        });
        
        // Also extract gas optimizations if present
        const gasOpts = result.result.gasOptimizations || [];
        gasOpts.forEach(opt => {
          allFindings.push({
            severity: 'INFO',
            category: 'gas-optimization',
            title: `Gas Optimization: ${opt.title}`,
            description: opt.description,
            location: opt.location || 'Contract',
            impact: `Gas savings: ${opt.savings || 'Unknown'}`,
            recommendation: opt.implementation || opt.recommendation || 'Apply optimization',
            sourceModel: result.model || `Model ${index + 1}`,
            modelFocus: 'Gas Optimization',
            confidence: 'MEDIUM',
            gasOptimization: true,
            originalOptimization: opt
          });
        });
      }
    });
    
    return allFindings;
  }
  
  /**
   * Advanced duplicate detection using multiple similarity metrics
   */
  advancedDuplicateDetection(findings) {
    const clusters = [];
    const processed = new Set();
    
    findings.forEach((finding, index) => {
      if (processed.has(index)) return;
      
      const cluster = [finding];
      processed.add(index);
      
      // Find similar findings
      findings.forEach((otherFinding, otherIndex) => {
        if (otherIndex <= index || processed.has(otherIndex)) return;
        
        const similarity = this.calculateSimilarity(finding, otherFinding);
        if (similarity >= this.duplicateThreshold) {
          cluster.push(otherFinding);
          processed.add(otherIndex);
        }
      });
      
      clusters.push(cluster);
    });
    
    // Consolidate each cluster into a single finding
    return clusters.map(cluster => this.consolidateCluster(cluster));
  }
  
  /**
   * Calculate similarity between two findings
   */
  calculateSimilarity(finding1, finding2) {
    // Title similarity (most important)
    const titleSim = this.stringSimilarity(
      finding1.title?.toLowerCase() || '',
      finding2.title?.toLowerCase() || ''
    );
    
    // Category similarity
    const categorySim = finding1.category === finding2.category ? 1 : 0;
    
    // Severity similarity
    const severitySim = finding1.severity === finding2.severity ? 1 : 0;
    
    // Location similarity
    const locationSim = this.stringSimilarity(
      finding1.location?.toLowerCase() || '',
      finding2.location?.toLowerCase() || ''
    );
    
    // Description similarity (less important)
    const descSim = this.stringSimilarity(
      finding1.description?.toLowerCase() || '',
      finding2.description?.toLowerCase() || ''
    );
    
    // Weighted average
    return (titleSim * 0.4 + categorySim * 0.25 + severitySim * 0.15 + locationSim * 0.15 + descSim * 0.05);
  }
  
  /**
   * String similarity using Jaccard index
   */
  stringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
  
  /**
   * Consolidate a cluster of similar findings
   */
  consolidateCluster(cluster) {
    if (cluster.length === 1) return cluster[0];
    
    // Sort by confidence and model quality
    cluster.sort((a, b) => {
      const aWeight = this.confidenceWeights[a.confidence] || 1;
      const bWeight = this.confidenceWeights[b.confidence] || 1;
      return bWeight - aWeight;
    });
    
    const primary = cluster[0];
    const reportingModels = cluster.map(f => f.sourceModel);
    const allRecommendations = cluster.map(f => f.recommendation).filter(Boolean);
    
    return {
      ...primary,
      consensusCount: cluster.length,
      reportingModels: [...new Set(reportingModels)],
      consolidatedRecommendations: [...new Set(allRecommendations)],
      confidence: cluster.length >= 3 ? 'HIGH' : cluster.length >= 2 ? 'MEDIUM' : primary.confidence,
      description: this.enhanceDescription(primary.description, cluster),
      recommendation: this.consolidateRecommendations(allRecommendations)
    };
  }
  
  /**
   * Enhance description with insights from multiple models
   */
  enhanceDescription(primaryDesc, cluster) {
    if (cluster.length === 1) return primaryDesc;
    
    const additionalInsights = cluster.slice(1)
      .map(f => f.description)
      .filter(desc => desc && desc !== primaryDesc)
      .join(' ');
    
    if (additionalInsights) {
      return `${primaryDesc} Additional insights: ${additionalInsights}`;
    }
    
    return primaryDesc;
  }
  
  /**
   * Consolidate recommendations from multiple models
   */
  consolidateRecommendations(recommendations) {
    if (recommendations.length === 0) return 'No specific recommendation provided';
    if (recommendations.length === 1) return recommendations[0];
    
    // Find the most comprehensive recommendation
    const longest = recommendations.reduce((a, b) => a.length > b.length ? a : b);
    
    // Add additional recommendations if they provide new information
    const uniqueRecommendations = [...new Set(recommendations)];
    
    if (uniqueRecommendations.length > 1) {
      return `${longest} Alternative approaches: ${uniqueRecommendations.slice(1).join('; ')}`;
    }
    
    return longest;
  }
  
  /**
   * Verify findings against actual source code
   */
  verifyFindingsWithCode(findings, sourceCode) {
    return findings.filter(finding => this.verifyFindingAgainstCode(finding, sourceCode));
  }
  
  /**
   * Verify individual finding against source code
   */
  verifyFindingAgainstCode(finding, sourceCode) {
    if (!sourceCode) return true; // Can't verify without code
    
    const lowerCode = sourceCode.toLowerCase();
    const location = finding.location?.toLowerCase() || '';
    const title = finding.title?.toLowerCase() || '';
    
    // Check for gas optimization findings
    if (finding.gasOptimization) {
      return true; // Gas optimizations are generally valid
    }
    
    // Check if referenced function/location exists in code
    if (location && location !== 'unknown' && location !== 'contract') {
      const functionExists = lowerCode.includes(`function ${location}`) || 
                            lowerCode.includes(location);
      if (!functionExists && location.length > 3) {
        console.log(`⚠️ Verification failed: ${location} not found in code`);
        return false;
      }
    }
    
    // Check for vulnerability-specific patterns
    if (title.includes('reentrancy')) {
      const hasExternalCalls = lowerCode.includes('.call(') || 
                               lowerCode.includes('.transfer(') || 
                               lowerCode.includes('.send(');
      return hasExternalCalls;
    }
    
    if (title.includes('overflow') || title.includes('underflow')) {
      const hasArithmetic = lowerCode.includes('+') || 
                           lowerCode.includes('-') || 
                           lowerCode.includes('*') || 
                           lowerCode.includes('/');
      return hasArithmetic;
    }
    
    if (title.includes('access control')) {
      const hasAccessControl = lowerCode.includes('onlyowner') || 
                               lowerCode.includes('require(') || 
                               lowerCode.includes('modifier');
      return hasAccessControl;
    }
    
    // Default to true for findings we can't specifically verify
    return true;
  }
  
  /**
   * Infer confidence level from finding characteristics
   */
  inferConfidence(finding) {
    if (finding.codeReference && finding.proofOfConcept) return 'HIGH';
    if (finding.codeReference || finding.location) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Categorize vulnerability type
   */
  categorizeVulnerability(finding) {
    const title = finding.title?.toLowerCase() || '';
    const desc = finding.description?.toLowerCase() || '';
    
    if (title.includes('reentrancy') || desc.includes('reentrancy')) return 'reentrancy';
    if (title.includes('access') || desc.includes('access')) return 'access-control';
    if (title.includes('overflow') || title.includes('underflow')) return 'arithmetic';
    if (title.includes('gas') || desc.includes('gas')) return 'gas-optimization';
    if (title.includes('logic') || desc.includes('logic')) return 'logic-error';
    
    return 'security';
  }
  
  /**
   * Generate detailed analysis
   */
  generateDetailedAnalysis(findings, aiResults) {
    const securityFindings = findings.filter(f => f.category !== 'gas-optimization');
    const gasOptimizations = findings.filter(f => f.category === 'gas-optimization');
    
    const severityCounts = {
      CRITICAL: securityFindings.filter(f => f.severity === 'CRITICAL').length,
      HIGH: securityFindings.filter(f => f.severity === 'HIGH').length,
      MEDIUM: securityFindings.filter(f => f.severity === 'MEDIUM').length,
      LOW: securityFindings.filter(f => f.severity === 'LOW').length
    };
    
    const scores = this.calculateDetailedScores(findings);
    
    return {
      securityFindings,
      gasOptimizations,
      severityCounts,
      scores,
      modelPerformance: this.analyzeModelPerformance(aiResults),
      findingsByCategory: this.groupFindingsByCategory(securityFindings)
    };
  }
  
  /**
   * Calculate detailed scores
   */
  calculateDetailedScores(findings) {
    const securityFindings = findings.filter(f => f.category !== 'gas-optimization');
    
    let securityScore = 100;
    securityFindings.forEach(finding => {
      const weight = this.confidenceWeights[finding.confidence] || 1;
      if (finding.severity === 'CRITICAL') securityScore -= 25 * weight;
      else if (finding.severity === 'HIGH') securityScore -= 15 * weight;
      else if (finding.severity === 'MEDIUM') securityScore -= 8 * weight;
      else if (finding.severity === 'LOW') securityScore -= 3 * weight;
    });
    
    securityScore = Math.max(0, securityScore);
    
    const gasOptimizations = findings.filter(f => f.category === 'gas-optimization');
    const gasScore = Math.max(50, 95 - gasOptimizations.length * 5);
    
    const overallScore = Math.round(securityScore * 0.7 + gasScore * 0.3);
    
    return {
      security: Math.round(securityScore),
      gasOptimization: Math.round(gasScore),
      codeQuality: 85, // Default for now
      overall: overallScore
    };
  }
  
  /**
   * Analyze model performance
   */
  analyzeModelPerformance(aiResults) {
    return aiResults.map(result => ({
      model: result.model,
      success: result.success,
      findingsCount: result.result?.findings?.length || 0,
      parseMethod: result.parseMethod,
      hadParseError: result.hadParseError
    }));
  }
  
  /**
   * Group findings by category
   */
  groupFindingsByCategory(findings) {
    const categories = {};
    
    findings.forEach(finding => {
      const category = finding.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(finding);
    });
    
    return categories;
  }
  
  /**
   * Create executive summary
   */
  createExecutiveSummary(analysis, contractName) {
    const { securityFindings, scores, severityCounts } = analysis;
    
    let riskLevel = 'Low Risk';
    let deploymentRecommendation = 'APPROVED';
    
    if (severityCounts.CRITICAL > 0) {
      riskLevel = 'Critical Risk';
      deploymentRecommendation = 'BLOCKED';
    } else if (severityCounts.HIGH > 2) {
      riskLevel = 'High Risk';
      deploymentRecommendation = 'BLOCKED';
    } else if (severityCounts.HIGH > 0 || severityCounts.MEDIUM > 3) {
      riskLevel = 'Medium Risk';
      deploymentRecommendation = 'REVIEW_REQUIRED';
    }
    
    const summary = `Multi-AI security analysis of ${contractName} identified ${securityFindings.length} verified security issues. ${severityCounts.CRITICAL} critical, ${severityCounts.HIGH} high, ${severityCounts.MEDIUM} medium, and ${severityCounts.LOW} low severity findings detected.`;
    
    return {
      contractName,
      summary,
      overallScore: scores.overall,
      securityScore: scores.security,
      riskLevel,
      deploymentRecommendation,
      totalFindings: securityFindings.length,
      criticalFindings: severityCounts.CRITICAL,
      highFindings: severityCounts.HIGH,
      mediumFindings: severityCounts.MEDIUM,
      lowFindings: severityCounts.LOW,
      gasOptimizations: analysis.gasOptimizations.length,
      businessImpact: this.generateBusinessImpactAssessment(riskLevel, severityCounts)
    };
  }
  
  /**
   * Generate business impact assessment
   */
  generateBusinessImpactAssessment(riskLevel, severityCounts) {
    if (riskLevel === 'Critical Risk') {
      return 'CRITICAL: Immediate threat to funds and operations. Do not deploy until all critical issues are resolved.';
    } else if (riskLevel === 'High Risk') {
      return 'HIGH: Significant security concerns that could impact user trust and platform integrity.';
    } else if (riskLevel === 'Medium Risk') {
      return 'MEDIUM: Moderate security issues that should be addressed before production deployment.';
    } else {
      return 'LOW: Contract demonstrates good security practices with only minor issues to address.';
    }
  }
  
  /**
   * Generate actionable recommendations
   */
  generateActionableRecommendations(findings) {
    const recommendations = [];
    
    const criticalFindings = findings.filter(f => f.severity === 'CRITICAL');
    const highFindings = findings.filter(f => f.severity === 'HIGH');
    const mediumFindings = findings.filter(f => f.severity === 'MEDIUM');
    const gasOptimizations = findings.filter(f => f.category === 'gas-optimization');
    
    if (criticalFindings.length > 0) {
      recommendations.push({
        priority: 'IMMEDIATE',
        category: 'SECURITY',
        title: 'Resolve Critical Security Vulnerabilities',
        description: `${criticalFindings.length} critical vulnerabilities require immediate attention`,
        findings: criticalFindings.slice(0, 3),
        timeline: 'Within 24 hours',
        businessImpact: 'Deployment blocked until resolved'
      });
    }
    
    if (highFindings.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'SECURITY',
        title: 'Address High-Risk Security Issues',
        description: `${highFindings.length} high-risk issues should be resolved before production`,
        findings: highFindings.slice(0, 3),
        timeline: 'Within 1 week',
        businessImpact: 'Significant security risk to operations'
      });
    }
    
    if (mediumFindings.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'SECURITY',
        title: 'Resolve Medium-Risk Issues',
        description: `${mediumFindings.length} medium-risk issues identified`,
        findings: mediumFindings.slice(0, 3),
        timeline: 'Within 2 weeks',
        businessImpact: 'Moderate risk to security posture'
      });
    }
    
    if (gasOptimizations.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'OPTIMIZATION',
        title: 'Implement Gas Optimizations',
        description: `${gasOptimizations.length} gas optimization opportunities identified`,
        optimizations: gasOptimizations.slice(0, 5),
        timeline: 'Before mainnet deployment',
        businessImpact: 'Reduced transaction costs for users'
      });
    }
    
    // General recommendations
    recommendations.push({
      priority: 'ONGOING',
      category: 'BEST_PRACTICES',
      title: 'Security Best Practices',
      description: 'Maintain ongoing security practices',
      actions: [
        'Conduct thorough testing with comprehensive test suite',
        'Consider professional security audit before mainnet',
        'Implement monitoring and incident response procedures',
        'Keep dependencies and libraries up to date',
        'Establish bug bounty program for ongoing security'
      ],
      timeline: 'Ongoing',
      businessImpact: 'Long-term security and reliability'
    });
    
    return recommendations;
  }
}
