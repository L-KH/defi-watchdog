/**
 * API endpoint for fetching recent contract security reports
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In a real application, these would be fetched from a database
  // Here we're using hardcoded sample data for demonstration
  const recentReports = [
    {
      id: 'REP-LINEA-006',
      address: '0x8F24b2efa1221dB7FFaD4078a5E0A07E0F8b81B8',
      contractName: 'Vertex AMM',
      network: 'linea',
      score: 76,
      date: '2025-04-01T15:30:00Z',
      issues: 3,
      aiAgents: 4,
      summary: 'Automated market maker contract with dynamic fee structure. A few medium-severity issues were identified related to price manipulation.'
    },
    {
      id: 'REP-SONIC-004',
      address: '0x4F62e3A7A57A7A9C4B1ad817c7D9cCC06d45633F',
      contractName: 'SonicVault',
      network: 'sonic',
      score: 88,
      date: '2025-04-01T12:15:00Z',
      issues: 1,
      aiAgents: 5,
      summary: 'Secure yield-bearing vault contract for Sonic network. Minor gas optimization issues were identified but no significant security concerns.'
    },
    {
      id: 'REP-LINEA-007',
      address: '0x2CF48dE6109bB13DdA7c6523e8EaA3B7C6BBfe86',
      contractName: 'QuasarLending',
      network: 'linea',
      score: 42,
      date: '2025-03-31T18:45:00Z',
      issues: 9,
      aiAgents: 4,
      summary: 'Lending protocol with multiple critical vulnerabilities including reentrancy risks and improper access controls. Major revisions are recommended.'
    },
    {
      id: 'REP-SONIC-005',
      address: '0x9B234DEa87194a384ac1F0724931D5c0f231C774',
      contractName: 'SonicDAO',
      network: 'sonic',
      score: 67,
      date: '2025-03-31T09:20:00Z',
      issues: 5,
      aiAgents: 3,
      summary: 'Governance contract for Sonic-based DAO. Several medium-risk issues were identified in voting mechanisms and proposal execution.'
    },
    {
      id: 'REP-LINEA-008',
      address: '0x3A76654ADc9c8647957cf23F67a36CA8F6c27751',
      contractName: 'LineaOptions',
      network: 'linea',
      score: 59,
      date: '2025-03-30T14:10:00Z',
      issues: 6,
      aiAgents: 5,
      summary: 'Options trading protocol with significant issues in the settlement logic and oracle implementation. Some high-risk vulnerabilities require attention.'
    },
    {
      id: 'REP-SONIC-006',
      address: '0x7E9dF431A92a8F504C487D9A75DAa416E929D977',
      contractName: 'ZapperInterface',
      network: 'sonic',
      score: 83,
      date: '2025-03-30T11:00:00Z',
      issues: 2,
      aiAgents: 4,
      summary: 'Multi-protocol interface for simplified DeFi interactions. Well-structured with only minor security concerns identified.'
    }
  ];

  // Filter by network if specified
  const network = req.query.network;
  let filteredReports = recentReports;
  
  if (network) {
    filteredReports = recentReports.filter(report => report.network === network);
  }
  
  // Limit the number of reports if specified
  const limit = parseInt(req.query.limit) || filteredReports.length;
  filteredReports = filteredReports.slice(0, limit);

  return res.status(200).json({ 
    reports: filteredReports,
    total: filteredReports.length
  });
}
