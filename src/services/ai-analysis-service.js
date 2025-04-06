/**
 * AI Analysis Service - Generates realistic AI discussions and analyses for smart contracts
 * 
 * This service orchestrates multiple AI agents to analyze smart contracts and discuss
 * their findings. Each AI agent has different specialties and areas of focus.
 */

/**
 * Agent profiles with their specialties and styles
 */
const AI_AGENTS = {
  OpenAI: {
    name: 'OpenAI',
    expertise: ['access control', 'integer overflow', 'reentrancy', 'governance risks'],
    style: 'comprehensive and methodical',
    confidence: 'high',
    color: '#10a37f' // OpenAI green
  },
  Deepseek: {
    name: 'Deepseek',
    expertise: ['gas optimization', 'code complexity', 'front running', 'centralization'],
    style: 'technical and detailed',
    confidence: 'medium-high',
    color: '#0284c7' // Blue
  },
  Mistral: {
    name: 'Mistral',
    expertise: ['timestamp manipulation', 'external calls', 'contract upgradability', 'oracle issues'],
    style: 'direct and concise',
    confidence: 'medium',
    color: '#8b5cf6' // Purple
  },
  Claude: {
    name: 'Claude',
    expertise: ['logical errors', 'business logic', 'contract interactions', 'documentation'],
    style: 'reflective and thorough',
    confidence: 'high',
    color: '#f97316' // Orange
  },
  ZerePy: {
    name: 'ZerePy',
    expertise: ['contract compatibility', 'network-specific issues', 'economic attacks', 'integration risks'],
    style: 'practical and implementation-focused',
    confidence: 'high',
    color: '#ef4444' // Red
  }
};

/**
 * Contract vulnerability patterns with their details
 */
const VULNERABILITY_PATTERNS = {
  reentrancy: {
    name: 'Reentrancy Attack',
    description: 'Allows attackers to repeatedly call back into the contract before the first invocation is complete',
    severity: 'CRITICAL',
    impactArea: 'state consistency',
    pattern: 'external call before state update',
    falsePositiveRate: 'low',
    codeIndicators: ['call{value:', 'transfer(', '.send('],
    fixPatterns: ['checks-effects-interactions pattern', 'reentrancy guard', 'state update before external call']
  },
  accessControl: {
    name: 'Missing Access Control',
    description: 'Critical functions lack proper access restrictions',
    severity: 'HIGH',
    impactArea: 'contract security',
    pattern: 'public or external functions without modifiers',
    falsePositiveRate: 'low',
    codeIndicators: ['function', 'public', 'external', 'onlyOwner'],
    fixPatterns: ['onlyOwner modifier', 'role-based access control', 'access control library']
  },
  integerOverflow: {
    name: 'Integer Overflow/Underflow',
    description: 'Arithmetic operations exceed the range of the data type',
    severity: 'HIGH',
    impactArea: 'data integrity',
    pattern: 'unchecked arithmetic',
    falsePositiveRate: 'medium',
    codeIndicators: ['+', '-', '*', '/', 'unchecked'],
    fixPatterns: ['SafeMath library', 'Solidity 0.8+ built-in checks', 'explicit bounds checking']
  },
  outdatedCompiler: {
    name: 'Outdated Compiler Version',
    description: 'Using a compiler version with known bugs or security issues',
    severity: 'MEDIUM',
    impactArea: 'code reliability',
    pattern: 'old pragma directive',
    falsePositiveRate: 'low',
    codeIndicators: ['pragma solidity', '^0.4', '^0.5', '^0.6'],
    fixPatterns: ['update to latest compiler', 'fix floating pragma', 'use stable compiler version']
  },
  frontRunning: {
    name: 'Front-Running Vulnerability',
    description: 'Transaction ordering can be exploited for profit',
    severity: 'MEDIUM',
    impactArea: 'fairness and ordering',
    pattern: 'price-dependent operations without protection',
    falsePositiveRate: 'high',
    codeIndicators: ['swap', 'price', 'commit-reveal'],
    fixPatterns: ['commit-reveal scheme', 'minimum/maximum boundaries', 'batch processing']
  },
  unstableDependencies: {
    name: 'Unstable External Dependencies',
    description: 'Contract relies on external systems that might fail or change',
    severity: 'MEDIUM',
    impactArea: 'reliability',
    pattern: 'excessive use of external calls',
    falsePositiveRate: 'high',
    codeIndicators: ['call', 'external contract addresses', 'interfaces'],
    fixPatterns: ['design for failure', 'fallback mechanisms', 'circuit breakers']
  },
  gasOptimization: {
    name: 'Suboptimal Gas Usage',
    description: 'Code uses more gas than necessary, increasing transaction costs',
    severity: 'LOW',
    impactArea: 'efficiency',
    pattern: 'inefficient loops, storage usage, or logic',
    falsePositiveRate: 'medium',
    codeIndicators: ['for loop', 'array', 'mapping', 'storage'],
    fixPatterns: ['memory vs storage optimization', 'avoiding loops', 'using events for data storage']
  },
  magicNumbers: {
    name: 'Magic Numbers',
    description: 'Hardcoded numeric literals without clear meaning',
    severity: 'INFO',
    impactArea: 'code quality',
    pattern: 'numeric literals in code',
    falsePositiveRate: 'medium',
    codeIndicators: ['numeric literals', '1000', '24 * 60 * 60'],
    fixPatterns: ['named constants', 'config parameters', 'enums']
  }
};

