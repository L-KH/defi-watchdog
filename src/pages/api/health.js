export default async function handler(req, res) {
  try {
    // Check API keys
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasEtherscanKey = !!process.env.ETHERSCAN_API_KEY;
    const hasLineaScanKey = !!process.env.LINEASCAN_API_KEY;
    const hasSonicScanKey = !!process.env.SONICSCAN_API_KEY;
    const hasDeepseekKey = !!process.env.DEEPSEEK_API_KEY;
    
    // Check API endpoints
    const networkStatuses = {};
    
    // Check Linea API if key is available
    if (hasLineaScanKey || hasEtherscanKey) {
      try {
        const LINEA_API_KEY = process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
        const TEST_ADDRESS = '0x497ACc3197984E3a47139327ef665DA3357187c9';
        const url = `https://api.lineascan.build/api?module=contract&action=getsourcecode&address=${TEST_ADDRESS}&apikey=${LINEA_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        networkStatuses.linea = data.status === '1' ? "Operational" : "Degraded";
      } catch (lineaError) {
        networkStatuses.linea = `Error: ${lineaError.message}`;
      }
    } else {
      networkStatuses.linea = "API key not configured";
    }
    
    // Check Sonic API if key is available
    if (hasSonicScanKey) {
      try {
        const TEST_ADDRESS = '0xd62b2debf594f2543f43672aa4f809038192180d';
        const url = `https://api.sonicscan.org/api?module=contract&action=getsourcecode&address=${TEST_ADDRESS}&apikey=${process.env.SONICSCAN_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        networkStatuses.sonic = data.status === '1' ? "Operational" : "Degraded";
      } catch (sonicError) {
        networkStatuses.sonic = `Error: ${sonicError.message}`;
      }
    } else {
      networkStatuses.sonic = "API key not configured";
    }
    
    res.status(200).json({
      status: "healthy",
      message: "System status check completed",
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasOpenAI: hasOpenAIKey,
        hasEtherscan: hasEtherscanKey,
        hasLineaScan: hasLineaScanKey,
        hasSonicScan: hasSonicScanKey,
        hasDeepseek: hasDeepseekKey
      },
      networks: networkStatuses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}