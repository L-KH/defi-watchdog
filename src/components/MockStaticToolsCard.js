import React, { useState } from 'react';

export default function MockStaticToolsCard({ contractSource, contractInfo, onScan }) {
  const [isMockScanning, setIsMockScanning] = useState(false);
  const [mockResult, setMockResult] = useState(null);
  
  const generateMockAnalysis = async () => {
    if (!contractSource || !contractInfo) {
      alert('Please load a contract first to run mock analysis');
      return;
    }
    
    setIsMockScanning(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysisResult = {
      success: true,
      analysisType: 'static_mock_tools', // Explicitly mark as static analysis
      type: 'static', // Additional type marker
      metadata: {
        contractName: contractInfo.contractName || 'Test Contract',
        contractAddress: contractInfo.address,
        analyzedAt: new Date().toISOString(),
        analysisVersion: '2.0-mock',
        tools: ['MockSlither', 'MockMythril', 'MockSemgrep', 'MockSolhint', 'MockDetector']
      },
      analysis: {
        summary: 'Mock premium static analysis completed with 5 professional security tools. This comprehensive analysis provides production-ready security assessment.',
        overview: 'Professional mock audit analysis simulating real-world static analysis results with multiple tool findings.',
        securityScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100
        riskLevel: ['Low', 'Medium'][Math.floor(Math.random() * 2)],
        
        keyFindings: [
          {
            id: 'SLITHER_001',
            title: 'Potential Integer Overflow',
            severity: 'HIGH',
            description: 'Mock finding: Arithmetic operations may overflow without proper checks.',
            location: 'Line 89-102',
            recommendation: 'Use SafeMath library or Solidity 0.8+ built-in overflow protection.',
            category: 'Security',
            tool: 'MockSlither'
          },
          {
            id: 'MYTHRIL_002',
            title: 'Unchecked External Call',
            severity: 'MEDIUM',
            description: 'Mock finding: External call return value is not checked.',
            location: 'Line 156',
            recommendation: 'Always check return values of external calls and handle failures properly.',
            category: 'Security',
            tool: 'MockMythril'
          },
          {
            id: 'SEMGREP_003',
            title: 'Hardcoded Address',
            severity: 'LOW',
            description: 'Mock finding: Contract contains hardcoded addresses that reduce flexibility.',
            location: 'Line 23',
            recommendation: 'Use constructor parameters or admin functions to set addresses.',
            category: 'Best Practices',
            tool: 'MockSemgrep'
          },
          {
            id: 'SOLHINT_004',
            title: 'Function Visibility',
            severity: 'INFO',
            description: 'Mock finding: Functions could have more restrictive visibility.',
            location: 'Multiple functions',
            recommendation: 'Review function visibility and use most restrictive visibility possible.',
            category: 'Code Quality',
            tool: 'MockSolhint'
          }
        ],
        
        gasOptimizations: [
          {
            title: 'Storage Slot Optimization',
            description: 'Repack storage variables to save gas',
            potentialSavings: '5,000 gas per transaction',
            severity: 'HIGH',
            tool: 'MockSlither'
          },
          {
            title: 'Function Modifier Optimization',
            description: 'Optimize modifier usage to reduce bytecode size',
            potentialSavings: '1,200 gas deployment',
            severity: 'MEDIUM',
            tool: 'MockDetector'
          }
        ],
        
        codeQualityIssues: [
          {
            title: 'Missing Events',
            description: 'Add events for important state changes',
            location: 'setter functions',
            severity: 'MEDIUM',
            tool: 'MockSolhint'
          },
          {
            title: 'Code Documentation',
            description: 'Add comprehensive NatSpec documentation',
            location: 'All public functions',
            severity: 'LOW',
            tool: 'MockSolhint'
          }
        ],
        
        toolSpecificResults: {
          MockSlither: {
            detectors: 15,
            findings: 3,
            optimizations: 2
          },
          MockMythril: {
            vulnerabilities: 1,
            warnings: 2
          },
          MockSemgrep: {
            rules: 45,
            matches: 1
          },
          MockSolhint: {
            styleIssues: 3,
            bestPractices: 2
          },
          MockDetector: {
            customRules: 8,
            findings: 1
          }
        },
        
        gasOptimizationScore: Math.floor(Math.random() * 20) + 80,
        codeQualityScore: Math.floor(Math.random() * 25) + 75
      },
      
      toolsUsed: ['MockSlither', 'MockMythril', 'MockSemgrep', 'MockSolhint', 'MockDetector'],
      processingTime: '15.7 seconds (mock)',
      
      // Add mock reports
      htmlReport: `
        <h1>Mock Static Analysis Security Report</h1>
        <h2>Contract: ${contractInfo.contractName || 'Test Contract'}</h2>
        <p><strong>Address:</strong> ${contractInfo.address}</p>
        <p><strong>Analysis Date:</strong> ${new Date().toLocaleString()}</p>
        <h3>Tools Used</h3>
        <ul>
          <li>Slither - Static Analysis Framework</li>
          <li>Mythril - Symbolic Execution Engine</li>
          <li>Semgrep - Pattern Matching</li>
          <li>Solhint - Linting and Style</li>
          <li>Custom Detector - Advanced Patterns</li>
        </ul>
        <h3>Security Findings</h3>
        <ul>
          <li><strong>HIGH:</strong> Potential Integer Overflow</li>
          <li><strong>MEDIUM:</strong> Unchecked External Call</li>
          <li><strong>LOW:</strong> Hardcoded Address</li>
          <li><strong>INFO:</strong> Function Visibility</li>
        </ul>
        <h3>Gas Optimizations</h3>
        <ul>
          <li>Storage Slot Optimization - Save 5,000 gas</li>
          <li>Function Modifier Optimization - Save 1,200 gas</li>
        </ul>
      `,
      
      jsonReport: JSON.stringify({
        contract: contractInfo.contractName,
        address: contractInfo.address,
        tools: ['Slither', 'Mythril', 'Semgrep', 'Solhint', 'CustomDetector'],
        findings: 4,
        score: Math.floor(Math.random() * 30) + 70,
        gasOptimizations: 2,
        executionTime: '15.7s'
      }, null, 2)
    };
    
    setMockResult(mockAnalysisResult);
    setIsMockScanning(false);
    
    // Call the parent onScan function if provided
    if (onScan) {
      onScan(mockAnalysisResult);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🛠️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Premium Static Analysis Tools</h2>
              <p className="text-blue-100 text-sm">5 Professional Security Tools</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Mock</div>
            <div className="text-xl font-bold">Test</div>
            <div className="text-sm text-blue-200">🧪</div>
          </div>
        </div>
        <p className="text-blue-100 leading-relaxed">
          Professional-grade mock static analysis using 5 industry-standard security tools. 
          Perfect for testing the audit flow and payment system.
        </p>
      </div>

      <div className="p-8">
        {/* Mock Analysis Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🧪 Mock Premium Static Analysis</h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🏃</span>
              <div>
                <h4 className="font-semibold text-blue-800">Test Professional Tools Flow</h4>
                <p className="text-sm text-blue-600">Generate realistic static analysis results for testing payment & persistence</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-700 mb-4">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>5 Security Tools</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Professional Findings</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Tool-Specific Results</span>
              </div>
            </div>
            
            <button
              onClick={generateMockAnalysis}
              disabled={isMockScanning || !contractSource}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMockScanning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Running Mock Static Analysis...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Run Mock Static Analysis (FREE)
                </div>
              )}
            </button>
            
            {!contractSource && (
              <p className="text-center text-sm text-blue-600 mt-2">
                ℹ️ Load a contract first to run mock analysis
              </p>
            )}
          </div>
          
          {/* Mock Results Preview */}
          {mockResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <div>
                  <h4 className="font-semibold text-green-800">Mock Static Analysis Complete!</h4>
                  <p className="text-sm text-green-600">Professional tool analysis with {mockResult.analysis.keyFindings.length} findings from {mockResult.toolsUsed.length} tools</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-green-600">{mockResult.analysis.securityScore}</div>
                  <div className="text-gray-600">Security Score</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-blue-600">{mockResult.analysis.keyFindings.length}</div>
                  <div className="text-gray-600">Findings</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-orange-600">{mockResult.analysis.gasOptimizations.length}</div>
                  <div className="text-gray-600">Gas Opts</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-bold text-purple-600">{mockResult.toolsUsed.length}</div>
                  <div className="text-gray-600">Tools Used</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real Tools Coming Soon */}
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl mb-3">
            <span className="text-2xl">🚧</span>
          </div>
          
          <h3 className="text-md font-bold text-gray-900 mb-2">Real Premium Tools Coming Soon</h3>
          <p className="text-gray-600 mb-3 max-w-md mx-auto text-sm">
            Integrated Slither, Mythril, Semgrep, and custom security tools.
          </p>
          
          <a
            href="/audit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">🔧</span>
            Try Free Static Tools
          </a>
        </div>
      </div>
    </div>
  );
}
