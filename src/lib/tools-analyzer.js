// src/lib/tools-analyzer.js
import { getContractSource, getContractInfo, getEtherscanUrl } from './etherscan';

// Constants for tool options
const TOOLS = {
  SLITHER: 'slither',
  MYTHX: 'mythx',
  SECURIFY: 'securify',
  MYTHRIL: 'mythril',
};

/**
 * Analyzes a contract using security tools
 * @param {string} address The contract address
 * @param {string} network The network (e.g., 'linea', 'sonic')
 * @param {object} options Analysis options and callbacks
 * @returns {Promise<object>} Analysis results
 */
export async function analyzeContractWithTools(address, network = 'linea', options = {}) {
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
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: true,
          step: 'Running security tools (Slither analysis)...',
          progress: 50,
          address,
          network
        });
      }

      // Call our API endpoint to run tools analysis
      const toolsAnalysisResults = await performToolsAnalysis(contractData.sourceCode, contractData.contractName, options);
      
      if (options.updateCallback) {
        options.updateCallback({
          isLoading: true,
          step: 'Tools analysis complete. Generating final report...',
          progress: 90,
          address,
          network
        });
      }
      
      // Calculate a security score based on the findings
      const securityScore = calculateSecurityScore(toolsAnalysisResults.findings);
      
      const result = {
        success: true,
        address,
        network,
        contractName: contractData.contractName || `Contract-${address.slice(0, 8)}`,
        contractType: contractData.contractType || "Smart Contract",
        compiler: contractData.compiler || "Unknown",
        analysis: {
          contractType: "Smart Contract",
          overview: toolsAnalysisResults.overview || "Analysis completed using security tools.",
          keyFeatures: toolsAnalysisResults.keyFeatures || [],
          risks: toolsAnalysisResults.findings || [],
          securityScore: securityScore,
          riskLevel: determineRiskLevel(securityScore),
          explanation: toolsAnalysisResults.explanation || "Analysis complete with security tools."
        },
        securityScore,
        riskLevel: determineRiskLevel(securityScore),
        isSafe: securityScore > 80,
        timestamp: new Date().toISOString(),
        etherscanUrl: getEtherscanUrl(address, network),
        toolsUsed: toolsAnalysisResults.toolsUsed || ['Slither']
      };
      
      // Save the result to the database (if implemented)
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
  } catch (error) {
    console.error('Tools analysis failed:', error);
    
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

/**
 * Performs security tool analysis by calling the API
 * @param {string} sourceCode - Contract source code
 * @param {string} contractName - Contract name
 * @param {object} options - Analysis options
 * @returns {Promise<object>} Analysis results
 */
async function performToolsAnalysis(sourceCode, contractName, options = {}) {
  const selectedTools = options.tools || [TOOLS.SLITHER]; // Default to Slither
  const findings = [];
  const toolsUsed = [];
  let hasErrors = false;
  
  // First, try to run Slither
  if (selectedTools.includes(TOOLS.SLITHER) || !selectedTools.length) {
    if (options.updateCallback) {
      options.updateCallback({
        isLoading: true,
        step: 'Running Slither static analysis...',
        progress: 60,
      });
    }
    
    try {
    const response = await fetch('http://89.147.103.119:3001/api/analyze', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    sourceCode,
    contractName,
    tool: 'slither'
    }),
    });
    
    console.log('Slither API response status:', response.status);
    
    if (!response.ok) {
    const errorData = await response.json();
      console.warn('Slither analysis error:', errorData);
    hasErrors = true;
    } else {
    const data = await response.json();
    console.log('Slither analysis completed successfully');
    
    if (data.findings && data.findings.length > 0) {
      console.log(`Found ${data.findings.length} issues`);
      findings.push(...data.findings);
      } else {
          console.log('No issues found');
      }
      
      // Add to tools used
        toolsUsed.push('Slither');
        }
      } catch (error) {
        console.error('Slither analysis failed:', error);
        hasErrors = true;
        // Will fall back to simulated results in error cases
      }
  }
  
  // Try to run MythX if selected
  if (selectedTools.includes(TOOLS.MYTHX)) {
    if (options.updateCallback) {
      options.updateCallback({
        isLoading: true,
        step: 'Running MythX deep analysis...',
        progress: 70,
      });
    }
    
    try {
      const response = await fetch('http://89.147.103.119:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCode,
          contractName,
          tool: 'mythx'
        }),
      });
      
      console.log('MythX API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('MythX analysis error:', errorData);
        hasErrors = true;
      } else {
        const data = await response.json();
        console.log('MythX analysis completed successfully');
        
        if (data.findings && data.findings.length > 0) {
          console.log(`Found ${data.findings.length} issues with MythX`);
          findings.push(...data.findings);
        } else {
          console.log('No MythX issues found');
        }
        
        // Add to tools used
        toolsUsed.push('MythX');
      }
    } catch (error) {
      console.error('MythX analysis failed:', error);
      hasErrors = true;
    }
  }
  
  // If we got no results or had errors, use simulated results as fallback
  if (findings.length === 0 || hasErrors) {
    // Add some basic simulated findings based on code patterns
    if (hasErrors) {
      console.log('Using simulated results as fallback due to errors');
    }
    
    // Only use simulated findings if we couldn't get real ones
    if (findings.length === 0) {
      // Check for common patterns
      if (sourceCode.includes('tx.origin')) {
        findings.push({
          severity: "MEDIUM",
          title: "Use of tx.origin for Authorization",
          description: "The contract uses tx.origin for authorization. This is unsafe and can lead to phishing attacks.",
          codeReference: "tx.origin",
          impact: "Attackers could trick users into executing malicious transactions.",
          recommendation: "Use msg.sender instead of tx.origin for authorization.",
          tool: "Slither (simulated)"
        });
      }
      
      if (sourceCode.includes('.call{value:') && !sourceCode.includes('require(success')) {
        findings.push({
          severity: "HIGH",
          title: "Unchecked Low-Level Call",
          description: "Low-level call return value is not checked, which may lead to silent failures.",
          codeReference: ".call{value:",
          impact: "Failed operations may go unnoticed, leading to loss of funds or broken contract state.",
          recommendation: "Always check the return value of low-level calls.",
          tool: "Slither (simulated)"
        });
      }
      
      // Add simulated tool to list if we had to use simulated results
      if (!toolsUsed.includes('Slither') && !toolsUsed.includes('Slither (simulated)')) {
        toolsUsed.push('Slither (simulated)');
      }
    }
  }
  
  // Create overview based on findings
  let overview = "This contract was analyzed using ";
  if (toolsUsed.length > 0) {
    overview += toolsUsed.join(' and ');
  } else {
    overview += "static analysis";
  }
  overview += ".";
  
  if (hasErrors) {
    overview += " Some tools encountered errors and used simulated results as fallback.";
  }
  
  if (findings.length === 0) {
    overview += " No security issues were detected.";
  } else {
    const criticalCount = findings.filter(f => f.severity === "CRITICAL").length;
    const highCount = findings.filter(f => f.severity === "HIGH").length;
    const mediumCount = findings.filter(f => f.severity === "MEDIUM").length;
    const lowCount = findings.filter(f => f.severity === "LOW").length;
    
    overview += " Found ";
    
    if (criticalCount > 0) {
      overview += `${criticalCount} critical, `;
    }
    
    if (highCount > 0) {
      overview += `${highCount} high, `;
    }
    
    if (mediumCount > 0) {
      overview += `${mediumCount} medium, `;
    }
    
    if (lowCount > 0) {
      overview += `${lowCount} low risk `;
    }
    
    overview += `issue${findings.length > 1 ? 's' : ''}.`;
  }
  
  // Return the analysis results
  return {
    findings,
    overview,
    explanation: `Analysis conducted using ${toolsUsed.join(' and ')}. ${findings.length} issue${findings.length !== 1 ? 's' : ''} found.`,
    toolsUsed
  };
}

/**
 * Calculate a security score based on the severity of findings
 */
function calculateSecurityScore(findings) {
  if (!findings || findings.length === 0) {
    return 95; // Near perfect score for no findings
  }
  
  // Weights for each severity level
  const weights = {
    CRITICAL: 30,
    HIGH: 15,
    MEDIUM: 7,
    LOW: 3,
    INFO: 0
  };
  
  // Calculate deductions based on findings
  let totalDeduction = 0;
  findings.forEach(finding => {
    totalDeduction += weights[finding.severity] || 0;
  });
  
  // Cap the deduction at 95 to ensure score is at least 5
  totalDeduction = Math.min(totalDeduction, 95);
  
  return 100 - totalDeduction;
}

/**
 * Determine risk level based on security score
 */
function determineRiskLevel(securityScore) {
  if (securityScore >= 90) return "Safe";
  if (securityScore >= 75) return "Low Risk";
  if (securityScore >= 60) return "Medium Risk";
  return "High Risk";
}
