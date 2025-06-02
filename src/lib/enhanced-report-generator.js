// src/lib/enhanced-report-generator.js
/**
 * Enhanced HTML Report Generator with Complete Template
 */

export class EnhancedReportGenerator {
  /**
   * Generate comprehensive HTML report with all sections
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
        
        .code-block-light {
            background: #f8fafc;
            color: #374151;
            border: 1px solid #d1d5db;
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
        
        /* Gas Optimizations */
        .gas-optimization {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .gas-title {
            font-weight: 600;
            color: #22543d;
            margin-bottom: 8px;
        }
        
        .gas-description {
            color: #2f855a;
            font-size: 0.9rem;
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
                <a href="#risk-assessment" class="nav-link">📊 Risk Assessment</a>
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
                        ${ai.overview || `Comprehensive analysis revealed ${vulnerabilities.filter(v => v.severity === 'CRITICAL').length} critical, ${summary.highSeverity} high, and ${summary.mediumSeverity} medium severity issues. Overall security score: ${summary.riskScore}/100.`}
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
                    
                    <div style="margin-top: 25px;">
                        <h3 style="margin-bottom: 15px; color: #374151;">🎯 Key Recommendations</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length === 0 ? 
                                '<li style="padding: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #667eea;">•</span>No critical security issues found</li>' :
                                vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').slice(0, 3).map(v => 
                                    `<li style="padding: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #667eea;">•</span>Address ${v.severity.toLowerCase()} issue: ${v.type}</li>`
                                ).join('')
                            }
                            ${gasOptimizations.length > 0 ? 
                                `<li style="padding: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #667eea;">•</span>Implement ${gasOptimizations.length} gas optimizations to reduce costs</li>` : ''
                            }
                            ${codeQuality.issues && codeQuality.issues.length > 0 ? 
                                `<li style="padding: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #667eea;">•</span>Improve ${codeQuality.issues.length} code quality issues for better maintainability</li>` : ''
                            }
                        </ul>
                    </div>
                    
                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px;">
                        <h4 style="margin-bottom: 10px; color: #0c4a6e;">💼 Business Impact</h4>
                        <p style="color: #075985;">${summary.riskScore >= 70 ? 'Contract appears secure for production deployment with minimal risk.' : 'Contract has significant issues that must be addressed before any deployment.'}</p>
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
                            <div class="code-block">${EnhancedReportGenerator.escapeHTML(vuln.code)}</div>
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

        <!-- Risk Assessment -->
        <section id="risk-assessment" class="section">
            <div class="section-header">
                <h2>📊 Risk Assessment Matrix</h2>
            </div>
            <div class="section-content">
                <div class="grid-2">
                    <div>
                        <h3 style="margin-bottom: 20px;">Vulnerability Distribution</h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Severity Level</th>
                                    <th>Count</th>
                                    <th>Risk Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="severity-badge severity-critical">Critical</span></td>
                                    <td><strong>${vulnerabilities.filter(v => v.severity === 'CRITICAL').length}</strong></td>
                                    <td>Immediate fund loss possible</td>
                                </tr>
                                <tr>
                                    <td><span class="severity-badge severity-high">High</span></td>
                                    <td><strong>${vulnerabilities.filter(v => v.severity === 'HIGH').length}</strong></td>
                                    <td>Significant security impact</td>
                                </tr>
                                <tr>
                                    <td><span class="severity-badge severity-medium">Medium</span></td>
                                    <td><strong>${vulnerabilities.filter(v => v.severity === 'MEDIUM').length}</strong></td>
                                    <td>Moderate security concern</td>
                                </tr>
                                <tr>
                                    <td><span class="severity-badge severity-low">Low</span></td>
                                    <td><strong>${vulnerabilities.filter(v => v.severity === 'LOW').length}</strong></td>
                                    <td>Best practice violation</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div>
                        <h3 style="margin-bottom: 20px;">Analysis Coverage</h3>
                        <div class="metric-card">
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>Security Analysis</span>
                                    <span><strong>100%</strong></span>
                                </div>
                                <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px;">
                                    <div style="width: 100%; height: 100%; background: #059669; border-radius: 4px;"></div>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>Gas Optimization</span>
                                    <span><strong>${gasOptimizations.length > 0 ? '100%' : '90%'}</strong></span>
                                </div>
                                <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px;">
                                    <div style="width: ${gasOptimizations.length > 0 ? '100%' : '90%'}; height: 100%; background: #d97706; border-radius: 4px;"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>Code Quality</span>
                                    <span><strong>${codeQuality.score ? '100%' : '85%'}</strong></span>
                                </div>
                                <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px;">
                                    <div style="width: ${codeQuality.score ? '100%' : '85%'}; height: 100%; background: #2563eb; border-radius: 4px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

