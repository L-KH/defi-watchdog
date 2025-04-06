/**
 * API endpoint to fetch a specific report by ID
 */
export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Report ID is required' });
  }
  
  try {
    // In a real implementation, this would fetch from a database
    // Here, we'll generate a sample report based on the ID
    
    // Extract network and address info from the ID
    const idParts = id.split('-');
    const network = idParts[1].toLowerCase();
    const reportNumber = idParts[2];
    
    // Generate address based on the report ID
    let address;
    
    if (network === 'linea') {
      const lineaAddresses = {
        '001': '0x2d8879046f1559e53eb052e949e9544bcb72f414',
        '002': '0x610d2f07b7edc67565160f587f37636194c34e74',
        '003': '0x272E156Df8DA513C69cB41cC7A99185D53F926Bb',
        '004': '0x4D7572040B84b41a6AA2efE4A93eFFF182388F88',
        '005': '0xe3CDa0A0896b70F0eBC6A1848096529AA7AEe9eE'
      };
      address = lineaAddresses[reportNumber] || '0x2d8879046f1559e53eb052e949e9544bcb72f414';
    } else { // sonic
      const sonicAddresses = {
        '001': '0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13',
        '002': '0x19B25E3f1B8d35a2C5a805c0b271ECeBE1E8A4Ec',
        '003': '0xE532bA7437845CeE140AC6F16a96f9B27af10FC2',
        '004': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '005': '0x4Fabb145d64652a948d72533023f6E7A623C7C53'
      };
      address = sonicAddresses[reportNumber] || '0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13';
    }
    
    // Generate contract names based on ID
    const contractNames = {
      'REP-LINEA-001': 'Odos Router V2',
      'REP-LINEA-002': 'Lynex DEX',
      'REP-LINEA-003': 'HorizonDEX',
      'REP-LINEA-004': 'Renzeo Protocol',
      'REP-LINEA-005': 'Mendi All-in-One DeFi',
      'REP-SONIC-001': 'SonicSwap Router',
      'REP-SONIC-002': 'Sonic Staking Protocol',
      'REP-SONIC-003': 'ZeroGravity Bridge',
      'REP-SONIC-004': 'Sonic USD',
      'REP-SONIC-005': 'Sonic USDT'
    };
    
    const contractName = contractNames[id] || `${network === 'linea' ? 'Linea' : 'Sonic'} Contract`;
    
    // Generate the report
    const report = generateSampleReport(id, address, network, contractName);
    
    return res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return res.status(500).json({ error: 'Failed to fetch report' });
  }
}

/**
 * Generate a sample report for demo purposes
 */
