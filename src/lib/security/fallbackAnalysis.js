// Fallback Security Analysis Module
// Provides basic static analysis when AI models are unavailable

/**
 * Performs static security analysis without AI
 * Used as fallback when API keys are missing or AI models fail
 */
export async function runFallbackSecurityAnalysis(sourceCode, contractName) {
  console.log('🔍 Running fallback static security analysis...');
  
  const analysis = {
    success: true,
    type: 'fallback-static',
    contractName: contractName,
    timestamp: new Date().toISOString(),
    findings: [],
    gasOptimizations: [],
    codeQualityIssues: [],
    metrics: {},
    severity: 'info',
    securityScore: 85, // Default conservative score
    riskLevel: 'Unknown - Limited Analysis'
  };

  try {
    // 1. Basic vulnerability pattern detection
    const vulnerabilityPatterns = [
      // Critical patterns
      {
        pattern: /selfdestruct\s*\(/gi,
        severity: 'CRITICAL',
        title: 'Selfdestruct Function Detected',
        description: 'Contract contains selfdestruct which can permanently destroy the contract',
        recommendation: 'Remove selfdestruct unless absolutely necessary. Consider using pausable pattern instead.',
        category: 'Access Control'
      },
      {
        pattern: /delegatecall\s*\(/gi,
        severity: 'HIGH',
        title: 'Delegatecall Usage',
        description: 'Delegatecall can be dangerous if not properly secured',
        recommendation: 'Ensure delegatecall target is trusted and consider using libraries instead.',
        category: 'External Calls'
      },
      
      // High severity patterns
      {
        pattern: /tx\.origin/gi,
        severity: 'HIGH',
        title: 'tx.origin Authentication',
        description: 'Using tx.origin for authentication is vulnerable to phishing attacks',
        recommendation: 'Replace tx.origin with msg.sender for authentication checks.',
        category: 'Access Control'
      },
      {
        pattern: /\.call\s*\{.*value\s*:/gi,
        severity: 'HIGH',
        title: 'External Call with Value',
        description: 'External calls with value transfer may be vulnerable to reentrancy',
        recommendation: 'Follow checks-effects-interactions pattern and consider using ReentrancyGuard.',
        category: 'Reentrancy'
      },
      {
        pattern: /block\.timestamp/gi,
        severity: 'MEDIUM',
        title: 'Block Timestamp Dependency',
        description: 'Block timestamps can be manipulated by miners within a small range',
        recommendation: 'Avoid using block.timestamp for critical logic. Use block.number when possible.',
        category: 'Time Manipulation'
      },
      
      // Medium severity patterns
      {
        pattern: /transfer\s*\(/gi,
        severity: 'MEDIUM',
        title: 'Using transfer() for Ether',
        description: 'transfer() has a 2300 gas limit which may cause issues',
        recommendation: 'Consider using call() with proper checks instead of transfer().',
        category: 'External Calls'
      },
      {
        pattern: /pragma\s+solidity\s+[\^~]?0\.[4-7]\./gi,
        severity: 'MEDIUM',
        title: 'Outdated Solidity Version',
        description: 'Contract uses an outdated Solidity version',
        recommendation: 'Update to Solidity 0.8.x or latest stable version.',
        category: 'Best Practices'
      },
      
      // Low severity patterns
      {
        pattern: /public\s+\w+\s*;/gi,
        severity: 'LOW',
        title: 'Public State Variables',
        description: 'Public state variables automatically create getter functions',
        recommendation: 'Review if all public variables need external access.',
        category: 'Gas Optimization'
      },
      {
        pattern: /for\s*\([^)]*\.length/gi,
        severity: 'LOW',
        title: 'Array Length in Loop',
        description: 'Reading array length in loop condition wastes gas',
        recommendation: 'Cache array length in a variable before the loop.',
        category: 'Gas Optimization'
      }
    ];

    // Check each pattern
    vulnerabilityPatterns.forEach(({ pattern, severity, title, description, recommendation, category }) => {
      const matches = sourceCode.match(pattern);
      if (matches) {
        analysis.findings.push({
          severity,
          title,
          description,
          location: 'Multiple locations', // Would need AST for precise locations
          impact: `Found ${matches.length} occurrence(s)`,
          recommendation,
          category,
          confidence: 'HIGH',
          source: 'static-analysis'
        });
      }
    });

    // 2. Gas optimization opportunities
    const gasPatterns = [
      {
        pattern: /\+\+|--/gi,
        title: 'Use ++i instead of i++',
        description: 'Pre-increment is slightly more gas efficient',
        savings: '5 gas per operation'
      },
      {
        pattern: /storage\s+\w+\s*=\s*\w+\[/gi,
        title: 'Storage Array Access',
        description: 'Multiple storage reads can be optimized',
        savings: '100+ gas per optimization'
      },
      {
        pattern: /\.push\(/gi,
        title: 'Array Push Operations',
        description: 'Consider using mappings for large datasets',
        savings: 'Varies based on usage'
      }
    ];

    gasPatterns.forEach(({ pattern, title, description, savings }) => {
      const matches = sourceCode.match(pattern);
      if (matches) {
        analysis.gasOptimizations.push({
          title,
          description,
          location: 'Multiple locations',
          currentGasCost: 'Not calculated',
          optimizedGasCost: 'Not calculated',
          savings,
          difficulty: 'EASY',
          occurrences: matches.length
        });
      }
    });

    // 3. Code quality checks
    const qualityChecks = [
      {
        pattern: /function\s+\w+\s*\([^)]*\)\s*(?:public|external|internal|private)?\s*(?:view|pure|payable)?\s*\{/gi,
        check: (match) => !match.includes('*') && !match.includes('//'),
        issue: 'Missing function documentation',
        category: 'DOCUMENTATION'
      },
      {
        pattern: /require\s*\([^,)]+\)/gi,
        check: (match) => true,
        issue: 'Require statement without error message',
        category: 'ERROR_HANDLING'
      },
      {
        pattern: /magic number|[^0-9][0-9]{3,}[^0-9]/gi,
        check: (match) => true,
        issue: 'Magic numbers should be constants',
        category: 'BEST_PRACTICES'
      }
    ];

    qualityChecks.forEach(({ pattern, check, issue, category }) => {
      const matches = sourceCode.match(pattern);
      if (matches) {
        const violations = matches.filter(check);
        if (violations.length > 0) {
          analysis.codeQualityIssues.push({
            title: issue,
            description: `Found ${violations.length} occurrence(s)`,
            category,
            severity: 'LOW',
            location: 'Multiple locations',
            recommendation: 'Follow Solidity best practices'
          });
        }
      }
    });

    // 4. Calculate metrics
    analysis.metrics = {
      totalLines: sourceCode.split('\n').length,
      contractCount: (sourceCode.match(/contract\s+\w+/g) || []).length,
      functionCount: (sourceCode.match(/function\s+\w+/g) || []).length,
      modifierCount: (sourceCode.match(/modifier\s+\w+/g) || []).length,
      eventCount: (sourceCode.match(/event\s+\w+/g) || []).length
    };

    // 5. Calculate security score
    const criticalCount = analysis.findings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = analysis.findings.filter(f => f.severity === 'HIGH').length;
    const mediumCount = analysis.findings.filter(f => f.severity === 'MEDIUM').length;
    
    analysis.securityScore = Math.max(0, 100 - (criticalCount * 25) - (highCount * 15) - (mediumCount * 5));
    
    // 6. Determine risk level
    if (criticalCount > 0) {
      analysis.riskLevel = 'Critical Risk';
      analysis.severity = 'critical';
    } else if (highCount > 0) {
      analysis.riskLevel = 'High Risk';
      analysis.severity = 'high';
    } else if (mediumCount > 0) {
      analysis.riskLevel = 'Medium Risk';
      analysis.severity = 'medium';
    } else if (analysis.findings.length > 0) {
      analysis.riskLevel = 'Low Risk';
      analysis.severity = 'low';
    } else {
      analysis.riskLevel = 'Minimal Risk';
      analysis.severity = 'info';
    }

    // Add summary
    analysis.summary = `Static analysis completed. Found ${analysis.findings.length} security issues, ${analysis.gasOptimizations.length} gas optimizations, and ${analysis.codeQualityIssues.length} code quality improvements.`;

  } catch (error) {
    console.error('Fallback analysis error:', error);
    analysis.success = false;
    analysis.error = error.message;
  }

  return analysis;
}

/**
 * Create a fallback comprehensive report structure
 */
export function createFallbackReport(fallbackAnalysis, contractName) {
  return {
    success: fallbackAnalysis.success,
    type: 'fallback',
    analysisId: `fallback-${Date.now()}`,
    contractName: contractName,
    timestamp: fallbackAnalysis.timestamp,
    
    executiveSummary: {
      contractName: contractName,
      overallScore: fallbackAnalysis.securityScore,
      riskLevel: fallbackAnalysis.riskLevel,
      summary: fallbackAnalysis.summary,
      keyMetrics: {
        securityScore: fallbackAnalysis.securityScore,
        totalFindings: fallbackAnalysis.findings.length,
        criticalIssues: fallbackAnalysis.findings.filter(f => f.severity === 'CRITICAL').length,
        highIssues: fallbackAnalysis.findings.filter(f => f.severity === 'HIGH').length,
        aiModelsUsed: 0
      },
      keyRecommendations: [
        'Configure OpenRouter API key for comprehensive AI analysis',
        fallbackAnalysis.findings.length > 0 ? 'Address identified security issues' : null,
        fallbackAnalysis.gasOptimizations.length > 0 ? 'Implement gas optimizations' : null
      ].filter(Boolean),
      analysisDate: fallbackAnalysis.timestamp
    },
    
    scores: {
      security: fallbackAnalysis.securityScore,
      gasOptimization: fallbackAnalysis.gasOptimizations.length > 0 ? 75 : 90,
      codeQuality: fallbackAnalysis.codeQualityIssues.length > 0 ? 70 : 85,
      overall: fallbackAnalysis.securityScore,
      breakdown: {
        criticalIssues: fallbackAnalysis.findings.filter(f => f.severity === 'CRITICAL').length,
        highIssues: fallbackAnalysis.findings.filter(f => f.severity === 'HIGH').length,
        mediumIssues: fallbackAnalysis.findings.filter(f => f.severity === 'MEDIUM').length,
        gasOptimizations: fallbackAnalysis.gasOptimizations.length,
        qualityIssues: fallbackAnalysis.codeQualityIssues.length
      }
    },
    
    findings: {
      security: fallbackAnalysis.findings,
      gasOptimization: fallbackAnalysis.gasOptimizations,
      codeQuality: fallbackAnalysis.codeQualityIssues,
      patterns: []
    },
    
    analysisMetadata: {
      aiModelsUsed: [],
      supervisorVerification: 'NOT_AVAILABLE',
      consensusScore: 0,
      conflictsResolved: 0,
      patternMatchingCoverage: 100,
      totalFindings: fallbackAnalysis.findings.length + fallbackAnalysis.gasOptimizations.length + fallbackAnalysis.codeQualityIssues.length,
      analysisType: 'STATIC_FALLBACK',
      limitations: [
        'No AI-powered analysis available',
        'Limited to pattern-based detection',
        'May miss complex vulnerabilities',
        'No economic attack vector analysis'
      ]
    },
    
    recommendations: [
      {
        priority: 'CRITICAL',
        category: 'Configuration',
        title: 'Enable AI Analysis',
        description: 'Configure OpenRouter API key for comprehensive security analysis',
        actions: ['Add API key in settings', 'Get key from openrouter.ai'],
        estimatedTime: '5 minutes',
        impact: 'Enables advanced vulnerability detection'
      }
    ],
    
    reportFormats: {
      json: true,
      html: true,
      executiveSummary: true,
      pdf: false
    }
  };
}
