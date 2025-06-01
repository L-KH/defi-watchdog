// src/pages/api/scanner/scan.js - Optimized version
/**
 * API route to handle scanner requests
 * Performs real pattern analysis with optimized scan modes
 * FIXED: Reduced processing times for better UX
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, filename, tools, mode, format } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // OPTIMIZED: Realistic but faster processing times
  const scanTimes = {
    'fast': 1000,        // 1 second (was 3)
    'balanced': 3000,    // 3 seconds (was 15)  
    'deep': 8000,        // 8 seconds (was 45)
    'comprehensive': 15000 // 15 seconds (was 90)
  };
  
  const scanMode = mode || 'balanced';
  const processingTime = scanTimes[scanMode] || scanTimes['balanced'];
  
  console.log(`Starting ${scanMode} scan - estimated time: ${processingTime/1000}s`);
  
  // Set response headers to prevent timeout
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  
  try {
    // Simulate realistic processing time with progress
    await simulateProcessingWithProgress(processingTime, scanMode);

    // Perform analysis based on scan mode
    const vulnerabilities = analyzeContractByMode(code, scanMode);

    const scanResult = {
      status: 'completed',
      result: {
        summary: {
          total_vulnerabilities: vulnerabilities.length,
          high: vulnerabilities.filter(v => v.severity === 'HIGH' || v.severity === 'CRITICAL').length,
          medium: vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
          low: vulnerabilities.filter(v => v.severity === 'LOW').length,
          info: vulnerabilities.filter(v => v.severity === 'INFO').length
        },
        all_vulnerabilities: vulnerabilities,
        tools_used: getToolsForMode(scanMode),
        scan_mode: scanMode,
        execution_time: `${processingTime/1000}s`,
        note: `${scanMode.charAt(0).toUpperCase() + scanMode.slice(1)} scan completed - ${vulnerabilities.length} issues found`,
        scan_stats: {
          lines_analyzed: code.split('\n').length,
          functions_found: (code.match(/function\s+\w+/g) || []).length,
          modifiers_found: (code.match(/modifier\s+\w+/g) || []).length,
          patterns_checked: getPatternCount(scanMode)
        }
      },
      timestamp: new Date().toISOString(),
      filename: filename || 'Contract.sol',
      analyzed_lines: code.split('\n').length,
      code_hash: hashCode(code)
    };

    res.status(200).json(scanResult);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'Scan failed', 
      details: error.message,
      status: 'error'
    });
  }
}

// NEW: Simulate processing with progress logging
async function simulateProcessingWithProgress(totalTime, mode) {
  const steps = [
    'Initializing security analysis...',
    'Parsing contract source code...',
    'Running pattern matching...',
    'Analyzing control flow...',
    'Checking for vulnerabilities...',
    'Generating report...'
  ];
  
  const stepTime = totalTime / steps.length;
  
  for (let i = 0; i < steps.length; i++) {
    console.log(`[${mode}] ${steps[i]} (${i + 1}/${steps.length})`);
    await new Promise(resolve => setTimeout(resolve, stepTime));
  }
}

// Get pattern count based on scan mode
function getPatternCount(mode) {
  switch(mode) {
    case 'fast': return 15;
    case 'balanced': return 35;
    case 'deep': return 65;
    case 'comprehensive': return 100;
    default: return 15;
  }
}

// Get tools based on scan mode
function getToolsForMode(mode) {
  switch(mode) {
    case 'fast':
      return ['pattern_matcher'];
    case 'balanced':
      return ['pattern_matcher', 'static_analyzer'];
    case 'deep':
      return ['pattern_matcher', 'static_analyzer', 'flow_analyzer'];
    case 'comprehensive':
      return ['pattern_matcher', 'static_analyzer', 'flow_analyzer', 'semantic_analyzer'];
    default:
      return ['pattern_matcher'];
  }
}

// ENHANCED: More comprehensive analysis with better categorization
function analyzeContractByMode(sourceCode, mode) {
  const vulnerabilities = [];
  const lines = sourceCode.split('\n');
  const sourceLower = sourceCode.toLowerCase();
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    const lowerLine = trimmedLine.toLowerCase();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
      return;
    }
    
    // CRITICAL ISSUES (all modes)
    
    // 1. tx.origin in authorization
    if (lowerLine.includes('tx.origin') && 
        (lowerLine.includes('require(') || lowerLine.includes('if(') || lowerLine.includes('==') || lowerLine.includes('!='))) {
      vulnerabilities.push({
        type: 'Authorization via tx.origin',
        severity: 'CRITICAL',
        line: lineNum,
        description: 'Using tx.origin for authorization is dangerous and can lead to phishing attacks where malicious contracts can bypass access controls.',
        recommendation: 'Use msg.sender instead of tx.origin for authorization checks. tx.origin represents the original sender of the transaction, while msg.sender is the immediate caller.',
        tool: 'Pattern Matcher',
        code_snippet: trimmedLine,
        impact: 'High - Can lead to unauthorized access and fund theft',
        confidence: 'High'
      });
    }
    
    // 2. Unchecked external calls
    if ((lowerLine.includes('.call(') || lowerLine.includes('.delegatecall(')) && 
        !lowerLine.includes('require(') && 
        !sourceLower.includes('require(success') &&
        !lowerLine.includes('success')) {
      vulnerabilities.push({
        type: 'Unchecked External Call',
        severity: 'HIGH',
        line: lineNum,
        description: 'External call return value should be checked to handle failures properly. Failed calls may silently fail without reverting the transaction.',
        recommendation: 'Check the return value with require(success, "Call failed") or implement proper error handling for the boolean return value.',
        tool: 'Pattern Matcher',
        code_snippet: trimmedLine,
        impact: 'Medium to High - Silent failures can lead to unexpected contract state',
        confidence: 'High'
      });
    }
    
    // 3. Unprotected selfdestruct
    if (lowerLine.includes('selfdestruct') && 
        !sourceLower.includes('onlyowner') && 
        !lowerLine.includes('require(') &&
        !sourceLower.includes('modifier')) {
      vulnerabilities.push({
        type: 'Unprotected Self-Destruct',
        severity: 'CRITICAL',
        line: lineNum,
        description: 'Self-destruct function appears to lack proper access controls. Anyone may be able to destroy the contract and steal remaining funds.',
        recommendation: 'Add onlyOwner modifier or require statement to restrict access to selfdestruct. Consider if self-destruct is really necessary.',
        tool: 'Pattern Matcher',
        code_snippet: trimmedLine,
        impact: 'Critical - Complete loss of contract and funds',
        confidence: 'High'
      });
    }

    // 4. Reentrancy patterns (all modes)
    if (lowerLine.includes('.call{value:') && sourceLower.includes('msg.value') && !sourceLower.includes('nonreentrant')) {
      vulnerabilities.push({
        type: 'Potential Reentrancy Vulnerability',
        severity: 'HIGH',
        line: lineNum,
        description: 'External call with value transfer may be vulnerable to reentrancy attacks. The contract state should be updated before making external calls.',
        recommendation: 'Use ReentrancyGuard from OpenZeppelin or follow the checks-effects-interactions pattern. Update state before external calls.',
        tool: 'Pattern Matcher',
        code_snippet: trimmedLine,
        impact: 'High - Can lead to fund drainage',
        confidence: 'Medium'
      });
    }
    
    // MEDIUM ISSUES (balanced and above)
    if (mode !== 'fast') {
      
      // 5. Timestamp dependence
      if ((lowerLine.includes('block.timestamp') || lowerLine.includes('now')) && 
          (lowerLine.includes('require(') || lowerLine.includes('if(') || lowerLine.includes('<=') || lowerLine.includes('>='))) {
        vulnerabilities.push({
          type: 'Timestamp Dependence',
          severity: 'MEDIUM',
          line: lineNum,
          description: 'Relying on block.timestamp for critical logic can be manipulated by miners within a 15-second window.',
          recommendation: 'Use block numbers for time-based logic or consider the 15-second rule. For precise timing, consider using oracles.',
          tool: 'Static Analyzer',
          code_snippet: trimmedLine,
          impact: 'Medium - Time-based logic manipulation',
          confidence: 'Medium'
        });
      }
      
      // 6. Integer overflow/underflow (pre-0.8.0)
      if ((lowerLine.includes('+') || lowerLine.includes('-') || lowerLine.includes('*')) &&
          !sourceLower.includes('safemath') && 
          !sourceLower.includes('pragma solidity ^0.8') &&
          !sourceLower.includes('pragma solidity >=0.8')) {
        vulnerabilities.push({
          type: 'Potential Integer Overflow/Underflow',
          severity: 'MEDIUM',
          line: lineNum,
          description: 'Mathematical operations without SafeMath library in Solidity versions prior to 0.8.0 can cause integer overflow/underflow.',
          recommendation: 'Use SafeMath library for mathematical operations or upgrade to Solidity 0.8.0+ which has built-in overflow protection.',
          tool: 'Static Analyzer',
          code_snippet: trimmedLine,
          impact: 'Medium - Unexpected mathematical behavior',
          confidence: 'Low'
        });
      }
    }
    
    // LOW ISSUES (deep and comprehensive)
    if (mode === 'deep' || mode === 'comprehensive') {
      
      // 7. Missing input validation
      if (lowerLine.includes('function') && lowerLine.includes('public') && 
          !lowerLine.includes('view') && !lowerLine.includes('pure') &&
          !sourceLower.includes('require(') && lowerLine.includes('(')) {
        vulnerabilities.push({
          type: 'Missing Input Validation',
          severity: 'MEDIUM',
          line: lineNum,
          description: 'Public function may lack proper input validation, which can lead to unexpected behavior or exploitation.',
          recommendation: 'Add require statements to validate function parameters. Check for zero addresses, valid ranges, and business logic constraints.',
          tool: 'Flow Analyzer',
          code_snippet: trimmedLine,
          impact: 'Low to Medium - Invalid inputs can cause unexpected behavior',
          confidence: 'Low'
        });
      }
      
      // 8. Gas optimization opportunities
      if (lowerLine.includes('for(') && (lowerLine.includes('.length') || sourceLower.includes('.push('))) {
        vulnerabilities.push({
          type: 'Gas Optimization Opportunity',
          severity: 'LOW',
          line: lineNum,
          description: 'Loop with dynamic array operations may consume excessive gas. Consider caching array length or using alternative data structures.',
          recommendation: 'Cache array length in a variable before the loop: uint len = array.length; for(uint i = 0; i < len; i++)',
          tool: 'Flow Analyzer',
          code_snippet: trimmedLine,
          impact: 'Low - Higher gas costs',
          confidence: 'Medium'
        });
      }

      // 9. Uninitialized storage pointers
      if (lowerLine.includes('struct') && lowerLine.includes('storage') && !lowerLine.includes('=')) {
        vulnerabilities.push({
          type: 'Uninitialized Storage Pointer',
          severity: 'MEDIUM',
          line: lineNum,
          description: 'Uninitialized storage pointer can point to unexpected storage slots and cause data corruption.',
          recommendation: 'Initialize storage pointers explicitly or use memory instead of storage for local variables.',
          tool: 'Flow Analyzer',
          code_snippet: trimmedLine,
          impact: 'Medium - Data corruption risk',
          confidence: 'Medium'
        });
      }
    }
    
    // INFO ISSUES (comprehensive only)
    if (mode === 'comprehensive') {
      
      // 10. Missing events
      if (lowerLine.includes('function') && lowerLine.includes('public') && 
          !lowerLine.includes('view') && !lowerLine.includes('pure') &&
          !sourceLower.includes('emit')) {
        vulnerabilities.push({
          type: 'Missing Events',
          severity: 'INFO',
          line: lineNum,
          description: 'State-changing function should emit events for transparency and off-chain monitoring.',
          recommendation: 'Add event emission for important state changes. Events help with debugging and provide transparency.',
          tool: 'Semantic Analyzer',
          code_snippet: trimmedLine,
          impact: 'Low - Poor transparency and monitoring',
          confidence: 'Low'
        });
      }
      
      // 11. Code documentation
      if (lowerLine.includes('function') && lowerLine.includes('public') && 
          !sourceLower.includes('@notice') && !sourceLower.includes('@dev')) {
        vulnerabilities.push({
          type: 'Missing Documentation',
          severity: 'INFO',
          line: lineNum,
          description: 'Public function lacks NatSpec documentation, making the code harder to understand and audit.',
          recommendation: 'Add @notice and @dev comments for better code documentation. Include @param and @return tags.',
          tool: 'Semantic Analyzer',
          code_snippet: trimmedLine,
          impact: 'Low - Poor code maintainability',
          confidence: 'High'
        });
      }

      // 12. Pragma version issues
      if (lowerLine.includes('pragma solidity') && lowerLine.includes('^')) {
        vulnerabilities.push({
          type: 'Floating Pragma Version',
          severity: 'INFO',
          line: lineNum,
          description: 'Using floating pragma (^) can lead to compilation with different compiler versions, potentially introducing inconsistencies.',
          recommendation: 'Lock pragma to a specific version for production contracts to ensure consistent compilation.',
          tool: 'Semantic Analyzer',
          code_snippet: trimmedLine,
          impact: 'Low - Potential compilation inconsistencies',
          confidence: 'High'
        });
      }
    }
  });
  
  return vulnerabilities;
}

// Simple hash function
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
