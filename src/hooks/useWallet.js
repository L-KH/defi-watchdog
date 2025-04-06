import { useContext, useCallback } from 'react';
import { WalletContext } from '../context/WalletContext';

/**
 * Enhanced useWallet hook with additional safety checks and conveniences
 * 
 * This hook wraps the WalletContext and provides:
 * - Safe access to context values with fallbacks
 * - Memoized helper functions 
 * - Typed return values
 */
export function useWallet() {
  const context = useContext(WalletContext);
  
  // Protect against context being used outside provider
  if (context === undefined) {
    console.error('useWallet must be used within a WalletProvider');
    
    // Return a safe fallback object with empty/noop functions
    return {
      account: null,
      provider: null,
      signer: null,
      isConnecting: false,
      error: 'WalletContext not available',
      chainId: null,
      availableWallets: [],
      connectionAttempts: 0,
      connect: async () => { 
        console.error('WalletContext not available');
        return null;
      },
      disconnect: () => { 
        console.error('WalletContext not available');
      },
      switchChain: async () => { 
        console.error('WalletContext not available');
        return false;
      },
      connectToWallet: async () => { 
        console.error('WalletContext not available');
        return null;
      },
      detectWallets: () => { 
        console.error('WalletContext not available');
        return [];
      },
      getEthereumObject: () => {
        console.error('WalletContext not available');
        return null;
      }
    };
  }
  
  // Safe getters with memoized functions for network-specific convenience
  
  // Helper to format address
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);
  
  // Helper to check if connected to specific networks
  const isOnLinea = useCallback(() => {
    return context.chainId === 59144;
  }, [context.chainId]);
  
  const isOnSonic = useCallback(() => {
    return context.chainId === 146;
  }, [context.chainId]);
  
  const isOnSupportedNetwork = useCallback(() => {
    return isOnLinea() || isOnSonic();
  }, [isOnLinea, isOnSonic]);
  
  // Return the original context plus additional helpers
  return {
    ...context,
    formatAddress,
    isOnLinea,
    isOnSonic,
    isOnSupportedNetwork
  };
}
