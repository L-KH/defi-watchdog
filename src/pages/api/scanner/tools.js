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
    // Use reasonable timeout for production
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(`${SCANNER_API_BASE}/tools`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Tools info unavailable: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Tools info failed:', error.message);
    
    // Return fallback response when scanner is not available (mainly for localhost development)
    res.status(200).json({
      available_tools: {
        pattern_matcher: true,
        slither: false,
        mythril: false,
        semgrep: false,
        solhint: false
      },
      error: `Scanner unavailable (${error.message}) - This may be a localhost development issue`,
      timestamp: new Date().toISOString(),
      note: 'If this persists in production, check external scanner service'
    });
  }
}
