import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Enhanced wagmi config with RainbowKit
export const config = getDefaultConfig({
  appName: 'DeFi Watchdog',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', 
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: {
      http: 'https://rpc.sepolia.org'
    },
    [mainnet.id]: {
      http: 'https://eth.llamarpc.com'
    }
  },
  ssr: true,
});