// Professional Report Generator for DeFi Watchdog
// High-Quality HTML, JSON, and Executive Summary Reports

/**
 * 📊 PROFESSIONAL REPORT GENERATOR
 * 
 * Features:
 * 1. Executive Summary Reports (C-Level)
 * 2. Technical Security Reports (HTML)
 * 3. Machine-Readable JSON Reports
 * 4. Risk Assessment Matrices
 * 5. Gas Optimization Analysis
 * 6. Code Quality Metrics
 * 7. Professional Styling & Branding
 * 8. Export-Ready Formats
 */

/**
 * 🎯 MAIN REPORT GENERATION ENTRY POINT
 */
export function generateProfessionalReports(analysisReport, options = {}) {
  console.log('📊 Generating professional reports...');
  
  const reportTypes = options.formats || ['html', 'json', 'executive'];
  const reports = {};
  
  try {
    // Generate Executive Summary Report (C-Level)
    if (reportTypes.includes('executive')) {
      reports.executive = generateExecutiveReport(analysisReport);
    }
    
    // Generate Technical HTML Report
    if (reportTypes.includes('html')) {
      reports.html = generateTechnicalHtmlReport(analysisReport);
    }
    
    // Generate Machine-Readable JSON Report
    if (reportTypes.includes('json')) {
      reports.json = generateStructuredJsonReport(analysisReport);
    }
    
    // Generate Risk Assessment Matrix
    reports.riskMatrix = generateRiskAssessmentMatrix(analysisReport);
    
    // Generate Summary Statistics
    reports.statistics = generateReportStatistics(analysisReport);
    
    return {
      success: true,
      reports: reports,
      metadata: {
        reportTypes: Object.keys(reports),
        generatedAt: new Date().toISOString(),
        analysisId: analysisReport.reportId,
        contractName: analysisReport.contractName
      }
    };
    
  } catch (error) {
    console.error('❌ Report generation failed:', error);
    return {
      success: false,
      error: error.message,
      reports: {}
    };
  }
}

/**
 * 👔 EXECUTIVE SUMMARY REPORT (C-LEVEL)
 */
