// Enhanced component that can run client-side analysis directly in browser
'use client';
import { useState, useEffect } from 'react';
import { clientSideAnalyzer } from '../../lib/clientSideAI';

export default function ClientSideAnalysisButton({ sourceCode, contractName, onAnalysisComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const runClientSideAnalysis = async () => {
    if (!sourceCode || !contractName) {
      alert('Please provide source code and contract name');
      return;
    }

    setIsAnalyzing(true);
    console.log('🤖 Starting browser-based AI analysis...');

    try {
      const result = await clientSideAnalyzer.analyzeContract(sourceCode, contractName, {
        type: 'comprehensive',
        includeGasOptimizations: true,
        includeQualityChecks: true
      });

      console.log('✅ Client-side analysis completed:', result);
      setAnalysisResult(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('❌ Client-side analysis failed:', error);
      const errorResult = {
        success: false,
        error: error.message,
        type: 'client-side-error',
        analysis: {
          overview: 'Client-side analysis failed',
          keyFindings: [{
            severity: 'ERROR',
            title: 'Analysis Error',
            description: error.message,
            location: 'Client Analysis',
            recommendation: 'Check console for details'
          }]
        }
      };
      setAnalysisResult(errorResult);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(errorResult);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={runClientSideAnalysis}
        disabled={isAnalyzing || !sourceCode}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isAnalyzing
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Running Browser AI Analysis...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>🤖</span>
            <span>Run Browser-Based AI Analysis</span>
          </div>
        )}
      </button>

      {analysisResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            ✅ Analysis Complete - {analysisResult.analysis?.keyFindings?.length || 0} findings
          </h4>
          <p className="text-sm text-green-700">
            {analysisResult.analysis?.summary || 'Analysis completed successfully'}
          </p>
          <div className="mt-2 text-xs text-green-600">
            Model: {analysisResult.model} | Time: {analysisResult.analysisTime}ms
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
        <div className="font-medium text-blue-800 mb-1">🔧 Browser-Based Analysis Features:</div>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Works entirely in your browser - no external API calls</li>
          <li>No timeouts - fast analysis under 1 second</li>
          <li>Pattern-based vulnerability detection</li>
          <li>Gas optimization opportunities</li>
          <li>Code quality assessments</li>
          <li>Works offline and bypasses API issues</li>
        </ul>
      </div>
    </div>
  );
}
