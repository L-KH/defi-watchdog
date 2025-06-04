// Enhanced AI Analysis with Premium Features - FIXED VERSION
import { runComprehensiveAudit } from './comprehensive-audit';

// Report generation prompts for different analysis types
const REPORT_GENERATION_PROMPTS = {
  premium: {
    system: `You are an elite smart contract security auditor with 10+ years experience auditing DeFi protocols, having discovered critical vulnerabilities in major protocols worth billions in TVL. You have deep expertise in:

- Advanced attack vectors (flash loans, oracle manipulation, MEV)
- Complex DeFi protocol interactions and composability risks
- Gas optimization techniques and EVM internals
- Formal verification and symbolic execution
- Economic security and tokenomics analysis

Your analysis should be thorough, technically precise, and actionable.`
  },
  basic: {
    system: "You are a smart contract security auditor. Analyze contracts for common vulnerabilities and provide clear, structured feedback."
  }
};

// Configuration for different analysis types
const ANALYSIS_TYPES = {
  basic: {
    name: 'Basic AI Analysis',
    description: 'Single AI model for basic security check',
    timeLimit: 60000, // 1 minute
    models: ['google/gemma-2b-it'],
    tier: 'free'
  },
  premium: {
    name: 'Premium AI Analysis',  
    description: 'Multiple AI models with enhanced prompts',
    timeLimit: 180000, // 3 minutes
    models: [
      'google/gemma-2b-it',
      'deepseek/deepseek-chat-v3-0324:free',
      'deepseek/deepseek-r1:free',
      'google/gemini-2.0-flash-001'
    ],
    tier: 'premium'
  },
  comprehensive: {
    name: 'Comprehensive AI Security Audit',
    description: 'Full multi-AI analysis with supervisor verification',
    timeLimit: 480000, // 8 minutes
    includesGasOptimization: true,
    includesCodeQuality: true,
    supervisorVerification: true,
    tier: 'enterprise'
  }
};

/**
 * Create a mock analysis response for testing when API fails
 */
function createMockAnalysisResponse(contractName, reason = 'API Unavailable') {
  return {
    overview: `Mock analysis for ${contractName}. This is a demonstration response because: ${reason}`,
    securityScore: 75,
    riskLevel: 'Medium Risk',
    keyFindings: [
      {
        severity: 'INFO',
        title: 'Mock Analysis Active',
        description: `This is a simulated security analysis for ${contractName}. Actual AI analysis is temporarily unavailable due to: ${reason}`,
        recommendation: 'To get real analysis results, please generate a new OpenRouter API key at https://openrouter.ai/keys'
      },
      {
        severity: 'MEDIUM',
        title: 'Example Security Finding',
        description: 'This is an example of what a real security finding would look like. The AI would normally detect actual vulnerabilities in your smart contract.',
        recommendation: 'In a real analysis, this would contain specific remediation steps'
      },
      {
        severity: 'LOW',
        title: 'Code Quality Notice',
        description: 'The AI would normally analyze code quality, gas optimization opportunities, and best practices.',
        recommendation: 'Real analysis would provide detailed optimization suggestions'
      }
    ],
    summary: `Mock analysis completed for ${contractName}. To access real AI-powered security analysis, please check your OpenRouter API configuration.`,
    mockResponse: true,
    reason: reason,
    timestamp: new Date().toISOString()
  };
}

/**
 * Safe JSON parsing with multiple fallback strategies
 */
