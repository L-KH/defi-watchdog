// pages/api/audit/submit.js
import fs from 'fs';
import path from 'path';

// This API handles saving the result of an audit and updating the stats
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auditResult = req.body;
    
    // Validate required fields
    if (!auditResult.address || !auditResult.contractName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create a unique ID for the report (or use the provided one)
    const reportId = auditResult.id || `report-${Date.now()}`;
    auditResult.id = reportId;
    
    // Set the date if not provided
    if (!auditResult.date) {
      auditResult.date = new Date().toISOString();
    }
    
    // Ensure directories exist
    const dataDir = path.join(process.cwd(), 'data');
    const reportsDir = path.join(dataDir, 'reports');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Generate a unique filename based on the contract name and address
    const sanitizedName = auditResult.contractName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileName = `${sanitizedName}-${auditResult.address.substring(0, 6)}.json`;
    const filePath = path.join(reportsDir, fileName);
    
    // Save the report
    fs.writeFileSync(filePath, JSON.stringify(auditResult, null, 2), 'utf8');
    
    // Update the stats
    await updateStats(auditResult);
    
    // Return success
    return res.status(200).json({ 
      success: true, 
      reportId,
      message: 'Audit report saved successfully'
    });
  } catch (error) {
    console.error('Error saving audit report:', error);
    return res.status(500).json({ error: 'Failed to save audit report' });
  }
}

// Helper function to update global stats
async function updateStats(auditResult) {
  try {
    // Initialize stats object
    let stats = {
      totalContracts: 0,
      contractsGrowth: 0,
      totalVulnerabilities: 0,
      vulnerabilitiesGrowth: 0,
      averageScore: 0,
      scoreGrowth: 0,
      aiAgents: 5,
      aiModels: ['OpenAI', 'Mistral', 'Deepseek', 'Llama', 'Claude'],
      lastUpdated: new Date().toISOString()
    };
    
    // Try to load existing stats
    const cacheDir = path.join(process.cwd(), '.cache');
    const statsPath = path.join(cacheDir, 'stats.json');
    
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Load existing stats if available
    if (fs.existsSync(statsPath)) {
      try {
        const statsData = fs.readFileSync(statsPath, 'utf8');
        stats = JSON.parse(statsData);
      } catch (err) {
        console.error('Error reading existing stats:', err);
      }
    }
    
    // Update stats based on new audit
    stats.totalContracts += 1;
    
    // Calculate growth percentage (12% is our baseline)
    const newContractGrowth = Math.round((1 / stats.totalContracts) * 100);
    stats.contractsGrowth = Math.max(newContractGrowth, 12);
    
    // Count vulnerabilities from the new audit
    let newVulnerabilities = 0;
    if (auditResult.analysis && auditResult.analysis.risks) {
      newVulnerabilities = auditResult.analysis.risks.length;
    } else if (auditResult.vulnerabilities) {
      newVulnerabilities = auditResult.vulnerabilities.length;
    }
    
    stats.totalVulnerabilities += newVulnerabilities;
    
    // Calculate vulnerabilities growth rate (18% is our baseline)
    const newVulnGrowth = Math.round((newVulnerabilities / stats.totalVulnerabilities) * 100);
    stats.vulnerabilitiesGrowth = Math.max(newVulnGrowth, 18);
    
    // Update average security score (running average)
    const newScore = auditResult.securityScore || 
                     (auditResult.analysis ? auditResult.analysis.securityScore : 0) || 
                     auditResult.score || 
                     0;
                     
    // Calculate new average score
    if (stats.totalContracts > 1) {
      // Weighted average: ((prevAvg * (n-1)) + newScore) / n
      const prevTotal = stats.averageScore * (stats.totalContracts - 1);
      stats.averageScore = Math.round((prevTotal + newScore) / stats.totalContracts);
    } else {
      stats.averageScore = newScore;
    }
    
    // Calculate score growth (4 points is our baseline)
    const scoreDiff = stats.averageScore - (stats.averageScore - 4);
    stats.scoreGrowth = Math.max(scoreDiff, 4);
    
    // Update timestamp
    stats.lastUpdated = new Date().toISOString();
    
    // Save updated stats
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
    
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
}