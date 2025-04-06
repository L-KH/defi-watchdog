// src/lib/deepseek.js

/**
 * Enhanced Deep Analysis integration with local API adapter support
 * This module provides a robust interface to AI models with fallback mechanisms
 */

/**
 * Analyzes smart contract code using Deepseek AI
 * @param {string} sourceCode - The contract source code
 * @param {string} contractName - The name of the contract
 * @param {object} options - Additional options for the analysis
 * @returns {Promise<object>} The analysis results
 */
export async function analyzeWithDeepseek(sourceCode, contractName, options = {}) {
  try {
    console.log(`Starting Deepseek analysis for contract: ${contractName}`);
    
    // Define the system prompt for the AI
    const systemPrompt = `
      You are an expert smart contract auditor with deep knowledge of Solidity and blockchain security.
      Your task is to analyze smart contracts and identify potential security risks, vulnerabilities, 
      or suspicious patterns that might indicate malicious intent.

      Focus on detecting:
      1. Owner privileges that could be abused (e.g., unlimited minting, ability to freeze funds)
      2. Hidden backdoors or rug pull mechanisms
      3. Code that prevents users from selling tokens
      4. Unusual or excessive fees
      5. Functions that can drain user funds
      6. Other common vulnerabilities (reentrancy, front-running, etc.)

      Format your response in JSON with the following structure:
      {
        "overview": "Brief explanation of what the contract does",
        "contractType": "Main type of contract (ERC20, ERC721, etc.)",
        "keyFeatures": ["List of main features"],
        "risks": [
          {
            "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
            "title": "Short title for the issue",
            "description": "Description of the risk",
            "codeReference": "The relevant code snippet or function name",
            "impact": "What could happen if exploited",
            "recommendation": "How to fix this issue"
          }
        ],
        "securityScore": 1-100 (higher is safer),
        "riskLevel": "Safe|Low Risk|Medium Risk|High Risk",
        "explanation": "Explanation of the overall assessment"
      }
    `;

    // Truncate code if needed
    let contractCodeTruncated = sourceCode;
    if (sourceCode.length > 30000) {
      const halfSize = 15000;
      contractCodeTruncated = sourceCode.substring(0, halfSize) + 
        "\n\n... [Code truncated due to size limits] ...\n\n" + 
        sourceCode.substring(sourceCode.length - halfSize);
    }

    // Prepare the full prompt
    const fullPrompt = `${systemPrompt}\n\nPlease analyze this ${contractName} smart contract:\n\n\`\`\`solidity\n${contractCodeTruncated}\n\`\`\``;

    // Try using local API adapter first (better for Vercel deployment)
    try {
      // Set a timeout for the adapter call to prevent hanging
      const timeoutDuration = options.timeout || 8000; // 8 seconds default timeout
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('DeepSeek adapter timed out')), timeoutDuration);
      });
      
      // Race between the API call and the timeout
      const analysis = await Promise.race([
        callLocalDeepseekAdapter(fullPrompt, options),
        timeoutPromise
      ]);
      
      return {
        source: 'Deepseek',
        ...analysis,
        rawResponse: undefined // Don't include raw response to save space
      };
    } catch (adapterError) {
      console.warn("Local DeepSeek adapter failed:", adapterError.message);
      
      // If this was a timeout error, we should recommend client-side analysis
      if (adapterError.message.includes('timed out')) {
        return {
          source: 'Deepseek',
          overview: "Analysis timed out. Consider using client-side analysis.",
          contractType: "Smart Contract",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown",
          explanation: "Server-side analysis timed out. Try client-side analysis for better results with complex contracts.",
          useClientAnalysis: true
        };
      }
      
      // Fall back to direct API call if adapter fails with a non-timeout error
      try {
        return await callDeepseekDirect(fullPrompt, options);
      } catch (directError) {
        console.error("Both adapter and direct API failed:", directError.message);
        
        // Return a useful error message
        return {
          source: 'Deepseek',
          overview: "Analysis failed. Consider using client-side analysis.",
          contractType: "Smart Contract",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown",
          explanation: "DeepSeek API analysis failed. Try client-side analysis for better results.",
          useClientAnalysis: true
        };
      }
    }
  } catch (error) {
    console.error("Error analyzing contract with Deepseek:", error);
    
    // Return a basic structure with the error
    return {
      source: 'Deepseek',
      overview: "Analysis failed",
      contractType: "Unknown",
      risks: [],
      securityScore: 0,
      riskLevel: "Unknown",
      explanation: `Analysis failed: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Call the local DeepSeek adapter API with improved error handling
 */
async function callLocalDeepseekAdapter(prompt, options = {}) {
  try {
    const response = await fetch('/api/adapter/deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        source: options.source || 'contract-analysis',
        model: options.model || "deepseek-coder",
        temperature: options.temperature || 0.1,
        max_tokens: options.max_tokens || 4000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `DeepSeek adapter failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the content includes a partial analysis flag
    if (data.content.includes('"status":"partial"') || data.content.includes('"status":"error"')) {
      const partialResults = JSON.parse(data.content);
      
      // If it's a partial result, we should recommend client-side analysis
      if (partialResults.partial_results) {
        return {
          ...partialResults.partial_results,
          useClientAnalysis: true,
          explanation: partialResults.message || "Analysis was incomplete. Try client-side analysis instead."
        };
      }
    }
    
    return JSON.parse(data.content);
  } catch (error) {
    console.error("Error in DeepSeek adapter call:", error.message);
    throw error;
  }
}