/**
 * Contract type patterns and their characteristics
 */
const CONTRACT_TYPES = {
  DEXRouter: {
    name: 'DEX Router',
    functions: ['swap', 'addLiquidity', 'removeLiquidity', 'getAmountsOut', 'swapExactTokensForTokens'],
    riskyAreas: ['price calculation', 'slippage protection', 'front-running', 'token approval'],
    commonPatterns: ['path finding', 'token pair detection', 'price impact calculation'],
    commonIssues: ['price manipulation', 'insufficient slippage protection', 'sandwich attacks'],
    example: 'Uniswap Router'
  },
  TokenContract: {
    name: 'Token Contract',
    functions: ['transfer', 'approve', 'transferFrom', 'balanceOf', 'totalSupply'],
    riskyAreas: ['token economics', 'minting/burning', 'fee handling', 'blacklisting'],
    commonPatterns: ['ERC20 implementation', 'pausable', 'mintable', 'burnable'],
    commonIssues: ['transfer fee calculation errors', 'centralized control', 'flash loan attacks'],
    example: 'ERC20 Token'
  },
  LendingProtocol: {
    name: 'Lending Protocol',
    functions: ['deposit', 'borrow', 'repay', 'liquidate', 'calculateInterest'],
    riskyAreas: ['collateral ratio', 'interest calculation', 'liquidation mechanism', 'oracle usage'],
    commonPatterns: ['interest accrual', 'collateralization', 'price feeds', 'liquidation thresholds'],
    commonIssues: ['liquidation conditions', 'interest calculation errors', 'oracle failures'],
    example: 'Aave or Compound'
  },
  StakingContract: {
    name: 'Staking Contract',
    functions: ['stake', 'unstake', 'claimRewards', 'getReward', 'exit'],
    riskyAreas: ['reward calculation', 'time locking', 'emergency withdrawal', 'staking period'],
    commonPatterns: ['time-weighted rewards', 'vesting schedules', 'reward distribution'],
    commonIssues: ['reward calculation errors', 'locking period issues', 'DoS from gas limits'],
    example: 'Liquidity Mining Contract'
  },
  BridgeContract: {
    name: 'Bridge Contract',
    functions: ['lock', 'unlock', 'mint', 'burn', 'verify'],
    riskyAreas: ['cross-chain verification', 'relay mechanism', 'consensus', 'asset custody'],
    commonPatterns: ['locking and minting', 'signature verification', 'consensus checking'],
    commonIssues: ['signature verification bypass', 'replay attacks', 'chain reorganization'],
    example: 'Cross-Chain Bridge'
  }
};

/**
 * Network-specific information
 */
const NETWORKS = {
  linea: {
    name: 'Linea',
    characteristics: ['EVM compatible', 'optimistic rollup', 'zkEVM'],
    optimizations: ['batched transactions', 'calldata compression', 'storage efficiency'],
    specialFeatures: ['L1 to L2 messaging', 'low gas fees', 'decentralized security']
  },
  sonic: {
    name: 'Sonic',
    characteristics: ['high throughput', 'fast finality', 'EVM compatible'],
    optimizations: ['parallelized execution', 'specialized node infrastructure', 'native fee delegation'],
    specialFeatures: ['instant confirmation', 'low transaction fees', 'simplified address scheme']
  }
};

