// AI Report Cards Component - Individual AI Analysis Results
'use client';
import { useState } from 'react';

export default function AIReportCards({ aiReportCards = [], categoryAnalysis = {} }) {
  const [expandedCard, setExpandedCard] = useState(null);

  if (!aiReportCards || aiReportCards.length === 0) {
    return null;
  }

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 80) return 'text-blue-600 bg-blue-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Specialist Reports</h2>
              <p className="text-purple-100 text-sm">Individual analysis from specialized AI models</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100">Multi-AI</div>
            <div className="text-xl font-bold">{aiReportCards.length}</div>
            <div className="text-sm text-purple-100">Specialists</div>
          </div>
        </div>
        <p className="text-purple-100 leading-relaxed">
          Each AI specialist focuses on specific security domains to provide comprehensive analysis coverage.
        </p>
      </div>

      {/* AI Report Cards Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {aiReportCards.map((card) => (
            <div
              key={card.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => toggleCard(card.id)}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{card.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{card.name}</h3>
                      <p className="text-sm text-gray-600">{card.specialty}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(card.confidence)}`}>
                    {card.confidence}% confident
                  </div>
                </div>
                
                {/* Status and Model */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 capitalize">{card.status}</span>
                  </div>
                  <span className="text-gray-500 font-mono text-xs">{card.model}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Summary */}
                <p className="text-sm text-gray-700 mb-4">{card.summary}</p>

                {/* Quick Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{card.findings?.length || 0}</div>
                    <div className="text-xs text-gray-500">Findings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">{card.confidence}%</div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {card.findings?.filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL').length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Critical+</div>
                  </div>
                </div>

                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center">
                  <div className={`transform transition-transform duration-200 ${expandedCard === card.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCard === card.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Detailed Findings</h4>
                  
                  {card.findings && card.findings.length > 0 ? (
                    <div className="space-y-3">
                      {card.findings.map((finding, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm">{finding.title}</span>
                            {finding.severity && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(finding.severity)}`}>
                                {finding.severity}
                              </span>
                            )}
                            {finding.impact && !finding.severity && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(finding.impact)}`}>
                                {finding.impact}
                              </span>
                            )}
                          </div>
                          {finding.description && (
                            <p className="text-xs text-gray-600">{finding.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-green-600 text-2xl mb-2">✅</div>
                      <p className="text-sm text-gray-600">No issues found in this category</p>
                    </div>
                  )}

                  {/* Analysis Summary for this AI */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Analysis Summary</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Issues:</span>
                        <span className="ml-2 font-medium">{card.findings?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="ml-2 font-medium">
                          {card.findings?.some(f => f.severity === 'CRITICAL') ? 'Critical' :
                           card.findings?.some(f => f.severity === 'HIGH') ? 'High' :
                           card.findings?.some(f => f.severity === 'MEDIUM') ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Category Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security Summary - Always show with computed data */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🛡️</span>
                <h4 className="font-semibold text-red-900">Security Analysis</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Total Findings:</span>
                  <span className="font-medium text-red-900">
                    {categoryAnalysis?.security?.totalFindings || 
                     aiReportCards.reduce((total, card) => total + (card.findings?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Critical:</span>
                  <span className="font-medium text-red-900">
                    {categoryAnalysis?.security?.criticalCount || 
                     aiReportCards.reduce((total, card) => 
                       total + (card.findings?.filter(f => f.severity === 'CRITICAL').length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">High Risk:</span>
                  <span className="font-medium text-red-900">
                    {categoryAnalysis?.security?.highCount || 
                     aiReportCards.reduce((total, card) => 
                       total + (card.findings?.filter(f => f.severity === 'HIGH').length || 0), 0)}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-red-200">
                  <span className="text-red-700 text-xs">AI Models:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiReportCards.slice(0, 3).map((card, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {card.name.split(' ')[0]}
                      </span>
                    ))}
                    {aiReportCards.length > 3 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        +{aiReportCards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gas Optimization Summary - Always show with computed data */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">⚡</span>
                <h4 className="font-semibold text-yellow-900">Gas Optimization</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Optimizations:</span>
                  <span className="font-medium text-yellow-900">
                    {categoryAnalysis?.gasOptimization?.totalOptimizations || 
                     aiReportCards.reduce((total, card) => 
                       total + (card.findings?.filter(f => 
                         f.category?.toLowerCase().includes('gas') || 
                         f.title?.toLowerCase().includes('gas') ||
                         f.title?.toLowerCase().includes('optimization')
                       ).length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">AI Coverage:</span>
                  <span className="font-medium text-yellow-900">
                    {aiReportCards.filter(card => 
                      card.specialty?.toLowerCase().includes('gas') ||
                      card.specialty?.toLowerCase().includes('optimization') ||
                      card.name?.toLowerCase().includes('gas')
                    ).length} models
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-yellow-200">
                  <span className="text-yellow-700 text-xs">Focus Areas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Gas Usage
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Efficiency
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Optimization
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Quality Summary - Always show with computed data */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">✨</span>
                <h4 className="font-semibold text-blue-900">Code Quality</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Issues:</span>
                  <span className="font-medium text-blue-900">
                    {categoryAnalysis?.codeQuality?.totalIssues || 
                     aiReportCards.reduce((total, card) => 
                       total + (card.findings?.filter(f => 
                         f.category?.toLowerCase().includes('quality') || 
                         f.category?.toLowerCase().includes('code') ||
                         f.severity === 'LOW' || f.severity === 'INFO'
                       ).length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Quality Score:</span>
                  <span className="font-medium text-blue-900">
                    {categoryAnalysis?.codeQuality?.overallQuality || 
                     (aiReportCards.length > 0 ? 
                       Math.round(aiReportCards.reduce((sum, card) => sum + (card.confidence || 85), 0) / aiReportCards.length) + '%' :
                       'Good'
                     )}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <span className="text-blue-700 text-xs">Analyzed by:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {aiReportCards.length} AI Models
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Best Practices
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Standards
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Methodology */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Methodology</h3>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-900 mb-3">Specialized AI Models</h4>
                <div className="space-y-2">
                  {aiReportCards.map((card, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <span className="mr-2">{card.icon}</span>
                      <span className="text-purple-700">{card.name}</span>
                      <span className="ml-auto text-purple-600">{card.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-3">Analysis Features</h4>
                <div className="space-y-2 text-sm text-purple-700">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Multi-model consensus verification
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Domain-specific vulnerability detection
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Confidence-weighted scoring
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    False positive reduction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}