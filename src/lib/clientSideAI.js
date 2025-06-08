// ENHANCED CLIENT-SIDE AI Analysis - Professional Results
// Fast, accurate, and reliable browser-based security analysis

export class ClientSideAIAnalyzer {
  constructor() {
    this.securityRules = this.initializeSecurityRules();
    this.gasRules = this.initializeGasRules();
    this.qualityRules = this.initializeQualityRules();
  }

  async analyzeContract(sourceCode, contractName, options = {}) {
    const startTime = Date.now();
    console.log(`🤖 Starting client-side AI analysis for ${contractName}`);

    try {
      // Parse contract
      const structure = this.parseContract(sourceCode, contractName);
      
      // Run analysis
      const securityFindings = this.analyzeSecurityIssues(sourceCode, structure);
      const gasOptimizations = this.analyzeGasIssues(sourceCode, structure);
      const qualityIssues = this.analyzeQualityIssues(sourceCode, structure);
      
      // Calculate score
      const securityScore = this.calculateSecurityScore(securityFindings);
      
      // Generate report
      const analysis = this.generateReport(
        contractName,
        structure,
        securityFindings,
        gasOptimizations,
        qualityIssues,
        securityScore
      );

      const analysisTime = Date.now() - startTime;
      console.log(`✅ Client-side analysis completed in ${analysisTime}ms`);

      return {
        success: true,
        type: 'client-side-ai',
        model: 'Browser-Based AI Analyzer v3.0',
        contractName: contractName,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        analysisTime: analysisTime
      };

    } catch (error) {
      console.error('❌ Client-side analysis failed:', error);
      return this.createErrorResponse(error, contractName, startTime);
    }
  }

