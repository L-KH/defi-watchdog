// Enhanced API endpoint to save and retrieve audit reports with IPFS persistence
// File: /api/enhanced-audit-persistence.js

import { saveAuditReport, findAuditReports } from '../../lib/localStorage';
import pinataService from '../../services/pinataService';
import { generateTechnicalHtmlReport, generateStructuredJsonReport } from '../../lib/supervisor/reportGeneratorEnhanced';
import crypto from 'crypto';

/**
 * Enhanced audit persistence endpoint that handles both saving and retrieving audits
 * Supports IPFS storage and recovery for persistent access
 */
export default async function handler(req, res) {
  const { method } = req;
  
  try {
    switch (method) {
      case 'POST':
        return await handleSaveAudit(req, res);
      case 'GET':
        return await handleGetAuditByTxHash(req, res);
      default:
        return res.status(405).json({ 
          success: false,
          error: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('❌ Enhanced audit persistence error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Save audit report with enhanced IPFS persistence
 */
async function handleSaveAudit(req, res) {
  const { 
    requestId,
    contractAddress, 
    contractName,
    userAddress,
    txHash,
    auditResult,
    securityScore,
    riskLevel,
    reportData,
    forceUpdate = false
  } = req.body;

  // Validate required fields
  if (!contractAddress || !userAddress) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields: contractAddress and userAddress are required' 
    });
  }

  console.log('💾 Enhanced saving audit report...', {
    requestId,
    contractAddress: contractAddress.slice(0, 10) + '...',
    contractName,
    userAddress: userAddress.slice(0, 10) + '...',
    txHash: txHash?.slice(0, 10) + '...' || 'none',
    hasAuditResult: !!auditResult,
    hasReportData: !!reportData,
    forceUpdate
  });

  try {
    // Check if audit already exists (prevent duplicates unless forced)
    if (!forceUpdate && requestId) {
      const existingAudits = await findAuditReports({ 
        requestId: requestId,
        userAddress: userAddress.toLowerCase(),
        completed: true 
      });
      
      if (existingAudits.length > 0) {
        console.log('✅ Audit already exists, returning existing data');
        return res.status(200).json({
          success: true,
          message: 'Audit already exists',
          auditId: existingAudits[0]._id,
          requestId: requestId,
          saved: true,
          existing: true,
          ipfs: {
            success: !!existingAudits[0].reportIPFSHash,
            hash: existingAudits[0].reportIPFSHash,
            url: existingAudits[0].reportIPFSUrl,
            uploaded: !!existingAudits[0].reportIPFSHash
          }
        });
      }
    }

    // Generate comprehensive reports for IPFS
    let htmlReport = null;
    let jsonReport = null;
    
    if (auditResult) {
      try {
        const comprehensiveData = {
          metadata: {
            contractName: contractName || 'Unknown Contract',
            contractAddress: contractAddress,
            generatedAt: new Date().toISOString(),
            reportType: 'premium',
            userAddress: userAddress,
            requestId: requestId,
            txHash: txHash,
            version: '2.0',
            persistenceEnabled: true
          },
          executiveSummary: {
            overallRisk: securityScore >= 80 ? 'LOW' : securityScore >= 60 ? 'MEDIUM' : 'HIGH',
            securityScore: securityScore || 75,
            gasEfficiencyScore: auditResult.analysis?.gasOptimizationScore || 80,
            codeQualityScore: auditResult.analysis?.codeQualityScore || 85,
            overallScore: securityScore || 75,
            summary: auditResult.analysis?.summary || auditResult.analysis?.overview || 'Comprehensive security analysis completed.',
            deploymentRecommendation: securityScore >= 80 ? 'DEPLOY' : securityScore >= 60 ? 'REVIEW_REQUIRED' : 'DO_NOT_DEPLOY'
          },
          securityFindings: auditResult.analysis?.keyFindings || [],
          gasOptimizations: auditResult.analysis?.gasOptimizations || [],
          codeQualityIssues: auditResult.analysis?.codeQualityIssues || [],
          auditMetadata: {
            auditorInfo: {
              lead: 'Multi-AI Analysis',
              models: auditResult.modelsUsed || [],
              supervisor: auditResult.analysis?.supervisorVerification?.model || 'GPT-4'
            },
            analysisTime: new Date().toISOString(),
            methodologies: ['AI Security Analysis', 'Vulnerability Detection', 'Code Review'],
            toolsUsed: ['Multi-AI Engine', 'Security Pattern Detection'],
            persistenceInfo: {
              ipfsEnabled: true,
              storageRedundancy: true,
              recoveryMethods: ['IPFS', 'Local Storage', 'Database']
            }
          }
        };
        
        // Generate enhanced reports
        const htmlReportResult = generateTechnicalHtmlReport(comprehensiveData);
        htmlReport = htmlReportResult.content;
        
        const jsonReportResult = generateStructuredJsonReport(comprehensiveData);
        jsonReport = jsonReportResult.content;
        
        console.log('📊 Generated enhanced reports for persistent storage');
      } catch (error) {
        console.warn('⚠️ Failed to generate reports:', error.message);
      }
    }

    // Enhanced IPFS upload with redundancy
    let ipfsResult = null;
    try {
      console.log('🌐 Uploading to IPFS with enhanced persistence...');
      
      const enhancedAuditData = {
        // Core audit data
        requestId: requestId || crypto.randomUUID(),
        contractAddress: contractAddress.toLowerCase(),
        contractName: contractName || 'Unknown Contract',
        userAddress: userAddress.toLowerCase(),
        txHash: txHash,
        
        // Enhanced metadata for recovery
        persistenceVersion: '2.0',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        
        // Audit results with enhanced structure
        auditResult: {
          ...auditResult,
          // Add recovery metadata
          recoveryInfo: {
            canRecover: true,
            storageMethod: 'ipfs_primary',
            backupMethods: ['local_storage', 'database'],
            accessMethods: ['txHash', 'requestId', 'userAddress']
          }
        },
        securityScore: securityScore || 75,
        riskLevel: riskLevel || 'Medium',
        
        // Enhanced reports with metadata
        reports: {
          html: {
            content: htmlReport,
            generated: new Date().toISOString(),
            format: 'html',
            version: '2.0'
          },
          json: {
            content: jsonReport,
            generated: new Date().toISOString(),
            format: 'json',
            version: '2.0'
          },
          raw: reportData
        },
        
        // Recovery instructions
        recoveryInstructions: {
          byTxHash: `GET /api/enhanced-audit-persistence?txHash=${txHash}`,
          byRequestId: `GET /api/enhanced-audit-persistence?requestId=${requestId}`,
          byUserAddress: `GET /api/enhanced-audit-persistence?userAddress=${userAddress}`,
          ipfsAccess: 'Access via IPFS hash when available'
        },
        
        // Completion metadata
        completed: true,
        timestamp: Date.now(),
        network: 'sepolia',
        paidAmount: '0.003'
      };
      
      // Upload to IPFS with enhanced metadata
      ipfsResult = await pinataService.uploadAuditReport(enhancedAuditData, htmlReport);
      
      if (ipfsResult.success) {
        console.log('✅ Successfully uploaded to IPFS with enhanced persistence:', {
          hash: ipfsResult.ipfsHash,
          url: ipfsResult.ipfsUrl
        });
      } else {
        console.warn('⚠️ IPFS upload failed, using local storage fallback...');
      }
      
    } catch (error) {
      console.error('❌ Enhanced IPFS upload error:', error.message);
    }

    // Create enhanced audit record with multiple access methods
    const enhancedAuditRecord = {
      _id: requestId || crypto.randomUUID(),
      requestId: requestId || crypto.randomUUID(),
      
      // Multiple address formats for flexible querying
      address: contractAddress.toLowerCase(),
      contractAddress: contractAddress.toLowerCase(),
      contractName: contractName || 'Unknown Contract',
      
      // Multiple user formats for flexible querying  
      user: userAddress.toLowerCase(),
      userAddress: userAddress.toLowerCase(),
      
      // Transaction and payment info
      txHash: txHash || null,
      transactionHash: txHash || null, // Alternative field name
      
      // Enhanced audit results
      auditResult: auditResult || null,
      securityScore: securityScore || 0,
      riskLevel: riskLevel || 'Unknown',
      
      // Enhanced IPFS data with redundancy
      reportIPFSHash: ipfsResult?.ipfsHash || '',
      reportIPFSUrl: ipfsResult?.ipfsUrl || '',
      ipfsUploadSuccess: ipfsResult?.success || false,
      ipfsGatewayUrls: ipfsResult?.ipfsHash ? [
        `https://gateway.pinata.cloud/ipfs/${ipfsResult.ipfsHash}`,
        `https://ipfs.io/ipfs/${ipfsResult.ipfsHash}`,
        `https://cloudflare-ipfs.com/ipfs/${ipfsResult.ipfsHash}`
      ] : [],
      
      // Enhanced report data with versioning
      reportData: reportData || null,
      htmlReport: htmlReport,
      jsonReport: jsonReport,
      reportVersion: '2.0',
      
      // Enhanced status tracking
      completed: true,
      persistent: true,
      recoverable: true,
      
      // Enhanced timestamps
      timestamp: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date(),
      
      // Network and payment info
      network: 'sepolia',
      paidAmount: '0.003',
      paymentConfirmed: !!txHash,
      
      // Recovery metadata
      recoveryMethods: ['ipfs', 'localStorage', 'database'],
      accessKeys: [
        `txHash:${txHash}`,
        `requestId:${requestId}`,
        `userAddress:${userAddress.toLowerCase()}`,
        `contractAddress:${contractAddress.toLowerCase()}`
      ].filter(Boolean)
    };

    console.log('💾 Enhanced audit record structure:', {
      hasRequiredFields: !!(enhancedAuditRecord.address && enhancedAuditRecord.userAddress),
      recordId: enhancedAuditRecord._id,
      completed: enhancedAuditRecord.completed,
      hasIPFS: !!enhancedAuditRecord.reportIPFSHash,
      hasMultipleAccessKeys: enhancedAuditRecord.accessKeys.length,
      persistent: enhancedAuditRecord.persistent,
      recoverable: enhancedAuditRecord.recoverable
    });

    // Save with enhanced persistence
    const savedRecord = await saveAuditReport(enhancedAuditRecord);
    
    console.log('✅ Enhanced audit report saved successfully:', {
      savedId: savedRecord._id,
      address: savedRecord.address?.slice(0, 10) + '...',
      ipfsHash: savedRecord.reportIPFSHash?.slice(0, 10) + '...' || 'none',
      persistent: savedRecord.persistent,
      recoverable: savedRecord.recoverable
    });

    return res.status(200).json({
      success: true,
      message: 'Enhanced audit report saved successfully with persistence',
      auditId: savedRecord._id,
      requestId: savedRecord.requestId,
      saved: true,
      persistent: true,
      recoverable: true,
      
      // Enhanced IPFS information
      ipfs: {
        success: ipfsResult?.success || false,
        hash: ipfsResult?.ipfsHash || null,
        url: ipfsResult?.ipfsUrl || null,
        uploaded: !!ipfsResult?.ipfsHash,
        gatewayUrls: savedRecord.ipfsGatewayUrls || []
      },
      
      // Recovery information
      recovery: {
        methods: savedRecord.recoveryMethods,
        accessKeys: savedRecord.accessKeys,
        endpoints: {
          byTxHash: txHash ? `/api/enhanced-audit-persistence?txHash=${txHash}` : null,
          byRequestId: `/api/enhanced-audit-persistence?requestId=${savedRecord.requestId}`,
          byUserAddress: `/api/enhanced-audit-persistence?userAddress=${userAddress}`
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in enhanced audit saving:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to save enhanced audit report',
      details: 'Internal server error while saving enhanced audit report'
    });
  }
}

/**
 * Retrieve audit report by various identifiers with IPFS fallback
 */
async function handleGetAuditByTxHash(req, res) {
  const { txHash, requestId, userAddress, contractAddress, includeIPFS = true } = req.query;
  
  if (!txHash && !requestId && !userAddress && !contractAddress) {
    return res.status(400).json({
      success: false,
      error: 'At least one identifier required: txHash, requestId, userAddress, or contractAddress'
    });
  }
  
  console.log('🔍 Retrieving audit with enhanced persistence...', {
    txHash: txHash?.slice(0, 10) + '...' || 'none',
    requestId: requestId?.slice(0, 10) + '...' || 'none',
    userAddress: userAddress?.slice(0, 10) + '...' || 'none',
    contractAddress: contractAddress?.slice(0, 10) + '...' || 'none',
    includeIPFS
  });
  
  try {
    // Build flexible query with multiple search criteria
    const searchQueries = [];
    
    if (txHash) {
      searchQueries.push(
        { txHash: txHash },
        { transactionHash: txHash }
      );
    }
    
    if (requestId) {
      searchQueries.push({ requestId: requestId });
    }
    
    if (userAddress) {
      searchQueries.push(
        { userAddress: userAddress.toLowerCase() },
        { user: userAddress.toLowerCase() }
      );
    }
    
    if (contractAddress) {
      searchQueries.push(
        { contractAddress: contractAddress.toLowerCase() },
        { address: contractAddress.toLowerCase() }
      );
    }
    
    // Try each search query until we find a match
    let foundAudit = null;
    for (const query of searchQueries) {
      const results = await findAuditReports(query, { 
        sortBy: 'createdAt', 
        sortDesc: true,
        limit: 1 
      });
      
      if (results.length > 0) {
        foundAudit = results[0];
        console.log('✅ Found audit via query:', query);
        break;
      }
    }
    
    if (!foundAudit) {
      console.log('❌ No audit found with provided identifiers');
      return res.status(404).json({
        success: false,
        error: 'No audit found with provided identifiers',
        searchedFor: { txHash, requestId, userAddress, contractAddress }
      });
    }
    
    // Enhanced audit data with IPFS recovery if needed
    let enhancedAudit = { ...foundAudit };
    
    // Try to recover from IPFS if local data is incomplete and IPFS hash exists
    if (includeIPFS === 'true' && foundAudit.reportIPFSHash && 
        (!foundAudit.auditResult || !foundAudit.htmlReport)) {
      
      console.log('🌐 Attempting IPFS recovery for incomplete local data...');
      
      try {
        // Try multiple IPFS gateways for redundancy
        const ipfsGateways = foundAudit.ipfsGatewayUrls || [
          `https://gateway.pinata.cloud/ipfs/${foundAudit.reportIPFSHash}`,
          `https://ipfs.io/ipfs/${foundAudit.reportIPFSHash}`,
          `https://cloudflare-ipfs.com/ipfs/${foundAudit.reportIPFSHash}`
        ];
        
        let ipfsData = null;
        for (const gatewayUrl of ipfsGateways) {
          try {
            console.log('🔄 Trying IPFS gateway:', gatewayUrl.slice(0, 50) + '...');
            const response = await fetch(gatewayUrl, { timeout: 10000 });
            if (response.ok) {
              ipfsData = await response.json();
              console.log('✅ Successfully recovered data from IPFS');
              break;
            }
          } catch (gatewayError) {
            console.warn('⚠️ IPFS gateway failed:', gatewayError.message);
            continue;
          }
        }
        
        if (ipfsData) {
          // Merge IPFS data with local data
          enhancedAudit = {
            ...enhancedAudit,
            auditResult: enhancedAudit.auditResult || ipfsData.auditResult,
            htmlReport: enhancedAudit.htmlReport || ipfsData.reports?.html?.content,
            jsonReport: enhancedAudit.jsonReport || ipfsData.reports?.json?.content,
            reportData: enhancedAudit.reportData || ipfsData.reports?.raw,
            recoveredFromIPFS: true,
            ipfsRecoveryTimestamp: new Date().toISOString()
          };
          
          console.log('✅ Enhanced audit with IPFS recovery data');
        }
      } catch (ipfsError) {
        console.warn('⚠️ IPFS recovery failed:', ipfsError.message);
      }
    }
    
    console.log('✅ Retrieved enhanced audit successfully:', {
      auditId: enhancedAudit._id,
      hasAuditResult: !!enhancedAudit.auditResult,
      hasHTMLReport: !!enhancedAudit.htmlReport,
      hasIPFSHash: !!enhancedAudit.reportIPFSHash,
      recoveredFromIPFS: !!enhancedAudit.recoveredFromIPFS,
      persistent: enhancedAudit.persistent,
      recoverable: enhancedAudit.recoverable
    });
    
    return res.status(200).json({
      success: true,
      audit: enhancedAudit,
      searchCriteria: { txHash, requestId, userAddress, contractAddress },
      recovery: {
        availableMethods: enhancedAudit.recoveryMethods || ['database'],
        hasIPFSBackup: !!enhancedAudit.reportIPFSHash,
        ipfsRecovered: !!enhancedAudit.recoveredFromIPFS
      }
    });
    
  } catch (error) {
    console.error('❌ Error retrieving enhanced audit:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve audit',
      details: 'Internal server error while retrieving audit'
    });
  }
}
