// src/pages/api/tools/analyze.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * API endpoint for analyzing contracts with security tools
 * 
 * This endpoint supports running Slither (and potentially other tools)
 * on contract source code, returning the results in a standardized format.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceCode, contractName, tool = 'slither' } = req.body;

    if (!sourceCode) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    // Create a temporary directory for the analysis
    const tempDir = path.join(os.tmpdir(), 'defi-watchdog-analysis-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });

    // Save the contract to a file
    const contractFileName = contractName ? 
      `${contractName.replace(/[^a-zA-Z0-9]/g, '')}.sol` : 
      'Contract.sol';
    const contractPath = path.join(tempDir, contractFileName);
    fs.writeFileSync(contractPath, sourceCode);

    // Response object we'll build up
    const response = {
      success: true,
      tool,
      findings: [],
      logs: '',
      error: null
    };

    // Check which tool to use
    if (tool === 'slither') {
      try {
        // Check if Slither is installed
        try {
          execSync('slither --version', { encoding: 'utf8' });
        } catch (error) {
          return res.status(500).json({ 
            error: 'Slither is not installed on the server',
            details: "The Slither tool needs to be installed on the server. Please install it with 'pip install slither-analyzer'."
          });
        }

        // Run Slither with JSON output
        const slitherOutput = execSync(
          `cd "${tempDir}" && slither "${contractFileName}" --json -`, 
          { encoding: 'utf8' }
        );

        // Parse the JSON output
        const slitherResults = JSON.parse(slitherOutput);
        
        // Format the results
        if (slitherResults.results && slitherResults.results.detectors) {
          response.findings = slitherResults.results.detectors.map(finding => {
            // Map Slither severity to our format
            const severityMap = {
              'High': 'HIGH',
              'Medium': 'MEDIUM',
              'Low': 'LOW',
              'Informational': 'INFO'
            };
            
            return {
              severity: severityMap[finding.impact] || 'MEDIUM',
              title: finding.check,
              description: finding.description,
              codeReference: finding.elements.map(e => e.name).join(', '),
              recommendation: finding.recommendation || 'Review and fix the issue.',
              tool: 'Slither'
            };
          });
        }
        
        response.logs = 'Slither analysis completed successfully';
      } catch (error) {
        // If Slither fails, we'll return a simulated response
        console.error('Slither execution failed:', error);
        response.error = 'Failed to run Slither. Using simulated results instead.';
        response.success = false;
        
        // Add simulated findings for demonstration
        response.findings = simulateSlitherFindings(sourceCode);
      }
    } else if (tool === 'mythx') {
      // MythX would require an API key and different implementation
      response.error = 'MythX integration is not yet implemented. Using simulated results instead.';
      response.findings = simulateMythXFindings(sourceCode);
    } else {
      return res.status(400).json({ error: 'Unsupported tool specified' });
    }

    // Clean up temporary files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn('Failed to clean up temp directory:', cleanupError);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Tool analysis API error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze contract', 
      details: error.message 
    });
  }
}

/**
 * Simulate Slither findings for demonstration purposes
 */
function simulateSlitherFindings(sourceCode) {
  const findings = [];
  
  // Look for common patterns that Slither would detect
  if (sourceCode.includes('tx.origin')) {
    findings.push({
      severity: 'MEDIUM',
      title: 'Use of tx.origin for Authorization',
      description: 'The contract uses tx.origin for authorization. This is unsafe and can lead to phishing attacks.',
      codeReference: 'tx.origin',
      recommendation: 'Use msg.sender instead of tx.origin for authorization.',
      tool: 'Slither (simulated)'
    });
  }
  
  if (sourceCode.includes('.call{value:') && !sourceCode.includes('require(success')) {
    findings.push({
      severity: 'HIGH',
      title: 'Unchecked Low-Level Call',
      description: 'Low-level call return value is not checked, which may lead to silent failures.',
      codeReference: '.call{value:',
      recommendation: 'Always check the return value of low-level calls.',
      tool: 'Slither (simulated)'
    });
  }
  
  if (sourceCode.includes('selfdestruct')) {
    findings.push({
      severity: 'HIGH',
      title: 'Self-Destruct Capability',
      description: 'The contract can be self-destructed, which removes it from the blockchain.',
      codeReference: 'selfdestruct',
      recommendation: 'Ensure strong access controls around self-destruct functionality.',
      tool: 'Slither (simulated)'
    });
  }
  
  return findings;
}

/**
 * Simulate MythX findings for demonstration purposes
 */
function simulateMythXFindings(sourceCode) {
  const findings = [];
  
  if (sourceCode.includes('delegatecall')) {
    findings.push({
      severity: 'CRITICAL',
      title: 'Delegatecall to Untrusted Contract',
      description: 'The contract uses delegatecall, which can lead to severe security issues if misused.',
      codeReference: 'delegatecall',
      recommendation: 'Be extremely cautious with delegatecall and ensure it\'s used safely.',
      tool: 'MythX (simulated)'
    });
  }
  
  if (sourceCode.includes('block.timestamp')) {
    findings.push({
      severity: 'MEDIUM',
      title: 'Timestamp Dependence',
      description: 'The contract relies on block.timestamp, which can be manipulated by miners within a certain range.',
      codeReference: 'block.timestamp',
      recommendation: 'Avoid using block.timestamp for critical timing logic.',
      tool: 'MythX (simulated)'
    });
  }
  
  return findings;
}
