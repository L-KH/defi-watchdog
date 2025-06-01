// src/components/audit/ApiSetupGuide.js
import { useState } from 'react';

export default function ApiSetupGuide({ network, error }) {
  const [showDetailed, setShowDetailed] = useState(false);

  const getNetworkInfo = (network) => {
    const networks = {
      linea: {
        name: 'LineaScan',
        url: 'https://lineascan.build/apis',
        envVar: 'LINEASCAN_API_KEY',
        example: 'LSK_1234567890abcdef...'
      },
      sonic: {
        name: 'SonicScan', 
        url: 'https://sonicscan.org/apis',
        envVar: 'SONICSCAN_API_KEY',
        example: 'SSK_abcdef1234567890...'
      },
      mainnet: {
        name: 'Etherscan',
        url: 'https://etherscan.io/apis',
        envVar: 'ETHERSCAN_API_KEY',
        example: 'YourEtherscanAPIKey'
      }
    };
    return networks[network?.toLowerCase()] || networks.linea;
  };

  const networkInfo = getNetworkInfo(network);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔧 API Setup Required
          </h3>
          <p className="text-yellow-700 mb-4">
            To analyze {network} contracts, you need a free API key from {networkInfo.name}. This takes about 2 minutes to set up.
          </p>
          
          <div className="space-y-4">
            {/* Quick Setup */}
            <div className="bg-white p-4 rounded-md border">
              <h4 className="font-medium mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">Quick Setup</span>
                Get {networkInfo.name} API Key
              </h4>
              
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Visit{' '}
                  <a 
                    href={networkInfo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {networkInfo.url}
                  </a>
                </li>
                <li>Create a free account and verify your email</li>
                <li>Generate an API key (name it &quot;DeFi Watchdog&quot;)</li>
                <li>Copy the API key</li>
              </ol>
            </div>

            {/* Environment Setup */}
            <div className="bg-white p-4 rounded-md border">
              <h4 className="font-medium mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-2">Step 2</span>
                Add to Environment File
              </h4>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Create or update <code className="bg-gray-100 px-1 rounded">.env.local</code> in your project root:
                </p>
                
                <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
                  <div className="text-gray-500"># Add this line to .env.local</div>
                  <div className="text-green-400">{networkInfo.envVar}=</div>
                  <div className="text-yellow-400 ml-4"># Paste your API key here (without quotes)</div>
                  <div className="text-blue-400 mt-2"># Example:</div>
                  <div className="text-green-400">{networkInfo.envVar}={networkInfo.example}</div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Then restart your development server: <code className="bg-gray-100 px-1 rounded">npm run dev</code>
                </p>
              </div>
            </div>

            {/* Show detailed guide toggle */}
            <button
              onClick={() => setShowDetailed(!showDetailed)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              {showDetailed ? 'Hide' : 'Show'} detailed setup guide
            </button>

            {/* Detailed Setup */}
            {showDetailed && (
              <div className="bg-white p-4 rounded-md border border-blue-200">
                <h4 className="font-medium mb-3 text-blue-800">
                  📖 Detailed Setup Instructions
                </h4>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Why API Keys Are Needed</h5>
                    <p className="text-gray-600">
                      DeFi Watchdog fetches verified smart contract source code from blockchain explorers. 
                      These services require free API keys to prevent abuse and ensure reliable service.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">File Structure</h5>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                      your-project/<br/>
                      ├── .env.local          ← Create this file<br/>
                      ├── .env.example        ← Template file<br/>
                      ├── src/<br/>
                      └── package.json
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Multiple Networks</h5>
                    <p className="text-gray-600 mb-2">
                      For full functionality, add API keys for all networks:
                    </p>
                    <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                      LINEASCAN_API_KEY=your_linea_key<br/>
                      SONICSCAN_API_KEY=your_sonic_key<br/>
                      DEEPSEEK_API_KEY=your_ai_key     # Optional
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Troubleshooting</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Ensure .env.local is in the project root directory</li>
                      <li>Variable names must match exactly (case-sensitive)</li>
                      <li>No quotes needed around the API key value</li>
                      <li>Restart the dev server after making changes</li>
                      <li>Check browser console (F12) for specific error messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error Details */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <h5 className="font-medium text-red-800 mb-1">Current Error:</h5>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
