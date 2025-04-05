/**
 * Browser-based Smart Contract Analyzer
 * 
 * This module performs lightweight contract analysis directly in the browser
 * when the server-side analysis times out. It fetches the contract source code
 * and performs pattern-based analysis to identify common issues.
 */

// Common vulnerability patterns to check in contract code
const VULNERABILITY_PATTERNS = {
  reentrancy: {
    pattern: /(\bexternal\b.*?\bcall\b.*?{[^}]*?\bbalance\b)|(\bexternal\b.*?\bcall\b.*?{[^}]*?\btransfer\b)/i,
    description: "Potential reentrancy vulnerability detected",
    severity: "HIGH",
    impact: "Could allow attackers to recursively call back into the contract and drain funds",
    recommendation: "Implement checks-effects-interactions pattern or use ReentrancyGuard"
  },
  txOrigin: {
    pattern: /tx\.origin/i,
    description: "Usage of tx.origin for authorization",
    severity: "MEDIUM",
    impact: "Could enable phishing attacks that bypass authorization",
    recommendation: "Use msg.sender instead of tx.origin for authorization"
  },
  uncheckedReturn: {
    pattern: /\.call\{[^}]*\}\([^;]*\)[^;]*;(?![^;]*require)/i,
    description: "Unchecked return value from low-level call",
    severity: "MEDIUM",
    impact: "May ignore failed operations and lead to unexpected behavior",
    recommendation: "Always check return values from external calls"
  },
  selfdestruct: {
    pattern: /selfdestruct|suicide/i,
    description: "Contract can self-destruct",
    severity: "MEDIUM",
    impact: "Could permanently destroy the contract if not properly protected",
    recommendation: "Ensure proper access controls around selfdestruct functionality"
  },
  delegatecall: {
    pattern: /\.delegatecall/i,
    description: "Usage of delegatecall",
    severity: "HIGH",
    impact: "Can be dangerous if misused as it executes code in the context of the calling contract",
    recommendation: "Ensure delegatecall is used with trusted contracts and has proper access controls"
  },
  assembly: {
    pattern: /\bassembly\s*{/i,
    description: "Usage of inline assembly",
    severity: "INFO", 
    impact: "Bypasses Solidity safety features and may introduce vulnerabilities",
    recommendation: "Review assembly code carefully for potential issues"
  },
  timestamp: {
    pattern: /block\.timestamp|now/i,
    description: "Dependence on block timestamp",
    severity: "LOW",
    impact: "Miners can manipulate timestamps slightly, which can affect time-dependent logic",
    recommendation: "Don't rely on precise timestamps for critical decisions"
  },
  // New patterns for more comprehensive analysis
  frontrunning: {
    pattern: /block\.number|block\.timestamp|blockhash/i,
    description: "Potential vulnerability to front-running attacks",
    severity: "MEDIUM",
    impact: "Transactions could be manipulated by miners or other users observing the mempool",
    recommendation: "Implement commit-reveal schemes or use private transactions for sensitive operations"
  },
  arbitraryJump: {
    pattern: /assembly\s*{[^}]*jump/i,
    description: "Arbitrary jump in assembly code",
    severity: "HIGH",
    impact: "Could lead to unexpected program flow or exploitation of contract",
    recommendation: "Avoid arbitrary jumps in assembly"
  },
  uninitialized: {
    pattern: /\bcontract\s+[^{]*{[^}]*\bfunction\s+[^\)]*\)[^{]*{[^}]*\}/i,
    description: "Potential uninitialized contract or variables",
    severity: "LOW", 
    impact: "Uninitialized variables may contain unexpected values",
    recommendation: "Ensure all variables are properly initialized"
  },
  shadowedVariables: {
    pattern: /\bcontract\s+([^{]*)\s*{[^}]*\bfunction\s+[^\)]*\)[^{]*{[^}]*\b\1\b/i,
    description: "Variables might be shadowed",
    severity: "LOW",
    impact: "Could lead to confusion and bugs in the code",
    recommendation: "Avoid using the same name for different variables in different scopes"
  }
};

