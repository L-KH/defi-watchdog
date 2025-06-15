// src/components/debug/CertificateChecker.js
import { useState } from 'react';
import { ethers } from 'ethers';

const AUDIT_NFT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasCertificate",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118';

export default function CertificateChecker() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkCertificate = async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Validate address format
      if (!ethers.utils.isAddress(address)) {
        throw new Error('Invalid Ethereum address format');
      }
      
      // Connect to provider using MetaMask if available, otherwise skip check
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_NFT_ABI, provider);
        
        // Check if certificate exists
        const hasCert = await contract.hasCertificate(address);
        
        setResult({
          address: address,
          hasCertificate: hasCert,
          canMint: !hasCert
        });
      } else {
        // Fallback: assume can mint if no MetaMask
        setResult({
          address: address,
          hasCertificate: false,
          canMint: true,
          note: 'Cannot verify certificate status without MetaMask. Connect wallet to check.'
        });
      }
      
    } catch (error) {
      console.error('Certificate check failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTestAddress = () => {
    const timestamp = Date.now().toString(16);
    const padding = '0'.repeat(40 - timestamp.length);
    const testAddress = '0x' + timestamp + padding;
    setAddress(testAddress);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">🔍 Certificate Status Checker</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Address to Check
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x742d35Cc6634C0532925a3b8D42C5D7c5041234d"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={generateTestAddress}
              className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
            >
              Generate Test Address
            </button>
          </div>
        </div>
        
        <button
          onClick={checkCertificate}
          disabled={!address || loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check Certificate Status'}
        </button>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">❌ {error}</p>
          </div>
        )}
        
        {result && (
          <div className={`p-3 border rounded-md ${result.canMint ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <p className="font-medium text-sm mb-2">
              {result.canMint ? '✅ Can Mint Certificate' : '⚠️ Certificate Already Exists'}
            </p>
            <div className="text-xs space-y-1">
              <p><strong>Address:</strong> {result.address}</p>
              <p><strong>Has Certificate:</strong> {result.hasCertificate ? 'Yes' : 'No'}</p>
              <p><strong>Can Mint:</strong> {result.canMint ? 'Yes' : 'No'}</p>
            </div>
            {result.canMint && (
              <p className="text-green-700 text-xs mt-2">
                🎉 This address can be used for minting a new certificate!
              </p>
            )}
            {!result.canMint && (
              <p className="text-yellow-700 text-xs mt-2">
                💡 Try a different contract address or use the "Generate Test Address" button.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
