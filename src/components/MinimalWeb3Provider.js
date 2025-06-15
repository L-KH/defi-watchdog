// src/components/MinimalWeb3Provider.js - Ultra minimal to avoid all conflicts
'use client'

import { createContext, useContext } from 'react'

// Create a simple context for Web3 state
const Web3Context = createContext({})

export function useWeb3() {
  return useContext(Web3Context)
}

export default function MinimalWeb3Provider({ children }) {
  // For now, just provide the children without any Web3 functionality
  // This allows the app to start without Web3 conflicts
  return (
    <Web3Context.Provider value={{}}>
      {children}
    </Web3Context.Provider>
  )
}