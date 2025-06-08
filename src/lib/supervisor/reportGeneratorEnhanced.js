// Enhanced Report Generator - Handles new audit data format properly
import { 
  generateExecutiveReport as origGenerateExecutiveReport,
  generateStructuredJsonReport as origGenerateStructuredJsonReport,
  generateRiskAssessmentMatrix,
  generateReportStatistics
} from './reportGenerator.js';

// Export the original functions we don't need to modify
export { 
  generateRiskAssessmentMatrix, 
  generateReportStatistics
} from './reportGenerator.js';

// Enhanced Executive Report
export function generateExecutiveReport(analysisReport) {
  // Convert new format to legacy format if needed
  const convertedReport = convertAuditDataFormat(analysisReport);
  return origGenerateExecutiveReport(convertedReport);
}

// Enhanced JSON Report
export function generateStructuredJsonReport(analysisReport) {
  // Convert new format to legacy format if needed  
  const convertedReport = convertAuditDataFormat(analysisReport);
  return origGenerateStructuredJsonReport(convertedReport);
}

// Enhanced Technical HTML Report with proper data handling
export function generateTechnicalHtmlReport(analysisReport) {
  console.log('📊 Enhanced generateTechnicalHtmlReport - Input data:', JSON.stringify(analysisReport, null, 2));
  
  // Convert the audit data format
  const convertedReport = convertAuditDataFormat(analysisReport);
  
  const { 
    findings = {}, 
    scores = {}, 
    analysisMetadata = {},
    executiveSummary = {},
    contractName = 'Unknown Contract',
    analysisDate = new Date().toISOString()
  } = convertedReport;
  
  // Ensure all required fields have defaults
  const safeScores = {
    overall: scores.overall || 0,
    security: scores.security || 0,
    gasOptimization: scores.gasOptimization || 0,
    codeQuality: scores.codeQuality || 0,
    breakdown: scores.breakdown || {}
  };
  
  return {
    title: `Technical Security Analysis - ${contractName}`,
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Technical Security Analysis - ${contractName}</title>
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
              <h2>${contractName}</h2>
              <div class="info-grid">
                <div><strong>Analysis Date:</strong> ${new Date(analysisDate).toLocaleString()}</div>
                <div><strong>Report Version:</strong> ${convertedReport.reportVersion || '1.0'}</div>
                <div><strong>Analysis Time:</strong> ${Math.round((convertedReport.analysisTime || 0) / 1000)}s</div>
                <div><strong>AI Models:</strong> ${analysisMetadata.auditorInfo?.models?.length || 0} specialized models</div>
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
            ${generateEnhancedTechnicalFindings(findings.security)}
          </section>

          <section class="gas-analysis">
            <h2>⚡ Gas Optimization Analysis</h2>
            ${generateEnhancedGasAnalysisSection(findings.gasOptimization)}
          </section>

          <section class="code-quality">
            <h2>📝 Code Quality Assessment</h2>
            ${generateEnhancedCodeQualitySection(findings.codeQuality)}
          </section>

          <section class="ai-analysis">
            <h2>🤖 AI Analysis Methodology</h2>
            ${generateEnhancedAIMethodologySection(analysisMetadata)}
          </section>

          <section class="pattern-analysis">
            <h2>🔎 Pattern Analysis</h2>
            ${generateEnhancedPatternAnalysisSection(findings.patterns)}
          </section>
        </div>
      </body>
      </html>
    `,
    format: 'html',
    audience: 'technical'
  };
}

// Convert new audit data format to legacy format
function convertAuditDataFormat(analysisReport) {
  // If already in legacy format, return as-is
  if (analysisReport.findings && !analysisReport.securityFindings) {
    return analysisReport;
  }
  
  console.log('🔄 Converting audit data format...');
  
  const converted = {
    ...analysisReport,
    findings: {
      security: analysisReport.securityFindings || [],
      gasOptimization: analysisReport.gasOptimizations || [],
      codeQuality: analysisReport.codeQualityIssues || [],
      patterns: []
    },
    scores: {},
    analysisMetadata: analysisReport.auditMetadata || {},
    contractName: analysisReport.metadata?.contractName || analysisReport.contractName || 'Unknown Contract',
    analysisDate: analysisReport.metadata?.generatedAt || analysisReport.analysisDate || new Date().toISOString()
  };
  
  // Detect if this is a tools-only scan or AI scan
  const isToolsOnlyScan = analysisReport.auditMetadata?.auditorInfo?.lead === 'Static Analysis Tools' ||
                          (!analysisReport.aiModel && analysisReport.securityFindings?.some(f => f.tool && !f.reportedBy?.includes('AI')));
  
  // Update metadata based on scan type
  if (isToolsOnlyScan) {
    // For tools-only scans, remove AI-related metadata
    converted.analysisMetadata = {
      ...converted.analysisMetadata,
      auditorInfo: {
        lead: 'Static Analysis Tools',
        models: [], // No AI models for tools-only scan
        supervisor: undefined
      },
      methodologies: [
        'Static Analysis',
        'Pattern Matching',
        'Security Tool Scanning'
      ],
      toolsUsed: analysisReport.securityFindings?.reduce((tools, finding) => {
        if (finding.tool && !tools.includes(finding.tool)) {
          tools.push(finding.tool);
        }
        return tools;
      }, []) || ['Pattern Matcher', 'Static Analyzer'],
      isAIScan: false
    };
  } else if (analysisReport.aiModel) {
    // For free AI scans, update metadata with actual model used
    converted.analysisMetadata = {
      ...converted.analysisMetadata,
      aiModel: analysisReport.aiModel,
      isAIScan: true,
      auditorInfo: {
        lead: 'AI Analysis',
        models: [], // Will be handled by generateEnhancedAIMethodologySection
        supervisor: undefined
      },
      methodologies: [
        'AI Security Analysis',
        'Vulnerability Detection',
        'Code Review'
      ]
    };
  }
  
  // Convert scores from executiveSummary
  if (analysisReport.executiveSummary) {
    converted.scores = {
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
    converted.executiveSummary = analysisReport.executiveSummary;
  }
  
  return converted;
}

// Enhanced finding renderer
function generateEnhancedTechnicalFindings(securityFindings) {
  console.log('🔍 generateEnhancedTechnicalFindings - Input:', securityFindings);
  
  if (!securityFindings || (Array.isArray(securityFindings) && securityFindings.length === 0)) {
    return '<div class="no-findings">✅ No security vulnerabilities identified</div>';
  }
  
  let html = '';
  
  // Group findings by severity
  const groupedFindings = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
    INFO: []
  };
  
  const findingsArray = Array.isArray(securityFindings) ? securityFindings : Object.values(securityFindings).flat();
  
  findingsArray.forEach(finding => {
    if (finding && finding.severity) {
      const severity = finding.severity.toUpperCase();
      if (groupedFindings[severity]) {
        groupedFindings[severity].push(finding);
      }
    }
  });
  
  Object.entries(groupedFindings).forEach(([severity, findings]) => {
    if (findings.length > 0) {
      html += `
        <div class="finding-category">
          <h3>${severity} Severity (${findings.length})</h3>
          <div class="findings-list">
            ${findings.map(finding => generateEnhancedTechnicalFinding(finding)).join('')}
          </div>
        </div>
      `;
    }
  });
  
  return html || '<div class="no-findings">✅ No security vulnerabilities identified</div>';
}

// Enhanced finding item renderer
function generateEnhancedTechnicalFinding(finding) {
  if (!finding) return '';
  
  // Extract location text
  let locationText = 'Unknown location';
  if (finding.location) {
    if (typeof finding.location === 'object') {
      locationText = `${finding.location.contract || 'Unknown'} - ${finding.location.function || 'Unknown function'} (${finding.location.lines || 'Unknown lines'})`;
    } else {
      locationText = finding.location;
    }
  }
  
  // Extract impact text
  let impactText = 'Unknown impact';
  if (finding.impact) {
    if (typeof finding.impact === 'object') {
      impactText = finding.impact.technical || finding.impact.business || finding.impact.financial || 'Unknown impact';
    } else {
      impactText = finding.impact;
    }
  }
  
  // Extract remediation text
  let remediationText = 'No recommendation available';
  if (finding.remediation) {
    if (typeof finding.remediation === 'object') {
      if (finding.remediation.steps && Array.isArray(finding.remediation.steps)) {
        remediationText = finding.remediation.steps.join(', ');
      } else {
        remediationText = finding.remediation.recommendation || 'Review and fix the issue';
      }
    } else {
      remediationText = finding.remediation;
    }
  } else if (finding.recommendation) {
    remediationText = finding.recommendation;
  }
  
  // Extract code reference
  let codeReference = '';
  if (finding.codeEvidence?.vulnerableCode) {
    codeReference = finding.codeEvidence.vulnerableCode;
  } else if (finding.codeReference) {
    codeReference = finding.codeReference;
  }
  
  const confidence = finding.confidence || (finding.verified ? 'Verified' : 'Medium');
  
  return `
    <div class="technical-finding ${(finding.severity || 'unknown').toLowerCase()}">
      <div class="finding-header">
        <span class="severity-badge ${(finding.severity || 'unknown').toLowerCase()}">${finding.severity || 'UNKNOWN'}</span>
        <h4>${finding.title || 'Unknown Issue'}</h4>
        <span class="confidence-badge">${confidence}</span>
      </div>
      <div class="finding-content">
        <p><strong>Description:</strong> ${finding.description || 'No description available'}</p>
        <p><strong>Location:</strong> ${locationText}</p>
        <p><strong>Impact:</strong> ${impactText}</p>
        <p><strong>Recommendation:</strong> ${remediationText}</p>
        ${codeReference ? `<div class="code-reference"><pre><code>${escapeHtml(codeReference)}</code></pre></div>` : ''}
        ${finding.reportedBy ? `<p class="reported-by"><strong>Detected by:</strong> ${finding.reportedBy}</p>` : ''}
        ${finding.tool ? `<p class="reported-by"><strong>Tool:</strong> ${finding.tool}</p>` : ''}
      </div>
    </div>
  `;
}

// Enhanced gas analysis section
function generateEnhancedGasAnalysisSection(gasOptimizations) {
  if (!gasOptimizations || !Array.isArray(gasOptimizations) || gasOptimizations.length === 0) {
    return '<div class="no-optimizations">✅ No significant gas optimization opportunities identified</div>';
  }
  
  return `
    <div class="gas-optimizations">
      ${gasOptimizations.map(opt => {
        if (!opt) return '';
        
        // Extract location
        let locationText = 'Unknown location';
        if (opt.location) {
          if (typeof opt.location === 'object') {
            locationText = `${opt.location.contract || 'Unknown'} - ${opt.location.function || 'Unknown function'}`;
          } else {
            locationText = opt.location;
          }
        }
        
        // Extract savings
        let savingsText = 'Unknown';
        if (opt.optimizedImplementation?.savings) {
          savingsText = opt.optimizedImplementation.savings;
        } else if (opt.savings) {
          savingsText = opt.savings;
        } else if (opt.estimatedSavings) {
          savingsText = opt.estimatedSavings;
        }
        
        // Extract code examples
        let codeExample = '';
        if (opt.currentImplementation && opt.optimizedImplementation) {
          const currentCode = opt.currentImplementation.code || opt.currentImplementation || '';
          const optimizedCode = opt.optimizedImplementation.code || opt.optimizedImplementation || '';
          if (currentCode && optimizedCode) {
            codeExample = `<div class="code-comparison">
              <div class="code-block">
                <h5>Current Implementation:</h5>
                <pre><code>${escapeHtml(currentCode)}</code></pre>
              </div>
              <div class="code-block">
                <h5>Optimized Implementation:</h5>
                <pre><code>${escapeHtml(optimizedCode)}</code></pre>
              </div>
            </div>`;
          }
        } else if (opt.codeExample) {
          codeExample = `<div class="code-example"><pre><code>${escapeHtml(opt.codeExample)}</code></pre></div>`;
        }
        
        const impact = opt.impact || 'MEDIUM';
        const difficulty = opt.difficulty || (impact === 'HIGH' ? 'HARD' : impact === 'LOW' ? 'EASY' : 'MEDIUM');
        
        return `
          <div class="gas-optimization">
            <div class="opt-header">
              <h4>${opt.title || 'Gas Optimization'}</h4>
              <span class="difficulty-badge ${difficulty.toLowerCase()}">${difficulty}</span>
            </div>
            <p>${opt.description || 'No description available'}</p>
            <div class="savings-info">
              <span class="savings">💰 Estimated Savings: ${savingsText}</span>
              <span class="location">📍 Location: ${locationText}</span>
            </div>
            ${opt.explanation ? `<p class="explanation"><strong>Explanation:</strong> ${opt.explanation}</p>` : ''}
            ${opt.tradeoffs ? `<p class="tradeoffs"><strong>Trade-offs:</strong> ${opt.tradeoffs}</p>` : ''}
            ${codeExample}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Enhanced code quality section
function generateEnhancedCodeQualitySection(qualityIssues) {
  if (!qualityIssues || !Array.isArray(qualityIssues) || qualityIssues.length === 0) {
    return '<div class="high-quality">✅ Code quality meets professional standards</div>';
  }
  
  // Group by category
  const groupedIssues = {};
  qualityIssues.forEach(issue => {
    if (issue) {
      const category = issue.category || 'General';
      if (!groupedIssues[category]) {
        groupedIssues[category] = [];
      }
      groupedIssues[category].push(issue);
    }
  });
  
  return Object.entries(groupedIssues).map(([category, issues]) => `
    <div class="quality-category">
      <h4>${category} (${issues.length})</h4>
      <div class="quality-issues">
        ${issues.map(issue => {
          if (!issue) return '';
          
          const impact = issue.impact || 'MEDIUM';
          const severity = impact.toLowerCase();
          
          return `
            <div class="quality-issue ${severity}">
              <h5>${issue.title || 'Code Quality Issue'}</h5>
              <p>${issue.description || 'No description available'}</p>
              ${issue.reasoning ? `<p><strong>Reasoning:</strong> ${issue.reasoning}</p>` : ''}
              <p><strong>Recommendation:</strong> ${issue.recommendation || 'Follow best practices'}</p>
              ${issue.bestPracticeReference ? `<p class="reference"><strong>Reference:</strong> ${issue.bestPracticeReference}</p>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

// Enhanced AI methodology section
function generateEnhancedAIMethodologySection(analysisMetadata) {
  // Return empty section if no AI was used (tools-only scan)
  if (!analysisMetadata || (!analysisMetadata.auditorInfo && !analysisMetadata.aiModel && !analysisMetadata.isAIScan)) {
    return '';
  }
  
  const auditorInfo = analysisMetadata.auditorInfo || {};
  let models = auditorInfo.models || [];
  const coverage = analysisMetadata.coverage || {};
  
  // Handle free AI scan models
  if (analysisMetadata.aiModel) {
    // Map the model IDs to display names
    const modelMapping = {
      'deepseek/deepseek-r1-0528:free': 'DeepSeek R1',
      'qwen/qwen3-32b:free': 'Qwen 3 32B',
      'cognitivecomputations/dolphin3.0-mistral-24b:free': 'Dolphin Mistral'
    };
    
    const modelName = modelMapping[analysisMetadata.aiModel] || analysisMetadata.aiModel;
    models = [modelName];
  }
  
  // If still no models and not an AI scan, don't show this section
  if (models.length === 0 && !analysisMetadata.isAIScan) {
    return '';
  }
  
  return `
    <section class="ai-analysis">
      <h2>🤖 AI Analysis Methodology</h2>
      <div class="ai-methodology">
        <div class="methodology-stats">
          <div class="stat">
            <h4>AI Models Used</h4>
            <div class="stat-value">${models.length}</div>
          </div>
          ${auditorInfo.supervisor ? `
            <div class="stat">
              <h4>Verification Level</h4>
              <div class="stat-value">${auditorInfo.supervisor}</div>
            </div>
          ` : ''}
          ${coverage.functionsAnalyzed ? `
            <div class="stat">
              <h4>Coverage</h4>
              <div class="stat-value">${coverage.functionsAnalyzed}</div>
            </div>
          ` : ''}
        </div>
        
        ${models.length > 0 ? `
          <div class="models-used">
            <h4>AI Models</h4>
            <div class="models-grid">
              ${models.map((model, index) => {
                // Determine model specialty based on name
                let specialty = 'Security Analysis';
                let icon = '🤖';
                if (model.includes('DeepSeek')) {
                  specialty = 'Advanced reasoning and vulnerability detection';
                  icon = '🧠';
                } else if (model.includes('Qwen')) {
                  specialty = 'Deep code analysis and pattern matching';
                  icon = '🔍';
                } else if (model.includes('Dolphin')) {
                  specialty = 'Security-focused analysis and exploit detection';
                  icon = '🐬';
                }
                
                return `
                  <div class="model-card">
                    <div class="model-icon">${icon}</div>
                    <div class="model-name">${model}</div>
                    <div class="model-specialty">${specialty}</div>
                    <div class="model-confidence">Professional Analysis</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        ${analysisMetadata.methodologies ? `
          <div class="methodologies">
            <h4>Analysis Methodologies</h4>
            <ul>
              ${analysisMetadata.methodologies.map(method => `<li>${method}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

// Enhanced pattern analysis section
function generateEnhancedPatternAnalysisSection(patterns) {
  if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
    return '<div class="no-patterns">ℹ️ No specific vulnerability patterns detected</div>';
  }
  
  return `
    <div class="pattern-analysis">
      ${patterns.map(pattern => {
        if (!pattern) return '';
        
        return `
          <div class="pattern-finding">
            <h4>Pattern: ${pattern.pattern || 'Unknown Pattern'}</h4>
            <p>${pattern.description || 'No description available'}</p>
            <div class="pattern-details">
              <span class="severity ${(pattern.severity || 'medium').toLowerCase()}">${pattern.severity || 'MEDIUM'}</span>
              <span class="location">${pattern.location || 'Unknown location'}</span>
              <span class="confidence">${pattern.confidence || 'Medium'} confidence</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// CSS for technical report
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
        grid-template-columns: repeat(3, 1fr);
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
      .severity-badge.info { background: #4299e1; color: white; }
      
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
      
      .code-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 15px;
      }
      
      .code-block {
        background: #1a202c;
        border: 1px solid #4a5568;
        border-radius: 5px;
        padding: 15px;
      }
      
      .code-block h5 {
        margin: 0 0 10px 0;
        color: #63b3ed;
      }
      
      .code-block pre {
        margin: 0;
        color: #a0aec0;
        overflow-x: auto;
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
      
      .opt-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
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
        gap: 30px;
        margin: 15px 0;
        font-size: 0.9em;
        color: #cbd5e0;
      }
      
      .quality-issue {
        background: #2d3748;
        border: 1px solid #4a5568;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
      }
      
      .quality-issue.high {
        border-left: 4px solid #ed8936;
      }
      
      .quality-issue.medium {
        border-left: 4px solid #ecc94b;
      }
      
      .quality-issue.low {
        border-left: 4px solid #48bb78;
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
      
      .model-icon {
        font-size: 2em;
        margin-bottom: 10px;
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
      
      .no-findings, .no-optimizations, .high-quality, .no-methodology, .no-patterns {
        text-align: center;
        padding: 40px;
        font-size: 1.1em;
        color: #68d391;
      }
      
      .finding-category, .quality-category {
        margin: 30px 0;
      }
      
      .finding-category h3, .quality-category h4 {
        color: #63b3ed;
        margin-bottom: 15px;
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
        .code-reference, .code-block {
          background: #f5f5f5;
        }
      }
    </style>
  `;
}
