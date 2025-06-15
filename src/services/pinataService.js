// Pinata IPFS Service for storing audit reports
// Works in both Node.js and browser environments

const PINATA_API_KEY = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

class PinataService {
  constructor() {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.warn('⚠️ Pinata credentials not found, IPFS uploads will be disabled');
      this.enabled = false;
    } else {
      this.enabled = true;
      console.log('🌐 Pinata IPFS service initialized');
    }
  }

  // Dynamic import for axios to work in both environments
  async getAxios() {
    if (typeof window !== 'undefined') {
      // Browser environment
      const axios = (await import('axios')).default;
      return axios;
    } else {
      // Node.js environment
      const axios = (await import('axios')).default;
      return axios;
    }
  }

  /**
   * Upload JSON data to IPFS via Pinata
   */
  async uploadJSON(data, metadata = {}) {
    if (!this.enabled) {
      throw new Error('Pinata service not configured');
    }

    try {
      console.log('📤 Uploading JSON to IPFS via Pinata...');
      
      const axios = await this.getAxios();
      
      const pinataMetadata = {
        name: metadata.name || 'Audit Report',
        keyvalues: {
          type: 'audit-report',
          contractAddress: metadata.contractAddress || 'unknown',
          timestamp: Date.now().toString(),
          ...metadata.keyvalues
        }
      };

      const requestData = {
        pinataContent: data,
        pinataMetadata: pinataMetadata,
        pinataOptions: {
          cidVersion: 1
        }
      };

      const response = await axios.post(
        `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_KEY
          }
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      console.log('✅ JSON uploaded to IPFS:', {
        hash: ipfsHash,
        url: ipfsUrl,
        size: response.data.PinSize
      });

      return {
        success: true,
        ipfsHash: ipfsHash,
        ipfsUrl: ipfsUrl,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp
      };

    } catch (error) {
      console.error('❌ Failed to upload JSON to IPFS:', error);
      throw new Error(`IPFS upload failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Upload HTML file to IPFS via Pinata
   */
  async uploadHTML(htmlContent, metadata = {}) {
    if (!this.enabled) {
      throw new Error('Pinata service not configured');
    }

    try {
      console.log('📤 Uploading HTML to IPFS via Pinata...');
      
      const axios = await this.getAxios();
      
      // Check if we're in Node.js environment
      const isNode = typeof window === 'undefined';
      let response, ipfsHash, ipfsUrl;
      
      if (isNode) {
        // Node.js environment - use different approach
        const FormData = require('form-data');
        const formData = new FormData();
        
        // Create buffer from HTML content
        const htmlBuffer = Buffer.from(htmlContent, 'utf8');
        const fileName = metadata.fileName || `audit-report-${Date.now()}.html`;
        
        formData.append('file', htmlBuffer, {
          filename: fileName,
          contentType: 'text/html'
        });
        
        // Add metadata
        const pinataMetadata = {
          name: metadata.name || 'Audit Report HTML',
          keyvalues: {
            type: 'audit-report-html',
            contractAddress: metadata.contractAddress || 'unknown',
            timestamp: Date.now().toString(),
            ...metadata.keyvalues
          }
        };
        
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

        response = await axios.post(
          `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'pinata_api_key': PINATA_API_KEY,
              'pinata_secret_api_key': PINATA_SECRET_KEY
            }
          }
        );
        
        ipfsHash = response.data.IpfsHash;
        ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
      } else {
        // Browser environment
        const formData = new FormData();
        
        // Create HTML blob
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const fileName = metadata.fileName || `audit-report-${Date.now()}.html`;
        
        formData.append('file', htmlBlob, fileName);
        
        // Add metadata
        const pinataMetadata = {
          name: metadata.name || 'Audit Report HTML',
          keyvalues: {
            type: 'audit-report-html',
            contractAddress: metadata.contractAddress || 'unknown',
            timestamp: Date.now().toString(),
            ...metadata.keyvalues
          }
        };
        
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

        response = await axios.post(
          `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'pinata_api_key': PINATA_API_KEY,
              'pinata_secret_api_key': PINATA_SECRET_KEY
            }
          }
        );
        
        ipfsHash = response.data.IpfsHash;
        ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      }

      console.log('✅ HTML uploaded to IPFS:', {
        hash: ipfsHash,
        url: ipfsUrl,
        size: response.data.PinSize
      });

      return {
        success: true,
        ipfsHash: ipfsHash,
        ipfsUrl: ipfsUrl,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp
      };

    } catch (error) {
      console.error('❌ Failed to upload HTML to IPFS:', error);
      throw new Error(`IPFS upload failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Upload complete audit report with both JSON and HTML
   */
  async uploadAuditReport(auditData, htmlReport = null) {
    if (!this.enabled) {
      throw new Error('Pinata service not configured');
    }

    try {
      console.log('📤 Uploading complete audit report to IPFS...');
      
      const contractAddress = auditData.contractAddress || auditData.address || 'unknown';
      const contractName = auditData.contractName || 'Unknown Contract';
      const timestamp = Date.now();
      
      const metadata = {
        contractAddress,
        contractName,
        timestamp,
        keyvalues: {
          contractAddress,
          contractName,
          requestId: auditData.requestId || 'unknown',
          userAddress: auditData.userAddress || 'unknown',
          securityScore: auditData.securityScore?.toString() || '0',
          riskLevel: auditData.riskLevel || 'unknown'
        }
      };

      const results = {};

      // Upload JSON data
      try {
        const jsonResult = await this.uploadJSON(auditData, {
          ...metadata,
          name: `${contractName} - Audit Report JSON`,
          fileName: `audit-${contractAddress.slice(0, 10)}-${timestamp}.json`
        });
        results.json = jsonResult;
        console.log('✅ JSON report uploaded to IPFS');
      } catch (error) {
        console.error('❌ Failed to upload JSON report:', error.message);
        results.json = { success: false, error: error.message };
      }

      // Upload HTML report if provided
      if (htmlReport) {
        try {
          const htmlResult = await this.uploadHTML(htmlReport, {
            ...metadata,
            name: `${contractName} - Audit Report HTML`,
            fileName: `audit-${contractAddress.slice(0, 10)}-${timestamp}.html`
          });
          results.html = htmlResult;
          console.log('✅ HTML report uploaded to IPFS');
        } catch (error) {
          console.error('❌ Failed to upload HTML report:', error.message);
          results.html = { success: false, error: error.message };
        }
      }

      // Return the primary JSON hash as the main reference
      const primaryResult = results.json.success ? results.json : results.html;
      
      return {
        success: primaryResult?.success || false,
        ipfsHash: primaryResult?.ipfsHash,
        ipfsUrl: primaryResult?.ipfsUrl,
        results: results,
        uploadedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Failed to upload audit report to IPFS:', error);
      throw error;
    }
  }

  /**
   * Test Pinata connection
   */
  async testConnection() {
    if (!this.enabled) {
      return { success: false, error: 'Pinata service not configured' };
    }

    try {
      console.log('🔍 Testing Pinata connection...');
      
      const axios = await this.getAxios();
      
      const response = await axios.get(`${PINATA_BASE_URL}/data/testAuthentication`, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      });

      console.log('✅ Pinata connection successful:', response.data);
      
      return {
        success: true,
        message: response.data.message,
        authenticated: true
      };

    } catch (error) {
      console.error('❌ Pinata connection failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        authenticated: false
      };
    }
  }

  /**
   * Get file info from IPFS hash
   */
  async getFileInfo(ipfsHash) {
    try {
      const axios = await this.getAxios();
      const response = await axios.head(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return {
        success: true,
        exists: true,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length'],
        url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      };
    } catch (error) {
      return {
        success: false,
        exists: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const pinataService = new PinataService();
export default pinataService;

// Also export the class for testing
export { PinataService };
