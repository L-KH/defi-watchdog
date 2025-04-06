/**
 * API endpoint for fetching featured contract security reports
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In a real application, these would be fetched from a database
  // Here we're using hardcoded sample data for demonstration
  const featuredReports = [
    {
      id: 'REP-LINEA-001',
      address: '0x2d8879046f1559e53eb052e949e9544bcb72f414',
      contractName: 'Odos Router V2',
      network: 'linea',
      score: 84,
      date: '2025-03-01T12:00:00Z',
      issues: 2,
      aiAgents: 4,
      summary: 'Advanced DEX aggregator contract with multiple routing capabilities. Our AI analysis found a minor issue with gas optimization but no critical security vulnerabilities.',
      popular: true
    },
    {
      id: 'REP-LINEA-002',
      address: '0x610d2f07b7edc67565160f587f37636194c34e74',
      contractName: 'Lynex DEX',
      network: 'linea',
      score: 78,
      date: '2025-03-10T15:30:00Z',
      issues: 3,
      aiAgents: 3,
      summary: 'Decentralized exchange contract with concentrated liquidity positions. AI analysis detected some medium severity access control issues that were fixed in subsequent versions.',
      popular: true
    },
    {
      id: 'REP-SONIC-001',
      address: '0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13',
      contractName: 'SonicSwap Router',
      network: 'sonic',
      score: 91,
      date: '2025-03-15T09:00:00Z',
      issues: 0,
      aiAgents: 5,
      summary: 'Highly secure DEX router for the Sonic network with well-architected code. AI analysis confirms the contract follows all security best practices.',
      popular: true
    },
    {
      id: 'REP-LINEA-003',
      address: '0x272E156Df8DA513C69cB41cC7A99185D53F926Bb',
      contractName: 'HorizonDEX',
      network: 'linea',
      score: 52,
      date: '2025-03-05T14:20:00Z',
      issues: 8,
      aiAgents: 4,
      summary: 'Cross-chain DEX interface with moderate security concerns. AI analysis detected several high-risk vulnerabilities including reentrancy risks and improper access controls.',
      popular: false
    },
    {
      id: 'REP-SONIC-002',
      address: '0x19B25E3f1B8d35a2C5a805c0b271ECeBE1E8A4Ec',
      contractName: 'Sonic Staking Protocol',
      network: 'sonic',
      score: 73,
      date: '2025-03-12T11:45:00Z',
      issues: 4,
      aiAgents: 3,
      summary: 'Staking contract for Sonic network with adequate security. AI analysis found some medium-severity issues related to reward calculation and withdrawal limitations.',
      popular: true
    },
    {
      id: 'REP-LINEA-004',
      address: '0x4D7572040B84b41a6AA2efE4A93eFFF182388F88',
      contractName: 'Renzeo',
      network: 'linea',
      score: 65,
      date: '2025-03-08T16:15:00Z',
      issues: 5,
      aiAgents: 4,
      summary: 'Lending and borrowing protocol built for the Linea ecosystem. AI analysis identified several issues with collateral management and liquidation mechanisms.',
      popular: true
    },
    {
      id: 'REP-SONIC-003',
      address: '0xE532bA7437845CeE140AC6F16a96f9B27af10FC2',
      contractName: 'ZeroGravity Bridge',
      network: 'sonic',
      score: 35,
      date: '2025-03-07T10:30:00Z',
      issues: 12,
      aiAgents: 5,
      summary: 'Cross-chain bridge contract with serious security concerns. Multiple AI agents detected critical vulnerabilities including unsafe external calls and flawed token handling.',
      popular: false
    },
    {
      id: 'REP-LINEA-005',
      address: '0xe3CDa0A0896b70F0eBC6A1848096529AA7AEe9eE',
      contractName: 'Mendi All-in-One DeFi',
      network: 'linea',
      score: 82,
      date: '2025-03-14T13:20:00Z',
      issues: 2,
      aiAgents: 4,
      summary: 'Comprehensive DeFi protocol with lending, borrowing, and staking. AI analysis found the contract to be generally secure with minor issues in the fee calculation logic.',
      popular: true
    }
  ];

  // Filter by network if specified
  const network = req.query.network;
  let filteredReports = featuredReports;
  
  if (network) {
    filteredReports = featuredReports.filter(report => report.network === network);
  }
  
  // If popular flag is set, filter to popular reports only
  if (req.query.popular === 'true') {
    filteredReports = filteredReports.filter(report => report.popular);
  }
  
  // Limit the number of reports if specified
  const limit = parseInt(req.query.limit) || filteredReports.length;
  filteredReports = filteredReports.slice(0, limit);

  return res.status(200).json({ 
    reports: filteredReports,
    total: filteredReports.length
  });
}
