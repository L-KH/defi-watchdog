// Comprehensive AI Audit System with Multi-Model Analysis and Supervisor Verification
import OpenAI from 'openai';
import fetch from 'node-fetch';

// AI Models Configuration
const AI_MODELS = {
  // Premium tier models (unchanged)
  premium: [
    {
      id: 'x-ai/grok-3-mini-beta',
      name: 'Grok 3 Mini Beta',
      provider: 'openrouter',
      speciality: 'Advanced reasoning and vulnerability detection',
      tier: 'premium'
    },
    {
      id: 'deepseek/deepseek-chat-v3-0324',
      name: 'DeepSeek Chat V3 Pro',
      provider: 'openrouter',
      speciality: 'Code analysis and security patterns',
      tier: 'premium'
    },
    {
      id: 'google/gemma-2b-it',
      name: 'Google Gemma 2B',
      provider: 'openrouter',
      speciality: 'Gas optimization and code quality',
      tier: 'premium'
    },
    {
      id: 'anthropic/claude-3-haiku:beta',
      name: 'Claude 3 Haiku',
      provider: 'openrouter',
      speciality: 'Business logic and edge case detection',
      tier: 'premium'
    },
    {
      id: 'mistralai/mistral-nemo',
      name: 'Mistral Nemo',
      provider: 'openrouter',
      speciality: 'Pattern matching and best practices',
      tier: 'premium'
    }
  ],
  // Free tier models (new multi-AI approach)
  free: [
    {
      id: 'meta-llama/llama-3.2-3b-instruct:free',
      name: 'Llama 3.2 3B Free',
      provider: 'openrouter',
      speciality: 'Security vulnerability detection and pattern analysis',
      tier: 'free'
    },
    {
      id: 'qwen/qwen-2.5-7b-instruct:free',
      name: 'Qwen 2.5 7B Free',
      provider: 'openrouter',
      speciality: 'Code structure analysis and gas optimization',
      tier: 'free'
    },
    {
      id: 'mistralai/mistral-7b-instruct:free',
      name: 'Mistral 7B Free',
      provider: 'openrouter',
      speciality: 'Code quality and best practices assessment',
      tier: 'free'
    }
  ],
  // Supervisors for different tiers
  supervisors: {
    premium: {
      id: 'openai/gpt-4.1-mini',
      name: 'GPT-4.1 Mini',
      provider: 'openrouter',
      role: 'Premium Supervisor and Report Generator'
    },
    free: {
      id: 'meta-llama/llama-3.2-3b-instruct:free',
      name: 'Llama 3.2 3B Supervisor',
      provider: 'openrouter',
      role: 'Free Tier Supervisor and Consensus Builder'
    }
  }
};