function generateExecutiveReport(analysisReport) {
  const { executiveSummary = {}, scores = {}, findings = {}, recommendations = [] } = analysisReport;
  
  return {
    title: `Executive Security Assessment - ${analysisReport.contractName}`,
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Executive Security Assessment - ${analysisReport.contractName}</title>
        ${getExecutiveReportCSS()}
      </head>
      <body>
        <div class="executive-report">
          <header class="executive-header">
            <div class="company-branding">
              <h1>🛡️ DeFi Watchdog</h1>
              <p>Professional Smart Contract Security Assessment</p>
            </div>
            <div class="report-meta">
              <p><strong>Contract:</strong> ${analysisReport.contractName}</p>
              <p><strong>Date:</strong> ${new Date(analysisReport.analysisDate).toLocaleDateString()}</p>
              <p><strong>Report ID:</strong> ${analysisReport.reportId}</p>
            </div>
          </header>

          <section class="executive-summary">
            <h2>📋 Executive Summary</h2>
            <div class="summary-grid">
              <div class="summary-card risk-level ${getRiskLevelClass(executiveSummary.riskLevel)}">
                <h3>Overall Risk Level</h3>
                <div class="risk-indicator">${executiveSummary.riskLevel}</div>
                <div class="risk-score">${scores.overall}/100</div>
              </div>
              
              <div class="summary-card security-score">
                <h3>Security Score</h3>
                <div class="score-circle">
                  <div class="score-number">${scores.security}</div>
                  <div class="score-label">/100</div>
                </div>
              </div>
              
              <div class="summary-card findings-count">
                <h3>Critical Findings</h3>
                <div class="findings-number">${executiveSummary.keyMetrics?.criticalIssues || 0}</div>
                <div class="findings-label">Issues Found</div>
              </div>
              
              <div class="summary-card ai-verification">
                <h3>AI Models Used</h3>
                <div class="ai-number">${executiveSummary.keyMetrics?.aiModelsUsed || 0}</div>
                <div class="ai-label">Specialized AIs</div>
              </div>
            </div>
            
            <div class="summary-text">
              <p>${executiveSummary.summary}</p>
            </div>
          </section>

          <section class="key-findings">
            <h2>🚨 Critical Business Risks</h2>
            ${generateExecutiveFindings(findings.security)}
          </section>

          <section class="recommendations">
            <h2>📈 Strategic Recommendations</h2>
            ${generateExecutiveRecommendations(recommendations)}
          </section>

          <section class="business-impact">
            <h2>💼 Business Impact Analysis</h2>
            <div class="impact-grid">
              <div class="impact-card financial">
                <h3>💰 Financial Risk</h3>
                <p>${calculateFinancialRisk(findings.security)}</p>
              </div>
              <div class="impact-card operational">
                <h3>⚙️ Operational Risk</h3>
                <p>${calculateOperationalRisk(findings.security)}</p>
              </div>
              <div class="impact-card reputational">
                <h3>🏢 Reputational Risk</h3>
                <p>${calculateReputationalRisk(executiveSummary.riskLevel)}</p>
              </div>
            </div>
          </section>

          <footer class="executive-footer">
            <div class="footer-content">
              <p><strong>Analysis Methodology:</strong> Multi-AI supervised analysis with ${analysisReport.analysisMetadata?.aiModelsUsed?.length || 0} specialized security models</p>
              <p><strong>Verification Level:</strong> ${analysisReport.analysisMetadata?.supervisorVerification || 'Standard'}</p>
              <p><strong>Analysis Time:</strong> ${Math.round((analysisReport.analysisTime || 0) / 1000)}s</p>
            </div>
          </footer>
        </div>
      </body>
      </html>
    `,
    format: 'html',
    audience: 'executive'
  };
}

/**
 * 🔧 TECHNICAL HTML REPORT
 */
function generateTechnicalHtmlReport(analysisReport) {
  console.log('📊 generateTechnicalHtmlReport - Input data:', JSON.stringify(analysisReport, null, 2));
  
  // Handle the new audit data structure
  let findings = {};
  let scores = {};
  let analysisMetadata = {};
  let executiveSummary = {};
  
  // Check if this is the new audit data format
  if (analysisReport.securityFindings || analysisReport.executiveSummary) {
    console.log('🔄 Converting new audit data format to legacy format');
    
    // Convert security findings
    findings.security = analysisReport.securityFindings || [];
    findings.gasOptimization = analysisReport.gasOptimizations || [];
    findings.codeQuality = analysisReport.codeQualityIssues || [];
    
    // Convert scores
    if (analysisReport.executiveSummary) {
      scores = {
        overall: analysisReport.executiveSummary.overallScore || 0,
        security: analysisReport.executiveSummary.securityScore || 0,
        gasOptimization: analysisReport.executiveSummary.gasEfficiencyScore || 0,
        codeQuality: analysisReport.executiveSummary.codeQualityScore || 0,
        breakdown: {
          criticalIssues: analysisReport.securityFindings?.filter(f => f.severity === 'CRITICAL').length || 0,
          highIssues: analysisReport.securityFindings?.filter(f => f.severity === 'HIGH').length || 0,
          mediumIssues: analysisReport.securityFindings?.filter(f => f.severity === 'MEDIUM').length || 0,
          lowIssues: analysisReport.securityFindings?.filter(f => f.severity === 'LOW').length || 0
        }
      };
      executiveSummary = analysisReport.executiveSummary;
    }
    
    // Convert metadata
    analysisMetadata = analysisReport.auditMetadata || {};
    
    // Update analysisReport with converted data
    analysisReport.findings = findings;
    analysisReport.scores = scores;
    analysisReport.analysisMetadata = analysisMetadata;
    analysisReport.executiveSummary = executiveSummary;
    analysisReport.contractName = analysisReport.metadata?.contractName || analysisReport.contractName || 'Unknown Contract';
    analysisReport.analysisDate = analysisReport.metadata?.generatedAt || analysisReport.analysisDate || new Date().toISOString();
  } else {
    // Use existing structure
    findings = analysisReport.findings || {};
    scores = analysisReport.scores || {};
    analysisMetadata = analysisReport.analysisMetadata || {};
    executiveSummary = analysisReport.executiveSummary || {};
  }
  
  // Ensure all required fields have defaults
  const safeScores = {
    overall: scores.overall || 0,
    security: scores.security || 0,
    gasOptimization: scores.gasOptimization || 0,
    codeQuality: scores.codeQuality || 0,
    breakdown: scores.breakdown || {}
  };
  
  return {
    title: `Technical Security Analysis - ${analysisReport.contractName || 'Unknown Contract'}`,
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Technical Security Analysis - ${analysisReport.contractName || 'Unknown Contract'}</title>
        ${getTechnicalReportCSS()}
      </head>
      <body>
        <div class="technical-report">
          <header class="tech-header">
            <div class="logo-section">
              <h1>🛡️ DeFi Watchdog - Technical Analysis</h1>
              <div class="analysis-badge">Multi-AI Security Analysis</div>
            </div>
            <div class="contract-info">
              <h2>${analysisReport.contractName || 'Unknown Contract'}</h2>
              <div class="info-grid">
                <div><strong>Analysis Date:</strong> ${new Date(analysisReport.analysisDate || Date.now()).toLocaleString()}</div>
                <div><strong>Report Version:</strong> ${analysisReport.reportVersion || '1.0'}</div>
                <div><strong>Analysis Time:</strong> ${Math.round((analysisReport.analysisTime || 0) / 1000)}s</div>
                <div><strong>AI Models:</strong> ${analysisMetadata.aiModelsUsed ? analysisMetadata.aiModelsUsed.length : 0} specialized models</div>
              </div>
            </div>
          </header>

          <section class="technical-summary">
            <h2>📊 Technical Summary</h2>
            <div class="scores-dashboard">
              <div class="score-card security">
                <h3>Security Score</h3>
                <div class="score-display">${safeScores.security}/100</div>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${safeScores.security}%"></div>
                </div>
              </div>
              <div class="score-card gas">
                <h3>Gas Optimization</h3>
                <div class="score-display">${safeScores.gasOptimization}/100</div>
                <div class="score-bar">
                  <div class="score-fill gas-fill" style="width: ${safeScores.gasOptimization}%"></div>
                </div>
              </div>
              <div class="score-card quality">
                <h3>Code Quality</h3>
                <div class="score-display">${safeScores.codeQuality}/100</div>
                <div class="score-bar">
                  <div class="score-fill quality-fill" style="width: ${safeScores.codeQuality}%"></div>
                </div>
              </div>
            </div>
          </section>

          <section class="security-findings">
            <h2>🔍 Security Findings</h2>
            ${generateTechnicalFindings(findings.security)}
          </section>

          <section class="gas-analysis">
            <h2>⚡ Gas Optimization Analysis</h2>
            ${generateGasAnalysisSection(findings.gasOptimization)}
          </section>

          <section class="code-quality">
            <h2>📝 Code Quality Assessment</h2>
            ${generateCodeQualitySection(findings.codeQuality)}
          </section>

          <section class="ai-analysis">
            <h2>🤖 AI Analysis Methodology</h2>
            ${generateAIMethodologySection(analysisMetadata)}
          </section>

          <section class="pattern-analysis">
            <h2>🔎 Pattern Analysis</h2>
            ${generatePatternAnalysisSection(findings.patterns)}
          </section>
        </div>
      </body>
      </html>
    `,
    format: 'html',
    audience: 'technical'
  };
}

