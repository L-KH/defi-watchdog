/**
 * API endpoint for ZerePy AI agent to analyze smart contracts
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, network, fastMode } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  try {
    // In a real implementation, this would call an AI service or database
    // Here, we'll generate a sample analysis for demo purposes
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a sample analysis
    const analysis = generateSampleAnalysis(address, network);
    
    // ADDED: Submit to audit API to update stats
    try {
      // Submit the audit result to update stats
      const auditSubmitResponse = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/audit/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis),
      });
      
      if (!auditSubmitResponse.ok) {
        console.error('Failed to update stats with new Sonic audit data');
      } else {
        console.log('Successfully updated stats with new Sonic audit data');
      }
    } catch (statsError) {
      console.error('Error updating stats for Sonic audit:', statsError);
      // Continue even if stats update fails
    }
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing contract:', error);
    return res.status(500).json({ error: 'Failed to analyze contract' });
  }
}

/**
 * Generate a sample contract analysis for demo purposes
 */
function generateSampleAnalysis(address, network) {
  // Use the address to generate some variation in the response
  const addressEnd = address.slice(-4);
  const securityScore = 45 + (parseInt(addressEnd, 16) % 30); // Score between 45-74
  const isSafe = securityScore >= 70;
  
  // Contract type based on last character of address
  const contractTypes = [
    'Staking Contract',
    'Token Contract',
    'DEX Router',
    'Lending Protocol',
    'Vault',
    'NFT Collection',
    'DAO Governance',
    'Bridge Contract'
  ];
  const contractTypeIndex = parseInt(addressEnd.slice(-1), 16) % contractTypes.length;
  const contractType = contractTypes[contractTypeIndex];
  const contractName = `${network === 'sonic' ? 'Sonic' : 'Linea'}${contractType.replace(' ', '')}`;
  
  // Generate sample risks
  const risks = generateSampleRisks(addressEnd, network, contractType);
  
  // Generate finding counts
  const findingCounts = {
    critical: risks.filter(r => r.severity === 'CRITICAL').length,
    high: risks.filter(r => r.severity === 'HIGH').length,
    medium: risks.filter(r => r.severity === 'MEDIUM').length,
    low: risks.filter(r => r.severity === 'LOW').length,
    info: risks.filter(r => r.severity === 'INFO').length
  };
  
  // Risk level based on security score
  let riskLevel;
  if (securityScore >= 90) riskLevel = 'Safe';
  else if (securityScore >= 70) riskLevel = 'Low Risk';
  else if (securityScore >= 50) riskLevel = 'Medium Risk';
  else riskLevel = 'High Risk';
  
  // Response object
  return {
    success: true,
    address,
    network,
    contractName,
    contractType,
    compiler: 'Solidity 0.8.17',
    summary: `This ${contractType.toLowerCase()} on the ${network} network provides functions for ${contractTypeDescription(contractType)}.`,
    securityScore,
    riskLevel,
    isSafe,
    etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`,
    analysis: {
      contractType,
      overview: `This contract implements ${contractTypeDescription(contractType)}. It includes functionality for user interactions, admin controls, and state management.`,
      explanation: securityExplanation(securityScore, risks),
      risks,
      findingCounts,
      securityScore,
      analysisDiscussion: generateAnalysisDiscussion(contractType, network, risks),
      fixes: generateSampleFixes(risks, network)
    }
  };
}

/**
 * Generate contract type description
 */
function contractTypeDescription(contractType) {
  const descriptions = {
    'Staking Contract': 'users to stake tokens and earn rewards over time',
    'Token Contract': 'an ERC20 token with transfer, approval, and delegation capabilities',
    'DEX Router': 'trading between multiple token pairs with optimized routing',
    'Lending Protocol': 'users to lend and borrow assets with interest accrual',
    'Vault': 'secure storage of assets with withdrawal and deposit functionality',
    'NFT Collection': 'minting, transferring, and managing non-fungible tokens',
    'DAO Governance': 'voting on proposals and executing governance decisions',
    'Bridge Contract': 'transferring assets between different blockchain networks'
  };
  
  return descriptions[contractType] || 'various DeFi operations';
}

/**
 * Generate security explanation based on score and risks
 */
function securityExplanation(score, risks) {
  if (score >= 90) {
    return 'This contract follows security best practices and shows no significant vulnerabilities. The code is well-structured and includes proper validation checks and access controls.';
  }
  else if (score >= 70) {
    return `This contract is generally secure but has ${risks.length} minor issues or improvements to consider. The key functionality appears to be implemented safely, but some optimizations and edge cases should be addressed.`;
  }
  else if (score >= 50) {
    return `This contract has ${risks.length} security issues that should be addressed before deployment. While the core functionality may work as intended, there are several potential vulnerabilities that could be exploited.`;
  }
  else {
    return `This contract has significant security concerns with ${risks.length} issues detected, including ${risks.filter(r => r.severity === 'CRITICAL').length} critical vulnerabilities. It's recommended to fix these issues and perform a thorough audit before deployment.`;
  }
}