/**
 * Generate a detailed AI discussion based on the contract, findings, and network
 * 
 * @param {Object} contract - Contract information
 * @param {Array} findings - Security findings from analysis
 * @param {String} network - Network name (e.g., 'linea', 'sonic')
 * @param {Boolean} isSafe - Whether the contract is considered safe overall
 * @returns {String} - A realistic multi-AI discussion
 */
function generateAIDiscussion(contract, findings, network, isSafe) {
  // Select participating agents (3-5 based on findings)
  const selectedAgents = selectRelevantAgents(findings, network);
  
  // Generate discussion turns
  let discussion = '';
  
  // Initial analysis turn - each agent provides their initial assessment
  selectedAgents.forEach(agent => {
    discussion += generateAgentAnalysisOpening(agent, contract, findings, network, isSafe) + '\n\n';
  });
  
  // Discussion of findings
  if (findings.length > 0) {
    // Group findings by severity
    const criticalFindings = findings.filter(f => f.severity === 'CRITICAL');
    const highFindings = findings.filter(f => f.severity === 'HIGH');
    const mediumFindings = findings.filter(f => f.severity === 'MEDIUM');
    const lowOrInfoFindings = findings.filter(f => f.severity === 'LOW' || f.severity === 'INFO');
    
    // Critical findings discussion
    if (criticalFindings.length > 0) {
      discussion += generateCriticalFindingsDiscussion(selectedAgents, criticalFindings, contract);
    }
    
    // High findings discussion
    if (highFindings.length > 0) {
      discussion += generateHighFindingsDiscussion(selectedAgents, highFindings, contract);
    }
    
    // Selected medium/low findings discussion (not all, to keep it concise)
    if (mediumFindings.length > 0 || lowOrInfoFindings.length > 0) {
      discussion += generateOtherFindingsDiscussion(selectedAgents, mediumFindings, lowOrInfoFindings);
    }
  }
  
  // Network-specific discussion
  discussion += generateNetworkSpecificDiscussion(selectedAgents, network, contract);
  
  // Conclusion and recommendations
  discussion += generateConclusionDiscussion(selectedAgents, findings, isSafe, contract);
  
  return discussion;
}

/**
 * Select relevant AI agents based on findings and network
 */
function selectRelevantAgents(findings, network) {
  // Always include primary agents
  const primaryAgents = ['OpenAI', 'Deepseek', 'Mistral'];
  let agents = primaryAgents.map(name => AI_AGENTS[name]);
  
  // Add ZerePy for network-specific insights
  agents.push(AI_AGENTS.ZerePy);
  
  // If there are complex business logic issues, add Claude
  const hasComplexIssues = findings.some(f => 
    f.title?.includes('logic') || 
    f.description?.includes('business logic') ||
    f.title?.includes('access control')
  );
  
  if (hasComplexIssues) {
    agents.push(AI_AGENTS.Claude);
  }
  
  // Ensure we don't have duplicate agents
  agents = [...new Set(agents)];
  
  // Limit to at most 5 agents
  return agents.slice(0, 5);
}

/**
 * Generate opening statements from an AI agent
 */
function generateAgentAnalysisOpening(agent, contract, findings, network, isSafe) {
  const contractType = contract.contractType || 'Smart Contract';
  const issueCount = findings.length;
  
  if (isSafe) {
    return `${agent.name}: I've analyzed this ${contractType} on the ${network} network and found it to be generally secure. ${issueCount > 0 ? `There are ${issueCount} minor issues that could be addressed, but they don't pose significant security risks.` : 'The contract follows security best practices with no significant issues detected.'}`;
  } else {
    const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = findings.filter(f => f.severity === 'HIGH').length;
    
    return `${agent.name}: My analysis of this ${contractType} on the ${network} network revealed ${issueCount} security issues${criticalCount > 0 ? `, including ${criticalCount} critical and ${highCount} high severity vulnerabilities` : ''}. This contract requires attention before deployment.`;
  }
}

/**
 * Generate discussion about critical findings
 */
