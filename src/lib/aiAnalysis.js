// Client-side AI Analysis - Uses API routes (secure)
// This version calls our server-side API instead of making direct API calls

/**
 * Main AI analysis function - Client-side version that calls server API
 */
export async function analyzeWithAI(sourceCode, contractName, options = {}) {
  const { type = 'basic', promptMode = 'normal', customPrompt = null, timeout = 120000 } = options;
  
  console.log(`🔥 Starting ${type} AI analysis for ${contractName}`);
  
  const startTime = Date.now();
  
  try {
    // Call our server-side API instead of making direct API calls
    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceCode,
        contractName,
        options: {
          type,
          promptMode,
          customPrompt,
          timeout
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ AI analysis completed successfully');
    return result;
    
  } catch (error) {
    console.error('💥 AI analysis failed:', error);
    return {
      success: false,
      error: error.message,
      type: type,
      contractName: contractName,
      analysisTime: Date.now() - startTime,
      analysis: {
        overview: `Analysis failed for ${contractName}`,
        securityScore: 0,
        riskLevel: 'Unknown',
        keyFindings: [
          {
            severity: 'ERROR',
            title: 'Analysis Error',
            description: error.message,
            recommendation: 'Check your configuration and try again'
          }
        ],
        summary: `Analysis failed: ${error.message}`
      }
    };
  }
}

// Configuration for different analysis types (kept for reference)
export const ANALYSIS_TYPES = {
  basic: {
    name: 'Basic AI Analysis',
    description: 'Single AI model for basic security check',
    timeLimit: 60000, // 1 minute
    models: ['google/gemma-2b-it'],
    tier: 'free'
  },
  premium: {
    name: 'Premium AI Analysis',  
    description: 'Multiple AI models with enhanced prompts',
    timeLimit: 180000, // 3 minutes
    models: [
      'google/gemma-2b-it',
      'deepseek/deepseek-chat-v3-0324:free',
      'deepseek/deepseek-r1:free',
      'google/gemini-2.0-flash-001'
    ],
    tier: 'premium'
  },
  comprehensive: {
    name: 'Comprehensive AI Security Audit',
    description: 'Full multi-AI analysis with supervisor verification',
    timeLimit: 480000, // 8 minutes
    includesGasOptimization: true,
    includesCodeQuality: true,
    supervisorVerification: true,
    tier: 'enterprise'
  }
};