/**
 * Generate sample risks for a contract
 */
function generateSampleRisks(addressEnd, network, contractType) {
  const risks = [];
  const riskCount = 2 + (parseInt(addressEnd, 16) % 5); // 2-6 risks
  
  // Potential risks by contract type
  const risksByType = {
    'Staking Contract': [
      { severity: 'CRITICAL', title: 'Reentrancy in Withdrawal Function', description: 'The withdraw function is vulnerable to reentrancy attacks, allowing attackers to drain funds.' },
      { severity: 'HIGH', title: 'Unchecked Return Values', description: 'External calls do not check return values, which could lead to silent failures.' },
      { severity: 'MEDIUM', title: 'Centralized Admin Controls', description: 'Admin has excessive privileges without timelock or governance controls.' },
      { severity: 'LOW', title: 'Floating Pragma', description: 'Contract uses a floating pragma, which may lead to inconsistent behavior across compilations.' },
      { severity: 'INFO', title: 'Lack of Events', description: 'Some state-changing functions do not emit events, making off-chain tracking difficult.' }
    ],
    'Token Contract': [
      { severity: 'CRITICAL', title: 'Integer Overflow in Transfer', description: 'Transfer function is vulnerable to integer overflow, potentially allowing unauthorized minting.' },
      { severity: 'HIGH', title: 'Access Control Issues', description: 'Privileged functions lack proper access control mechanisms.' },
      { severity: 'MEDIUM', title: 'Incorrect ERC20 Implementation', description: 'The transfer function does not comply with the ERC20 standard for return values.' },
      { severity: 'LOW', title: 'Inefficient Storage', description: 'Contract uses excessive storage which could be optimized to reduce gas costs.' },
      { severity: 'INFO', title: 'Missing Documentation', description: 'Contract functions lack proper NatSpec documentation.' }
    ],
    'DEX Router': [
      { severity: 'CRITICAL', title: 'Price Manipulation Vulnerability', description: 'Swap function is vulnerable to price manipulation through flash loans.' },
      { severity: 'HIGH', title: 'Unchecked Slippage', description: 'Slippage parameters are not properly enforced, potentially leading to significant value loss.' },
      { severity: 'MEDIUM', title: 'Centralized Oracle', description: 'Price oracle is centralized and could be manipulated.' },
      { severity: 'LOW', title: 'Gas Inefficiency', description: 'Loop patterns in path finding algorithm are inefficient and could lead to high gas costs.' },
      { severity: 'INFO', title: 'Outdated Dependencies', description: 'Contract uses outdated versions of imported libraries.' }
    ],
    'Lending Protocol': [
      { severity: 'CRITICAL', title: 'Interest Rate Calculation Vulnerability', description: 'Interest rate calculation has a logical flaw that could lead to fund loss.' },
      { severity: 'HIGH', title: 'Liquidation Risk', description: 'Liquidation mechanism can be gamed by attackers to extract excess value.' },
      { severity: 'MEDIUM', title: 'Oracle Manipulation', description: 'Price oracle data is not validated, allowing potential manipulation.' },
      { severity: 'LOW', title: 'Rounding Errors', description: 'Rounding errors in interest calculations may favor either lenders or borrowers.' },
      { severity: 'INFO', title: 'Lack of Pause Mechanism', description: 'Contract lacks an emergency pause mechanism.' }
    ]
  };
  
  // Sonic-specific risks
  const sonicRisks = [
    { severity: 'HIGH', title: 'Sonic Transaction Ordering Dependency', description: 'Contract relies on transaction ordering which is handled differently on Sonic network.' },
    { severity: 'MEDIUM', title: 'Incompatible Gas Model', description: 'Contract uses gas patterns optimized for Ethereum but inefficient on Sonic.' },
    { severity: 'LOW', title: 'Sonic-Specific Storage Issues', description: 'Storage layout is not optimized for Sonic blockchain storage model.' }
  ];
  
  // Get risks for this contract type, or use default risks
  const typeRisks = risksByType[contractType] || [
    { severity: 'CRITICAL', title: 'Unauthorized Access', description: 'Critical functions can be called by unauthorized users.' },
    { severity: 'HIGH', title: 'Insecure Fund Management', description: 'Contract does not properly secure user funds.' },
    { severity: 'MEDIUM', title: 'Logical Inconsistency', description: 'Business logic contains inconsistencies that could lead to unexpected behavior.' },
    { severity: 'LOW', title: 'Gas Optimization Needed', description: 'Contract uses more gas than necessary for operations.' },
    { severity: 'INFO', title: 'Code Documentation', description: 'Code is not well documented, making maintenance difficult.' }
  ];
  
  // Add type-specific risks
  for (let i = 0; i < Math.min(riskCount, typeRisks.length); i++) {
    const risk = { ...typeRisks[i] };
    
    // Add code reference and snippet
    risk.codeReference = `Line ${100 + (i * 35)}: function ${risk.title.split(' ')[0].toLowerCase()}`;
    risk.codeSnippet = `function ${risk.title.split(' ')[0].toLowerCase()}${i}(address user, uint256 amount) public {
    // Vulnerable code
    user.call{value: amount}("");
    balances[user] -= amount;
}`;
    
    // Add recommendation and impact
    risk.recommendation = `Implement a reentrancy guard or follow the checks-effects-interactions pattern to prevent reentrancy attacks.`;
    risk.impact = `An attacker could exploit this vulnerability to drain funds from the contract by recursively calling the withdrawal function.`;
    
    // AI consensus
    const consensusOptions = [
      "All 3 AI models identified this issue",
      "2/3 AI models flagged this vulnerability",
      "Only one AI model detected this issue, but with high confidence"
    ];
    risk.consensus = consensusOptions[i % consensusOptions.length];
    
    risks.push(risk);
  }
  
  // Add a network-specific risk if applicable
  if (network === 'sonic' && risks.length < riskCount + 1) {
    const sonicRisk = sonicRisks[parseInt(addressEnd, 16) % sonicRisks.length];
    sonicRisk.codeReference = `Line ${350}: function sonicSpecific`;
    sonicRisk.codeSnippet = `function sonicSpecific(uint256 value) public {
    // Inefficient for Sonic network
    for (uint i = 0; i < accounts.length; i++) {
        accounts[i].balance += value / accounts.length;
    }
}`;
    sonicRisk.recommendation = `Optimize for Sonic network by using network-specific patterns and avoiding inefficient loops.`;
    sonicRisk.impact = `This pattern leads to higher gas costs on Sonic network and may cause transactions to fail due to gas limits.`;
    sonicRisk.consensus = "All 3 AI models identified this Sonic-specific issue";
    
    risks.push(sonicRisk);
  }
  
  return risks;
}

