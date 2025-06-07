// pages/api/analyze.js
import { auditSmartContract } from '../../lib/analyzer';
import { saveAuditReport, findMostRecentAuditReport } from '../../lib/localStorage';

// Active requests tracking
const activeRequests = new Map();

// Configure Vercel serverless function timeout
export const config = {
  maxDuration: 9, // 9 seconds maximum duration for Vercel free tier (leaving 1 second buffer)
  api: {
    responseLimit: false, // Don't limit response size
    bodyParser: {
      sizeLimit: '2mb' // Increase the body size limit
    }
  }
};

// Error response with client-side suggestion
function createTimeoutResponse(address, network) {
  return {
    success: false,
    address: address || '',
    network: network || 'linea',
    contractName: "Analysis Timeout",
    contractType: "Unknown",
    analysis: {
      contractType: "Unknown",
      overview: "The analysis timed out due to contract complexity or server constraints.",
      keyFeatures: [],
      risks: [],
      securityScore: 0,
      riskLevel: "Unknown",
      explanation: "Try client-side analysis for complex contracts to avoid timeouts."
    },
    securityScore: 0,
    riskLevel: "Unknown",
    isSafe: false,
    useClientAnalysis: true,
    timestamp: new Date().toISOString()
  };
}

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request (without sensitive data)
    console.log('Analyze API called', {
      method: req.method,
      url: req.url,
      hasBody: !!req.body,
      env: {
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasEtherscanKey: !!process.env.ETHERSCAN_API_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
    let { address, network = 'linea', forceRefresh = false, useMultiAI = false, fastMode = true, vercelMode = false, skipValidation = false } = req.body;
    
    // Auto-detect Vercel deployment
    const isVercelDeployment = process.env.VERCEL || process.env.VERCEL_URL || req.headers?.host?.includes('vercel.app');
    if (isVercelDeployment) {
      console.log('Vercel deployment detected, enforcing optimized settings');
      vercelMode = true;
      skipValidation = true;
      fastMode = true;
      useMultiAI = false; // Disable multi-AI on Vercel to save time
    }
    
    // Legacy support - treat 'mainnet' as 'linea' for backward compatibility
    if (network === 'mainnet') {
      console.log('Converting legacy "mainnet" network parameter to "linea"');
      network = 'linea';
    }

    // Validate inputs
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid contract address',
        address: address || '',
        network: network,
        contractName: "Invalid Contract",
        contractType: "Invalid",
        analysis: {
          contractType: "Invalid",
          overview: "Invalid contract address provided",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown"
        },
        securityScore: 0,
        riskLevel: "Unknown",
        isSafe: false
      });
    }
    
    // Normalize address to lowercase
    address = address.toLowerCase();
    
    // NEW: Redirect Sonic network requests to ZerePy endpoint
    if (network === 'sonic') {
      try {
        // Forward to the ZerePy endpoint
        console.log('Redirecting Sonic network request to ZerePy endpoint');
        
        const zerebyResponse = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/zerebro/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            network,
            forceRefresh,
            useMultiAI,
            fastMode
          }),
        });
        
        if (!zerebyResponse.ok) {
          throw new Error(`ZerePy analysis failed with status ${zerebyResponse.status}`);
        }
        
        const zerebyResult = await zerebyResponse.json();
        return res.status(200).json(zerebyResult);
      } catch (zerebyError) {
        console.error('Error in ZerePy redirection:', zerebyError);
        // Continue with regular analysis if ZerePy fails
        console.log('Falling back to standard analysis for Sonic network');
      }
    } 
    // Handle Linea network analysis
    else if (network === 'linea') {
      // Proceed with regular analysis flow
      console.log('Performing standard analysis for Linea network');
    }
    
    // Create a unique key for this request
    const requestKey = `${address}-${network}-${useMultiAI ? 'multi' : 'single'}`;

    // Check if we already have an in-progress request for this address
    if (activeRequests.has(requestKey)) {
      console.log(`Request already in progress for ${requestKey}, waiting...`);
      // Wait for the existing request to complete
      try {
        const result = await activeRequests.get(requestKey);
        return res.status(200).json(result);
      } catch (error) {
        console.error(`Error waiting for in-progress request: ${error.message}`);
        // Continue processing as normal if waiting fails
      }
    }
    
    // Create a promise for this request
    const requestPromise = (async () => {
      try {
        // Check if we have a recent audit for this contract
        if (!forceRefresh) {
          const existingAudit = await findMostRecentAuditReport({
            address: address,
            network,
            // Only use reports from the last 7 days
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          });
          
          if (existingAudit) {
            console.log(`Found recent audit for ${address} on ${network}`);
            return {
              ...existingAudit,
              isFromCache: true,
              cachedAt: existingAudit.createdAt
            };
          }
        }
        
        // If we get here, we need to perform a new audit
        console.log(`Performing ${fastMode ? 'fast' : 'detailed'} audit for ${address} on ${network}`);

        // Set a shorter timeout for Vercel deployments
        const timeoutDuration = vercelMode ? 7000 : (fastMode ? 9000 : 15000);
        
        const timeoutPromise = new Promise((resolve) => {
          setTimeout(() => resolve(createTimeoutResponse(address, network)), timeoutDuration);
        });
        
        // Configure audit options based on environment and request
        const auditOptions = { 
          useMultiAI: !vercelMode && useMultiAI, // Disable multi-AI on Vercel to save time
          fastMode: true, // Always use fast mode 
          skipValidation: skipValidation || vercelMode, // Skip validation on Vercel
          vercelMode // Pass the Vercel flag to the analyzer
        };
        
        console.log('Using audit options:', auditOptions);
        
        // Race between analysis and timeout
        const auditResults = await Promise.race([
          auditSmartContract(address, network, auditOptions),
          timeoutPromise
        ]);
        
        // Save to local storage
        try {
          await saveAuditReport(auditResults);
          console.log(`Saved audit report for ${address} on ${network}`);
        } catch (storageError) {
          console.error('Error saving audit report to storage:', storageError);
          // Continue even if saving fails
        }
        
        // ADDED: Submit to audit API to update stats
        try {
          // Submit the audit result to update stats
          const auditSubmitResponse = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/audit/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(auditResults),
          });
          
          if (!auditSubmitResponse.ok) {
            console.error('Failed to update stats with new audit data');
          } else {
            console.log('Successfully updated stats with new audit data');
          }
        } catch (statsError) {
          console.error('Error updating stats:', statsError);
          // Continue even if stats update fails
        }
        
        return auditResults;
      } catch (error) {
        console.error('Error during audit:', error);
        throw error;
      }
    })();
    
    // Store the promise in the map
    activeRequests.set(requestKey, requestPromise);
    
    try {
      // Wait for the request to complete
      const result = await requestPromise;
      
      // Return the result
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in audit endpoint:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      
      const errorMessage = error.message || 'Unknown error occurred';
      const isTimeout = errorMessage.includes('timed out');
      
      // Return a structured error response
      return res.status(isTimeout ? 504 : 500).json({
        success: false,
        error: errorMessage,
        address: req.body.address || '',
        network: req.body.network || 'linea',
        contractName: "Error",
        contractType: "Unknown",
        analysis: {
          contractType: "Unknown",
          overview: isTimeout 
            ? "The analysis timed out. This contract may be too complex or large to analyze quickly."
            : "An error occurred during analysis",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown",
          explanation: "Error: " + errorMessage
        },
        securityScore: 0,
        riskLevel: "Unknown",
        isSafe: false
      });
    } finally {
      // Always remove the request from the map when done
      activeRequests.delete(requestKey);
    }
  } catch (error) {
    console.error('Critical error in analyze.js handler:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      address: req.body?.address || '',
      network: req.body?.network || 'linea',
      contractName: "Error",
      contractType: "Unknown",
      analysis: {
        contractType: "Unknown",
        overview: "A critical error occurred in the analysis service.",
        keyFeatures: [],
        risks: [],
        securityScore: 0,
        riskLevel: "Unknown",
        explanation: "The server encountered a critical error. Please try again later."
      },
      securityScore: 0,
      riskLevel: "Unknown",
      isSafe: false
    });
  }
}