/**
 * Call the DeepSeek API directly as fallback
 */
async function callDeepseekDirect(prompt, options = {}) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || options.apiKey;
  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
  
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not found');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: options.model || "deepseek-coder",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.1,
      max_tokens: options.max_tokens || 4000,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API request failed with status ${response.status}`);
  }

  const data = await response.json();
  
  // Extract content from Deepseek response
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

/**
 * Extracts a simple summary from the contract for display purposes
 * @param {string} sourceCode - The contract source code
 * @returns {Promise<string>} A simple explanation of the contract
 */
export async function getContractSummaryWithDeepseek(sourceCode) {
  try {
    const prompt = `Summarize what this smart contract does in 2-3 sentences, in very simple terms for non-technical users:\n\n${sourceCode.substring(0, 15000)}`;
    
    // Try adapter first
    try {
      const response = await fetch('/api/adapter/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          source: 'contract-summary',
          model: "deepseek-coder",
          temperature: 0.3,
          max_tokens: 150
        }),
      });
      
      if (!response.ok) {
        throw new Error(`DeepSeek adapter failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return data.content.trim();
    } catch (adapterError) {
      console.warn("Local DeepSeek adapter failed for summary, using fallback:", adapterError);
      
      // Fallback to simple response
      return "This appears to be a smart contract. For a detailed analysis, continue with the audit process.";
    }
  } catch (error) {
    console.error("Error summarizing contract with Deepseek:", error);
    return "Could not generate summary for this contract.";
  }
}

/**
 * Validates findings with Deepseek for consensus
 */
export async function validateFindingsWithDeepseek(sourceCode, aiAnalysisResults) {
  // Implementation remains the same, but add local adapter support
  try {
    // Only validate if we have findings to validate
    if (!aiAnalysisResults.findings || aiAnalysisResults.findings.length === 0) {
      return aiAnalysisResults;
    }
    
    // Prepare the validation prompt
    const validationPrompt = `
      I need you to validate the following security findings for this smart contract:
      
      Contract Code:
      \`\`\`solidity
      ${sourceCode.slice(0, 10000)}${sourceCode.length > 10000 ? '...(truncated)' : ''}
      \`\`\`
      
      Previous Analysis Findings:
      ${JSON.stringify(aiAnalysisResults.findings, null, 2)}
      
      For each finding, indicate whether you:
      1. CONFIRM - You agree with the finding
      2. DISPUTE - You disagree with the finding
      3. MODIFY - You agree but suggest modifications to severity or details
      
      Explain your reasoning for each and provide your own assessment if you dispute or modify.
      
      Format your response as JSON with these fields:
      {
        "validatedFindings": [
          {
            "originalFinding": (copy of the original finding),
            "validationResult": "CONFIRM|DISPUTE|MODIFY",
            "reasoning": "Your reasoning",
            "modifiedFinding": (modified version if applicable)
          }
        ],
        "missedFindings": [
          (any new findings you identified that were missed)
        ]
      }
    `;
    
    // Try using the local adapter first
    try {
      const response = await fetch('/api/adapter/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: validationPrompt,
          source: 'findings-validation',
          model: "deepseek-coder",
          temperature: 0.2,
          max_tokens: 4000
        }),
      });
      
      if (!response.ok) {
        throw new Error(`DeepSeek adapter failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const validationResults = JSON.parse(data.content);
      
      // Merge the validated findings
      return mergeValidatedFindings(aiAnalysisResults, validationResults);
    } catch (adapterError) {
      console.warn("Local DeepSeek adapter failed for validation, returning original findings:", adapterError);
      return aiAnalysisResults;
    }
  } catch (error) {
    console.error("Validation failed with Deepseek:", error);
    // Return original findings if validation fails
    return aiAnalysisResults;
  }
}

/**
 * Merge the validated findings into the final results
 */
function mergeValidatedFindings(aiAnalysisResults, validationResults) {
  const mergedFindings = [];
  
  // Process validated findings
  if (validationResults.validatedFindings) {
    for (const validatedFinding of validationResults.validatedFindings) {
      if (validatedFinding.validationResult === "CONFIRM") {
        // Add confirmed finding as-is
        mergedFindings.push(validatedFinding.originalFinding);
      } else if (validatedFinding.validationResult === "MODIFY" && validatedFinding.modifiedFinding) {
        // Add the modified version
        mergedFindings.push(validatedFinding.modifiedFinding);
      }
      // Disputed findings are excluded
    }
  }
  
  // Add any missed findings
  if (validationResults.missedFindings) {
    mergedFindings.push(...validationResults.missedFindings);
  }
  
  // If no findings passed validation, return the original findings
  if (mergedFindings.length === 0) {
    return aiAnalysisResults;
  }
  
  // Return merged results
  return {
    ...aiAnalysisResults,
    findings: mergedFindings
  };
}