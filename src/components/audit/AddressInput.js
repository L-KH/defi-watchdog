// src/components/audit/AddressInput.js
import { useState } from 'react';

export default function AddressInput({ 
  address, 
  network, 
  onSubmit, 
  isLoading 
}) {
  const [inputAddress, setInputAddress] = useState(address || '');
  const [inputNetwork, setInputNetwork] = useState(network || 'linea');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputAddress.trim()) {
      onSubmit(inputAddress.trim(), inputNetwork);
    }
  };

  const extractAddressFromUrl = (url) => {
    // Extract address from LineaScan or SonicScan URLs
    const patterns = [
      /address\/(0x[a-fA-F0-9]{40})/,
      /token\/(0x[a-fA-F0-9]{40})/,
      /(0x[a-fA-F0-9]{40})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return url;
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    // If it looks like a URL, try to extract the address
    if (value.includes('scan') || value.includes('http')) {
      const extractedAddress = extractAddressFromUrl(value);
      setInputAddress(extractedAddress);
      
      // Auto-detect network from URL
      if (value.includes('lineascan')) {
        setInputNetwork('linea');
      } else if (value.includes('sonicscan')) {
        setInputNetwork('sonic');
      }
    } else {
      setInputAddress(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Contract Analysis</h2>
      <p className="text-gray-600 mb-6">
        Enter a contract address or paste a LineaScan/SonicScan URL to begin security analysis
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700 mb-2">
            Contract Address or Scan URL
          </label>
          <input
            type="text"
            id="contract-address"
            placeholder="0x... or https://lineascan.build/address/0x..."
            value={inputAddress}
            onChange={handleAddressChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Supports contract addresses and URLs from LineaScan or SonicScan
          </p>
        </div>

        <div>
          <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-2">
            Network
          </label>
          <select
            id="network"
            value={inputNetwork}
            onChange={(e) => setInputNetwork(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isLoading}
          >
            <option value="linea">Linea Network</option>
            <option value="sonic">Sonic Network</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!inputAddress.trim() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading Contract...
            </div>
          ) : (
            'Load Contract'
          )}
        </button>
      </form>

      {/* Example addresses */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Example Contracts for Testing</h4>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setInputAddress('0x2d8879046f1559e53eb052e949e9544bcb72f414');
              setInputNetwork('linea');
            }}
            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
            disabled={isLoading}
          >
            Linea DEX Router (Sample): 0x2d8879046f1559e53eb052e949e9544bcb72f414
          </button>
          <button
            type="button"
            onClick={() => {
              setInputAddress('0x610d2f07b7edc67565160f587f37636194c34e74');
              setInputNetwork('linea');
            }}
            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
            disabled={isLoading}
          >
            Linea DEX Pool (Sample): 0x610d2f07b7edc67565160f587f37636194c34e74
          </button>
          <button
            type="button"
            onClick={() => {
              setInputAddress('0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13');
              setInputNetwork('sonic');
            }}
            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
            disabled={isLoading}
          >
            Sonic Swap Router (Sample): 0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          These are example contracts with sample source code for testing the scanner
        </p>
      </div>
    </div>
  );
}