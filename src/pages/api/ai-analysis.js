// API Route for AI Analysis - Server-side only (secure)
import { analyzeWithAIServerSide } from '../../lib/aiAnalysisServer';

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

    console.log(`🚀 Starting AI analysis for ${contractName}`);
    
    const result = await analyzeWithAIServerSide(sourceCode, contractName, options);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ AI analysis API error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
