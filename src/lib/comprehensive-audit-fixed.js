// FIXED: Production-Grade Comprehensive AI Audit System 
// Professional security analysis with enhanced error handling and realistic findings

// Enhanced AI Models Configuration with working models
const AI_MODELS = {
  premium: [
    {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'openrouter',
      speciality: 'Advanced reasoning and comprehensive vulnerability analysis',
      tier: 'premium'
    },
    {
      id: 'deepseek/deepseek-chat',
      name: 'DeepSeek Chat',
      provider: 'openrouter',
      speciality: 'Code analysis and security patterns',
      tier: 'premium'
    },
    {
      id: 'microsoft/wizardlm-2-8x22b',
      name: 'WizardLM 2 8x22B',
      provider: 'openrouter',
      speciality: 'Large context analysis and pattern detection',
      tier: 'premium'
    },
    {
      id: 'meta-llama/llama-3.1-8b-instruct:free',
      name: 'Llama 3.1 8B',
      provider: 'openrouter',
      speciality: 'Security best practices assessment',
      tier: 'premium'
    },
    {
      id: 'qwen/qwen-2.5-72b-instruct',
      name: 'Qwen 2.5 72B',
      provider: 'openrouter',
      speciality: 'Smart contract analysis',
      tier: 'premium'
    },
    {
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'openrouter',
      speciality: 'Comprehensive security review',
      tier: 'premium'
    }
  ],
  free: [
    {
      id: 'deepseek/deepseek-chat',
      name: 'DeepSeek Chat Free',
      provider: 'openrouter',
      speciality: 'Security vulnerability detection',
      tier: 'free'
    },
    {
      id: 'meta-llama/llama-3.1-8b-instruct:free',
      name: 'Llama 3.1 8B Free',
      provider: 'openrouter',
      speciality: 'Code quality assessment',
      tier: 'free'
    },
    {
      id: 'microsoft/wizardlm-2-8x22b',
      name: 'WizardLM 2 8x22B',
      provider: 'openrouter',
      speciality: 'Pattern analysis',
      tier: 'free'
    }
  ],
  supervisors: {
    premium: {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini Supervisor',
      provider: 'openrouter',
      role: 'Premium Supervisor and Report Generator'
    },
    free: {
      id: 'deepseek/deepseek-chat',
      name: 'DeepSeek Chat Supervisor',
      provider: 'openrouter',
      role: 'Free Tier Supervisor'
    }
  }
};

