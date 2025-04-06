/**
 * Security Tools Service - Integration with professional security analysis tools
 * 
 * This service provides an interface to industry-standard security tools like:
 * - Slither: A Solidity static analysis framework
 * - MythX: A security analysis platform for Ethereum smart contracts
 * - Manticore: A symbolic execution tool for smart contracts
 * - Echidna: A fuzzing tool for Ethereum smart contracts
 */

/**
 * Configuration for available security tools
 */
const SECURITY_TOOLS = {
  slither: {
    name: 'Slither',
    description: 'Static analysis framework detecting vulnerabilities with low false positives',
    capabilities: ['contract inheritance', 'variable usage', 'function visibility', 'reentrancy'],
    confidence: 'high',
    website: 'https://github.com/crytic/slither',
    outputFormat: 'json',
    category: 'static analysis'
  },
  mythx: {
    name: 'MythX',
    description: 'Smart contract security service for detecting common vulnerabilities',
    capabilities: ['integer overflow', 'reentrancy', 'access control', 'timestamp dependence'],
    confidence: 'high',
    website: 'https://mythx.io',
    outputFormat: 'json',
    category: 'comprehensive analysis'
  },
  manticore: {
    name: 'Manticore',
    description: 'Symbolic execution tool for analyzing smart contracts and binaries',
    capabilities: ['path exploration', 'constraint solving', 'taint analysis'],
    confidence: 'medium',
    website: 'https://github.com/trailofbits/manticore',
    outputFormat: 'text',
    category: 'symbolic execution'
  },
  echidna: {
    name: 'Echidna',
    description: 'Fuzz testing framework for Ethereum smart contracts',
    capabilities: ['property testing', 'fuzzing', 'invariant violation'],
    confidence: 'high',
    website: 'https://github.com/crytic/echidna',
    outputFormat: 'text',
    category: 'fuzzing'
  },
  solhint: {
    name: 'Solhint',
    description: 'Open source linting utility for Solidity code',
    capabilities: ['style guide', 'security practices', 'code correctness'],
    confidence: 'medium',
    website: 'https://github.com/protofire/solhint',
    outputFormat: 'json',
    category: 'linting'
  }
};

/**
 * Execute security analysis using available tools
 * 
 * @param {String} contractCode - Smart contract source code
 * @param {String} contractName - Name of the contract
 * @param {Array} tools - Array of tool names to use (default: all tools)
 * @returns {Promise<Object>} - Results from all tools
 */
