// src/pages/api/scanner/health.js
/**
 * API route to check scanner health status
 * This proxies requests to the external scanner API to avoid CORS issues
 */

const SCANNER_API_BASE = 'http://89.147.103.119';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Make request to external scanner API from server side
    const response = await fetch(`${SCANNER_API_BASE}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging requests (compatible with older Node.js)
      ...(typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? 
        { signal: AbortSignal.timeout(10000) } : {})
    });

    if (!response.ok) {
      throw new Error(`Scanner API unavailable: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the scanner health data
    res.status(200).json({
      status: 'healthy',
      service: 'Scanner API',
      version: data.version || 'Unknown',
      available_tools: data.available_tools || {},
      timestamp: new Date().toISOString(),
      ...data
    });

  } catch (error) {
    console.error('Scanner health check failed:', error);
    
    // Return fallback response when scanner is not available
    res.status(200).json({
      status: 'error',
      service: 'Scanner API',
      version: 'Unknown',
      error: error.message,
      available_tools: {
        pattern_matcher: true,
        slither: false,
        mythril: false,
        semgrep: false,
        solhint: false
      },
      timestamp: new Date().toISOString()
    });
  }
}
