// pages/api/linea-health.js
export default async function handler(req, res) {
  try {
    // Get the API key from environment variables
    const LINEASCAN_API_KEY = process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
    
    if (!LINEASCAN_API_KEY) {
      return res.status(500).json({
        status: "error",
        message: "LineaScan API key not configured",
        checks: {
          apiKey: false,
          apiConnection: false
        }
      });
    }
    
    // Check if the LineaScan API is accessible
    const TEST_ADDRESS = '0x497ACc3197984E3a47139327ef665DA3357187c9'; // Test address (contract on Linea)
    const url = `https://api.lineascan.build/api?module=contract&action=getsourcecode&address=${TEST_ADDRESS}&apikey=${LINEASCAN_API_KEY}`;
    
    console.log(`Testing LineaScan API connection...`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('LineaScan API response status:', data.status);
    console.log('LineaScan API has result:', !!data.result);
    
    // Verify if we got a valid response
    const hasValidResponse = data.status === '1' && data.result && data.result.length > 0;
    
    return res.status(200).json({
      status: "success",
      message: hasValidResponse ? "LineaScan API is responsive" : "LineaScan API response is invalid",
      checks: {
        apiKey: true,
        apiConnection: hasValidResponse
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("LineaScan health check failed:", error);
    
    return res.status(500).json({
      status: "error",
      message: `LineaScan health check failed: ${error.message}`,
      checks: {
        apiKey: true,
        apiConnection: false
      },
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}