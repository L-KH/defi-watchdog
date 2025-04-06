// src/lib/tools/mythx/index.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

/**
 * Analyze a smart contract using MythX API
 * @param {string} sourceCode - The contract source code
 * @param {object} options - Analysis options
 * @returns {Promise<object>} MythX analysis results
 */
export async function analyzeWithMythX(sourceCode, options = {}) {
  const {
    apiKey = process.env.MYTHX_API_KEY,
    apiUrl = 'https://api.mythx.io/v1',
    analysisMode = 'standard', // 'quick', 'standard', or 'deep'
  } = options;

  if (!apiKey) {
    throw new Error('MythX API key is required. Set MYTHX_API_KEY environment variable or pass apiKey option.');
  }

  try {
    // Create a temporary directory and file
    const tempDir = path.join(os.tmpdir(), `mythx-${uuidv4()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    const tempFile = path.join(tempDir, 'Contract.sol');
    fs.writeFileSync(tempFile, sourceCode);

    // Step 1: Authenticate with MythX
    const authResponse = await axios.post(
      `${apiUrl}/auth/login`,
      { apiKey },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    const jwtToken = authResponse.data.jwtToken;

    // Step 2: Submit the contract for analysis
    const submitResponse = await axios.post(
      `${apiUrl}/analyses`,
      {
        clientToolName: 'defi-watchdog',
        data: {
          sourceCode,
          sourceType: 'solidity',
        },
        analysisMode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      }
    );

    const analysisUuid = submitResponse.data.uuid;

    // Step 3: Poll for analysis results
    let analysisComplete = false;
    let analysisResult;
    let attempts = 0;
    const maxAttempts = 60; // Poll for up to 5 minutes (60 * 5 seconds)

    while (!analysisComplete && attempts < maxAttempts) {
      attempts++;
      
      const statusResponse = await axios.get(
        `${apiUrl}/analyses/${analysisUuid}`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        }
      );

      const status = statusResponse.data.status;

      if (status === 'finished') {
        analysisComplete = true;
        
        // Get detailed results
        const detailsResponse = await axios.get(
          `${apiUrl}/analyses/${analysisUuid}/issues`,
          {
            headers: {
              'Authorization': `Bearer ${jwtToken}`
            }
          }
        );
        
        analysisResult = detailsResponse.data;
      } else if (status === 'error') {
        throw new Error(`MythX analysis failed: ${statusResponse.data.error}`);
      } else {
        // Wait 5 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    if (!analysisComplete) {
      throw new Error('MythX analysis timed out after 5 minutes');
    }

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Transform MythX output to our expected format
    return {
      source: 'MythX',
      ...transformMythXOutput(analysisResult)
    };
  } catch (error) {
    console.error("Error running MythX analysis:", error);
    throw new Error(`MythX analysis failed: ${error.message}`);
  }
}

/**
 * Transform MythX JSON output to our expected format
 */
function transformMythXOutput(mythxOutput) {
  // Map MythX severity levels to our format
  const severityMapping = {
    'High': 'CRITICAL',
    'Medium': 'HIGH',
    'Low': 'MEDIUM',
    'Informational': 'LOW'
  };
  
  // Extract detected issues
  const risks = [];
  
  if (mythxOutput && mythxOutput.issues) {
    mythxOutput.issues.forEach(issue => {
      const severity = severityMapping[issue.severity] || 'INFO';
      
      risks.push({
        severity,
        title: issue.swcID ? `SWC-${issue.swcID}: ${issue.swcTitle}` : issue.description.head,
        description: issue.description.tail || issue.description.head,
        codeReference: issue.sourceLocation ? 
          `Line ${issue.sourceLocation.line}: ${issue.sourceLocation.humanSummary || ''}` : 
          "Location not specified",
        impact: issue.severity === 'High' ? 
          'Critical security vulnerability that must be addressed immediately' : 
          issue.severity === 'Medium' ? 
            'Significant security concern that should be addressed' :
            'Minor security or quality issue',
        recommendation: issue.description.tail || "Review the identified issue and apply appropriate fixes"
      });
    });
  }
  
  // Calculate security score (100 - weighted sum of issues)
  const issueWeights = {
    'CRITICAL': 25,
    'HIGH': 15, 
    'MEDIUM': 5,
    'LOW': 1,
    'INFO': 0
  };
  
  let totalWeight = 0;
  risks.forEach(risk => {
    totalWeight += issueWeights[risk.severity] || 0;
  });
  
  const securityScore = Math.max(0, Math.min(100, 100 - totalWeight));
  
  // Determine risk level
  let riskLevel = "Safe";
  if (securityScore < 40) riskLevel = "High Risk";
  else if (securityScore < 70) riskLevel = "Medium Risk";
  else if (securityScore < 90) riskLevel = "Low Risk";
  
  return {
    overview: `MythX analysis identified ${risks.length} security issues`,
    contractType: "Solidity Contract",
    risks,
    securityScore,
    riskLevel,
    explanation: `MythX identified ${risks.length} issues with various severity levels. ${
      risks.length > 0 ? 
        `Most severe: ${risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH').length} critical/high issues.` : 
        'No significant issues were found.'
    }`
  };
}

export default analyzeWithMythX;
