/**
 * Get the appropriate Etherscan API base URL based on the selected network
 * @param {string} network - The blockchain network name
 * @returns {string} The Etherscan API base URL
 */
/**
 * Get the appropriate Etherscan API base URL based on the selected network
 * @param {string} network - The blockchain network name
 * @returns {string} The Etherscan API base URL
 */
function getEtherscanBaseUrl(network) {
  switch (network.toLowerCase()) {
    case 'mainnet':
      return 'https://api.etherscan.io';
    case 'sonic':
      return 'https://api.sonicscan.org';
    case 'linea':
    case 'linea-mainnet':
      return 'https://api.lineascan.build';
    case 'linea-testnet':
    case 'linea-goerli':
      return 'https://api-testnet.lineascan.build';
    default:
      return 'https://api.etherscan.io';
  }
}
function adaptLineaScanResponse(data, address) {
  try {
    if (!data || !data.result || !data.result[0]) {
      console.warn('No valid data returned from LineaScan API');
      return null;
    }
    
    const contractData = data.result[0];
    console.log('LineaScan response keys:', Object.keys(contractData));
    
    return {
      address,
      sourceCode: contractData.SourceCode || '',
      contractName: contractData.ContractName || `Contract-${address.slice(0, 6)}`,
      compiler: contractData.CompilerVersion || 'Unknown',
      optimization: contractData.OptimizationUsed === '1',
      runs: contractData.Runs || '0',
      constructorArguments: contractData.ConstructorArguments || '',
      implementationAddress: contractData.Implementation || null,
      proxyType: contractData.Proxy || '0',
      isProxy: contractData.Proxy === '1',
      verifiedAt: contractData.VerifiedTimestamp 
        ? new Date(parseInt(contractData.VerifiedTimestamp) * 1000).toISOString() 
        : null
    };
  } catch (error) {
    console.error('Error adapting LineaScan response:', error);
    return null;
  }
}
/**
 * Get API key based on network (browser-compatible)
 */
