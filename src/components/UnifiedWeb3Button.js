import { useState, useEffect } from 'react';
import { useEnhancedWeb3 } from '../hooks/useEnhancedWeb3';

export default function UnifiedWeb3Button({ 
  showBalance = false, 
  showChain = true,
  size = 'default', // 'small', 'default', 'large'
  variant = 'default' // 'default', 'minimal', 'compact'
}) {
  const { isCorrectNetwork, switchToSepolia } = useEnhancedWeb3();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Check wallet connection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check initial connection
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        })
        .catch(console.error);

      // Get chain ID
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => {
          setChainId(parseInt(chainId, 16));
        })
        .catch(console.error);

      // Listen for changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      };

      const handleChainChanged = (chainId) => {
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);
  
  // Different styling based on size and variant
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm px-3 py-2';
      case 'large':
        return 'text-lg px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'compact':
        return 'bg-gray-100 border border-gray-200 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white';
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch network
  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToSepolia();
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  // Disconnect (simulate)
  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 11155111: return 'Sepolia';
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      default: return 'Unknown';
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        type="button"
        className={`
          ${getSizeClasses()} 
          ${getVariantClasses()}
          font-medium rounded-xl transition-all duration-200 
          flex items-center gap-2 shadow-lg hover:shadow-xl 
          transform hover:-translate-y-0.5 disabled:transform-none
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  // Wrong network state
  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSwitchNetwork}
          disabled={isSwitching}
          type="button"
          className={`
            ${getSizeClasses()}
            bg-gradient-to-r from-yellow-500 to-orange-500 
            hover:from-yellow-600 hover:to-orange-600 
            text-white font-medium rounded-xl transition-all duration-200 
            flex items-center gap-2 shadow-lg hover:shadow-xl
            ${isSwitching ? 'animate-pulse cursor-not-allowed' : 'transform hover:-translate-y-0.5'}
            focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
          `}
        >
          {isSwitching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Switching...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Switch to Sepolia
            </>
          )}
        </button>
      </div>
    );
  }
  
  // Connected state
  return (
    <div className="flex items-center gap-3">
      {/* Network indicator (if enabled and not compact) */}
      {showChain && variant !== 'compact' && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">
            {getNetworkName()}
          </span>
        </div>
      )}
      
      {/* Account button */}
      <div className="relative group">
        <button
          type="button"
          className={`
            ${getSizeClasses()}
            bg-white border-2 border-gray-200 hover:border-purple-300 
            rounded-xl flex items-center gap-3 transition-all duration-200 
            group hover:shadow-md text-gray-700 hover:text-gray-900
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          `}
        >
          {/* Avatar */}
          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex-shrink-0"></div>
          
          {/* Account info */}
          <div className="flex flex-col items-start min-w-0">
            <div className="text-sm text-gray-500 font-mono">
              {formatAddress(address)}
            </div>
          </div>
          
          {/* Dropdown arrow */}
          <svg 
            className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Simple dropdown on hover */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">Connected</div>
            <div className="text-xs text-gray-500 font-mono">{formatAddress(address)}</div>
          </div>
          <div className="p-2">
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}