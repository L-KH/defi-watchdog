import { useState, useEffect } from 'react';
import { useEnhancedWeb3 } from '../hooks/useEnhancedWeb3';
import UnifiedWeb3Button from './UnifiedWeb3Button';

export default function EnhancedAuditPayment({ 
  contractAddress, 
  contractName, 
  onPaymentSuccess,
  onPaymentError 
}) {
  const [isConnected, setIsConnected] = useState(false);
  
  // Check wallet connection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          setIsConnected(accounts.length > 0);
        })
        .catch(console.error);

      const handleAccountsChanged = (accounts) => {
        setIsConnected(accounts.length > 0);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const { 
    isCorrectNetwork, 
    payForAudit, 
    isProcessing, 
    CONTRACT_ADDRESS,
    AUDIT_PRICE 
  } = useEnhancedWeb3();
  
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const handlePayment = async () => {
    if (!contractAddress) {
      setErrorMessage('Contract address is required');
      return;
    }
    
    try {
      setPaymentStatus('processing');
      setErrorMessage('');
      
      console.log('🚀 Starting payment process...');
      
      const result = await payForAudit(contractAddress, contractName);
      
      if (result.success) {
        setPaymentStatus('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(result);
        }
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message);
      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };
  
  // If no contract address configured, show free mode
  if (!CONTRACT_ADDRESS) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <span className="text-2xl text-white">🆓</span>
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Free Analysis Mode</h3>
          <p className="text-green-700 mb-4">
            Complete security analysis with no payment required
          </p>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">Ready to analyze your contract</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If payment was successful
  if (paymentStatus === 'success') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <span className="text-2xl text-white">✅</span>
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Payment Successful!</h3>
          <p className="text-green-700 mb-4">
            Your audit has been paid for and will begin shortly
          </p>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center text-green-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-3"></div>
              <span className="font-medium">Starting comprehensive analysis...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
          <span className="text-2xl text-white">💎</span>
        </div>
        <h3 className="text-xl font-bold text-purple-900 mb-2">Premium Security Audit</h3>
        <p className="text-purple-700">
          Comprehensive analysis with 9 security tools + professional reporting
        </p>
      </div>
      
      {/* Pricing */}
      <div className="bg-white rounded-xl p-4 border border-purple-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Audit Price</p>
            <p className="text-2xl font-bold text-gray-900">{AUDIT_PRICE} ETH</p>
            <p className="text-xs text-gray-500">+ network gas fees</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Network</p>
            <p className="font-semibold text-purple-600">Sepolia Testnet</p>
            <p className="text-xs text-gray-500">Free test ETH available</p>
          </div>
        </div>
      </div>
      
      {/* Connection Status */}
      {!isConnected ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Connect your wallet to proceed with payment</p>
          <UnifiedWeb3Button size="large" />
        </div>
      ) : !isCorrectNetwork ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Switch to Sepolia network to continue</p>
          <UnifiedWeb3Button size="large" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || paymentStatus === 'processing'}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
              transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
              ${isProcessing || paymentStatus === 'processing'
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              }
            `}
          >
            {isProcessing || paymentStatus === 'processing' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2">💳</span>
                Pay {AUDIT_PRICE} ETH & Start Analysis
              </div>
            )}
          </button>
          
          {/* Error Display */}
          {paymentStatus === 'error' && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-red-500 text-xl mr-3">⚠️</span>
                <div>
                  <p className="font-semibold text-red-800 mb-1">Payment Failed</p>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                  <button
                    onClick={() => {
                      setPaymentStatus('idle');
                      setErrorMessage('');
                    }}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🔒 Secure Payment Process</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Payment processed directly through smart contract</li>
              <li>• Your wallet will prompt for transaction confirmation</li>
              <li>• Analysis begins immediately after payment confirmation</li>
              <li>• Get free Sepolia ETH from faucets if needed</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}