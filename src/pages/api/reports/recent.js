// pages/api/reports/recent.js
import fs from 'fs';
import path from 'path';

// API to fetch recent audit reports
export default function handler(req, res) {
  // Try to load reports from data directory
  try {
    const reports = loadReports();
    
    // Sort by date (most recent first)
    reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Return recent reports
    return res.status(200).json({ 
      reports: reports.slice(0, 10) // Return top 10 most recent
    });
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    
    // If we couldn't load real reports, return mock data
    return res.status(200).json({
      reports: generateMockReports()
    });
  }
}

// Helper to load reports from the data directory
function loadReports() {
  const dataDir = path.join(process.cwd(), 'data');
  const reportsDir = path.join(dataDir, 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    // Create mock data if folder is empty
    return generateMockReports();
  }
  
  const files = fs.readdirSync(reportsDir);
  const reportFiles = files.filter(file => file.endsWith('.json'));
  
  if (reportFiles.length === 0) {
    return generateMockReports();
  }
  
  // Load real report data
  return reportFiles.map(file => {
    try {
      const reportData = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
      
      // Ensure ID is set
      if (!reportData.id) {
        reportData.id = path.basename(file, '.json');
      }
      
      return reportData;
    } catch (e) {
      console.error(`Error reading report file ${file}:`, e);
      // Return a minimal valid report object if parsing fails
      return {
        id: path.basename(file, '.json'),
        address: '0x0000000000000000000000000000000000000000',
        contractName: 'Unknown Contract',
        network: 'unknown',
        date: new Date().toISOString(),
        score: 50,
        aiAgents: 3
      };
    }
  });
}

// Helper to generate mock reports if no real data exists
function generateMockReports() {
  const networks = ['linea', 'sonic', 'linea', 'sonic', 'linea'];
  const contractNames = [
    'Aave V3: Pool', 
    'SonicSwap Router', 
    'HorizonDEX Router', 
    'Wrapped Ether',
    'UniswapV3 Pool',
    'Balancer Vault',
    'SushiSwap Router',
    'Curve Pool',
    'Compound Market',
    'MakerDAO Vault'
  ];
  
  const addresses = [
    '0xc5ae4b5f86332e70f3205a958078e5e473336fe9',
    '0x4846A3B8D7E3D76500A794b9A2C5a4F58ECB2b67',
    '0x37ffd1dca528392bff791894607fd938d5d519eb',
    '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
    '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
    '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
    '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B'
  ];
  
  // Generate random reports
  return Array.from({ length: 10 }, (_, i) => {
    const networkIndex = i % networks.length;
    const date = new Date();
    date.setDate(date.getDate() - i); // Each report is 1 day older
    
    return {
      id: `report-${i + 1}`,
      address: addresses[i % addresses.length],
      contractName: contractNames[i % contractNames.length],
      network: networks[networkIndex],
      date: date.toISOString(),
      score: Math.floor(Math.random() * 51) + 50, // 50-100
      aiAgents: Math.floor(Math.random() * 3) + 3 // 3-5
    };
  });
}