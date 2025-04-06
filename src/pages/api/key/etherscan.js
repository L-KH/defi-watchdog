// pages/api/key/etherscan.js
export default function handler(req, res) {
  try {
    // Return the Etherscan API key from environment variables
    const apiKey = process.env.ETHERSCAN_API_KEY;
    
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }
    
    return res.status(200).json({ key: apiKey });
  } catch (error) {
    console.error('Error retrieving Etherscan API key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}