  parseContract(sourceCode, contractName) {
    const structure = {
      contractName,
      functions: [],
      modifiers: [],
      events: [],
      stateVariables: [],
      hasAccessControl: false,
      hasReentrancyGuard: false,
      isUpgradeable: false,
      isPausable: false,
      isOwnable: false
    };

    // Extract functions with better parsing
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*(public|private|internal|external)?\s*(view|pure|payable)?[^{]*\{/g;
    let match;
    while ((match = functionRegex.exec(sourceCode)) !== null) {
      structure.functions.push({
        name: match[1],
        visibility: match[2] || 'internal',
        stateMutability: match[3] || 'nonpayable'
      });
    }

    // Extract modifiers
    const modifierRegex = /modifier\s+(\w+)\s*(?:\([^)]*\))?\s*\{/g;
    while ((match = modifierRegex.exec(sourceCode)) !== null) {
      structure.modifiers.push(match[1]);
    }

    // Check for security patterns
    structure.hasAccessControl = /onlyOwner|onlyAdmin|AccessControl|Ownable/i.test(sourceCode);
    structure.hasReentrancyGuard = /nonReentrant|ReentrancyGuard/i.test(sourceCode);
    structure.isUpgradeable = /upgradeable|initializer|proxy/i.test(sourceCode);
    structure.isPausable = /whenNotPaused|_pause|Pausable/i.test(sourceCode);
    structure.isOwnable = /Ownable|owner/i.test(sourceCode);

    return structure;
  }

  analyzeSecurityIssues(sourceCode, structure) {
    const findings = [];

    // Check each security rule
    for (const rule of this.securityRules) {
      if (this.matchesRule(sourceCode, rule)) {
        findings.push({
          severity: rule.severity,
          category: 'SECURITY',
          title: rule.title,
          description: rule.description,
          location: this.findLocation(sourceCode, rule),
          impact: rule.impact,
          recommendation: rule.recommendation,
          confidence: rule.confidence || 'HIGH'
        });
      }
    }

    // Structural analysis
    findings.push(...this.analyzeStructure(structure));

    // Limit and prioritize findings
    return this.prioritizeFindings(findings).slice(0, 8);
  }

  analyzeGasIssues(sourceCode, structure) {
    const optimizations = [];

    for (const rule of this.gasRules) {
      if (this.matchesRule(sourceCode, rule)) {
        optimizations.push({
          title: rule.title,
          description: rule.description,
          location: this.findLocation(sourceCode, rule),
          savings: rule.savings,
          difficulty: rule.difficulty,
          implementation: rule.implementation
        });
      }
    }

    return optimizations.slice(0, 5);
  }

  analyzeQualityIssues(sourceCode, structure) {
    const issues = [];

    for (const rule of this.qualityRules) {
      if (this.matchesRule(sourceCode, rule)) {
        issues.push({
          severity: rule.severity,
          category: 'QUALITY',
          title: rule.title,
          description: rule.description,
          location: this.findLocation(sourceCode, rule),
          impact: rule.impact,
          recommendation: rule.recommendation
        });
      }
    }

    return issues.slice(0, 5);
  }

  matchesRule(sourceCode, rule) {
    if (rule.pattern) {
      return rule.pattern.test(sourceCode);
    }
    if (rule.keywords) {
      return rule.keywords.some(keyword => sourceCode.includes(keyword));
    }
    return false;
  }

  findLocation(sourceCode, rule) {
    if (rule.pattern) {
      const match = sourceCode.match(rule.pattern);
      if (match) {
        const lineNumber = sourceCode.substring(0, match.index).split('\n').length;
        return `Line ${lineNumber}`;
      }
    }
    return 'Contract';
  }

  analyzeStructure(structure) {
    const findings = [];

    // Check for missing access control on critical functions
    const criticalFunctions = structure.functions.filter(f => 
      ['withdraw', 'transfer', 'mint', 'burn', 'approve'].some(critical => 
        f.name.toLowerCase().includes(critical)
      )
    );

    if (criticalFunctions.length > 0 && !structure.hasAccessControl) {
      findings.push({
        severity: 'HIGH',
        category: 'SECURITY',
        title: 'Missing Access Control',
        description: `Found ${criticalFunctions.length} critical functions without access control`,
        location: 'Contract Structure',
        impact: 'Unauthorized users could execute privileged functions',
        recommendation: 'Implement access control using OpenZeppelin Ownable or AccessControl',
        confidence: 'HIGH'
      });
    }

    // Check for reentrancy protection
    const payableFunctions = structure.functions.filter(f => f.stateMutability === 'payable');
    if (payableFunctions.length > 0 && !structure.hasReentrancyGuard) {
      findings.push({
        severity: 'MEDIUM',
        category: 'SECURITY',
        title: 'Consider Reentrancy Protection',
        description: `Found ${payableFunctions.length} payable functions that may benefit from reentrancy guards`,
        location: 'Contract Structure',
        impact: 'Potential reentrancy attacks on payable functions',
        recommendation: 'Consider implementing OpenZeppelin ReentrancyGuard',
        confidence: 'MEDIUM'
      });
    }

    return findings;
  }

  prioritizeFindings(findings) {
    const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1, 'INFO': 0 };
    return findings.sort((a, b) => {
      return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    });
  }

  calculateSecurityScore(findings) {
    let score = 100;
    
    const severityImpact = {
      'CRITICAL': 25,
      'HIGH': 15,
      'MEDIUM': 8,
      'LOW': 3,
      'INFO': 1
    };

    findings.forEach(finding => {
      score -= severityImpact[finding.severity] || 5;
    });

    return Math.max(25, Math.min(100, score));
  }

  generateReport(contractName, structure, securityFindings, gasOptimizations, qualityIssues, securityScore) {
    const allFindings = [...securityFindings, ...qualityIssues];
    const criticalCount = allFindings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = allFindings.filter(f => f.severity === 'HIGH').length;
    
    const riskLevel = criticalCount > 0 ? 'Critical Risk' :
                     highCount > 0 ? 'High Risk' :
                     securityScore >= 80 ? 'Low Risk' :
                     securityScore >= 60 ? 'Medium Risk' : 'High Risk';

    return {
      overview: `Professional security analysis of ${contractName} completed. Contract contains ${structure.functions.length} functions with ${structure.hasAccessControl ? 'access control' : 'no access control'}. Analysis identified ${allFindings.length} findings across security and quality categories.`,
      securityScore: securityScore,
      riskLevel: riskLevel,
      keyFindings: allFindings,
      gasOptimizations: gasOptimizations,
      summary: this.generateSummary(contractName, allFindings, gasOptimizations, securityScore),
      contractStructure: {
        functionsCount: structure.functions.length,
        modifiersCount: structure.modifiers.length,
        hasAccessControl: structure.hasAccessControl,
        hasReentrancyGuard: structure.hasReentrancyGuard,
        isUpgradeable: structure.isUpgradeable
      },
      analysisMetrics: {
        totalIssues: allFindings.length,
        criticalIssues: criticalCount,
        highIssues: highCount,
        gasOptimizations: gasOptimizations.length
      }
    };
  }

  generateSummary(contractName, findings, optimizations, score) {
    const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = findings.filter(f => f.severity === 'HIGH').length;
    
    if (criticalCount > 0) {
      return `⚠️ CRITICAL: ${contractName} has ${criticalCount} critical security issues requiring immediate attention. Security score: ${score}/100.`;
    } else if (highCount > 0) {
      return `⚠️ HIGH RISK: ${contractName} has ${highCount} high-severity issues. Security score: ${score}/100. ${optimizations.length} gas optimizations available.`;
    } else if (score >= 80) {
      return `✅ LOW RISK: ${contractName} demonstrates good security practices. Score: ${score}/100. ${optimizations.length} optimization opportunities identified.`;
    } else {
      return `📊 MEDIUM RISK: ${contractName} requires attention to ${findings.length} identified issues. Security score: ${score}/100.`;
    }
  }

  createErrorResponse(error, contractName, startTime) {
    return {
      success: false,
      error: error.message,
      type: 'client-side-error',
      contractName: contractName,
      analysisTime: Date.now() - startTime,
      analysis: {
        overview: `Client-side analysis failed for ${contractName}`,
        securityScore: 0,
        riskLevel: 'Unknown',
        keyFindings: [{
          severity: 'ERROR',
          title: 'Analysis Error',
          description: error.message,
          location: 'Client Engine',
          impact: 'Analysis could not be completed',
          recommendation: 'Check contract format and try again'
        }],
        summary: `Analysis failed: ${error.message}`
      }
    };
  }

  initializeSecurityRules() {
    return [
      {
        title: 'Potential Reentrancy Vulnerability',
        pattern: /\.call\s*\{[^}]*\}\s*\([^)]*\)/,
        severity: 'HIGH',
        description: 'External call detected that may allow reentrancy attacks',
        impact: 'Attackers could drain contract funds through recursive calls',
        recommendation: 'Use ReentrancyGuard or checks-effects-interactions pattern',
        confidence: 'HIGH'
      },
      {
        title: 'Selfdestruct Usage',
        pattern: /selfdestruct\s*\(/,
        severity: 'HIGH',
        description: 'Contract uses selfdestruct which permanently destroys the contract',
        impact: 'Contract and all funds could be permanently lost',
        recommendation: 'Consider safer alternatives or add strong access controls',
        confidence: 'HIGH'
      },
      {
        title: 'Unchecked Math Operations',
        pattern: /unchecked\s*\{[^}]*[+\-*/][^}]*\}/,
        severity: 'MEDIUM',
        description: 'Arithmetic operations in unchecked blocks may overflow',
        impact: 'Integer overflow could lead to unexpected behavior',
        recommendation: 'Verify math operations are safe or add overflow checks',
        confidence: 'MEDIUM'
      },
      {
        title: 'Public Sensitive Function',
        pattern: /function\s+(withdraw|mint|burn|transfer)\s*\([^)]*\)\s+public/,
        severity: 'MEDIUM',
        description: 'Sensitive function with public visibility',
        impact: 'Unauthorized access to critical functionality',
        recommendation: 'Add access control modifiers or change visibility',
        confidence: 'HIGH'
      },
      {
        title: 'Delegatecall Usage',
        pattern: /delegatecall\s*\(/,
        severity: 'MEDIUM',
        description: 'Delegatecall can be dangerous if not properly validated',
        impact: 'Could allow execution of malicious code in contract context',
        recommendation: 'Ensure delegatecall targets are validated and trusted',
        confidence: 'MEDIUM'
      }
    ];
  }

  initializeGasRules() {
    return [
      {
        title: 'Loop Array Length Optimization',
        pattern: /for\s*\([^)]*\.length[^)]*\)/,
        description: 'Array length accessed in loop condition wastes gas',
        savings: '100-300 gas per iteration',
        difficulty: 'EASY',
        implementation: 'Cache array length in a local variable before the loop'
      },
      {
        title: 'Storage Variable in Loop',
        pattern: /for\s*\([^)]*\)\s*\{[^}]*\w+\[\w+\]/,
        description: 'Storage variables accessed inside loops increase gas costs',
        savings: '200-800 gas per access',
        difficulty: 'EASY',
        implementation: 'Cache storage variables in memory before the loop'
      },
      {
        title: 'Redundant Storage Operations',
        pattern: /\w+\[\w+\]\s*=\s*\w+\[\w+\]/,
        description: 'Multiple storage operations could be optimized',
        savings: '5000-20000 gas',
        difficulty: 'MEDIUM',
        implementation: 'Batch storage operations or use temporary variables'
      }
    ];
  }

  initializeQualityRules() {
    return [
      {
        title: 'Large Magic Numbers',
        pattern: /\b(10{4,}|[1-9]\d{6,})\b/,
        severity: 'LOW',
        description: 'Large hardcoded numbers without context',
        impact: 'Reduced code readability and maintainability',
        recommendation: 'Define named constants for large numbers'
      },
      {
        title: 'TODO Comments',
        pattern: /\/\/\s*TODO|\/\*\s*TODO/i,
        severity: 'LOW',
        description: 'Unfinished implementation or pending tasks',
        impact: 'Potential incomplete functionality',
        recommendation: 'Complete pending tasks before deployment'
      },
      {
        title: 'Missing Function Documentation',
        pattern: /function\s+\w+[^/]*\{/,
        severity: 'LOW',
        description: 'Functions lack proper documentation',
        impact: 'Reduced code maintainability and auditability',
        recommendation: 'Add NatSpec documentation for all functions'
      }
    ];
  }
}

export const clientSideAnalyzer = new ClientSideAIAnalyzer();
