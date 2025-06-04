import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const sectionRefs = useRef({});

  // Intersection Observer for animations
  useEffect(() => {
    // Initialize visibility for active tab
    setIsVisible(prev => ({ ...prev, [activeTab]: true }));
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observers = Object.entries(sectionRefs.current).map(([key, ref]) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [key]: true }));
          }
        });
      }, observerOptions);
      
      if (ref) {
        observer.observe(ref);
      }
      
      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [activeTab]); // Add activeTab as dependency

  const setRef = (key) => (ref) => {
    sectionRefs.current[key] = ref;
  };

  // Analysis flow data
  const analysisFlow = [
    {
      phase: "Input & Validation",
      description: "Contract address verification and source code fetching",
      steps: ["Address validation", "Network detection", "Source code retrieval", "Compilation verification"],
      icon: "📝",
      color: "from-blue-500 to-blue-600"
    },
    {
      phase: "Static Analysis",
      description: "Industry-standard security tools perform initial analysis",
      steps: ["Slither vulnerability scan", "Mythril symbolic execution", "Manticore analysis", "Pattern matching"],
      icon: "🔍",
      color: "from-purple-500 to-purple-600"
    },
    {
      phase: "AI Analysis",
      description: "Multiple AI models analyze in parallel with real-time tracking",
      steps: ["Model initialization", "Parallel processing", "Progress monitoring", "Result aggregation"],
      icon: "🤖",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      phase: "Report Generation",
      description: "Comprehensive security assessment and recommendations",
      steps: ["Finding consolidation", "Risk scoring", "Fix generation", "Report formatting"],
      icon: "📊",
      color: "from-pink-500 to-pink-600"
    }
  ];

  // AI Models details - UPDATED WITH ACTUAL MODELS
  const aiModels = [
    {
      name: "Google Gemma 2B",
      type: "Free & Premium",
      specialty: "General Security Analysis",
      icon: "🤖",
      capabilities: [
        "Basic vulnerability detection",
        "Common security patterns",
        "Gas usage analysis",
        "Code structure review"
      ],
      strengths: ["Fast analysis", "Reliable basic checks", "Low resource usage"],
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "DeepSeek Chat V3",
      type: "Free & Premium",
      specialty: "Advanced Security & Logic Analysis", 
      icon: "🧠",
      capabilities: [
        "Complex vulnerability detection",
        "Logic flow analysis",
        "Economic attack vectors",
        "Advanced pattern recognition"
      ],
      strengths: ["Deep logic analysis", "Context awareness", "Complex reasoning"],
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "DeepSeek R1",
      type: "Free & Premium",
      specialty: "Code Quality & Optimization",
      icon: "🔍", 
      capabilities: [
        "Code quality assessment",
        "Performance optimization",
        "Best practices validation",
        "Maintainability analysis"
      ],
      strengths: ["Code optimization", "Quality metrics", "Best practices"],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      name: "Google Gemini 2.0 Flash",
      type: "Premium Only",
      specialty: "Gas Optimization & DeFi Risks",
      icon: "⚡",
      capabilities: [
        "Gas optimization analysis",
        "DeFi-specific vulnerabilities",
        "MEV risk assessment",
        "Cross-protocol interactions"
      ],
      strengths: ["DeFi expertise", "Gas efficiency", "Protocol knowledge"],
      color: "from-pink-500 to-pink-600"
    }
  ];

  // Static analysis tools
  const staticTools = [
    {
      name: "Slither",
      description: "Solidity static analysis framework by Trail of Bits",
      icon: "🐍",
      features: [
        "70+ built-in detectors",
        "Control flow analysis",
        "Data flow analysis", 
        "Printers for code understanding"
      ],
      vulnerabilities: [
        "Reentrancy",
        "Uninitialized variables",
        "Incorrect inheritance",
        "Timestamp dependence"
      ],
      outputFormat: "JSON reports with line-by-line findings"
    },
    {
      name: "Mythril",
      description: "Security analysis tool using symbolic execution",
      icon: "⚔️",
      features: [
        "Symbolic execution engine",
        "Constraint solving",
        "Transaction sequence analysis",
        "EVM bytecode analysis"
      ],
      vulnerabilities: [
        "Integer overflows",
        "Unchecked external calls",
        "Multiple sends",
        "State access after external call"
      ],
      outputFormat: "Detailed execution traces and exploit scenarios"
    },
    {
      name: "Manticore", 
      description: "Dynamic binary analysis tool with EVM support",
      icon: "🦁",
      features: [
        "Symbolic execution",
        "Property verification",
        "Exploit generation",
        "State space exploration"
      ],
      vulnerabilities: [
        "Logic bombs",
        "Hidden backdoors",
        "Property violations",
        "Assertion failures"
      ],
      outputFormat: "Concrete test cases and property verification results"
    },
    {
      name: "Semgrep",
      description: "Pattern-based static analysis tool",
      icon: "🎯",
      features: [
        "Pattern matching",
        "Custom rule creation",
        "Multi-language support",
        "Fast scanning"
      ],
      vulnerabilities: [
        "Known bad patterns",
        "Insecure configurations",
        "API misuse",
        "Security anti-patterns"
      ],
      outputFormat: "Structured findings with confidence scores"
    },
    {
      name: "Oyente",
      description: "Academic symbolic execution tool",
      icon: "🎓",
      features: [
        "Symbolic execution",
        "Vulnerability detection",
        "Control flow analysis",
        "Research-grade precision"
      ],
      vulnerabilities: [
        "Transaction ordering dependence",
        "Timestamp dependence",
        "Mishandled exceptions",
        "Reentrancy"
      ],
      outputFormat: "Academic-style detailed analysis reports"
    }
  ];

  // Prompt modes
  const promptModes = [
    {
      name: "Normal Analysis",
      icon: "🔍",
      description: "Comprehensive standard security assessment",
      approach: "Balanced analysis covering all major vulnerability categories",
      focus: [
        "Common vulnerability patterns",
        "Best practice violations", 
        "Standard security checks",
        "Gas efficiency review"
      ],
      useCase: "General security auditing for most contracts",
      timeframe: "1-4 minutes depending on tier",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Aggressive Analysis",
      icon: "⚡",
      description: "Deep penetration testing approach with attack simulation",
      approach: "Adversarial analysis assuming malicious intent",
      focus: [
        "Advanced attack vectors",
        "Economic manipulation",
        "Complex exploit chains",
        "Edge case scenarios"
      ],
      useCase: "High-value contracts requiring maximum security",
      timeframe: "2-6 minutes with deeper analysis",
      color: "from-red-500 to-red-600"
    },
    {
      name: "Custom Instructions",
      icon: "✏️",
      description: "Tailored analysis based on specific requirements",
      approach: "User-defined focus areas and specialized checks",
      focus: [
        "Specific vulnerability types",
        "Business logic validation",
        "Compliance requirements",
        "Custom security properties"
      ],
      useCase: "Specialized contracts with unique requirements",
      timeframe: "Variable based on complexity",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <Layout>
      <Head>
        <title>How It Works - DeFi Watchdog AI Security Platform</title>
        <meta name="description" content="Comprehensive guide to DeFi Watchdog's multi-tier AI security analysis platform combining static analysis tools with advanced AI models." />
      </Head>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" ref={setRef('hero')}>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container relative z-10">
          <div className={`max-w-4xl mx-auto text-center text-white transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center py-2 px-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-6">
              <span className="animate-pulse mr-2">🔴</span>
              Comprehensive Security Analysis Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                How DeFi Watchdog
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Secures Smart Contracts
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              A deep dive into our multi-tier security analysis platform that combines 
              <strong> industry-standard static analysis tools</strong> with 
              <strong> advanced AI models</strong> for comprehensive vulnerability detection.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-gray-300">Static Tools</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">4</p>
                <p className="text-sm text-gray-300">AI Models</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-gray-300">Prompt Modes</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-gray-300">Analysis Tiers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white border-b border-gray-200" ref={setRef('tabs')}>
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'overview', label: 'Platform Overview', icon: '🔭' },
              { id: 'flow', label: 'Analysis Flow', icon: '🔄' },
              { id: 'static', label: 'Static Tools', icon: '🛠️' },
              { id: 'ai', label: 'AI Models', icon: '🤖' },
              { id: 'modes', label: 'Prompt Modes', icon: '🧠' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      {activeTab === 'overview' && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={setRef('overview')}>
          <div className="container">
            <div className="max-w-6xl mx-auto opacity-100 translate-y-0">
              
              {/* Architecture Diagram */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-12">
                <h3 className="text-2xl font-bold text-center mb-8">DeFi Watchdog Architecture</h3>
                
                <div className="relative">
                  {/* Input Layer */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center bg-blue-100 rounded-xl p-4 mb-4">
                      <span className="text-2xl mr-3">📝</span>
                      <div>
                        <h4 className="font-semibold text-blue-800">Smart Contract Input</h4>
                        <p className="text-sm text-blue-600">Address, Source Code, Network</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center mb-8">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7"></path>
                    </svg>
                  </div>

                  {/* Analysis Layer */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Static Analysis */}
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Static Analysis Layer
                      </h4>
                      <div className="space-y-3">
                        {['Slither', 'Mythril', 'Manticore', 'Semgrep', 'Oyente'].map((tool, index) => (
                          <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                      <h4 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                        <span className="mr-2">🤖</span>
                        AI Analysis Layer
                      </h4>
                      <div className="space-y-3">
                        {['Google Gemma 2B', 'DeepSeek Chat V3', 'DeepSeek R1', 'Google Gemini 2.0 Flash'].map((model, index) => (
                          <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">{model}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center mb-8">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7"></path>
                    </svg>
                  </div>

                  {/* Output Layer */}
                  <div className="text-center">
                    <div className="inline-flex items-center bg-green-100 rounded-xl p-4">
                      <span className="text-2xl mr-3">📊</span>
                      <div>
                        <h4 className="font-semibold text-green-800">Comprehensive Security Report</h4>
                        <p className="text-sm text-green-600">Findings, Scores, Recommendations, Fixes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Free Tier */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                      <span className="text-2xl">🆓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Tier</h3>
                    <p className="text-gray-600">Essential security analysis for everyone</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Analysis Components
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• All 5 static analysis tools</li>
                        <li>• 1 AI model (Google Gemma 2B)</li>
                        <li>• Normal prompt mode only</li>
                        <li>• Basic progress tracking</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Output Features
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Security score and risk level</li>
                        <li>• Basic vulnerability findings</li>
                        <li>• Simple report format</li>
                        <li>• ~1 minute analysis time</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Premium Tier */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200 ring-4 ring-purple-100">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Tier</h3>
                    <p className="text-gray-600">Professional multi-AI comprehensive analysis</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Analysis Components
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• All 5 static analysis tools</li>
                        <li>• 4 AI models running in parallel</li>
                        <li>• All 3 prompt modes available</li>
                        <li>• Real-time progress tracking</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Output Features
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Comprehensive security assessment</li>
                        <li>• Gas optimization analysis</li>
                        <li>• Code quality metrics</li>
                        <li>• Detailed fix recommendations</li>
                        <li>• Professional audit report</li>
                        <li>• ~4 minute deep analysis</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Analysis Flow */}
      {activeTab === 'flow' && (
        <section className="py-20 bg-white" ref={setRef('flow')}>
          <div className="container">
            <div className="max-w-6xl mx-auto opacity-100 translate-y-0">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete Analysis Flow</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Follow the journey of a smart contract through our comprehensive security analysis pipeline
                </p>
              </div>

              <div className="space-y-12">
                {analysisFlow.map((phase, index) => (
                  <div key={index} className="relative">
                    {/* Connecting line */}
                    {index < analysisFlow.length - 1 && (
                      <div className="absolute left-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2 z-0"></div>
                    )}
                    
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative">
                      <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center text-white font-bold shadow-lg z-10`}>
                        {index + 1}
                      </div>

                      <div className="text-center mt-6">
                        <div className="text-4xl mb-4">{phase.icon}</div>
                        <h3 className="text-2xl font-bold mb-3">{phase.phase}</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{phase.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {phase.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="bg-gray-50 rounded-lg p-4">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${phase.color} flex items-center justify-center text-white text-sm font-bold mb-2 mx-auto`}>
                                {stepIndex + 1}
                              </div>
                              <p className="text-sm font-medium text-gray-700">{step}</p>
                            </div>
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
      )}

      {/* Static Analysis Tools */}
      {activeTab === 'static' && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={setRef('static')}>
          <div className="container">
            <div className="max-w-6xl mx-auto opacity-100 translate-y-0">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Static Analysis Arsenal</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Industry-leading static analysis tools that form the foundation of our security assessment
                </p>
              </div>

              <div className="space-y-8">
                {staticTools.map((tool, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Tool Overview */}
                      <div className="text-center lg:text-left">
                        <div className="text-6xl mb-4 lg:mb-0">{tool.icon}</div>
                        <h3 className="text-2xl font-bold mb-3">{tool.name}</h3>
                        <p className="text-gray-600 mb-6">{tool.description}</p>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Output Format</h4>
                          <p className="text-sm text-blue-600">{tool.outputFormat}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Key Features
                        </h4>
                        <div className="space-y-3">
                          {tool.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center">
                              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vulnerabilities */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Detects Vulnerabilities
                        </h4>
                        <div className="space-y-3">
                          {tool.vulnerabilities.map((vuln, vulnIndex) => (
                            <div key={vulnIndex} className="bg-red-50 rounded-lg p-3">
                              <span className="text-sm font-medium text-red-700">{vuln}</span>
                            </div>
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
      )}

      {/* AI Models */}
      {activeTab === 'ai' && (
        <section className="py-20 bg-white" ref={setRef('ai')}>
          <div className="container">
            <div className="max-w-6xl mx-auto opacity-100 translate-y-0">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Model Ensemble</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Specialized AI models working together to provide comprehensive security analysis
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {aiModels.map((model, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${model.color} text-white text-2xl mb-4`}>
                        {model.icon}
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        model.type === 'Free & Premium' 
                          ? 'bg-blue-100 text-blue-700' 
                          : model.type === 'Premium Only'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {model.type}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                      <p className="text-gray-600 text-sm font-medium">{model.specialty}</p>
                    </div>

                    <div className="space-y-6">
                      {/* Capabilities */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Core Capabilities
                        </h4>
                        <div className="space-y-2">
                          {model.capabilities.map((capability, capIndex) => (
                            <div key={capIndex} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Key Strengths
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {model.strengths.map((strength, strengthIndex) => (
                            <span key={strengthIndex} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Model Collaboration Diagram */}
              <div className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-center mb-8">How AI Models Collaborate</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  {/* Parallel Processing */}
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-xl p-6 mb-4">
                      <div className="text-3xl mb-2">🔄</div>
                      <h4 className="font-semibold mb-2">Parallel Processing</h4>
                      <p className="text-sm text-gray-600">All models analyze simultaneously for maximum efficiency</p>
                    </div>
                  </div>

                  {/* Real-time Tracking */}
                  <div className="text-center">
                    <div className="bg-indigo-100 rounded-xl p-6 mb-4">
                      <div className="text-3xl mb-2">📊</div>
                      <h4 className="font-semibold mb-2">Progress Tracking</h4>
                      <p className="text-sm text-gray-600">Monitor each model's status and completion in real-time</p>
                    </div>
                  </div>

                  {/* Result Consolidation */}
                  <div className="text-center">
                    <div className="bg-pink-100 rounded-xl p-6 mb-4">
                      <div className="text-3xl mb-2">🎯</div>
                      <h4 className="font-semibold mb-2">Result Synthesis</h4>
                      <p className="text-sm text-gray-600">Combine findings from all models into comprehensive report</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prompt Modes */}
      {activeTab === 'modes' && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={setRef('modes')}>
          <div className="container">
            <div className="max-w-6xl mx-auto opacity-100 translate-y-0">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Prompt Modes</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Choose the analysis approach that best fits your security requirements and risk tolerance
                </p>
              </div>

              <div className="space-y-8">
                {promptModes.map((mode, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Mode Overview */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${mode.color} flex items-center justify-center text-white text-2xl mr-4`}>
                            {mode.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{mode.name}</h3>
                            <p className="text-gray-600">{mode.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Analysis Approach</h4>
                            <p className="text-sm text-gray-700">{mode.approach}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Best Used For</h4>
                            <p className="text-sm text-gray-700">{mode.useCase}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Analysis Time</h4>
                            <p className="text-sm text-gray-700">{mode.timeframe}</p>
                          </div>
                        </div>
                      </div>

                      {/* Focus Areas */}
                      <div>
                        <h4 className="font-semibold mb-6 text-lg">Analysis Focus Areas</h4>
                        <div className="space-y-4">
                          {mode.focus.map((focus, focusIndex) => (
                            <div key={focusIndex} className="flex items-start">
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5 flex-shrink-0`}>
                                {focusIndex + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{focus}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Example Output */}
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold mb-3">Example Analysis Output</h5>
                          <div className="space-y-2">
                            {mode.name === 'Normal Analysis' && (
                              <>
                                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">INFO: Standard reentrancy check passed</div>
                                <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">MEDIUM: Gas optimization opportunity found</div>
                                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">PASS: Access control properly implemented</div>
                              </>
                            )}
                            {mode.name === 'Aggressive Analysis' && (
                              <>
                                <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">CRITICAL: Potential economic manipulation vector</div>
                                <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">HIGH: Complex reentrancy pattern detected</div>
                                <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">MEDIUM: Front-running vulnerability in edge case</div>
                              </>
                            )}
                            {mode.name === 'Custom Instructions' && (
                              <>
                                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">CUSTOM: Analyzing specific DeFi pattern as requested</div>
                                <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">FOCUSED: Business logic validation complete</div>
                                <div className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">TAILORED: Compliance requirement check passed</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white" ref={setRef('cta')}>
        <div className="container">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Experience Our Platform?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              See our comprehensive security analysis in action. Start with our free tier or upgrade to premium for the full experience.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
              <Link href="/audit" className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                Try Free Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/audit" className="bg-white/20 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300">
                Start Premium Analysis
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-2xl mb-3">🚀</div>
                <h4 className="font-semibold mb-2">Quick Start</h4>
                <p className="text-sm opacity-80">Paste any contract address and get instant analysis</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-2xl mb-3">📊</div>
                <h4 className="font-semibold mb-2">Detailed Reports</h4>
                <p className="text-sm opacity-80">Comprehensive findings with actionable recommendations</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                <p className="text-sm opacity-80">Watch each analysis step as it happens</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;