/**
 * 📋 STRUCTURED JSON REPORT
 */
function generateStructuredJsonReport(analysisReport) {
  const { executiveSummary = {}, scores = {}, findings = {}, recommendations = [], analysisMetadata = {} } = analysisReport;
  
  return {
    title: `Machine-Readable Analysis - ${analysisReport.contractName}`,
    content: JSON.stringify({
      metadata: {
        reportType: 'smart_contract_security_analysis',
        version: '2.0',
        generatedAt: new Date().toISOString(),
        analysisId: analysisReport.reportId || 'unknown',
        contractName: analysisReport.contractName || 'Unknown Contract',
        analysisTime: analysisReport.analysisTime || 0
      },
      
      executiveSummary: executiveSummary,
      
      scores: {
        overall: scores.overall || 0,
        security: scores.security || 0,
        gasOptimization: scores.gasOptimization || 0,
        codeQuality: scores.codeQuality || 0,
        breakdown: scores.breakdown || {}
      },
      
      findings: {
        security: categorizeSecurityFindings(findings.security || {}),
        gasOptimization: findings.gasOptimization || [],
        codeQuality: findings.codeQuality || [],
        patterns: findings.patterns || []
      },
      
      riskAssessment: {
        overallRisk: executiveSummary.riskLevel || 'Unknown',
        criticalFindings: scores.breakdown?.criticalIssues || 0,
        highFindings: scores.breakdown?.highIssues || 0,
        mediumFindings: scores.breakdown?.mediumIssues || 0,
        riskFactors: identifyRiskFactors(findings.security || {})
      },
      
      recommendations: recommendations,
      
      technicalDetails: {
        aiModelsUsed: analysisMetadata.aiModelsUsed || [],
        supervisorVerification: analysisMetadata.supervisorVerification || 'None',
        consensusScore: analysisMetadata.consensusScore || 0,
        patternMatchingCoverage: analysisMetadata.patternMatchingCoverage || 0
      },
      
      compliance: {
        standards: ['ERC-20', 'ERC-721', 'ERC-1155'],
        bestPractices: evaluateComplianceScore(findings),
        auditStandards: 'Multi-AI Supervised Analysis'
      }
    }, null, 2),
    format: 'json',
    audience: 'api'
  };
}

/**
 * ⚠️ RISK ASSESSMENT MATRIX
 */
function generateRiskAssessmentMatrix(analysisReport) {
  const { findings = {}, scores = {} } = analysisReport;
  const securityFindings = findings.security || {};
  
  const riskMatrix = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: []
  };
  
  // Categorize findings by severity
  Object.values(securityFindings).flat().forEach(finding => {
    if (finding && finding.severity) {
      const severity = finding.severity.toLowerCase();
      if (riskMatrix[severity]) {
        riskMatrix[severity].push({
          title: finding.title || 'Unknown',
          impact: finding.impact || 'Unknown impact',
          likelihood: calculateLikelihood(finding),
          exploitability: finding.exploitability || 'MEDIUM',
          businessImpact: calculateBusinessImpact(finding)
        });
      }
    }
  });
  
  return {
    title: 'Security Risk Assessment Matrix',
    matrix: riskMatrix,
    overallRiskScore: calculateOverallRiskScore(riskMatrix),
    riskTrends: analyzeRiskTrends(riskMatrix),
    prioritization: prioritizeRisks(riskMatrix)
  };
}

/**
 * 📈 REPORT STATISTICS
 */
