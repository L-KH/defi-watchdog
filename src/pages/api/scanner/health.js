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
    // Use a reasonable timeout for production while being more lenient for development
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(`${SCANNER_API_BASE}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    console.error('Scanner health check failed:', error.message);
    
    // Return fallback response when scanner is not available (mainly for localhost development)
    res.status(200).json({
      status: 'offline',
      service: 'Scanner API',
      version: 'Unknown',
      error: `Scanner unavailable (${error.message}) - This may be a localhost development issue`,
      available_tools: {
        pattern_matcher: true,
        slither: false,
        mythril: false,
        semgrep: false,
        solhint: false
      },
      timestamp: new Date().toISOString(),
      note: 'If this persists in production, check external scanner service'
    });
  }
}
