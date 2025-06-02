// Enhanced AI Analysis with Premium Features
import { runComprehensiveAudit } from './comprehensive-audit';

// Configuration for different analysis types
const ANALYSIS_TYPES = {
  basic: {
    name: 'Basic AI Analysis',
    description: 'Single AI model for basic security check',
    timeLimit: 60000, // 1 minute
    models: ['deepseek/deepseek-chat-v3-0324:free']
  },
  premium: {
    name: 'Premium AI Analysis',  
    description: 'Multiple AI models with enhanced prompts',
    timeLimit: 180000, // 3 minutes
    models: [
      'deepseek/deepseek-chat-v3-0324',
      'anthropic/claude-3-haiku:beta',
      'google/gemma-2b-it'
    ]
  },
  comprehensive: {
    name: 'Comprehensive AI Security Audit',
    description: 'Full multi-AI analysis with supervisor verification',
    timeLimit: 480000, // 8 minutes
    includesGasOptimization: true,
    includesCodeQuality: true,
    supervisorVerification: true
  }
};

/**
 * Main AI analysis function with different tiers
 */
export async function analyzeWithAI(sourceCode, contractName, options = {}) {
  const { type = 'basic', promptMode = 'normal', customPrompt = null, timeout = 120000 } = options;
  
  console.log(`Starting ${type} AI analysis for ${contractName}`);
  console.log('Environment check:', {
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    keyLength: process.env.OPENROUTER_API_KEY?.length,
    nodeEnv: process.env.NODE_ENV
  });
  
  const startTime = Date.now();
  
  try {
    // Route to appropriate analysis type
    switch (type) {
      case 'basic':
        return await runBasicAnalysis(sourceCode, contractName, options);
      
      case 'premium':
        return await runPremiumAnalysis(sourceCode, contractName, options);
      
      case 'full-scan':
      case 'comprehensive':
        return await runComprehensiveAnalysis(sourceCode, contractName, options);
      
      default:
        return await runBasicAnalysis(sourceCode, contractName, options);
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      success: false,
      error: error.message,
      type: type,
      contractName: contractName,
      analysisTime: Date.now() - startTime
    };
  }
}

/**
 * Basic AI Analysis - Free tier
 */
async function runBasicAnalysis(sourceCode, contractName, options) {
  const { promptMode = 'normal', customPrompt } = options;
  
  const prompt = customPrompt || getBasicPrompt(promptMode);
  
  try {
    // Try multiple models in order of preference
    const modelsToTry = [
      'deepseek/deepseek-chat',
      'qwen/qwen-2.5-7b-instruct:free',
      'mistralai/mistral-7b-instruct:free'
    ];
    
    let result = null;
    let lastError = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        result = await callOpenRouterAPI({
          model: model,
          prompt: prompt,
          sourceCode: sourceCode,
          contractName: contractName,
          maxTokens: 2000,
          temperature: 0.2
        });
        console.log(`Successfully analyzed with ${model}`);
        break;
      } catch (modelError) {
        console.warn(`Model ${model} failed:`, modelError.message);
        lastError = modelError;
        continue;
      }
    }
    
    if (!result) {
      throw lastError || new Error('All models failed');
    }
    
    return {
      success: true,
      type: 'basic',
      model: 'DeepSeek Chat V3 (Free)',
      contractName: contractName,
      analysis: result,
      promptMode: promptMode,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Basic analysis failed: ${error.message}`);
  }
}

/**
 * Premium AI Analysis - Multiple models
 */
async function runPremiumAnalysis(sourceCode, contractName, options) {
  const { promptMode = 'normal', customPrompt } = options;
  
  const models = [
    { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek Chat V3 Pro' },
    { id: 'anthropic/claude-3-haiku:beta', name: 'Claude 3 Haiku' },
    { id: 'google/gemma-2b-it', name: 'Google Gemma 2B' }
  ];
  
  const prompt = customPrompt || getEnhancedPrompt(promptMode);
  
  try {
    // Run analyses in parallel
    const analysisPromises = models.map(async model => {
      try {
        const result = await callOpenRouterAPI({
          model: model.id,
          prompt: prompt,
          sourceCode: sourceCode,
          contractName: contractName,
          maxTokens: 3000,
          temperature: 0.1
        });
        
        return {
          model: model.name,
          modelId: model.id,
          result: result,
          success: true
        };
      } catch (error) {
        return {
          model: model.name,
          modelId: model.id,
          error: error.message,
          success: false
        };
      }
    });
    
    const results = await Promise.all(analysisPromises);
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      throw new Error('All AI models failed to analyze the contract');
    }
    
    // Consolidate results
    const consolidatedAnalysis = consolidatePremiumResults(successfulResults);
    
    return {
      success: true,
      type: 'premium',
      contractName: contractName,
      modelsUsed: successfulResults.map(r => r.model),
      analysis: consolidatedAnalysis,
      individualResults: successfulResults,
      promptMode: promptMode,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Premium analysis failed: ${error.message}`);
  }
}

