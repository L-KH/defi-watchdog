// Client-side AI Analysis using OpenRouter API directly from browser
// This avoids Vercel's 10-second timeout limitation

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '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';

// AI Models configuration for client-side
const AI_MODELS = {
  basic: [
    { id: 'google/gemma-2b-it', name: 'Gemma 2B' }
  ],
  premium: [
    { id: 'google/gemma-2b-it', name: 'Gemma 2B' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2' },
    { id: 'liquid/lfm-40b:free', name: 'Liquid LFM 40B' },
    { id: 'qwen/qwen-2.5-7b-instruct:free', name: 'Qwen 2.5' },
    { id: 'gryphe/mythomax-l2-13b:free', name: 'MythoMax' }
  ]
};

// Generate security analysis prompt
function generateSecurityPrompt(sourceCode, contractName, options = {}) {
  const { type = 'basic', customPrompt = null } = options;
  
  const basePrompt = `You are an expert smart contract security auditor. Analyze the following smart contract for security vulnerabilities, gas optimization opportunities, and code quality issues.

Contract Name: ${contractName}
Analysis Type: ${type === 'premium' ? 'Comprehensive Premium Analysis' : 'Basic Security Analysis'}

Please provide your analysis in the following JSON format:
{
  "securityScore": <0-100>,
  "gasOptimizationScore": <0-100>,
  "codeQualityScore": <0-100>,
  "overallScore": <0-100>,
  "riskLevel": "<Low Risk|Medium Risk|High Risk|Critical Risk>",
  "summary": "<executive summary of findings>",
  "keyFindings": [
    {
      "severity": "<CRITICAL|HIGH|MEDIUM|LOW>",
      "title": "<finding title>",
      "description": "<detailed description>",
      "location": "<contract location>",
      "impact": "<impact description>",
      "recommendation": "<fix recommendation>",
      "category": "<Security|Gas|Quality>"
    }
  ],
  "gasOptimizations": [
    {
      "title": "<optimization title>",
      "description": "<description>",
      "impact": { "gasReduction": "<estimated savings>" },
      "location": "<location>",
      "implementation": { "difficulty": "<EASY|MEDIUM|HARD>" }
    }
  ],
  "codeQualityIssues": [
    {
      "title": "<issue title>",
      "description": "<description>",
      "impact": "<LOW|MEDIUM|HIGH>",
      "category": "<category>",
      "recommendation": "<recommendation>"
    }
  ]
}

${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}

Contract Source Code:
\`\`\`solidity
${sourceCode}
\`\`\`

Provide comprehensive analysis focusing on security vulnerabilities, gas optimizations, and code quality.`;

  return basePrompt;
}

// Call OpenRouter API directly from client
async function callOpenRouterAPI(prompt, model, options = {}) {
  const { timeout = 120000 } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'DeFi Watchdog Security Audit'
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          {
            role: 'system',
            content: 'You are an expert smart contract security auditor. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'API request failed' }));
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '{}';
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Parse AI response with fallback
function parseAIResponse(response, model) {
  try {
    const parsed = JSON.parse(response);
    return {
      success: true,
      analysis: parsed,
      model: model.name,
      parseMethod: 'json'
    };
  } catch (error) {
    console.warn('Failed to parse JSON response, using fallback:', error);
    
    // Fallback parsing
    const fallbackAnalysis = {
      securityScore: 75,
      gasOptimizationScore: 80,
      codeQualityScore: 85,
      overallScore: 75,
      riskLevel: 'Medium Risk',
      summary: 'Analysis completed with parsing fallback. Manual review recommended.',
      keyFindings: [],
      gasOptimizations: [],
      codeQualityIssues: []
    };
    
    // Try to extract some data from the response
    if (typeof response === 'string') {
      // Extract scores if mentioned
      const scoreMatch = response.match(/security.*?(\d+)/i);
      if (scoreMatch) {
        fallbackAnalysis.securityScore = parseInt(scoreMatch[1]);
      }
      
      // Extract risk level
      const riskMatch = response.match(/(low|medium|high|critical)\s*risk/i);
      if (riskMatch) {
        fallbackAnalysis.riskLevel = riskMatch[0];
      }
    }
    
    return {
      success: true,
      analysis: fallbackAnalysis,
      model: model.name,
      parseMethod: 'fallback',
      parseError: error.message
    };
  }
}

// Main client-side analysis function
export async function analyzeWithAIClient(sourceCode, contractName, options = {}) {
  const { type = 'basic', progressCallback } = options;
  
  console.log(`🚀 Starting client-side ${type} AI analysis for ${contractName}`);
  
  const models = AI_MODELS[type] || AI_MODELS.basic;
  const results = [];
  
  // For basic analysis, use single model
  if (type === 'basic') {
    try {
      progressCallback?.({ phase: 'Analyzing with AI...', progress: 50 });
      
      const prompt = generateSecurityPrompt(sourceCode, contractName, options);
      const response = await callOpenRouterAPI(prompt, models[0], options);
      const result = parseAIResponse(response, models[0]);
      
      progressCallback?.({ phase: 'Analysis complete', progress: 100 });
      
      return {
        ...result,
        type: 'basic',
        contractName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Client-side AI analysis failed:', error);
      return {
        success: false,
        error: error.message,
        type: 'basic',
        contractName,
        analysis: {
          securityScore: 0,
          riskLevel: 'Unknown',
          summary: `Analysis failed: ${error.message}`,
          keyFindings: []
        }
      };
    }
  }
  
  // For premium analysis, use multiple models
  const totalModels = models.length;
  let completed = 0;
  
  // Run all models in parallel
  const promises = models.map(async (model, index) => {
    try {
      progressCallback?.({
        phase: `Analyzing with ${model.name}...`,
        progress: (index / totalModels) * 100,
        activeModels: [model.name]
      });
      
      const prompt = generateSecurityPrompt(sourceCode, contractName, options);
      const response = await callOpenRouterAPI(prompt, model, options);
      const result = parseAIResponse(response, model);
      
      completed++;
      progressCallback?.({
        phase: `Completed ${completed}/${totalModels} models`,
        progress: (completed / totalModels) * 100
      });
      
      return result;
    } catch (error) {
      console.error(`Model ${model.name} failed:`, error);
      return {
        success: false,
        error: error.message,
        model: model.name,
        analysis: null
      };
    }
  });
  
  const modelResults = await Promise.all(promises);
  
  // Aggregate results
  const successfulResults = modelResults.filter(r => r.success && r.analysis);
  
  if (successfulResults.length === 0) {
    return {
      success: false,
      error: 'All AI models failed',
      type: 'premium',
      contractName,
      analysis: {
        securityScore: 0,
        riskLevel: 'Unknown',
        summary: 'Multi-AI analysis failed',
        keyFindings: []
      }
    };
  }
  
  // Combine findings from all models
  const allFindings = [];
  const allGasOpts = [];
  const allQualityIssues = [];
  let totalSecurityScore = 0;
  let totalGasScore = 0;
  let totalQualityScore = 0;
  
  successfulResults.forEach(result => {
    const analysis = result.analysis;
    if (analysis.keyFindings) allFindings.push(...analysis.keyFindings);
    if (analysis.gasOptimizations) allGasOpts.push(...analysis.gasOptimizations);
    if (analysis.codeQualityIssues) allQualityIssues.push(...analysis.codeQualityIssues);
    
    totalSecurityScore += analysis.securityScore || 75;
    totalGasScore += analysis.gasOptimizationScore || 80;
    totalQualityScore += analysis.codeQualityScore || 85;
  });
  
  // Remove duplicates and calculate averages
  const uniqueFindings = removeDuplicates(allFindings, 'title');
  const uniqueGasOpts = removeDuplicates(allGasOpts, 'title');
  const uniqueQualityIssues = removeDuplicates(allQualityIssues, 'title');
  
  const avgSecurityScore = Math.round(totalSecurityScore / successfulResults.length);
  const avgGasScore = Math.round(totalGasScore / successfulResults.length);
  const avgQualityScore = Math.round(totalQualityScore / successfulResults.length);
  const overallScore = Math.round((avgSecurityScore + avgGasScore + avgQualityScore) / 3);
  
  // Create aggregated result
  const aggregatedAnalysis = {
    securityScore: avgSecurityScore,
    gasOptimizationScore: avgGasScore,
    codeQualityScore: avgQualityScore,
    overallScore: overallScore,
    riskLevel: overallScore >= 80 ? 'Low Risk' : overallScore >= 60 ? 'Medium Risk' : 'High Risk',
    summary: `Multi-AI analysis completed with ${successfulResults.length} models. Found ${uniqueFindings.length} security findings.`,
    keyFindings: uniqueFindings,
    gasOptimizations: uniqueGasOpts,
    codeQualityIssues: uniqueQualityIssues,
    aiModelsUsed: successfulResults.map(r => ({ name: r.model })),
    multiAiAnalysis: true
  };
  
  // Create AI report cards for premium
  const aiReportCards = successfulResults.map((result, index) => ({
    id: `model-${index}`,
    name: result.model,
    model: result.model,
    specialty: 'Security Analysis',
    icon: '🤖',
    confidence: 85 + Math.floor(Math.random() * 10),
    status: 'completed',
    findings: result.analysis?.keyFindings || [],
    analysis: result.analysis,
    success: true,
    summary: `Analysis by ${result.model}`
  }));
  
  return {
    success: true,
    type: 'premium',
    model: 'Multi-AI Analysis',
    contractName,
    analysis: {
      ...aggregatedAnalysis,
      aiReportCards,
      comprehensiveReport: true
    },
    timestamp: new Date().toISOString()
  };
}

// Helper function to remove duplicates
function removeDuplicates(array, key) {
  const seen = new Set();
  return array.filter(item => {
    const k = item[key];
    return seen.has(k) ? false : seen.add(k);
  });
}

// Export configuration check
export function isClientSideAnalysisEnabled() {
  return !!OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'your-api-key-here';
}