/**
 * Generate sample fixes for the identified risks
 */
function generateSampleFixes(risks, network) {
  const criticalAndHighRisks = risks.filter(risk => 
    risk.severity === 'CRITICAL' || risk.severity === 'HIGH'
  );
  
  if (criticalAndHighRisks.length === 0) {
    return [];
  }
  
  // Generate fixes for up to 3 critical/high risks
  return criticalAndHighRisks.slice(0, 3).map(risk => ({
    title: `Fix for ${risk.title}`,
    description: risk.description,
    findingTitle: risk.title,
    findingDescription: risk.description,
    severity: risk.severity,
    originalCode: risk.codeSnippet,
    fixedCode: generateFixedCode(risk.codeSnippet, risk.title, network),
    explanation: `This fix addresses the ${risk.title.toLowerCase()} by implementing proper security controls. ${risk.recommendation}`,
    diffSummary: 'Added security controls and validation'
  }));
}

/**
 * Generate fixed code based on the vulnerability
 */
function generateFixedCode(originalCode, title, network) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('reentrancy')) {
    return originalCode.replace(
      'user.call{value: amount}("");',
      '// Use checks-effects-interactions pattern\nbalances[user] -= amount;\n    // Add nonReentrant modifier to function\n    user.call{value: amount}("");'
    );
  }
  
  if (lowerTitle.includes('overflow') || lowerTitle.includes('underflow')) {
    return originalCode.replace(
      'balances[user] -= amount;',
      '// Use SafeMath or require statement\nrequire(balances[user] >= amount, "Insufficient balance");\nbalances[user] -= amount;'
    );
  }
  
  if (lowerTitle.includes('access') || lowerTitle.includes('unauthorized')) {
    return originalCode.replace(
      'function',
      '// Add access control\nfunction onlyOwner modifier\n'
    );
  }
  
  if (network === 'sonic' && lowerTitle.includes('sonic')) {
    return originalCode.replace(
      'for (uint i = 0; i < accounts.length; i++) {',
      '// Optimized for Sonic network\nuint len = accounts.length;\nfor (uint i = 0; i < len;) {\n    // Loop body\n    unchecked { ++i; }'
    );
  }
  
  // Default fix - add validation
  return originalCode.replace(
    'public {',
    'public {\n    // Add input validation\n    require(amount > 0, "Invalid amount");\n    require(user != address(0), "Invalid user address");'
  );
}