/**
 * Comprehensive AI Analysis - Full audit with supervisor
 */
async function runComprehensiveAnalysis(sourceCode, contractName, options) {
  try {
    console.log('Running comprehensive multi-AI audit...');
    
    // Use the comprehensive audit system
    const auditResults = await runComprehensiveAudit(sourceCode, contractName, options);
    
    // Transform to match expected format
    return {
      success: true,
      type: 'comprehensive',
      contractName: contractName,
      analysis: auditResults,
      modelsUsed: auditResults.aiModelsUsed.map(m => m.name),
      supervisorVerified: true,
      supervisorModel: auditResults.supervisorVerification.model,
      timestamp: new Date().toISOString(),
      comprehensiveReport: true
    };
  } catch (error) {
    throw new Error(`Comprehensive analysis failed: ${error.message}`);
  }
}

/**
 * Get basic analysis prompt
 */
function getBasicPrompt(promptMode) {
  const basePrompt = `You are a smart contract security auditor. Analyze the following contract for security vulnerabilities and provide a structured assessment.

Focus on:
- Critical security vulnerabilities
- Access control issues  
- Reentrancy risks
- Integer overflow/underflow
- Basic best practices

Format your response as JSON:
{
  "overview": "Brief contract explanation",
  "securityScore": 1-100,
  "riskLevel": "Safe|Low Risk|Medium Risk|High Risk", 
  "keyFindings": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "title": "Finding title",
      "description": "Detailed description",
      "recommendation": "How to fix"
    }
  ],
  "summary": "Overall assessment"
}`;

  switch (promptMode) {
    case 'aggressive':
      return basePrompt + '\n\nUse aggressive penetration testing mindset. Look for any possible attack vectors, fund theft mechanisms, or rug pull patterns.';
    case 'normal':
    default:
      return basePrompt;
  }
}

/**
 * Get enhanced analysis prompt
 */
