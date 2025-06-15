// components/audit/CertificateLimitationInfo.js
export default function CertificateLimitationInfo() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <h4 className="text-lg font-semibold text-amber-900 mb-2">
        📋 Certificate Minting Rules
      </h4>
      
      <div className="space-y-2 text-sm text-amber-800">
        <div className="flex items-start">
          <span className="mr-2">🚫</span>
          <p><strong>One Certificate Per Contract:</strong> Each contract address can only have one audit certificate (blockchain rule).</p>
        </div>
        
        <div className="flex items-start">
          <span className="mr-2">🔄</span>
          <p><strong>Smart Rotation:</strong> If your contract already has a certificate, we'll automatically find an available test contract.</p>
        </div>
        
        <div className="flex items-start">
          <span className="mr-2">🎯</span>
          <p><strong>Production Ready:</strong> This prevents spam and ensures each contract gets proper audit tracking.</p>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-amber-100 rounded-md">
        <p className="text-xs text-amber-700">
          <strong>💡 Pro Tip:</strong> To test with different contracts, audit different Linea mainnet contracts. Each unique contract address can get its own certificate!
        </p>
      </div>
    </div>
  );
}