function generateReportStatistics(analysisReport) {
  const { findings = {}, scores = {}, analysisMetadata = {} } = analysisReport;
  
  const totalFindings = Object.values(findings.security || {}).flat().length;
  const gasOptimizations = (findings.gasOptimization || []).length;
  const qualityIssues = (findings.codeQuality || []).length;
  
  return {
    summary: {
      totalFindings: totalFindings,
      gasOptimizations: gasOptimizations,
      qualityIssues: qualityIssues,
      overallScore: scores.overall || 0,
      analysisTime: analysisReport.analysisTime || 0
    },
    
    findingDistribution: {
      critical: scores.breakdown?.criticalIssues || 0,
      high: scores.breakdown?.highIssues || 0,
      medium: scores.breakdown?.mediumIssues || 0,
      low: totalFindings - (scores.breakdown?.criticalIssues || 0) - (scores.breakdown?.highIssues || 0) - (scores.breakdown?.mediumIssues || 0),
      info: 0
    },
    
    categoryBreakdown: calculateCategoryBreakdown(findings.security || {}),
    
    aiAnalysisStats: {
      modelsUsed: (analysisMetadata.aiModelsUsed || []).length,
      consensusScore: analysisMetadata.consensusScore || 0,
      conflictsResolved: analysisMetadata.conflictsResolved || 0,
      verificationLevel: analysisMetadata.supervisorVerification || 'None'
    },
    
    performanceMetrics: {
      analysisSpeed: Math.round(analysisReport.analysisTime / 1000),
      findingsPerSecond: analysisReport.analysisTime ? (totalFindings / (analysisReport.analysisTime / 1000)).toFixed(2) : '0',
      coverageScore: analysisMetadata.patternMatchingCoverage || 0
    }
  };
}

/**
 * 🎨 HELPER FUNCTIONS FOR REPORT GENERATION
 */

function getRiskLevelClass(riskLevel) {
  const classes = {
    'Safe': 'risk-safe',
    'Low Risk': 'risk-low',
    'Medium Risk': 'risk-medium',
    'High Risk': 'risk-high',
    'Critical Risk': 'risk-critical'
  };
  return classes[riskLevel] || 'risk-unknown';
}

function generateExecutiveFindings(securityFindings) {
  if (!securityFindings) return '<div class="no-critical">✅ No security findings available</div>';
  
  const criticalFindings = Object.values(securityFindings).flat()
    .filter(f => f.severity === 'CRITICAL')
    .slice(0, 5);
  
  if (criticalFindings.length === 0) {
    return '<div class="no-critical">✅ No critical security vulnerabilities identified</div>';
  }
  
  return criticalFindings.map(finding => `
    <div class="executive-finding critical">
      <div class="finding-header">
        <span class="severity-badge critical">CRITICAL</span>
        <h3>${finding.title}</h3>
      </div>
      <p class="finding-impact">${finding.impact}</p>
      <p class="finding-recommendation"><strong>Action Required:</strong> ${finding.recommendation}</p>
    </div>
  `).join('');
}

function generateExecutiveRecommendations(recommendations) {
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return '<div class="no-recommendations">No specific recommendations available</div>';
  }
  
  return recommendations.slice(0, 3).map(rec => `
    <div class="executive-recommendation ${(rec.priority || 'medium').toLowerCase()}">
      <div class="rec-header">
        <span class="priority-badge ${(rec.priority || 'medium').toLowerCase()}">${rec.priority || 'MEDIUM'}</span>
        <h3>${rec.title || 'Recommendation'}</h3>
      </div>
      <p>${rec.description || 'No description available'}</p>
      <div class="rec-details">
        <span class="time-estimate">⏱️ ${rec.estimatedTime || 'Unknown'}</span>
        <span class="impact-description">📈 ${rec.impact || 'Unknown impact'}</span>
      </div>
    </div>
  `).join('');
}

function calculateFinancialRisk(securityFindings) {
  if (!securityFindings) return 'UNKNOWN - Unable to assess financial risk';
  
  const criticalCount = Object.values(securityFindings).flat()
    .filter(f => f.severity === 'CRITICAL').length;
  
  if (criticalCount > 0) {
    return 'HIGH - Critical vulnerabilities could lead to fund loss';
  } else if (Object.values(securityFindings).flat().filter(f => f.severity === 'HIGH').length > 0) {
    return 'MEDIUM - Security issues may impact financial operations';
  } else {
    return 'LOW - Minimal financial risk identified';
  }
}

function calculateOperationalRisk(securityFindings) {
  if (!securityFindings) return 'UNKNOWN - Unable to assess operational risk';
  
  const totalFindings = Object.values(securityFindings).flat().length;
  
  if (totalFindings > 10) {
    return 'HIGH - Multiple issues may disrupt operations';
  } else if (totalFindings > 5) {
    return 'MEDIUM - Some operational considerations needed';
  } else {
    return 'LOW - Minimal operational impact expected';
  }
}

function calculateReputationalRisk(riskLevel) {
  const riskMapping = {
    'Critical Risk': 'HIGH - Serious security issues could damage reputation',
    'High Risk': 'MEDIUM-HIGH - Security concerns may affect public trust',
    'Medium Risk': 'MEDIUM - Some reputational considerations',
    'Low Risk': 'LOW - Minimal reputational impact',
    'Safe': 'VERY LOW - Strong security posture enhances reputation'
  };
  return riskMapping[riskLevel] || 'UNKNOWN';
}