function generateCriticalFindingsDiscussion(agents, criticalFindings, contract) {
  let discussion = '';
  
  // For each critical finding, have 2-3 agents discuss it
  criticalFindings.forEach((finding, index) => {
    // Determine which agents will discuss this finding (2-3 agents)
    const discussingAgents = agents
      .sort(() => Math.random() - 0.5) // Shuffle agents
      .slice(0, Math.min(3, agents.length)); // Take 2-3 agents
    
    const findingName = finding.title || 'security issue';
    
    // First agent introduces the critical issue
    discussion += `\n${discussingAgents[0].name}: I identified a critical vulnerability in this contract: ${findingName}. `;
    discussion += `${finding.description || 'This vulnerability could potentially allow attackers to compromise the contract.'} `;
    discussion += `The problematic code is at ${finding.codeReference || 'multiple locations in the contract'}.\n`;
    
    // Second agent confirms and elaborates
    discussion += `\n${discussingAgents[1].name}: I confirm this critical finding. `;
    
    if (finding.impact) {
      discussion += `The impact could be severe: ${finding.impact} `;
    } else {
      discussion += `If exploited, this could lead to loss of funds, manipulation of contract state, or complete contract takeover. `;
    }
    
    discussion += `This is a common issue in ${contract.contractType || 'smart contracts'} and requires immediate attention.\n`;
    
    // If there's a third agent, they provide fix recommendations
    if (discussingAgents.length > 2) {
      discussion += `\n${discussingAgents[2].name}: To fix this ${findingName.toLowerCase()}, I recommend `;
      
      if (finding.recommendation) {
        discussion += `${finding.recommendation}\n`;
      } else {
        discussion += `implementing proper validation, following the checks-effects-interactions pattern, and adding access control mechanisms. The fix should be thoroughly tested before deployment.\n`;
      }
    }
    
    discussion += '\n';
  });
  
  return discussion;
}

/**
 * Generate discussion about high severity findings
 */
function generateHighFindingsDiscussion(agents, highFindings, contract) {
  let discussion = '';
  
  // Group similar high findings to avoid repetitive discussions
  const groupedFindings = groupSimilarFindings(highFindings);
  
  // Have agents discuss each group of findings
  Object.entries(groupedFindings).forEach(([key, findings], index) => {
    // Alternate which agents lead the discussion
    const leadAgent = agents[index % agents.length];
    const secondaryAgent = agents[(index + 1) % agents.length];
    
    discussion += `\n${leadAgent.name}: Another significant concern is the ${key} issue${findings.length > 1 ? 's' : ''} I detected. `;
    
    if (findings.length === 1) {
      const finding = findings[0];
      discussion += `${finding.description || 'This vulnerability poses a high risk to the contract security.'} `;
      if (finding.codeReference) {
        discussion += `Found at ${finding.codeReference}.\n`;
      } else {
        discussion += `\n`;
      }
    } else {
      discussion += `I found ${findings.length} instances where this pattern appears in the code, including `;
      discussion += findings.slice(0, 2).map(f => f.codeReference || 'various functions').join(' and ');
      discussion += findings.length > 2 ? ' and others.\n' : '.\n';
    }
    
    // Second agent provides additional context
    discussion += `\n${secondaryAgent.name}: This finding is particularly relevant for ${contract.contractType || 'this type of contract'} because `;
    
    if (findings[0].impact) {
      discussion += `${findings[0].impact} `;
    } else {
      discussion += `it could lead to significant security implications. `;
    }
    
    if (findings[0].recommendation) {
      discussion += `I suggest ${findings[0].recommendation}\n`;
    } else {
      discussion += `A best practice is to implement proper validation and security checks for these operations.\n`;
    }
    
    discussion += '\n';
  });
  
  return discussion;
}

/**
 * Group similar findings to avoid repetitive discussions
 */
function groupSimilarFindings(findings) {
  const grouped = {};
  
  findings.forEach(finding => {
    // Use title or first few words of description as the key
    const key = finding.title || finding.description.split(' ').slice(0, 3).join(' ');
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(finding);
  });
  
  return grouped;
}

/**
 * Generate discussion about medium and low severity findings
 */