// Security best practices to check
const SECURITY_BEST_PRACTICES = {
  reentrancyGuard: {
    pattern: /\bnonReentrant\b|ReentrancyGuard|_notEntered\b/i,
    description: "Uses ReentrancyGuard or similar protection",
    severity: "INFO",
    impact: "Positive: Protects against reentrancy attacks",
    recommendation: "Good practice to maintain"
  },
  safeERC20: {
    pattern: /\bSafeERC20\b|safeTransfer|safeApprove/i,
    description: "Uses SafeERC20 for token operations",
    severity: "INFO",
    impact: "Positive: Safer handling of non-standard ERC20 implementations",
    recommendation: "Good practice to maintain"
  },
  accessControl: {
    pattern: /\bAccessControl\b|onlyOwner|Ownable|onlyRole/i,
    description: "Implements access control mechanisms",
    severity: "INFO",
    impact: "Positive: Restricts access to sensitive functions",
    recommendation: "Good practice to maintain"
  },
  pausable: {
    pattern: /\bPausable\b|\bpaused\(\)/i,
    description: "Contract can be paused in emergency",
    severity: "INFO",
    impact: "Positive: Allows for emergency stop functionality",
    recommendation: "Good practice to maintain"
  },
  pullOverPush: {
    pattern: /\bwithdraw\b|\bclaim\b/i,
    description: "Possibly uses pull-over-push pattern",
    severity: "INFO",
    impact: "Positive: Safer fund distribution, reduces risk of denial of service",
    recommendation: "Good practice to maintain"
  }
};

