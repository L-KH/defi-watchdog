// pages/api/external-audit/index.js
import { analyzeWithExternalServer } from '../../../lib/external-audit';

// Export config for custom timeout - API will run for up to 60 seconds (far beyond Vercel's limit)
export const config = {
  maxDuration: 60,
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
};

/**
 * External audit endpoint with extended timeout
 * This API endpoint acts as a bridge to an external analysis server
 * that can process large contracts without the Vercel timeout limitations
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, network = 'linea', comprehensive = false } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Contract address is required' });
    }

    console.log(`Starting extended analysis for ${address} on ${network}`);

    // Start analysis with external server
    const analysis = await analyzeWithExternalServer(address, network, { comprehensive });

    // Return analysis results
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('External audit failed:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'External audit failed',
      address: req.body?.address,
      network: req.body?.network || 'linea'
    });
  }
}