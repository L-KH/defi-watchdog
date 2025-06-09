import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function AIModels() {
  const aiModels = [
    {
      name: "Google Gemma 2B",
      provider: "Google",
      type: "General Security Analysis",
      tier: "Free & Premium",
      icon: "🧠",
      confidence: "92%",
      specialties: [
        "General vulnerability detection",
        "Pattern recognition",
        "Security best practices",
        "Code structure analysis"
      ],
      strengths: [
        "Fast analysis speed",
        "High accuracy for common vulnerabilities",
        "Excellent false positive filtering",
        "Robust baseline security checks"
      ],
      description: "Our primary general-purpose security AI model, optimized for comprehensive vulnerability detection with balanced speed and accuracy."
    },
    {
      name: "DeepSeek Chat V3",
      provider: "DeepSeek",
      type: "Logic & Economic Analysis",
      tier: "Premium",
      icon: "🔍",
      confidence: "94%",
      specialties: [
        "Complex logic vulnerabilities",
        "Economic attack vectors",
        "Business logic flaws",
        "Advanced reasoning"
      ],
      strengths: [
        "Deep logical reasoning",
        "Economic vulnerability detection",
        "Complex attack vector analysis",
        "DeFi protocol understanding"
      ],
      description: "Specialized in complex reasoning and economic attacks, this model excels at identifying sophisticated vulnerabilities that require deep logical analysis."
    },
    {
      name: "DeepSeek R1",
      provider: "DeepSeek",
      type: "Code Quality & Optimization",
      tier: "Premium",
      icon: "✨",
      confidence: "91%",
      specialties: [
        "Code quality assessment",
        "Gas optimization",
        "Best practices review",
        "Performance analysis"
      ],
      strengths: [
        "Gas efficiency analysis",
        "Code quality metrics",
        "Optimization recommendations",
        "Best practices enforcement"
      ],
      description: "Focuses on code quality, gas optimization, and development best practices to help you build efficient and maintainable smart contracts."
    },
    {
      name: "Google Gemini 2.0 Flash",
      provider: "Google",
      type: "DeFi & Gas Optimization",
      tier: "Premium",
      icon: "⚡",
      confidence: "95%",
      specialties: [
        "DeFi protocol security",
        "Gas optimization",
        "MEV analysis",
        "Protocol-specific risks"
      ],
      strengths: [
        "DeFi protocol expertise",
        "Flash loan attack detection",
        "MEV vulnerability analysis",
        "Protocol interaction risks"
      ],
      description: "Our fastest and most DeFi-focused model, specialized in protocol security, gas optimization, and MEV-related vulnerabilities."
    },
    {
      name: "Llama 3.2",
      provider: "Meta",
      type: "Advanced Security Analysis",
      tier: "Premium",
      icon: "🦙",
      confidence: "93%",
      specialties: [
        "Advanced vulnerability patterns",
        "Zero-day detection",
        "Complex attack chains",
        "Novel exploit patterns"
      ],
      strengths: [
        "Novel vulnerability detection",
        "Advanced pattern recognition",
        "Complex attack analysis",
        "Research-grade precision"
      ],
      description: "Advanced AI model capable of detecting novel vulnerability patterns and complex attack chains that traditional tools might miss."
    },
    {
      name: "WizardLM 2",
      provider: "Microsoft",
      type: "Comprehensive Analysis",
      tier: "Premium",
      icon: "🧙‍♂️",
      confidence: "93%",
      specialties: [
        "Multi-faceted analysis",
        "Cross-function vulnerabilities",
        "System-wide security",
        "Holistic assessment"
      ],
      strengths: [
        "Comprehensive coverage",
        "System-wide analysis",
        "Cross-function vulnerabilities",
        "Holistic security assessment"
      ],
      description: "Provides comprehensive, wizard-like analysis covering multiple security aspects and system-wide vulnerabilities in a single pass."
    }
  ];

  const analysisProcess = [
    {
      step: "1",
      title: "Parallel Processing",
      description: "All AI models analyze your contract simultaneously for maximum speed and coverage",
      icon: "⚡"
    },
    {
      step: "2", 
      title: "Specialized Analysis",
      description: "Each model focuses on its area of expertise to provide deep, specialized insights",
      icon: "🎯"
    },
    {
      step: "3",
      title: "Cross-Validation",
      description: "Results are cross-validated between models to reduce false positives and confirm findings",
      icon: "✅"
    },
    {
      step: "4",
      title: "Unified Reporting",
      description: "All findings are consolidated into a comprehensive, actionable security report",
      icon: "📊"
    }
  ];

  const comparisonData = [
    {
      category: "Speed",
      traditional: "Minutes to hours",
      aiPowered: "1-4 minutes",
      improvement: "10-50x faster"
    },
    {
      category: "Coverage",
      traditional: "Rule-based patterns",
      aiPowered: "AI reasoning + patterns",
      improvement: "30% more findings"
    },
    {
      category: "False Positives",
      traditional: "High (20-40%)",
      aiPowered: "Low (5-10%)",
      improvement: "70% reduction"
    },
    {
      category: "Novel Vulnerabilities",
      traditional: "Limited detection",
      aiPowered: "Advanced reasoning",
      improvement: "Detects unknown patterns"
    }
  ];

  return (
    <Layout>
      <Head>
        <title>AI Models - DeFi Watchdog</title>
        <meta name="description" content="Learn about the 6 specialized AI models powering DeFi Watchdog's comprehensive smart contract security analysis." />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <span className="mr-2">🤖</span>
                AI Models
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Meet Our AI
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Specialists</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                6 specialized AI models working in parallel to provide the most comprehensive 
                smart contract security analysis available. Each model brings unique expertise 
                to detect vulnerabilities others might miss.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-indigo-600">6</div>
                  <div className="text-sm text-gray-600">AI Models</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-600">Specializations</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-blue-600">93%</div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">1-4min</div>
                  <div className="text-sm text-gray-600">Analysis Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Models Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Our AI Security Specialists
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aiModels.map((model, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{model.icon}</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          {model.confidence}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                      <p className="text-indigo-100 text-sm mb-2">{model.provider}</p>
                      <p className="text-white/90 text-sm">{model.type}</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          model.tier === "Free & Premium" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {model.tier}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {model.description}
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Specialties:</h4>
                        <div className="space-y-2">
                          {model.specialties.map((specialty, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                              {specialty}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Strengths:</h4>
                        <div className="flex flex-wrap gap-1">
                          {model.strengths.slice(0, 2).map((strength, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Process */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  How Our AI Analysis Works
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Our AI models work together in a sophisticated pipeline to provide 
                  comprehensive, accurate, and fast security analysis.
                </p>
              </div>
              
              <div className="relative">
                {/* Connecting line */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 transform -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {analysisProcess.map((process, index) => (
                    <div key={index} className="relative">
                      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                          {process.step}
                        </div>
                        
                        <div className="mt-6">
                          <div className="text-3xl mb-4">{process.icon}</div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{process.title}</h3>
                          <p className="text-gray-600 text-sm">{process.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI vs Traditional Comparison */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  AI-Powered vs Traditional Analysis
                </h2>
                <p className="text-lg text-gray-600">
                  See how our AI-powered approach compares to traditional static analysis tools.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold">Metric</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Traditional Tools</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">AI-Powered Analysis</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Improvement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 font-semibold text-gray-900">{row.category}</td>
                          <td className="px-6 py-4 text-gray-600">{row.traditional}</td>
                          <td className="px-6 py-4 text-gray-600">{row.aiPowered}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">{row.improvement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Technical Architecture
                </h2>
                <p className="text-lg text-gray-600">
                  Built on cutting-edge AI infrastructure for maximum performance and reliability.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-4">🏗️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Parallel Processing</h3>
                  <p className="text-gray-600 text-sm">
                    All 6 AI models analyze your contract simultaneously, reducing analysis time 
                    from hours to minutes while maintaining accuracy.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-4">🧮</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Advanced Reasoning</h3>
                  <p className="text-gray-600 text-sm">
                    Large language models with billions of parameters understand code context 
                    and logic to identify complex vulnerabilities.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialized Training</h3>
                  <p className="text-gray-600 text-sm">
                    Each model is fine-tuned for specific security domains, from DeFi protocols 
                    to gas optimization and code quality.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-4">🔄</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Continuous Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Models are regularly updated with new vulnerability patterns and 
                    attack vectors discovered in the wild.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-4">🛡️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Consensus Validation</h3>
                  <p className="text-gray-600 text-sm">
                    Multiple models validate findings to reduce false positives and 
                    increase confidence in results.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-time Monitoring</h3>
                  <p className="text-gray-600 text-sm">
                    Track analysis progress in real-time with detailed status updates 
                    for each AI model's progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience AI-Powered Security Analysis
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Try our 6-model AI analysis platform and see how advanced AI can 
              revolutionize your smart contract security workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/audit"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Free AI Analysis
              </a>
              <a
                href="/audit-pro"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Get Premium Analysis
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