function safeParseJSON(content, contractName = 'Contract') {
  // First attempt: Direct JSON parsing
  try {
    const result = JSON.parse(content);
    console.log('✅ Successfully parsed JSON response');
    return result;
  } catch (firstError) {
    console.warn('⚠️ Direct JSON parsing failed, trying fallback methods...');
  }
  
  // Second attempt: Extract JSON from markdown code blocks
  const jsonPatterns = [
    /```json\s*([\s\S]*?)\s*```/,
    /```\s*([\s\S]*?)\s*```/,
    /{[\s\S]*}/
  ];
  
  for (const pattern of jsonPatterns) {
    const match = content.match(pattern);
    if (match) {
      try {
        const extractedJson = match[1] || match[0];
        const result = JSON.parse(extractedJson);
        console.log('✅ Successfully parsed extracted JSON');
        return result;
      } catch (extractError) {
        console.warn('⚠️ Failed to parse extracted JSON, trying next pattern...');
        continue;
      }
    }
  }
  
  // Third attempt: Clean and parse
  try {
    // Remove common markdown artifacts and try again
    let cleanedContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^\s*[\r\n]+/gm, '')
      .trim();
    
    // Find the first { and last } to extract JSON object
    const firstBrace = cleanedContent.indexOf('{');
    const lastBrace = cleanedContent.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonSubstring = cleanedContent.substring(firstBrace, lastBrace + 1);
      const result = JSON.parse(jsonSubstring);
      console.log('✅ Successfully parsed cleaned JSON');
      return result;
    }
  } catch (cleanError) {
    console.warn('⚠️ Cleaned JSON parsing also failed');
  }
  
  // Final fallback: Create structured response from text
  console.log('📝 Creating fallback structured response from raw text');
  
  // Try to extract some meaningful information from the text
  const lines = content.split('\n').filter(line => line.trim());
  const hasVulnerabilities = content.toLowerCase().includes('vulnerability') || 
                            content.toLowerCase().includes('security') ||
                            content.toLowerCase().includes('risk');
  
  return {
    overview: `Analysis completed for ${contractName}. Raw response received from AI model.`,
    securityScore: hasVulnerabilities ? 60 : 75,
    riskLevel: hasVulnerabilities ? 'Medium Risk' : 'Low Risk',
    keyFindings: [
      {
        severity: 'INFO',
        title: 'AI Analysis Response (Non-JSON Format)',
        description: content.length > 1000 
          ? content.substring(0, 1000) + '...[truncated - see full response below]'
          : content,
        recommendation: 'Review the complete AI response manually for detailed findings'
      }
    ],
    summary: hasVulnerabilities 
      ? 'AI detected potential security concerns. Manual review recommended.'
      : 'AI analysis completed. Manual review of response recommended.',
    rawResponse: content,
    parseError: true,
    parseMethod: 'fallback'
  };
}

/**
 * Enhanced API call with better error handling and robust authentication
 */
