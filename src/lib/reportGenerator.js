// Enhanced Professional Report Generator for DeFi Watchdog
// Generates premium HTML and JSON reports with detailed findings

/**
 * Generate comprehensive HTML report with professional styling
 */
export function generateHTMLReport(auditResults, contractInfo) {
  const {
    findings,
    scores,
    executiveSummary,
    aiModelsUsed,
    supervisorVerification,
    metadata,
    statistics
  } = auditResults;

  const reportId = `audit-${Date.now()}`;
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Contract Security Audit Report - ${contractInfo?.contractName || 'Contract'}</title>
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #64748b;
            --success-color: #059669;
            --warning-color: #d97706;
            --danger-color: #dc2626;
            --critical-color: #7c2d12;
            --background-color: #ffffff;
            --surface-color: #f8fafc;
            --border-color: #e2e8f0;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--background-color);
            font-size: 14px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
            color: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
        }

        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .header .subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .header .meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .meta-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }

        .meta-label {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .meta-value {
            font-size: 16px;
            font-weight: 600;
        }

        .executive-summary {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .scores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .score-card {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .score-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary-color);
        }

        .score-value {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .score-label {
            font-size: 14px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .risk-level {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .risk-low { background: #dcfce7; color: var(--success-color); }
        .risk-medium { background: #fef3c7; color: var(--warning-color); }
        .risk-high { background: #fee2e2; color: var(--danger-color); }
        .risk-critical { background: #fecaca; color: var(--critical-color); }

        .findings-section {
            margin-bottom: 40px;
        }

        .findings-grid {
            display: grid;
            gap: 20px;
        }

        .finding-card {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .finding-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
        }

        .finding-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            flex: 1;
        }

        .severity-badge {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .severity-critical {
            background: #fecaca;
            color: var(--critical-color);
            border: 1px solid #f87171;
        }

        .severity-high {
            background: #fee2e2;
            color: var(--danger-color);
            border: 1px solid #f87171;
        }

        .severity-medium {
            background: #fef3c7;
            color: var(--warning-color);
            border: 1px solid #fbbf24;
        }

        .severity-low {
            background: #dcfce7;
            color: var(--success-color);
            border: 1px solid #10b981;
        }

        .finding-content {
            padding: 20px;
        }

        .finding-description {
            margin-bottom: 20px;
            line-height: 1.7;
            color: var(--text-primary);
        }

        .finding-section {
            margin-bottom: 20px;
        }

        .finding-section h4 {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .finding-section p, .finding-section li {
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .finding-section ul {
            list-style: none;
            padding-left: 0;
        }

        .finding-section li {
            padding: 5px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .finding-section li:last-child {
            border-bottom: none;
        }

        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.5;
            overflow-x: auto;
            margin: 15px 0;
        }

        .code-block .comment {
            color: #64748b;
        }

        .code-block .keyword {
            color: #3b82f6;
        }

        .impact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }

        .impact-item {
            background: var(--surface-color);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        }

        .impact-label {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 5px;
        }

        .ai-models-section {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }

        .ai-models-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .ai-model-card {
            background: var(--surface-color);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            text-align: center;
        }

        .ai-model-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .ai-model-name {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 5px;
        }

        .ai-model-specialty {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .footer {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin-top: 40px;
        }

        .footer-logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .footer-text {
            color: var(--text-secondary);
            font-size: 14px;
        }

        @media print {
            .container {
                max-width: none;
                padding: 0;
            }
            
            .header {
                break-inside: avoid;
            }
            
            .finding-card {
                break-inside: avoid;
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🛡️ Smart Contract Security Audit Report</h1>
            <div class="subtitle">Professional Security Analysis by DeFi Watchdog</div>
            <div class="meta">
                <div class="meta-item">
                    <div class="meta-label">Contract Name</div>
                    <div class="meta-value">${contractInfo?.contractName || 'Unknown Contract'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Report ID</div>
                    <div class="meta-value">${reportId}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Generated</div>
                    <div class="meta-value">${reportDate}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Analysis Type</div>
                    <div class="meta-value">${metadata?.tier === 'premium' ? 'Premium Multi-AI' : 'Free Multi-AI'}</div>
                </div>
            </div>
        </div>

        <!-- Executive Summary -->
        <div class="executive-summary">
            <h2 class="section-title">📊 Executive Summary</h2>
            
            <div class="scores-grid">
                <div class="score-card">
                    <div class="score-value" style="color: ${getScoreColor(scores?.overall || 75)}">${scores?.overall || 75}</div>
                    <div class="score-label">Overall Score</div>
                </div>
                <div class="score-card">
                    <div class="score-value" style="color: ${getScoreColor(scores?.security || 75)}">${scores?.security || 75}</div>
                    <div class="score-label">Security Score</div>
                </div>
                <div class="score-card">
                    <div class="score-value" style="color: ${getScoreColor(scores?.gasOptimization || 80)}">${scores?.gasOptimization || 80}</div>
                    <div class="score-label">Gas Efficiency</div>
                </div>
                <div class="score-card">
                    <div class="score-value" style="color: ${getScoreColor(scores?.codeQuality || 85)}">${scores?.codeQuality || 85}</div>
                    <div class="score-label">Code Quality</div>
                </div>
            </div>

            <div style="margin: 30px 0;">
                <h3>Risk Assessment</h3>
                <div style="margin: 15px 0;">
                    <span class="risk-level ${getRiskClass(executiveSummary?.riskLevel || 'Medium Risk')}">
                        ${executiveSummary?.riskLevel || 'Medium Risk'}
                    </span>
                </div>
                <p style="margin-top: 15px; font-size: 16px; line-height: 1.7;">
                    ${executiveSummary?.summary || 'Comprehensive security analysis completed.'}
                </p>
            </div>

            ${executiveSummary?.recommendations?.length ? `
            <div style="margin-top: 25px;">
                <h3>Key Recommendations</h3>
                <ul style="margin-top: 15px;">
                    ${executiveSummary.recommendations.map(rec => `<li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">• ${rec}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>

        <!-- Security Findings -->
        ${findings?.security?.length ? `
        <div class="findings-section">
            <h2 class="section-title">🔒 Security Findings</h2>
            <div class="findings-grid">
                ${findings.security.map(finding => `
                <div class="finding-card">
                    <div class="finding-header">
                        <div class="finding-title">${finding.title}</div>
                        <div class="severity-badge severity-${finding.severity?.toLowerCase() || 'medium'}">
                            ${finding.severity || 'MEDIUM'}
                        </div>
                    </div>
                    <div class="finding-content">
                        <div class="finding-description">
                            ${finding.description}
                        </div>
                        
                        ${finding.impact ? `
                        <div class="finding-section">
                            <h4>💥 Impact Assessment</h4>
                            <div class="impact-grid">
                                ${finding.impact.technical ? `
                                <div class="impact-item">
                                    <div class="impact-label">Technical Impact</div>
                                    <div>${finding.impact.technical}</div>
                                </div>
                                ` : ''}
                                ${finding.impact.business ? `
                                <div class="impact-item">
                                    <div class="impact-label">Business Impact</div>
                                    <div>${finding.impact.business}</div>
                                </div>
                                ` : ''}
                                ${finding.impact.financial ? `
                                <div class="impact-item">
                                    <div class="impact-label">Financial Impact</div>
                                    <div>${finding.impact.financial}</div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}

                        ${finding.proofOfConcept ? `
                        <div class="finding-section">
                            <h4>🎯 Proof of Concept</h4>
                            ${finding.proofOfConcept.steps ? `
                            <ul>
                                ${finding.proofOfConcept.steps.map(step => `<li>${step}</li>`).join('')}
                            </ul>
                            ` : ''}
                            ${finding.proofOfConcept.code ? `
                            <div class="code-block">${finding.proofOfConcept.code}</div>
                            ` : ''}
                        </div>
                        ` : ''}

                        ${finding.remediation ? `
                        <div class="finding-section">
                            <h4>🔧 Remediation</h4>
                            <p><strong>Priority:</strong> ${finding.remediation.priority || 'MEDIUM'}</p>
                            ${finding.remediation.effort ? `<p><strong>Effort:</strong> ${finding.remediation.effort}</p>` : ''}
                            ${finding.remediation.secureImplementation ? `
                            <div class="code-block">${finding.remediation.secureImplementation}</div>
                            ` : ''}
                            ${finding.remediation.additionalRecommendations ? `
                            <p><strong>Additional Recommendations:</strong> ${finding.remediation.additionalRecommendations}</p>
                            ` : ''}
                        </div>
                        ` : ''}

                        ${finding.codeReference ? `
                        <div class="finding-section">
                            <h4>📍 Code Reference</h4>
                            ${finding.codeReference.functions ? `<p><strong>Functions:</strong> ${finding.codeReference.functions.join(', ')}</p>` : ''}
                            ${finding.codeReference.lines ? `<p><strong>Lines:</strong> ${finding.codeReference.lines}</p>` : ''}
                            ${finding.codeReference.vulnerableCode ? `
                            <div class="code-block">${finding.codeReference.vulnerableCode}</div>
                            ` : ''}
                        </div>
                        ` : ''}

                        ${finding.cvssScore ? `
                        <div class="finding-section">
                            <h4>📊 CVSS Score</h4>
                            <p><strong>Score:</strong> ${finding.cvssScore.score} (${finding.cvssScore.severity})</p>
                            <p><strong>Vector:</strong> ${finding.cvssScore.vector}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Gas Optimization Findings -->
        ${findings?.gasOptimization?.length ? `
        <div class="findings-section">
            <h2 class="section-title">⚡ Gas Optimization Opportunities</h2>
            <div class="findings-grid">
                ${findings.gasOptimization.map(finding => `
                <div class="finding-card">
                    <div class="finding-header">
                        <div class="finding-title">${finding.title}</div>
                    </div>
                    <div class="finding-content">
                        <div class="finding-description">
                            ${finding.description}
                        </div>
                        
                        ${finding.impact ? `
                        <div class="finding-section">
                            <h4>💰 Gas Savings</h4>
                            ${finding.impact.gasReduction ? `<p><strong>Reduction:</strong> ${finding.impact.gasReduction}</p>` : ''}
                            ${finding.impact.estimatedSavings ? `<p><strong>Estimated Savings:</strong> ${finding.impact.estimatedSavings}</p>` : ''}
                        </div>
                        ` : ''}

                        ${finding.implementation ? `
                        <div class="finding-section">
                            <h4>🛠️ Implementation</h4>
                            <p><strong>Difficulty:</strong> ${finding.implementation.difficulty || 'MEDIUM'}</p>
                            ${finding.implementation.steps ? `<p><strong>Steps:</strong> ${finding.implementation.steps}</p>` : ''}
                            ${finding.implementation.code ? `
                            <div class="code-block">${finding.implementation.code}</div>
                            ` : ''}
                        </div>
                        ` : ''}

                        <div class="finding-section">
                            <h4>💡 Recommendation</h4>
                            <p>${finding.recommendation}</p>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Code Quality Findings -->
        ${findings?.codeQuality?.length ? `
        <div class="findings-section">
            <h2 class="section-title">✨ Code Quality Issues</h2>
            <div class="findings-grid">
                ${findings.codeQuality.map(finding => `
                <div class="finding-card">
                    <div class="finding-header">
                        <div class="finding-title">${finding.title}</div>
                        ${finding.category ? `<div class="severity-badge severity-low">${finding.category}</div>` : ''}
                    </div>
                    <div class="finding-content">
                        <div class="finding-description">
                            ${finding.description}
                        </div>
                        
                        <div class="finding-section">
                            <h4>📈 Impact</h4>
                            <p>${finding.impact}</p>
                        </div>

                        <div class="finding-section">
                            <h4>💡 Recommendation</h4>
                            <p>${finding.recommendation}</p>
                        </div>

                        ${finding.example ? `
                        <div class="finding-section">
                            <h4>📝 Example</h4>
                            <div class="code-block">${finding.example}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- AI Models Used -->
        ${aiModelsUsed?.length ? `
        <div class="ai-models-section">
            <h2 class="section-title">🤖 AI Models Used</h2>
            <div class="ai-models-grid">
                ${aiModelsUsed.map(model => `
                <div class="ai-model-card">
                    <div class="ai-model-icon">🧠</div>
                    <div class="ai-model-name">${model.name}</div>
                    <div class="ai-model-specialty">${model.speciality || model.specialty}</div>
                </div>
                `).join('')}
            </div>
            
            ${supervisorVerification ? `
            <div style="margin-top: 25px; padding: 20px; background: var(--surface-color); border-radius: 8px;">
                <h3>🎯 Supervisor Verification</h3>
                <p><strong>Model:</strong> ${supervisorVerification.model}</p>
                <p><strong>Verified:</strong> ${supervisorVerification.verified ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Confidence Level:</strong> ${supervisorVerification.confidenceLevel}</p>
                ${supervisorVerification.error ? `<p><strong>Error:</strong> ${supervisorVerification.error}</p>` : ''}
            </div>
            ` : ''}
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">🛡️ DeFi Watchdog</div>
            <div class="footer-text">
                Professional Smart Contract Security Analysis<br>
                Report generated on ${reportDate} • ${metadata?.tier === 'premium' ? 'Premium' : 'Free'} Analysis
                ${auditResults.fallbackMode ? '<br><strong>⚠️ Fallback Mode - Manual review recommended</strong>' : ''}
            </div>
        </div>
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * Generate structured JSON report for programmatic access
 */
export function generateJSONReport(auditResults, contractInfo) {
  const reportData = {
    reportInfo: {
      id: `audit-${Date.now()}`,
      version: "3.1",
      generatedAt: new Date().toISOString(),
      generatedBy: "DeFi Watchdog Security Platform",
      reportType: auditResults.metadata?.tier === 'premium' ? 'Premium Multi-AI Security Audit' : 'Free Multi-AI Security Audit'
    },
    
    contractInfo: {
      name: contractInfo?.contractName || 'Unknown Contract',
      address: contractInfo?.address || 'Not specified',
      network: contractInfo?.network || 'Unknown',
      compilerVersion: contractInfo?.compilerVersion || 'Unknown',
      sourceCodeLength: contractInfo?.sourceCode?.length || 0
    },
    
    executiveSummary: {
      overallScore: auditResults.scores?.overall || 75,
      riskLevel: auditResults.executiveSummary?.riskLevel || 'Medium Risk',
      summary: auditResults.executiveSummary?.summary || 'Security analysis completed',
      keyRecommendations: auditResults.executiveSummary?.recommendations || [],
      deploymentRecommendation: auditResults.executiveSummary?.deploymentRecommendation || 'REVIEW_REQUIRED'
    },
    
    scores: {
      overall: auditResults.scores?.overall || 75,
      security: auditResults.scores?.security || 75,
      gasOptimization: auditResults.scores?.gasOptimization || 80,
      codeQuality: auditResults.scores?.codeQuality || 85
    },
    
    statistics: {
      totalFindings: (auditResults.findings?.security?.length || 0) + 
                    (auditResults.findings?.gasOptimization?.length || 0) + 
                    (auditResults.findings?.codeQuality?.length || 0),
      securityFindings: {
        total: auditResults.findings?.security?.length || 0,
        critical: auditResults.findings?.security?.filter(f => f.severity === 'CRITICAL').length || 0,
        high: auditResults.findings?.security?.filter(f => f.severity === 'HIGH').length || 0,
        medium: auditResults.findings?.security?.filter(f => f.severity === 'MEDIUM').length || 0,
        low: auditResults.findings?.security?.filter(f => f.severity === 'LOW').length || 0
      },
      gasOptimizations: auditResults.findings?.gasOptimization?.length || 0,
      codeQualityIssues: auditResults.findings?.codeQuality?.length || 0
    },
    
    findings: {
      security: auditResults.findings?.security || [],
      gasOptimization: auditResults.findings?.gasOptimization || [],
      codeQuality: auditResults.findings?.codeQuality || []
    },
    
    analysisMetadata: {
      aiModelsUsed: auditResults.aiModelsUsed || [],
      supervisorVerification: auditResults.supervisorVerification || {},
      analysisTime: auditResults.metadata?.analysisTime || 0,
      tier: auditResults.metadata?.tier || 'free',
      fallbackMode: auditResults.fallbackMode || false,
      originalError: auditResults.originalError || null
    },
    
    falsePositives: auditResults.falsePositives || [],
    
    disclaimer: {
      text: "This automated security analysis is provided for informational purposes only. It does not constitute a comprehensive security audit and should not be considered as financial or security advice. Always conduct thorough testing and consider professional audits before deploying contracts to mainnet.",
      limitation: "AI-based analysis may produce false positives or miss certain vulnerabilities. Manual review by security experts is recommended for production deployments."
    }
  };

  return JSON.stringify(reportData, null, 2);
}

/**
 * Generate executive summary PDF-ready format
 */
export function generateExecutiveSummary(auditResults, contractInfo) {
  const summary = {
    title: `Executive Security Summary - ${contractInfo?.contractName || 'Contract'}`,
    date: new Date().toLocaleDateString(),
    
    overview: {
      contractName: contractInfo?.contractName || 'Unknown Contract',
      analysisType: auditResults.metadata?.tier === 'premium' ? 'Premium Multi-AI Security Audit' : 'Free Multi-AI Security Audit',
      overallScore: auditResults.scores?.overall || 75,
      riskLevel: auditResults.executiveSummary?.riskLevel || 'Medium Risk',
      totalFindings: (auditResults.findings?.security?.length || 0) + 
                    (auditResults.findings?.gasOptimization?.length || 0) + 
                    (auditResults.findings?.codeQuality?.length || 0)
    },
    
    keyFindings: {
      criticalIssues: auditResults.findings?.security?.filter(f => f.severity === 'CRITICAL').length || 0,
      highRiskIssues: auditResults.findings?.security?.filter(f => f.severity === 'HIGH').length || 0,
      gasOptimizations: auditResults.findings?.gasOptimization?.length || 0,
      codeQualityIssues: auditResults.findings?.codeQuality?.length || 0
    },
    
    recommendations: auditResults.executiveSummary?.recommendations || [
      'Conduct thorough testing in development environment',
      'Consider professional security audit before mainnet deployment',
      'Implement comprehensive monitoring and incident response procedures'
    ],
    
    deploymentRecommendation: auditResults.executiveSummary?.deploymentRecommendation || 'REVIEW_REQUIRED',
    
    nextSteps: [
      'Review all identified findings with development team',
      'Prioritize fixes based on severity and impact',
      'Implement recommended security measures',
      'Conduct additional testing and validation',
      'Consider follow-up analysis after fixes'
    ]
  };

  return summary;
}

// Helper functions
function getScoreColor(score) {
  if (score >= 90) return '#059669'; // green
  if (score >= 80) return '#d97706'; // yellow
  if (score >= 60) return '#dc2626'; // red
  return '#7c2d12'; // dark red
}

function getRiskClass(riskLevel) {
  const level = riskLevel.toLowerCase();
  if (level.includes('low')) return 'risk-low';
  if (level.includes('medium')) return 'risk-medium';
  if (level.includes('high')) return 'risk-high';
  if (level.includes('critical')) return 'risk-critical';
  return 'risk-medium';
}

export default {
  generateHTMLReport,
  generateJSONReport,
  generateExecutiveSummary
};