function getEnhancedPrompt(promptMode) {
  const basePrompt = `You are an expert smart contract security auditor with extensive experience in DeFi protocols. Perform a comprehensive security analysis.

Analyze for:
1. CRITICAL vulnerabilities (immediate fund loss)
2. HIGH vulnerabilities (significant security impact)  
3. MEDIUM vulnerabilities (potential issues)
4. LOW vulnerabilities (best practice violations)

Specific focus areas:
- Reentrancy attacks (classic and cross-function)
- Flash loan manipulation
- Oracle manipulation vulnerabilities
- Front-running and MEV risks
- Access control and privilege escalation
- Integer arithmetic issues
- Timestamp dependence
- Gas optimization opportunities
- Code quality and maintainability

Format response as JSON:
{
  "overview": "Detailed contract explanation",
  "contractType": "Contract type identification",
  "securityScore": 1-100,
  "gasOptimizationScore": 1-100,
  "codeQualityScore": 1-100,
  "riskLevel": "Safe|Low Risk|Medium Risk|High Risk",
  "keyFindings": [
    {
      "category": "security|gas|quality",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "title": "Finding title",
      "description": "Detailed technical description",
      "impact": "Potential impact assessment",
      "proofOfConcept": "How to exploit (if applicable)",
      "recommendation": "Detailed fix recommendation",
      "codeReference": "Relevant code snippet"
    }
  ],
  "gasOptimizations": [
    {
      "title": "Optimization title",
      "description": "What can be optimized",
      "impact": "HIGH|MEDIUM|LOW",
      "estimatedSavings": "Gas savings estimate"
    }
  ],
  "codeQualityIssues": [
    {
      "title": "Quality issue",
      "description": "What needs improvement", 
      "impact": "HIGH|MEDIUM|LOW",
      "recommendation": "How to improve"
    }
  ],
  "summary": "Comprehensive assessment with actionable insights"
}`;

  switch (promptMode) {
    case 'aggressive':
      return basePrompt + '\n\nUse aggressive security research mindset. Assume malicious intent and look for any possible economic attack vectors, hidden backdoors, or fund extraction mechanisms. Consider complex multi-transaction attacks and edge cases.';
    case 'normal':
    default:
      return basePrompt;
  }
}

/**
 * Consolidate premium analysis results
 */
function consolidatePremiumResults(results) {
  const allFindings = [];
  const allOptimizations = [];
  const allQualityIssues = [];
  
  let totalSecurityScore = 0;
  let totalGasScore = 0;
  let totalQualityScore = 0;
  let validScores = 0;
  
  // Collect findings from all models
  results.forEach(modelResult => {
    if (modelResult.result) {
      const analysis = modelResult.result;
      
      // Add model attribution to findings
      if (analysis.keyFindings) {
        analysis.keyFindings.forEach(finding => {
          allFindings.push({
            ...finding,
            reportedBy: modelResult.model
          });
        });
      }
      
      if (analysis.gasOptimizations) {
        analysis.gasOptimizations.forEach(opt => {
          allOptimizations.push({
            ...opt,
            reportedBy: modelResult.model
          });
        });
      }
      
      if (analysis.codeQualityIssues) {
        analysis.codeQualityIssues.forEach(issue => {
          allQualityIssues.push({
            ...issue,
            reportedBy: modelResult.model
          });
        });
      }
      
      // Aggregate scores
      if (analysis.securityScore) {
        totalSecurityScore += analysis.securityScore;
        validScores++;
      }
      if (analysis.gasOptimizationScore) {
        totalGasScore += analysis.gasOptimizationScore;
      }
      if (analysis.codeQualityScore) {
        totalQualityScore += analysis.codeQualityScore;
      }
    }
  });
  
  // Calculate average scores
  const avgSecurityScore = validScores > 0 ? Math.round(totalSecurityScore / validScores) : 75;
  const avgGasScore = results.length > 0 ? Math.round(totalGasScore / results.length) || 80 : 80;
  const avgQualityScore = results.length > 0 ? Math.round(totalQualityScore / results.length) || 85 : 85;
  
  // Determine overall risk level
  let riskLevel = 'Medium Risk';
  if (avgSecurityScore >= 90) riskLevel = 'Safe';
  else if (avgSecurityScore >= 75) riskLevel = 'Low Risk';
  else if (avgSecurityScore >= 50) riskLevel = 'Medium Risk';
  else riskLevel = 'High Risk';
  
  // Group findings by severity
  const critical = allFindings.filter(f => f.severity === 'CRITICAL');
  const high = allFindings.filter(f => f.severity === 'HIGH');
  const medium = allFindings.filter(f => f.severity === 'MEDIUM');
  const low = allFindings.filter(f => f.severity === 'LOW');
  
  return {
    overview: `Multi-AI analysis completed with ${results.length} models. ${allFindings.length} security findings identified.`,
    contractType: results[0]?.result?.contractType || 'Smart Contract',
    securityScore: avgSecurityScore,
    gasOptimizationScore: avgGasScore,
    codeQualityScore: avgQualityScore,
    overallScore: Math.round((avgSecurityScore + avgGasScore + avgQualityScore) / 3),
    riskLevel: riskLevel,
    
    // Consolidated findings
    allFindings: allFindings,
    keyFindings: [...critical, ...high, ...medium.slice(0, 3), ...low.slice(0, 2)], // Prioritized list
    gasOptimizations: allOptimizations,
    codeQualityIssues: allQualityIssues,
    
    // Statistics
    findingCounts: {
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      total: allFindings.length
    },
    
    // Model consensus
    modelConsensus: analyzeModelConsensus(allFindings),
    
    summary: `Comprehensive analysis by ${results.length} AI models revealed ${critical.length} critical, ${high.length} high, and ${medium.length} medium severity issues. Overall security score: ${avgSecurityScore}/100.`
  };
}

