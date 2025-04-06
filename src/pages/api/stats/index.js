/**
 * Endpoint for fetching platform statistics
 */
export default function handler(req, res) {
  // In a real application, these would be fetched from a database
  // Here we're using sample data
  const stats = {
    totalContracts: 324,
    totalVulnerabilities: 892,
    averageScore: 68,
    contractsGrowth: 12,
    vulnerabilitiesGrowth: 18,
    scoreGrowth: 4,
    aiAgents: 5,
    networkDistribution: {
      linea: 186,
      sonic: 138
    },
    vulnerabilitiesBySeverity: {
      critical: 108,
      high: 256,
      medium: 347,
      low: 181
    },
    topVulnerabilities: [
      { name: 'Reentrancy', count: 98 },
      { name: 'Access Control', count: 87 },
      { name: 'Oracle Manipulation', count: 72 },
      { name: 'Integer Overflow', count: 65 },
      { name: 'Unchecked External Calls', count: 62 }
    ],
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(stats);
}
