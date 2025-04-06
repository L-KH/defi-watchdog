// pages/api/stats.js - Provides consistent statistics for the dashboard
export default function handler(req, res) {
  // Stats data with realistic values
  const stats = {
    totalContracts: 324,
    contractsGrowth: 12,
    totalVulnerabilities: 892,
    vulnerabilitiesGrowth: 18,
    averageScore: 68,
    scoreGrowth: 4,
    aiAgents: 5
  };

  res.status(200).json(stats);
}
