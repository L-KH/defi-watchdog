// pages/api/external-audit/status.js

/**
 * API endpoint to check if extended analysis service is available
 */
export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if DeepSeek API is configured
    const hasDeepseekKey = !!process.env.DEEPSEEK_API_KEY;
    
    // For now, we'll assume the service is available if the DeepSeek API key is set
    // In a production environment, you might want to ping the actual service
    const isAvailable = hasDeepseekKey;
    
    return res.status(200).json({
      available: isAvailable,
      serviceType: isAvailable ? 'deepseek' : null,
      maxContractSize: isAvailable ? 100000 : 0
    });
  } catch (error) {
    console.error('Error checking external audit status:', error);
    
    return res.status(500).json({
      available: false,
      error: error.message || 'Failed to check external audit status'
    });
  }
}