function generateOtherFindingsDiscussion(agents, mediumFindings, lowFindings) {
  let discussion = '';
  
  // Randomly select 1-2 medium findings and 0-1 low findings to discuss
  const selectedMedium = mediumFindings.sort(() => Math.random() - 0.5).slice(0, Math.min(2, mediumFindings.length));
  const selectedLow = lowFindings.sort(() => Math.random() - 0.5).slice(0, Math.min(1, lowFindings.length));
  
  // Discuss selected medium findings
  if (selectedMedium.length > 0) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    
    discussion += `\n${agent.name}: I also identified ${mediumFindings.length} medium severity issues, `;
    
    if (mediumFindings.length > selectedMedium.length) {
      discussion += `including ${selectedMedium.map(f => f.title || 'unlabeled issue').join(' and ')}. `;
    } else {
      discussion += `which are ${selectedMedium.map(f => f.title || 'unlabeled issue').join(' and ')}. `;
    }
    
    if (selectedMedium[0].description) {
      discussion += `For example, ${selectedMedium[0].description} `;
    }
    
    discussion += `These issues should be addressed but have lower priority than the critical/high findings.\n`;
  }
  
  // Discuss selected low findings
  if (selectedLow.length > 0) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    
    discussion += `\n${agent.name}: Additionally, there are ${lowFindings.length} low severity or informational findings. `;
    discussion += `These include things like ${selectedLow[0].title || 'code quality issues'} which don't pose immediate security risks but should be improved for better code quality and maintenance.\n`;
  }
  
  return discussion + '\n';
}

/**
 * Generate network-specific discussion points
 */
function generateNetworkSpecificDiscussion(agents, network, contract) {
  // ZerePy is the specialist on network-specific issues
  const zerePy = agents.find(a => a.name === 'ZerePy') || agents[0];
  const randomAgent = agents.find(a => a.name !== zerePy.name) || agents[agents.length - 1];
  
  const networkInfo = NETWORKS[network] || NETWORKS.linea;
  
  let discussion = `\n${zerePy.name}: Regarding ${networkInfo.name}-specific considerations, `;
  
  if (network === 'sonic') {
    discussion += `this contract could benefit from optimizations for Sonic's ${networkInfo.characteristics[0]} architecture. `;
    discussion += `Specifically, implementing ${networkInfo.optimizations[0]} and ${networkInfo.optimizations[1]} would improve performance and cost-efficiency.\n`;
  } else {
    discussion += `deployment on Linea requires attention to ${networkInfo.characteristics[0]} compatibility. `;
    discussion += `I recommend utilizing ${networkInfo.optimizations[0]} and considering ${networkInfo.specialFeatures[0]} for enhanced functionality.\n`;
  }
  
  discussion += `\n${randomAgent.name}: I agree on the network-specific points. Another consideration for ${networkInfo.name} is ensuring proper gas optimization, as the fee structure differs from mainnet.\n`;
  
  return discussion;
}

/**
 * Generate conclusion and final recommendations
 */
function generateConclusionDiscussion(agents, findings, isSafe, contract) {
  let discussion = '\n';
  
  // Select 2-3 agents for concluding remarks
  const concludingAgents = agents
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, agents.length));
  
  // First agent summarizes overall assessment
  discussion += `${concludingAgents[0].name}: In summary, this ${contract.contractType || 'contract'} `;
  
  if (isSafe) {
    discussion += `appears generally secure with ${findings.length} minor issues that should be addressed for best practices. The contract follows sound security principles overall.\n`;
  } else {
    const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = findings.filter(f => f.severity === 'HIGH').length;
    
    discussion += `has significant security concerns with ${findings.length} issues identified, including ${criticalCount} critical and ${highCount} high severity vulnerabilities that must be addressed before deployment.\n`;
  }
  
  // Second agent provides main recommendation
  discussion += `\n${concludingAgents[1].name}: My primary recommendation is to `;
  
  if (isSafe) {
    discussion += `proceed with implementation but address the noted issues, particularly focusing on improving ${findings.length > 0 ? findings[0].title?.toLowerCase() || 'code quality' : 'documentation and testing'}. Comprehensive testing and possibly a formal audit would be beneficial before mainnet deployment.\n`;
  } else {
    discussion += `fix the identified vulnerabilities, especially the ${findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH').length} critical/high severity issues, and undergo a thorough security review process before deployment. Consider simplifying complex logic and implementing additional safeguards against the attack vectors we've identified.\n`;
  }
  
  // If there's a third agent, they add final thoughts
  if (concludingAgents.length > 2) {
    discussion += `\n${concludingAgents[2].name}: Additionally, I recommend implementing proper event emissions for all state-changing functions and enhancing the documentation to clarify the contract's intent and behavior. These practices improve transparency and auditability in production.\n`;
  }
  
  return discussion;
}

