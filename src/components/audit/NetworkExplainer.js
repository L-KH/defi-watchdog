// components/audit/NetworkExplainer.js
export default function NetworkExplainer() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 className="text-lg font-semibold text-blue-900 mb-3">
        🌐 Multi-Network Architecture
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🔍</span>
            <h5 className="font-semibold text-green-800">Contract Analysis</h5>
          </div>
          <p className="text-green-700 mb-2">
            <strong>Network:</strong> Linea Mainnet
          </p>
          <p className="text-green-600 text-xs">
            We analyze real smart contracts deployed on Linea mainnet using advanced security tools and AI models.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🏆</span>
            <h5 className="font-semibold text-purple-800">Certificate Minting</h5>
          </div>
          <p className="text-purple-700 mb-2">
            <strong>Network:</strong> Sepolia Testnet
          </p>
          <p className="text-purple-600 text-xs">
            NFT certificates are minted on Sepolia testnet for testing. Production will use Linea mainnet.
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-yellow-800">
          <strong>💡 Why this setup?</strong> This allows us to audit real contracts on Linea while testing the certificate system safely on Sepolia testnet. Eventually, certificates will be minted directly on Linea mainnet.
        </p>
      </div>
    </div>
  );
}
