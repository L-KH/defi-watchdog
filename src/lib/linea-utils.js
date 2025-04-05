/**
 * Linea Network Utilities
 * Helper utilities specifically for interacting with the Linea blockchain
 */

/**
 * Check if the provided address is a valid Linea contract address 
 * @param {string} address - The contract address to check
 * @returns {Promise<boolean>} - True if the address is a valid contract on Linea
 */
export async function isValidLineaContract(address) {
  try {
    if (!address || typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return false;
    }

    const LINEA_API_KEY = process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
    if (!LINEA_API_KEY) {
      console.warn('LineaScan API key not available, falling back to assumption that contract is valid');
      return true;
    }

    // Call LineaScan API to check if contract exists and is verified
    const url = `https://api.lineascan.build/api?module=contract&action=getsourcecode&address=${address}&apikey=${LINEA_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Check if we got a valid response
    if (data.status !== '1' || !data.result || !data.result[0]) {
      return false;
    }
    
    // Check if contract is verified
    const contractData = data.result[0];
    return !!contractData.SourceCode && contractData.SourceCode.length > 0;
  } catch (error) {
    console.error('Error checking Linea contract:', error);
    return false;
  }
}

/**
 * Get Linea contract verification status with additional details
 * @param {string} address - The contract address to check
 * @returns {Promise<object>} - Object with verification details
 */
export async function getLineaContractStatus(address) {
  try {
    if (!address || typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        exists: false,
        verified: false,
        error: 'Invalid address format'
      };
    }

    const LINEA_API_KEY = process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
    if (!LINEA_API_KEY) {
      return {
        exists: true,
        verified: false,
        error: 'LineaScan API key not available'
      };
    }

    // Call LineaScan API to check contract
    const url = `https://api.lineascan.build/api?module=contract&action=getsourcecode&address=${address}&apikey=${LINEA_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Check API response
    if (data.status !== '1') {
      return {
        exists: false,
        verified: false,
        error: data.message || 'API error'
      };
    }
    
    if (!data.result || !data.result[0]) {
      return {
        exists: false,
        verified: false,
        error: 'Contract not found'
      };
    }
    
    const contractData = data.result[0];
    const isVerified = !!contractData.SourceCode && contractData.SourceCode.length > 0;
    
    return {
      exists: true,
      verified: isVerified,
      name: contractData.ContractName || undefined,
      compiler: contractData.CompilerVersion || undefined,
      error: null
    };
  } catch (error) {
    console.error('Error checking Linea contract status:', error);
    return {
      exists: false,
      verified: false,
      error: error.message
    };
  }
}

/**
 * Check if the Linea API is available
 * @returns {Promise<boolean>} - True if the Linea API is accessible 
 */
export async function isLineaApiAvailable() {
  try {
    const LINEA_API_KEY = process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
    if (!LINEA_API_KEY) {
      return false;
    }

    // Use a known contract for testing
    const TEST_ADDRESS = '0x497ACc3197984E3a47139327ef665DA3357187c9';
    const url = `https://api.lineascan.build/api?module=contract&action=getsourcecode&address=${TEST_ADDRESS}&apikey=${LINEA_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.status === '1' && !!data.result;
  } catch (error) {
    console.error('Error checking Linea API availability:', error);
    return false;
  }
}