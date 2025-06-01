// src/pages/api/scanner/tools.js
/**
 * API route to get scanner tools information
 * This proxies requests to the external scanner API to avoid CORS issues
 */

const SCANNER_API_BASE = 'http://89.147.103.119';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Make request to external scanner API from server side
    const response = await fetch(`${SCANNER_API_BASE}/tools`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
    });

    if (!response.ok) {
      throw new Error(`Tools info unavailable: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Tools info failed:', error);
    
    // Return fallback response when scanner is not available
    res.status(200).json({
      available_tools: {
        pattern_matcher: true,
        slither: false,
        mythril: false,
        semgrep: false,
        solhint: false
      },
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