function generateTechnicalFindings(securityFindings) {
  console.log('🔍 generateTechnicalFindings - Input:', securityFindings);
  
  if (!securityFindings) return '<div class="no-findings">✅ No security findings available</div>';
  
  let html = '';
  
  // Handle array of findings directly (new format)
  if (Array.isArray(securityFindings)) {
    if (securityFindings.length === 0) {
      return '<div class="no-findings">✅ No security vulnerabilities identified</div>';
    }
    
    // Group findings by severity
    const groupedFindings = {
      CRITICAL: securityFindings.filter(f => f.severity === 'CRITICAL'),
      HIGH: securityFindings.filter(f => f.severity === 'HIGH'),
      MEDIUM: securityFindings.filter(f => f.severity === 'MEDIUM'),
      LOW: securityFindings.filter(f => f.severity === 'LOW'),
      INFO: securityFindings.filter(f => f.severity === 'INFO' || f.severity === 'INFORMATIONAL')
    };
    
    Object.entries(groupedFindings).forEach(([severity, findings]) => {
      if (findings.length > 0) {
        html += `
          <div class="finding-category">
            <h3>${severity} Severity (${findings.length})</h3>
            <div class="findings-list">
              ${findings.map(finding => generateTechnicalFinding(finding)).join('')}
            </div>
          </div>
        `;
      }
    });
  } 
  // Handle object with categories (legacy format)
  else if (typeof securityFindings === 'object') {
    Object.entries(securityFindings).forEach(([category, findings]) => {
      if (Array.isArray(findings) && findings.length > 0) {
        html += `
          <div class="finding-category">
            <h3>${category} (${findings.length})</h3>
            <div class="findings-list">
              ${findings.map(finding => generateTechnicalFinding(finding)).join('')}
            </div>
          </div>
        `;
      }
    });
  }
  
  return html || '<div class="no-findings">✅ No security vulnerabilities identified</div>';
}

function generateTechnicalFinding(finding) {
  if (!finding) return '';
  
  // Handle location as object or string
  let locationText = 'Unknown location';
  if (finding.location) {
    if (typeof finding.location === 'object') {
      locationText = `${finding.location.contract || 'Unknown'} - ${finding.location.function || 'Unknown function'} (${finding.location.lines || 'Unknown lines'})`;
    } else {
      locationText = finding.location;
    }
  }
  
  // Handle impact as object or string
  let impactText = 'Unknown impact';
  if (finding.impact) {
    if (typeof finding.impact === 'object') {
      impactText = finding.impact.technical || finding.impact.business || finding.impact.financial || 'Unknown impact';
    } else {
      impactText = finding.impact;
    }
  }
  
  // Handle remediation as object or string
  let remediationText = 'No recommendation available';
  if (finding.remediation) {
    if (typeof finding.remediation === 'object') {
      remediationText = finding.remediation.steps ? finding.remediation.steps.join(', ') : finding.remediation.recommendation || 'Review and fix the issue';
    } else {
      remediationText = finding.remediation;
    }
  } else if (finding.recommendation) {
    remediationText = finding.recommendation;
  }
  
  // Handle code evidence
  let codeReference = '';
  if (finding.codeEvidence?.vulnerableCode) {
    codeReference = finding.codeEvidence.vulnerableCode;
  } else if (finding.codeReference) {
    codeReference = finding.codeReference;
  }
  
  return `
    <div class="technical-finding ${(finding.severity || 'unknown').toLowerCase()}">
      <div class="finding-header">
        <span class="severity-badge ${(finding.severity || 'unknown').toLowerCase()}">${finding.severity || 'UNKNOWN'}</span>
        <h4>${finding.title || 'Unknown Issue'}</h4>
        <span class="confidence-badge">${finding.confidence || finding.verified ? 'Verified' : 'Unknown'}</span>
      </div>
      <div class="finding-content">
        <p><strong>Description:</strong> ${finding.description || 'No description available'}</p>
        <p><strong>Location:</strong> ${locationText}</p>
        <p><strong>Impact:</strong> ${impactText}</p>
        <p><strong>Recommendation:</strong> ${remediationText}</p>
        ${codeReference ? `<div class="code-reference"><pre><code>${codeReference}</code></pre></div>` : ''}
        ${finding.reportedBy ? `<p class="reported-by"><strong>Detected by:</strong> ${finding.reportedBy}</p>` : ''}
        ${finding.tool ? `<p class="reported-by"><strong>Tool:</strong> ${finding.tool}</p>` : ''}
      </div>
    </div>
  `;
}