async function getApiKey(network) {
  if (typeof window !== 'undefined') {
    // We're in the browser, fetch from our API endpoints
    try {
      if (network.toLowerCase() === 'sonic') {
        const response = await fetch('/api/key/sonicscan');
        if (response.ok) {
          const data = await response.json();
          return data.key;
        }
      } else if (network.toLowerCase() === 'linea') {
        const response = await fetch('/api/key/lineascan');
        if (response.ok) {
          const data = await response.json();
          return data.key;
        }
      } else {
        const response = await fetch('/api/key/etherscan');
        if (response.ok) {
          const data = await response.json();
          return data.key;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${network} API key:`, error);
      return null;
    }
  } else {
    // We're on the server, use environment variables
    if (network.toLowerCase() === 'sonic') {
      return process.env.SONICSCAN_API_KEY;
    }
    if (network.toLowerCase() === 'linea') {
      return process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
    }
    return process.env.ETHERSCAN_API_KEY;
  }
  return null;
}

/**
 * Get the Etherscan URL for a contract
 * @param {string} address - The contract address
 * @param {string} network - The blockchain network
 * @returns {string} The Etherscan URL
 */
export function getEtherscanUrl(address, network = 'mainnet') {
  let baseUrl;
  
  switch (network.toLowerCase()) {
    case 'mainnet':
      baseUrl = 'https://etherscan.io';
      break;
    case 'sonic':
      baseUrl = 'https://sonicscan.org';
      break;
    case 'linea':
      baseUrl = 'https://lineascan.build';
      break;
    default:
      baseUrl = 'https://etherscan.io';
  }
  
  return `${baseUrl}/address/${address}`;
}
/**
 * Adapts SonicScan API responses to match Etherscan format
 * @param {object} data - The API response data 
 * @param {string} address - The contract address
 * @returns {object} Normalized contract data
 */
function adaptSonicScanResponse(data, address) {
  if (!data || !data.result || !data.result[0]) {
    console.warn('No valid data returned from SonicScan API');
    return null;
  }
  
  const contractData = data.result[0];
  console.log('SonicScan response keys:', Object.keys(contractData));
  
  return {
    address,
    sourceCode: contractData.SourceCode || '',
    contractName: contractData.ContractName || `Contract-${address.slice(0, 6)}`,
    compiler: contractData.CompilerVersion || 'Unknown',
    optimization: contractData.OptimizationUsed === '1',
    runs: contractData.Runs || '0',
    constructorArguments: contractData.ConstructorArguments || '',
    implementationAddress: contractData.Implementation || null,
    proxyType: contractData.Proxy || '0',
    isProxy: contractData.Proxy === '1',
    verifiedAt: contractData.VerifiedTimestamp 
      ? new Date(parseInt(contractData.VerifiedTimestamp) * 1000).toISOString() 
      : null
  };
}

/**
 * Fetch verified contract source code from Etherscan API
 * @param {string} address - The contract address
 * @param {string} network - The blockchain network
 * @returns {Promise<object>} The contract source code and metadata
 */
export async function getContractSource(address, network = 'mainnet') {
  try {
    const apiKey = await getApiKey(network);
    if (!apiKey) {
      console.warn(`${network} API key not found. Using fallback data.`);
      return {
        address,
        sourceCode: '',
        contractName: `Contract-${address.slice(0, 6)}`,
        compiler: 'Unknown',
        optimization: false,
        runs: '0',
        constructorArguments: '',
        implementationAddress: null,
        proxyType: '0',
        isProxy: false,
        verifiedAt: null
      };
    }
    // This block was moved after API call to fix a critical bug
    const baseUrl = getEtherscanBaseUrl(network);
    const url = `${baseUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
    
    console.log(`Making API request to ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response status:', data.status);
    console.log('API response has result:', !!data.result && !!data.result[0]);
    
    // Enhanced logging for Linea network debugging
    if (network.toLowerCase() === 'linea') {
      console.log('Detailed Linea API response:', JSON.stringify(data).substring(0, 500) + '...');
    }
    
    // Check for valid API response
    if (data.status !== '1' || !data.result || !data.result[0]) {
      console.warn('API returned no data or error status', data);
      return {
        address,
        sourceCode: '',
        contractName: `Contract-${address.slice(0, 6)}`,
        compiler: 'Unknown',
        optimization: false,
        runs: '0',
        constructorArguments: '',
        implementationAddress: null,
        proxyType: '0',
        isProxy: false,
        verifiedAt: null
      };
    }
    
    // Handle Sonic network specifically
    if (network.toLowerCase() === 'sonic') {
      console.log('Processing SonicScan API response');
      const adaptedData = adaptSonicScanResponse(data, address);
      if (adaptedData) {
        return adaptedData;
      }
    }
    
    // Handle Linea network specifically
    if (network.toLowerCase() === 'linea') {
      console.log('Processing LineaScan API response');
      const adaptedData = adaptLineaScanResponse(data, address);
      if (adaptedData) {
        return adaptedData;
      }
    }
    
    // Process standard Etherscan response
    const contractData = data.result[0];
    
    if (!contractData.SourceCode && !contractData.sourceCode) {
      console.warn('Contract not verified or no source code available');
      return {
        address,
        sourceCode: '',
        contractName: contractData.ContractName || `Contract-${address.slice(0, 6)}`,
        compiler: contractData.CompilerVersion || 'Unknown',
        optimization: contractData.OptimizationUsed === '1',
        runs: contractData.Runs || '0',
        constructorArguments: contractData.ConstructorArguments || '',
        implementationAddress: contractData.Implementation || null,
        proxyType: contractData.Proxy || '0',
        isProxy: contractData.Proxy === '1',
        verifiedAt: contractData.VerifiedTimestamp 
          ? new Date(parseInt(contractData.VerifiedTimestamp) * 1000).toISOString() 
          : null
      };
    }
    
    // Process source code based on how it's stored in Etherscan
    let sourceCode = contractData.SourceCode || '';
    
    // Handle Etherscan's special JSON format for multi-file contracts
    if (sourceCode.startsWith('{') && sourceCode.includes('sources')) {
      try {
        // Some contracts have double-encoded JSON
        if (sourceCode.startsWith('{{')) {
          sourceCode = sourceCode.substring(1, sourceCode.length - 1);
        }
        
        const parsed = JSON.parse(sourceCode);
        
        // Get the main contract file or concatenate all files
        if (parsed.sources) {
          const sources = Object.values(parsed.sources)
            .map(source => source.content || '')
            .filter(content => content.length > 0);
          
          sourceCode = sources.join('\n\n// Next Contract File\n\n');
        }
      } catch (err) {
        console.error('Error parsing multi-file contract:', err);
        // Continue with raw sourceCode if parsing fails
      }
    }
    
    return {
      address,
      sourceCode,
      contractName: contractData.ContractName || `Contract-${address.slice(0, 6)}`,
      compiler: contractData.CompilerVersion || 'Unknown',
      optimization: contractData.OptimizationUsed === '1',
      runs: contractData.Runs || '0',
      constructorArguments: contractData.ConstructorArguments || '',
      implementationAddress: contractData.Implementation || null,
      proxyType: contractData.Proxy || '0',
      isProxy: contractData.Proxy === '1',
      verifiedAt: contractData.VerifiedTimestamp 
        ? new Date(parseInt(contractData.VerifiedTimestamp) * 1000).toISOString() 
        : null
    };
  } catch (error) {
    console.error('Error fetching contract source:', error);
    // Return fallback data instead of throwing
    return {
      address,
      sourceCode: '',
      contractName: `Contract-${address.slice(0, 6)}`,
      compiler: 'Unknown',
      optimization: false,
      runs: '0',
      constructorArguments: '',
      implementationAddress: null,
      proxyType: '0',
      isProxy: false,
      verifiedAt: null
    };
  }
}

/**
 * Get basic contract information without full source code
 * @param {string} address - The contract address
 * @param {string} network - The blockchain network
 * @returns {Promise<object>} Basic contract information
 */
export async function getContractInfo(address, network = 'mainnet') {
  try {
    const apiKey = await getApiKey(network);
    if (!apiKey) {
      return {
        address,
        hasVerifiedCode: false,
        abi: null,
        creator: null,
        createdAt: null,
        txHash: null
      };
    }
    
    const baseUrl = getEtherscanBaseUrl(network);
    
    // Get contract ABI
    const abiUrl = `${baseUrl}/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
    const abiResponse = await fetch(abiUrl);
    const abiData = await abiResponse.json();
    
    // Get contract creation info
    const creationUrl = `${baseUrl}/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${apiKey}`;
    const creationResponse = await fetch(creationUrl);
    const creationData = await creationResponse.json();
    
    return {
      address,
      hasVerifiedCode: abiData.status === '1',
      abi: abiData.status === '1' ? abiData.result : null,
      creator: creationData.status === '1' && creationData.result && creationData.result[0] 
        ? creationData.result[0].contractCreator 
        : null,
      createdAt: creationData.status === '1' && creationData.result && creationData.result[0] 
        ? new Date(parseInt(creationData.result[0].timestamp) * 1000).toISOString()
        : null,
      txHash: creationData.status === '1' && creationData.result && creationData.result[0]
        ? creationData.result[0].txHash
        : null
    };
  } catch (error) {
    console.error('Error fetching contract info:', error);
    return {
      address,
      hasVerifiedCode: false,
      abi: null,
      creator: null,
      createdAt: null,
      txHash: null
    };
  }
}

/**
 * Get the Etherscan URL for a contract
 * @param {string} address - The contract address
 * @param {string} network - The blockchain network
 * @returns {string} The Etherscan URL
 */