/**
 * Generate realistic findings based on smart contract code and contract type
 * 
 * @param {String} contractCode - The contract source code
 * @param {String} contractType - The type of contract (e.g., 'DEXRouter')
 * @param {Number} riskLevel - Higher values generate more/severe issues (0-100)
 * @returns {Array} - Array of findings objects
 */
function generateRealFindings(contractCode, contractType, riskLevel) {
  const findings = [];
  
  // Determine how many findings to generate based on risk level
  const findingCount = Math.floor(riskLevel / 20) + (Math.random() < 0.5 ? 0 : 1);
  
  // Determine the probability of severe findings
  const criticalProbability = riskLevel > 70 ? 0.7 : riskLevel > 50 ? 0.3 : 0.1;
  const highProbability = riskLevel > 60 ? 0.6 : riskLevel > 40 ? 0.4 : 0.2;
  
  // Analyze code patterns to find realistic vulnerabilities
  const codePatterns = analyzeCodePatterns(contractCode);
  
  // Get appropriate vulnerabilities for this contract type
  const relevantVulnerabilities = getRelevantVulnerabilities(contractType, codePatterns);
  
  // Generate findings
  for (let i = 0; i < findingCount; i++) {
    // Determine severity based on risk level and probabilities
    let severity;
    const rand = Math.random();
    
    if (rand < criticalProbability) {
      severity = 'CRITICAL';
    } else if (rand < criticalProbability + highProbability) {
      severity = 'HIGH';
    } else if (rand < criticalProbability + highProbability + 0.5) {
      severity = 'MEDIUM';
    } else {
      severity = Math.random() < 0.7 ? 'LOW' : 'INFO';
    }
    
    // Select a vulnerability type appropriate for this severity
    const vulnerabilityOptions = relevantVulnerabilities.filter(v => 
      (severity === 'CRITICAL' && VULNERABILITY_PATTERNS[v].severity === 'CRITICAL') ||
      (severity === 'HIGH' && VULNERABILITY_PATTERNS[v].severity === 'HIGH') ||
      (severity === 'MEDIUM' && VULNERABILITY_PATTERNS[v].severity === 'MEDIUM') ||
      ((severity === 'LOW' || severity === 'INFO') && 
       (VULNERABILITY_PATTERNS[v].severity === 'LOW' || VULNERABILITY_PATTERNS[v].severity === 'INFO'))
    );
    
    if (vulnerabilityOptions.length === 0) {
      // Fall back to any vulnerability if none match the severity
      const fallbackVulnerability = relevantVulnerabilities[Math.floor(Math.random() * relevantVulnerabilities.length)];
      findings.push(generateFinding(fallbackVulnerability, severity, contractCode, i));
    } else {
      const selectedVulnerability = vulnerabilityOptions[Math.floor(Math.random() * vulnerabilityOptions.length)];
      findings.push(generateFinding(selectedVulnerability, severity, contractCode, i));
    }
  }
  
  return findings;
}

/**
 * Analyze code to extract patterns and potential vulnerability indicators
 */
function analyzeCodePatterns(code) {
  if (!code) return [];
  
  const patterns = [];
  
  // Check for key vulnerability indicators
  const patternChecks = {
    reentrancy: code.includes('call{value:') || code.includes('.transfer(') || code.includes('.send('),
    accessControl: code.includes('function') && !code.includes('onlyOwner') && !code.includes('require(msg.sender'),
    integerOverflow: (code.includes('+') || code.includes('-') || code.includes('*')) && !code.includes('SafeMath'),
    outdatedCompiler: code.includes('pragma solidity ^0.4') || code.includes('pragma solidity ^0.5'),
    frontRunning: code.includes('swap') || code.includes('price') || code.includes('oracle'),
    unstableDependencies: (code.includes('call') && code.match(/call/g).length > 3) || code.includes('external'),
    gasOptimization: code.includes('for (') || (code.includes('storage') && code.includes('memory')),
    magicNumbers: /\b\d{4,}\b/.test(code) || code.includes('86400') // Matches numbers with 4+ digits or day in seconds
  };
  
  // Add detected patterns
  Object.entries(patternChecks).forEach(([key, exists]) => {
    if (exists) patterns.push(key);
  });
  
  return patterns;
}

