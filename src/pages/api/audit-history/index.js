/**
 * API endpoint to fetch audit history for a contract
 */
export default async function handler(req, res) {
  const { address, network } = req.query;
  
  if (!address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }
  
  try {
    // In a real implementation, this would fetch from a database
    // Here, we'll generate sample history
    const history = generateSampleHistory(address, network);
    
    return res.status(200).json({
      address,
      network,
      history
    });
  } catch (error) {
    console.error('Error fetching audit history:', error);
    return res.status(500).json({ error: 'Failed to fetch audit history' });
  }
}

/**
 * Generate sample audit history for demo purposes
 */
function generateSampleHistory(address, network) {
  // Use address to generate some variation
  const addressEnd = parseInt(address.slice(-4), 16);
  const historyCount = (addressEnd % 3) + 1; // 1-3 history entries
  
  // Create history entries
  const history = [];
  const now = new Date();
  
  for (let i = 0; i < historyCount; i++) {
    // Decrement date by 2-4 weeks for each entry
    const date = new Date(now);
    date.setDate(date.getDate() - (14 + (i * 14) + (addressEnd % 14)));
    
    // Calculate security score - generally improving over time
    const baseScore = 50 + (addressEnd % 20); // Base score 50-69
    const scoreImprovement = 10 * (historyCount - i - 1); // Improvement over time
    const securityScore = Math.min(100, baseScore + scoreImprovement);
    
    // Risk level based on security score
    let riskLevel;
    if (securityScore >= 90) riskLevel = 'Safe';
    else if (securityScore >= 70) riskLevel = 'Low Risk';
    else if (securityScore >= 50) riskLevel = 'Medium Risk';
    else riskLevel = 'High Risk';
    
    // Finding counts - reduce counts over time
    const findingCounts = {
      critical: Math.max(0, 2 - i),
      high: Math.max(0, 3 - i),
      medium: Math.max(0, 4 - i - (addressEnd % 2)),
      low: 2 + (addressEnd % 3),
      info: 3 + (addressEnd % 2)
    };
    
    // Create this history entry
    history.push({
      id: `audit-${date.getTime()}-${address.slice(-6)}`,
      address,
      network,
      createdAt: date.toISOString(),
      securityScore,
      riskLevel,
      auditType: i === 0 ? 'Full Audit' : 'Follow-up Audit',
      analysis: {
        findingCounts,
      }
    });
  }
  
  return history;
}
