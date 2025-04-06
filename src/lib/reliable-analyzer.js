// src/lib/reliable-analyzer.js
import { getContractSource } from './etherscan';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Universal smart contract analyzer that works reliably without timeouts
 */
export async function analyzeContract(address, network = 'linea', options = {}) {
  const updateProgress = (progress) => {
    if (options.updateCallback) {
      options.updateCallback(progress);
    }
  };

  updateProgress({
    isLoading: true,
    step: 'Initializing analysis...',
    progress: 5,
    address,
    network
  });

  try {
    // Step 1: Get contract source code
    updateProgress({
      isLoading: true,
      step: 'Fetching contract source code...',
      progress: 10,
      address,
      network
    });

    const contractData = await getContractSource(address, network);
    
    if (!contractData.sourceCode || contractData.sourceCode === '') {
      return {
        success: false,
        address,
        network,
        contractName: `Contract-${address.slice(0, 8)}`,
        contractType: "Unverified Contract",
        analysis: {
          contractType: "Unverified Contract",
          overview: "Contract source code is not verified or available",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown",
          explanation: "This contract does not have verified source code available."
        },
        securityScore: 0,
        riskLevel: "Unknown", 
        isSafe: false,
        error: "Contract source code not verified or available",
        etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`
      };
    }

    // Step 2: Perform static analysis for immediate feedback
    updateProgress({
      isLoading: true,
      step: 'Performing static analysis...',
      progress: 30,
      address,
      network
    });

    const staticAnalysisResults = performStaticAnalysis(contractData.sourceCode);
    
    // Update with preliminary results
    updateProgress({
      isLoading: true,
      step: 'Static analysis complete. Running AI analysis...',
      progress: 50,
      address,
      network,
      preliminaryResults: {
        risks: staticAnalysisResults.map(finding => ({
          severity: finding.severity,
          title: finding.type,
          description: finding.description
        }))
      }
    });

    // Step 3: Perform AI analysis
    updateProgress({
      isLoading: true,
      step: 'Analyzing contract with DeepSeek AI...',
      progress: 60,
      address,
      network
    });

    // Get API key - first try server, then local
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error("No DeepSeek API key available");
    }

    // Analyze with DeepSeek
    const analysis = await callDeepSeekAPI(
      contractData.sourceCode,
      contractData.contractName || `Contract-${address.slice(0, 8)}`,
      apiKey
    );

    // Step 4: Generate final report
    updateProgress({
      isLoading: true,
      step: 'Generating comprehensive report...',
      progress: 90,
      address,
      network
    });

    const securityScore = analysis.securityScore || 
                          calculateScoreFromStaticAnalysis(staticAnalysisResults);
    
    const result = {
      success: true,
      address,
      network,
      contractName: contractData.contractName || `Contract-${address.slice(0, 8)}`,
      contractType: analysis.contractType || determineContractType(contractData.sourceCode),
      compiler: contractData.compiler || "Unknown",
      analysis: {
        contractType: analysis.contractType || determineContractType(contractData.sourceCode),
        overview: analysis.overview || "Analysis completed successfully",
        keyFeatures: analysis.keyFeatures || extractFeatures(contractData.sourceCode),
        risks: analysis.risks || convertStaticFindingsToRisks(staticAnalysisResults),
        securityScore: securityScore,
        riskLevel: determineRiskLevel(securityScore),
        explanation: analysis.explanation || generateExplanation(staticAnalysisResults)
      },
      securityScore,
      riskLevel: determineRiskLevel(securityScore),
      isSafe: securityScore > 80,
      timestamp: new Date().toISOString(),
      etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`
    };

    // Submit results to persist them (non-blocking)
    try {
      fetch('/api/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      }).catch(e => console.error('Error submitting audit result:', e));
    } catch (error) {
      console.error('Failed to submit results:', error);
    }

    // Complete!
    updateProgress({
      isLoading: false,
      step: 'Analysis complete!',
      progress: 100,
      address,
      network,
      result
    });

    return result;
  } catch (error) {
    console.error('Contract analysis failed:', error);
    
    updateProgress({
      isLoading: false,
      step: 'Analysis failed',
      progress: 100,
      error: error.message,
      address,
      network
    });

    return {
      success: false,
      address,
      network,
      error: error.message,
      contractName: `Contract-${address.slice(0, 8)}`,
      contractType: "Error",
      analysis: {
        overview: "Analysis failed: " + error.message,
        risks: [],
        securityScore: 0,
        riskLevel: "Unknown"
      },
      securityScore: 0,
      riskLevel: "Unknown",
      isSafe: false,
      etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`
    };
  }
}

/**
 * Call DeepSeek API directly from browser
 */
async function callDeepSeekAPI(sourceCode, contractName, apiKey) {
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
    6. Known vulnerabilities like reentrancy, front-running, integer overflow, etc.

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

  const fullPrompt = `${systemPrompt}\n\nPlease analyze this ${contractName} smart contract:\n\n\`\`\`solidity\n${contractCodeTruncated}\n\`\`\``;

  // Call deepseek API with timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-coder",
        messages: [
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    
    try {
      // Parse and return the content
      return JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error("Failed to parse DeepSeek response:", parseError);
      // Return a basic structure if parsing fails
      return {
        overview: "Analysis completed but response format was unexpected",
        contractType: "Smart Contract",
        risks: [],
        securityScore: 50
      };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('DeepSeek API request timed out after 60 seconds');
    }
    throw error;
  }
}

/**
 * Get API key from server or local storage
 */
async function getApiKey() {
  // First try to use the server-provided key
  try {
    const response = await fetch('/api/key/deepseek');
    if (response.ok) {
      const data = await response.json();
      if (data.key) {
        console.log("Using server-provided DeepSeek API key");
        return data.key;
      }
    }
  } catch (error) {
    console.error('Error fetching server API key:', error);
  }
  
  // If server key fails, try local storage
  let apiKey = localStorage.getItem('deepseek_api_key');
  
  // If no API key is stored, prompt the user
  if (!apiKey) {
    apiKey = prompt('Please enter your DeepSeek API key to analyze this contract:');
    
    // Store the API key if provided
    if (apiKey) {
      localStorage.setItem('deepseek_api_key', apiKey);
    }
  }
  
  return apiKey;
}

/**
 * Perform static analysis on the contract code
 */
function performStaticAnalysis(sourceCode) {
  const findings = [];
  
  const vulnerabilityPatterns = {
    reentrancy: {
      pattern: /(\bexternal\b.*?\bcall\b.*?{[^}]*?\bbalance\b)|(\bexternal\b.*?\bcall\b.*?{[^}]*?\btransfer\b)/i,
      description: "Potential reentrancy vulnerability detected. The contract may call external contracts before state changes.",
      severity: "HIGH"
    },
    txOrigin: {
      pattern: /tx\.origin/i,
      description: "Usage of tx.origin for authorization. This is unsafe as it can lead to phishing attacks.",
      severity: "MEDIUM"
    },
    uncheckedReturn: {
      pattern: /\.call\{[^}]*\}\([^;]*\)[^;]*;(?![^;]*require)/i,
      description: "Unchecked return value from low-level call. Always check return values from external calls.",
      severity: "MEDIUM"
    },
    unsafeArithmetic: {
      pattern: /(?<!\busing\s+SafeMath\b)(\b\w+\s*\+=|\b\w+\s*\-=|\b\w+\s*\*=|\b\w+\s*\/=)/i,
      description: "Possible integer overflow/underflow. Consider using SafeMath or Solidity 0.8+ for checked arithmetic.",
      severity: "MEDIUM"
    },
    delegatecall: {
      pattern: /\.delegatecall/i,
      description: "Usage of delegatecall. This is a powerful feature that can be dangerous if misused.",
      severity: "HIGH"
    },
    selfdestruct: {
      pattern: /selfdestruct|suicide/i,
      description: "Contract can self-destruct. Ensure proper access controls around this functionality.",
      severity: "MEDIUM"
    }
  };
  
  for (const [vulnType, vulnInfo] of Object.entries(vulnerabilityPatterns)) {
    if (vulnInfo.pattern.test(sourceCode)) {
      findings.push({
        type: vulnType,
        description: vulnInfo.description,
        severity: vulnInfo.severity
      });
    }
  }
  
  const hasOpenZeppelin = /\@openzeppelin/.test(sourceCode);
  const hasSafeTransfer = /safeTransfer/.test(sourceCode);
  
  if (hasOpenZeppelin) {
    findings.push({
      type: "securityLibrary",
      description: "Contract uses OpenZeppelin libraries which is a good security practice.",
      severity: "INFO"
    });
  }
  
  if (hasSafeTransfer) {
    findings.push({
      type: "secureTransfer",
      description: "Contract uses safeTransfer functions, which is safer than regular transfer.",
      severity: "INFO"
    });
  }
  
  return findings;
}

/**
 * Calculate a security score based on static analysis findings
 */
function calculateScoreFromStaticAnalysis(findings) {
  let score = 85; // Start with a good score
  
  for (const finding of findings) {
    if (finding.severity === "CRITICAL") score -= 20;
    else if (finding.severity === "HIGH") score -= 15;
    else if (finding.severity === "MEDIUM") score -= 10;
    else if (finding.severity === "LOW") score -= 5;
    else if (finding.severity === "INFO" && finding.type === "securityLibrary") score += 5;
  }
  
  return Math.max(20, Math.min(score, 95)); // Keep between 20 and 95
}

/**
 * Convert static analysis findings to risk format
 */
function convertStaticFindingsToRisks(findings) {
  return findings.map(finding => ({
    severity: finding.severity,
    title: finding.type,
    description: finding.description,
    impact: "Could potentially affect contract security",
    recommendation: "Review the code patterns identified and ensure proper safeguards are in place"
  }));
}

/**
 * Determine contract type based on source code
 */
function determineContractType(sourceCode) {
  if (sourceCode.includes("ERC20") || sourceCode.match(/function\s+transfer\s*\(\s*address\s+.*,\s*uint/)) {
    return "ERC20 Token";
  } else if (sourceCode.includes("ERC721") || sourceCode.match(/function\s+ownerOf\s*\(\s*uint/)) {
    return "ERC721 NFT";
  } else if (sourceCode.includes("ERC1155")) {
    return "ERC1155 Multi-Token";
  } else if (sourceCode.includes("swap") && (sourceCode.includes("pair") || sourceCode.includes("router"))) {
    return "DEX / AMM";
  } else if (sourceCode.includes("borrow") || sourceCode.includes("lend")) {
    return "Lending Protocol";
  } else if (sourceCode.includes("stake") || sourceCode.includes("reward")) {
    return "Staking / Yield";
  } else if (sourceCode.includes("DAO") || sourceCode.includes("vote") || sourceCode.includes("governance")) {
    return "Governance";
  } else {
    return "Smart Contract";
  }
}

/**
 * Extract key features based on contract code
 */
function extractFeatures(sourceCode) {
  const features = [];
  
  if (sourceCode.includes("transfer") || sourceCode.includes("balanceOf")) {
    features.push("Token transfers");
  }
  
  if (sourceCode.includes("approve") || sourceCode.includes("allowance")) {
    features.push("Token approvals");
  }
  
  if (sourceCode.includes("mint")) {
    features.push("Token minting");
  }
  
  if (sourceCode.includes("burn")) {
    features.push("Token burning");
  }
  
  if (sourceCode.includes("owner") || sourceCode.includes("Ownable")) {
    features.push("Owner-controlled functions");
  }
  
  if (sourceCode.includes("pause") || sourceCode.includes("Pausable")) {
    features.push("Pausable functionality");
  }
  
  if (features.length === 0) {
    features.push("Custom contract functionality");
  }
  
  return features;
}

/**
 * Generate explanation based on static analysis
 */
function generateExplanation(findings) {
  const criticalCount = findings.filter(f => f.severity === "CRITICAL").length;
  const highCount = findings.filter(f => f.severity === "HIGH").length;
  const mediumCount = findings.filter(f => f.severity === "MEDIUM").length;
  const lowCount = findings.filter(f => f.severity === "LOW").length;
  const infoCount = findings.filter(f => f.severity === "INFO").length;
  
  if (criticalCount > 0) {
    return `This contract has ${criticalCount} critical vulnerabilities that should be addressed immediately. Overall, ${criticalCount + highCount + mediumCount + lowCount} issues were identified.`;
  } else if (highCount > 0) {
    return `This contract has ${highCount} high severity issues that should be addressed. In total, ${highCount + mediumCount + lowCount} potential vulnerabilities were found.`;
  } else if (mediumCount > 0) {
    return `This contract has ${mediumCount} medium severity issues and ${lowCount} low severity issues that should be reviewed.`;
  } else if (lowCount > 0) {
    return `This contract has ${lowCount} low severity issues, but appears generally secure.`;
  } else {
    return `No significant security issues were identified in this contract.`;
  }
}

/**
 * Determine risk level based on security score
 */
function determineRiskLevel(securityScore) {
  if (securityScore >= 90) return "Safe";
  if (securityScore >= 75) return "Low Risk";
  if (securityScore >= 60) return "Medium Risk";
  return "High Risk";
}