// Enhanced analysis prompts for comprehensive security assessment
const ANALYSIS_PROMPTS = {
  comprehensive_premium: `You are a professional smart contract security auditor conducting a comprehensive security assessment. Analyze the provided contract code for ALL types of vulnerabilities and issues.

**CRITICAL REQUIREMENTS:**
1. You MUST find and report actual security vulnerabilities
2. Analyze the ACTUAL CONTRACT CODE provided, not just imports
3. Look for real business logic flaws and implementation issues
4. Provide specific code references and exploitation scenarios
5. Give realistic security scores based on actual findings

**SECURITY VULNERABILITIES TO DETECT:**

**ACCESS CONTROL ISSUES:**
- Missing access controls on critical functions (mint, burn, admin functions)
- Anyone can call restricted functions
- Centralized ownership risks
- Missing role-based permissions

**TOKEN/NFT SPECIFIC VULNERABILITIES:**
- Unlimited minting without supply caps
- Missing payment validation in mint functions
- Broken token tracking after transfers
- Unauthorized token operations
- Mutable metadata vulnerabilities

**GENERAL SMART CONTRACT VULNERABILITIES:**
- Reentrancy attacks (external calls without guards)
- Integer overflow/underflow (pre-0.8.0)
- Missing input validation
- DoS attacks
- Front-running vulnerabilities
- Gas limit issues
- Upgrade mechanism risks

**ANALYSIS REQUIREMENTS:**
- Find AT LEAST 2-3 real issues unless contract is perfect
- Reference specific functions and code lines
- Provide exploitation steps and proof of concept
- Calculate CVSS scores for vulnerabilities
- Estimate financial impact

**Response Format (JSON only):**
{
  "findings": [
    {
      "vulnerabilityId": "DW-2025-001",
      "category": "security",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "title": "Specific vulnerability name",
      "description": "Detailed technical explanation",
      "impact": {
        "technical": "Technical consequences",
        "business": "Business impact",
        "financial": "Potential financial losses"
      },
      "proofOfConcept": {
        "steps": ["Step 1", "Step 2", "Step 3"],
        "code": "// Exploit code example",
        "prerequisites": "Required conditions"
      },
      "remediation": {
        "priority": "IMMEDIATE|HIGH|MEDIUM|LOW",
        "effort": "Implementation time",
        "secureImplementation": "// Fixed code",
        "additionalRecommendations": "Extra measures"
      },
      "codeReference": {
        "file": "Contract file",
        "functions": ["functionName"],
        "lines": "Line numbers",
        "vulnerableCode": "// Problematic code"
      },
      "cvssScore": {
        "vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        "score": 9.8,
        "severity": "CRITICAL"
      },
      "estimatedLoss": "Financial impact estimate",
      "exploitComplexity": "LOW|MEDIUM|HIGH"
    }
  ],
  "executiveSummary": {
    "overallRisk": "CRITICAL|HIGH|MEDIUM|LOW",
    "securityScore": 45,
    "gasEfficiencyScore": 75,
    "codeQualityScore": 60,
    "overallScore": 60,
    "keyRecommendations": ["Fix 1", "Fix 2", "Fix 3"],
    "deploymentRecommendation": "DO_NOT_DEPLOY|REVIEW_REQUIRED|DEPLOY",
    "businessImpact": "Impact assessment"
  },
  "contractAnalysis": {
    "contractType": "NFT|Token|DeFi|DAO|Other",
    "complexity": "LOW|MEDIUM|HIGH",
    "linesOfCode": 150,
    "functionsAnalyzed": 8
  },
  "summary": "Comprehensive analysis summary"
}`,

  comprehensive_free: `You are a smart contract security auditor. Analyze this contract for security vulnerabilities, gas optimizations, and code quality issues.

**REQUIREMENTS:**
- Find real security issues (don't report "no issues" unless truly secure)
- Focus on access control, validation, and common vulnerabilities
- Provide specific code references
- Give realistic recommendations

**VULNERABILITIES TO CHECK:**
1. Access control on critical functions
2. Input validation issues
3. Reentrancy vulnerabilities
4. Integer overflow/underflow
5. Gas optimization opportunities
6. Code quality problems

**Response Format (JSON only):**
{
  "findings": [
    {
      "category": "security|gas|quality",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "title": "Issue name",
      "description": "Technical explanation",
      "impact": "What could happen",
      "recommendation": "How to fix",
      "codeReference": "Specific function/line"
    }
  ],
  "overallAssessment": "Overall security assessment",
  "securityScore": 65,
  "gasOptimizationScore": 75,
  "codeQualityScore": 70,
  "summary": "Analysis summary with finding count"
}`
};

/**
 * FIXED: Main comprehensive audit function with enhanced error handling
 */
export async function runComprehensiveAudit(sourceCode, contractName, options = {}) {
  console.log(`🚀 Starting enhanced comprehensive audit for ${contractName}`);
  const startTime = Date.now();
  
  try {
    // Validate inputs
    if (!sourceCode || !contractName) {
      throw new Error('Missing required parameters: sourceCode and contractName');
    }

    // Set defaults
    const tier = options.tier || 'free';
    const timeout = options.timeout || (tier === 'premium' ? 300000 : 120000);
    
    console.log(`🔍 Running ${tier} tier analysis with ${timeout}ms timeout`);
    
    // Get models for the tier
    const models = tier === 'premium' ? AI_MODELS.premium : AI_MODELS.free;
    const supervisor = AI_MODELS.supervisors[tier];
    
    console.log(`📋 Using ${models.length} AI models for analysis`);
    
    // Run multi-AI analysis with timeout
    const analysisPromise = tier === 'premium' 
      ? runPremiumMultiAIAnalysis(sourceCode, contractName, models, startTime)
      : runFreeMultiAIAnalysis(sourceCode, contractName, models, startTime);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timeout')), timeout)
    );
    
    const analysisResults = await Promise.race([analysisPromise, timeoutPromise]);
    
    // Run supervisor verification
    console.log(`🧠 Running ${tier} supervisor verification...`);
    const supervisorReport = await runSupervisorVerification(
      sourceCode, 
      contractName, 
      analysisResults,
      supervisor,
      tier
    );
    
    // Generate final report
    const finalReport = generateComprehensiveReport(
      analysisResults,
      supervisorReport,
      tier,
      startTime
    );
    
    console.log(`✅ Comprehensive audit completed in ${(Date.now() - startTime) / 1000}s`);
    console.log(`📊 Final scores: Security=${finalReport.scores.security}, Overall=${finalReport.scores.overall}`);
    
    return finalReport;
    
  } catch (error) {
    console.error('❌ Comprehensive audit failed:', error);
    
    // Return enhanced fallback analysis instead of throwing
    return generateEnhancedFallbackAnalysis(sourceCode, contractName, error, Date.now() - startTime);
  }
}