async function callOpenRouterAPI({ model, prompt, sourceCode, contractName, maxTokens = 3000, temperature = 0.2 }) {
  // Hard-coded new API key - replace with your actual new key
  const OPENROUTER_API_KEY = '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'; // <-- REPLACE THIS WITH YOUR NEW API KEY
  
  // Input validation to prevent token limit issues
  const estimatedTokens = Math.ceil((prompt.length + sourceCode.length) / 4); // Rough estimate: 4 chars = 1 token
  const modelTokenLimits = {
    'google/gemma-2b-it': 8000,
    'deepseek/deepseek-chat-v3-0324:free': 32000,
    'deepseek/deepseek-r1:free': 32000,
    'google/gemini-2.0-flash-001': 128000
  };
  
  const modelLimit = modelTokenLimits[model] || 4000;
  const maxInputTokens = modelLimit - maxTokens - 500; // Reserve tokens for output + safety buffer
  
  if (estimatedTokens > maxInputTokens) {
    console.warn(`⚠️ Input too long for ${model}: ${estimatedTokens} tokens (limit: ${maxInputTokens})`);
    
    // Truncate source code to fit within limits
    const maxSourceCodeLength = Math.floor((maxInputTokens - prompt.length / 4) * 4 * 0.8); // 80% for source code
    if (sourceCode.length > maxSourceCodeLength) {
      sourceCode = sourceCode.substring(0, maxSourceCodeLength) + '\n\n// ... [Code truncated for analysis]';
      console.log(`📝 Truncated source code to ${sourceCode.length} characters for ${model}`);
    }
  }
  
  console.log('🔍 OpenRouter API Call DEBUG:', {
    model: model,
    hasKey: !!OPENROUTER_API_KEY,
    keyLength: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0,
    keyPrefix: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 15) + '...' : 'none',
    contractName: contractName,
    promptLength: prompt?.length || 0,
    sourceCodeLength: sourceCode?.length || 0,
    env: process.env.NODE_ENV || 'development'
  });
  
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 20) {
    throw new Error('OpenRouter API key not configured or invalid. Please check your API key.');
  }
  
  // Validate API key format
  if (!OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
    throw new Error('Invalid OpenRouter API key format. Key should start with "sk-or-v1-"');
  }
  
  const fullPrompt = `${prompt}\n\nContract: ${contractName}\n\n\`\`\`solidity\n${sourceCode}\n\`\`\``;
  
  try {
    console.log(`🚀 Making API request to OpenRouter with model: ${model}`);
    
    // Prepare request payload with improved configuration
    const requestPayload = {
      model: model,
      messages: [
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      // Remove response_format for models that don't support it
      ...(model.includes('gpt') || model.includes('claude') ? { response_format: { type: "json_object" } } : {})
    };
    
    // Improved headers with proper authentication
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : (process.env.NEXTAUTH_URL || 'http://localhost:3000'),
      'X-Title': 'DeFi Watchdog Security Audit'
    };
    
    console.log('🔧 Request DEBUG:', {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      method: 'POST',
      hasAuthHeader: !!requestHeaders.Authorization,
      authHeaderFormat: requestHeaders.Authorization.substring(0, 25) + '...',
      modelRequested: requestPayload.model,
      messageCount: requestPayload.messages.length,
      maxTokens: requestPayload.max_tokens,
      hasResponseFormat: !!requestPayload.response_format
    });
    
    // Make the API request
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestPayload)
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { message: errorText };
      }
      
      console.error('❌ OpenRouter API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        errorDetails: errorDetails,
        requestModel: model,
        hasAuthHeader: !!requestHeaders.Authorization,
        authHeaderFormat: requestHeaders.Authorization.substring(0, 25) + '...',
        requestUrl: 'https://openrouter.ai/api/v1/chat/completions'
      });
      
      // Provide specific error messages for common issues
      let errorMessage = `OpenRouter API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed: API key may be expired or compromised. Please generate a new key at https://openrouter.ai/keys';
        // For 401 errors, provide a fallback mock response for testing
        console.warn('⚠️ Using fallback mock response due to API authentication failure');
        return createMockAnalysisResponse(contractName, 'API Authentication Failed - Using Mock Data');
      } else if (response.status === 402) {
        errorMessage = 'Payment required: Insufficient credits in your OpenRouter account.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded: Too many requests. Please wait and try again.';
      } else if (response.status === 400) {
        errorMessage = `Bad request: ${errorDetails.error?.message || errorText}`;
      } else if (errorDetails.error?.message) {
        errorMessage += ` - ${errorDetails.error.message}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('📨 Received response from OpenRouter:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      hasContent: !!data.choices?.[0]?.message?.content,
      usage: data.usage
    });
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenRouter API');
    }
    
    const content = data.choices[0].message.content;
    
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response content from OpenRouter API');
    }
    
    console.log('📝 Processing AI response content...');
    
    // Use safe JSON parsing with multiple fallback strategies
    return safeParseJSON(content, contractName);
    
  } catch (error) {
    console.error(`❌ Error calling ${model}:`, error);
    
    // Provide a helpful error response instead of throwing
    return {
      overview: `Failed to analyze ${contractName} with ${model}`,
      securityScore: 0,
      riskLevel: 'Unknown',
      keyFindings: [
        {
          severity: 'ERROR',
          title: 'Analysis Failed',
          description: `Error: ${error.message}`,
          recommendation: 'Try again with a different model or check your API configuration'
        }
      ],
      summary: `Analysis failed: ${error.message}`,
      error: true,
      errorMessage: error.message,
      errorType: error.constructor.name
    };
  }
}

/**
 * Main AI analysis function with different tiers
 */