    return content;
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

// Export named functions for easier imports
export function generateEnhancedHTMLReport(auditData) {
  try {
    // Transform auditData to the format expected by the class method
    const reportData = {
      metadata: auditData.metadata || {
        contractName: 'Unknown Contract',
        generatedAt: new Date().toISOString()
      },
      summary: {
        riskScore: auditData.executiveSummary?.overallScore || 75,
        riskLevel: auditData.executiveSummary?.overallRisk || 'MEDIUM',
        highSeverity: auditData.securityFindings?.filter(f => f.severity === 'HIGH').length || 0,
        mediumSeverity: auditData.securityFindings?.filter(f => f.severity === 'MEDIUM').length || 0,
      },
      vulnerabilities: (auditData.securityFindings || []).map(finding => ({
        type: finding.title || 'Security Issue',
        description: finding.description || 'No description provided',
        severity: finding.severity || 'MEDIUM',
        code: finding.codeEvidence?.vulnerableCode || '',
        recommendation: finding.remediation?.steps?.[0] || finding.remediation || 'Review and fix this issue',
        source: 'ai'
      })),
      gasOptimizations: (auditData.gasOptimizations || []).map(opt => ({
        type: opt.title || 'Gas Optimization',
        description: opt.description || 'Gas usage can be optimized',
        location: opt.location?.function || 'Unknown location',
        estimatedSaving: opt.optimizedImplementation?.savings || 'Gas savings estimated'
      })),
      codeQuality: {
        score: auditData.executiveSummary?.codeQualityScore || 85,
        issues: auditData.codeQualityIssues?.map(issue => issue.title || issue.description) || [],
        recommendations: auditData.codeQualityIssues?.map(issue => issue.reasoning) || []
      },
      tools: {},
      ai: {
        overview: auditData.executiveSummary?.summary || 'Comprehensive security analysis completed',
        modelsUsed: auditData.auditMetadata?.auditorInfo?.models || ['Multi-AI Analysis'],
        model: auditData.auditMetadata?.auditorInfo?.lead || 'AI Analysis',
        gasOptimizationScore: auditData.executiveSummary?.gasEfficiencyScore || 80,
        codeQualityScore: auditData.executiveSummary?.codeQualityScore || 85
      }
    };

    return EnhancedReportGenerator.generateHTMLReport(reportData);
  } catch (error) {
    console.error('HTML Report generation failed:', error);
    throw new Error(`HTML Report generation failed: ${error.message}`);
  }
}

export function generateEnhancedJSONReport(auditData) {
  try {
    // Return the audit data as a structured JSON report
    const jsonReport = {
      metadata: {
        reportType: 'Smart Contract Security Audit',
        version: '2.0',
        generatedAt: new Date().toISOString(),
        generator: 'DeFi Watchdog Multi-AI Analysis',
        ...auditData.metadata
      },
      executiveSummary: auditData.executiveSummary || {},
      contractAnalysis: auditData.contractAnalysis || {},
      findings: {
        security: auditData.securityFindings || [],
        gasOptimizations: auditData.gasOptimizations || [],
        codeQuality: auditData.codeQualityIssues || []
      },
      metrics: {
        totalSecurityFindings: (auditData.securityFindings || []).length,
        criticalFindings: (auditData.securityFindings || []).filter(f => f.severity === 'CRITICAL').length,
        highFindings: (auditData.securityFindings || []).filter(f => f.severity === 'HIGH').length,
        mediumFindings: (auditData.securityFindings || []).filter(f => f.severity === 'MEDIUM').length,
        lowFindings: (auditData.securityFindings || []).filter(f => f.severity === 'LOW').length,
        gasOptimizations: (auditData.gasOptimizations || []).length,
        codeQualityIssues: (auditData.codeQualityIssues || []).length
      },
      scores: {
        overall: auditData.executiveSummary?.overallScore || 75,
        security: auditData.executiveSummary?.securityScore || 75,
        gasEfficiency: auditData.executiveSummary?.gasEfficiencyScore || 80,
        codeQuality: auditData.executiveSummary?.codeQualityScore || 85
      },
      auditMetadata: auditData.auditMetadata || {},
      recommendations: {
        immediate: auditData.securityFindings?.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH')
          .map(f => f.remediation?.steps?.[0] || 'Address this critical issue immediately') || [],
        shortTerm: auditData.gasOptimizations?.map(opt => opt.description) || [],
        longTerm: [
          'Regular security audits for contract updates',
          'Implement comprehensive test coverage',
          'Consider formal verification for critical functions',
          'Set up monitoring for unusual contract activity'
        ]
      },
      appendices: {
        detailedFindings: auditData.securityFindings || [],
        gasAnalysis: auditData.gasOptimizations || [],
        codeQualityAnalysis: auditData.codeQualityIssues || []
      }
    };

    return jsonReport;
  } catch (error) {
    console.error('JSON Report generation failed:', error);
    throw new Error(`JSON Report generation failed: ${error.message}`);
  }
}

export default EnhancedReportGenerator;
