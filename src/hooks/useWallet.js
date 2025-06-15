// src/hooks/useWallet.js - Fallback version without WalletContext

import { useState, useEffect, useCallback } from 'react';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  // Check wallet connection on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check initial connection
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setAccount(accounts[0]);
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
          setAccount(accounts[0]);
        } else {
          setIsConnected(false);
          setAccount(null);
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

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed');
      return null;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        return accounts[0];
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAccount(null);
  }, []);

  const switchChain = useCallback(async (chainId) => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  }, []);

  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const isOnLinea = useCallback(() => {
    return chainId === 59144;
  }, [chainId]);

  const isOnSonic = useCallback(() => {
    return chainId === 146;
  }, [chainId]);

  const isOnSupportedNetwork = useCallback(() => {
    return isOnLinea() || isOnSonic() || chainId === 11155111; // Include Sepolia
  }, [isOnLinea, isOnSonic, chainId]);

  return {
    account,
    provider: null, // Fallback mode
    signer: null,   // Fallback mode
    isConnected,
    isConnecting,
    error,
    chainId,
    availableWallets: [],
    connectionAttempts: 0,
    connect,
    disconnect,
    switchChain,
    connectToWallet: connect,
    detectWallets: () => [],
    getEthereumObject: () => window?.ethereum || null,
    formatAddress,
    isOnLinea,
    isOnSonic,
    isOnSupportedNetwork
  };
}