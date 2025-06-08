// Enhanced AI Analysis with client-side fallback for Vercel deployment
import { analyzeWithAIClient, isClientSideAnalysisEnabled } from './clientAiAnalysis';

/**
 * Main AI analysis function - Tries server API first, falls back to client-side
 */
export async function analyzeWithAI(sourceCode, contractName, options = {}) {
  const { type = 'basic', promptMode = 'normal', customPrompt = null, timeout = 120000 } = options;
  
  console.log(`🔥 Starting ${type} AI analysis for ${contractName}`);
  
  const startTime = Date.now();
  
  // Check if we should use client-side analysis (for Vercel deployment)
  const useClientSide = isClientSideAnalysisEnabled() && 
    (process.env.NEXT_PUBLIC_USE_CLIENT_AI === 'true' || 
     process.env.NODE_ENV === 'production');
  
  if (useClientSide) {
    console.log('🌐 Using client-side AI analysis for Vercel compatibility');
    try {
      const result = await analyzeWithAIClient(sourceCode, contractName, {
        ...options,
        progressCallback: options.onProgress
      });
      return {
        ...result,
        analysisTime: Date.now() - startTime,
        clientSide: true
      };
    } catch (error) {
      console.error('💥 Client-side AI analysis failed:', error);
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
  
  // Try server-side API first (for local development)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for server
    
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
          timeout: 8000 // Server timeout
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Server AI analysis completed successfully');
    return result;
    
  } catch (error) {
    console.warn('⚠️ Server API failed, falling back to client-side:', error.message);
    
    // Fallback to client-side analysis
    if (isClientSideAnalysisEnabled()) {
      try {
        const result = await analyzeWithAIClient(sourceCode, contractName, {
          ...options,
          progressCallback: options.onProgress
        });
        return {
          ...result,
          analysisTime: Date.now() - startTime,
          clientSide: true,
          fallback: true
        };
      } catch (clientError) {
        console.error('💥 Client-side fallback also failed:', clientError);
      }
    }
    
    // Return error if all methods fail
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
