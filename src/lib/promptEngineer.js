// ENHANCED Prompt Engineering System for Better AI Outputs
// This system creates specialized prompts that produce high-quality, structured analysis

/**
 * Advanced prompt generator for different AI models and analysis types
 */
export class PromptEngineer {
  constructor() {
    this.vulnerabilityPatterns = {
      reentrancy: {
        keywords: ['external call', 'state update', 'call', 'transfer', 'send'],
        severity: 'CRITICAL',
        example: 'function withdraw() { call(); balance = 0; }'
      },
      accessControl: {
        keywords: ['onlyOwner', 'require', 'modifier', 'permission'],
        severity: 'HIGH',
        example: 'function sensitive() { /* missing access control */ }'
      },
      overflow: {
        keywords: ['SafeMath', 'arithmetic', '+', '-', '*', '/'],
        severity: 'HIGH',
        example: 'uint256 result = a + b; // unchecked arithmetic'
      },
      gasOptimization: {
        keywords: ['storage', 'memory', 'loop', 'SSTORE', 'SLOAD'],
        severity: 'MEDIUM',
        example: 'for(uint i=0; i<array.length; i++) { storage[i] = value; }'
      }
    };
  }

  /**
   * Generate specialized prompt for security analysis
   */
  generateSecurityPrompt(contractName, modelSpecialty = 'general') {
    return `You are an elite smart contract security auditor with expertise in ${modelSpecialty}.

CONTRACT: ${contractName}

YOUR MISSION: Conduct a comprehensive security audit focusing on exploitable vulnerabilities that could lead to fund loss, unauthorized access, or system compromise.

CRITICAL ANALYSIS FRAMEWORK:
1. **VULNERABILITY DETECTION**
   - Reentrancy attacks (CEI pattern violations)
   - Access control bypasses (missing modifiers)
   - Integer overflow/underflow (unchecked arithmetic)
   - State manipulation exploits
   - Logic bombs and backdoors
   - Flash loan vulnerabilities
   - MEV exploitation vectors

2. **CODE QUALITY ASSESSMENT**
   - Anti-patterns and code smells
   - Missing input validations
   - Inconsistent implementations
   - Error handling gaps

3. **GAS EFFICIENCY ANALYSIS**
   - Expensive operations (SSTORE/SLOAD)
   - Loop optimizations
   - Storage vs memory usage
   - Batch operations potential

RESPONSE FORMAT - RETURN ONLY VALID JSON:
{
  "contractSummary": {
    "name": "${contractName}",
    "type": "Identify contract type (ERC20, NFT, DeFi, etc.)",
    "complexity": "LOW|MEDIUM|HIGH",
    "riskProfile": "Brief risk assessment"
  },
  "securityScore": 85,
  "findings": [
    {
      "id": "FINDING-001",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "category": "REENTRANCY|ACCESS_CONTROL|ARITHMETIC|LOGIC|GAS|QUALITY",
      "title": "Precise vulnerability name",
      "description": "Detailed technical explanation with exact code references",
      "location": {
        "function": "exact function name",
        "lineReference": "specific line or code pattern",
        "codeSnippet": "exact vulnerable code"
      },
      "impact": {
        "technical": "What happens technically",
        "financial": "Potential fund loss amount",
        "operational": "Impact on contract operation"
      },
      "exploitScenario": "Step-by-step attack scenario",
      "remediation": {
        "priority": "IMMEDIATE|HIGH|MEDIUM|LOW",
        "steps": ["Specific step 1", "Specific step 2"],
        "secureCode": "Fixed code example",
        "effort": "Estimated fix time"
      },
      "confidence": "HIGH|MEDIUM|LOW",
      "references": ["Relevant security links"]
    }
  ],
  "gasOptimizations": [
    {
      "id": "GAS-001",
      "title": "Specific optimization opportunity",
      "description": "What to optimize and why",
      "location": "Function or pattern location",
      "impact": {
        "gasReduction": "Estimated gas saved per transaction",
        "percentage": "Percentage improvement",
        "costSavings": "Financial impact for users"
      },
      "implementation": {
        "currentPattern": "Current inefficient code",
        "optimizedPattern": "Optimized code",
        "difficulty": "EASY|MEDIUM|HARD"
      }
    }
  ],
  "recommendations": {
    "immediate": ["Critical actions needed now"],
    "beforeDeployment": ["Must-fix before mainnet"],
    "postDeployment": ["Monitoring and future improvements"],
    "bestPractices": ["General security recommendations"]
  },
  "riskAssessment": {
    "overallRisk": "CRITICAL|HIGH|MEDIUM|LOW",
    "deploymentReady": true,
    "mainConcerns": ["Primary risk factors"],
    "mitigationPriority": ["Ordered list of fixes by priority"]
  }
}

CRITICAL INSTRUCTIONS:
- ONLY analyze the actual provided code
- Quote exact function names and code patterns that exist
- Provide specific line references where possible
- Do not invent vulnerabilities that aren't there
- Focus on exploitable issues, not theoretical problems
- Give actionable remediation with working code examples
- Prioritize findings by actual risk and exploitability`;
  }

