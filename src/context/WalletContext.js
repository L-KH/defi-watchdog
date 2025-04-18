import React, { createContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [availableWallets, setAvailableWallets] = useState([]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Define chain constants
  const SONIC_CHAIN_ID = 146;
  const LINEA_CHAIN_ID = 59144;
  
  // Use refs to prevent circular dependencies
  const providerRef = useRef();
  providerRef.current = provider;
  
  const accountRef = useRef();
  accountRef.current = account;

  // Define event handlers using useCallback to prevent re-creation
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      if (providerRef.current) {
        setSigner(providerRef.current.getSigner());
      }
    } else {
      setAccount(null);
      setSigner(null);
    }
  }, []);

  const handleChainChanged = useCallback((newChainId) => {
    // Parse the chain ID to an integer (it comes as hex)
    const parsedChainId = parseInt(newChainId, 16);
    setChainId(parsedChainId);
    
    // Only reload if we already have an account connected and this isn't the initial load
    if (accountRef.current) {
      // Instead of reloading the page, just update the provider and signer
      if (providerRef.current) {
        const signer = providerRef.current.getSigner();
        setSigner(signer);
      }
    }
  }, []);

  const handleDisconnect = useCallback((error) => {
    console.log("Wallet disconnected", error);
    setAccount(null);
    setSigner(null);
    if (error) {
      setError("Wallet disconnected: " + (error.message || "Unknown error"));
    } else {
      setError("Wallet disconnected");
    }
  }, []);

  // Detect wallets without updating state directly
  const detectWallets = useCallback(() => {
    if (typeof window === 'undefined') return [];
    
    const wallets = [];
    
    if (!window.ethereum) return wallets;
    
    try {
      if (window.ethereum.providers) {
        for (const provider of window.ethereum.providers) {
          let name = "Unknown Wallet";
          let icon = "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg";
          
          if (provider.isMetaMask) {
            name = "MetaMask";
            icon = "https://metamask.io/images/metamask-fox.svg";
          } else if (provider.isCoinbaseWallet) {
            name = "Coinbase Wallet";
            icon = "https://www.coinbase.com/assets/favicon-32.png";
          } else if (provider.isWalletConnect) {
            name = "WalletConnect";
            icon = "https://walletconnect.org/walletconnect-logo.png";
          }
          
          wallets.push({ name, icon, provider });
        }
      } else {
        let name = "Browser Wallet";
        let icon = "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg";
        
        if (window.ethereum.isMetaMask) {
          name = "MetaMask";
          icon = "https://metamask.io/images/metamask-fox.svg";
        } else if (window.ethereum.isCoinbaseWallet || window.coinbaseWalletExtension) {
          name = "Coinbase Wallet";
          icon = "https://www.coinbase.com/assets/favicon-32.png";
        } else if (window.ethereum.isWalletConnect) {
          name = "WalletConnect";
          icon = "https://walletconnect.org/walletconnect-logo.png";
        }
        
        wallets.push({ name, icon, provider: window.ethereum });
      }
    } catch (err) {
      console.error("Error detecting wallets:", err);
      if (window.ethereum) {
        wallets.push({
          name: "Browser Wallet",
          icon: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
          provider: window.ethereum
        });
      }
    }
    
    return wallets;
  }, []);

  // Update available wallets separately
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const wallets = detectWallets();
    setAvailableWallets(wallets);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const updatedWallets = detectWallets();
        setAvailableWallets(updatedWallets);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [detectWallets]);

  // Initialize provider with fixed dependencies
  const initialized = useRef(false);
  
  useEffect(() => {
    // Skip if already initialized or if window is not defined (SSR)
    if (initialized.current || typeof window === 'undefined') return;
    
    const initProvider = async () => {
      try {
        if (!window.ethereum) {
          console.log("No ethereum provider found");
          return;
        }
        
        const ethereum = window.ethereum;
        
        // Create ethers provider
        const ethersProvider = new ethers.providers.Web3Provider(ethereum, "any");
        setProvider(ethersProvider);

        // Get the network/chain ID
        try {
          const network = await ethersProvider.getNetwork();
          setChainId(network.chainId);
        } catch (networkErr) {
          console.error("Failed to get network:", networkErr);
          setChainId(0);
        }

        // Check if already connected
        try {
          const accounts = await ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(ethersProvider.getSigner());
          }
        } catch (accountsErr) {
          console.error("Failed to get accounts:", accountsErr);
        }

        // Set up event listeners
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('disconnect', handleDisconnect);
        
        initialized.current = true;
      } catch (err) {
        console.error('Error initializing provider:', err);
      }
    };

    initProvider();

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]);

  // Connect to specific wallet provider
  const connectToWallet = useCallback(async (walletProvider) => {
    setIsConnecting(true);
    setError(null);
    setConnectionAttempts(prev => prev + 1);
    
    if (!walletProvider) {
      const error = "No wallet provider specified";
      setError(error);
      setIsConnecting(false);
      throw new Error(error);
    }
    
    try {
      if (typeof walletProvider.request !== 'function') {
        throw new Error("Invalid wallet provider: missing request method");
      }
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timed out after 15 seconds")), 15000)
      );
      
      const accounts = await Promise.race([
        walletProvider.request({ method: 'eth_requestAccounts' }),
        timeoutPromise
      ]);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet");
      }
      
      const account = accounts[0];
      setAccount(account);
      
      const provider = new ethers.providers.Web3Provider(walletProvider, "any");
      const signer = provider.getSigner();
      
      setProvider(provider);
      setSigner(signer);
      
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      
      return account;
    } catch (error) {
      if (error.code === 4001) {
        setError("You rejected the connection request.");
      } else if (error.code === -32002) {
        setError("Connection request already pending. Check your wallet.");
      } else if (error.message.includes("timed out")) {
        setError("Connection timed out. Please try again.");
      } else {
        setError(error.message || "Failed to connect wallet");
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connect = useCallback(async (walletName) => {
    try {
      const wallets = detectWallets(); // Don't update state here
      
      if (wallets.length === 0) {
        const error = "No wallet extensions detected. Please install MetaMask or another Web3 wallet.";
        setError(error);
        throw new Error(error);
      }
      
      if (walletName) {
        const selectedWallet = wallets.find(w => w.name === walletName);
        if (selectedWallet) {
          return connectToWallet(selectedWallet.provider);
        } else {
          const error = `Wallet "${walletName}" not found or not installed`;
          setError(error);
          throw new Error(error);
        }
      }
      
      if (wallets.length > 0) {
        return connectToWallet(wallets[0].provider);
      }
    } catch (error) {
      setError(error.message || "Failed to connect to wallet");
      throw error;
    }
  }, [connectToWallet, detectWallets]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setError(null);
  }, []);

  const switchChain = useCallback(async (chainId) => {
    if (!window.ethereum) {
      setError("No wallet connected");
      return false;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      // Chain doesn't exist, try to add it
      if (error.code === 4902 || error.message.includes('wallet_addEthereumChain')) {
        try {
          if (chainId === SONIC_CHAIN_ID) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${chainId.toString(16)}`,
                chainName: 'Sonic',
                nativeCurrency: {
                  name: 'SONIC',
                  symbol: 'SONIC',
                  decimals: 18
                },
                rpcUrls: ['https://mainnet.sonic.io/rpc'],
                blockExplorerUrls: ['https://sonicscan.org/']
              }],
            });
            return true;
          } else if (chainId === LINEA_CHAIN_ID) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${chainId.toString(16)}`,
                chainName: 'Linea Mainnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.linea.build'],
                blockExplorerUrls: ['https://lineascan.build/']
              }],
            });
            return true;
          }
          setError(`Failed to add network: Unknown chain ID ${chainId}`);
          return false;
        } catch (addError) {
          setError(`Failed to add network: ${addError.message}`);
          return false;
        }
      }
      
      setError(`Failed to switch network: ${error.message}`);
      return false;
    }
  }, [SONIC_CHAIN_ID, LINEA_CHAIN_ID]);

  const getEthereumObject = useCallback(() => {
    return typeof window !== 'undefined' ? window.ethereum : null;
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    account,
    provider,
    signer,
    isConnecting,
    error,
    chainId,
    availableWallets,
    connectionAttempts,
    // Chain ID constants
    SONIC_CHAIN_ID,
    LINEA_CHAIN_ID,
    // Methods
    connect,
    disconnect,
    switchChain,
    connectToWallet,
    detectWallets,
    getEthereumObject
  }), [
    account, provider, signer, isConnecting, error, chainId,
    availableWallets, connectionAttempts, SONIC_CHAIN_ID, LINEA_CHAIN_ID,
    connect, disconnect, switchChain, connectToWallet, detectWallets, getEthereumObject
  ]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