function generateSampleReport(id, address, network, contractName) {
  // Fixed security scores based on ID
  const securityScores = {
    'REP-LINEA-001': 84,
    'REP-LINEA-002': 78,
    'REP-LINEA-003': 52,
    'REP-LINEA-004': 65,
    'REP-LINEA-005': 82,
    'REP-SONIC-001': 91,
    'REP-SONIC-002': 73,
    'REP-SONIC-003': 35,
    'REP-SONIC-004': 88,
    'REP-SONIC-005': 76
  };
  
  // Extract report number
  const reportNum = parseInt(id.split('-')[2], 10) || 1;
  
  // Security score and safety check
  const securityScore = securityScores[id] || 70 + reportNum;
  const isSafe = securityScore >= 70;
  
  // Contract type based on name
  let contractType = 'Smart Contract';
  if (contractName.includes('DEX') || contractName.includes('Router') || contractName.includes('Swap')) {
    contractType = 'DEX Router';
  } else if (contractName.includes('Staking')) {
    contractType = 'Staking Contract';
  } else if (contractName.includes('Bridge')) {
    contractType = 'Bridge Contract';
  } else if (contractName.includes('Protocol') || contractName.includes('Lending')) {
    contractType = 'Lending Protocol';
  } else if (contractName.includes('USD')) {
    contractType = 'Token Contract';
  }
  
  // Create date based on ID
  const now = new Date();
  const date = new Date(now);
  date.setDate(date.getDate() - ((reportNum * 5) % 30)); // Spread dates evenly
  
  // Generate sample risks - number depends on security score
  const riskCount = isSafe ? Math.min(3, Math.max(0, Math.floor((100 - securityScore) / 10))) : 
                           Math.max(3, Math.floor((100 - securityScore) / 7));
  const risks = [];
  
  for (let i = 0; i < riskCount; i++) {
    // Severity based on position and safety
    let severity;
    if (isSafe) {
      severity = i === 0 ? 'MEDIUM' : (i === 1 ? 'LOW' : 'INFO');
    } else {
      if (i === 0) severity = 'CRITICAL';
      else if (i === 1) severity = 'HIGH';
      else if (i < 4) severity = 'MEDIUM';
      else severity = 'LOW';
    }
    
    // Sample risk titles
    const riskTitles = {
      'CRITICAL': [
        'Reentrancy Vulnerability',
        'Unauthorized Access',
        'Integer Overflow',
        'Unchecked External Call'
      ],
      'HIGH': [
        'Missing Access Control',
        'Unchecked Return Values',
        'Price Manipulation Risk',
        'Centralized Admin Control'
      ],
      'MEDIUM': [
        'Timestamp Dependence',
        'Front-Running Vulnerability',
        'Weak Random Number Generation',
        'Unbounded Loop'
      ],
      'LOW': [
        'Floating Pragma',
        'Function Visibility',
        'Gas Optimization',
        'Magic Numbers'
      ],
      'INFO': [
        'Missing NatSpec',
        'Code Readability',
        'Unused Variables',
        'Inconsistent Naming'
      ]
    };
    
    const titleIndex = (reportNum + i) % riskTitles[severity].length;
    const title = riskTitles[severity][titleIndex];
    
    // Create risk object
    risks.push({
      severity,
      title,
      description: `This contract contains a ${severity.toLowerCase()} severity issue: ${title.toLowerCase()}`,
      impact: severity === 'CRITICAL' || severity === 'HIGH' 
        ? 'This vulnerability could allow attackers to steal funds or manipulate contract state.'
        : 'This issue could lead to unexpected behavior or increased gas costs.',
      codeReference: `Line ${100 + (i * 50)}: function vulnerable${i}`,
      codeSnippet: `function vulnerable${i}(address user, uint256 amount) public {
    // Vulnerable code here
    user.call{value: amount}("");
    balances[user] -= amount;
}`,
      recommendation: `Implement proper validation and follow security best practices to prevent ${title.toLowerCase()}.`,
      consensus: i === 0 ? 'All 3 AI models identified this issue' : 
                i === 1 ? '2/3 AI models flagged this vulnerability' :
                'Only one AI model detected this issue, but with high confidence'
    });
  }
  
  // Add recommended fixes for high/critical issues
  const fixes = [];
  for (let i = 0; i < risks.length; i++) {
    if (risks[i].severity === 'CRITICAL' || risks[i].severity === 'HIGH') {
      fixes.push({
        title: `Fix for ${risks[i].title}`,
        description: `Recommended solution to address the ${risks[i].severity.toLowerCase()} severity ${risks[i].title.toLowerCase()} issue.`,
        severity: risks[i].severity,
        originalCode: risks[i].codeSnippet,
        fixedCode: `function secure${i}(address user, uint256 amount) public {
    // First update state
    balances[user] -= amount;
    // Then perform external call
    (bool success, ) = user.call{value: amount}("");
    require(success, "Transfer failed");
}`,
        explanation: `The fixed code follows the checks-effects-interactions pattern to prevent reentrancy attacks. It updates the state variables before making external calls and adds proper validation.`
      });
    }
  }
  
  // Compile finding counts
  const findingCounts = {
    critical: risks.filter(r => r.severity === 'CRITICAL').length,
    high: risks.filter(r => r.severity === 'HIGH').length,
    medium: risks.filter(r => r.severity === 'MEDIUM').length,
    low: risks.filter(r => r.severity === 'LOW').length,
    info: risks.filter(r => r.severity === 'INFO').length
  };
  
  // Generate AI discussion
  let analysisDiscussion = '';
  if (!isSafe) {
    analysisDiscussion = `OpenAI: I've analyzed this ${contractType} on the ${network} network and found ${risks.length} potential issues, including ${findingCounts.critical} critical and ${findingCounts.high} high severity vulnerabilities.

Deepseek: I agree with most findings, particularly the ${findingCounts.critical > 0 ? 'critical issues around ' + risks.filter(r => r.severity === 'CRITICAL')[0]?.title.toLowerCase() : 'high severity concerns'}. However, I think some of the medium severity issues might be false positives.

Mistral: I concur with the critical findings. My analysis shows that the main vulnerability is in the ${risks.length > 0 ? risks[0].codeReference : 'main functions'} where input validation is insufficient.

OpenAI: Regarding remediation, I recommend implementing proper input validation, access controls, and following the checks-effects-interactions pattern to prevent reentrancy.

${network === 'sonic' ? 'ZerePy: The contract also has Sonic-specific issues with gas optimization. The current implementation doesn\'t leverage Sonic\'s unique blockchain architecture.\n' : ''}

Deepseek: I also noticed potential centralization risks in the admin functions. Consider implementing a multi-sig or timelock mechanism.

Mistral: Additionally, the contract should use events for all state-changing functions to improve off-chain monitoring.

OpenAI: In summary, this contract requires several security improvements before it's safe to deploy, with particular attention to ${risks.length > 0 ? risks[0].title.toLowerCase() : 'basic security patterns'}.`;
  } else {
    analysisDiscussion = `OpenAI: I've analyzed this ${contractType} on the ${network} network and found no critical security issues.

Deepseek: I agree that the contract follows security best practices. I did notice ${findingCounts.low + findingCounts.info} minor issues that could be improved.

Mistral: The contract implements proper access controls and validates inputs correctly. I concur that it's generally safe.

${network === 'sonic' ? 'ZerePy: The contract is well-optimized for the Sonic network and uses the recommended gas optimization patterns.\n' : ''}

OpenAI: The code quality is good, with clear function names and proper documentation. The only suggestions would be minor improvements to gas efficiency.

Deepseek: I'd recommend adding more events for better off-chain monitoring, but that's not a security concern.

Mistral: Overall, the contract is well-designed and follows security best practices.`;
  }
  
  // Summaries based on contract type
  const contractSummaries = {
    'DEX Router': `This DEX router on the ${network} network enables users to swap tokens with optimized routing and minimal slippage. It includes functions for path finding, price calculation, and multi-hop swaps.`,
    'Staking Contract': `This staking contract on the ${network} network allows users to deposit tokens and earn rewards over time. It implements locking periods, reward distribution, and emergency withdrawal mechanisms.`,
    'Bridge Contract': `This cross-chain bridge on the ${network} network facilitates asset transfers between different blockchains. It includes locking, minting, and burning functions with verification mechanisms.`,
    'Lending Protocol': `This lending protocol on the ${network} network enables users to deposit collateral, borrow assets, and earn interest. It implements dynamic interest rates, liquidation procedures, and risk parameters.`,
    'Token Contract': `This token contract on the ${network} network implements the ERC-20 standard with additional features for governance, vesting, and token economics.`
  };
  
  // Risk level based on security score
  let riskLevel;
  if (securityScore >= 90) riskLevel = 'Safe';
  else if (securityScore >= 70) riskLevel = 'Low Risk';
  else if (securityScore >= 50) riskLevel = 'Medium Risk';
  else riskLevel = 'High Risk';
  
  // Return report object
  return {
    id,
    address,
    network,
    contractName,
    contractType,
    compiler: 'Solidity 0.8.17',
    createdAt: date.toISOString(),
    summary: contractSummaries[contractType] || `This ${contractType.toLowerCase()} on the ${network} network provides functions for users to interact with ${contractType.toLowerCase()} functionality.`,
    securityScore,
    riskLevel,
    isSafe,
    etherscanUrl: `${network === 'sonic' ? 'https://sonicscan.org/address/' : 'https://lineascan.build/address/'}${address}`,
    analysis: {
      contractType,
      overview: `This contract implements ${contractType.toLowerCase()} functionality. It includes standard methods for ${contractTypeOverview(contractType)}.`,
      explanation: securityExplanation(securityScore, risks),
      risks,
      fixes,
      findingCounts,
      securityScore,
      analysisDiscussion
    },
    auditor: 'ZerePy AI',
    status: 'completed'
  };
}

/**
 * Generate contract type description
 */
function contractTypeOverview(contractType) {
  const descriptions = {
    'Staking Contract': 'staking tokens, calculating rewards, and managing withdrawal periods',
    'Token Contract': 'token transfers, approvals, and allowances with standard ERC20 functionality',
    'DEX Router': 'swapping tokens, providing liquidity, and finding optimal trading routes',
    'Lending Protocol': 'depositing collateral, borrowing assets, and managing interest rates',
    'Vault': 'depositing and withdrawing assets with yield-generating strategies',
    'NFT Collection': 'minting, transferring, and managing token metadata',
    'DAO Governance': 'creating proposals, voting, and executing governance decisions',
    'Bridge Contract': 'locking tokens on one chain and minting wrapped versions on another'
  };
  
  return descriptions[contractType] || 'various contract interactions';
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