/**
 * Enhanced premium tier analysis
 */
async function runPremiumMultiAIAnalysis(sourceCode, contractName, models, startTime) {
  console.log('🏆 Running premium multi-AI analysis...');
  
  const analysisPromises = models.map(async (model, index) => {
    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 500));
      
      console.log(`🤖 Analyzing with ${model.name}...`);
      const result = await callAIModel(
        model, 
        ANALYSIS_PROMPTS.comprehensive_premium, 
        sourceCode, 
        contractName,
        {
          maxTokens: 6000,
          temperature: 0.02,
          timeout: 30000 // 30 second timeout per model
        }
      );
      
      return {
        model: model.name,
        modelId: model.id,
        speciality: model.speciality,
        result: result,
        success: true
      };
    } catch (error) {
      console.error(`❌ Analysis failed with ${model.name}:`, error);
      return {
        model: model.name,
        modelId: model.id,
        error: error.message,
        success: false
      };
    }
  });
  
  const results = await Promise.all(analysisPromises);
  const validResults = results.filter(r => r.success);
  
  console.log(`📊 Premium analysis: ${validResults.length}/${results.length} models successful`);
  
  return {
    comprehensive: validResults,
    failed: results.filter(r => !r.success),
    metadata: {
      contractName,
      analysisTime: Date.now() - startTime,
      modelsUsed: models.map(m => m.name),
      tier: 'premium',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Enhanced free tier analysis
 */
async function runFreeMultiAIAnalysis(sourceCode, contractName, models, startTime) {
  console.log('🔍 Running free tier multi-AI analysis...');
  
  const analysisPromises = models.map(async (model, index) => {
    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 1000));
      
      console.log(`🤖 Analyzing with ${model.name}...`);
      const result = await callAIModel(
        model, 
        ANALYSIS_PROMPTS.comprehensive_free, 
        sourceCode, 
        contractName,
        {
          maxTokens: 4000,
          temperature: 0.05,
          timeout: 25000 // 25 second timeout per model
        }
      );
      
      return {
        model: model.name,
        modelId: model.id,
        speciality: model.speciality,
        result: result,
        success: true
      };
    } catch (error) {
      console.error(`❌ Analysis failed with ${model.name}:`, error);
      return {
        model: model.name,
        modelId: model.id,
        error: error.message,
        success: false
      };
    }
  });
  
  const results = await Promise.all(analysisPromises);
  const validResults = results.filter(r => r.success);
  
  console.log(`📊 Free analysis: ${validResults.length}/${results.length} models successful`);
  
  return {
    comprehensive: validResults,
    failed: results.filter(r => !r.success),
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
 * Enhanced supervisor verification
 */
async function runSupervisorVerification(sourceCode, contractName, analysisResults, supervisor, tier) {
  const supervisorPrompt = `You are a senior smart contract security auditor reviewing multiple AI analysis results. Verify findings against the actual contract code and provide accurate security assessment.

Contract: ${contractName}
Analysis Results: ${JSON.stringify(analysisResults.comprehensive, null, 2)}

Source Code:
\`\`\`solidity
${sourceCode.length > 10000 ? sourceCode.substring(0, 10000) + '...[truncated]' : sourceCode}
\`\`\`

**Your Task:**
1. Verify each finding against the actual source code
2. Identify any additional vulnerabilities missed by the AIs
3. Eliminate false positives
4. Provide accurate security scoring
5. Create actionable remediation guidance

**Response Format (JSON only):**
{
  "verifiedFindings": {
    "security": [],
    "gasOptimization": [],
    "codeQuality": []
  },
  "falsePositives": [],
  "executiveSummary": {
    "overallRisk": "HIGH",
    "securityScore": 45,
    "gasEfficiencyScore": 75,
    "codeQualityScore": 70,
    "overallScore": 60,
    "keyRecommendations": ["Fix 1", "Fix 2"],
    "deploymentRecommendation": "REVIEW_REQUIRED"
  },
  "additionalFindings": []
}`;

  try {
    console.log('🧠 Running supervisor verification...');
    const supervisorResult = await callAIModel(
      supervisor, 
      supervisorPrompt, 
      '', 
      contractName,
      { 
        maxTokens: 6000,
        temperature: 0.02,
        timeout: 45000 // 45 second timeout for supervisor
      }
    );
    
    console.log('✅ Supervisor verification completed');
    return supervisorResult;
    
  } catch (error) {
    console.error('⚠️ Supervisor verification failed:', error);
    
    // Generate fallback supervisor report
    return generateFallbackSupervisorReport(analysisResults, error);
  }
}

/**
 * Generate comprehensive final report
 */
function generateComprehensiveReport(analysisResults, supervisorReport, tier, startTime) {
  const verified = supervisorReport.verifiedFindings || {};
  const executiveSummary = supervisorReport.executiveSummary || {};
  
  // Count findings by severity
  const securityFindings = verified.security || [];
  const gasFindings = verified.gasOptimization || [];
  const qualityFindings = verified.codeQuality || [];
  
  const findingCounts = {
    security: {
      critical: securityFindings.filter(f => f.severity === 'CRITICAL').length,
      high: securityFindings.filter(f => f.severity === 'HIGH').length,
      medium: securityFindings.filter(f => f.severity === 'MEDIUM').length,
      low: securityFindings.filter(f => f.severity === 'LOW').length
    },
    gasOptimization: gasFindings.length,
    codeQuality: qualityFindings.length
  };
  
  const totalSecurityFindings = Object.values(findingCounts.security).reduce((a, b) => a + b, 0);
  
  return {
    // Enhanced metadata
    metadata: {
      contractName: analysisResults.metadata.contractName,
      analysisType: tier === 'premium' ? 'Premium Multi-AI Security Audit' : 'Free Multi-AI Security Audit',
      timestamp: new Date().toISOString(),
      analysisTime: Date.now() - startTime,
      modelsUsed: analysisResults.metadata.modelsUsed,
      tier: tier,
      reportVersion: '3.1',
      enhanced: true
    },
    
    // Executive summary
    executiveSummary: {
      overallScore: executiveSummary.overallScore || 75,
      riskLevel: executiveSummary.overallRisk || 'Medium Risk',
      summary: executiveSummary.businessImpact || `Multi-AI security analysis identified ${totalSecurityFindings} security findings requiring attention.`,
      keyFindings: {
        criticalIssues: findingCounts.security.critical,
        highRiskIssues: findingCounts.security.high,
        gasOptimizations: findingCounts.gasOptimization,
        qualityIssues: findingCounts.codeQuality
      },
      recommendations: executiveSummary.keyRecommendations || ['Conduct thorough security review', 'Test all findings in development environment']
    },
    
    // Detailed scores
    scores: {
      security: executiveSummary.securityScore || 75,
      gasOptimization: executiveSummary.gasEfficiencyScore || 80,
      codeQuality: executiveSummary.codeQualityScore || 85,
      overall: executiveSummary.overallScore || 75
    },
    
    // Verified findings
    findings: {
      security: securityFindings,
      gasOptimization: gasFindings,
      codeQuality: qualityFindings
    },
    
    // Statistics
    statistics: findingCounts,
    
    // AI models used
    aiModelsUsed: (tier === 'premium' ? AI_MODELS.premium : AI_MODELS.free).map(model => ({
      name: model.name,
      id: model.id,
      speciality: model.speciality
    })),
    
    // Supervisor verification
    supervisorVerification: {
      model: AI_MODELS.supervisors[tier].name,
      verified: !supervisorReport.supervisorFailed,
      confidenceLevel: tier === 'premium' ? '95%' : '85%',
      failed: supervisorReport.supervisorFailed || false
    },
    
    // False positives for transparency
    falsePositives: supervisorReport.falsePositives || []
  };
}

/**
 * Enhanced AI model API call with robust error handling
 */
async function callAIModel(model, prompt, sourceCode, contractName, options = {}) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  console.log(`🚀 API call to ${model.name}:`, {
    hasKey: !!OPENROUTER_API_KEY,
    modelId: model.id,
    contractName: contractName
  });
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your .env.local file.');
  }
  
  const fullPrompt = sourceCode 
    ? `${prompt}\n\nContract: ${contractName}\n\n\`\`\`solidity\n${sourceCode}\n\`\`\``
    : prompt;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);
  
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
        model: model.id,
        messages: [
          {
            role: 'system',
            content: 'You are an expert smart contract security auditor. Analyze the code and respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.1,
        top_p: 0.9
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response structure');
    }
    
    const content = data.choices[0].message.content;
    console.log(`📝 Response from ${model.name}:`, content.substring(0, 200) + '...');
    
    return parseJSONResponse(content, model.name);
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`❌ API call failed for ${model.name}:`, error);
    throw error;
  }
}

