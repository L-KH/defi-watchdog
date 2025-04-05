/**
 * Fallback Analysis System for DeFi Watchdog
 * Provides contract information when the main API analysis times out
 */

/**
 * Create a fallback analysis when the main API times out
 * Fetches basic contract information from blockchain explorers
 */
export async function createFallbackAnalysis(contractAddress, network) {
  // Default values in case we can't fetch contract info
  let contractName = `Contract-${contractAddress.slice(0, 8)}`;
  let contractType = "Smart Contract";
  let compiler = "Unknown";
  let sourceCode = null;
  let abi = null;
  
  try {
    // Try multiple APIs to improve reliability
    const apis = [];
    
    if (network === 'sonic') {
      apis.push({
        url: 'https://api.sonicscan.org/api',
        apiKey: 'VKP7YAV3PUNSZ7AUQRAIBDU6JRDV8SJ882'
      });
    } else { // linea
      apis.push({
        url: 'https://api.lineascan.build/api',
        apiKey: 'G9EAEUV9VBS9PGEKUWQUHGJW2FXNWHUW5X'
      });
      // Add another Linea endpoint as backup
      apis.push({
        url: 'https://api-linea.etherscan.io/api',
        apiKey: 'YDJ42EJ1G58WS9M7HRDPAA1Z2DCXRF95MY'
      });
    }
    
    let contractData = null;
    
    // Try each API until one works
    for (const api of apis) {
      try {
        // Fetch contract information
        const apiUrl = `${api.url}?module=contract&action=getsourcecode&address=${contractAddress}&apiKey=${api.apiKey}`;
        console.log(`Trying API: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          console.warn(`API ${api.url} returned status ${response.status}`);
          continue; // Try next API
        }
        
        const data = await response.json();
        if (data.status === '1' && data.result && data.result[0]) {
          contractData = data.result[0];
          
          // Update with actual contract information
          if (contractData.ContractName) contractName = contractData.ContractName;
          compiler = contractData.CompilerVersion || compiler;
          sourceCode = contractData.SourceCode || null;
          abi = contractData.ABI || null;
          
          // Successfully got data, exit the loop
          console.log(`Successfully fetched contract data from ${api.url}`);
          break;
        } else {
          console.warn(`API ${api.url} returned invalid data format`);
        }
      } catch (error) {
        console.warn(`Error fetching from API ${api.url}:`, error);
        // Continue to next API
      }
    }
    
    // If we got source code, determine contract type based on standard patterns
    if (sourceCode) {
      console.log("Got source code, determining contract type");
      if (sourceCode.includes("ERC20") || sourceCode.match(/function\s+transfer\s*\(\s*address.*,\s*uint/)) {
        contractType = "ERC20 Token";
      } else if (sourceCode.includes("ERC721") || sourceCode.match(/function\s+ownerOf\s*\(\s*uint/)) {
        contractType = "ERC721 NFT";
      } else if (sourceCode.includes("ERC1155") || sourceCode.match(/function\s+balanceOfBatch/)) {
        contractType = "ERC1155 Multi-Token";
      } else if (sourceCode.includes("swap") && (sourceCode.includes("pair") || sourceCode.includes("router"))) {
        contractType = "DEX / AMM";
      } else if (sourceCode.includes("stake") || sourceCode.includes("reward")) {
        contractType = "Staking / Yield";
      } else if (sourceCode.includes("borrow") && sourceCode.includes("collateral")) {
        contractType = "Lending Protocol";
      }
    } else if (abi) {
      // Fallback to ABI analysis if source code isn't available
      console.log("No source code, using ABI to determine contract type");
      const abiJson = typeof abi === 'string' ? JSON.parse(abi) : abi;
      
      // Count function types to guess contract type
      const functionNames = abiJson
        .filter(item => item.type === 'function')
        .map(func => func.name);
      
      if (functionNames.includes('transfer') && functionNames.includes('balanceOf') && functionNames.includes('allowance')) {
        contractType = "ERC20 Token";
      } else if (functionNames.includes('ownerOf') && functionNames.includes('safeTransferFrom')) {
        contractType = "ERC721 NFT";
      } else if (functionNames.includes('balanceOfBatch')) {
        contractType = "ERC1155 Multi-Token";
      } else if (functionNames.includes('swap')) {
        contractType = "DEX / AMM";
      } else if (functionNames.includes('stake') || functionNames.includes('unstake')) {
        contractType = "Staking / Yield";
      }
    }
    
    console.log(`Determined contract type: ${contractType}`);
  } catch (error) {
    console.error('Error fetching contract info for fallback:', error);
    // Continue with default values
  }
  
  // Calculate a moderate security score based on having verified source code
  const securityScore = sourceCode ? 65 : 50;
  const riskLevel = sourceCode ? "Medium Risk" : "Unknown Risk";
  
  // Generate a more informative summary based on available information
  let summary = `${contractName} is a ${contractType} smart contract`;
  if (sourceCode) {
    summary += ` with verified source code. This basic analysis was generated due to server timeout.`;
  } else {
    summary += `. Limited information is available as the source code is not verified.`;
  }
  
  // Generate key features based on contract type
  const keyFeatures = getContractKeyFeatures(contractType);
  
  // Generate risks based on available information
  const risks = [];
  
  risks.push({
    severity: "INFO",
    description: "This is a client-side fallback analysis with limited information. For a full audit, please try again with a smaller contract or deploy to a dedicated server.",
    codeReference: "N/A",
    impact: "Limited analysis depth",
    recommendation: "Consider using a dedicated server for more complex contracts."
  });
  
  if (!sourceCode) {
    risks.push({
      severity: "MEDIUM",
      description: "Contract source code is not verified",
      codeReference: "N/A",
      impact: "Cannot analyze code for vulnerabilities",
      recommendation: "Verify this contract's source code on the blockchain explorer"
    });
  }
  
  return {
    success: true,
    address: contractAddress,
    network: network,
    contractName: contractName,
    contractType: contractType,
    compiler: compiler,
    hasSourceCode: !!sourceCode,
    summary,
    analysis: {
      contractType: contractType,
      overview: `This is a preliminary analysis based on data from ${network === 'sonic' ? 'SonicScan' : 'LineaScan'}. The server-side analysis timed out. ${sourceCode ? 'The contract has verified source code which is a good sign.' : 'The contract does not have verified source code.'}`,
      keyFeatures,
      implementationDetails: {
        standard: determineStandard(contractType),
        extensions: ["Unknown"],
        patternUsage: "Standard patterns",
        accessControl: "Unknown access controls",
        upgradeability: "Unknown"
      },
      risks,
      securityConsiderations: {
        transferMechanisms: "Unable to analyze implementation",
        reentrancyProtection: "Unknown",
        arithmeticSafety: "Unknown",
        accessControls: "Unknown"
      },
      securityScore,
      riskLevel,
      explanation: `This ${contractType} is on ${network === 'sonic' ? 'Sonic' : 'Linea'} and was compiled with ${compiler}. ${sourceCode ? 'The contract has verified source code which is a positive security indicator.' : 'Without verified source code, a full security analysis is not possible.'}`,
      codeQuality: {
        readability: "Unknown",
        modularity: "Unknown",
        testCoverage: "Unknown",
        documentation: "Unknown"
      },
      findingCounts: {
        critical: 0,
        high: 0,
        medium: sourceCode ? 0 : 1,
        low: 0,
        info: 1
      }
    },
    securityScore,
    riskyCodeSnippets: [],
    riskLevel,
    isSafe: false,
    analysisTime: "N/A (fallback)",
    timestamp: new Date().toISOString(),
    etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${contractAddress}`
  };
}

/**
 * Helper function to get key features based on contract type
 */
function getContractKeyFeatures(contractType) {
  switch(contractType) {
    case "ERC20 Token":
      return ["Token transfers", "Balance tracking", "Allowance mechanisms"];
    case "ERC721 NFT":
      return ["NFT minting and transfers", "Token ownership", "Metadata management"];
    case "ERC1155 Multi-Token":
      return ["Multi-token support", "Batch transfers", "Mixed fungible/non-fungible tokens"];
    case "DEX / AMM":
      return ["Token swapping", "Liquidity provision", "Automatic market making"];
    case "Staking / Yield":
      return ["Token staking", "Reward distribution", "Yield generation"];
    case "Lending Protocol":
      return ["Asset lending", "Collateral management", "Interest calculation"];
    default:
      return ["Smart contract functionality", "Blockchain interaction", "On-chain operations"];
  }
}

/**
 * Helper function to determine standard based on contract type
 */
function determineStandard(contractType) {
  switch(contractType) {
    case "ERC20 Token":
      return "ERC20";
    case "ERC721 NFT":
      return "ERC721";
    case "ERC1155 Multi-Token":
      return "ERC1155";
    case "DEX / AMM":
      return "Custom Exchange Standard";
    case "Staking / Yield":
      return "Custom Staking Implementation";
    case "Lending Protocol":
      return "Custom Lending Standard";
    default:
      return "Custom implementation";
  }
}