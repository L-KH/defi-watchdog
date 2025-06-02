 rounded-lg">
                      <h5 className="font-medium text-red-900">{falsePos.title || falsePos.name}</h5>
                      <p className="text-red-700 text-sm">{falsePos.reasoning || falsePos.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supervisor Recommendations */}
            {supervisorResult.recommendations && supervisorResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-blue-800">💡 Supervisor Recommendations</h4>
                <div className="space-y-3">
                  {supervisorResult.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900">{rec.title}</h5>
                      <p className="text-blue-700 text-sm">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Responses Summary */}
            {aiResult.modelResponses && (
              <div>
                <h4 className="font-medium mb-3">🤖 Individual Model Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiResult.modelResponses.map((response, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{response.model}</h5>
                        <span className={`px-2 py-1 rounded text-xs ${
                          response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {response.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      {response.success && (
                        <div className="text-sm space-y-1">
                          <p>Vulnerabilities: {response.vulnerabilities?.length || 0}</p>
                          <p>Gas Optimizations: {response.gasOptimizations?.length || 0}</p>
                          <p>Code Quality: {response.codeQuality?.length || 0}</p>
                        </div>
                      )}
                      {!response.success && (
                        <p className="text-red-600 text-sm">{response.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Security Issues</h3>
              <p className="text-sm text-gray-500">
                {allVulnerabilities.length} total issues found
              </p>
            </div>

            {allVulnerabilities.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">✅</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h4>
                <p className="text-gray-500">
                  Great! No security vulnerabilities were detected in this contract.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allVulnerabilities
                  .sort((a, b) => {
                    const severityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                    return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
                  })
                  .map((vuln, index) => (
                    <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                      vuln.severity === 'HIGH' ? 'border-red-500 bg-red-50' :
                      vuln.severity === 'MEDIUM' ? 'border-orange-500 bg-orange-50' :
                      'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {vuln.type || vuln.title || 'Security Issue'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${ScanUtils.getSeverityColor(vuln.severity)}`}>
                            {vuln.severity || 'UNKNOWN'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ScanUtils.getToolIcon(vuln.tool)} {vuln.tool}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-2">
                        {vuln.description || 'No description provided'}
                      </p>
                      
                      {(vuln.line > 0 || vuln.code) && (
                        <div className="text-sm text-gray-600 mb-2">
                          {vuln.line > 0 && <span>Line {vuln.line}</span>}
                          {vuln.code && (
                            <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs">
                              {vuln.code}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {(vuln.recommendation || vuln.impact) && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <h5 className="font-medium text-sm mb-1">Recommendation:</h5>
                          <p className="text-sm text-gray-700">
                            {vuln.recommendation || vuln.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