/**
 * Enhanced JSON parsing with multiple strategies
 */
function parseJSONResponse(content, modelName) {
  console.log(`🔧 Parsing JSON response from ${modelName}`);
  
  // Strategy 1: Direct parsing
  try {
    const result = JSON.parse(content);
    console.log(`✅ Direct JSON parsing successful for ${modelName}`);
    return result;
  } catch (error) {
    console.warn(`⚠️ Direct JSON parsing failed for ${modelName}`);
  }
  
  // Strategy 2: Extract from code blocks
  const codeBlockPatterns = [
    /```json\s*({[\s\S]*?})\s*```/i,
    /```\s*({[\s\S]*?})\s*```/i,
    /({[\s\S]*})/
  ];
  
  for (const pattern of codeBlockPatterns) {
    const match = content.match(pattern);
    if (match?.[1]) {
      try {
        const result = JSON.parse(match[1].trim());
        console.log(`✅ Pattern extraction successful for ${modelName}`);
        return result;
      } catch (error) {
        continue;
      }
    }
  }
  
  // Strategy 3: Fallback with realistic findings
  console.log(`🔄 Creating fallback response for ${modelName}`);
  return {
    findings: [
      {
        category: "security",
        severity: "MEDIUM",
        title: "Analysis Parsing Error",
        description: `${modelName} analysis could not be parsed properly. Manual review recommended.`,
        impact: "Unknown - requires manual verification",
        recommendation: "Conduct manual security review",
        codeReference: "Multiple locations"
      }
    ],
    overallAssessment: `${modelName} analysis completed but response parsing failed`,
    securityScore: 65,
    gasOptimizationScore: 75,
    codeQualityScore: 70,
    summary: "Analysis completed but requires manual review due to parsing issues",
    parseError: true,
    model: modelName
  };
}

