import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWallet } from '../../hooks/useWallet';

// Use React.memo for React 19 compatibility
const Header = React.memo(() => {
  const { account, connect, disconnect } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const router = useRouter();
  const [chainId, setChainId] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const SONIC_CHAIN_ID = 146;
  const LINEA_CHAIN_ID = 59144;
  
  // Simple scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const currentChainId = parseInt(chainId, 16);
          setChainId(currentChainId);
          setIsCorrectNetwork(currentChainId === SONIC_CHAIN_ID || currentChainId === LINEA_CHAIN_ID);
        } catch (error) {
          console.error('Error checking network:', error);
        }
      }
    };
    
    checkNetwork();
    
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkNetwork();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      }
    };
  }, []);

  const getNetworkName = (chainId) => {
    if (chainId === SONIC_CHAIN_ID) return 'Sonic';
    if (chainId === LINEA_CHAIN_ID) return 'Linea';
    return 'Unknown';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  const handleNetworkSwitch = async () => {
    if (!account || !window.ethereum) return;
    
    const userPrefersLinea = localStorage.getItem('preferredNetwork') !== 'sonic';
    const targetChainId = userPrefersLinea ? LINEA_CHAIN_ID : SONIC_CHAIN_ID;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902 || switchError.message.includes('wallet_addEthereumChain')) {
        try {
          if (targetChainId === SONIC_CHAIN_ID) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${SONIC_CHAIN_ID.toString(16)}`,
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
          } else {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${LINEA_CHAIN_ID.toString(16)}`,
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
          }
        } catch (addError) {
          setConnectionError(`Could not add ${targetChainId === SONIC_CHAIN_ID ? 'Sonic' : 'Linea'} network to your wallet. Please add it manually.`);
        }
      } else {
        setConnectionError(`Failed to switch to ${targetChainId === SONIC_CHAIN_ID ? 'Sonic' : 'Linea'} network. Please try again.`);
      }
    }
  };

  // Menu items
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/audit', label: 'Audit' },
    { path: '/audit-pro', label: 'Audit[Pro]' },
    { path: '/how-it-works', label: 'How It Works' }
  ];

  // Enhanced navigation handler
  const handleNavigation = (path, event) => {
    if (event) {
      event.preventDefault();
    }
    
    // Close mobile menu immediately
    setMobileMenuOpen(false);
    
    // If we're already on the target path, don't navigate
    if (router.pathname === path) {
      return;
    }
    
    console.log('🔗 Navigation clicked:', path, 'Current:', router.pathname);
    
    // Force navigation with page reload for different routes
    if (path === '/audit-pro' && router.pathname === '/audit') {
      window.location.href = path;
      return;
    }
    
    if (path === '/audit' && router.pathname === '/audit-pro') {
      window.location.href = path;
      return;
    }
    
    // Use router.push for other routes
    router.push(path).catch(error => {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = path;
    });
  };

  // Handle wallet connection
  const handleWalletConnect = async () => {
    if (account) {
      disconnect();
      return;
    }
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          console.log("Connected to wallet:", accounts[0]);
          
          if (typeof connect === 'function') {
            await connect();
          }
        } catch (requestError) {
          console.error("Error requesting accounts:", requestError);
          throw new Error("Wallet connection failed. Please check your wallet extension.");
        }
      } else {
        throw new Error("No wallet detected. Please install MetaMask or another Web3 wallet.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Format account address for display
  const formatAccount = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return React.createElement(
    'header',
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg py-4' 
          : 'bg-white/90 backdrop-blur-sm py-4'
      }`
    },
    React.createElement(
      'div',
      { className: "container mx-auto px-4 flex items-center justify-between" },
      // Logo
      React.createElement(
        Link,
        { href: "/", className: "flex items-center group", onClick: (e) => handleNavigation('/', e) },
        React.createElement(
          'div',
          { className: "relative" },
          React.createElement(
            'div',
            { className: "w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300" },
            React.createElement(
              'svg',
              { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })
            )
          ),
          React.createElement(
            'div',
            { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100" },
            React.createElement('span', { className: "text-xs" }, "🤖")
          )
        ),
        React.createElement(
          'span',
          { className: "ml-2 font-semibold text-lg text-gray-800" },
          "DeFi",
          React.createElement('span', { className: "text-blue-600" }, "Watchdog")
        )
      ),
      
      // Desktop Navigation
      React.createElement(
        'nav',
        { className: "hidden md:flex items-center space-x-1" },
        menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          
          return React.createElement(
            'a',
            {
              key: item.path,
              href: item.path,
              className: `
                relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `,
              onClick: (e) => handleNavigation(item.path, e)
            },
            item.label,
            isActive && React.createElement('span', { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded" })
          );
        })
      ),

      // Wallet Button and Mobile Menu Toggle
      React.createElement(
        'div',
        { className: "flex items-center space-x-3" },
        // Network Status
        account && React.createElement(
          'div',
          { className: "hidden md:flex items-center" },
          React.createElement(
            'div',
            { 
              className: `px-3 py-1 rounded-l-lg text-xs font-medium ${
                isCorrectNetwork 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`
            },
            isCorrectNetwork ? getNetworkName(chainId) : 'Wrong Network'
          ),
          !isCorrectNetwork && React.createElement(
            'button',
            {
              onClick: handleNetworkSwitch,
              className: "px-3 py-1 rounded-r-lg text-xs font-medium bg-blue-500 text-white border border-blue-600 hover:bg-blue-600 transition-colors"
            },
            'Switch'
          )
        ),

        // Wallet Connect Button
        React.createElement(
          'button',
          {
            onClick: handleWalletConnect,
            disabled: isConnecting,
            className: `
              rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200 flex items-center
              ${account 
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'}
              ${isConnecting ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
            `
          },
          account ? [
            React.createElement('span', { key: 'indicator', className: "w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" }),
            formatAccount(account)
          ] : isConnecting ? [
            React.createElement('svg', { key: 'spinner', className: "animate-spin h-4 w-4 mr-2 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
              React.createElement('circle', { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              React.createElement('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ),
            'Connecting...'
          ] : [
            React.createElement('svg', { key: 'wallet-icon', xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" })
            ),
            'Connect Wallet'
          ]
        ),

        // Mobile Menu Toggle
        React.createElement(
          'button',
          {
            className: "inline-flex items-center justify-center p-2 rounded-md md:hidden text-gray-700 hover:bg-gray-100",
            onClick: () => setMobileMenuOpen(!mobileMenuOpen),
            'aria-expanded': mobileMenuOpen
          },
          React.createElement('span', { className: "sr-only" }, "Open main menu"),
          React.createElement(
            'div',
            { className: "relative w-6 h-5" },
            React.createElement('span', { className: `absolute block h-0.5 w-6 bg-current transform transition duration-200 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-2' : '-translate-y-2'}` }),
            React.createElement('span', { className: `absolute block h-0.5 w-6 bg-current transform transition duration-200 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}` }),
            React.createElement('span', { className: `absolute block h-0.5 w-6 bg-current transform transition duration-200 ease-in-out ${mobileMenuOpen ? '-rotate-45 translate-y-2' : 'translate-y-2'}` })
          )
        )
      )
    ),

    // Mobile Menu
    React.createElement(
      'div',
      { className: `md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}` },
      React.createElement(
        'div',
        { className: "bg-white border-t border-gray-200 px-4 py-4" },
        React.createElement(
          'nav',
          { className: "flex flex-col space-y-3" },
          menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            
            return React.createElement(
              'a',
              {
                key: item.path,
                href: item.path,
                className: `
                  px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer
                  ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
                `,
                onClick: (e) => handleNavigation(item.path, e)
              },
              item.label
            );
          }),
          
          // Mobile Network Status
          account && React.createElement(
            'div',
            { className: "flex items-center mt-4 pt-4 border-t border-gray-200" },
            React.createElement(
              'div',
              { 
                className: `px-3 py-1 rounded-l-lg text-xs font-medium ${
                  isCorrectNetwork 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`
              },
              isCorrectNetwork ? getNetworkName(chainId) : 'Wrong Network'
            ),
            !isCorrectNetwork && React.createElement(
              'button',
              {
                onClick: handleNetworkSwitch,
                className: "px-3 py-1 rounded-r-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600"
              },
              'Switch'
            )
          ),
          
          // Error Message
          connectionError && !account && React.createElement(
            'div',
            { className: "px-4 py-2 text-xs text-red-600 bg-red-50 rounded-md border border-red-200" },
            connectionError
          )
        )
      )
    )
  );
});

// Set display name for debugging
Header.displayName = 'Header';

// Export both named and default
export { Header };
export default Header;
