// API endpoint to fetch user's audit history from BOTH localStorage simulation and IPFS
// This handles the disconnect between server-side API and client-side localStorage
import { findAuditReports } from '../../lib/localStorage';
import pinataService from '../../services/pinataService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, network, limit = 10 } = req.query;
    
    // Validate inputs
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid wallet address'
      });
    }
    
    console.log('🔍 Fetching audit history for:', {
      address: address.slice(0, 10) + '...',
      network,
      limit
    });

    // Since we don't have MongoDB, and the server can't access browser localStorage,
    // we need to rely on the client sending us the localStorage data
    // For now, let's check the server filesystem and prepare for client-side integration
    
    let localHistory = [];
    
    try {
      // Try to fetch from server-side storage (filesystem) first
      localHistory = await findAuditReports(
        { 
          userAddress: address.toLowerCase() // Use userAddress for user queries
        },
        { 
          sortBy: 'createdAt', 
          sortDesc: true,
          limit: parseInt(limit) 
        }
      );
      
      console.log(`📊 Found ${localHistory.length} audits in server storage`);
    } catch (error) {
      console.error('Server storage error:', error.message);
      // We'll rely on client-side localStorage instead
    }

    // If no server storage, prepare response for client-side integration
    if (localHistory.length === 0) {
      console.log('No server storage found, expecting client-side localStorage');
      
      // Return a special response that tells the client to use localStorage
      return res.status(200).json({
        success: true,
        address: address.toLowerCase(),
        network: network || 'sepolia',
        totalFound: 0,
        history: [],
        source: 'server_empty',
        
        // Instructions for client
        clientInstructions: {
          useLocalStorage: true,
          searchKey: 'audit_',
          matchField: 'user',
          expectedAddress: address.toLowerCase()
        },
        
        // Service status
        services: {
          serverStorage: { available: true, count: 0 },
          ipfs: { available: pinataService.enabled, status: 'ready' }
        },
        
        // Metadata
        fetchedAt: new Date().toISOString(),
        limit: parseInt(limit)
      });
    }

    // Format the history for frontend consumption
    const formattedHistory = localHistory.map(audit => ({
      requestId: audit.requestId || audit._id,
      contractAddress: audit.contractAddress || audit.address,
      contractName: audit.contractName || 'Unknown Contract',
      timestamp: audit.timestamp || Date.now(),
      completed: audit.completed || false,
      
      // IPFS data
      reportIPFSHash: audit.reportIPFSHash || '',
      reportIPFSUrl: audit.reportIPFSUrl || '',
      hasIPFSReport: !!(audit.reportIPFSHash),
      
      // Audit results
      securityScore: audit.securityScore || 0,
      riskLevel: audit.riskLevel || 'Unknown',
      
      // Payment info
      paidAmount: audit.paidAmount || '0.003',
      txHash: audit.txHash || '',
      
      // Metadata
      network: audit.network || network || 'sepolia',
      createdAt: audit.createdAt || new Date(audit.timestamp).toISOString(),
      
      // Report access URLs
      ipfsViewUrl: audit.reportIPFSUrl ? `${audit.reportIPFSUrl}` : null,
      ipfsDownloadUrl: audit.reportIPFSHash ? `https://gateway.pinata.cloud/ipfs/${audit.reportIPFSHash}` : null
    }));

    // Test Pinata connection (optional diagnostic)
    let pinataStatus = null;
    try {
      pinataStatus = await pinataService.testConnection();
    } catch (error) {
      console.warn('⚠️ Pinata connection test failed:', error.message);
      pinataStatus = { success: false, error: error.message };
    }

    return res.status(200).json({
      success: true,
      address: address.toLowerCase(),
      network: network || 'sepolia',
      totalFound: formattedHistory.length,
      history: formattedHistory,
      source: 'server_storage',
      
      // Service status
      services: {
        serverStorage: { available: true, count: localHistory.length },
        ipfs: { 
          available: pinataStatus?.success || false, 
          error: pinataStatus?.error || null
        }
      },
      
      // Metadata
      fetchedAt: new Date().toISOString(),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('❌ Error fetching audit history:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch audit history',
      details: 'Internal server error while fetching audit history'
    });
  }
}