// Pattern matching for contract types
const CONTRACT_TYPE_PATTERNS = {
  "ERC20 Token": {
    pattern: /interface\s+IERC20|contract\s+.*\s+is\s+.*ERC20|function\s+transfer\s*\(\s*address.*,\s*uint/i,
    features: [
      "Token transfers and approvals", 
      "Balance tracking per address", 
      "Allowance mechanism for delegated spending"
    ]
  },
  "ERC721 NFT": {
    pattern: /interface\s+IERC721|contract\s+.*\s+is\s+.*ERC721|function\s+ownerOf\s*\(\s*uint/i,
    features: [
      "NFT minting and transfers", 
      "Token ownership management", 
      "Metadata handling"
    ]
  },
  "ERC1155 Multi-Token": {
    pattern: /interface\s+IERC1155|contract\s+.*\s+is\s+.*ERC1155|function\s+balanceOfBatch/i,
    features: [
      "Multiple token management",
      "Batch transfers",
      "Single contract for fungible and non-fungible tokens"
    ]
  },
  "Proxy Contract": {
    pattern: /function\s+_delegate\s*\(|delegatecall|upgradeability|function\s+implementation\s*\(/i,
    features: [
      "Upgradeable contract logic",
      "Delegate calls to implementation",
      "Storage management"
    ]
  },
  "Staking Contract": {
    pattern: /\bstake\b|\bstaking\b|\breward\b|\byield\b/i,
    features: [
      "Token staking mechanism",
      "Reward distribution",
      "Time-based calculations"
    ]
  },
  "DEX / AMM": {
    pattern: /\bswap\b|\bliquidity\b|\bpair\b|\bpool\b|\brouter\b/i,
    features: [
      "Token swapping and exchange",
      "Liquidity provision",
      "Price discovery mechanism"
    ]
  },
  "Lending Protocol": {
    pattern: /\bborrow\b|\blend\b|\bcollateral\b|\binterest\b/i,
    features: [
      "Asset lending and borrowing",
      "Collateral management",
      "Interest rate calculation"
    ]
  },
  "Governance": {
    pattern: /\bvote\b|\bproposal\b|\bgovernance\b|\bquorum\b/i,
    features: [
      "Voting mechanisms",
      "Proposal creation and execution",
      "Governance token integration"
    ]
  }
};

// Common access control patterns
const ACCESS_CONTROL_PATTERNS = {
  "Owner-based": {
    pattern: /\bonlyOwner\b|\bOwnable\b|\brequire\s*\(\s*msg\.sender\s*==\s*owner\b/i,
    description: "Contract uses ownership-based access control (Ownable pattern)"
  },
  "Role-based": {
    pattern: /\bAccessControl\b|\brequire\s*\(\s*hasRole\b|\bonlyRole\b/i,
    description: "Contract uses role-based access control"
  },
  "Multi-signature": {
    pattern: /\bmulti-?sig\b|\brequire\s*\(\s*[^\n]*signatures/i,
    description: "Contract uses multi-signature patterns for approval"
  },
  "No access control": {
    pattern: /^(?!.*onlyOwner|Ownable|hasRole|AccessControl).*/i,
    description: "No clear access control pattern detected - possible risk"
  }
};

/**
 * Try multiple API endpoints to improve reliability of source code fetching
 */
async function fetchContractSourceWithRetry(address, network) {
  const endpoints = [];
  
  if (network === 'sonic') {
    endpoints.push({
      url: 'https://api.sonicscan.org/api',
      apiKey: 'VKP7YAV3PUNSZ7AUQRAIBDU6JRDV8SJ882'
    });
    // Add fallback API endpoint for Sonic if available
  } else { // linea or mainnet
    endpoints.push({
      url: 'https://api.lineascan.build/api',
      apiKey: 'G9EAEUV9VBS9PGEKUWQUHGJW2FXNWHUW5X'
    });
    // Add fallback endpoints for Linea
    endpoints.push({
      url: 'https://api-linea.etherscan.io/api', 
      apiKey: 'YDJ42EJ1G58WS9M7HRDPAA1Z2DCXRF95MY'
    });
  }
  
  let lastError = null;
  
  // Try each endpoint until one succeeds
  for (const endpoint of endpoints) {
    try {
      const fullUrl = `${endpoint.url}?module=contract&action=getsourcecode&address=${address}&apikey=${endpoint.apiKey}`;
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if API returned valid data
      if (data.status !== '1' || !data.result || !data.result[0]) {
        throw new Error('API returned no data or error status');
      }
      
      const contractData = data.result[0];
      
      // Check if source code is available
      if (!contractData.SourceCode) {
        throw new Error('Contract source code not verified or available');
      }
      
      // Process source code based on how it's stored
      let sourceCode = contractData.SourceCode;
      
      // Handle Etherscan's special JSON format for multi-file contracts
      if (sourceCode.startsWith('{') && sourceCode.includes('sources')) {
        try {
          // Some contracts have double-encoded JSON
          if (sourceCode.startsWith('{{')) {
            sourceCode = sourceCode.substring(1, sourceCode.length - 1);
          }
          
          const parsed = JSON.parse(sourceCode);
          
          // Get the main contract file or concatenate all files
          if (parsed.sources) {
            const sources = Object.values(parsed.sources)
              .map(source => source.content || '')
              .filter(content => content.length > 0);
            
            sourceCode = sources.join('\n\n// Next Contract File\n\n');
          }
        } catch (err) {
          console.error('Error parsing multi-file contract:', err);
          // Continue with raw sourceCode if parsing fails
        }
      }
      
      return {
        address,
        sourceCode,
        contractName: contractData.ContractName || `Contract-${address.slice(0, 8)}`,
        compiler: contractData.CompilerVersion || 'Unknown',
        optimization: contractData.OptimizationUsed === '1',
        constructorArguments: contractData.ConstructorArguments || '',
        isProxy: contractData.Proxy === '1',
        network
      };
    } catch (error) {
      console.error(`Error with endpoint ${endpoint.url}:`, error);
      lastError = error;
      // Continue to next endpoint
    }
  }
  
  // If we've exhausted all endpoints without success, throw the last error
  throw lastError || new Error('Failed to fetch contract source from all available endpoints');
}

/**
 * Extract code snippets for findings
 */
function extractCodeSnippet(sourceCode, pattern) {
  try {
    const matches = sourceCode.match(pattern);
    if (!matches || !matches[0]) return null;
    
    const match = matches[0];
    const matchStart = sourceCode.indexOf(match);
    
    // Find the start of the line
    let snippetStart = sourceCode.lastIndexOf('\n', matchStart);
    snippetStart = snippetStart === -1 ? 0 : snippetStart + 1;
    
    // Find the end of the line + 3 more lines
    let snippetEnd = matchStart;
    for (let i = 0; i < 4; i++) {
      const nextNewline = sourceCode.indexOf('\n', snippetEnd + 1);
      snippetEnd = nextNewline === -1 ? sourceCode.length : nextNewline;
    }
    
    return sourceCode.substring(snippetStart, snippetEnd).trim();
  } catch (error) {
    console.error('Error extracting code snippet:', error);
    return null;
  }
}

/**
 * Perform a browser-based security analysis of the contract
 */
async function analyzeSecurity(address, network) {
  try {
    console.log(`Starting browser-side analysis for ${address} on ${network}`);
    
    // Fetch contract source code with retry mechanism
    const contractData = await fetchContractSourceWithRetry(address, network);
    console.log(`Successfully fetched source code for ${contractData.contractName}`);
    
    // Default results if we can't determine specific details
    let contractType = "Custom Smart Contract";
    let features = ["Custom contract functionality"];
    let accessControl = "Unknown access control pattern";
    let findings = [];
    let securityScore = 85; // Start with a good score by default (more optimistic approach)
    
    // Determine contract type
    for (const [type, typeData] of Object.entries(CONTRACT_TYPE_PATTERNS)) {
      if (typeData.pattern.test(contractData.sourceCode)) {
        contractType = type;
        features = typeData.features;
        break;
      }
    }
    
    // Determine access control mechanism
    let foundAccessControl = false;
    for (const [type, typeData] of Object.entries(ACCESS_CONTROL_PATTERNS)) {
      if (typeData.pattern.test(contractData.sourceCode)) {
        accessControl = typeData.description;
        // Adding access control as an info finding
        findings.push({
          severity: type === "No access control" ? "MEDIUM" : "INFO",
          description: accessControl,
          impact: type === "No access control" ? 
            "Lack of access control can lead to unauthorized actions" : 
            "Properly implemented access control can prevent unauthorized actions",
          recommendation: type === "No access control" ? 
            "Implement appropriate access controls for sensitive functions" :
            "Ensure access controls are properly implemented and tested",
          codeSnippet: null
        });
        foundAccessControl = true;
        break;
      }
    }
    
    // If no specific access control was detected, add a generic note
    if (!foundAccessControl) {
      findings.push({
        severity: "INFO",
        description: "No standard access control pattern detected",
        impact: "Unable to determine how sensitive functions are protected",
        recommendation: "Review how privileged operations are secured"
      });
    }
    
    // Check for vulnerabilities
    const vulnerabilityFindings = [];
    
    for (const [vulnType, vulnData] of Object.entries(VULNERABILITY_PATTERNS)) {
      if (vulnData.pattern.test(contractData.sourceCode)) {
        const codeSnippet = extractCodeSnippet(contractData.sourceCode, vulnData.pattern);
        
        vulnerabilityFindings.push({
          severity: vulnData.severity,
          description: vulnData.description,
          impact: vulnData.impact,
          recommendation: vulnData.recommendation,
          codeSnippet: codeSnippet
        });
        
        // Adjust security score based on severity
        const severityImpact = {
          "CRITICAL": 25,
          "HIGH": 15,
          "MEDIUM": 10,
          "LOW": 5,
          "INFO": 0
        };
        
        securityScore -= severityImpact[vulnData.severity] || 0;
      }
    }
    
    // Check for security best practices
    for (const [practiceType, practiceData] of Object.entries(SECURITY_BEST_PRACTICES)) {
      if (practiceData.pattern.test(contractData.sourceCode)) {
        findings.push({
          severity: "INFO",
          description: practiceData.description,
          impact: practiceData.impact,
          recommendation: practiceData.recommendation
        });
        
        // Slightly increase score for good practices
        securityScore += 2; // Small boost for each good practice
      }
    }
    
    // Add vulnerability findings to the main findings list
    findings = [...findings, ...vulnerabilityFindings];
    
    // Add standard compliance finding for known contract types
    if (contractType !== "Custom Smart Contract") {
      findings.push({
        severity: "INFO",
        description: `Contract appears to implement ${contractType} standard`,
        impact: "Standard compliance helps ensure compatibility with existing tools and services",
        recommendation: "Verify full compliance with the relevant standard"
      });
    }
    
    // Ensure score stays within bounds
    securityScore = Math.max(30, Math.min(95, securityScore));
    
    // Determine risk level
    let riskLevel;
    if (securityScore >= 90) riskLevel = "Safe";
    else if (securityScore >= 75) riskLevel = "Low Risk";
    else if (securityScore >= 60) riskLevel = "Medium Risk";
    else riskLevel = "High Risk";
    
    // Count findings by severity
    const findingCounts = {
      critical: findings.filter(f => f.severity === "CRITICAL").length,
      high: findings.filter(f => f.severity === "HIGH").length,
      medium: findings.filter(f => f.severity === "MEDIUM").length,
      low: findings.filter(f => f.severity === "LOW").length,
      info: findings.filter(f => f.severity === "INFO").length
    };
    
    // Adjust the final analysis overview based on findings
    let analysisOverview = `This is a browser-based analysis of ${contractData.contractName}, a ${contractType} contract.`;
    if (vulnerabilityFindings.length > 0) {
      analysisOverview += ` The analysis found ${vulnerabilityFindings.length} potential issues that should be reviewed.`;
    } else {
      analysisOverview += ` No major issues were detected in this initial scan.`;
    }
    analysisOverview += ` This client-side analysis was performed due to server timeout.`;
    
    // Create a more detailed explanation based on the contract type and findings
    let explanation = `This ${contractType} was analyzed using pattern matching on its verified source code. `;
    if (vulnerabilityFindings.length > 0) {
      const criticalOrHigh = vulnerabilityFindings.filter(f => f.severity === "CRITICAL" || f.severity === "HIGH").length;
      if (criticalOrHigh > 0) {
        explanation += `The analysis found ${criticalOrHigh} high or critical severity issues that require immediate attention. `;
      } else {
        explanation += `The analysis found ${vulnerabilityFindings.length} potential issues of medium or lower severity. `;
      }
    } else {
      explanation += `No obvious security vulnerabilities were detected in this scan. `;
    }
    explanation += `This analysis was performed in your browser and has limitations compared to a full security audit.`;
    
    // Prepare the analysis result
    const analysis = {
      success: true,
      address,
      network,
      contractName: contractData.contractName,
      contractType,
      compiler: contractData.compiler,
      browserAnalysis: true, // Flag to indicate this was analyzed in the browser
      summary: `${contractData.contractName} is a ${contractType} contract. This analysis was generated client-side due to server timeout.`,
      analysis: {
        contractType,
        overview: analysisOverview,
        keyFeatures: features,
        implementationDetails: {
          standard: contractType === "Custom Smart Contract" ? "Custom implementation" : contractType.split(" ")[0],
          extensions: features.map(f => f.split(" ")[0]),
          patternUsage: "Standard patterns detected",
          accessControl,
          upgradeability: contractData.isProxy ? "Proxy pattern detected, contract may be upgradeable" : "No upgradeability pattern detected"
        },
        risks: findings,
        securityConsiderations: {
          transferMechanisms: findings.some(f => f.description.includes("reentrancy")) 
            ? "Potential issues in transfer implementation detected" 
            : "Standard transfer implementation",
          reentrancyProtection: findings.some(f => f.description.includes("ReentrancyGuard"))
            ? "Uses ReentrancyGuard for protection"
            : findings.some(f => f.description.includes("reentrancy"))
              ? "Potential reentrancy vulnerabilities detected"
              : "No obvious reentrancy issues detected",
          arithmeticSafety: contractData.compiler.includes("0.8.") 
            ? "Solidity 0.8+ provides automatic overflow/underflow protection"
            : findings.some(f => f.description.includes("SafeMath"))
              ? "Uses SafeMath for arithmetic safety"
              : "May need SafeMath for older Solidity versions",
          accessControls: accessControl
        },
        securityScore,
        riskLevel,
        explanation,
        codeQuality: {
          readability: "Limited assessment via pattern matching",
          modularity: "Limited assessment via pattern matching",
          testCoverage: "Unknown",
          documentation: contractData.sourceCode.includes("/**") 
            ? "Contract appears to have documentation comments" 
            : "Limited documentation detected"
        },
        findingCounts
      },
      securityScore,
      riskyCodeSnippets: vulnerabilityFindings
        .filter(f => f.severity === "CRITICAL" || f.severity === "HIGH" || f.severity === "MEDIUM")
        .filter(f => f.codeSnippet)
        .map(f => ({
          title: f.description,
          code: f.codeSnippet,
          explanation: f.impact,
          severity: f.severity
        })),
      riskLevel,
      isSafe: securityScore >= 80,
      analysisTime: "Client-side analysis",
      timestamp: new Date().toISOString(),
      etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`
    };
    
    return analysis;
    
  } catch (error) {
    console.error('Error in browser-based security analysis:', error);
    
    // Return a simpler fallback if everything fails
    return {
      success: true,
      address,
      network,
      contractName: `Contract-${address.slice(0, 6)}`,
      contractType: "Unknown Contract",
      compiler: "Unknown",
      browserAnalysis: true,
      analysis: {
        contractType: "Unknown Contract",
        overview: "We were unable to analyze the contract source code directly. This could be because the contract is not verified or an error occurred.",
        keyFeatures: ["Unknown contract features"],
        explanation: "We couldn't access the contract source code. This might be because the contract is not verified on the blockchain explorer.",
        securityScore: 50,
        riskLevel: "Unknown Risk",
        risks: [{
          severity: "INFO",
          description: "Contract source code analysis failed",
          impact: "Unable to provide a full security assessment",
          recommendation: "Verify this contract on the blockchain explorer or try again later"
        }],
        findingCounts: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          info: 1
        }
      },
      securityScore: 50,
      riskLevel: "Unknown Risk",
      isSafe: false,
      analysisTime: "Failed",
      timestamp: new Date().toISOString(),
      etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`
    };
  }
}

export { analyzeSecurity, fetchContractSourceWithRetry };