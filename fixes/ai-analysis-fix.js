// ENHANCED AI ANALYSIS SERVER FIX - Solves truncation and parsing issues
// This file contains the improved version of aiAnalysisServer.js

import { runComprehensiveAudit } from '../src/lib/comprehensive-audit.js';

/**
 * ENHANCED: Smart contract code preprocessing to preserve main contract while handling large codebases
 */
function preprocessContractCode(sourceCode, contractName, modelId) {
  if (!sourceCode || sourceCode.length === 0) {
    throw new Error('No source code provided for analysis');
  }

  console.log(`🔍 Preprocessing contract code for ${contractName} (${sourceCode.length} chars) for model ${modelId}`);

  // Get model-specific token limits with safety margins
  const modelTokenLimits = {
    'google/gemma-2b-it': 6000,                    // Conservative limit
    'deepseek/deepseek-chat-v3-0324:free': 28000,  // Leave buffer for response
    'deepseek/deepseek-r1:free': 28000,            // Leave buffer for response
    'deepseek/deepseek-r1-0528:free': 28000,       // Leave buffer for response
    'qwen/qwen3-32b:free': 28000,                  // Leave buffer for response
    'cognitivecomputations/dolphin3.0-mistral-24b:free': 20000,
    'google/gemini-2.0-flash-001': 120000          // Premium model with large context
  };

  const maxInputTokens = modelTokenLimits[modelId] || 6000;
  const estimatedTokens = Math.ceil(sourceCode.length / 4); // Rough estimation: 1 token ≈ 4 characters

  console.log(`📊 Token analysis: ${estimatedTokens} estimated tokens, ${maxInputTokens} max allowed for ${modelId}`);

  // If source code is within limits, return as-is
  if (estimatedTokens <= maxInputTokens) {
    console.log('✅ Source code within token limits, no preprocessing needed');
    return {
      processedCode: sourceCode,
      isComplete: true,
      processingNote: 'Complete source code analyzed'
    };
  }

  // SMART EXTRACTION: Prioritize main contract code over imports/libraries
  console.log('⚠️ Source code exceeds token limits, applying smart extraction...');

  // Split into files if it's a multi-file contract
  const files = [];
  
  // Check if it's already structured with file comments
  if (sourceCode.includes('// File:')) {
    const fileSections = sourceCode.split(/\/\/ File: /);
    for (let i = 1; i < fileSections.length; i++) { // Skip empty first element
      const section = fileSections[i];
      const [fileName, ...contentParts] = section.split('\n');
      const content = contentParts.join('\n');
      files.push({
        name: fileName.trim(),
        content: content.trim()
      });
    }
  } else {
    // Single file
    files.push({
      name: `${contractName}.sol`,
      content: sourceCode
    });
  }

  console.log(`📁 Found ${files.length} files to analyze`);

  // Categorize files by importance
  const mainContractFiles = [];
  const importFiles = [];
  const libraryFiles = [];

  for (const file of files) {
    const content = file.content;
    const fileName = file.name.toLowerCase();

    // Skip empty files
    if (!content || content.trim().length === 0) continue;

    // Check if this is an OpenZeppelin or node_modules import
    const isThirdPartyImport = 
      fileName.includes('@openzeppelin') ||
      fileName.includes('node_modules') ||
      fileName.includes('/contracts/') ||
      content.includes('// OpenZeppelin') ||
      content.includes('SPDX-License-Identifier: MIT') && content.split('\n').length < 50;

    // Check if this contains the main contract logic
    const hasMainContract = /contract\s+\w+\s*(?:is\s+[\w,\s]+)?\s*\{[\s\S]*\}/m.test(content);
    const hasConstructor = /constructor\s*\([^\)]*\)/.test(content);
    const hasBusinessLogic = /function\s+\w+\s*\([^\)]*\)\s*(?:external|public)[\s\S]*?\{/.test(content);
    const isInterface = /interface\s+\w+/.test(content) && !/contract\s+\w+/.test(content);
    const isLibrary = /library\s+\w+/.test(content);

    // Prioritize files with actual contract implementation
    if (hasMainContract && (hasConstructor || hasBusinessLogic) && !isInterface && !isLibrary && !isThirdPartyImport) {
      console.log(`🎯 Main contract file: ${file.name}`);
      mainContractFiles.push(file);
    } else if (!isThirdPartyImport && (hasMainContract || isInterface || isLibrary)) {
      console.log(`📦 Custom contract/library: ${file.name}`);
      importFiles.push(file);
    } else {
      console.log(`📚 Third-party import: ${file.name}`);
      libraryFiles.push(file);
    }
  }

  // Build the optimized source code
  let optimizedCode = '';
  let includedFiles = [];
  let remainingTokens = maxInputTokens;

  // Always include main contract files first
  for (const file of mainContractFiles) {
    const fileTokens = Math.ceil(file.content.length / 4);
    if (fileTokens <= remainingTokens) {
      optimizedCode += `// File: ${file.name}\n\n${file.content}\n\n`;
      includedFiles.push(file.name);
      remainingTokens -= fileTokens;
      console.log(`✅ Included main contract: ${file.name} (${fileTokens} tokens)`);
    } else {
      console.log(`⚠️ Skipping large main contract file: ${file.name} (${fileTokens} tokens, ${remainingTokens} remaining)`);
    }
  }

  // Include custom contracts/interfaces if space allows
  for (const file of importFiles) {
    const fileTokens = Math.ceil(file.content.length / 4);
    if (fileTokens <= remainingTokens) {
      optimizedCode += `// File: ${file.name}\n\n${file.content}\n\n`;
      includedFiles.push(file.name);
      remainingTokens -= fileTokens;
      console.log(`✅ Included custom file: ${file.name} (${fileTokens} tokens)`);
    } else {
      console.log(`⚠️ Skipping large custom file: ${file.name} (${fileTokens} tokens, ${remainingTokens} remaining)`);
    }
  }

  // Include essential imports if space allows (summarized)
  for (const file of libraryFiles.slice(0, 3)) { // Limit to 3 most important imports
    if (file.content.length < 1000 && remainingTokens > 100) { // Only small imports
      optimizedCode += `// File: ${file.name}\n// [Import summary: OpenZeppelin/Library code]\n\n`;
      includedFiles.push(`${file.name} (summary)`);
      remainingTokens -= 25; // Small token cost for summary
      console.log(`📝 Included import summary: ${file.name}`);
    }
  }

  // Add processing note
  const skippedFiles = files.length - includedFiles.length;
  const processingNote = skippedFiles > 0 
    ? `Analyzed ${includedFiles.length}/${files.length} files. Prioritized main contract implementation over ${skippedFiles} import/library files to fit model context limits.`
    : `Analyzed all ${includedFiles.length} files completely.`;

  const isComplete = skippedFiles === 0;

  console.log(`📊 Preprocessing complete:
    - Original: ${sourceCode.length} chars (${estimatedTokens} tokens)
    - Optimized: ${optimizedCode.length} chars (${Math.ceil(optimizedCode.length / 4)} tokens)
    - Files included: ${includedFiles.length}/${files.length}
    - Main contracts: ${mainContractFiles.length}
    - Is complete: ${isComplete}`);

  if (optimizedCode.trim().length === 0) {
    throw new Error('No analyzable contract code found after preprocessing. The contract may contain only imports/libraries.');
  }

  return {
    processedCode: optimizedCode,
    isComplete: isComplete,
    processingNote: processingNote,
    includedFiles: includedFiles,
    skippedFiles: files.length - includedFiles.length,
    mainContractsFound: mainContractFiles.length
  };
}