function generateGasAnalysisSection(gasOptimizations) {
  if (!gasOptimizations || !Array.isArray(gasOptimizations) || gasOptimizations.length === 0) {
    return '<div class="no-optimizations">✅ No significant gas optimization opportunities identified</div>';
  }
  
  return `
    <div class="gas-optimizations">
      ${gasOptimizations.map(opt => opt ? `
        <div class="gas-optimization">
          <div class="opt-header">
            <h4>${opt.title || 'Optimization'}</h4>
            <span class="difficulty-badge ${(opt.difficulty || 'medium').toLowerCase()}">${opt.difficulty || 'MEDIUM'}</span>
          </div>
          <p>${opt.description || 'No description available'}</p>
          <div class="savings-info">
            <span class="savings">💰 Savings: ${opt.savings || 'Unknown'}</span>
            <span class="location">📍 ${opt.location || 'Unknown location'}</span>
          </div>
          ${opt.codeExample ? `<div class="code-example"><pre><code>${opt.codeExample}</code></pre></div>` : ''}
        </div>
      ` : '').join('')}
    </div>
  `;
}

function generateCodeQualitySection(qualityIssues) {
  if (!qualityIssues || !Array.isArray(qualityIssues) || qualityIssues.length === 0) {
    return '<div class="high-quality">✅ Code quality meets professional standards</div>';
  }
  
  const groupedIssues = {};
  qualityIssues.forEach(issue => {
    const category = issue.category || 'General';
    if (!groupedIssues[category]) {
      groupedIssues[category] = [];
    }
    groupedIssues[category].push(issue);
  });
  
  return Object.entries(groupedIssues).map(([category, issues]) => `
    <div class="quality-category">
      <h4>${category} (${issues.length})</h4>
      <div class="quality-issues">
        ${issues.map(issue => issue ? `
          <div class="quality-issue ${(issue.severity || 'low').toLowerCase()}">
            <h5>${issue.title || 'Issue'}</h5>
            <p>${issue.description || 'No description available'}</p>
            <p><strong>Recommendation:</strong> ${issue.recommendation || 'No recommendation available'}</p>
          </div>
        ` : '').join('')}
      </div>
    </div>
  `).join('');
}

function generateAIMethodologySection(analysisMetadata) {
  if (!analysisMetadata) {
    return '<div class="no-methodology">ℹ️ AI methodology information not available</div>';
  }
  
  const aiModelsUsed = analysisMetadata.aiModelsUsed || [];
  const consensusScore = analysisMetadata.consensusScore || 0;
  const supervisorVerification = analysisMetadata.supervisorVerification || 'Standard';
  
  return `
    <div class="ai-methodology">
      <div class="methodology-stats">
        <div class="stat">
          <h4>AI Models Used</h4>
          <div class="stat-value">${aiModelsUsed.length}</div>
        </div>
        <div class="stat">
          <h4>Consensus Score</h4>
          <div class="stat-value">${Math.round(consensusScore * 100)}%</div>
        </div>
        <div class="stat">
          <h4>Verification Level</h4>
          <div class="stat-value">${supervisorVerification}</div>
        </div>
      </div>
      
      <div class="models-used">
        <h4>Specialized AI Models</h4>
        <div class="models-grid">
          ${aiModelsUsed.map(model => `
            <div class="model-card">
              <div class="model-name">${model.name || 'Unknown Model'}</div>
              <div class="model-specialty">${model.specialty || 'General Analysis'}</div>
              <div class="model-confidence">${model.confidence || 'Unknown'} confidence</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function generatePatternAnalysisSection(patterns) {
  if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
    return '<div class="no-patterns">ℹ️ No specific vulnerability patterns detected</div>';
  }
  
  return `
    <div class="pattern-analysis">
      ${patterns.map(pattern => pattern ? `
        <div class="pattern-finding">
          <h4>Pattern: ${pattern.pattern || 'Unknown'}</h4>
          <p>${pattern.description || 'No description available'}</p>
          <div class="pattern-details">
            <span class="severity">${pattern.severity || 'Unknown'}</span>
            <span class="location">${pattern.location || 'Unknown location'}</span>
            <span class="confidence">${pattern.confidence || 'Unknown confidence'}</span>
          </div>
        </div>
      ` : '').join('')}
    </div>
  `;
}

function categorizeSecurityFindings(securityFindings) {
  const categorized = {};
  
  Object.entries(securityFindings).forEach(([category, findings]) => {
    categorized[category] = findings.map(finding => ({
      severity: finding.severity,
      title: finding.title,
      description: finding.description,
      location: finding.location,
      impact: finding.impact,
      recommendation: finding.recommendation,
      confidence: finding.confidence,
      reportedBy: finding.reportedBy,
      supervisorVerified: finding.supervisorVerified || false
    }));
  });
  
  return categorized;
}

function identifyRiskFactors(securityFindings) {
  const riskFactors = [];
  const allFindings = Object.values(securityFindings).flat();
  
  const criticalCount = allFindings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = allFindings.filter(f => f.severity === 'HIGH').length;
  
  if (criticalCount > 0) {
    riskFactors.push(`${criticalCount} critical security vulnerabilities`);
  }
  
  if (highCount > 2) {
    riskFactors.push(`Multiple high-severity issues (${highCount})`);
  }
  
  // Check for specific high-risk patterns
  const reentrancyIssues = allFindings.filter(f => 
    f && f.title && f.title.toLowerCase().includes('reentrancy')).length;
  if (reentrancyIssues > 0) {
    riskFactors.push('Reentrancy vulnerability detected');
  }
  
  const accessControlIssues = allFindings.filter(f => 
    f && f.title && (f.title.toLowerCase().includes('access') || 
    f.title.toLowerCase().includes('permission'))).length;
  if (accessControlIssues > 0) {
    riskFactors.push('Access control concerns identified');
  }
  
  return riskFactors;
}

