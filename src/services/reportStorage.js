// Report storage service using Pinata IPFS
import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

export class ReportStorageService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_KEY || process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
  }
  
  /**
   * Upload audit report to IPFS via Pinata
   * @param {Object} report - The complete audit report
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Upload result with IPFS hash
   */
  async uploadReport(report, metadata) {
    if (!this.apiKey || !this.secretKey) {
      console.warn('Pinata API keys not configured, using mock storage');
      return this.mockUpload(report, metadata);
    }
    
    try {
      const data = {
        pinataOptions: {
          cidVersion: 0
        },
        pinataMetadata: {
          name: `DeFi_Watchdog_Audit_${metadata.requestId}`,
          keyvalues: {
            contractAddress: metadata.contractAddress,
            contractName: metadata.contractName,
            requestId: metadata.requestId?.toString(),
            timestamp: new Date().toISOString(),
            securityScore: metadata.securityScore?.toString(),
            riskLevel: metadata.riskLevel
          }
        },
        pinataContent: {
          version: "1.0",
          metadata: {
            ...metadata,
            generatedAt: new Date().toISOString(),
            platform: "DeFi Watchdog Premium"
          },
          report: report
        }
      };
      
      const response = await axios.post(PINATA_API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      });
      
      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        url: `${PINATA_GATEWAY}${response.data.IpfsHash}`,
        timestamp: response.data.Timestamp,
        size: response.data.PinSize
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      
      // Fallback to mock storage
      if (error.response?.status === 401) {
        console.warn('Invalid Pinata credentials, using mock storage');
        return this.mockUpload(report, metadata);
      }
      
      throw new Error(`Failed to upload report: ${error.message}`);
    }
  }
  
  /**
   * Mock upload for development/testing
   */
  mockUpload(report, metadata) {
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const mockData = {
      hash: mockHash,
      report: report,
      metadata: metadata,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for development
    localStorage.setItem(`mock_ipfs_${mockHash}`, JSON.stringify(mockData));
    
    return {
      success: true,
      ipfsHash: mockHash,
      url: `#mock-ipfs-${mockHash}`,
      timestamp: new Date().toISOString(),
      size: JSON.stringify(mockData).length,
      mock: true
    };
  }
  
  /**
   * Retrieve report from IPFS
   * @param {string} ipfsHash - The IPFS hash
   * @returns {Object} The stored report
   */
  async retrieveReport(ipfsHash) {
    // Check if it's a mock hash
    if (ipfsHash.startsWith('Qm') && localStorage.getItem(`mock_ipfs_${ipfsHash}`)) {
      const mockData = JSON.parse(localStorage.getItem(`mock_ipfs_${ipfsHash}`));
      return mockData;
    }
    
    try {
      const response = await axios.get(`${PINATA_GATEWAY}${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve report:', error);
      throw new Error(`Failed to retrieve report from IPFS: ${error.message}`);
    }
  }
  
  /**
   * Generate a shareable link for the report
   * @param {string} ipfsHash - The IPFS hash
   * @returns {string} Shareable URL
   */
  getShareableLink(ipfsHash) {
    if (ipfsHash.startsWith('Qm') && localStorage.getItem(`mock_ipfs_${ipfsHash}`)) {
      return `${window.location.origin}/report?mock=${ipfsHash}`;
    }
    return `${PINATA_GATEWAY}${ipfsHash}`;
  }
}

// Singleton instance
export const reportStorage = new ReportStorageService();
