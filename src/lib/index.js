// Central export file for AI analysis modules
// This fixes dynamic import issues in webpack builds

// Re-export client AI analysis
export { analyzeWithAIClient, isClientSideAnalysisEnabled } from './clientAiAnalysis';

// Re-export main AI analysis
export { analyzeWithAI, ANALYSIS_TYPES } from './aiAnalysis';

// Re-export comprehensive audit
export { runComprehensiveAudit } from './comprehensive-audit';

// Make available globally for dynamic imports
if (typeof window !== 'undefined') {
  window.__aiModules = {
    clientAiAnalysis: () => import('./clientAiAnalysis'),
    aiAnalysis: () => import('./aiAnalysis'),
    comprehensiveAudit: () => import('./comprehensive-audit')
  };
}
