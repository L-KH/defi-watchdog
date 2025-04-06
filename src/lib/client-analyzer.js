// src/lib/client-analyzer.js
import { getContractSource, getContractInfo, getEtherscanUrl } from './etherscan';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function analyzeContractClientSide(address, network = 'linea', options = {}) {
  try {
    const initialState = {
      isLoading: true,
      step: 'Fetching contract source code...',
      progress: 10,
      address,
      network
    };
    
    if (options.updateCallback) {
      options.updateCallback(initialState);
    }
    
    try {
      const contractData = await getContractSource(address, network);
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: true,
          step: 'Contract source code retrieved.',
          progress: 30,
          address,
          network
        });
      }
      
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
          error: "Contract source code not verified or available"
        };
      }
      
      // Rest of your analysis code here with contractData...
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: true,
          step: 'Performing security audit with Deep Analysis AI...',
          progress: 50,
          address,
          network
        });
      }
      
      const staticAnalysisResults = performStaticAnalysis(contractData.sourceCode);
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: true,
          step: 'Static analysis complete. Running deep analysis...',
          progress: 60,
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
      }
      
      const deepseekAnalysis = await analyzeWithDeepseekClientSide(
        contractData.sourceCode, 
        contractData.contractName || `Contract-${address.slice(0, 8)}`
      );
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: true,
          step: 'AI analysis complete. Generating final report...',
          progress: 90,
          address,
          network
        });
      }
      
      const securityScore = deepseekAnalysis.securityScore || 50;
      const result = {
        success: true,
        address,
        network,
        contractName: contractData.contractName || `Contract-${address.slice(0, 8)}`,
        contractType: deepseekAnalysis.contractType || "Smart Contract",
        compiler: contractData.compiler || "Unknown",
        analysis: {
          contractType: deepseekAnalysis.contractType || "Smart Contract",
          overview: deepseekAnalysis.overview || "Analysis completed",
          keyFeatures: deepseekAnalysis.keyFeatures || [],
          risks: deepseekAnalysis.risks || [],
          securityScore: securityScore,
          riskLevel: determineRiskLevel(securityScore),
          explanation: deepseekAnalysis.explanation || "Analysis complete"
        },
        securityScore,
        riskLevel: determineRiskLevel(securityScore),
        isSafe: securityScore > 80,
        timestamp: new Date().toISOString(),
        etherscanUrl: getEtherscanUrl(address, network)
      };
      
      try {
        fetch('/api/audit/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result)
        }).catch(e => console.error('Error submitting audit result:', e));
      } catch (submitError) {
        console.error('Error submitting audit result:', submitError);
      }
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: false,
          step: 'Analysis complete',
          progress: 100,
          address,
          network,
          result
        });
      }
      
      return result;
    } catch (sourceError) {
      console.error('Error fetching contract source:', sourceError);
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: false,
          step: 'Contract verification error',
          progress: 100,
          error: 'Contract source code not verified or unavailable on Etherscan',
          address,
          network
        });
      }
      
      return {
        success: false,
        address,
        network,
        contractName: `Contract-${address.slice(0, 8)}`,
        contractType: "Unverified Contract",
        analysis: {
          contractType: "Unverified Contract",
          overview: "Contract source code is not verified or available on Etherscan",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown",
          explanation: "This contract does not have verified source code available. Please verify your contract on Etherscan before analysis."
        },
        securityScore: 0,
        riskLevel: "Unknown", 
        isSafe: false,
        error: "Contract source code not verified or available"
      };
    }
    
    // This code section has been moved to the try block above
  } catch (error) {
    console.error('Client-side analysis failed:', error);
    
    if (options.updateCallback) {
      options.updateCallback({
        isLoading: false,
        step: 'Analysis failed',
        progress: 100,
        error: error.message,
        address,
        network
      });
    }
    
    return {
      success: false,
      address,
      network,
      error: error.message,
      contractName: `Contract-${address.slice(0, 8)}`,
      contractType: "Unknown",
      analysis: {
        overview: "Analysis failed: " + error.message,
        risks: [],
        securityScore: 0,
        riskLevel: "Unknown"
      },
      securityScore: 0,
      riskLevel: "Unknown",
      isSafe: false
    };
  }
}

async function analyzeWithDeepseekClientSide(sourceCode, contractName) {
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    throw new Error('DeepSeek API key is required for client-side analysis');
  }
  
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

  let contractCodeTruncated = sourceCode;
  if (sourceCode.length > 30000) {
    const halfSize = 15000;
    contractCodeTruncated = sourceCode.substring(0, halfSize) + 
      "\n\n... [Code truncated due to size limits] ...\n\n" + 
      sourceCode.substring(sourceCode.length - halfSize);
  }

  const fullPrompt = `${systemPrompt}\n\nPlease analyze this ${contractName} smart contract:\n\n\`\`\`solidity\n${contractCodeTruncated}\n\`\`\``;

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
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API request failed: ${errorText}`);
  }

  const data = await response.json();
  
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

async function getApiKey() {
  // First try to use the server-provided key
  try {
    const response = await fetch('/api/key/deepseek');
    if (response.ok) {
      const data = await response.json();
      if (data.key) {
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
    apiKey = prompt('Please enter your Deep Analysis API key to analyze this contract:');
    
    // Store the API key if provided
    if (apiKey) {
      localStorage.setItem('deepseek_api_key', apiKey);
    }
  }
  
  return apiKey;
}

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

function determineRiskLevel(securityScore) {
  if (securityScore >= 90) return "Safe";
  if (securityScore >= 75) return "Low Risk";
  if (securityScore >= 60) return "Medium Risk";
  return "High Risk";
}