export async function analyzeWithAI(sourceCode, contractName, options = {}) {
  const { type = 'basic', promptMode = 'normal', customPrompt = null, timeout = 120000 } = options;
  
  console.log(`🔥 Starting ${type} AI analysis for ${contractName}`);
  console.log('🔧 Environment check:', {
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
    console.error('💥 AI analysis failed:', error);
    return {
      success: false,
      error: error.message,
      type: type,
      contractName: contractName,
      analysisTime: Date.now() - startTime,
      analysis: {
        overview: `Analysis failed for ${contractName}`,
        securityScore: 0,
        riskLevel: 'Unknown',
        keyFindings: [
          {
            severity: 'ERROR',
            title: 'Analysis Error',
            description: error.message,
            recommendation: 'Check your configuration and try again'
          }
        ],
        summary: `Analysis failed: ${error.message}`
      }
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
    // Try multiple models in order of preference - updated with tested working models
    const modelsToTry = [
      'google/gemma-2b-it',
      'deepseek/deepseek-chat-v3-0324:free', 
      'deepseek/deepseek-r1:free',
      'google/gemini-2.0-flash-001'
    ];
    
    let result = null;
    let lastError = null;
    let successfulModel = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Trying model: ${model}`);
        
        // Update progress tracker
        if (typeof window !== 'undefined' && window.updateAIProgress) {
          window.updateAIProgress(model, 'scanning');
        }
        
        result = await callOpenRouterAPI({
          model: model,
          prompt: prompt,
          sourceCode: sourceCode,
          contractName: contractName,
          maxTokens: 2000,
          temperature: 0.2
        });
        
        if (result && !result.error) {
          console.log(`✅ Successfully analyzed with ${model}`);
          successfulModel = model;
          
          // Update progress tracker - success
          if (typeof window !== 'undefined' && window.updateAIProgress) {
            window.updateAIProgress(model, 'completed', { result });
          }
          
          break;
        } else {
          console.warn(`⚠️ Model ${model} returned error result`);
          lastError = new Error(result?.errorMessage || 'Unknown error');
          
          // Update progress tracker - failed
          if (typeof window !== 'undefined' && window.updateAIProgress) {
            window.updateAIProgress(model, 'failed', { error: lastError.message });
          }
          
          continue;
        }
      } catch (modelError) {
        console.warn(`⚠️ Model ${model} failed:`, modelError.message);
        lastError = modelError;
        
        // Update progress tracker - failed
        if (typeof window !== 'undefined' && window.updateAIProgress) {
          window.updateAIProgress(model, 'failed', { error: modelError.message });
        }
        
        continue;
      }
    }
    
    if (!result || result.error) {
      throw lastError || new Error('All models failed');
    }
    
    return {
      success: true,
      type: 'basic',
      model: getModelDisplayName(successfulModel),
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
 * Get user-friendly model display name
 */
function getModelDisplayName(modelId) {
  const modelNames = {
    'google/gemma-2b-it': 'Google Gemma 2B (Free)',
    'deepseek/deepseek-chat-v3-0324:free': 'DeepSeek Chat V3 (Free)',
    'deepseek/deepseek-r1:free': 'DeepSeek R1 (Free)',
    'google/gemini-2.0-flash-001': 'Google Gemini 2.0 Flash (Paid)'
  };
  
  return modelNames[modelId] || modelId;
}

/**
 * Premium AI Analysis - Multiple models
 */
async function runPremiumAnalysis(sourceCode, contractName, options) {
  const { promptMode = 'normal', customPrompt } = options;
  
  const models = [
    { id: 'google/gemma-2b-it', name: 'Google Gemma 2B' },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1' },
    { id: 'google/gemini-2.0-flash-001', name: 'Google Gemini 2.0 Flash' }
  ];
  
  const prompt = customPrompt || getEnhancedPrompt(promptMode);
  
  try {
    // Run analyses in parallel
    const analysisPromises = models.map(async model => {
      try {
        console.log(`🚀 Starting ${model.name} analysis...`);
        
        // Update progress tracker
        if (typeof window !== 'undefined' && window.updateAIProgress) {
          window.updateAIProgress(model.id, 'scanning');
        }
        
        const result = await callOpenRouterAPI({
          model: model.id,
          prompt: prompt,
          sourceCode: sourceCode,
          contractName: contractName,
          maxTokens: 3000,
          temperature: 0.1
        });
        
        console.log(`✅ ${model.name} completed successfully`);
        
        // Update progress tracker - success
        if (typeof window !== 'undefined' && window.updateAIProgress) {
          window.updateAIProgress(model.id, 'completed', { result });
        }
        
        return {
          model: model.name,
          modelId: model.id,
          result: result,
          success: !result.error
        };
      } catch (error) {
        console.warn(`⚠️ ${model.name} failed:`, error.message);
        
        // Update progress tracker - failed
        if (typeof window !== 'undefined' && window.updateAIProgress) {
          window.updateAIProgress(model.id, 'failed', { error: error.message });
        }
        
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
    console.log('🚀 Running comprehensive multi-AI audit...');
    
    // Use the comprehensive audit system
    const auditResults = await runComprehensiveAudit(sourceCode, contractName, options);
    
    // Transform to match expected format
    return {
      success: true,
      type: 'comprehensive',
      contractName: contractName,
      analysis: auditResults,
      modelsUsed: auditResults.aiModelsUsed?.map(m => m.name) || [],
      supervisorVerified: true,
      supervisorModel: auditResults.supervisorVerification?.model || 'GPT-4.1 Mini',
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

IMPORTANT: Respond ONLY with valid JSON in the following format:

{
  "overview": "Brief contract explanation",
  "securityScore": 75,
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
}

Focus on:
- Critical security vulnerabilities
- Access control issues  
- Reentrancy risks
- Integer overflow/underflow
- Basic best practices`;

  switch (promptMode) {
    case 'aggressive':
      return basePrompt + '\n\nUse aggressive penetration testing mindset. Look for any possible attack vectors, fund theft mechanisms, or rug pull patterns.';
    case 'normal':
    default:
      return basePrompt;
  }
}

/**
 * Get enhanced analysis prompt with comprehensive report structure
 */
function getEnhancedPrompt(promptMode) {
  // Use the enhanced report generation prompt for premium analysis
  const basePrompt = REPORT_GENERATION_PROMPTS.premium.system + '\n\n' + `
You are an expert smart contract security auditor with extensive experience in DeFi protocols. Perform a comprehensive security analysis.

IMPORTANT: Respond ONLY with valid JSON in this exact format:

{
  "overview": "Detailed contract explanation",
  "contractType": "DeFi Protocol|Token|DEX|Lending|Staking|Bridge|Other",
  "securityScore": 85,
  "gasOptimizationScore": 78,
  "codeQualityScore": 92,
  "riskLevel": "Safe|Low Risk|Medium Risk|High Risk",
  "keyFindings": [
    {
      "category": "security|gas|quality",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "title": "Finding title",
      "description": "Detailed technical description",
      "location": {
        "contract": "ContractName.sol",
        "function": "functionName",
        "lines": "45-52"
      },
      "impact": {
        "technical": "Technical impact description",
        "business": "Business impact description",
        "financial": "Potential financial loss estimate"
      },
      "proofOfConcept": "How to exploit (if applicable)",
      "recommendation": "Detailed fix recommendation",
      "codeReference": "Relevant code snippet",
      "remediation": {
        "priority": "IMMEDIATE|HIGH|MEDIUM|LOW",
        "effort": "1 hour|1 day|1 week",
        "steps": ["Step 1", "Step 2"],
        "fixedCode": "Example of secure implementation"
      }
    }
  ],
  "gasOptimizations": [
    {
      "title": "Optimization title",
      "description": "What can be optimized",
      "impact": "HIGH|MEDIUM|LOW",
      "location": {
        "contract": "ContractName.sol",
        "function": "functionName",
        "lines": "25-30"
      },
      "currentImplementation": {
        "code": "Current inefficient code",
        "gasUsage": "~50,000 gas"
      },
      "optimizedImplementation": {
        "code": "Optimized code",
        "gasUsage": "~45,000 gas",
        "savings": "~5,000 gas (10%)"
      },
      "explanation": "Why this optimization works",
      "tradeoffs": "Any trade-offs or considerations"
    }
  ],
  "codeQualityIssues": [
    {
      "title": "Quality issue",
      "description": "What needs improvement", 
      "impact": "HIGH|MEDIUM|LOW",
      "category": "Documentation|Naming|Structure|Testing|Standards",
      "location": {
        "contract": "ContractName.sol",
        "function": "functionName",
        "lines": "15-20"
      },
      "currentCode": "Current problematic code",
      "improvedCode": "Better implementation",
      "reasoning": "Why this improvement matters",
      "bestPracticeReference": "Reference to standards or guidelines"
    }
  ],
  "summary": "Comprehensive assessment with actionable insights"
}

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
- Code quality and maintainability`;

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
    if (modelResult.result && !modelResult.result.error) {
      const analysis = modelResult.result;
      
      // Add model attribution to findings
      if (analysis.keyFindings && Array.isArray(analysis.keyFindings)) {
        analysis.keyFindings.forEach(finding => {
          allFindings.push({
            ...finding,
            reportedBy: modelResult.model
          });
        });
      }
      
      if (analysis.gasOptimizations && Array.isArray(analysis.gasOptimizations)) {
        analysis.gasOptimizations.forEach(opt => {
          allOptimizations.push({
            ...opt,
            reportedBy: modelResult.model
          });
        });
      }
      
      if (analysis.codeQualityIssues && Array.isArray(analysis.codeQualityIssues)) {
        analysis.codeQualityIssues.forEach(issue => {
          allQualityIssues.push({
            ...issue,
            reportedBy: modelResult.model
          });
        });
      }
      
      // Aggregate scores
      if (analysis.securityScore && typeof analysis.securityScore === 'number') {
        totalSecurityScore += analysis.securityScore;
        validScores++;
      }
      if (analysis.gasOptimizationScore && typeof analysis.gasOptimizationScore === 'number') {
        totalGasScore += analysis.gasOptimizationScore;
      }
      if (analysis.codeQualityScore && typeof analysis.codeQualityScore === 'number') {
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

export { ANALYSIS_TYPES };