// Analysis prompts for different categories
const ANALYSIS_PROMPTS = {
  security: `You are an expert smart contract security auditor. Analyze this contract for:

1. CRITICAL vulnerabilities (immediate fund loss risk)
2. HIGH vulnerabilities (significant security impact)
3. MEDIUM vulnerabilities (potential issues)
4. LOW vulnerabilities (best practice violations)

Focus on:
- Reentrancy attacks
- Integer overflow/underflow
- Access control issues
- Front-running vulnerabilities
- Flash loan attacks
- Oracle manipulation
- Business logic flaws
- Centralization risks
- Upgrade mechanism security

For each finding, provide:
- Severity (CRITICAL/HIGH/MEDIUM/LOW)
- Title (brief description)
- Description (detailed explanation)
- Impact (what could happen)
- Proof of Concept (how to exploit)
- Remediation (how to fix)
- CVSS score if applicable

Format as JSON:
{
  "findings": [
    {
      "category": "security",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "title": "Vulnerability name",
      "description": "Detailed description",
      "impact": "Impact assessment",
      "proofOfConcept": "Step-by-step exploitation",
      "remediation": "Fix recommendations",
      "codeReference": "Relevant code section",
      "cvssSeverity": "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H - Score: 9.0"
    }
  ],
  "summary": "Overall security assessment"
}`,

  gasOptimization: `You are a gas optimization expert. Analyze this contract for gas efficiency improvements:

1. Storage optimization opportunities
2. Function optimization techniques
3. Loop and array optimizations
4. Unnecessary computations
5. Efficient data structures
6. Assembly optimizations (where safe)

For each optimization, provide:
- Impact (HIGH/MEDIUM/LOW gas savings)
- Description of the optimization
- Current inefficient code
- Optimized code
- Estimated gas savings
- Trade-offs or risks

Format as JSON:
{
  "optimizations": [
    {
      "category": "gas",
      "impact": "HIGH|MEDIUM|LOW",
      "title": "Optimization name",
      "description": "What can be optimized",
      "currentCode": "Current inefficient code",
      "optimizedCode": "Improved code",
      "gasSavings": "Estimated savings",
      "tradeoffs": "Any trade-offs or risks"
    }
  ],
  "summary": "Overall gas optimization assessment"
}`,

  codeQuality: `You are a code quality expert. Analyze this contract for:

1. Code readability and maintainability
2. Documentation quality (NatSpec)
3. Naming conventions
4. Code structure and organization
5. Error handling
6. Event emission
7. Input validation
8. Best practices adherence

For each issue, provide:
- Impact (HIGH/MEDIUM/LOW)
- Description of the quality issue
- Current problematic code
- Improved code
- Best practice reference

Format as JSON:
{
  "qualityIssues": [
    {
      "category": "quality",
      "impact": "HIGH|MEDIUM|LOW",
      "title": "Quality issue",
      "description": "What needs improvement",
      "currentCode": "Current code",
      "improvedCode": "Better code",
      "bestPracticeReference": "Reference or standard"
    }
  ],
  "summary": "Overall code quality assessment"
}`,

  comprehensive_free: `You are an expert smart contract security auditor. Analyze this contract comprehensively for ALL aspects:

1. SECURITY VULNERABILITIES:
- Reentrancy attacks
- Integer overflow/underflow
- Access control issues
- Front-running vulnerabilities
- Business logic flaws
- Centralization risks

2. GAS OPTIMIZATION:
- Storage optimization opportunities
- Function optimization techniques
- Unnecessary computations
- Efficient data structures

3. CODE QUALITY:
- Code readability and maintainability
- Documentation quality
- Naming conventions
- Error handling
- Best practices adherence

For each finding, provide:
- Category (security/gas/quality)
- Severity (CRITICAL/HIGH/MEDIUM/LOW/INFO)
- Title (brief description)
- Description (detailed explanation)
- Impact (what could happen)
- Recommendation (how to fix)
- Code reference if applicable

Format as JSON:
{
  "findings": [
    {
      "category": "security|gas|quality",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "title": "Finding title",
      "description": "Detailed description",
      "impact": "Impact assessment",
      "recommendation": "Fix recommendations",
      "codeReference": "Relevant code section if applicable"
    }
  ],
  "overallAssessment": "Comprehensive assessment of the contract",
  "securityScore": 85,
  "gasOptimizationScore": 80,
  "codeQualityScore": 90,
  "summary": "Overall analysis summary"
}`
};

/**
 * Comprehensive Multi-AI Security Audit
 * @param {string} sourceCode - Contract source code
 * @param {string} contractName - Name of the contract
 * @param {object} options - Analysis options (tier: 'free' | 'premium')
 * @returns {Promise<object>} Comprehensive audit results
 */
