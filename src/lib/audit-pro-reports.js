// PREMIUM AUDIT PRO REPORT GENERATOR
// Dedicated report generation for multi-AI analysis results

/**
 * Generate comprehensive HTML report for Audit Pro multi-AI analysis
 */
export function generatePremiumMultiAIReport(analysisData) {
  const {
    contractName = 'Smart Contract',
    analysis = {},
    aiReportCards = [],
    categoryAnalysis = {},
    timestamp = new Date().toISOString()
  } = analysisData;

  const {
    keyFindings = [],
    gasOptimizations = [],
    codeQualityIssues = [],
    securityScore = 75,
    gasOptimizationScore = 80,
    codeQualityScore = 85,
    overallScore = 75,
    riskLevel = 'Medium Risk',
    summary = 'Analysis completed'
  } = analysis;

  return {
    title: `Premium Multi-AI Security Analysis - ${contractName}`,
    content: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Multi-AI Security Analysis - ${contractName}</title>
    ${getPremiumReportCSS()}
</head>
<body>
    <div class="premium-report">
        <!-- Header Section -->
        <header class="report-header">
            <div class="header-content">
                <div class="logo-section">
                    <h1>🛡️ DeFi Watchdog Premium Analysis</h1>
                    <div class="premium-badge">Multi-AI Security Analysis</div>
                </div>
                <div class="contract-info">
                    <h2>${contractName}</h2>
                    <div class="meta-info">
                        <span>📅 ${new Date(timestamp).toLocaleDateString()}</span>
                        <span>🤖 ${aiReportCards.length} AI Specialists</span>
                        <span>📊 Risk Level: ${riskLevel}</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Executive Dashboard -->
        <section class="executive-dashboard">
            <h2>📊 Executive Dashboard</h2>
            <div class="dashboard-grid">
                <div class="score-card security">
                    <div class="score-header">
                        <span class="icon">🛡️</span>
                        <span class="label">Security Score</span>
                    </div>
                    <div class="score-value">${securityScore}</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${securityScore}%"></div>
                    </div>
                    <div class="score-findings">${keyFindings.length} findings</div>
                </div>
                
                <div class="score-card gas">
                    <div class="score-header">
                        <span class="icon">⚡</span>
                        <span class="label">Gas Optimization</span>
                    </div>
                    <div class="score-value">${gasOptimizationScore}</div>
                    <div class="score-bar">
                        <div class="score-fill gas-fill" style="width: ${gasOptimizationScore}%"></div>
                    </div>
                    <div class="score-findings">${gasOptimizations.length} optimizations</div>
                </div>
                
                <div class="score-card quality">
                    <div class="score-header">
                        <span class="icon">✨</span>
                        <span class="label">Code Quality</span>
                    </div>
                    <div class="score-value">${codeQualityScore}</div>
                    <div class="score-bar">
                        <div class="score-fill quality-fill" style="width: ${codeQualityScore}%"></div>
                    </div>
                    <div class="score-findings">${codeQualityIssues.length} issues</div>
                </div>
                
                <div class="score-card overall">
                    <div class="score-header">
                        <span class="icon">🎯</span>
                        <span class="label">Overall Score</span>
                    </div>
                    <div class="score-value">${overallScore}</div>
                    <div class="score-bar">
                        <div class="score-fill overall-fill" style="width: ${overallScore}%"></div>
                    </div>
                    <div class="score-findings">${getRiskLabel(overallScore)}</div>
                </div>
            </div>
        </section>

        <!-- AI Specialists Section -->
        <section class="ai-specialists">
            <h2>🤖 AI Specialist Reports</h2>
            <div class="specialists-grid">
                ${generateAISpecialistCards(aiReportCards)}
            </div>
        </section>

        <!-- Security Findings Section -->
        <section class="security-findings">
            <h2>🛡️ Security Analysis (${keyFindings.length} findings)</h2>
            ${generateSecurityFindings(keyFindings)}
        </section>

        <!-- Gas Optimization Section -->
        <section class="gas-optimizations">
            <h2>⚡ Gas Optimization Opportunities (${gasOptimizations.length} optimizations)</h2>
            ${generateGasOptimizations(gasOptimizations)}
        </section>

        <!-- Code Quality Section -->
        <section class="code-quality">
            <h2>✨ Code Quality Assessment (${codeQualityIssues.length} issues)</h2>
            ${generateCodeQualityIssues(codeQualityIssues)}
        </section>

        <!-- Executive Summary -->
        <section class="executive-summary">
            <h2>📋 Executive Summary</h2>
            <div class="summary-content">
                <p>${summary}</p>
                <div class="recommendations">
                    <h3>Key Recommendations:</h3>
                    <ul>
                        ${generateRecommendations(keyFindings, gasOptimizations, codeQualityIssues)}
                    </ul>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="report-footer">
            <div class="footer-content">
                <p>Generated by DeFi Watchdog Premium Multi-AI Analysis</p>
                <p>Report generated on ${new Date(timestamp).toLocaleString()}</p>
                <p>🤖 Powered by ${aiReportCards.length} specialized AI security models</p>
            </div>
        </footer>
    </div>
</body>
</html>
    `,
    format: 'html',
    type: 'premium-multi-ai'
  };
}

/**
 * Generate JSON report for Audit Pro
 */
export function generatePremiumMultiAIJsonReport(analysisData) {
  const timestamp = new Date().toISOString();
  
  const report = {
    reportType: 'premium-multi-ai-analysis',
    metadata: {
      contractName: analysisData.contractName || 'Smart Contract',
      generatedAt: timestamp,
      reportVersion: '2.0',
      analysisEngine: 'DeFi Watchdog Premium Multi-AI',
      totalAIModels: analysisData.aiReportCards?.length || 0
    },
    executiveSummary: {
      overallScore: analysisData.analysis?.overallScore || 75,
      securityScore: analysisData.analysis?.securityScore || 75,
      gasOptimizationScore: analysisData.analysis?.gasOptimizationScore || 80,
      codeQualityScore: analysisData.analysis?.codeQualityScore || 85,
      riskLevel: analysisData.analysis?.riskLevel || 'Medium Risk',
      totalFindings: {
        security: analysisData.analysis?.keyFindings?.length || 0,
        gasOptimization: analysisData.analysis?.gasOptimizations?.length || 0,
        codeQuality: analysisData.analysis?.codeQualityIssues?.length || 0
      },
      deploymentRecommendation: getDeploymentRecommendation(analysisData.analysis?.overallScore || 75)
    },
    aiSpecialists: analysisData.aiReportCards?.map(card => ({
      id: card.id,
      name: card.name,
      specialty: card.specialty,
      confidence: card.confidence,
      status: card.status,
      findingsCount: card.findings?.length || 0,
      keyFindings: card.findings?.map(f => ({
        severity: f.severity,
        title: f.title,
        description: f.description
      })) || []
    })) || [],
    detailedFindings: {
      security: analysisData.analysis?.keyFindings?.map((finding, index) => ({
        id: `SEC-${String(index + 1).padStart(3, '0')}`,
        severity: finding.severity,
        title: finding.title,
        description: finding.description,
        location: finding.location,
        impact: finding.impact,
        recommendation: finding.recommendation,
        aiModel: finding.aiModel || 'Multi-AI Consensus'
      })) || [],
      gasOptimization: analysisData.analysis?.gasOptimizations?.map((opt, index) => ({
        id: `GAS-${String(index + 1).padStart(3, '0')}`,
        title: opt.title,
        description: opt.description,
        location: opt.location,
        estimatedSavings: opt.impact?.gasReduction || opt.savings || 'Unknown',
        difficulty: opt.implementation?.difficulty || 'MEDIUM',
        aiModel: opt.aiModel || 'GasOptimizer AI'
      })) || [],
      codeQuality: analysisData.analysis?.codeQualityIssues?.map((issue, index) => ({
        id: `QUAL-${String(index + 1).padStart(3, '0')}`,
        category: issue.category,
        title: issue.title,
        description: issue.description,
        impact: issue.impact,
        recommendation: issue.recommendation,
        aiModel: issue.aiModel || 'CodeReview AI'
      })) || []
    },
    categoryAnalysis: analysisData.categoryAnalysis || {},
    analysisMetadata: {
      analysisTime: analysisData.analysisTime || 0,
      timestamp: timestamp,
      sourceCodeLength: analysisData.sourceCodeLength || 0,
      multiAiConsensus: true,
      enhancedAnalysis: true
    }
  };
  
  return {
    title: `Premium Multi-AI Analysis - ${analysisData.contractName || 'Contract'}`,
    content: JSON.stringify(report, null, 2),
    format: 'json',
    type: 'premium-multi-ai'
  };
}

/**
 * Generate PDF-ready HTML content
 */
export function generatePremiumMultiAIPdfReport(analysisData) {
  const htmlReport = generatePremiumMultiAIReport(analysisData);
  
  // Modify CSS for better PDF rendering
  const pdfContent = htmlReport.content.replace(
    getPremiumReportCSS(),
    getPremiumReportCSS() + getPdfSpecificCSS()
  );
  
  return {
    ...htmlReport,
    content: pdfContent,
    format: 'pdf',
    type: 'premium-multi-ai'
  };
}

// Helper functions

function generateAISpecialistCards(aiReportCards) {
  if (!aiReportCards || aiReportCards.length === 0) {
    return '<div class="no-specialists">No AI specialist data available</div>';
  }
  
  return aiReportCards.map(card => `
    <div class="specialist-card">
      <div class="card-header">
        <span class="specialist-icon">${card.icon || '🤖'}</span>
        <div class="specialist-info">
          <h3>${card.name}</h3>
          <p>${card.specialty}</p>
        </div>
        <div class="confidence-badge">${card.confidence || 0}%</div>
      </div>
      <div class="card-content">
        <div class="specialist-stats">
          <div class="stat">
            <span class="stat-value">${card.findings?.length || 0}</span>
            <span class="stat-label">Findings</span>
          </div>
          <div class="stat">
            <span class="stat-value">${card.status === 'completed' ? '✅' : '⏳'}</span>
            <span class="stat-label">Status</span>
          </div>
        </div>
        <div class="specialist-findings">
          ${(card.findings || []).slice(0, 3).map(finding => `
            <div class="finding-preview ${(finding.severity || finding.impact || 'medium').toLowerCase()}">
              <span class="finding-title">${finding.title}</span>
              <span class="finding-severity">${finding.severity || finding.impact || 'MEDIUM'}</span>
            </div>
          `).join('')}
          ${card.findings?.length > 3 ? `<div class="more-findings">+${card.findings.length - 3} more</div>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function generateSecurityFindings(findings) {
  if (!findings || findings.length === 0) {
    return `
      <div class="no-findings">
        <div class="celebration-icon">🎉</div>
        <h3>No Security Vulnerabilities Detected!</h3>
        <p>Our multi-AI analysis found no significant security issues in this contract.</p>
      </div>
    `;
  }
  
  // Group by severity
  const grouped = {
    CRITICAL: findings.filter(f => f.severity === 'CRITICAL'),
    HIGH: findings.filter(f => f.severity === 'HIGH'),
    MEDIUM: findings.filter(f => f.severity === 'MEDIUM'),
    LOW: findings.filter(f => f.severity === 'LOW'),
    INFO: findings.filter(f => f.severity === 'INFO')
  };
  
  return Object.entries(grouped)
    .filter(([_, items]) => items.length > 0)
    .map(([severity, items]) => `
      <div class="severity-group ${severity.toLowerCase()}">
        <h3>${severity} Severity (${items.length})</h3>
        <div class="findings-list">
          ${items.map((finding, index) => `
            <div class="finding-item">
              <div class="finding-header">
                <h4>${finding.title}</h4>
                <span class="severity-badge ${severity.toLowerCase()}">${severity}</span>
              </div>
              <div class="finding-content">
                <p><strong>Description:</strong> ${finding.description}</p>
                <p><strong>Location:</strong> ${finding.location || 'Not specified'}</p>
                <p><strong>Impact:</strong> ${finding.impact || 'Not specified'}</p>
                <p><strong>Recommendation:</strong> ${finding.recommendation || 'Review and address this issue'}</p>
                ${finding.aiModel ? `<p class="ai-model"><strong>Detected by:</strong> ${finding.aiModel}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
}

function generateGasOptimizations(optimizations) {
  if (!optimizations || optimizations.length === 0) {
    return `
      <div class="no-optimizations">
        <div class="icon">⚡</div>
        <h3>No Gas Optimizations Identified</h3>
        <p>The contract appears to be well-optimized for gas efficiency.</p>
      </div>
    `;
  }
  
  return `
    <div class="optimizations-list">
      ${optimizations.map((opt, index) => `
        <div class="optimization-item">
          <div class="optimization-header">
            <h4>${opt.title}</h4>
            <span class="savings-badge">${opt.impact?.gasReduction || opt.savings || 'Unknown'}</span>
          </div>
          <div class="optimization-content">
            <p><strong>Description:</strong> ${opt.description}</p>
            <p><strong>Location:</strong> ${opt.location || 'Not specified'}</p>
            <p><strong>Implementation:</strong> ${opt.implementation?.steps?.join(', ') || opt.implementation || 'See description'}</p>
            <p><strong>Difficulty:</strong> ${opt.implementation?.difficulty || 'MEDIUM'}</p>
            ${opt.aiModel ? `<p class="ai-model"><strong>Suggested by:</strong> ${opt.aiModel}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function generateCodeQualityIssues(issues) {
  if (!issues || issues.length === 0) {
    return `
      <div class="no-issues">
        <div class="icon">✨</div>
        <h3>Code Quality Meets Standards</h3>
        <p>No significant code quality issues were identified.</p>
      </div>
    `;
  }
  
  return `
    <div class="quality-issues-list">
      ${issues.map((issue, index) => `
        <div class="quality-item">
          <div class="quality-header">
            <h4>${issue.title}</h4>
            <span class="impact-badge ${(issue.impact || 'medium').toLowerCase()}">${issue.impact || 'MEDIUM'}</span>
          </div>
          <div class="quality-content">
            <p><strong>Category:</strong> ${issue.category || 'General'}</p>
            <p><strong>Description:</strong> ${issue.description}</p>
            <p><strong>Recommendation:</strong> ${issue.recommendation || 'Follow best practices'}</p>
            ${issue.aiModel ? `<p class="ai-model"><strong>Identified by:</strong> ${issue.aiModel}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function generateRecommendations(securityFindings, gasOptimizations, codeQualityIssues) {
  const recommendations = [];
  
  // Security recommendations
  const criticalFindings = securityFindings.filter(f => f.severity === 'CRITICAL').length;
  const highFindings = securityFindings.filter(f => f.severity === 'HIGH').length;
  
  if (criticalFindings > 0) {
    recommendations.push(`<li><strong>IMMEDIATE:</strong> Address ${criticalFindings} critical security issue${criticalFindings > 1 ? 's' : ''} before deployment</li>`);
  }
  
  if (highFindings > 0) {
    recommendations.push(`<li><strong>HIGH PRIORITY:</strong> Fix ${highFindings} high-severity security issue${highFindings > 1 ? 's' : ''}</li>`);
  }
  
  // Gas optimization recommendations
  if (gasOptimizations.length > 0) {
    recommendations.push(`<li><strong>OPTIMIZATION:</strong> Implement ${gasOptimizations.length} gas optimization${gasOptimizations.length > 1 ? 's' : ''} to reduce costs</li>`);
  }
  
  // Code quality recommendations
  if (codeQualityIssues.length > 0) {
    recommendations.push(`<li><strong>QUALITY:</strong> Improve ${codeQualityIssues.length} code quality issue${codeQualityIssues.length > 1 ? 's' : ''} for better maintainability</li>`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('<li><strong>EXCELLENT:</strong> Contract meets high security and quality standards</li>');
  }
  
  return recommendations.join('');
}

function getRiskLabel(score) {
  if (score >= 80) return 'Low Risk';
  if (score >= 60) return 'Medium Risk';
  if (score >= 40) return 'High Risk';
  return 'Critical Risk';
}

function getDeploymentRecommendation(score) {
  if (score >= 80) return 'APPROVED_FOR_DEPLOYMENT';
  if (score >= 60) return 'REQUIRES_REVIEW';
  return 'NOT_RECOMMENDED';
}

function getPremiumReportCSS() {
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #2d3748;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }
      
      .premium-report {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        overflow: hidden;
        margin-top: 20px;
        margin-bottom: 20px;
      }
      
      .report-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px;
        text-align: center;
      }
      
      .header-content h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        font-weight: 700;
      }
      
      .premium-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
      }
      
      .contract-info h2 {
        font-size: 2rem;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .meta-info {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
        font-size: 1rem;
        opacity: 0.9;
      }
      
      .executive-dashboard {
        padding: 40px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .executive-dashboard h2 {
        font-size: 1.8rem;
        margin-bottom: 30px;
        color: #2d3748;
        text-align: center;
      }
      
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
      }
      
      .score-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #e2e8f0;
        transition: transform 0.2s ease;
      }
      
      .score-card:hover {
        transform: translateY(-2px);
      }
      
      .score-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .score-header .icon {
        font-size: 1.5rem;
        margin-right: 10px;
      }
      
      .score-header .label {
        font-size: 0.9rem;
        color: #64748b;
        font-weight: 500;
      }
      
      .score-value {
        font-size: 3rem;
        font-weight: 700;
        color: #3b82f6;
        margin-bottom: 15px;
      }
      
      .score-bar {
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
      }
      
      .score-fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.5s ease;
      }
      
      .gas-fill { background: #f59e0b; }
      .quality-fill { background: #10b981; }
      .overall-fill { background: #8b5cf6; }
      
      .score-findings {
        font-size: 0.9rem;
        color: #64748b;
      }
      
      .ai-specialists {
        padding: 40px;
      }
      
      .ai-specialists h2 {
        font-size: 1.8rem;
        margin-bottom: 30px;
        color: #2d3748;
        text-align: center;
      }
      
      .specialists-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
      }
      
      .specialist-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      
      .card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .specialist-icon {
        font-size: 2rem;
        margin-right: 15px;
      }
      
      .specialist-info h3 {
        font-size: 1.2rem;
        margin-bottom: 5px;
      }
      
      .specialist-info p {
        font-size: 0.9rem;
        opacity: 0.9;
      }
      
      .confidence-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      
      .card-content {
        padding: 20px;
      }
      
      .specialist-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .stat {
        text-align: center;
      }
      
      .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #3b82f6;
        margin-bottom: 5px;
      }
      
      .stat-label {
        font-size: 0.8rem;
        color: #64748b;
      }
      
      .finding-preview {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        margin-bottom: 8px;
        border-radius: 6px;
        font-size: 0.85rem;
      }
      
      .finding-preview.critical { background: #fef2f2; border-left: 3px solid #dc2626; }
      .finding-preview.high { background: #fff7ed; border-left: 3px solid #ea580c; }
      .finding-preview.medium { background: #fefce8; border-left: 3px solid #ca8a04; }
      .finding-preview.low { background: #f0f9ff; border-left: 3px solid #0284c7; }
      
      .finding-severity {
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        font-weight: 600;
      }
      
      .more-findings {
        text-align: center;
        font-size: 0.8rem;
        color: #64748b;
        font-style: italic;
      }
      
      .security-findings, .gas-optimizations, .code-quality, .executive-summary {
        padding: 40px;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .security-findings h2, .gas-optimizations h2, .code-quality h2, .executive-summary h2 {
        font-size: 1.8rem;
        margin-bottom: 30px;
        color: #2d3748;
      }
      
      .no-findings, .no-optimizations, .no-issues {
        text-align: center;
        padding: 60px 20px;
        background: #f8fafc;
        border-radius: 15px;
        border: 2px dashed #cbd5e1;
      }
      
      .celebration-icon, .no-findings .icon, .no-optimizations .icon, .no-issues .icon {
        font-size: 4rem;
        margin-bottom: 20px;
      }
      
      .no-findings h3, .no-optimizations h3, .no-issues h3 {
        font-size: 1.5rem;
        color: #059669;
        margin-bottom: 10px;
      }
      
      .severity-group {
        margin-bottom: 30px;
      }
      
      .severity-group h3 {
        font-size: 1.3rem;
        margin-bottom: 20px;
        padding: 10px 0;
        border-bottom: 2px solid #e2e8f0;
      }
      
      .finding-item, .optimization-item, .quality-item {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        margin-bottom: 20px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      
      .finding-header, .optimization-header, .quality-header {
        background: #f8fafc;
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .finding-header h4, .optimization-header h4, .quality-header h4 {
        font-size: 1.1rem;
        color: #2d3748;
      }
      
      .severity-badge {
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }
      
      .severity-badge.critical { background: #dc2626; color: white; }
      .severity-badge.high { background: #ea580c; color: white; }
      .severity-badge.medium { background: #ca8a04; color: white; }
      .severity-badge.low { background: #0284c7; color: white; }
      .severity-badge.info { background: #64748b; color: white; }
      
      .savings-badge, .impact-badge {
        background: #10b981;
        color: white;
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .impact-badge.high { background: #dc2626; }
      .impact-badge.medium { background: #ca8a04; }
      .impact-badge.low { background: #0284c7; }
      
      .finding-content, .optimization-content, .quality-content {
        padding: 20px;
      }
      
      .finding-content p, .optimization-content p, .quality-content p {
        margin-bottom: 12px;
        line-height: 1.6;
      }
      
      .ai-model {
        font-size: 0.85rem;
        color: #6366f1;
        font-style: italic;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e2e8f0;
      }
      
      .summary-content {
        background: #f8fafc;
        padding: 30px;
        border-radius: 15px;
        border: 1px solid #e2e8f0;
      }
      
      .summary-content p {
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 25px;
        color: #374151;
      }
      
      .recommendations h3 {
        font-size: 1.2rem;
        color: #2d3748;
        margin-bottom: 15px;
      }
      
      .recommendations ul {
        list-style: none;
        margin-left: 0;
      }
      
      .recommendations li {
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 1rem;
        line-height: 1.6;
      }
      
      .recommendations li:last-child {
        border-bottom: none;
      }
      
      .report-footer {
        background: #2d3748;
        color: white;
        padding: 30px;
        text-align: center;
      }
      
      .footer-content p {
        margin-bottom: 8px;
        opacity: 0.9;
      }
      
      @media (max-width: 768px) {
        .premium-report {
          margin: 10px;
          border-radius: 10px;
        }
        
        .report-header {
          padding: 25px 20px;
        }
        
        .header-content h1 {
          font-size: 2rem;
        }
        
        .contract-info h2 {
          font-size: 1.5rem;
        }
        
        .meta-info {
          flex-direction: column;
          gap: 10px;
        }
        
        .dashboard-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .specialists-grid {
          grid-template-columns: 1fr;
        }
        
        .specialist-stats {
          flex-direction: column;
          gap: 15px;
        }
        
        .finding-header, .optimization-header, .quality-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
      }
    </style>
  `;
}

function getPdfSpecificCSS() {
  return `
    <style>
      @media print {
        body {
          background: white !important;
        }
        
        .premium-report {
          box-shadow: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
        }
        
        .score-card:hover {
          transform: none !important;
        }
        
        .finding-item, .optimization-item, .quality-item {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        .ai-specialists {
          page-break-before: always;
        }
        
        .security-findings {
          page-break-before: always;
        }
      }
    </style>
  `;
}

export default {
  generatePremiumMultiAIReport,
  generatePremiumMultiAIJsonReport,
  generatePremiumMultiAIPdfReport
};