  /**
   * Generate prompt for gas optimization focus
   */
  generateGasOptimizationPrompt(contractName) {
    return `You are a Gas Optimization Expert specializing in Ethereum smart contract efficiency.

CONTRACT: ${contractName}

MISSION: Identify all gas optimization opportunities that can reduce transaction costs for users.

GAS ANALYSIS FRAMEWORK:
1. **STORAGE OPTIMIZATION**
   - Unnecessary SSTORE operations
   - Struct packing opportunities
   - Mapping vs array efficiency
   - Storage vs memory usage

2. **COMPUTATION EFFICIENCY**
   - Loop optimizations
   - Redundant calculations
   - Function call optimization
   - Bitwise operations

3. **BYTECODE OPTIMIZATION**
   - Function selector ordering
   - Contract size reduction
   - Library usage efficiency

RETURN ONLY VALID JSON:
{
  "gasScore": 75,
  "totalOptimizations": 5,
  "estimatedSavings": {
    "totalGas": "50000 gas per transaction",
    "percentage": "25% reduction",
    "costUSD": "$2.50 saved per transaction at 50 gwei"
  },
  "optimizations": [
    {
      "id": "GAS-001",
      "priority": "HIGH|MEDIUM|LOW",
      "title": "Storage packing optimization",
      "description": "Detailed explanation of the optimization",
      "location": "Contract.functionName",
      "currentCost": "21000 gas",
      "optimizedCost": "15000 gas",
      "savings": "6000 gas (28% reduction)",
      "implementation": {
        "before": "Current inefficient code",
        "after": "Optimized code",
        "explanation": "Why this optimization works"
      },
      "difficulty": "EASY|MEDIUM|HARD",
      "riskLevel": "NONE|LOW|MEDIUM"
    }
  ],
  "summary": "Overall gas optimization assessment"
}`;
  }

  /**
   * Generate prompt for DeFi-specific analysis
   */
  generateDeFiPrompt(contractName) {
    return `You are a DeFi Security Specialist with expertise in decentralized finance protocols.

CONTRACT: ${contractName}

DEFI-SPECIFIC ANALYSIS:
1. **FLASH LOAN VULNERABILITIES**
   - Price manipulation attacks
   - Arbitrage exploitation
   - Liquidity drainage

2. **ORACLE SECURITY**
   - Price feed manipulation
   - Oracle failure handling
   - Staleness checks

3. **MEV EXPLOITATION**
   - Front-running vulnerabilities
   - Sandwich attacks
   - Liquidation risks

4. **LIQUIDITY RISKS**
   - Slippage protection
   - Impermanent loss vectors
   - Pool manipulation

RETURN ONLY VALID JSON:
{
  "defiRiskScore": 80,
  "protocolType": "AMM|Lending|Staking|Derivatives|Other",
  "findings": [
    {
      "category": "FLASH_LOAN|ORACLE|MEV|LIQUIDITY|GOVERNANCE",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "title": "Specific DeFi vulnerability",
      "description": "Technical explanation with DeFi context",
      "attackVector": "Detailed attack scenario",
      "remediation": "DeFi-specific fix",
      "references": ["DeFi security resources"]
    }
  ],
  "protocolSpecific": {
    "tokenomics": "Analysis of token economics",
    "governanceRisks": ["Governance attack vectors"],
    "integrationRisks": ["External protocol dependencies"]
  }
}`;
  }

