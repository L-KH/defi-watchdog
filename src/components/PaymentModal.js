import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, contractInfo }) {
  const [step, setStep] = useState('payment'); // payment, processing, success, error
  const [account, setAccount] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const PAYMENT_AMOUNT = '0.003'; // ETH
  const PAYMENT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS || '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118';

  useEffect(() => {
    if (isOpen) {
      checkWalletConnection();
    }
  }, [isOpen]);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask to continue.');
      return false;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        return true;
      }
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
      return false;
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setStep('processing');

      // Connect wallet if not connected
      if (!account) {
        const connected = await connectWallet();
        if (!connected) {
          setStep('error');
          return;
        }
      }

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') { // Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        } catch (switchError) {
          setError('Please switch to Sepolia network');
          setStep('error');
          return;
        }
      }

      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Check balance
      const balance = await provider.getBalance(account);
      const requiredAmount = ethers.utils.parseEther(PAYMENT_AMOUNT);
      const requiredWithGas = requiredAmount.add(ethers.utils.parseEther('0.001')); // Add gas buffer

      if (balance.lt(requiredWithGas)) {
        setError(`Insufficient balance. You need at least ${ethers.utils.formatEther(requiredWithGas)} ETH`);
        setStep('error');
        return;
      }

      // Send payment
      const tx = await signer.sendTransaction({
        to: PAYMENT_ADDRESS,
        value: requiredAmount,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(
          JSON.stringify({
            type: 'audit_pro_payment',
            contract: contractInfo?.address || 'unknown',
            timestamp: Date.now()
          })
        ))
      });

      setTxHash(tx.hash);
      console.log('Payment transaction sent:', tx.hash);

      // Wait for confirmation
      await tx.wait();
      
      setStep('success');
      
      // Store payment in localStorage
      const paymentData = {
        txHash: tx.hash,
        amount: PAYMENT_AMOUNT,
        timestamp: Date.now(),
        contract: contractInfo?.address,
        network: 'sepolia'
      };
      
      localStorage.setItem(`payment_${tx.hash}`, JSON.stringify(paymentData));
      
      // Notify parent component
      setTimeout(() => {
        onPaymentComplete(paymentData);
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      setError(error.message || 'Payment failed');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Premium AI Analysis Payment</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'payment' && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Unlock Premium AI Analysis
                </h3>
                <p className="text-gray-600">
                  Get comprehensive security analysis with 6+ AI models
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Analysis Fee:</span>
                  <span className="text-2xl font-bold text-purple-600">{PAYMENT_AMOUNT} ETH</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• 6+ Premium AI Models</div>
                  <div>• Supervisor Verification</div>
                  <div>• Professional Reports</div>
                  <div>• NFT Certificate Included</div>
                </div>
              </div>

              {account && (
                <div className="text-sm text-gray-600 mb-4">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                {account ? 'Pay & Start Analysis' : 'Connect Wallet & Pay'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Payment will be sent to: {PAYMENT_ADDRESS.slice(0, 10)}...
              </p>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Payment...
              </h3>
              <p className="text-gray-600">
                Please confirm the transaction in MetaMask
              </p>
              {txHash && (
                <p className="text-sm text-gray-500 mt-2">
                  TX: {txHash.slice(0, 20)}...
                </p>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                Starting premium AI analysis...
              </p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View transaction →
              </a>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-red-600 mb-4">
                {error}
              </p>
              <button
                onClick={() => setStep('payment')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
