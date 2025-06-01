// src/services/contractScannerApi.js
/**
 * Optimized Smart Contract Security Scanner API Integration
 * Prevents duplicate requests and handles rate limiting
 */

const SCANNER_API_BASE = 'http://89.147.103.119';

// Request deduplication
const pendingRequests = new Map();
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class ContractScannerAPI {
  /**
   * Create a cache key for requests
   */
  static createCacheKey(address, network) {
    return `${network}-${address.toLowerCase()}`;
  }

  /**
   * Check if cached result is still valid
   */
  static isCacheValid(cacheEntry) {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
  }

  /**
   * Get scanner health and available tools
   */
  static async getHealthStatus() {
    const cacheKey = 'health-status';
    const cached = requestCache.get(cacheKey);
    
    if (this.isCacheValid(cached)) {
      return cached.data;
    }

    try {
      // Use API route instead of direct call to external scanner
      const response = await fetch('/api/scanner/health');
      if (!response.ok) {
        throw new Error(`Scanner API unavailable: ${response.status}`);
      }
      const data = await response.json();
      requestCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Scanner health check failed:', error);
      const fallback = {
        status: 'error',
        error: error.message,
        available_tools: {},
        service: 'Scanner API',
        version: 'Unknown'
      };
      requestCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }
  }

  /**
   * Get detailed information about available tools
   */
  static async getToolsInfo() {
    const cacheKey = 'tools-info';
    const cached = requestCache.get(cacheKey);
    
    if (this.isCacheValid(cached)) {
      return cached.data;
    }

    try {
      // Use API route instead of direct call to external scanner
      const response = await fetch('/api/scanner/tools');
      if (!response.ok) {
        throw new Error(`Tools info unavailable: ${response.status}`);
      }
      const data = await response.json();
      requestCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Tools info failed:', error);
      const fallback = {
        available_tools: {
          pattern_matcher: true,
          slither: false,
          mythril: false,
          semgrep: false,
          solhint: false
        },
        error: error.message
      };
      requestCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }
  }

  /**
   * Get contract source code with request deduplication
   */
  static async getContractSource(address, network = 'linea') {
    const cacheKey = this.createCacheKey(address, network);
    
    // Check cache first
    const cached = requestCache.get(cacheKey);
    if (this.isCacheValid(cached)) {
      console.log('Returning cached contract source for', address);
      return cached.data;
    }
    
    // Check if request is pending
    if (pendingRequests.has(cacheKey)) {
      console.log('Waiting for pending contract request for', address);
      try {
        return await pendingRequests.get(cacheKey);
      } catch (error) {
        // If pending request fails, remove it and allow retry
        pendingRequests.delete(cacheKey);
        throw error;
      }
    }
    
    // Create new request
    const requestPromise = this.fetchContractSource(address, network, cacheKey);
    pendingRequests.set(cacheKey, requestPromise);
    
    try {
      return await requestPromise;
    } catch (error) {
      // Remove failed request from pending to allow retry
      pendingRequests.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Internal method to fetch contract source
   */
  static async fetchContractSource(address, network, cacheKey) {
    try {
      console.log(`Fetching contract source for ${address} on ${network}`);
      
      const response = await fetch('/api/contract-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, network })
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Provide more helpful error messages
        if (response.status === 404 && errorData.error?.includes('API key')) {
          throw new Error('API key not configured. Please check your .env.local file and restart the server.');
        }
        
        if (response.status === 404 && errorData.error?.includes('not available')) {
          throw new Error('Contract source code not available. The contract may not be verified on the explorer.');
        }
        
        throw new Error(errorData.error || `Failed to fetch contract source (${response.status})`);
      }

      const data = await response.json();
      
      // Handle both old and new API response formats
      const result = {
        sourceCode: data.sourceCode || data.source,
        contractName: data.contractName || 'Unknown Contract',
        compilerVersion: data.compiler || data.compilerVersion || 'Unknown',
        address: data.address,
        network: data.network
      };
      
      // Cache the result
      requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
      
    } catch (error) {
      console.error('Contract source fetch failed:', error);
      
      // Cache error result to prevent repeated failed requests
      const errorResult = {
        sourceCode: '',
        contractName: `Contract-${address.slice(0, 6)}`,
        compilerVersion: 'Unknown',
        address,
        network,
        error: error.message
      };
      
      requestCache.set(cacheKey, { data: errorResult, timestamp: Date.now() });
      
      throw error;
    } finally {
      // Always remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Scan contract code directly with caching
   */
  static async scanContractCode(sourceCode, filename, options = {}) {
    const {
      tools = 'all',
      mode = 'balanced',
      format = 'json'
    } = options;

    // Create cache key for scan requests
    const scanCacheKey = `scan-${this.hashCode(sourceCode)}-${tools}-${mode}-${format}`;
    const cached = requestCache.get(scanCacheKey);
    
    if (this.isCacheValid(cached) && format === 'json') {
      console.log('Returning cached scan result');
      return cached.data;
    }

    try {
      // Use API route instead of direct call to external scanner
      const response = await fetch('/api/scanner/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: sourceCode,
          filename,
          tools,
          mode,
          format
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Scan failed with status ${response.status}`);
      }

      if (format === 'json') {
        const result = await response.json();
        requestCache.set(scanCacheKey, { data: result, timestamp: Date.now() });
        return result;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Contract scan failed:', error);
      throw error;
    }
  }

  /**
   * Simple hash function for cache keys
   */
  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Generate and download report in different formats
   */
  static async downloadReport(scanResults, format, filename) {
    try {
      if (!scanResults || !scanResults.result) {
        throw new Error('No scan results available for report generation');
      }

      const contractInfo = scanResults.contractInfo || {};
      const vulnerabilities = scanResults.result.all_vulnerabilities || [];
      
      let content = '';
      let mimeType = 'text/plain';
      
      switch (format.toLowerCase()) {
        case 'json':
          content = JSON.stringify(scanResults, null, 2);
          mimeType = 'application/json';
          break;
          
        case 'csv':
          const headers = ['Type', 'Severity', 'Tool', 'Line', 'Description', 'Recommendation'];
          const rows = vulnerabilities.map(vuln => [
            vuln.type || '',
            vuln.severity || '',
            vuln.tool || '',
            vuln.line || '',
            (vuln.description || '').replace(/"/g, '""'),
            (vuln.recommendation || vuln.impact || '').replace(/"/g, '""')
          ]);
          
          content = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
          mimeType = 'text/csv';
          break;
          
        case 'html':
          content = `<!DOCTYPE html>
<html>
<head>
  <title>Security Audit Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .vulnerability { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
    .high { border-left: 5px solid #dc2626; }
    .medium { border-left: 5px solid #d97706; }
    .low { border-left: 5px solid #059669; }
  </style>
</head>
<body>
  <h1>Security Audit Report</h1>
  <h2>${contractInfo.contractName || 'Unknown Contract'}</h2>
  <p><strong>Address:</strong> ${contractInfo.address || 'N/A'}</p>
  <p><strong>Total Issues:</strong> ${vulnerabilities.length}</p>
  ${vulnerabilities.map(vuln => `
    <div class="vulnerability ${vuln.severity?.toLowerCase() || 'info'}">
      <h3>${vuln.type || 'Security Issue'}</h3>
      <p>${vuln.description || 'No description'}</p>
    </div>
  `).join('')}
</body>
</html>`;
          mimeType = 'text/html';
          break;
          
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `scan_report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Report download failed:', error);
      throw error;
    }
  }

  /**
   * Utility functions for cache management
   */
  static clearCache() {
    requestCache.clear();
    pendingRequests.clear();
    console.log('ContractScannerAPI cache cleared');
  }

  static getCacheStats() {
    return {
      cached: requestCache.size,
      pending: pendingRequests.size,
      cacheItems: Array.from(requestCache.keys())
    };
  }
}

// Utility functions for scan result processing
export const ScanUtils = {
  getSeverityColor(severity) {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'MEDIUM':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'LOW':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  },

  getToolIcon(toolName) {
    const icons = {
      pattern_matcher: '🔍',
      slither: '🐍',
      mythril: '⚡',
      semgrep: '🎯',
      solhint: '✨',
      ai: '🤖'
    };
    return icons[toolName] || '🔧';
  },

  formatScanDuration(mode) {
    const durations = {
      fast: '< 10 seconds',
      balanced: '30-60 seconds',
      deep: '2-5 minutes',
      comprehensive: '5-10 minutes'
    };
    return durations[mode] || 'Variable';
  },

  calculateRiskScore(vulnerabilities) {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return { score: 100, level: 'Safe' };
    }

    let score = 100;
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity?.toUpperCase()) {
        case 'HIGH':
        case 'CRITICAL':
          score -= 30;
          break;
        case 'MEDIUM':
          score -= 15;
          break;
        case 'LOW':
          score -= 5;
          break;
      }
    });

    score = Math.max(0, score);

    let level;
    if (score >= 90) level = 'Safe';
    else if (score >= 70) level = 'Low Risk';
    else if (score >= 50) level = 'Medium Risk';
    else level = 'High Risk';

    return { score, level };
  }
};

export default ContractScannerAPI;
