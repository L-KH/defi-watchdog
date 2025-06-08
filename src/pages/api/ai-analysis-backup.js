// SMART AI Analysis API - Full Capability with Client-Side Fallback
import { analyzeWithAIServerSide } from '../../lib/aiAnalysisServer';
import { clientSideAnalyzer } from '../../lib/clientSideAI';

// Static timeout configuration for Next.js compatibility
export const config = {
  maxDuration: 9, // Set to Vercel limit - will be overridden in code for other platforms
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

    console.log(`🚀 Starting SMART AI analysis for ${contractName} (${options.type || 'basic'})`);
    
    const isVercelEnvironment = process.env.VERCEL || process.env.VERCEL_URL;
    const maxTime = isVercelEnvironment ? 8000 : 25000;
    
    // Try server-side AI first
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Analysis timeout - switching to client-side')), maxTime);
      });

      const analysisPromise = analyzeWithAIServerSide(sourceCode, contractName, {
        ...options,
        isVercelEnvironment,
        maxProcessingTime: maxTime - 1000
      });

      const result = await Promise.race([analysisPromise, timeoutPromise]);
      
      // If server-side succeeds, return it
      if (result.success) {
        return res.status(200).json(result);
      } else {
        throw new Error('Server-side analysis failed');
      }
    } catch (serverError) {
      console.log(`⚠️ Server-side failed: ${serverError.message}, switching to client-side`);
      
      // FALLBACK: Use client-side analysis
      console.log('🤖 Falling back to client-side AI analysis');
      
      try {
        const clientResult = await clientSideAnalyzer.analyzeContract(sourceCode, contractName, options);
        
        // Add fallback indicator
        clientResult.analysis.fallbackReason = 'Server-side analysis unavailable';
        clientResult.analysis.analysisMethod = 'Client-side pattern analysis';
        clientResult.model = 'Client-Side AI (Fallback)';
        
        console.log('✅ Client-side analysis completed successfully');
        return res.status(200).json(clientResult);
      } catch (clientError) {
        console.error('❌ Client-side analysis also failed:', clientError);
        throw clientError;
      }
    }
    
  } catch (error) {
    console.error('❌ All analysis methods failed:', error);
    
    // Final fallback with useful information
    return res.status(200).json({ 
      success: false,
      error: error.message || 'All analysis methods failed',
      type: 'analysis-unavailable',
      contractName: req.body.contractName,
      analysis: {
        overview: `Analysis temporarily unavailable for ${req.body.contractName}. This may be due to high server load or external API issues.`,
        securityScore: 0,
        riskLevel: 'Unknown',
        keyFindings: [
          {
            severity: 'INFO',
            title: 'Analysis Temporarily Unavailable',
            description: 'Both server-side and client-side analysis encountered issues. This may be temporary.',
            location: 'System',
            impact: 'Security analysis could not be completed at this time',
            recommendation: 'Try again in a few minutes. If the issue persists, manually review the contract or use external tools like Slither.'
          },
          {
            severity: 'INFO',
            title: 'Manual Review Recommended',
            description: 'Consider using external security tools while analysis is unavailable',
            location: 'User Action',
            impact: 'Manual security review may be needed',
            recommendation: 'Use tools like: Slither (static analysis), MythX (comprehensive), or Remix IDE (basic checks)'
          }
        ],
        summary: 'Analysis unavailable - manual review recommended',
        troubleshooting: {
          serverIssue: 'External AI models may be temporarily unavailable',
          clientIssue: 'Browser-based analysis encountered an error',
          solutions: [
            'Wait a few minutes and try again',
            'Use smaller contract code',
            'Try basic analysis instead of premium',
            'Use external security tools as fallback'
          ]
        }
      },
      timestamp: new Date().toISOString()
    });
  }
}