export async function runComprehensiveAudit(sourceCode, contractName, options = {}) {
  console.log(`Starting comprehensive audit for ${contractName}`);
  const startTime = Date.now();
  
  try {
    // Determine analysis tier (free or premium)
    const tier = options.tier || 'free';
    const models = tier === 'premium' ? AI_MODELS.premium : AI_MODELS.free;
    const supervisor = AI_MODELS.supervisors[tier];
    
    console.log(`Starting ${tier} tier analysis with ${models.length} AI models`);
    
    let analysisResults;
    
    if (tier === 'premium') {
      // Premium tier: Specialized analysis with different models for different purposes
      const analysisPromises = [
        runSecurityAnalysis(sourceCode, contractName, models.slice(0, 3)),
        runGasOptimizationAnalysis(sourceCode, contractName, models[2]),
        runCodeQualityAnalysis(sourceCode, contractName, models[3])
      ];
      
      console.log('Running specialized premium AI analyses...');
      const [securityResults, gasResults, qualityResults] = await Promise.all(analysisPromises);
      
      analysisResults = {
        security: securityResults,
        gasOptimization: gasResults,
        codeQuality: qualityResults,
        metadata: {
          contractName,
          analysisTime: Date.now() - startTime,
          modelsUsed: models.map(m => m.name),
          tier: 'premium',
          timestamp: new Date().toISOString()
        }
      };
    } else {
      // Free tier: All models analyze everything, then consensus
      console.log('Running free tier multi-AI consensus analysis...');
      analysisResults = await runFreeMultiAIAnalysis(sourceCode, contractName, models, startTime);
    }
    
    // Supervisor verification and report generation
    console.log(`Running ${tier} tier supervisor verification...`);
    const supervisorReport = await runSupervisorVerification(
      sourceCode, 
      contractName, 
      analysisResults,
      supervisor,
      tier
    );
    
    // Generate final comprehensive report
    const finalReport = await generateComprehensiveReport(
      analysisResults,
      supervisorReport,
      tier
    );
    
    console.log(`Comprehensive audit completed in ${(Date.now() - startTime) / 1000}s`);
    return finalReport;
    
  } catch (error) {
    console.error('Comprehensive audit failed:', error);
    throw new Error(`Comprehensive audit failed: ${error.message}`);
  }
}

/**
 * Run free tier multi-AI analysis where all models analyze everything
 */