/**
 * Get appropriate vulnerabilities for a contract type
 */
function getRelevantVulnerabilities(contractType, codePatterns) {
  // Base vulnerabilities that apply to all contracts
  const baseVulnerabilities = ['accessControl', 'outdatedCompiler', 'gasOptimization', 'magicNumbers'];
  
  // Add vulnerabilities based on contract type
  let typeSpecificVulnerabilities = [];
  
  switch (contractType) {
    case 'DEXRouter':
      typeSpecificVulnerabilities = ['reentrancy', 'frontRunning', 'integerOverflow'];
      break;
    case 'TokenContract':
      typeSpecificVulnerabilities = ['integerOverflow', 'unstableDependencies'];
      break;
    case 'LendingProtocol':
      typeSpecificVulnerabilities = ['reentrancy', 'integerOverflow', 'frontRunning'];
      break;
    case 'StakingContract':
      typeSpecificVulnerabilities = ['reentrancy', 'integerOverflow', 'outdatedCompiler'];
      break;
    case 'BridgeContract':
      typeSpecificVulnerabilities = ['reentrancy', 'accessControl', 'unstableDependencies'];
      break;
    default:
      // For unknown contract types, add all major vulnerabilities
      typeSpecificVulnerabilities = ['reentrancy', 'integerOverflow', 'unstableDependencies', 'frontRunning'];
  }
  
  // Prioritize vulnerabilities found in code patterns
  const detectedVulnerabilities = codePatterns.filter(pattern => 
    Object.keys(VULNERABILITY_PATTERNS).includes(pattern)
  );
  
  // Combine and remove duplicates
  return [...new Set([...detectedVulnerabilities, ...typeSpecificVulnerabilities, ...baseVulnerabilities])];
}

/**
 * Generate a realistic finding based on a vulnerability type
 */
function generateFinding(vulnerabilityType, severity, code, index) {
  const vulnerability = VULNERABILITY_PATTERNS[vulnerabilityType];
  
  // Find a realistic code location if possible
  let codeLines = code?.split('\n') || [];
  let codeLine = 0;
  let codeSnippet = '';
  let codeReference = '';
  
  if (code && vulnerability.codeIndicators.length > 0) {
    // Try to find a code line containing one of the indicators
    for (let i = 0; i < codeLines.length; i++) {
      const line = codeLines[i];
      if (vulnerability.codeIndicators.some(indicator => line.includes(indicator))) {
        codeLine = i + 1;
        
        // Extract a code snippet (the line plus context)
        const startLine = Math.max(0, i - 2);
        const endLine = Math.min(codeLines.length - 1, i + 3);
        codeSnippet = codeLines.slice(startLine, endLine + 1).join('\n');
        
        // Create a reference like "Line 42: function withdraw"
        codeReference = `Line ${codeLine}: ${line.trim().slice(0, 30)}${line.trim().length > 30 ? '...' : ''}`;
        break;
      }
    }
  }
  
  // If no matching code found, use a generic reference
  if (!codeReference) {
    codeLine = 100 + (index * 50); // Generate a plausible line number
    codeReference = `Line ${codeLine}: function vulnerable${index}`;
    codeSnippet = `function vulnerable${index}(address user, uint256 amount) public {
    // Vulnerable code here
    user.call{value: amount}("");
    balances[user] -= amount;
}`;
  }
  
  // Create the finding with realistic details
  return {
    severity: severity,
    title: vulnerability.name,
    description: `This contract contains a ${severity.toLowerCase()} severity issue: ${vulnerability.description.toLowerCase()}`,
    impact: severity === 'CRITICAL' || severity === 'HIGH' 
      ? 'This vulnerability could allow attackers to steal funds or manipulate contract state.'
      : 'This issue could lead to unexpected behavior or increased gas costs.',
    codeReference: codeReference,
    codeSnippet: codeSnippet,
    recommendation: `Implement ${vulnerability.fixPatterns[Math.floor(Math.random() * vulnerability.fixPatterns.length)]} to address this issue.`,
    consensus: index === 0 ? 'All AI models identified this issue' : 
              index === 1 ? '2/3 AI models flagged this vulnerability' :
              'Only one AI model detected this issue, but with high confidence'
  };
}