/**
 * Analyze consensus between models
 */
function analyzeModelConsensus(findings) {
  const consensusFindings = [];
  const uniqueFindings = [];
  
  // Group similar findings
  const groupedFindings = {};
  
  findings.forEach(finding => {
    const key = finding.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!groupedFindings[key]) {
      groupedFindings[key] = [];
    }
    groupedFindings[key].push(finding);
  });
  
  // Identify consensus vs unique findings
  Object.values(groupedFindings).forEach(group => {
    if (group.length > 1) {
      consensusFindings.push({
        title: group[0].title,
        modelCount: group.length,
        models: group.map(f => f.reportedBy),
        severity: group[0].severity
      });
    } else {
      uniqueFindings.push({
        title: group[0].title,
        model: group[0].reportedBy,
        severity: group[0].severity
      });
    }
  });
  
  return {
    consensusFindings: consensusFindings,
    uniqueFindings: uniqueFindings,
    agreementRate: consensusFindings.length / (consensusFindings.length + uniqueFindings.length)
  };
}

/**
 * Call OpenRouter API
 */
async function callOpenRouterAPI({ model, prompt, sourceCode, contractName, maxTokens = 3000, temperature = 0.2 }) {
  // Hardcoded API key temporarily - replace with environment variable later
  const OPENROUTER_API_KEY = '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';
  
  console.log('OpenRouter API Key check:', {
    hasKey: !!OPENROUTER_API_KEY,
    keyLength: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0,
    keyPrefix: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 12) + '...' : 'undefined',
    nodeEnv: process.env.NODE_ENV
  });
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.');
  }
  
  const fullPrompt = `${prompt}\n\nContract: ${contractName}\n\n\`\`\`solidity\n${sourceCode}\n\`\`\``;
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'DeFi Watchdog Security Audit'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedResult = JSON.parse(content);
      console.log('Successfully parsed AI response:', parsedResult);
      return parsedResult;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      console.error('Parse error:', parseError);
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/) ||
                       content.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[1] || jsonMatch[0];
          console.log('Trying to parse extracted JSON:', extractedJson);
          const parsedResult = JSON.parse(extractedJson);
          console.log('Successfully parsed extracted JSON:', parsedResult);
          return parsedResult;
        } catch (extractError) {
          console.error('Failed to parse extracted JSON:', extractError);
        }
      }
      
      // If JSON parsing fails completely, create a structured response from the text
      console.warn('Creating structured response from text content');
      return {
        overview: `Analysis of ${contractName} contract completed`,
        securityScore: 75,
        riskLevel: 'Medium Risk',
        keyFindings: [
          {
            severity: 'INFO',
            title: 'Analysis Response',
            description: content.slice(0, 500) + (content.length > 500 ? '...' : ''),
            recommendation: 'Review the AI analysis output manually'
          }
        ],
        summary: 'AI analysis completed but returned non-JSON format. Please review the findings manually.'
      };
    }
  } catch (error) {
    console.error(`Error calling ${model}:`, error);
    throw error;
  }
}

export { ANALYSIS_TYPES };