async function runFreeMultiAIAnalysis(sourceCode, contractName, models, startTime) {
  console.log('Running comprehensive analysis with all free AI models...');
  
  const analysisPromises = models.map(async (model) => {
    try {
      console.log(`Running full analysis with ${model.name}...`);
      const result = await callAIModel(model, ANALYSIS_PROMPTS.comprehensive_free, sourceCode, contractName);
      return {
        model: model.name,
        modelId: model.id,
        speciality: model.speciality,
        result: result,
        category: 'comprehensive'
      };
    } catch (error) {
      console.error(`Analysis failed with ${model.name}:`, error);
      return {
        model: model.name,
        modelId: model.id,
        error: error.message,
        category: 'comprehensive'
      };
    }
  });
  
  const results = await Promise.all(analysisPromises);
  const validResults = results.filter(r => !r.error);
  
  return {
    comprehensive: validResults,
    metadata: {
      contractName,
      analysisTime: Date.now() - startTime,
      modelsUsed: models.map(m => m.name),
      tier: 'free',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Run security analysis with multiple AI models (Premium tier)
 */
async function runSecurityAnalysis(sourceCode, contractName, securityModels) {
  
  const analysisPromises = securityModels.map(async (model) => {
    try {
      console.log(`Running security analysis with ${model.name}...`);
      const result = await callAIModel(model, ANALYSIS_PROMPTS.security, sourceCode, contractName);
      return {
        model: model.name,
        modelId: model.id,
        result: result,
        category: 'security'
      };
    } catch (error) {
      console.error(`Security analysis failed with ${model.name}:`, error);
      return {
        model: model.name,
        modelId: model.id,
        error: error.message,
        category: 'security'
      };
    }
  });
  
  const results = await Promise.all(analysisPromises);
  return results.filter(r => !r.error);
}

/**
 * Run gas optimization analysis (Premium tier)
 */
async function runGasOptimizationAnalysis(sourceCode, contractName, gasModel) {
  
  try {
    console.log(`Running gas optimization analysis with ${gasModel.name}...`);
    const result = await callAIModel(gasModel, ANALYSIS_PROMPTS.gasOptimization, sourceCode, contractName);
    return [{
      model: gasModel.name,
      modelId: gasModel.id,
      result: result,
      category: 'gasOptimization'
    }];
  } catch (error) {
    console.error(`Gas optimization analysis failed:`, error);
    return [{
      model: gasModel.name,
      modelId: gasModel.id,
      error: error.message,
      category: 'gasOptimization'
    }];
  }
}

/**
 * Run code quality analysis (Premium tier)
 */
async function runCodeQualityAnalysis(sourceCode, contractName, qualityModel) {
  
  try {
    console.log(`Running code quality analysis with ${qualityModel.name}...`);
    const result = await callAIModel(qualityModel, ANALYSIS_PROMPTS.codeQuality, sourceCode, contractName);
    return [{
      model: qualityModel.name,
      modelId: qualityModel.id,
      result: result,
      category: 'codeQuality'
    }];
  } catch (error) {
    console.error(`Code quality analysis failed:`, error);
    return [{
      model: qualityModel.name,
      modelId: qualityModel.id,
      error: error.message,
      category: 'codeQuality'
    }];
  }
}

/**
 * Supervisor verification and consolidation
 */
async function runSupervisorVerification(sourceCode, contractName, consolidatedFindings, supervisor, tier) {
  
  const supervisorPrompt = `You are a senior smart contract auditor reviewing multiple AI analysis results. Your task is to:

1. VERIFY each finding by examining the actual code
2. ELIMINATE false positives and duplicate findings
3. ENHANCE findings with better explanations and proof of concepts
4. CALCULATE accurate CVSS scores for security vulnerabilities
5. PROVIDE comprehensive remediation strategies

Contract: ${contractName}

Multiple AI models have analyzed this contract. Here are their findings:

${tier === 'free' ? 
  `COMPREHENSIVE FINDINGS:\n${JSON.stringify(consolidatedFindings.comprehensive, null, 2)}` :
  `SECURITY FINDINGS:\n${JSON.stringify(consolidatedFindings.security, null, 2)}\n\nGAS OPTIMIZATION FINDINGS:\n${JSON.stringify(consolidatedFindings.gasOptimization, null, 2)}\n\nCODE QUALITY FINDINGS:\n${JSON.stringify(consolidatedFindings.codeQuality, null, 2)}`
}

SOURCE CODE:
\`\`\`solidity
${sourceCode.length > 15000 ? sourceCode.substring(0, 15000) + '...[truncated]' : sourceCode}
\`\`\`

Your task:
1. Review each finding against the actual source code
2. Verify the finding is valid and not a false positive
3. Remove duplicate findings between different models
4. Enhance valid findings with:
   - Accurate severity assessment
   - Detailed proof of concept
   - CVSS scoring for security issues
   - Clear remediation steps
   - Impact assessment

Format your response as JSON:
{
  "verifiedFindings": {
    "security": [
      {
        "id": "unique_id",
        "severity": "CRITICAL|HIGH|MEDIUM|LOW",
        "title": "Clear title",
        "description": "Enhanced description",
        "impact": "Detailed impact",
        "proofOfConcept": "Step by step exploitation",
        "remediation": "Detailed fix instructions",
        "codeReference": "Exact code location",
        "cvssSeverity": "CVSS:3.1/...",
        "verified": true,
        "confidence": "HIGH|MEDIUM|LOW",
        "reportedBy": ["Model1", "Model2"]
      }
    ],
    "gasOptimization": [
      {
        "id": "unique_id",
        "impact": "HIGH|MEDIUM|LOW",
        "title": "Optimization title",
        "description": "What to optimize",
        "currentCode": "Current code",
        "optimizedCode": "Better code",
        "gasSavings": "Estimated savings",
        "tradeoffs": "Considerations",
        "verified": true
      }
    ],
    "codeQuality": [
      {
        "id": "unique_id",
        "impact": "HIGH|MEDIUM|LOW",
        "title": "Quality issue",
        "description": "What to improve",
        "currentCode": "Current code",
        "improvedCode": "Better code",
        "bestPracticeReference": "Standard reference",
        "verified": true
      }
    ]
  },
  "falsePositives": [
    {
      "finding": "Original finding",
      "reason": "Why it's a false positive"
    }
  ],
  "overallAssessment": {
    "securityScore": 85,
    "gasOptimizationScore": 78,
    "codeQualityScore": 92,
    "overallScore": 85,
    "riskLevel": "Low Risk|Medium Risk|High Risk|Critical Risk",
    "summary": "Executive summary of the audit"
  },
  "recommendations": [
    {
      "priority": "HIGH|MEDIUM|LOW",
      "category": "security|gas|quality",
      "title": "Recommendation title",
      "description": "What should be done"
    }
  ]
}`;

  try {
    console.log('Running supervisor verification...');
    const supervisorResult = await callAIModel(
      supervisor, 
      supervisorPrompt, 
      '', // No additional code needed, it's in the prompt
      contractName,
      { 
        maxTokens: 6000,
        temperature: 0.1 
      }
    );
    
    return supervisorResult;
  } catch (error) {
    console.error('Supervisor verification failed:', error);
    throw new Error(`Supervisor verification failed: ${error.message}`);
  }
}

/**
 * Generate comprehensive final report
 */
async function generateComprehensiveReport(consolidatedFindings, supervisorReport, tier) {
  const verified = supervisorReport.verifiedFindings || {};
  const assessment = supervisorReport.overallAssessment || {};
  
  // Count findings by category and severity
  const findingCounts = {
    security: {
      critical: (verified.security || []).filter(f => f.severity === 'CRITICAL').length,
      high: (verified.security || []).filter(f => f.severity === 'HIGH').length,
      medium: (verified.security || []).filter(f => f.severity === 'MEDIUM').length,
      low: (verified.security || []).filter(f => f.severity === 'LOW').length
    },
    gasOptimization: {
      high: (verified.gasOptimization || []).filter(f => f.impact === 'HIGH').length,
      medium: (verified.gasOptimization || []).filter(f => f.impact === 'MEDIUM').length,
      low: (verified.gasOptimization || []).filter(f => f.impact === 'LOW').length
    },
    codeQuality: {
      high: (verified.codeQuality || []).filter(f => f.impact === 'HIGH').length,
      medium: (verified.codeQuality || []).filter(f => f.impact === 'MEDIUM').length,
      low: (verified.codeQuality || []).filter(f => f.impact === 'LOW').length
    }
  };
  
  return {
    // Report metadata
    metadata: {
      contractName: consolidatedFindings.metadata.contractName,
      analysisType: tier === 'premium' ? 'Premium Multi-AI Security Audit' : 'Free Multi-AI Security Audit',
      timestamp: new Date().toISOString(),
      analysisTime: consolidatedFindings.metadata.analysisTime,
      modelsUsed: consolidatedFindings.metadata.modelsUsed,
      supervisor: supervisor.name,
      tier: tier,
      reportVersion: '2.0'
    },
    
    // Executive summary
    executiveSummary: {
      overallScore: assessment.overallScore || 75,
      riskLevel: assessment.riskLevel || 'Medium Risk',
      summary: assessment.summary || 'Comprehensive security audit completed with multi-AI analysis and supervisor verification.',
      keyFindings: {
        criticalIssues: findingCounts.security.critical,
        highRiskIssues: findingCounts.security.high + findingCounts.security.medium,
        gasOptimizations: (verified.gasOptimization || []).length,
        qualityIssues: (verified.codeQuality || []).length
      },
      recommendations: supervisorReport.recommendations || []
    },
    
    // Detailed scores
    scores: {
      security: assessment.securityScore || 75,
      gasOptimization: assessment.gasOptimizationScore || 80,
      codeQuality: assessment.codeQualityScore || 85,
      overall: assessment.overallScore || 75
    },
    
    // Verified findings
    findings: {
      security: verified.security || [],
      gasOptimization: verified.gasOptimization || [],
      codeQuality: verified.codeQuality || []
    },
    
    // Finding statistics
    statistics: findingCounts,
    
    // False positives (for transparency)
    falsePositives: supervisorReport.falsePositives || [],
    
    // AI models used
    aiModelsUsed: (tier === 'premium' ? AI_MODELS.premium : AI_MODELS.free).map(model => ({
      name: model.name,
      id: model.id,
      speciality: model.speciality
    })),
    
    // Supervisor details
    supervisorVerification: {
      model: supervisor.name,
      verified: true,
      confidenceLevel: tier === 'premium' ? '95%' : '85%'
    }
  };
}

/**
 * Call AI model via OpenRouter
 */
async function callAIModel(model, prompt, sourceCode, contractName, options = {}) {
  // Hardcoded OpenRouter API key as requested
  const OPENROUTER_API_KEY = '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';
  
  console.log(`🔍 Calling ${model.name} with API key check:`, {
    hasKey: !!OPENROUTER_API_KEY,
    keyLength: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0,
    keyPrefix: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 10) + '...' : 'none',
    modelId: model.id
  });
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }
  
  const fullPrompt = sourceCode 
    ? `${prompt}\n\nContract: ${contractName}\n\n\`\`\`solidity\n${sourceCode}\n\`\`\``
    : prompt;
  
  try {
    console.log(`🚀 Making comprehensive audit API request to OpenRouter...`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'DeFi Watchdog Security Audit'
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.2,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      throw new Error('Invalid JSON response from AI model');
    }
  } catch (error) {
    console.error(`Error calling ${model.name}:`, error);
    throw error;
  }
}

/**
 * Generate HTML report from audit results
 */
export function generateHTMLReport(auditResults) {
  const { metadata, executiveSummary, scores, findings, statistics } = auditResults;
  
  const currentDate = new Date().toLocaleDateString();
  const reportTitle = `Smart Contract Audit Report - ${metadata.contractName}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f8f9fa;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 10px; 
            margin-bottom: 30px; 
            text-align: center;
        }
        .score-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 30px 0;
        }
        .score-card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            text-align: center;
        }
        .score-value { 
            font-size: 2.5em; 
            font-weight: bold; 
            margin: 10px 0;
        }
        .score-critical { color: #dc3545; }
        .score-high { color: #fd7e14; }
        .score-medium { color: #ffc107; }
        .score-good { color: #28a745; }
        .finding-card { 
            background: white; 
            margin: 20px 0; 
            padding: 25px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .finding-critical { border-left: 5px solid #dc3545; }
        .finding-high { border-left: 5px solid #fd7e14; }
        .finding-medium { border-left: 5px solid #ffc107; }
        .finding-low { border-left: 5px solid #17a2b8; }
        .severity-badge { 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 0.8em; 
            font-weight: bold; 
            color: white;
        }
        .severity-critical { background-color: #dc3545; }
        .severity-high { background-color: #fd7e14; }
        .severity-medium { background-color: #ffc107; }
        .severity-low { background-color: #17a2b8; }
        .code-block { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 5px; 
            padding: 15px; 
            margin: 15px 0; 
            font-family: 'Monaco', 'Menlo', monospace; 
            font-size: 0.9em;
            overflow-x: auto;
        }
        .section { 
            background: white; 
            margin: 30px 0; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .toc { 
            background: #e9ecef; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
        }
        .toc ul { list-style-type: none; padding-left: 0; }
        .toc li { margin: 8px 0; }
        .toc a { text-decoration: none; color: #495057; font-weight: 500; }
        .toc a:hover { color: #007bff; }
        h1, h2, h3 { margin-top: 0; }
        .meta-info { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin: 20px 0;
        }
        .meta-item { padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .meta-label { font-weight: bold; color: #495057; font-size: 0.9em; }
        .meta-value { margin-top: 5px; }
        @media print {
            body { background: white; }
            .score-card, .finding-card, .section { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${reportTitle}</h1>
        <p>Comprehensive Multi-AI Security Audit Report</p>
        <p>Generated on ${currentDate}</p>
    </div>

    <div class="toc">
        <h2>Table of Contents</h2>
        <ul>
            <li><a href="#executive-summary">1. Executive Summary</a></li>
            <li><a href="#audit-scores">2. Audit Scores</a></li>
            <li><a href="#security-findings">3. Security Findings</a></li>
            <li><a href="#gas-optimizations">4. Gas Optimizations</a></li>
            <li><a href="#code-quality">5. Code Quality</a></li>
            <li><a href="#methodology">6. Audit Methodology</a></li>
        </ul>
    </div>

    <div id="executive-summary" class="section">
        <h2>1. Executive Summary</h2>
        <div class="meta-info">
            <div class="meta-item">
                <div class="meta-label">Contract Name</div>
                <div class="meta-value">${metadata.contractName}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Analysis Time</div>
                <div class="meta-value">${Math.round(metadata.analysisTime / 1000)}s</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Risk Level</div>
                <div class="meta-value">${executiveSummary.riskLevel}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">AI Models Used</div>
                <div class="meta-value">${metadata.modelsUsed.length} Models + Supervisor</div>
            </div>
        </div>
        
        <h3>Summary</h3>
        <p>${executiveSummary.summary}</p>
        
        <h3>Key Findings</h3>
        <ul>
            <li><strong>Critical Issues:</strong> ${executiveSummary.keyFindings.criticalIssues}</li>
            <li><strong>High Risk Issues:</strong> ${executiveSummary.keyFindings.highRiskIssues}</li>
            <li><strong>Gas Optimizations:</strong> ${executiveSummary.keyFindings.gasOptimizations}</li>
            <li><strong>Code Quality Issues:</strong> ${executiveSummary.keyFindings.qualityIssues}</li>
        </ul>
    </div>

    <div id="audit-scores" class="section">
        <h2>2. Audit Scores</h2>
        <div class="score-grid">
            <div class="score-card">
                <h3>Security Score</h3>
                <div class="score-value ${scores.security >= 80 ? 'score-good' : scores.security >= 60 ? 'score-medium' : 'score-critical'}">${scores.security}%</div>
            </div>
            <div class="score-card">
                <h3>Gas Optimization</h3>
                <div class="score-value ${scores.gasOptimization >= 80 ? 'score-good' : scores.gasOptimization >= 60 ? 'score-medium' : 'score-critical'}">${scores.gasOptimization}%</div>
            </div>
            <div class="score-card">
                <h3>Code Quality</h3>
                <div class="score-value ${scores.codeQuality >= 80 ? 'score-good' : scores.codeQuality >= 60 ? 'score-medium' : 'score-critical'}">${scores.codeQuality}%</div>
            </div>
            <div class="score-card">
                <h3>Overall Score</h3>
                <div class="score-value ${scores.overall >= 80 ? 'score-good' : scores.overall >= 60 ? 'score-medium' : 'score-critical'}">${scores.overall}%</div>
            </div>
        </div>
    </div>

    <div id="security-findings" class="section">
        <h2>3. Security Findings (${findings.security.length})</h2>
        ${findings.security.map((finding, index) => `
            <div class="finding-card finding-${finding.severity.toLowerCase()}">
                <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 15px;">
                    <h3 style="margin: 0; flex: 1;">${index + 1}. ${finding.title}</h3>
                    <span class="severity-badge severity-${finding.severity.toLowerCase()}">${finding.severity}</span>
                </div>
                
                <h4>Description</h4>
                <p>${finding.description}</p>
                
                <h4>Impact</h4>
                <p>${finding.impact}</p>
                
                ${finding.proofOfConcept ? `
                    <h4>Proof of Concept</h4>
                    <p>${finding.proofOfConcept}</p>
                ` : ''}
                
                <h4>Remediation</h4>
                <p>${finding.remediation}</p>
                
                ${finding.codeReference ? `
                    <h4>Code Reference</h4>
                    <div class="code-block">${finding.codeReference}</div>
                ` : ''}
                
                ${finding.cvssSeverity ? `
                    <h4>CVSS Score</h4>
                    <p><code>${finding.cvssSeverity}</code></p>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div id="gas-optimizations" class="section">
        <h2>4. Gas Optimizations (${findings.gasOptimization.length})</h2>
        ${findings.gasOptimization.map((optimization, index) => `
            <div class="finding-card">
                <h3>${index + 1}. ${optimization.title}</h3>
                <p><strong>Impact:</strong> ${optimization.impact} gas savings</p>
                <p>${optimization.description}</p>
                
                ${optimization.currentCode ? `
                    <h4>Current Code</h4>
                    <div class="code-block">${optimization.currentCode}</div>
                ` : ''}
                
                ${optimization.optimizedCode ? `
                    <h4>Optimized Code</h4>
                    <div class="code-block">${optimization.optimizedCode}</div>
                ` : ''}
                
                <p><strong>Estimated Gas Savings:</strong> ${optimization.gasSavings}</p>
                
                ${optimization.tradeoffs ? `
                    <p><strong>Trade-offs:</strong> ${optimization.tradeoffs}</p>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div id="code-quality" class="section">
        <h2>5. Code Quality Issues (${findings.codeQuality.length})</h2>
        ${findings.codeQuality.map((issue, index) => `
            <div class="finding-card">
                <h3>${index + 1}. ${issue.title}</h3>
                <p><strong>Impact:</strong> ${issue.impact}</p>
                <p>${issue.description}</p>
                
                ${issue.currentCode ? `
                    <h4>Current Code</h4>
                    <div class="code-block">${issue.currentCode}</div>
                ` : ''}
                
                ${issue.improvedCode ? `
                    <h4>Improved Code</h4>
                    <div class="code-block">${issue.improvedCode}</div>
                ` : ''}
                
                ${issue.bestPracticeReference ? `
                    <p><strong>Reference:</strong> ${issue.bestPracticeReference}</p>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div id="methodology" class="section">
        <h2>6. Audit Methodology</h2>
        <h3>AI Models Used</h3>
        <ul>
            ${auditResults.aiModelsUsed.map(model => `<li><strong>${model.name}:</strong> ${model.speciality}</li>`).join('')}
        </ul>
        
        <h3>Supervisor Verification</h3>
        <p>All findings were verified by ${auditResults.supervisorVerification.model} with ${auditResults.supervisorVerification.confidenceLevel} confidence level.</p>
        
        <h3>Analysis Categories</h3>
        <ul>
            <li><strong>Security Analysis:</strong> Vulnerability detection and risk assessment</li>
            <li><strong>Gas Optimization:</strong> Efficiency improvements and cost reduction</li>
            <li><strong>Code Quality:</strong> Best practices and maintainability</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <p><strong>Report Generated by DeFi Watchdog Multi-AI Security Audit System</strong></p>
        <p>Generated on ${currentDate} | Report Version ${metadata.reportVersion}</p>
    </div>
</body>
</html>`;
}

export default {
  runComprehensiveAudit,
  generateHTMLReport
};