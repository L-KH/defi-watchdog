// src/lib/report-generator.js
/**
 * Enhanced Report Generator for DeFi Watchdog
 * Supports both tools and AI scan results
 */

export class ReportGenerator {
  /**
   * Generate a comprehensive report from scan results
   */
  static generateReport(options = {}) {
    const {
      toolsResult,
      aiResult,
      contractInfo,
      format = 'json',
      filename
    } = options;

    if (!toolsResult && !aiResult) {
      throw new Error('No scan results available for report generation');
    }

    const reportData = this.consolidateResults(toolsResult, aiResult, contractInfo);
    
    switch (format.toLowerCase()) {
      case 'json':
        return this.generateJSONReport(reportData, filename);
      case 'csv':
        return this.generateCSVReport(reportData, filename);
      case 'html':
        return this.generateHTMLReport(reportData, filename);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Consolidate results from tools and AI scans
   */
  static consolidateResults(toolsResult, aiResult, contractInfo) {
    const report = {
      metadata: {
        contractName: contractInfo?.contractName || 'Unknown Contract',
        contractAddress: contractInfo?.address || 'N/A',
        network: contractInfo?.network || 'N/A',
        compilerVersion: contractInfo?.compilerVersion || 'Unknown',
        generatedAt: new Date().toISOString(),
        scanTypes: []
      },
      summary: {
        totalIssues: 0,
        highSeverity: 0,
        mediumSeverity: 0,
        lowSeverity: 0,
        riskLevel: 'UNKNOWN',
        riskScore: 0
      },
      vulnerabilities: [],
      gasOptimizations: [],
      codeQuality: {},
      tools: {},
      ai: {}
    };

    // Process tools results
    if (toolsResult) {
      report.metadata.scanTypes.push('Multi-Tool Analysis');
      report.tools = {
        scanMode: toolsResult.scan_mode || 'Unknown',
        toolsUsed: toolsResult.result?.tools_used || [],
        executionTime: toolsResult.result?.execution_time || 'Unknown',
        toolResults: toolsResult.result?.tool_results || {},
        summary: toolsResult.result?.summary || {}
      };

      // Add tools vulnerabilities
      const toolsVulns = toolsResult.result?.all_vulnerabilities || [];
      report.vulnerabilities.push(...toolsVulns.map(vuln => ({
        ...vuln,
        source: 'tools',
        tool: vuln.tool || 'unknown'
      })));
    }

    // Process AI results
    if (aiResult) {
      const analysisType = aiResult.type === 'full-scan' ? 'Full AI Security Audit' : 'AI Analysis';
      report.metadata.scanTypes.push(analysisType);
      
      report.ai = {
        model: aiResult.model || 'AI Model',
        analysisType: aiResult.type || 'single',
        promptMode: aiResult.promptMode || 'standard',
        securityScore: aiResult.securityScore || 0,
        riskLevel: aiResult.riskLevel || 'UNKNOWN',
        overview: aiResult.summary || aiResult.overview || '',
        explanation: aiResult.explanation || '',
        modelsUsed: aiResult.modelsUsed || [],
        supervisorResponse: aiResult.supervisorResponse || null
      };

      // Add AI vulnerabilities
      const aiVulns = aiResult.vulnerabilities || aiResult.risks || [];
      report.vulnerabilities.push(...aiVulns.map(vuln => ({
        type: vuln.title || vuln.type || 'AI Detection',
        severity: vuln.severity || 'MEDIUM',
        description: vuln.description || 'AI detected vulnerability',
        recommendation: vuln.recommendation || vuln.impact || '',
        line: vuln.line || 0,
        code: vuln.codeSnippet || vuln.code || '',
        tool: 'ai',
        source: 'ai'
      })));

      // Add gas optimizations
      if (aiResult.gasOptimizations) {
        report.gasOptimizations = aiResult.gasOptimizations;
      }

      // Add code quality
      if (aiResult.codeQuality) {
        report.codeQuality = aiResult.codeQuality;
      }
    }

    // Calculate summary statistics
    report.summary.totalIssues = report.vulnerabilities.length;
    report.summary.highSeverity = report.vulnerabilities.filter(v => v.severity === 'HIGH').length;
    report.summary.mediumSeverity = report.vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    report.summary.lowSeverity = report.vulnerabilities.filter(v => v.severity === 'LOW').length;

    // Calculate overall risk
    const riskAssessment = this.calculateRiskScore(report.vulnerabilities);
    report.summary.riskLevel = riskAssessment.level;
    report.summary.riskScore = riskAssessment.score;

    return report;
  }

  /**
   * Calculate overall risk score
   */
  static calculateRiskScore(vulnerabilities) {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return { score: 100, level: 'SAFE' };
    }

    let score = 100;
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity?.toUpperCase()) {
        case 'HIGH':
        case 'CRITICAL':
          score -= 30;
          break;
        case 'MEDIUM':
          score -= 15;
          break;
        case 'LOW':
          score -= 5;
          break;
      }
    });

    score = Math.max(0, score);

    let level;
    if (score >= 90) level = 'SAFE';
    else if (score >= 70) level = 'LOW_RISK';
    else if (score >= 50) level = 'MEDIUM_RISK';
    else level = 'HIGH_RISK';

    return { score, level };
  }

  /**
   * Generate JSON report
   */
  static generateJSONReport(reportData, filename) {
    const content = JSON.stringify(reportData, null, 2);
    const actualFilename = filename || `security_audit_${Date.now()}.json`;
    
    this.downloadFile(content, 'application/json', actualFilename);
    return { success: true, format: 'json', filename: actualFilename };
  }

  /**
   * Generate CSV report
   */
  static generateCSVReport(reportData, filename) {
    const headers = [
      'Issue Type',
      'Severity',
      'Source',
      'Tool',
      'Line',
      'Description',
      'Recommendation',
      'Code Snippet'
    ];

    const rows = reportData.vulnerabilities.map(vuln => [
      this.escapeCSV(vuln.type || ''),
      this.escapeCSV(vuln.severity || ''),
      this.escapeCSV(vuln.source || ''),
      this.escapeCSV(vuln.tool || ''),
      vuln.line || '',
      this.escapeCSV(vuln.description || ''),
      this.escapeCSV(vuln.recommendation || ''),
      this.escapeCSV(vuln.code || '')
    ]);

    const content = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const actualFilename = filename || `security_audit_${Date.now()}.csv`;
    this.downloadFile(content, 'text/csv', actualFilename);
    return { success: true, format: 'csv', filename: actualFilename };
  }

  /**
   * Generate comprehensive HTML report with complete interactive template
   */
  static generateHTMLReport(reportData, filename) {
    const { metadata, summary, vulnerabilities, gasOptimizations, codeQuality, tools, ai } = reportData;
    
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Audit Report - ${metadata.contractName}</title>
    <style>
        /* Modern Professional Styling */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
            opacity: 0.95;
        }
        
        .header-meta-item {
            text-align: center;
        }
        
        .header-meta-value {
            font-size: 2em;
            font-weight: bold;
            display: block;
        }
        
        .header-meta-label {
            font-size: 0.9em;
            opacity: 0.8;
        }
        
        /* Navigation */
        .nav {
            background: white;
            padding: 15px 30px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            position: sticky;
            top: 20px;
            z-index: 100;
        }
        
        .nav-links {
            display: flex;
            gap: 25px;
            flex-wrap: wrap;
        }
        
        .nav-link {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9em;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        
        .nav-link:hover {
            background: #f1f5f9;
            color: #475569;
        }
        
        /* Section Styles */
        .section {
            background: white;
            margin-bottom: 30px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .section-header {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 20px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section-header h2 {
            color: #1e293b;
            font-size: 1.8em;
            font-weight: 600;
        }
        
        .section-content {
            padding: 30px;
        }
        
        /* Executive Summary */
        .executive-summary {
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-left: 5px solid #667eea;
        }
        
        .risk-indicator {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .risk-critical { background: #fee2e2; color: #dc2626; }
        .risk-high { background: #fef3c7; color: #d97706; }
        .risk-medium { background: #dbeafe; color: #2563eb; }
        .risk-low { background: #d1fae5; color: #059669; }
        .risk-safe { background: #d1fae5; color: #059669; }
        
        /* Metrics and Stats */
        .metric-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .metric-label {
            color: #64748b;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        /* Findings Styles */
        .finding {
            background: #fafafa;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .finding:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .finding-header {
            padding: 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
        }
        
        .finding-critical {
            border-left: 5px solid #dc2626;
            background: #fef2f2;
        }
        
        .finding-high {
            border-left: 5px solid #d97706;
            background: #fffbeb;
        }
        
        .finding-medium {
            border-left: 5px solid #2563eb;
            background: #eff6ff;
        }
        
        .finding-low {
            border-left: 5px solid #059669;
            background: #f0fdf4;
        }
        
        .finding-info {
            border-left: 5px solid #6b7280;
            background: #f9fafb;
        }
        
        .finding-title {
            flex: 1;
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .severity-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .severity-critical {
            background: #dc2626;
            color: white;
        }
        
        .severity-high {
            background: #d97706;
            color: white;
        }
        
        .severity-medium {
            background: #2563eb;
            color: white;
        }
        
        .severity-low {
            background: #059669;
            color: white;
        }
        
        .severity-info {
            background: #6b7280;
            color: white;
        }
        
        .finding-details {
            padding: 0 20px 20px;
            border-top: 1px solid #e5e7eb;
            background: white;
        }
        
        .finding-section {
            margin-bottom: 20px;
        }
        
        .finding-section h4 {
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 1em;
        }
        
        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 10px 0;
            border: 1px solid #334155;
        }
        
        /* Grid Layouts */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .grid-4 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        /* Interactive Elements */
        .toggle-details {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .toggle-details:hover {
            background: #e2e8f0;
            color: #334155;
        }
        
        .hidden {
            display: none;
        }
        
        /* Tables */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .table th,
        .table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .table th {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .table tr:hover {
            background: #f8fafc;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .grid-2,
            .grid-3,
            .grid-4 {
                grid-template-columns: 1fr;
            }
            
            .section-content {
                padding: 20px;
            }
        }
        
        /* Print Styles */
        @media print {
            body {
                background: white;
            }
            
            .section,
            .finding {
                box-shadow: none;
                border: 1px solid #ddd;
            }
            
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🛡️ Smart Contract Security Audit Report</h1>
            <p style="font-size: 1.2em; opacity: 0.9; margin-bottom: 10px;">Contract: <strong>${metadata.contractName}</strong></p>
            <p style="opacity: 0.8;">Generated on ${new Date(metadata.generatedAt).toLocaleDateString()} | Multi-AI Security Analysis</p>
            
            <div class="header-meta">
                <div class="header-meta-item">
                    <span class="header-meta-value">${summary.riskScore}</span>
                    <span class="header-meta-label">Overall Score</span>
                </div>
                <div class="header-meta-item">
                    <span class="header-meta-value">${summary.highSeverity + vulnerabilities.filter(v => v.severity === 'CRITICAL').length}</span>
                    <span class="header-meta-label">Critical + High Issues</span>
                </div>
                <div class="header-meta-item">
                    <span class="header-meta-value">${gasOptimizations.length}</span>
                    <span class="header-meta-label">Gas Optimizations</span>
                </div>
                <div class="header-meta-item">
                    <span class="header-meta-value">${ai.modelsUsed ? ai.modelsUsed.length : (ai.model ? 1 : 0)}</span>
                    <span class="header-meta-label">AI Models Used</span>
                </div>
            </div>
        </div>
        
        <!-- Navigation -->
        <nav class="nav">
            <div class="nav-links">
                <a href="#executive-summary" class="nav-link">📋 Executive Summary</a>
                <a href="#security-findings" class="nav-link">🛡️ Security Findings</a>
                <a href="#gas-optimizations" class="nav-link">⛽ Gas Optimizations</a>
                <a href="#code-quality" class="nav-link">✨ Code Quality</a>
                <a href="#recommendations" class="nav-link">🎯 Recommendations</a>
            </div>
        </nav>
        
        <!-- Executive Summary -->
        <section id="executive-summary" class="section">
            <div class="section-header">
                <h2>📋 Executive Summary</h2>
            </div>
            <div class="section-content">
                <div class="executive-summary">
                    <div style="margin-bottom: 20px;">
                        <span class="risk-indicator risk-${summary.riskLevel.toLowerCase().replace('_', '-')}">
                            Risk Level: ${summary.riskLevel.replace('_', ' ')}
                        </span>
                        <span class="risk-indicator risk-${summary.riskScore >= 70 ? 'low' : 'high'}" style="margin-left: 10px;">
                            ${summary.riskScore >= 70 ? 'DEPLOY_READY' : 'NEEDS_REVIEW'}
                        </span>
                    </div>
                    
                    <p style="font-size: 1.1em; margin-bottom: 25px; line-height: 1.7;">
                        ${ai.overview || `Analysis revealed ${vulnerabilities.filter(v => v.severity === 'CRITICAL').length} critical, ${summary.highSeverity} high, and ${summary.mediumSeverity} medium severity issues. Overall security score: ${summary.riskScore}/100.`}
                    </p>
                    
                    <div class="grid-4">
                        <div class="metric-card">
                            <div class="metric-value">${summary.riskScore}</div>
                            <div class="metric-label">Security Score</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${ai.gasOptimizationScore || 80}</div>
                            <div class="metric-label">Gas Efficiency</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${ai.codeQualityScore || codeQuality.score || 85}</div>
                            <div class="metric-label">Code Quality</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${Math.round((summary.riskScore + (ai.gasOptimizationScore || 80) + (ai.codeQualityScore || codeQuality.score || 85)) / 3)}</div>
                            <div class="metric-label">Overall Score</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Security Findings -->
        <section id="security-findings" class="section">
            <div class="section-header">
                <h2>🛡️ Security Findings (${vulnerabilities.length})</h2>
            </div>
            <div class="section-content">
                ${vulnerabilities.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: #059669;">
                    <div style="font-size: 3em; margin-bottom: 20px;">✅</div>
                    <h3>No Security Issues Found</h3>
                    <p>Great! No vulnerabilities were detected in this contract.</p>
                </div>
                ` : vulnerabilities.map((vuln, index) => `
                <div class="finding finding-${vuln.severity.toLowerCase()}">
                    <div class="finding-header" onclick="toggleDetails('finding-${index}')">
                        <div>
                            <div class="finding-title">${vuln.type}</div>
                            <p style="color: #64748b; margin: 0;">${vuln.description.substring(0, 100)}${vuln.description.length > 100 ? '...' : ''}</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                            <span class="severity-badge severity-${vuln.severity.toLowerCase()}">${vuln.severity}</span>
                            <button class="toggle-details">View Details ▼</button>
                        </div>
                    </div>
                    <div id="finding-${index}" class="finding-details hidden">
                        <div class="finding-section">
                            <h4>📋 Description</h4>
                            <p>${vuln.description}</p>
                        </div>
                        
                        ${vuln.code ? `
                        <div class="finding-section">
                            <h4>💻 Code Reference</h4>
                            <div class="code-block">${this.escapeHTML(vuln.code)}</div>
                        </div>
                        ` : ''}
                        
                        ${vuln.recommendation ? `
                        <div class="finding-section">
                            <h4>💡 Recommendation</h4>
                            <p>${vuln.recommendation}</p>
                        </div>
                        ` : ''}
                        
                        <div class="finding-section">
                            <h4>🎯 Source</h4>
                            <p><strong>Analysis Source:</strong> ${vuln.source === 'ai' ? '🤖 AI Analysis' : '🛠️ Security Tools'}</p>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </section>

        <!-- Gas Optimizations -->
        <section id="gas-optimizations" class="section">
            <div class="section-header">
                <h2>⛽ Gas Optimization Opportunities (${gasOptimizations.length})</h2>
            </div>
            <div class="section-content">
                ${gasOptimizations.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: #059669;">
                    <div style="font-size: 3em; margin-bottom: 20px;">⚡</div>
                    <h3>No Gas Optimizations Found</h3>
                    <p>The contract appears to be well-optimized for gas usage.</p>
                </div>
                ` : gasOptimizations.map((opt, index) => `
                <div class="finding finding-low">
                    <div class="finding-header" onclick="toggleDetails('gas-${index}')">
                        <div>
                            <div class="finding-title">${opt.type}</div>
                            <p style="color: #64748b; margin: 0;">${opt.description.substring(0, 100)}${opt.description.length > 100 ? '...' : ''}</p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                            <span class="severity-badge severity-low">Gas Optimization</span>
                            <button class="toggle-details">View Details ▼</button>
                        </div>
                    </div>
                    <div id="gas-${index}" class="finding-details hidden">
                        <div class="finding-section">
                            <h4>📋 Description</h4>
                            <p>${opt.description}</p>
                        </div>
                        
                        ${opt.location ? `
                        <div class="finding-section">
                            <h4>📍 Location</h4>
                            <p>${opt.location}</p>
                        </div>
                        ` : ''}
                        
                        ${opt.estimatedSaving ? `
                        <div class="finding-section">
                            <h4>💰 Estimated Savings</h4>
                            <p>${opt.estimatedSaving}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </section>

        <!-- Code Quality Assessment -->
        <section id="code-quality" class="section">
            <div class="section-header">
                <h2>✨ Code Quality Assessment</h2>
            </div>
            <div class="section-content">
                ${codeQuality.score ? `
                <div style="margin-bottom: 30px; padding: 25px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0;">Overall Quality Score</h3>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 200px; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                                <div style="width: ${codeQuality.score}%; height: 100%; background: ${codeQuality.score >= 80 ? '#059669' : codeQuality.score >= 60 ? '#d97706' : '#dc2626'}; border-radius: 4px;"></div>
                            </div>
                            <span style="font-size: 1.5em; font-weight: bold; color: ${codeQuality.score >= 80 ? '#059669' : codeQuality.score >= 60 ? '#d97706' : '#dc2626'};">${codeQuality.score}/100</span>
                        </div>
                    </div>
                    
                    ${codeQuality.issues && codeQuality.issues.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">📝 Issues Identified:</h4>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${codeQuality.issues.map(issue => `<li style="margin-bottom: 5px;">${issue}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${codeQuality.recommendations && codeQuality.recommendations.length > 0 ? `
                    <div>
                        <h4 style="margin-bottom: 10px;">💡 Recommendations:</h4>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${codeQuality.recommendations.map(rec => `<li style="margin-bottom: 5px;">${rec}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                ` : `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <div style="font-size: 3em; margin-bottom: 20px;">📊</div>
                    <h3>Code Quality Analysis Not Available</h3>
                    <p>Code quality assessment was not performed for this scan.</p>
                </div>
                `}
            </div>
        </section>

        <!-- Recommendations -->
        <section id="recommendations" class="section">
            <div class="section-header">
                <h2>🎯 Actionable Recommendations</h2>
            </div>
            <div class="section-content">
                <div class="grid-2">
                    <div>
                        <h3 style="margin-bottom: 20px;">🚨 Immediate Actions Required</h3>
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px;">
                            ${vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length > 0 ? `
                            <ul style="margin: 0; padding-left: 20px;">
                                ${vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').map(v => `
                                <li style="margin-bottom: 10px;"><strong>${v.type}:</strong> ${v.recommendation || 'Address this security issue immediately'}</li>
                                `).join('')}
                            </ul>
                            ` : `
                            <p style="color: #059669; margin: 0;">✅ No immediate critical actions required!</p>
                            `}
                        </div>
                        
                        <h3 style="margin: 30px 0 20px 0;">⚡ Performance Improvements</h3>
                        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 20px;">
                            ${gasOptimizations.length > 0 ? `
                            <ul style="margin: 0; padding-left: 20px;">
                                ${gasOptimizations.slice(0, 3).map(opt => `
                                <li style="margin-bottom: 10px;"><strong>${opt.type}:</strong> ${opt.description}</li>
                                `).join('')}
                            </ul>
                            ` : `
                            <p style="color: #059669; margin: 0;">✅ Contract is well-optimized for gas usage!</p>
                            `}
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="margin-bottom: 20px;">📈 Long-term Improvements</h3>
                        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 20px;">
                            <ul style="margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 10px;">Regular security audits for contract updates</li>
                                <li style="margin-bottom: 10px;">Implement comprehensive test coverage</li>
                                <li style="margin-bottom: 10px;">Consider formal verification for critical functions</li>
                                <li style="margin-bottom: 10px;">Set up monitoring for unusual contract activity</li>
                                <li style="margin-bottom: 10px;">Document security assumptions and invariants</li>
                            </ul>
                        </div>
                        
                        <h3 style="margin: 30px 0 20px 0;">🛡️ Security Best Practices</h3>
                        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px;">
                            <ul style="margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 10px;">Follow the principle of least privilege</li>
                                <li style="margin-bottom: 10px;">Use established security patterns and libraries</li>
                                <li style="margin-bottom: 10px;">Implement proper access controls</li>
                                <li style="margin-bottom: 10px;">Validate all external inputs</li>
                                <li style="margin-bottom: 10px;">Consider economic attack vectors</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <footer style="margin-top: 50px; padding: 30px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; border-radius: 15px; text-align: center;">
            <h3 style="margin-bottom: 15px;">🛡️ DeFi Watchdog Security Audit</h3>
            <p style="opacity: 0.8; margin-bottom: 20px;">Multi-AI Security Analysis • Comprehensive Coverage • Professional Results</p>
            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; font-size: 0.9em;">
                <div><strong>Report Generated:</strong> ${new Date(metadata.generatedAt).toLocaleDateString()}</div>
                <div><strong>Models Used:</strong> ${ai.modelsUsed ? ai.modelsUsed.length : (ai.model ? 1 : 0)}</div>
            </div>
            <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()" style="background: #3182ce; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-right: 10px;">
                    🖨️ Print Report
                </button>
                <button onclick="window.close()" style="background: #718096; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    ❌ Close
                </button>
            </div>
        </footer>
    </div>
    
    <script>
        function toggleDetails(elementId) {
            const element = document.getElementById(elementId);
            const button = element.previousElementSibling.querySelector('.toggle-details');
            
            if (element.classList.contains('hidden')) {
                element.classList.remove('hidden');
                button.textContent = 'Hide Details ▲';
            } else {
                element.classList.add('hidden');
                button.textContent = 'View Details ▼';
            }
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>`;

    const actualFilename = filename || `security_audit_${Date.now()}.html`;
    this.downloadFile(content, 'text/html', actualFilename);
    return { success: true, format: 'html', filename: actualFilename };
  }

  /**
   * Download file to browser
   */
  static downloadFile(content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape CSV content
   */
  static escapeCSV(value) {
    if (typeof value !== 'string') return value;
    return `"${value.replace(/"/g, '""')}"`;
  }

  /**
   * Escape HTML content
   */
  static escapeHTML(value) {
    if (typeof value !== 'string') return value;
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

export default ReportGenerator;
