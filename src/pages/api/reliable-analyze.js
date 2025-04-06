// pages/api/reliable-analyze.js
import { auditSmartContract } from '../../lib/analyzer';

// Set a longer timeout for this endpoint
export const config = {
  maxDuration: 10, 
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '2mb'
    }
  }
};

/**
 * More reliable analysis API that:
 * 1. Uses the client-side approach when on Vercel
 * 2. Only attempts server analysis for short-running operations
 * 3. Provides fallback mechanisms
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, network = 'linea', method = 'auto' } = req.body;
  
  // Validate the contract address
  if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid contract address',
      clientSideAnalysisRecommended: false
    });
  }
  
  // Detect Vercel deployment
  const isVercelEnv = process.env.VERCEL || process.env.VERCEL_URL || 
                      req.headers?.host?.includes('vercel.app');
  
  try {
    // If on Vercel or user requested client analysis, recommend client analysis
    if (isVercelEnv || method === 'client') {
      return res.status(200).json({
        clientSideAnalysisRecommended: true,
        address,
        network,
        message: "For most reliable results, please use client-side analysis for this contract."
      });
    }
    
    // Perform quick analysis and return
    const startTime = Date.now();
    const analysisResult = await auditSmartContract(address, network, {
      fastMode: true,
      skipValidation: true,
      vercelMode: true
    });
    
    // Track how long it took
    analysisResult.analysisTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
    
    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Return a useful error with recommendation to use client analysis
    return res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed',
      clientSideAnalysisRecommended: true,
      address,
      network,
      message: "For more reliable analysis, please try client-side analysis for this contract."
    });
  }
}