// src/pages/api/scanner/scan.js
/**
 * API route to proxy scanner requests
 * This proxies scan requests to the external scanner API to avoid CORS issues
 */

const SCANNER_API_BASE = 'http://89.147.103.119';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, filename, tools, mode, format } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Make request to external scanner API from server side
    const response = await fetch(`${SCANNER_API_BASE}/scan-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        filename: filename || 'Contract.sol',
        tools: tools || 'all',
        mode: mode || 'balanced',
        format: format || 'json'
      }),
      // Add timeout to prevent hanging requests (compatible with older Node.js)
      ...(typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? 
        { signal: AbortSignal.timeout(60000) } : {}) // 60 seconds timeout for scans
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Scan failed with status ${response.status}`);
    }

    if (format === 'json') {
      const result = await response.json();
      res.status(200).json(result);
    } else {
      // For non-JSON responses, pipe the response
      response.body.pipe(res);
    }

  } catch (error) {
    console.error('Scanner proxy failed:', error);
    res.status(500).json({ 
      error: 'Scanner request failed', 
      details: error.message 
    });
  }
}
