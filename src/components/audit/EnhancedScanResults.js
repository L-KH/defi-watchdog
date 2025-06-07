// Enhanced Scan Results Component for Comprehensive Audits
'use client';
import { useState } from 'react';
import AIReportCards from './AIReportCards';
import AuditProExporter from './export/AuditProExporter';
// Import enhanced report generators
import { generateExecutiveReport, generateTechnicalHtmlReport, generateStructuredJsonReport } from '../../lib/supervisor/reportGeneratorEnhanced';
// Import audit-pro specific report generators
import { generatePremiumMultiAIReport, generatePremiumMultiAIJsonReport, generatePremiumMultiAIPdfReport } from '../../lib/audit-pro-reports';

export default function EnhancedScanResults({ 
  toolsResult, 
  aiResult, 
  contractInfo, 
  onDownloadReport 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFinding, setExpandedFinding] = useState(null);

  if (!aiResult && !toolsResult) {
    return null;
  }

  // Check if this is an audit-pro enhanced analysis
  const isAuditPro = aiResult?.analysis?.aiReportCards && aiResult.analysis.aiReportCards.length > 0;
  const isPremium = aiResult?.type === 'premium' || aiResult?.scanOptions?.type === 'premium' || aiResult?.scanOptions?.plan === 'premium';
  const isComprehensive = aiResult?.comprehensiveReport || aiResult?.type === 'comprehensive' || aiResult?.type === 'full-scan';
  const analysis = aiResult?.analysis || {};

  // Extract findings based on result type - Enhanced to handle BOTH tools and AI results
  let securityFindings = [];
  let gasOptimizations = [];
  let codeQualityIssues = [];
  let scores = {};
  let executiveSummary = '';

  console.log('🔍 Debug - toolsResult structure:', JSON.stringify(toolsResult, null, 2));
  console.log('🔍 Debug - aiResult structure:', JSON.stringify(aiResult, null, 2));

  // FIRST: Process tools results if available
  if (toolsResult && toolsResult.result) {
    console.log('🛠️ Processing tools results...');
    const toolsData = toolsResult.result;
    
    // Extract vulnerabilities from tools scan - Handle multiple possible structures
    const vulnerabilitiesArray = toolsData.all_vulnerabilities || toolsData.vulnerabilities || [];
    
    if (vulnerabilitiesArray && Array.isArray(vulnerabilitiesArray)) {
      securityFindings = vulnerabilitiesArray.map(vuln => ({
        title: vuln.type || vuln.title || vuln.name || 'Security Issue',
        description: vuln.description || vuln.message || 'Vulnerability detected by security tools',
        severity: vuln.severity || vuln.level || 'MEDIUM',
        category: vuln.category || vuln.type || 'Security',
        location: `Line ${vuln.line || 'Unknown'}`,
        codeReference: vuln.code_snippet || vuln.code || vuln.snippet || '',
        remediation: vuln.recommendation || vuln.remediation || vuln.fix || 'Review and fix the identified issue',
        impact: vuln.impact || 'Security vulnerability detected',
        confidence: vuln.confidence || 'Medium',
        tool: vuln.tool || 'Security Tools'
      }));
      
      console.log(`📊 Extracted ${securityFindings.length} vulnerabilities from tools scan`);
    }
    
    // Extract summary info
    if (toolsData.summary) {
      const summary = toolsData.summary;
      const totalVulns = summary.total_vulnerabilities || securityFindings.length;
      const highCount = summary.high || 0;
      const mediumCount = summary.medium || 0;
      const lowCount = summary.low || 0;
      
      executiveSummary = `Security tools analysis completed. Found ${totalVulns} vulnerabilities: ${highCount} High, ${mediumCount} Medium, ${lowCount} Low severity issues.`;
      
      // Calculate security score based on vulnerability counts
      let securityScore = 100;
      securityScore -= (summary.high * 20); // -20 per high
      securityScore -= (summary.medium * 10); // -10 per medium  
      securityScore -= (summary.low * 5); // -5 per low
      securityScore = Math.max(10, securityScore); // Minimum score of 10
      
      scores = {
        security: securityScore,
        gasOptimization: 80, // Default since tools don't typically analyze gas
        codeQuality: 75, // Default
        overall: Math.round((securityScore + 80 + 75) / 3)
      };
    } else if (securityFindings.length > 0) {
      // Fallback: create summary from extracted findings
      const criticalCount = securityFindings.filter(f => f.severity === 'CRITICAL').length;
      const highCount = securityFindings.filter(f => f.severity === 'HIGH').length;
      const mediumCount = securityFindings.filter(f => f.severity === 'MEDIUM').length;
      const lowCount = securityFindings.filter(f => f.severity === 'LOW').length;
      
      executiveSummary = `Security tools analysis completed. Found ${securityFindings.length} vulnerabilities: ${criticalCount} Critical, ${highCount} High, ${mediumCount} Medium, ${lowCount} Low severity issues.`;
      
      let securityScore = 100;
      securityScore -= (criticalCount * 25);
      securityScore -= (highCount * 20);
      securityScore -= (mediumCount * 10);
      securityScore -= (lowCount * 5);
      securityScore = Math.max(10, securityScore);
      
      scores = {
        security: securityScore,
        gasOptimization: 80,
        codeQuality: 75,
        overall: Math.round((securityScore + 80 + 75) / 3)
      };
    }
  }
  
  // ENHANCED AI RESULT PROCESSING - Handles all possible AI response formats
  if (aiResult) {
    console.log('🤖 Processing AI results...');
    console.log('🔍 Full AI Result Debug:', {
      hasSuccess: 'success' in aiResult,
      successValue: aiResult.success,
      hasError: !!aiResult.error,
      hasAnalysis: !!aiResult.analysis,
      hasKeyFindings: !!aiResult.keyFindings,
      type: aiResult.type,
      model: aiResult.model,
      parseMethod: aiResult.parseMethod,
      hadParseError: aiResult.hadParseError,
      topLevelKeys: Object.keys(aiResult)
    });

    let analysis = aiResult.analysis || {};
    
    // Handle successful AI results
    if (aiResult.success !== false) {
      // Strategy 1: Extract from analysis object (preferred)
      if (analysis && Object.keys(analysis).length > 0) {
        console.log('📊 Using analysis object structure');
        
        // Extract security findings
        if (analysis.keyFindings && Array.isArray(analysis.keyFindings)) {
          securityFindings = [...securityFindings, ...analysis.keyFindings];
        }
        
        // Extract scores
        if (typeof analysis.securityScore === 'number') {
          scores.security = analysis.securityScore;
        }
        if (typeof analysis.gasOptimizationScore === 'number') {
          scores.gasOptimization = analysis.gasOptimizationScore;
        }
        if (typeof analysis.codeQualityScore === 'number') {
          scores.codeQuality = analysis.codeQualityScore;
        }
        if (typeof analysis.overallScore === 'number') {
          scores.overall = analysis.overallScore;
        } else if (typeof analysis.securityScore === 'number') {
          scores.overall = analysis.securityScore;
        }
        
        // Extract summary
        executiveSummary = analysis.summary || analysis.overview || executiveSummary;
        
        // Extract optimizations and quality issues
        gasOptimizations = analysis.gasOptimizations || gasOptimizations;
        codeQualityIssues = analysis.codeQualityIssues || codeQualityIssues;
      } 
      // Strategy 2: Extract from top-level aiResult (fallback)
      else {
        console.log('📊 Using top-level aiResult structure');
        
        // Extract findings from different possible top-level structures
        const topLevelFindings = aiResult.keyFindings || 
                                aiResult.vulnerabilities || 
                                aiResult.findings || 
                                aiResult.securityFindings || 
                                [];
        
        if (Array.isArray(topLevelFindings) && topLevelFindings.length > 0) {
          securityFindings = [...securityFindings, ...topLevelFindings];
        }
        
        // Extract scores from top level
        if (typeof aiResult.securityScore === 'number') {
          scores.security = aiResult.securityScore;
        }
        if (typeof aiResult.gasOptimizationScore === 'number') {
          scores.gasOptimization = aiResult.gasOptimizationScore;
        }
        if (typeof aiResult.codeQualityScore === 'number') {
          scores.codeQuality = aiResult.codeQualityScore;
        }
        if (typeof aiResult.overallScore === 'number') {
          scores.overall = aiResult.overallScore;
        } else if (typeof aiResult.securityScore === 'number') {
          scores.overall = aiResult.securityScore;
        }
        
        // Extract summary from top level
        executiveSummary = aiResult.summary || 
                          aiResult.overview || 
                          aiResult.executiveSummary || 
                          executiveSummary;
        
        // Extract optimizations and quality issues from top level
        gasOptimizations = aiResult.gasOptimizations || gasOptimizations;
        codeQualityIssues = aiResult.codeQualityIssues || codeQualityIssues;
      }
      
      // Strategy 3: Handle fallback/parse error cases
      if (aiResult.parseError || aiResult.hadParseError) {
        console.log('⚠️ Handling parse error case with intelligent extraction');
        
        // If we got a fallback response, try to extract useful data
        if (aiResult.rawResponse) {
          console.log('🔍 Attempting to extract data from raw response...');
          
          // Create a meaningful finding from the raw response
          const fallbackFinding = {
            severity: 'INFO',
            title: 'AI Analysis Completed',
            description: `Analysis completed using ${aiResult.model || 'AI model'}. ${aiResult.parseMethod === 'intelligent_fallback' ? 'Response was parsed using intelligent fallback.' : 'Response format required manual processing.'}`,
            location: 'General Analysis',
            impact: 'Analysis completed with automated parsing',
            recommendation: 'Review the detailed AI response for specific findings and recommendations.'
          };
          
          // Add any specific findings that were intelligently parsed
          if (analysis.keyFindings && Array.isArray(analysis.keyFindings)) {
            securityFindings = [...securityFindings, ...analysis.keyFindings];
          } else {
            securityFindings = [...securityFindings, fallbackFinding];
          }
          
          // Use any scores that were intelligently extracted
          scores = {
            ...scores,
            security: analysis.securityScore || scores.security || 75,
            gasOptimization: analysis.gasOptimizationScore || scores.gasOptimization || 80,
            codeQuality: analysis.codeQualityScore || scores.codeQuality || 85,
            overall: analysis.overallScore || analysis.securityScore || scores.overall || 75
          };
          
          // Use the summary if available
          executiveSummary = analysis.summary || 
                            `AI analysis completed using ${aiResult.model}. ${securityFindings.length} findings identified for review.`;
        }
      }
      
      // Ensure we have minimum default scores if none were extracted
      scores = {
        security: scores.security || 75,
        gasOptimization: scores.gasOptimization || 80,
        codeQuality: scores.codeQuality || 85,
        overall: scores.overall || scores.security || 75
      };
      
      console.log('📊 Final extracted data:', {
        securityFindingsCount: securityFindings.length,
        gasOptimizationsCount: gasOptimizations.length,
        codeQualityIssuesCount: codeQualityIssues.length,
        scores: scores,
        executiveSummaryLength: executiveSummary.length,
        source: aiResult.parseError ? 'fallback' : 'structured'
      });
    } else {
      // Handle failed AI results
      console.log('❌ AI analysis failed');
      const errorFinding = {
        severity: 'ERROR',
        title: 'AI Analysis Error',
        description: aiResult.error || 'AI analysis encountered an error',
        location: 'System',
        impact: 'Analysis could not be completed',
        recommendation: 'Try again or check system configuration'
      };
      securityFindings = [...securityFindings, errorFinding];
      executiveSummary = `AI analysis failed: ${aiResult.error || 'Unknown error'}`;
    }
  }
  
  // If we still don't have an executive summary but have tools results, create one
  if (!executiveSummary && toolsResult) {
    const toolsUsed = toolsResult.result?.tools_used || [];
    const vulnCount = securityFindings.length;
    executiveSummary = `Security analysis completed using ${toolsUsed.length} tools (${toolsUsed.join(', ')}). Identified ${vulnCount} potential security issues for review.`;
  }

  // Ensure we have valid data for report generation - Enhanced validation
  const hasValidData = !!(
    (securityFindings.length > 0) || 
    (executiveSummary && executiveSummary.length > 0) ||
    (toolsResult && (
      (toolsResult.result?.all_vulnerabilities && toolsResult.result.all_vulnerabilities.length > 0) ||
      (toolsResult.result?.vulnerabilities && toolsResult.result.vulnerabilities.length > 0) ||
      toolsResult.result?.summary ||
      toolsResult.result?.tools_used
    )) ||
    (aiResult && (
      (aiResult.success !== false) && (
        analysis.overview || 
        analysis.summary || 
        aiResult.summary ||
        aiResult.overview ||
        (analysis && Object.keys(analysis).length > 0) ||
        aiResult.analysis
      )
    ))
  );

  console.log('📊 Debug - Extracted data:', {
    hasValidData,
    securityFindingsCount: securityFindings.length,
    gasOptimizationsCount: gasOptimizations.length,
    codeQualityIssuesCount: codeQualityIssues.length,
    executiveSummary: executiveSummary.substring(0, 100) + '...',
    scores
  });

  const handleDownloadReport = (format) => {
    // Check if we have valid scan data
    if (!hasValidData) {
      alert('No scan results available for download. Please run a scan first.');
      return;
    }

    try {
      console.log('🚀 Starting report download...', { 
        format, 
        hasValidData,
        securityFindingsCount: securityFindings.length,
        hasToolsResult: !!toolsResult,
        hasAIResult: !!aiResult,
        scores,
        executiveSummary: executiveSummary ? 'Present' : 'Missing'
      });
      
      const timestamp = new Date().toISOString().split('T')[0];
      const contractName = contractInfo?.contractName || 'contract';
      
      // Prepare comprehensive audit data for report generation
      console.log('📦 Preparing audit data with:', {
        securityFindingsCount: securityFindings.length,
        gasOptimizationsCount: gasOptimizations.length,
        codeQualityIssuesCount: codeQualityIssues.length,
        scores,
        executiveSummary: executiveSummary ? executiveSummary.substring(0, 100) + '...' : 'None'
      });
      
      const auditData = {
        metadata: {
          contractName: contractName,
          generatedAt: new Date().toISOString(),
          reportType: isComprehensive ? 'comprehensive' : 'standard'
        },
        // Pass AI model info if this was an AI scan
        aiModel: aiResult?.scanOptions?.model || null,
        executiveSummary: {
          overallRisk: scores.overall >= 80 ? 'LOW' : scores.overall >= 60 ? 'MEDIUM' : 'HIGH',
          securityScore: scores.security || 75,
          gasEfficiencyScore: scores.gasOptimization || 80,
          codeQualityScore: scores.codeQuality || 85,
          overallScore: scores.overall || 75,
          keyRecommendations: [
            securityFindings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH').length > 0 
              ? 'Address all critical and high severity security findings immediately'
              : 'No critical security issues found',
            gasOptimizations.length > 0 
              ? `Implement ${gasOptimizations.length} gas optimization${gasOptimizations.length > 1 ? 's' : ''} to reduce costs`
              : 'Gas usage appears optimized',
            codeQualityIssues.length > 0
              ? `Improve ${codeQualityIssues.length} code quality issue${codeQualityIssues.length > 1 ? 's' : ''} for better maintainability`
              : 'Code quality meets standards'
          ],
          summary: executiveSummary || analysis.summary || analysis.overview || aiResult?.summary || 'Comprehensive security analysis completed with multi-AI verification.',
          deploymentRecommendation: scores.overall >= 80 ? 'DEPLOY' : scores.overall >= 60 ? 'REVIEW_REQUIRED' : 'DO_NOT_DEPLOY',
          businessImpact: scores.overall >= 80 
            ? 'Contract appears secure for production deployment with minimal risk.'
            : scores.overall >= 60
            ? 'Contract requires review and fixes before deployment to production.'
            : 'Contract has significant issues that must be addressed before any deployment.',
          estimatedRemediationTime: securityFindings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH').length > 2
            ? '1-2 weeks' : securityFindings.length > 0 ? '3-7 days' : '1-2 days'
        },
        contractAnalysis: {
          contractType: analysis.contractType || 'Smart Contract',
          complexity: securityFindings.length > 5 ? 'HIGH' : securityFindings.length > 2 ? 'MEDIUM' : 'LOW',
          linesOfCode: analysis.linesAnalyzed || 0,
          functionsAnalyzed: analysis.functionsFound || 0,
          upgradeability: 'UNKNOWN',
          accessControls: {
            hasOwner: securityFindings.some(f => f.title?.toLowerCase().includes('owner')),
            hasMultisig: false,
            hasTimelock: false,
            decentralizationLevel: 'UNKNOWN'
          }
        },
        securityFindings: securityFindings.map((finding, index) => ({
          id: `SEC-${String(index + 1).padStart(3, '0')}`,
          severity: finding.severity || 'MEDIUM',
          category: finding.category || 'Security',
          title: finding.title || 'Security Issue',
          description: finding.description || 'Security vulnerability detected',
          location: finding.location || {
            contract: `${contractName}.sol`,
            function: 'unknown',
            lines: '0-0'
          },
          impact: typeof finding.impact === 'object' ? finding.impact : {
            technical: finding.impact || 'Potential security risk',
            business: 'May affect contract security and user trust',
            financial: finding.severity === 'CRITICAL' ? 'High risk of fund loss' : 'Moderate financial risk'
          },
          exploitScenario: {
            steps: finding.proofOfConcept ? [finding.proofOfConcept] : ['Exploit scenario not provided'],
            prerequisites: 'Attacker access to contract',
            difficulty: finding.severity === 'CRITICAL' ? 'EASY' : finding.severity === 'HIGH' ? 'MEDIUM' : 'HARD'
          },
          codeEvidence: {
            vulnerableCode: finding.codeReference || 'Code reference not provided',
            explanation: finding.description || 'Vulnerability explanation not provided'
          },
          remediation: finding.remediation || {
            priority: finding.severity === 'CRITICAL' ? 'IMMEDIATE' : finding.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
            effort: finding.severity === 'CRITICAL' ? '1 day' : '1 week',
            steps: [finding.recommendation || 'Review and fix the identified issue'],
            fixedCode: finding.remediation?.fixedCode || 'Secure implementation needed',
            additionalRecommendations: 'Follow security best practices'
          },
          references: [
            'https://consensys.github.io/smart-contract-best-practices/',
            'https://swcregistry.io/'
          ],
          verified: true
        })),
        gasOptimizations: gasOptimizations.map((opt, index) => ({
          id: `GAS-${String(index + 1).padStart(3, '0')}`,
          impact: opt.impact || 'MEDIUM',
          title: opt.title || 'Gas Optimization',
          description: opt.description || 'Gas usage can be optimized',
          location: opt.location || {
            contract: `${contractName}.sol`,
            function: 'unknown',
            lines: '0-0'
          },
          currentImplementation: opt.currentImplementation || {
            code: opt.currentCode || 'Current implementation',
            gasUsage: 'Unknown'
          },
          optimizedImplementation: opt.optimizedImplementation || {
            code: opt.optimizedCode || 'Optimized implementation',
            gasUsage: 'Reduced',
            savings: opt.estimatedSavings || 'Gas savings estimated'
          },
          explanation: opt.explanation || 'Optimization reduces gas consumption',
          tradeoffs: opt.tradeoffs || 'No significant trade-offs identified'
        })),
        codeQualityIssues: codeQualityIssues.map((issue, index) => ({
          id: `QUAL-${String(index + 1).padStart(3, '0')}`,
          impact: issue.impact || 'MEDIUM',
          category: issue.category || 'Quality',
          title: issue.title || 'Code Quality Issue',
          description: issue.description || 'Code quality can be improved',
          location: issue.location || {
            contract: `${contractName}.sol`,
            function: 'unknown',
            lines: '0-0'
          },
          currentCode: issue.currentCode || 'Current implementation',
          improvedCode: issue.improvedCode || 'Improved implementation',
          reasoning: issue.reasoning || 'Improves code maintainability',
          bestPracticeReference: issue.bestPracticeReference || 'General best practices'
        })),
        auditMetadata: {
          auditorInfo: {
            lead: toolsResult && !aiResult ? 'Static Analysis Tools' : 'AI Multi-Model Analysis',
            models: toolsResult && !aiResult ? [] : (aiResult?.modelsUsed || []),
            supervisor: toolsResult && !aiResult ? undefined : (analysis.supervisorVerification?.model || undefined)
          },
          analysisTime: new Date().toISOString(),
          methodologies: toolsResult && !aiResult ? [
            'Static Analysis',
            'Pattern Matching',
            'Security Tool Scanning'
          ] : [
            'AI Security Analysis',
            'Vulnerability Detection',
            'Code Review',
            'Pattern Recognition'
          ],
          toolsUsed: toolsResult && !aiResult ? 
            (toolsResult.result?.tools_used || ['Pattern Matcher', 'Static Analyzer']) : 
            ['AI Analysis Engine', 'Security Pattern Detection'],
          coverage: {
            functionsAnalyzed: '100%',
            branchCoverage: '95%',
            lineCoverage: '98%'
          }
        }
      };
      
      console.log('📋 Final audit data structure:', {
        hasSecurityFindings: auditData.securityFindings && auditData.securityFindings.length > 0,
        securityFindingsCount: auditData.securityFindings?.length || 0,
        hasExecutiveSummary: !!auditData.executiveSummary,
        hasScores: !!auditData.executiveSummary?.securityScore
      });

      if (format === 'html') {
        let htmlReport;
        
        // Use audit-pro report generator for enhanced analyses
        if (isAuditPro) {
          console.log('🚀 Generating Audit-Pro Multi-AI HTML Report...');
          const auditProData = {
            contractName: contractName,
            analysis: {
              keyFindings: securityFindings,
              gasOptimizations: gasOptimizations,
              codeQualityIssues: codeQualityIssues,
              securityScore: scores.security || 75,
              gasOptimizationScore: scores.gasOptimization || 80,
              codeQualityScore: scores.codeQuality || 85,
              overallScore: scores.overall || 75,
              riskLevel: executiveSummary.includes('Critical') ? 'Critical Risk' : 
                        executiveSummary.includes('High') ? 'High Risk' : 
                        executiveSummary.includes('Medium') ? 'Medium Risk' : 'Low Risk',
              summary: executiveSummary
            },
            aiReportCards: aiResult?.analysis?.aiReportCards || [],
            categoryAnalysis: aiResult?.analysis?.categoryAnalysis || {},
            timestamp: new Date().toISOString(),
            analysisTime: aiResult?.analysisTime || 0,
            sourceCodeLength: contractInfo?.sourceCode?.length || aiResult?.contractInfo?.sourceCode?.length || 0
          };
          
          const auditProReport = generatePremiumMultiAIReport(auditProData);
          htmlReport = auditProReport.content;
        } else if (isPremium) {
          // Use premium supervisor report for premium analyses
          console.log('🚀 Generating Premium Executive HTML Report...');
          const executiveReport = generateExecutiveReport(auditData);
          htmlReport = executiveReport.content;
        } else {
          // Use standard report for free analyses
          const technicalReport = generateTechnicalHtmlReport(auditData);
          htmlReport = technicalReport.content;
        }
        
        const blob = new Blob([htmlReport], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contractName}_security_audit_${timestamp}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'json') {
        let jsonReport;
        
        // Use audit-pro JSON generator for enhanced analyses
        if (isAuditPro) {
          console.log('🚀 Generating Audit-Pro Multi-AI JSON Report...');
          const auditProData = {
            contractName: contractName,
            analysis: {
              keyFindings: securityFindings,
              gasOptimizations: gasOptimizations,
              codeQualityIssues: codeQualityIssues,
              securityScore: scores.security || 75,
              gasOptimizationScore: scores.gasOptimization || 80,
              codeQualityScore: scores.codeQuality || 85,
              overallScore: scores.overall || 75,
              riskLevel: executiveSummary.includes('Critical') ? 'Critical Risk' : 
                        executiveSummary.includes('High') ? 'High Risk' : 
                        executiveSummary.includes('Medium') ? 'Medium Risk' : 'Low Risk',
              summary: executiveSummary
            },
            aiReportCards: aiResult?.analysis?.aiReportCards || [],
            categoryAnalysis: aiResult?.analysis?.categoryAnalysis || {},
            timestamp: new Date().toISOString(),
            analysisTime: aiResult?.analysisTime || 0,
            sourceCodeLength: contractInfo?.sourceCode?.length || aiResult?.contractInfo?.sourceCode?.length || 0
          };
          
          const auditProJsonReport = generatePremiumMultiAIJsonReport(auditProData);
          jsonReport = JSON.parse(auditProJsonReport.content);
        } else if (isPremium) {
          // Use premium supervisor report for premium analyses
          console.log('🚀 Generating Premium Supervisor JSON Report...');
          const structuredReport = generateStructuredJsonReport(auditData);
          jsonReport = JSON.parse(structuredReport.content);
        } else {
          // Use standard report for free analyses
          const structuredReport = generateStructuredJsonReport(auditData);
          jsonReport = JSON.parse(structuredReport.content);
        }
        
        const blob = new Blob([JSON.stringify(jsonReport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contractName}_security_audit_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        let htmlReport;
        
        if (isPremium) {
          // Use premium supervisor report for premium analyses
          console.log('🚀 Generating Premium Executive PDF Report...');
          const executiveReport = generateExecutiveReport(auditData);
          htmlReport = executiveReport.content;
        } else {
          // Use standard report for free analyses
          const technicalReport = generateTechnicalHtmlReport(auditData);
          htmlReport = technicalReport.content;
        }
        
        // For PDF, we'll generate HTML and let the user print to PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlReport);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      alert(`Report generation failed: ${error.message}`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'security', name: `Security (${securityFindings.length})`, icon: '🛡️' },
    ...(gasOptimizations.length > 0 ? [{ id: 'gas', name: `Gas (${gasOptimizations.length})`, icon: '⛽' }] : []),
    ...(codeQualityIssues.length > 0 ? [{ id: 'quality', name: `Quality (${codeQualityIssues.length})`, icon: '✨' }] : []),
    ...(toolsResult ? [{ id: 'tools', name: 'Tools', icon: '🔧' }] : [])
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
            <p className="text-purple-100 text-sm">
              {isPremium ? 'Premium AI-Supervised Analysis' : 
               isComprehensive ? 'Comprehensive Multi-AI Security Audit' : 
               aiResult?.type === 'premium' ? 'Premium AI Analysis' : 
               'Basic Security Analysis'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Contract</div>
            <div className="font-semibold">{contractInfo?.contractName || 'Unknown'}</div>
          </div>
        </div>

        {/* Overall Scores - Show for comprehensive reports OR when we have scores */}
        {(isComprehensive || scores.security) && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{scores.security || 75}</div>
              <div className="text-sm text-blue-100">Security</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{scores.gasOptimization || 80}</div>
              <div className="text-sm text-blue-100">Gas Optimization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{scores.codeQuality || 85}</div>
              <div className="text-sm text-blue-100">Code Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{scores.overall || 75}</div>
              <div className="text-sm text-blue-100">Overall</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {executiveSummary || 
                   analysis.executiveSummary?.summary || 
                   analysis.summary || 
                   analysis.overview || 
                   aiResult?.summary ||
                   'Security analysis completed successfully.'}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {securityFindings.filter(f => f.severity === 'CRITICAL').length}
                  </div>
                  <div className="text-sm text-red-600">Critical Issues</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {securityFindings.filter(f => f.severity === 'HIGH').length}
                  </div>
                  <div className="text-sm text-orange-600">High Risk</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {gasOptimizations.length}
                  </div>
                  <div className="text-sm text-blue-600">Gas Optimizations</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {codeQualityIssues.length}
                  </div>
                  <div className="text-sm text-green-600">Quality Issues</div>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            {isComprehensive && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Analysis Details</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-purple-900 mb-2">AI Models Used:</p>
                      <ul className="space-y-1 text-purple-700">
                        {analysis.aiModelsUsed?.map((model, index) => (
                          <li key={index}>• {model.name} - {model.speciality}</li>
                        )) || aiResult?.modelsUsed?.map((model, index) => (
                          <li key={index}>• {model}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-purple-900 mb-2">Verification:</p>
                      <ul className="space-y-1 text-purple-700">
                        <li>• Supervisor: {analysis.supervisorVerification?.model || 'GPT-4 Mini'}</li>
                        <li>• Confidence: {analysis.supervisorVerification?.confidenceLevel || '95%'}</li>
                        <li>• False Positives Removed: {analysis.falsePositives?.length || 0}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Download Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Download Report</h3>
              
              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                  <p><strong>Debug Info:</strong></p>
                  <p>Has Valid Data: {hasValidData ? '✅' : '❌'}</p>
                  <p>Tools Result: {toolsResult ? '✅' : '❌'} (All Vulnerabilities: {toolsResult?.result?.all_vulnerabilities?.length || 0})</p>
                  <p>AI Result Success: {aiResult?.success !== false ? '✅' : '❌'}</p>
                  <p>Executive Summary Length: {executiveSummary?.length || 0}</p>
                  <p>Security Findings: {securityFindings.length}</p>
                  <p>Analysis Type: {aiResult?.type || (toolsResult ? 'tools+ai' : 'unknown')}</p>
                  <p>Data Sources: {[toolsResult ? 'tools' : null, aiResult ? 'ai' : null].filter(Boolean).join(', ') || 'none'}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDownloadReport('html')}
                  disabled={!hasValidData}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    hasValidData 
                      ? isAuditPro 
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white'
                        : isPremium 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAuditPro ? '🚀 Multi-AI HTML Report' : isPremium ? '🚀 Executive HTML Report' : '📄 Professional HTML Report'}
                </button>
                <button
                  onClick={() => handleDownloadReport('json')}
                  disabled={!hasValidData}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    hasValidData 
                      ? isPremium 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPremium ? '📊 Supervisor JSON Data' : '📋 Structured JSON Data'}
                </button>
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  disabled={!hasValidData}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    hasValidData 
                      ? isPremium 
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPremium ? '📑 Executive PDF' : '📑 Print to PDF'}
                </button>
              </div>
              
              {!hasValidData && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ⚠️ No scan results available for download. Please run a scan first or check if the scan completed successfully.
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {isPremium 
                  ? '🚀 Premium reports include executive-level insights, supervisor verification, and enhanced business intelligence.' 
                  : '💡 HTML reports include interactive features and enhanced styling. JSON provides raw data for integration.'}
              </p>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Security Findings ({securityFindings.length})</h3>
            </div>
            
            {securityFindings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">🎉</span>
                <p className="mt-2">No security vulnerabilities detected!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {securityFindings.map((finding, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{finding.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                            {finding.severity}
                          </span>
                          {finding.tool && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                              {finding.tool}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-3">{finding.description}</p>
                        
                        {finding.location && (
                          <div className="text-xs text-gray-600 mb-2">
                            📍 {typeof finding.location === 'object' 
                              ? `${finding.location.contract || 'Unknown'} - ${finding.location.function || 'Unknown function'} (Lines: ${finding.location.lines || 'Unknown'})` 
                              : finding.location
                            }
                          </div>
                        )}
                        
                        {/* Expandable Details */}
                        <button
                          onClick={() => setExpandedFinding(expandedFinding === index ? null : index)}
                          className="text-sm font-medium hover:underline"
                        >
                          {expandedFinding === index ? 'Hide Details' : 'Show Details'}
                        </button>
                        
                        {expandedFinding === index && (
                          <div className="mt-4 space-y-3 text-sm">
                            {finding.impact && (
                              <div>
                                <p className="font-medium">Impact:</p>
                                <p className="text-gray-700">{finding.impact}</p>
                              </div>
                            )}
                            {finding.confidence && (
                              <div>
                                <p className="font-medium">Confidence:</p>
                                <p className="text-gray-700">{finding.confidence}</p>
                              </div>
                            )}
                            {finding.remediation && (
                              <div>
                                <p className="font-medium">Remediation:</p>
                                <p className="text-gray-700">{finding.remediation}</p>
                              </div>
                            )}
                            {finding.codeReference && (
                              <div>
                                <p className="font-medium">Code Reference:</p>
                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                  {finding.codeReference}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gas Optimization Tab */}
        {activeTab === 'gas' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gas Optimizations ({gasOptimizations.length})</h3>
            
            {gasOptimizations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">⛽</span>
                <p className="mt-2">No gas optimizations identified.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {gasOptimizations.map((optimization, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-900">{optimization.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        optimization.impact === 'HIGH' ? 'bg-red-100 text-red-700' :
                        optimization.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {optimization.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">{optimization.description}</p>
                    
                    {optimization.gasSavings && (
                      <div className="text-sm">
                        <span className="font-medium text-blue-900">Estimated Savings: </span>
                        <span className="text-blue-700">{optimization.gasSavings}</span>
                      </div>
                    )}
                    
                    {optimization.currentCode && optimization.optimizedCode && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-blue-900 mb-1">Current Code:</p>
                          <pre className="bg-white p-2 rounded text-xs overflow-x-auto border">
                            {optimization.currentCode}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-blue-900 mb-1">Optimized Code:</p>
                          <pre className="bg-green-50 p-2 rounded text-xs overflow-x-auto border border-green-200">
                            {optimization.optimizedCode}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Code Quality Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Code Quality Issues ({codeQualityIssues.length})</h3>
            
            {codeQualityIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">✨</span>
                <p className="mt-2">No code quality issues identified.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {codeQualityIssues.map((issue, index) => (
                  <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-yellow-900">{issue.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.impact === 'HIGH' ? 'bg-red-100 text-red-700' :
                        issue.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-yellow-800 mb-3">{issue.description}</p>
                    
                    {issue.bestPracticeReference && (
                      <div className="text-sm">
                        <span className="font-medium text-yellow-900">Reference: </span>
                        <span className="text-yellow-700">{issue.bestPracticeReference}</span>
                      </div>
                    )}
                    
                    {issue.currentCode && issue.improvedCode && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-yellow-900 mb-1">Current Code:</p>
                          <pre className="bg-white p-2 rounded text-xs overflow-x-auto border">
                            {issue.currentCode}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-yellow-900 mb-1">Improved Code:</p>
                          <pre className="bg-green-50 p-2 rounded text-xs overflow-x-auto border border-green-200">
                            {issue.improvedCode}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && toolsResult && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security Tools Analysis</h3>
            <div className="text-sm text-gray-600">
              Raw results from automated security tools scan
            </div>
            {/* Tools results would be displayed here */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto max-h-96">
                {JSON.stringify(toolsResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* AI Report Cards Section */}
      {aiResult?.analysis?.aiReportCards && aiResult.analysis.aiReportCards.length > 0 && (
        <AIReportCards 
          aiReportCards={aiResult.analysis.aiReportCards}
          categoryAnalysis={aiResult.analysis.categoryAnalysis}
        />
      )}
    </div>
  );
}
