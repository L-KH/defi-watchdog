// pages/api/key/deepseek.js

export default function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Return the API key from environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }
    
    // Return the API key to the client
    return res.status(200).json({ key: apiKey });
  } catch (error) {
    console.error('Error retrieving DeepSeek API key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}