  /**
   * Generate specialized prompt based on model capabilities
   */
  generateModelSpecificPrompt(modelName, contractName, analysisType = 'comprehensive') {
    const baseContext = `CONTRACT: ${contractName}
ANALYSIS TYPE: ${analysisType}`;

    switch (modelName.toLowerCase()) {
      case 'deepseek r1':
        return `${baseContext}

You are DeepSeek R1, an advanced reasoning AI with exceptional logical analysis capabilities.

USE YOUR ADVANCED REASONING TO:
1. Think step-by-step through the contract logic
2. Identify complex attack vectors that require multi-step reasoning
3. Analyze state dependencies and edge cases
4. Consider economic incentives and game theory

Focus on vulnerabilities that require deep logical analysis to discover.

${this.generateSecurityPrompt(contractName, 'advanced logical reasoning')}`;

      case 'qwen 2.5 72b':
        return `${baseContext}

You are Qwen 2.5 72B with large context processing capabilities.

LEVERAGE YOUR LARGE CONTEXT WINDOW TO:
1. Analyze the entire contract holistically
2. Find inconsistencies across multiple functions
3. Identify pattern violations throughout the codebase
4. Cross-reference security issues across different contract sections

Focus on architectural issues and systemic vulnerabilities.

${this.generateSecurityPrompt(contractName, 'comprehensive pattern analysis')}`;

      case 'llama 3.1 70b':
        return `${baseContext}

You are Llama 3.1 70B, specializing in practical smart contract security.

APPLY YOUR EXPERTISE IN:
1. Real-world attack scenarios
2. Practical exploitation techniques
3. Industry-standard security practices
4. Production-ready security recommendations

Focus on immediately exploitable vulnerabilities with proven attack vectors.

${this.generateSecurityPrompt(contractName, 'practical security expertise')}`;

      case 'wizardlm 2':
        return `${baseContext}

You are WizardLM 2, focused on gas optimization and efficiency.

OPTIMIZE FOR:
1. Gas efficiency improvements
2. Performance optimizations
3. Cost reduction strategies
4. Bytecode-level improvements

${this.generateGasOptimizationPrompt(contractName)}`;

      default:
        return this.generateSecurityPrompt(contractName, 'general security analysis');
    }
  }

  /**
   * Generate supervisor prompt for consolidating multiple AI analyses
   */
  generateSupervisorPrompt(contractName, aiResults) {
    const resultsSummary = aiResults.map((result, index) => 
      `Model ${index + 1} (${result.model}): ${result.result?.findings?.length || 0} findings`
    ).join('\n');

    return `You are an Expert Security Supervisor analyzing multiple AI audit results.

CONTRACT: ${contractName}
AI ANALYSES RECEIVED: ${aiResults.length} models

RESULTS SUMMARY:
${resultsSummary}

YOUR TASK: Create a definitive, duplicate-free security report.

SUPERVISOR RESPONSIBILITIES:
1. **ELIMINATE DUPLICATES**: Identify and merge similar findings
2. **VERIFY ACCURACY**: Cross-reference findings against actual code
3. **PRIORITIZE RISKS**: Rank findings by actual exploitability
4. **CONSOLIDATE RECOMMENDATIONS**: Create actionable remediation plan
5. **QUALITY ASSURANCE**: Ensure all findings reference real code

CONSOLIDATION RULES:
- Merge findings with >70% similarity
- Prioritize findings reported by multiple models
- Verify each finding against the actual contract code
- Remove false positives and theoretical issues
- Focus on practically exploitable vulnerabilities

RETURN COMPREHENSIVE JSON:
{
  "supervisorSummary": {
    "totalModelsAnalyzed": ${aiResults.length},
    "rawFindings": "total before deduplication",
    "verifiedFindings": "total after verification",
    "duplicatesRemoved": "number of duplicates eliminated",
    "consensusLevel": "percentage of findings with multi-model agreement"
  },
  "consolidatedFindings": [
    {
      "findingId": "VERIFIED-001",
      "consensusCount": 3,
      "reportingModels": ["Model A", "Model B"],
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "title": "Verified vulnerability name",
      "description": "Consolidated description from multiple analyses",
      "location": "Exact contract location verified in code",
      "confidence": "HIGH|MEDIUM|LOW",
      "exploitability": "IMMEDIATE|LIKELY|POSSIBLE|THEORETICAL",
      "remediation": "Consolidated remediation steps"
    }
  ],
  "executiveSummary": {
    "overallRisk": "CRITICAL|HIGH|MEDIUM|LOW",
    "deploymentRecommendation": "DEPLOY|REVIEW_REQUIRED|DO_NOT_DEPLOY",
    "criticalCount": 0,
    "highCount": 0,
    "keyRecommendations": ["Top 3 priority actions"]
  }
}

CRITICAL: Only include findings that you can verify exist in the actual contract code.`;
  }

