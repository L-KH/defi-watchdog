// src/components/Web3Provider.js - Fixed Web3 Provider
'use client'

import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { sepolia, mainnet } from 'wagmi/chains'
import { http } from 'wagmi'
import { metaMask, walletConnect } from 'wagmi/connectors'

import '@rainbow-me/rainbowkit/styles.css'

// Create wagmi config
const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '142eb630219aa2039a04babd028ba730',
    }),
  ],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.public.blastapi.io'),
    [mainnet.id]: http(),
  },
})

// Create query client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Simple theme without complex nested objects
const rainbowTheme = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  colors: {
    accentColor: '#3B82F6',
    accentColorForeground: '#FFFFFF',
    actionButtonBorder: '#E5E7EB',
    actionButtonBorderMobile: '#E5E7EB',
    actionButtonSecondaryBackground: '#F9FAFB',
    closeButton: '#9CA3AF',
    closeButtonBackground: '#F9FAFB',
    connectButtonBackground: '#FFFFFF',
    connectButtonBackgroundError: '#FEF2F2',
    connectButtonInnerBackground: '#F9FAFB',
    connectButtonText: '#111827',
    connectButtonTextError: '#EF4444',
    connectionIndicator: '#10B981',
    downloadBottomCardBackground: '#F9FAFB',
    downloadTopCardBackground: '#FFFFFF',
    error: '#EF4444',
    generalBorder: '#E5E7EB',
    generalBorderDim: '#F3F4F6',
    menuItemBackground: '#F9FAFB',
    modalBackdrop: 'rgba(0, 0, 0, 0.3)',
    modalBackground: '#FFFFFF',
    modalBorder: '#E5E7EB',
    modalText: '#111827',
    modalTextDim: '#6B7280',
    modalTextSecondary: '#374151',
    profileAction: '#F9FAFB',
    profileActionHover: '#F3F4F6',
    profileForeground: '#FFFFFF',
    selectedOptionBorder: '#3B82F6',
    standby: '#F59E0B',
  },
  fonts: {
    body: 'SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  radii: {
    actionButton: '8px',
    connectButton: '8px',
    menuButton: '8px',
    modal: '12px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    dialog: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    profileDetailsAction: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    selectedOption: '0 0 0 1px #3B82F6',
    selectedWallet: '0 0 0 1px #3B82F6',
    walletLogo: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
}

export default function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={rainbowTheme}
          showRecentTransactions={true}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}