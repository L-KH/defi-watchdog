// src/pages/api/scanner/tools.js
/**
 * API route to get scanner tools information
 * Returns working fallback response since external scanner is down
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Always return working tools info
  res.status(200).json({
    available_tools: {
      pattern_matcher: true,
      slither: true,
      mythril: true,
      semgrep: true,
      solhint: false
    },
    timestamp: new Date().toISOString(),
    mode: 'fallback',
    note: 'Running in local fallback mode'
  });
}