/**
 * Generate fallback supervisor report
 */
function generateFallbackSupervisorReport(analysisResults, error) {
  const allFindings = [];
  
  // Extract findings from successful analyses
  analysisResults.comprehensive.forEach(analysis => {
    if (analysis.result?.findings) {
      allFindings.push(...analysis.result.findings);
    }
  });
  
  // Calculate scores based on findings
  let securityScore = 100;
  const criticalCount = allFindings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = allFindings.filter(f => f.severity === 'HIGH').length;
  const mediumCount = allFindings.filter(f => f.severity === 'MEDIUM').length;
  
  securityScore -= (criticalCount * 30) + (highCount * 20) + (mediumCount * 10);
  securityScore = Math.max(10, securityScore);
  
  return {
    verifiedFindings: {
      security: allFindings.filter(f => f.category === 'security'),
      gasOptimization: allFindings.filter(f => f.category === 'gas'),
      codeQuality: allFindings.filter(f => f.category === 'quality')
    },
    falsePositives: [],
    executiveSummary: {
      overallRisk: securityScore >= 80 ? 'LOW' : securityScore >= 60 ? 'MEDIUM' : 'HIGH',
      securityScore: securityScore,
      gasEfficiencyScore: 75,
      codeQualityScore: 80,
      overallScore: Math.round((securityScore + 75 + 80) / 3),
      keyRecommendations: [
        'Manual security review required due to supervisor failure',
        'Verify all AI findings in development environment',
        'Consider professional audit before mainnet deployment'
      ],
      deploymentRecommendation: securityScore >= 80 ? 'DEPLOY' : 'REVIEW_REQUIRED'
    },
    supervisorFailed: true,
    supervisorError: error.message
  };
}

/**
 * Generate enhanced fallback analysis when entire system fails
 */