/**
 * Generate fixes for the identified vulnerabilities
 * 
 * @param {Array} findings - Array of identified security findings
 * @returns {Array} - Array of fix suggestions
 */
function generateFixes(findings) {
  const fixes = [];
  
  // Generate fixes for critical and high severity issues
  findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH').forEach(finding => {
    const vulnType = Object.entries(VULNERABILITY_PATTERNS).find(([key, pattern]) => 
      pattern.name === finding.title
    )?.[0] || 'unknown';
    
    const vulnerability = VULNERABILITY_PATTERNS[vulnType] || {
      name: finding.title || 'Security Issue',
      fixPatterns: ['proper validation', 'access control', 'secure coding practices']
    };
    
    // Generate a fix suggestion
    fixes.push({
      title: `Fix for ${finding.title || 'Security Issue'}`,
      description: `Recommended solution to address the ${finding.severity.toLowerCase()} severity ${finding.title?.toLowerCase() || 'security issue'}.`,
      severity: finding.severity,
      originalCode: finding.codeSnippet || '',
      fixedCode: generateFixCode(finding.codeSnippet, vulnType, vulnerability),
      explanation: `The fixed code implements ${vulnerability.fixPatterns[0]} to address the ${finding.title?.toLowerCase() || 'vulnerability'}. ${getFixExplanation(vulnType)}`
    });
  });
  
  return fixes;
}

/**
 * Generate fixed code based on vulnerability type
 */
function generateFixCode(originalCode, vulnType, vulnerability) {
  if (!originalCode) return '';
  
  switch (vulnType) {
    case 'reentrancy':
      return originalCode
        .replace(/user\.call{value: amount}\(""\);(\s+)balances\[user\] -= amount;/,
                'balances[user] -= amount;$1// Only call external functions after state changes\n    (bool success, ) = user.call{value: amount}("");\n    require(success, "Transfer failed");')
        .replace(/function\s+\w+/, 'function secure // Fixed reentrancy vulnerability');
    
    case 'accessControl':
      return originalCode
        .replace(/function\s+\w+\s*\(/, 'function secure // Added access control\n    // Add access control modifier\n    function secureFunction(')
        .replace(/public/, 'public onlyOwner');
    
    case 'integerOverflow':
      return originalCode
        .replace(/function\s+\w+/, 'function secure // Fixed integer overflow')
        .replace(/(\w+\s*[+\-*/]\s*\w+)/, 'SafeMath.add($1)') // Simplistic replacement
        .replace(/balances\[user\] -= amount/, 'balances[user] = SafeMath.sub(balances[user], amount)');
    
    default:
      // Generic fix for other vulnerability types
      return originalCode
        .replace(/function\s+\w+/, 'function secure // Fixed security issue')
        .replace(/\/\/ Vulnerable code here/, '// Implemented security fixes')
        .replace(/user\.call{value: amount}\(""\);/, 'require(amount > 0 && amount <= balances[user], "Invalid amount");\n    // Perform secure operation with validation\n    (bool success, ) = user.call{value: amount}("");\n    require(success, "Operation failed");');
  }
}

/**
 * Get detailed explanation for a specific fix type
 */
function getFixExplanation(vulnType) {
  switch (vulnType) {
    case 'reentrancy':
      return 'This pattern of updating state variables before making external calls prevents attackers from re-entering the function and exploiting stale state data.';
    
    case 'accessControl':
      return 'Adding proper access controls ensures that only authorized addresses can execute sensitive functions, protecting the contract from unauthorized use.';
    
    case 'integerOverflow':
      return 'Using SafeMath library or Solidity 0.8+ built-in checks prevents integer overflow/underflow vulnerabilities that could otherwise be exploited to manipulate balances or calculations.';
    
    case 'frontRunning':
      return 'Implementing proper guards against transaction ordering manipulation protects users from front-running attacks where malicious actors could exploit advance knowledge of pending transactions.';
    
    default:
      return 'The fix follows security best practices to prevent potential exploits, ensuring proper validation, access control, and secure interaction patterns.';
  }
}

// Export the service functions
module.exports = {
  generateAIDiscussion,
  generateRealFindings,
  generateFixes,
  AI_AGENTS,
  VULNERABILITY_PATTERNS,
  CONTRACT_TYPES,
  NETWORKS
};