  /**
   * Generate prompt for specific vulnerability types
   */
  generateVulnerabilitySpecificPrompt(vulnType, contractName) {
    const patterns = this.vulnerabilityPatterns[vulnType];
    if (!patterns) {
      throw new Error(`Unknown vulnerability type: ${vulnType}`);
    }

    return `You are a ${vulnType.toUpperCase()} Vulnerability Specialist.

CONTRACT: ${contractName}
FOCUS: ${vulnType} vulnerabilities

SPECIFIC ANALYSIS FOR ${vulnType.toUpperCase()}:
- Keywords to analyze: ${patterns.keywords.join(', ')}
- Expected severity: ${patterns.severity}
- Pattern example: ${patterns.example}

Look for all instances of ${vulnType} patterns in the contract.

${this.generateSecurityPrompt(contractName, `${vulnType} specialist`)}`;
  }

  /**
   * Generate context-aware prompt based on contract type
   */
  generateContextAwarePrompt(contractName, contractCode) {
    // Analyze contract to determine type
    const contractType = this.detectContractType(contractCode);
    const riskAreas = this.identifyRiskAreas(contractCode);

    let contextPrompt = `CONTRACT TYPE DETECTED: ${contractType}
HIGH-RISK AREAS IDENTIFIED: ${riskAreas.join(', ')}

CONTEXT-SPECIFIC ANALYSIS:`;

    if (contractType.includes('ERC20')) {
      contextPrompt += `
- Focus on transfer vulnerabilities
- Check approval mechanisms
- Analyze mint/burn functions
- Verify balance tracking`;
    }

    if (contractType.includes('NFT') || contractType.includes('ERC721')) {
      contextPrompt += `
- Examine minting logic
- Check ownership transfers
- Analyze metadata handling
- Verify royalty mechanisms`;
    }

    if (contractType.includes('DeFi')) {
      contextPrompt += `
- Analyze price oracle usage
- Check for flash loan vulnerabilities
- Examine liquidity mechanisms
- Verify economic incentives`;
    }

    return contextPrompt + '\n\n' + this.generateSecurityPrompt(contractName, `${contractType} specialist`);
  }

  /**
   * Detect contract type from code analysis
   */
  detectContractType(contractCode) {
    const types = [];
    
    if (contractCode.includes('ERC20') || contractCode.includes('transfer(')) {
      types.push('ERC20 Token');
    }
    
    if (contractCode.includes('ERC721') || contractCode.includes('tokenURI')) {
      types.push('NFT/ERC721');
    }
    
    if (contractCode.includes('swap') || contractCode.includes('liquidity')) {
      types.push('DeFi Protocol');
    }
    
    if (contractCode.includes('stake') || contractCode.includes('reward')) {
      types.push('Staking Contract');
    }
    
    return types.length > 0 ? types.join(' + ') : 'Generic Contract';
  }

  /**
   * Identify high-risk areas in contract
   */
  identifyRiskAreas(contractCode) {
    const risks = [];
    
    if (contractCode.includes('.call(') || contractCode.includes('.delegatecall(')) {
      risks.push('External Calls');
    }
    
    if (contractCode.includes('payable') || contractCode.includes('.transfer(')) {
      risks.push('Ether Handling');
    }
    
    if (contractCode.includes('onlyOwner') || contractCode.includes('require(')) {
      risks.push('Access Control');
    }
    
    if (contractCode.includes('assembly') || contractCode.includes('inline assembly')) {
      risks.push('Assembly Code');
    }
    
    return risks.length > 0 ? risks : ['Standard Logic'];
  }
}

/**
 * Export factory function for easy use
 */
export function createPromptEngineer() {
  return new PromptEngineer();
}

/**
 * Quick prompt generation functions
 */
export function generateSecurityPrompt(contractName, modelSpecialty) {
  const engineer = new PromptEngineer();
  return engineer.generateSecurityPrompt(contractName, modelSpecialty);
}

export function generateSupervisorPrompt(contractName, aiResults) {
  const engineer = new PromptEngineer();
  return engineer.generateSupervisorPrompt(contractName, aiResults);
}

export function generateModelSpecificPrompt(modelName, contractName, analysisType) {
  const engineer = new PromptEngineer();
  return engineer.generateModelSpecificPrompt(modelName, contractName, analysisType);
}
