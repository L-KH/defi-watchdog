// Debug API for checking environment variables
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables (but don't expose the full keys)
  const envCheck = {
    OPENROUTER_API_KEY: {
      exists: !!process.env.OPENROUTER_API_KEY,
      length: process.env.OPENROUTER_API_KEY?.length || 0,
      prefix: process.env.OPENROUTER_API_KEY?.substring(0, 12) + '...' || 'undefined'
    },
    LINEASCAN_API_KEY: {
      exists: !!process.env.LINEASCAN_API_KEY,
      length: process.env.LINEASCAN_API_KEY?.length || 0
    },
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  return res.status(200).json({
    message: 'Environment variables check',
    environment: envCheck
  });
}
