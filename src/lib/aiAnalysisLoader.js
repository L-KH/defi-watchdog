// AI Analysis Loader - Handles dynamic imports for webpack compatibility
// This module provides a consistent interface for loading AI analysis modules

// Try to preload the client AI module
let clientAiModule = null;

// Attempt to load the module synchronously first
try {
  clientAiModule = require('./clientAiAnalysis');
} catch (e) {
  console.warn('Client AI module not available via require, will use dynamic import');
}

/**
 * Load the client AI analysis module with proper error handling
 * @returns {Promise<Object>} The client AI analysis module
 */
export async function loadClientAiAnalysis() {
  // If already loaded, return it
  if (clientAiModule) {
    return clientAiModule;
  }

  // Try dynamic import
  try {
    clientAiModule = await import('./clientAiAnalysis');
    return clientAiModule;
  } catch (error) {
    console.error('Failed to load client AI module:', error);
    
    // Check if available on window
    if (typeof window !== 'undefined' && window.__clientAiAnalysis) {
      console.log('Using window.__clientAiAnalysis fallback');
      return window.__clientAiAnalysis;
    }
    
    throw new Error('Client AI analysis module could not be loaded');
  }
}

/**
 * Analyze with AI using the loaded module
 * @param {string} sourceCode - The contract source code
 * @param {string} contractName - The contract name
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeWithAIClient(sourceCode, contractName, options = {}) {
  const module = await loadClientAiAnalysis();
  
  if (typeof module.analyzeWithAIClient === 'function') {
    return module.analyzeWithAIClient(sourceCode, contractName, options);
  }
  
  throw new Error('analyzeWithAIClient function not found in module');
}

/**
 * Check if client-side analysis is enabled
 * @returns {Promise<boolean>} Whether client-side analysis is enabled
 */
export async function isClientSideAnalysisEnabled() {
  try {
    const module = await loadClientAiAnalysis();
    if (typeof module.isClientSideAnalysisEnabled === 'function') {
      return module.isClientSideAnalysisEnabled();
    }
  } catch (error) {
    console.warn('Could not check if client-side analysis is enabled:', error);
  }
  
  return false;
}

// Pre-load the module if in browser environment
if (typeof window !== 'undefined') {
  loadClientAiAnalysis().catch(err => {
    console.warn('Pre-loading client AI module failed:', err);
  });
}