function evaluateComplianceScore(findings) {
  const securityFindings = findings.security || {};
  const totalIssues = Object.values(securityFindings).flat().filter(f => f).length;
  const qualityIssues = Array.isArray(findings.codeQuality) ? findings.codeQuality.length : 0;
  
  let score = 100;
  score -= totalIssues * 5; // Deduct for security issues
  score -= qualityIssues * 2; // Deduct for quality issues
  
  return Math.max(0, Math.min(100, score));
}

function calculateLikelihood(finding) {
  if (!finding || !finding.severity) return 'UNKNOWN';
  // Simple heuristic based on severity and type
  if (finding.severity === 'CRITICAL') return 'HIGH';
  if (finding.severity === 'HIGH') return 'MEDIUM';
  return 'LOW';
}

function calculateBusinessImpact(finding) {
  if (!finding || !finding.severity) return 'Unknown impact';
  
  const impactMap = {
    'CRITICAL': 'Fund loss, protocol failure',
    'HIGH': 'Service disruption, financial loss',
    'MEDIUM': 'Operational issues, user experience degradation',
    'LOW': 'Minor operational concerns',
    'INFO': 'Minimal business impact'
  };
  
  return impactMap[finding.severity] || 'Unknown impact';
}

function calculateOverallRiskScore(riskMatrix) {
  let score = 0;
  score += riskMatrix.critical.length * 25;
  score += riskMatrix.high.length * 15;
  score += riskMatrix.medium.length * 8;
  score += riskMatrix.low.length * 3;
  
  return Math.min(100, score);
}

function analyzeRiskTrends(riskMatrix) {
  const total = riskMatrix.critical.length + riskMatrix.high.length + 
                riskMatrix.medium.length + riskMatrix.low.length;
  
  if (total === 0) return 'No significant risks identified';
  
  const criticalPercent = (riskMatrix.critical.length / total) * 100;
  const highPercent = (riskMatrix.high.length / total) * 100;
  
  if (criticalPercent > 20) return 'High concentration of critical risks';
  if (highPercent > 40) return 'Significant high-risk findings';
  return 'Manageable risk profile';
}

function prioritizeRisks(riskMatrix) {
  const priorities = [];
  
  if (riskMatrix.critical.length > 0) {
    priorities.push({
      priority: 1,
      action: 'Immediate remediation required',
      findings: riskMatrix.critical.length
    });
  }
  
  if (riskMatrix.high.length > 0) {
    priorities.push({
      priority: 2,
      action: 'High-priority remediation',
      findings: riskMatrix.high.length
    });
  }
  
  if (riskMatrix.medium.length > 0) {
    priorities.push({
      priority: 3,
      action: 'Medium-priority improvements',
      findings: riskMatrix.medium.length
    });
  }
  
  return priorities;
}

function calculateCategoryBreakdown(securityFindings) {
  const breakdown = {};
  
  Object.entries(securityFindings).forEach(([category, findings]) => {
    if (Array.isArray(findings)) {
      breakdown[category] = findings.length;
    } else {
      breakdown[category] = 0;
    }
  });
  
  return breakdown;
}

/**
 * 🎨 CSS STYLING FOR REPORTS
 */
function getExecutiveReportCSS() {
  return `
    <style>
      .executive-report {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #333;
        line-height: 1.6;
      }
      
      .executive-header {
        background: white;
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: center;
      }
      
      .company-branding h1 {
        font-size: 2.5em;
        margin: 0;
        color: #2d3748;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      }
      
      .company-branding p {
        font-size: 1.2em;
        color: #718096;
        margin: 10px 0 0 0;
      }
      
      .report-meta {
        text-align: right;
        font-size: 1.1em;
      }
      
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }
      
      .summary-card {
        background: white;
        border-radius: 15px;
        padding: 30px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
      }
      
      .summary-card:hover {
        transform: translateY(-5px);
      }
      
      .risk-safe { border-left: 5px solid #48bb78; }
      .risk-low { border-left: 5px solid #ed8936; }
      .risk-medium { border-left: 5px solid #ed8936; }
      .risk-high { border-left: 5px solid #f56565; }
      .risk-critical { border-left: 5px solid #e53e3e; }
      
      .risk-indicator {
        font-size: 1.8em;
        font-weight: bold;
        margin: 15px 0;
      }
      
      .risk-score {
        font-size: 3em;
        font-weight: bold;
        color: #2d3748;
      }
      
      .score-circle {
        position: relative;
        display: inline-block;
      }
      
      .score-number {
        font-size: 3em;
        font-weight: bold;
        color: #2d3748;
      }
      
      .findings-number, .ai-number {
        font-size: 3em;
        font-weight: bold;
        color: #2d3748;
        margin: 15px 0;
      }
      
      .executive-finding {
        background: white;
        border-radius: 10px;
        padding: 25px;
        margin: 20px 0;
        border-left: 5px solid #e53e3e;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .severity-badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9em;
        color: white;
      }
      
      .severity-badge.critical {
        background: #e53e3e;
      }
      
      .executive-recommendation {
        background: white;
        border-radius: 10px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .priority-badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9em;
        color: white;
      }
      
      .priority-badge.critical { background: #e53e3e; }
      .priority-badge.medium { background: #ed8936; }
      .priority-badge.low { background: #48bb78; }
      
      .impact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }
      
      .impact-card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .executive-footer {
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 20px;
        margin-top: 40px;
        color: white;
        text-align: center;
      }
      
      @media print {
        .executive-report {
          background: white;
          color: black;
        }
        .summary-card, .executive-finding, .executive-recommendation, .impact-card {
          box-shadow: none;
          border: 1px solid #ccc;
        }
      }
    </style>
  `;
}

