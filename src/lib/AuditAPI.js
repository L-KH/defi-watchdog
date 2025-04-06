// src/lib/AuditAPI.js

/**
 * Smart Contract Audit API helper functions
 * This is a unified interface for all audit-related API calls
 */

/**
 * Analyze a smart contract using the appropriate method
 * @param {string} address - Contract address
 * @param {string} network - Blockchain network
 * @param {object} options - Analysis options
 */
export async function analyzeContract(address, network = 'linea', options = {}) {
  const { method = 'server', fastMode = true, ...otherOptions } = options;
  
  console.log(`Analyzing contract ${address} on ${network} using ${method} method`);
  
  try {
    // Determine which analysis method to use
    switch (method) {
      case 'extended':
        // Use the extended analysis API with longer timeout
        return await callExtendedAnalysisAPI(address, network, otherOptions);
        
      case 'browser':
        // Use browser-based analysis through the analysis worker
        const { analyzeSecurity } = await import('./browser-analyzer');
        return await analyzeSecurity(address, network);
        
      case 'basic':
        // Use basic metadata-only analysis
        const { createFallbackAnalysis } = await import('./fallback-analyzer');
        return await createFallbackAnalysis(address, network);
      
      case 'client':
        // Use client-side analysis with DeepSeek
        const { analyzeContractClientSide } = await import('./client-analyzer');
        return await analyzeContractClientSide(address, network, otherOptions);
        
      case 'server':
      default:
        // Default to server-side analysis
        return await callServerAnalysisAPI(address, network, { fastMode, ...otherOptions });
    }
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

/**
 * Call the server-side analysis API
 */
async function callServerAnalysisAPI(address, network, options = {}) {
  const { fastMode = true, useMultiAI = false, vercelMode = false } = options;
  
  // Determine API endpoint based on network
  const apiEndpoint = network === 'sonic' ? '/api/zerebro/analyze' : '/api/analyze';
  
  // Add special parameter for Vercel deployment
  const isVercelDeploy = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
  
  // Call the API endpoint
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: address,
      network: network,
      fastMode: fastMode, 
      vercelMode: isVercelDeploy || vercelMode,
      skipValidation: isVercelDeploy || vercelMode,
      useMultiAI: useMultiAI
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API returned status ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Call the extended analysis API with longer timeout
 */
async function callExtendedAnalysisAPI(address, network, options = {}) {
  console.log('Using extended analysis API with longer timeout');
  
  // Call the extended analysis API
  const response = await fetch('/api/external-audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: address,
      network: network,
      ...options
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Extended analysis API returned status ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Run a more comprehensive multi-AI audit on a contract
 * @param {string} address - Contract address 
 * @param {string} network - Blockchain network
 */
export async function runComprehensiveAudit(address, network = 'linea') {
  console.log('Starting comprehensive multi-AI audit');
  
  try {
    // First, try the extended analysis API
    return await callExtendedAnalysisAPI(address, network, { comprehensive: true });
  } catch (error) {
    console.error('Comprehensive audit failed:', error);
    
    // Fall back to a local analysis if the API fails
    const { analyzeSecurity } = await import('./browser-analyzer');
    return await analyzeSecurity(address, network);
  }
}

/**
 * Check if extended analysis is available
 * @returns {Promise<boolean>} - Whether extended analysis is available
 */
export async function isExtendedAnalysisAvailable() {
  try {
    // Check if the extended analysis API is available
    const response = await fetch('/api/external-audit/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.available === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking extended analysis availability:', error);
    return false;
  }
}