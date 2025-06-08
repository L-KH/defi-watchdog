// CLIENT-SIDE ONLY AI Analysis API - Pure Browser Analysis
import { clientSideAnalyzer } from '../../lib/clientSideAI';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '2mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceCode, contractName, options = {} } = req.body;

    if (!sourceCode || !contractName) {
      return res.status(400).json({ 
        error: 'Missing required fields: sourceCode and contractName' 
      });
    }

    console.log(`🤖 Starting CLIENT-SIDE ONLY analysis for ${contractName}`);
    
    // Pure client-side analysis
    const result = await clientSideAnalyzer.analyzeContract(sourceCode, contractName, options);
    
    // Add metadata indicating this is client-side only
    result.analysis.analysisMethod = 'Client-side pattern analysis';
    result.analysis.runLocation = 'Server-side client analyzer';
    result.analysis.advantages = [
      'No external API dependencies',
      'Fast response time',
      'Works offline',
      'No timeout issues'
    ];
    
    console.log(`✅ Client-side analysis completed for ${contractName}`);
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ Client-side analysis error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Client-side analysis failed',
      type: 'client-side-error',
      contractName: req.body.contractName,
      analysis: {
        overview: `Client-side analysis failed for ${req.body.contractName}`,
        securityScore: 0,
        riskLevel: 'Unknown',
        keyFindings: [{
          severity: 'ERROR',
          title: 'Client Analysis Error',
          description: error.message,
          location: 'Client Analysis Engine',
          impact: 'Pattern-based analysis could not be completed',
          recommendation: 'Check contract syntax and format'
        }],
        summary: `Client-side error: ${error.message}`
      }
    });
  }
}