function getTechnicalReportCSS() {
  return `
    <style>
      .technical-report {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        max-width: 1400px;
        margin: 0 auto;
        padding: 30px;
        background: #1a202c;
        color: #e2e8f0;
        line-height: 1.6;
      }
      
      .tech-header {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        border: 1px solid #4a5568;
        border-radius: 10px;
        padding: 30px;
        margin-bottom: 30px;
      }
      
      .logo-section h1 {
        color: #63b3ed;
        font-size: 2.2em;
        margin: 0;
      }
      
      .analysis-badge {
        display: inline-block;
        background: #805ad5;
        color: white;
        padding: 5px 15px;
        border-radius: 15px;
        font-size: 0.9em;
        margin-top: 10px;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }
      
      .scores-dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }
      
      .score-card {
        background: #2d3748;
        border: 1px solid #4a5568;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
      }
      
      .score-display {
        font-size: 2.5em;
        font-weight: bold;
        color: #63b3ed;
        margin: 15px 0;
      }
      
      .score-bar {
        background: #1a202c;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
      }
      
      .score-fill {
        height: 100%;
        background: #63b3ed;
        transition: width 0.3s ease;
      }
      
      .gas-fill { background: #f6ad55; }
      .quality-fill { background: #68d391; }
      
      .technical-finding {
        background: #2d3748;
        border: 1px solid #4a5568;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
      }
      
      .technical-finding.critical {
        border-left: 4px solid #f56565;
      }
      
      .technical-finding.high {
        border-left: 4px solid #ed8936;
      }
      
      .technical-finding.medium {
        border-left: 4px solid #ecc94b;
      }
      
      .technical-finding.low {
        border-left: 4px solid #48bb78;
      }
      
      .finding-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
      }
      
      .severity-badge {
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.8em;
        font-weight: bold;
      }
      
      .severity-badge.critical { background: #f56565; color: white; }
      .severity-badge.high { background: #ed8936; color: white; }
      .severity-badge.medium { background: #ecc94b; color: black; }
      .severity-badge.low { background: #48bb78; color: white; }
      
      .confidence-badge {
        background: #805ad5;
        color: white;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.8em;
        margin-left: auto;
      }
      
      .code-reference {
        background: #1a202c;
        border: 1px solid #4a5568;
        border-radius: 5px;
        padding: 15px;
        margin: 15px 0;
        overflow-x: auto;
      }
      
      .code-reference pre {
        margin: 0;
        color: #a0aec0;
      }
      
      .reported-by {
        font-size: 0.9em;
        color: #a0aec0;
        font-style: italic;
      }
      
      .gas-optimization {
        background: #2d3748;
        border: 1px solid #4a5568;
        border-left: 4px solid #f6ad55;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
      }
      
      .difficulty-badge {
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.8em;
        font-weight: bold;
      }
      
      .difficulty-badge.easy { background: #48bb78; color: white; }
      .difficulty-badge.medium { background: #ecc94b; color: black; }
      .difficulty-badge.hard { background: #f56565; color: white; }
      
      .savings-info {
        display: flex;
        gap: 20px;
        margin: 10px 0;
        font-size: 0.9em;
      }
      
      .models-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      
      .model-card {
        background: #2d3748;
        border: 1px solid #4a5568;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
      }
      
      .model-name {
        font-weight: bold;
        color: #63b3ed;
        margin-bottom: 5px;
      }
      
      .model-specialty {
        color: #a0aec0;
        font-size: 0.9em;
        margin-bottom: 5px;
      }
      
      .model-confidence {
        color: #68d391;
        font-size: 0.8em;
      }
      
      @media print {
        .technical-report {
          background: white;
          color: black;
        }
        .tech-header, .score-card, .technical-finding, .gas-optimization, .model-card {
          background: white;
          border: 1px solid #ccc;
        }
      }
    </style>
  `;
}

// Export all functions
export {
  generateExecutiveReport,
  generateTechnicalHtmlReport,
  generateStructuredJsonReport,
  generateRiskAssessmentMatrix,
  generateReportStatistics
};
