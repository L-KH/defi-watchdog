/**
 * Optimized Etherscan API Integration with Rate Limiting and Caching
 * Prevents multiple concurrent requests and handles rate limits properly
 */

// In-memory cache to prevent duplicate requests
const requestCache = new Map();
const pendingRequests = new Map();

// Rate limiting
const RATE_LIMIT_DELAY = 250; // 250ms between requests (4 requests per second)
let lastRequestTime = 0;

/**
 * Rate limited fetch function
 */
async function rateLimitedFetch(url, options = {}) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
  return fetch(url, options);
}

/**
 * Get the appropriate Etherscan API base URL based on the selected network
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

/**
 * Get API key based on network (server-side only for security)
 */
function getApiKey(network) {
  if (network.toLowerCase() === 'sonic') {
    return process.env.SONICSCAN_API_KEY;
  }
  if (network.toLowerCase() === 'linea') {
    return process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
  }
  return process.env.ETHERSCAN_API_KEY;
}

/**
 * Adapt API responses to a consistent format
 */
function adaptApiResponse(data, address, network) {
  try {
    if (!data || !data.result || !data.result[0]) {
      console.warn(`No valid data returned from ${network} API`);
      return null;
    }
    
    const contractData = data.result[0];
    
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
    console.error(`Error adapting ${network} response:`, error);
    return null;
  }
}

/**
 * Process multi-file contract source code
 */
function processSourceCode(sourceCode) {
  if (!sourceCode) return '';
  
  // Handle Etherscan's special JSON format for multi-file contracts
  if (sourceCode.startsWith('{') && sourceCode.includes('sources')) {
    try {
      // Some contracts have double-encoded JSON
      let jsonStr = sourceCode;
      if (sourceCode.startsWith('{{')) {
        jsonStr = sourceCode.substring(1, sourceCode.length - 1);
      }
      
      const parsed = JSON.parse(jsonStr);
      
      // Get the main contract file or concatenate all files
      if (parsed.sources) {
        const sources = Object.entries(parsed.sources);
        
        // Priority order: try to find main contract files first
        const prioritizedSources = [];
        const importSources = [];
        
        for (const [filename, source] of sources) {
          const content = source.content || '';
          if (content.length === 0) continue;
          
          // Check if this looks like a main contract (has contract definition, not just imports/interfaces)
          const hasContractDefinition = /contract\s+\w+\s*(?:is\s+[\w,\s]+)?\s*\{[\s\S]*\}/m.test(content);
          const hasConstructor = /constructor\s*\([^\)]*\)/.test(content);
          const hasMainFunctions = /function\s+\w+\s*\([^\)]*\)/.test(content);
          const isInterface = /interface\s+\w+/.test(content);
          const isLibrary = /library\s+\w+/.test(content);
          const isOpenZeppelinImport = filename.includes('@openzeppelin') || filename.includes('node_modules') || content.includes('// OpenZeppelin');
          
          if (hasContractDefinition && (hasConstructor || hasMainFunctions) && !isInterface && !isLibrary && !isOpenZeppelinImport) {
            // This looks like a main contract
            prioritizedSources.unshift(`// File: ${filename}\n\n${content}`);
          } else if (!isOpenZeppelinImport) {
            // This is likely a custom contract or interface
            prioritizedSources.push(`// File: ${filename}\n\n${content}`);
          } else {
            // This is an import/library - add at the end
            importSources.push(`// File: ${filename}\n\n${content}`);
          }
        }
        
        // Combine with main contracts first, then imports
        const allSources = [...prioritizedSources, ...importSources].filter(content => content.length > 0);
        
        if (allSources.length === 0) {
          console.warn('No valid source files found in multi-file contract');
          return sourceCode; // Return original if parsing fails
        }
        
        console.log(`Processed multi-file contract: ${prioritizedSources.length} main files, ${importSources.length} imports`);
        return allSources.join('\n\n// ========================================\n\n');
      }
    } catch (err) {
      console.error('Error parsing multi-file contract:', err);
      // Continue with raw sourceCode if parsing fails
    }
  }
  
  return sourceCode;
}

/**
 * Create fallback contract data
 */
function createFallbackData(address, network) {
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
    verifiedAt: null,
    network,
    error: 'Contract source code not available'
  };
}

/**
 * Fetch verified contract source code with caching and rate limiting
 */
export async function getContractSource(address, network = 'linea') {
  // Create cache key
  const cacheKey = `${network}-${address.toLowerCase()}`;
  
  // Check cache first
  if (requestCache.has(cacheKey)) {
    console.log('Returning cached result for', address);
    return requestCache.get(cacheKey);
  }
  
  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    console.log('Waiting for pending request for', address);
    return pendingRequests.get(cacheKey);
  }
  
  // Create the request promise
  const requestPromise = async () => {
    try {
      const apiKey = getApiKey(network);
      
      if (!apiKey) {
        console.warn(`${network} API key not found`);
        const fallback = createFallbackData(address, network);
        requestCache.set(cacheKey, fallback);
        return fallback;
      }
      
      const baseUrl = getEtherscanBaseUrl(network);
      const url = `${baseUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
      
      console.log(`Making API request to ${network} for ${address}`);
      
      const response = await rateLimitedFetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle rate limiting response
      if (data.status === '0' && data.message && data.message.includes('rate limit')) {
        console.warn('Rate limit hit, waiting and retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retry once
        const retryResponse = await rateLimitedFetch(url);
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          if (retryData.status === '1') {
            data.status = retryData.status;
            data.result = retryData.result;
          }
        }
      }
      
      // Check for valid API response
      if (data.status !== '1' || !data.result || !data.result[0]) {
        console.warn('API returned no data or error status:', data.message || 'Unknown error');
        const fallback = createFallbackData(address, network);
        requestCache.set(cacheKey, fallback);
        return fallback;
      }
      
      // Process the response
      const adaptedData = adaptApiResponse(data, address, network);
      
      if (!adaptedData) {
        const fallback = createFallbackData(address, network);
        requestCache.set(cacheKey, fallback);
        return fallback;
      }
      
      // Process source code
      adaptedData.sourceCode = processSourceCode(adaptedData.sourceCode);
      adaptedData.network = network;
      
      // Cache the result
      requestCache.set(cacheKey, adaptedData);
      
      console.log(`Successfully fetched contract ${address} from ${network}`);
      return adaptedData;
      
    } catch (error) {
      console.error('Error fetching contract source:', error);
      const fallback = createFallbackData(address, network);
      fallback.error = error.message;
      requestCache.set(cacheKey, fallback);
      return fallback;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  };
  
  // Store the promise in pending requests
  const promise = requestPromise();
  pendingRequests.set(cacheKey, promise);
  
  return promise;
}

/**
 * Get the Etherscan URL for a contract
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
 * Clear cache (useful for development)
 */
export function clearCache() {
  requestCache.clear();
  pendingRequests.clear();
  console.log('API cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    cached: requestCache.size,
    pending: pendingRequests.size
  };
}