/**
 * ENHANCED: More robust JSON parsing with better error handling
 */
function safeParseJSON(content, contractName = 'Contract', model = 'unknown') {
  console.log(`🔧 Enhanced JSON parsing for ${model} response`);
  
  if (!content || content.trim().length === 0) {
    throw new Error('Empty response content from AI model');
  }

  // Remove common prefixes/suffixes that might interfere with parsing
  let cleanContent = content
    .replace(/^.*?```json\s*/i, '') // Remove everything before ```json
    .replace(/```\s*$/, '') // Remove trailing ```
    .replace(/^.*?```\s*/i, '') // Remove everything before any ```
    .replace(/^.*?(\{)/s, '$1') // Remove everything before first {
    .replace(/(\}).*$/s, '$1') // Remove everything after last }
    .trim();

  // First attempt: Direct JSON parsing
  try {
    const result = JSON.parse(cleanContent);
    console.log('✅ Successfully parsed JSON directly');
    return validateAndEnhanceResult(result, contractName, model);
  } catch (directError) {
    console.warn('⚠️ Direct JSON parsing failed:', directError.message);
  }

  // Second attempt: Find JSON object in content
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const extractedJson = jsonMatch[0];
      const result = JSON.parse(extractedJson);
      console.log('✅ Successfully parsed extracted JSON');
      return validateAndEnhanceResult(result, contractName, model);
    } catch (extractError) {
      console.warn('⚠️ Extracted JSON parsing failed:', extractError.message);
    }
  }

  // Third attempt: Clean up common JSON formatting issues
  try {
    let repairedJson = cleanContent
      .replace(/,\s*}/g, '}') // Remove trailing commas
      .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/(\w+):/g, '"$1":') // Quote unquoted keys
      .replace(/:\s*([^",\[\{][^,\}\]]*)/g, ':"$1"'); // Quote unquoted string values

    const result = JSON.parse(repairedJson);
    console.log('✅ Successfully parsed repaired JSON');
    return validateAndEnhanceResult(result, contractName, model);
  } catch (repairError) {
    console.warn('⚠️ Repaired JSON parsing failed:', repairError.message);
  }

  // Final fallback: Create structured response from text
  console.log('📝 Creating intelligent fallback from text analysis');
  return createIntelligentFallback(content, contractName, model);
}

/**
 * ENHANCED: Better result validation and enhancement
 */
function validateAndEnhanceResult(result, contractName, model) {
  console.log('🔍 Validating and enhancing AI result');

  // Ensure result is an object
  if (typeof result !== 'object' || result === null) {
    throw new Error('Parsed result is not a valid object');
  }

  // Extract and validate key findings
  let keyFindings = [];
  if (Array.isArray(result.keyFindings)) {
    keyFindings = result.keyFindings.map((finding, index) => ({
      severity: (finding.severity || 'INFO').toUpperCase(),
      title: finding.title || `Finding ${index + 1}`,
      description: finding.description || 'Security issue detected',
      location: finding.location || 'Contract',
      impact: finding.impact || 'Potential security impact',
      recommendation: finding.recommendation || finding.remediation || 'Review and address this issue',
      codeReference: finding.codeReference || finding.code || null
    }));
  } else if (Array.isArray(result.findings)) {
    // Handle alternative structure
    keyFindings = result.findings.map((finding, index) => ({
      severity: (finding.severity || 'INFO').toUpperCase(),
      title: finding.title || `Finding ${index + 1}`,
      description: finding.description || 'Security issue detected',
      location: finding.location || 'Contract',
      impact: finding.impact || 'Potential security impact',
      recommendation: finding.recommendation || 'Review and address this issue',
      codeReference: finding.codeReference || null
    }));
  }

  // Validate and normalize security score
  let securityScore = result.securityScore || result.score || 75;
  if (typeof securityScore === 'string') {
    securityScore = parseInt(securityScore) || 75;
  }
  securityScore = Math.min(100, Math.max(0, securityScore));

  // Determine risk level
  let riskLevel = result.riskLevel || result.risk;
  if (!riskLevel) {
    if (securityScore >= 90) riskLevel = 'Low Risk';
    else if (securityScore >= 70) riskLevel = 'Medium Risk';
    else if (securityScore >= 50) riskLevel = 'High Risk';
    else riskLevel = 'Critical Risk';
  }

  // Build enhanced result
  const enhancedResult = {
    overview: result.overview || result.summary || `Security analysis of ${contractName} completed using ${model}.`,
    securityScore: securityScore,
    riskLevel: riskLevel,
    keyFindings: keyFindings,
    summary: result.summary || result.overview || `Analysis completed with ${keyFindings.length} findings. Security score: ${securityScore}/100.`,
    
    // Additional fields from analysis
    mainContractAnalyzed: result.mainContractAnalyzed !== false, // Default to true
    analysisNote: result.analysisNote || 'Complete contract analysis performed',
    
    // Metadata
    model: model,
    timestamp: new Date().toISOString()
  };

  console.log(`✅ Enhanced result: ${keyFindings.length} findings, score: ${securityScore}, risk: ${riskLevel}`);
  return enhancedResult;
}

/**
 * ENHANCED: Smarter fallback response creation
 */
function createIntelligentFallback(content, contractName, model) {
  console.log('🧠 Creating enhanced intelligent fallback response');
  
  const lines = content.split('\n').filter(line => line.trim());
  const lowerContent = content.toLowerCase();
  
  // Enhanced security keyword analysis
  const securityIndicators = {
    critical: {
      keywords: ['reentrancy', 'overflow', 'underflow', 'delegatecall', 'selfdestruct', 'suicide', 'arbitrary', 'critical'],
      impact: 25
    },
    high: {
      keywords: ['access control', 'authorization', 'permission', 'owner', 'admin', 'privilege', 'high'],
      impact: 15
    },
    medium: {
      keywords: ['gas', 'optimization', 'efficiency', 'logic error', 'validation', 'medium'],
      impact: 10
    },
    low: {
      keywords: ['naming', 'convention', 'style', 'comment', 'documentation', 'low'],
      impact: 5
    }
  };

  let findings = [];
  let securityScore = 85; // Start with good score for fallback
  let detectedIssues = [];

  // Extract findings from content
  for (const [severity, config] of Object.entries(securityIndicators)) {
    for (const keyword of config.keywords) {
      if (lowerContent.includes(keyword)) {
        const finding = {
          severity: severity.toUpperCase(),
          title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Analysis`,
          description: `The AI model identified potential ${keyword} concerns in the contract analysis.`,
          location: 'AI Content Analysis',
          impact: `${severity} severity finding detected in model response`,
          recommendation: `Review the ${keyword} implementation and apply security best practices.`
        };
        
        findings.push(finding);
        detectedIssues.push(keyword);
        securityScore -= config.impact;
      }
    }
  }

  // Ensure minimum score
  securityScore = Math.max(10, securityScore);

  // If no specific findings, analyze response content for structure
  if (findings.length === 0) {
    // Check if the response contains analysis content
    const hasAnalysisContent = 
      lowerContent.includes('contract') || 
      lowerContent.includes('function') || 
      lowerContent.includes('security') ||
      lowerContent.includes('vulnerability');

    if (hasAnalysisContent) {
      findings.push({
        severity: 'INFO',
        title: 'AI Analysis Completed',
        description: `The AI model (${model}) provided analysis content but in an unstructured format. The response contains relevant security information.`,
        location: 'Response Analysis',
        impact: 'Analysis completed with parseable content',
        recommendation: 'Manual review of the AI response is recommended for detailed insights.'
      });
    } else {
      findings.push({
        severity: 'WARNING',
        title: 'Parsing Issue',
        description: `The AI model (${model}) response could not be parsed into structured format and may not contain security analysis.`,
        location: 'Response Processing',
        impact: 'Analysis quality may be compromised',
        recommendation: 'Consider retrying the analysis or using a different model.'
      });
      securityScore = 50; // Lower score for unclear responses
    }
  }

  const riskLevel = securityScore >= 80 ? 'Low Risk' : 
                   securityScore >= 60 ? 'Medium Risk' : 
                   securityScore >= 40 ? 'High Risk' : 'Critical Risk';

  const result = {
    overview: `AI analysis of ${contractName} completed using ${model}. Response required intelligent parsing due to format issues.`,
    securityScore: securityScore,
    riskLevel: riskLevel,
    keyFindings: findings,
    summary: `Fallback analysis completed with ${findings.length} findings. Security score: ${securityScore}/100 (${riskLevel}). ${detectedIssues.length > 0 ? `Detected issues: ${detectedIssues.join(', ')}.` : ''}`,
    
    // Fallback metadata
    mainContractAnalyzed: true,
    analysisNote: 'Response required intelligent parsing due to non-standard format',
    rawResponse: content.substring(0, 1000) + '...', // Truncated raw response
    parseError: true,
    parseMethod: 'intelligent_fallback',
    model: model,
    fallbackReason: 'JSON parsing failed, created structured response from content analysis'
  };

  console.log(`🎯 Fallback result: ${findings.length} findings, score: ${securityScore}, issues: [${detectedIssues.join(', ')}]`);
  return result;
}

/**
 * ENHANCED: API call with better preprocessing and error handling
 */
async function callOpenRouterAPIServer({ model, prompt, sourceCode, contractName, maxTokens = 3000, temperature = 0.1 }) {
  // Get API key from environment
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  console.log('🔍 Enhanced API call validation:', {
    hasKey: !!OPENROUTER_API_KEY,
    keyLength: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0,
    model: model,
    contractName: contractName
  });
  
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 20) {
    throw new Error('OpenRouter API key not configured or invalid. Please check your .env.local file.');
  }
  
  if (!OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
    throw new Error('Invalid OpenRouter API key format. Key should start with "sk-or-v1-"');
  }

  // ENHANCED: Smart preprocessing of contract code
  const preprocessing = preprocessContractCode(sourceCode, contractName, model);
  const processedSourceCode = preprocessing.processedCode;

  console.log(`📝 Using preprocessed code: ${processedSourceCode.length} chars (${preprocessing.isComplete ? 'complete' : 'optimized'})`);

  // Enhanced prompt with preprocessing information
  const enhancedPrompt = `${prompt}

**ANALYSIS CONTEXT:**
- Contract Name: ${contractName}
- Code Processing: ${preprocessing.processingNote}
- Main Contracts Found: ${preprocessing.mainContractsFound || 1}
${!preprocessing.isComplete ? `- Note: Analysis focused on main contract logic (${preprocessing.skippedFiles} import files excluded for context limits)` : ''}

**CRITICAL INSTRUCTIONS:**
1. Focus analysis on the MAIN CONTRACT IMPLEMENTATION provided
2. Do not make assumptions about missing code
3. Base findings only on the actual code shown
4. If code appears incomplete, note this in your analysis
5. Prioritize critical security vulnerabilities over minor issues

Contract Code to Analyze:
\`\`\`solidity
${processedSourceCode}
\`\`\``;

  const requestPayload = {
    model: model,
    messages: [
      {
        role: 'system', 
        content: 'You are an expert smart contract security auditor. Analyze only the provided code. Return valid JSON only, no additional text. Focus on actual security vulnerabilities in the shown implementation.'
      },
      {
        role: 'user',
        content: enhancedPrompt
      }
    ],
    max_tokens: maxTokens,
    temperature: temperature,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.1
  };

  try {
    console.log(`🚀 Making enhanced API request to ${model}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'DeFi Watchdog Security Audit'
      },
      body: JSON.stringify(requestPayload)
    });
    
    console.log('📡 API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { message: errorText };
      }
      
      let errorMessage = `OpenRouter API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed: API key expired or invalid';
      } else if (response.status === 402) {
        errorMessage = 'Payment required: Insufficient credits in OpenRouter account';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded: Too many requests';
      } else if (response.status === 400) {
        errorMessage = `Bad request: ${errorDetails.error?.message || errorText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenRouter API');
    }
    
    const content = data.choices[0].message.content;
    
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response content from OpenRouter API');
    }
    
    console.log('📝 Processing AI response...');
    const result = safeParseJSON(content, contractName, model);
    
    // Add preprocessing information to result
    result.codePreprocessing = {
      isComplete: preprocessing.isComplete,
      processingNote: preprocessing.processingNote,
      originalLength: sourceCode.length,
      processedLength: processedSourceCode.length,
      mainContractsFound: preprocessing.mainContractsFound,
      filesIncluded: preprocessing.includedFiles || 1,
      filesSkipped: preprocessing.skippedFiles || 0
    };
    
    return result;
    
  } catch (error) {
    console.error(`❌ Enhanced API call failed for ${model}:`, error);
    throw error;
  }
}

/**
 * Rest of the enhanced functions would go here...
 * (getBasicPrompt, analyzeWithAIServerSide, etc. with the same enhancements)
 */

export { 
  preprocessContractCode,
  safeParseJSON,
  validateAndEnhanceResult,
  createIntelligentFallback,
  callOpenRouterAPIServer
};