function generateEnhancedFallbackAnalysis(sourceCode, contractName, error, analysisTime) {
  console.log('🔄 Generating enhanced fallback analysis...');
  
  // Analyze contract type for realistic findings
  const isNFT = sourceCode.includes('ERC721') || sourceCode.includes('_mint') || sourceCode.includes('tokenURI');
  const isToken = sourceCode.includes('ERC20') || sourceCode.includes('transfer') || sourceCode.includes('balanceOf');
  const isDeFi = sourceCode.includes('swap') || sourceCode.includes('liquidity') || sourceCode.includes('DEX');
  
  const findings = {
    security: [],
    gasOptimization: [],
    codeQuality: []
  };
  
  // Generate appropriate findings based on contract type
  if (isNFT) {
    findings.security.push({
      vulnerabilityId: "DW-2025-001",
      severity: "HIGH",
      title: "Potential Access Control Issues in NFT Contract",
      description: "The NFT contract may have access control vulnerabilities in minting or administrative functions that require manual review.",
      impact: {
        technical: "Unauthorized access to critical NFT functions",
        business: "Risk of unauthorized minting or token manipulation",
        financial: "Potential loss of NFT collection value"
      },
      codeReference: {
        file: "Main NFT Contract",
        functions: ["mint", "burn", "admin functions"],
        vulnerableCode: "// Requires manual analysis due to system error"
      },
      remediation: {
        priority: "HIGH",
        effort: "Manual review required"
      }
    });
  } else if (isToken) {
    findings.security.push({
      vulnerabilityId: "DW-2025-002",
      severity: "MEDIUM",
      title: "Token Transfer Validation Review Required",
      description: "Token contract requires manual review to verify proper transfer validation and access controls.",
      impact: {
        technical: "Potential token transfer vulnerabilities",
        business: "Risk of token manipulation",
        financial: "Potential token loss"
      }
    });
  } else if (isDeFi) {
    findings.security.push({
      vulnerabilityId: "DW-2025-003",
      severity: "HIGH",
      title: "DeFi Protocol Security Review Required",
      description: "DeFi contract requires comprehensive manual security review for reentrancy, flash loan attacks, and economic vulnerabilities.",
      impact: {
        technical: "Multiple DeFi-specific attack vectors",
        business: "Risk of protocol exploitation",
        financial: "Potential loss of all protocol funds"
      }
    });
  } else {
    findings.security.push({
      vulnerabilityId: "DW-2025-004",
      severity: "MEDIUM",
      title: "General Contract Security Review Required",
      description: "Contract requires manual security review to identify potential vulnerabilities.",
      impact: {
        technical: "Unknown security risks",
        business: "Operational risk",
        financial: "Unknown"
      }
    });
  }
  
  // Add gas optimization suggestions
  findings.gasOptimization.push({
    title: "Gas Optimization Review Needed",
    description: "Manual review required to identify gas optimization opportunities.",
    impact: {
      gasReduction: "Unknown - requires analysis",
      estimatedSavings: "To be determined"
    }
  });
  
  // Add code quality suggestions
  findings.codeQuality.push({
    category: "Documentation",
    title: "Code Quality Review Required",
    description: "Manual review needed to assess documentation and code quality.",
    impact: "Unknown - requires manual assessment"
  });
  
  return {
    findings,
    scores: {
      security: 50, // Conservative score due to system failure
      gasOptimization: 70,
      codeQuality: 70,
      overall: 60
    },
    executiveSummary: {
      summary: `Enhanced fallback analysis for ${contractName}. Manual security review strongly recommended due to system error: ${error.message}`,
      riskLevel: 'High Risk',
      keyFindings: {
        criticalIssues: 0,
        highRiskIssues: findings.security.filter(f => f.severity === 'HIGH').length,
        gasOptimizations: findings.gasOptimization.length,
        qualityIssues: findings.codeQuality.length
      },
      recommendations: [
        'Conduct thorough manual security review',
        'Test contract extensively in development environment',
        'Consider professional third-party audit',
        'Implement comprehensive testing suite',
        'Review access controls and permissions'
      ]
    },
    aiModelsUsed: [{
      name: 'Enhanced Fallback Analyzer',
      id: 'fallback-system',
      speciality: 'Emergency Analysis and Risk Assessment'
    }],
    supervisorVerification: {
      model: 'Fallback System',
      verified: false,
      confidenceLevel: '40%',
      failed: true,
      error: error.message
    },
    metadata: {
      contractName,
      analysisType: 'Enhanced Fallback Security Analysis',
      timestamp: new Date().toISOString(),
      analysisTime: analysisTime,
      tier: 'fallback',
      systemError: error.message,
      fallback: true
    },
    fallbackMode: true,
    originalError: error.message
  };
}

export default {
  runComprehensiveAudit
};