async function analyzeContractWithTools(contractCode, contractName, tools = Object.keys(SECURITY_TOOLS)) {
  // In a real implementation, this would call actual security tools
  // For now, we simulate tool output with realistic data
  
  // Validate inputs
  if (!contractCode) {
    throw new Error('Contract code is required for security analysis');
  }
  
  // Filter to requested tools
  const selectedTools = tools.filter(tool => Object.keys(SECURITY_TOOLS).includes(tool));
  
  if (selectedTools.length === 0) {
    throw new Error('No valid security tools selected for analysis');
  }
  
  // Generate analysis results for each tool
  const analysisPromises = selectedTools.map(tool => 
    simulateToolAnalysis(tool, contractCode, contractName)
  );
  
  try {
    // Wait for all analysis jobs to complete
    const results = await Promise.all(analysisPromises);
    
    // Compile and return results
    return {
      success: true,
      timestamp: new Date().toISOString(),
      contractName: contractName,
      results: results.reduce((acc, result) => {
        acc[result.tool] = result;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error during security tool analysis:', error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error during security analysis',
      partialResults: {}
    };
  }
}

/**
 * Simulate security tool analysis with realistic outputs
 * 
 * @param {String} toolName - Name of the security tool
 * @param {String} contractCode - Smart contract source code
 * @param {String} contractName - Name of the contract
 * @returns {Promise<Object>} - Tool analysis results
 */
async function simulateToolAnalysis(toolName, contractCode, contractName) {
  // In a real implementation, this would execute the actual tool
  // Here we generate plausible output for the demo
  
  return new Promise((resolve) => {
    // Add small delay to simulate processing time
    setTimeout(() => {
      const tool = SECURITY_TOOLS[toolName];
      
      // Detect potential issues based on code patterns
      const issues = detectToolSpecificIssues(toolName, contractCode);
      
      resolve({
        tool: toolName,
        toolName: tool.name,
        timestamp: new Date().toISOString(),
        success: true,
        issues: issues,
        summary: generateToolSummary(toolName, issues),
        detectors: generateToolDetectors(toolName),
        analysisTime: Math.floor(Math.random() * 10) + 1 // Random time between 1-10 seconds
      });
    }, 500 + Math.random() * 1500); // Random delay between 0.5-2 seconds
  });
}

/**
 * Detect issues specific to each security tool based on code patterns
 */
function detectToolSpecificIssues(toolName, contractCode) {
  const issues = [];
  
  // Common code patterns that may indicate vulnerabilities
  const patterns = {
    reentrancy: {
      regex: /\.call{value|\.transfer\(|\.send\(/,
      before: 'balance.*=',
      after: 'require\(.*balance'
    },
    accessControl: {
      regex: /function\s+\w+\s*\([^)]*\)\s*public|external(?!\s*view|\s*pure|\s*onlyOwner)/,
      negative: /require\(msg\.sender|require\(owner|onlyOwner|Ownable/
    },
    integerOverflow: {
      regex: /\+\+|\+=|-=|\*=|\/=/,
      negative: /SafeMath|pragma solidity\s+(0\.8|^0\.8)/
    },
    timestampDependence: {
      regex: /block\.timestamp|now/,
      context: /if\s*\(|require\(/
    },
    gasLimit: {
      regex: /for\s*\([^;]*;[^;]*;[^)]*\)/,
      context: /length|\.push/
    },
    uncheckedReturn: {
      regex: /\.call\{[^}]*\}\([^)]*\)(?!;[\s\S]*require)/
    }
  };
  
  // Tool-specific logic for detecting issues
  switch(toolName) {
    case 'slither':
      // Slither detects a variety of common issues
      checkForIssue(issues, contractCode, patterns.reentrancy, {
        title: 'Reentrancy vulnerabilities',
        description: 'State changes after external calls can lead to reentrancy attacks',
        severity: 'High',
        confidence: 'Medium'
      });
      
      checkForIssue(issues, contractCode, patterns.accessControl, {
        title: 'Missing access control',
        description: 'Critical function without proper access control',
        severity: 'High',
        confidence: 'High'
      });
      
      if (/pragma solidity\s+(0\.[4-6])/.test(contractCode)) {
        issues.push({
          title: 'Outdated compiler version',
          description: 'Using an outdated compiler version with known vulnerabilities',
          severity: 'Medium',
          confidence: 'High',
          line: contractCode.split('\n').findIndex(line => line.includes('pragma solidity')) + 1
        });
      }
      break;
      
    case 'mythx':
      // MythX focuses on a broad range of security issues
      checkForIssue(issues, contractCode, patterns.integerOverflow, {
        title: 'Integer overflow/underflow',
        description: 'Arithmetic operations that may overflow or underflow',
        severity: 'High',
        confidence: 'High'
      });
      
      checkForIssue(issues, contractCode, patterns.uncheckedReturn, {
        title: 'Unchecked low-level call',
        description: 'Return value of low-level call not checked',
        severity: 'Medium',
        confidence: 'High'
      });
      
      if (contractCode.includes('selfdestruct') || contractCode.includes('suicide')) {
        issues.push({
          title: 'Contract can be destroyed',
          description: 'Contract contains selfdestruct or suicide function',
          severity: 'High',
          confidence: 'High',
          line: contractCode.split('\n').findIndex(line => 
            line.includes('selfdestruct') || line.includes('suicide')
          ) + 1
        });
      }
      break;
      
    case 'manticore':
      // Manticore is good at finding edge cases through symbolic execution
      if (contractCode.includes('assert(') && !contractCode.includes('test')) {
        issues.push({
          title: 'Failed assertion possible',
          description: 'Symbolic execution found states that could trigger assert failures',
          severity: 'Medium',
          confidence: 'Medium',
          line: contractCode.split('\n').findIndex(line => line.includes('assert(')) + 1
        });
      }
      
      if (/if\s*\([^)]*==/.test(contractCode) && 
          (contractCode.includes('block.') || contractCode.includes('msg.'))) {
        issues.push({
          title: 'Dangerous strict equality',
          description: 'Using strict equality with blockchain data can be manipulated',
          severity: 'Medium',
          confidence: 'Medium',
          line: contractCode.split('\n').findIndex(line => 
            /if\s*\([^)]*==/.test(line) && (line.includes('block.') || line.includes('msg.'))
          ) + 1
        });
      }
      break;
      
    case 'echidna':
      // Echidna uses fuzzing to find property violations
      if (contractCode.includes('require(') && 
          (contractCode.includes('balance') || contractCode.includes('owner'))) {
        issues.push({
          title: 'Property violation possible',
          description: 'Fuzzing found states where contract invariants might be violated',
          severity: 'Medium',
          confidence: 'Medium',
          line: contractCode.split('\n').findIndex(line => 
            line.includes('require(') && (line.includes('balance') || line.includes('owner'))
          ) + 1
        });
      }
      
      checkForIssue(issues, contractCode, patterns.gasLimit, {
        title: 'Potential DoS with block gas limit',
        description: 'Loop over arrays without size limitation could exceed block gas limits',
        severity: 'Medium',
        confidence: 'Medium'
      });
      break;
      
    case 'solhint':
      // Solhint focuses on code quality and style
      if (!contractCode.includes('// SPDX-License-Identifier:')) {
        issues.push({
          title: 'Missing SPDX license identifier',
          description: 'File is missing SPDX license identifier',
          severity: 'Info',
          confidence: 'High',
          line: 1
        });
      }
      
      if (contractCode.includes('function () ') || contractCode.includes('function() ')) {
        issues.push({
          title: 'Unnamed fallback function',
          description: 'Consider adding a name to fallback function for better readability',
          severity: 'Info',
          confidence: 'High',
          line: contractCode.split('\n').findIndex(line => 
            line.includes('function () ') || line.includes('function() ')
          ) + 1
        });
      }
      
      if ((contractCode.match(/constructor/g) || []).length > 1) {
        issues.push({
          title: 'Multiple constructors',
          description: 'Contract may have multiple constructors',
          severity: 'Warning',
          confidence: 'Medium',
          line: contractCode.split('\n').findIndex(line => line.includes('constructor')) + 1
        });
      }
      break;
  }
  
  return issues;
}

/**
 * Helper function to check for specific issue patterns
 */
function checkForIssue(issues, code, pattern, issue) {
  if (!code) return;
  
  // Process multiline code for regex matching
  const singleLineCode = code.replace(/\n/g, ' ');
  
  // Check for the pattern
  if (pattern.regex.test(singleLineCode)) {
    // Additional checks for negative patterns or context
    if (pattern.negative && pattern.negative.test(singleLineCode)) {
      return; // Pattern found but negative pattern also found
    }
    
    // For context-specific matches
    if (pattern.context && !pattern.context.test(singleLineCode)) {
      return; // Pattern found but not in the required context
    }
    
    // Additional checks for ordering (for reentrancy)
    if (pattern.before && pattern.after) {
      const beforeMatch = pattern.before.test(singleLineCode);
      const afterMatch = pattern.after.test(singleLineCode);
      
      // For reentrancy check the order: state change after external call
      if (beforeMatch && singleLineCode.indexOf(singleLineCode.match(pattern.regex)[0]) < 
          singleLineCode.indexOf(singleLineCode.match(pattern.before)[0])) {
        // External call before state change - potential reentrancy
      } else if (afterMatch && !beforeMatch) {
        return; // Has proper checks, not vulnerable
      }
    }
    
    // Find line number
    const line = code.split('\n').findIndex(line => pattern.regex.test(line)) + 1;
    
    // Add the issue
    issues.push({
      ...issue,
      line: line > 0 ? line : undefined
    });
  }
}

/**
 * Generate a summary of the tool's findings
 */
function generateToolSummary(toolName, issues) {
  const tool = SECURITY_TOOLS[toolName];
  const criticalCount = issues.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const warningCount = issues.filter(i => i.severity === 'Medium' || i.severity === 'Warning').length;
  const infoCount = issues.filter(i => i.severity === 'Info' || i.severity === 'Low').length;
  
  if (issues.length === 0) {
    return `${tool.name} found no issues in the analyzed code.`;
  }
  
  return `${tool.name} identified ${issues.length} issue${issues.length !== 1 ? 's' : ''}: ` +
         `${criticalCount} critical/high, ${warningCount} medium/warning, and ${infoCount} low/info.`;
}

/**
 * Generate information about the tool's detectors
 */
function generateToolDetectors(toolName) {
  const tool = SECURITY_TOOLS[toolName];
  
  // Generate a realistic list of detectors for each tool
  switch (toolName) {
    case 'slither':
      return [
        { name: 'reentrancy-eth', description: 'Detects reentrancy vulnerabilities for ETH transfers' },
        { name: 'uninitialized-state', description: 'Detects uninitialized state variables' },
        { name: 'uninitialized-storage', description: 'Detects uninitialized storage variables' },
        { name: 'arbitrary-send', description: 'Detects functions that send ETH to arbitrary users' },
        { name: 'controlled-delegatecall', description: 'Detects delegatecall to a user-controlled address' }
      ];
      
    case 'mythx':
      return [
        { name: 'SWC-107', description: 'Reentrancy vulnerabilities' },
        { name: 'SWC-101', description: 'Integer overflow and underflow' },
        { name: 'SWC-115', description: 'Authorization through tx.origin' },
        { name: 'SWC-104', description: 'Unchecked call return value' },
        { name: 'SWC-103', description: 'Floating pragma' }
      ];
      
    case 'manticore':
      return [
        { name: 'Reachability', description: 'Checks if code is reachable and potentially exploitable' },
        { name: 'Assertion', description: 'Verifies assertions cannot be violated' },
        { name: 'Overflow', description: 'Detects arithmetic operations that may overflow' },
        { name: 'ERC conformance', description: 'Checks compliance with ERC standards' }
      ];
      
    case 'echidna':
      return [
        { name: 'assertion-failure', description: 'Finds states that violate assertions' },
        { name: 'property-test', description: 'Checks if contract properties can be violated' },
        { name: 'balance-invariant', description: 'Verifies that balance invariants hold' },
        { name: 'state-consistency', description: 'Checks for inconsistent contract state' }
      ];
      
    case 'solhint':
      return [
        { name: 'code-complexity', description: 'Reports complex code that may be difficult to maintain' },
        { name: 'not-rely-on-time', description: 'Avoids reliance on block.timestamp' },
        { name: 'avoid-suicide', description: 'Suggests avoiding selfdestruct operations' },
        { name: 'avoid-throw', description: 'Suggests using revert with message instead of throw' },
        { name: 'no-empty-blocks', description: 'Avoids empty code blocks' }
      ];
      
    default:
      return [
        { name: 'general-detector', description: 'General security issue detection' },
        { name: 'best-practices', description: 'Checks for adherence to best practices' }
      ];
  }
}

/**
 * Get consolidated findings from multiple tools with deduplication
 * 
 * @param {Object} toolsResults - Results from multiple security tools
 * @returns {Array} - Consolidated and deduplicated findings
 */
function getConsolidatedFindings(toolsResults) {
  if (!toolsResults || !toolsResults.results) {
    return [];
  }
  
  // Extract all issues from all tools
  const allIssues = Object.values(toolsResults.results).flatMap(result => 
    (result.issues || []).map(issue => ({
      ...issue,
      tool: result.toolName || result.tool,
      toolId: result.tool
    }))
  );
  
  // Group similar issues
  const groupedIssues = {};
  
  allIssues.forEach(issue => {
    // Create a key based on issue characteristics
    const key = `${issue.severity}-${issue.title.replace(/\s+/g, '')}-${issue.line || 0}`;
    
    if (!groupedIssues[key]) {
      groupedIssues[key] = {
        title: issue.title,
        description: issue.description,
        severity: issue.severity,
        line: issue.line,
        tools: [{ name: issue.tool, id: issue.toolId }],
        confidence: calculateConfidence(issue.confidence || 'Medium', 1)
      };
    } else {
      // Add the tool if not already present
      if (!groupedIssues[key].tools.some(t => t.id === issue.toolId)) {
        groupedIssues[key].tools.push({ name: issue.tool, id: issue.toolId });
        
        // Increase confidence with additional tool detections
        groupedIssues[key].confidence = calculateConfidence(
          groupedIssues[key].confidence,
          groupedIssues[key].tools.length
        );
      }
    }
  });
  
  // Convert back to array and sort by severity and confidence
  return Object.values(groupedIssues).sort((a, b) => {
    const severityOrder = { Critical: 0, High: 1, Medium: 2, Warning: 3, Low: 4, Info: 5 };
    const aOrder = severityOrder[a.severity] || 99;
    const bOrder = severityOrder[b.severity] || 99;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder; // Sort by severity first
    }
    
    // Then sort by confidence (High to Low)
    const confidenceOrder = { High: 0, Medium: 1, Low: 2 };
    const aConfidence = confidenceOrder[a.confidence] || 99;
    const bConfidence = confidenceOrder[b.confidence] || 99;
    
    return aConfidence - bConfidence;
  });
}

/**
 * Calculate confidence level based on number of tools detecting the issue
 */
function calculateConfidence(baseConfidence, toolCount) {
  const confidenceValues = { High: 3, Medium: 2, Low: 1 };
  const baseValue = confidenceValues[baseConfidence] || 2;
  
  // Increase confidence with multiple tool confirmations
  let adjustedValue = baseValue + (toolCount - 1);
  
  // Cap at High confidence
  if (adjustedValue >= 3) return 'High';
  if (adjustedValue === 2) return 'Medium';
  return 'Low';
}

// Export the service functions
module.exports = {
  analyzeContractWithTools,
  getConsolidatedFindings,
  SECURITY_TOOLS
};