/**
 * Generate AI analysis discussion
 */
function generateAnalysisDiscussion(contractType, network, risks) {
  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;
  const highCount = risks.filter(r => r.severity === 'HIGH').length;
  
  return `OpenAI: I've analyzed this ${contractType} on the ${network} network and found ${risks.length} potential issues, including ${criticalCount} critical and ${highCount} high severity vulnerabilities.

Deepseek: I agree with most findings, particularly the ${criticalCount > 0 ? 'critical issues around ' + risks.filter(r => r.severity === 'CRITICAL')[0]?.title.toLowerCase() : 'high severity concerns'}. However, I think some of the medium severity issues might be false positives.

Mistral: I concur with the critical findings. My analysis shows that the main vulnerability is in the ${risks.length > 0 ? risks[0].codeReference : 'main functions'} where input validation is insufficient.

OpenAI: Regarding remediation, I recommend implementing proper input validation, access controls, and following the checks-effects-interactions pattern to prevent reentrancy.

${network === 'sonic' ? 'ZerePy: The contract also has Sonic-specific issues with gas optimization. The current implementation doesn\'t leverage Sonic\'s unique blockchain architecture.\n' : ''}

Deepseek: I also noticed potential centralization risks in the admin functions. Consider implementing a multi-sig or timelock mechanism.

Mistral: Additionally, the contract should use events for all state-changing functions to improve off-chain monitoring.

OpenAI: In summary, this contract requires several security improvements before it's safe to deploy, with particular attention to ${risks.length > 0 ? risks[0].title.toLowerCase() : 'basic security patterns'}.`;
}