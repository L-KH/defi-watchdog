// src/lib/external-audit/contract-interface.js
import { ethers } from 'ethers';

/**
 * Create a contract interface for external tools to interact with
 * @param {object} contractData - The contract data
 * @returns {object} - Interface object for external tools
 */
export function createContractInterface(contractData) {
  try {
    // Extract ABI from contract source code
    const abi = extractAbiFromSource(contractData.sourceCode);
    
    // Create contract interface
    const interface = {
      address: contractData.address,
      network: contractData.network,
      abi: abi,
      contractName: contractData.contractName,
      isProxy: contractData.isProxy
    };
    
    // Add helper methods
    interface.getMethod = function(methodName) {
      return abi.find(item => 
        item.type === 'function' && 
        item.name === methodName
      );
    };
    
    interface.getReadMethods = function() {
      return abi.filter(item => 
        item.type === 'function' && 
        (item.stateMutability === 'view' || item.stateMutability === 'pure')
      );
    };
    
    interface.getWriteMethods = function() {
      return abi.filter(item => 
        item.type === 'function' && 
        item.stateMutability !== 'view' && 
        item.stateMutability !== 'pure'
      );
    };
    
    return interface;
  } catch (error) {
    console.error('Error creating contract interface:', error);
    
    // Return minimal interface
    return {
      address: contractData.address,
      network: contractData.network,
      contractName: contractData.contractName,
      error: error.message
    };
  }
}

/**
 * Extract ABI from contract source code
 */
function extractAbiFromSource(sourceCode) {
  try {
    // Check if we can find the ABI in the source code
    const abiMatch = sourceCode.match(/const\s+(\w+)?abi\s*=\s*(\[[\s\S]*?\]);/) ||
                    sourceCode.match(/abi\s*=\s*(\[[\s\S]*?\]);/) ||
                    sourceCode.match(/ABI\s*=\s*(\[[\s\S]*?\]);/);
    
    if (abiMatch && abiMatch[2]) {
      try {
        // Attempt to parse ABI from source
        return JSON.parse(abiMatch[2]);
      } catch (parseError) {
        console.error('Error parsing ABI from source:', parseError);
      }
    }
    
    // If we couldn't extract ABI from source, create a minimal ABI based on function signatures
    return createMinimalAbiFromSource(sourceCode);
  } catch (error) {
    console.error('Error extracting ABI:', error);
    return []; // Return empty ABI
  }
}

/**
 * Create a minimal ABI from function signatures in the source code
 */
function createMinimalAbiFromSource(sourceCode) {
  try {
    // Regular expression to find function definitions
    const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)[^{]*(\bpublic\b|\bexternal\b|\bview\b|\bpure\b|\bpayable\b|\bconstant\b|\breturns\b)*/g;
    const matches = [...sourceCode.matchAll(functionRegex)];
    
    if (!matches || matches.length === 0) {
      return []; // No functions found
    }
    
    const abi = [];
    
    for (const match of matches) {
      const name = match[1];
      const params = match[2];
      const modifiers = match[3] || '';
      
      // Skip internal or private functions
      if (!modifiers.includes('public') && !modifiers.includes('external')) {
        continue;
      }
      
      // Determine function type
      let stateMutability = 'nonpayable';
      if (modifiers.includes('view') || modifiers.includes('pure')) {
        stateMutability = modifiers.includes('pure') ? 'pure' : 'view';
      } else if (modifiers.includes('payable')) {
        stateMutability = 'payable';
      }
      
      // Parse parameters
      const inputs = params.split(',')
        .filter(p => p.trim())
        .map((param, i) => {
          const parts = param.trim().split(' ');
          return {
            name: parts.length > 1 ? parts[1] : `param${i}`,
            type: parts[0].replace('memory', '').replace('calldata', '').replace('storage', '').trim()
          };
        });
      
      // Check for return values
      const returnMatch = sourceCode.match(new RegExp(`function\\s+${name}\\s*\\([^)]*\\)[^{]*returns\\s*\\(([^)]*)\\)`));
      const outputs = returnMatch ? returnMatch[1].split(',')
        .filter(p => p.trim())
        .map((param, i) => {
          const parts = param.trim().split(' ');
          return {
            name: parts.length > 1 ? parts[1] : ``,
            type: parts[0].replace('memory', '').replace('calldata', '').replace('storage', '').trim()
          };
        }) : [];
      
      // Add to ABI
      abi.push({
        type: 'function',
        name,
        inputs,
        outputs,
        stateMutability
      });
    }
    
    return abi;
  } catch (error) {
    console.error('Error creating minimal ABI:', error);
    return []; // Return empty ABI
  }
}