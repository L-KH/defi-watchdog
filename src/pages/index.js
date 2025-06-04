import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Layout from '../components/layout/Layout';

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    analysis: false,
    workflow: false,
    security: false,
    cta: false
  });
  
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    analysis: useRef(null),
    workflow: useRef(null),
    security: useRef(null),
    cta: useRef(null)
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observers = Object.entries(sectionRefs).map(([key, ref]) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [key]: true }));
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Auto-show the hero section
  useEffect(() => {
    setIsVisible(prev => ({ ...prev, hero: true }));
  }, []);

  // ENHANCED Main features data with comprehensive information
  const features = [
    {
      icon: "🛡️",
      title: "Industry-Leading Static Analysis",
      description: "5 powerful static analysis tools including Slither, Mythril, and Manticore provide comprehensive baseline security checks with 70+ vulnerability detectors.",
      tools: ["Slither (70+ detectors)", "Mythril (symbolic execution)", "Manticore (property verification)", "Semgrep (pattern matching)", "Oyente (academic precision)"],
      detections: ["Reentrancy attacks", "Integer overflows", "Access control issues", "Gas optimization", "Logic bombs"]
    },
    {
      icon: "🤖",
      title: "Advanced AI Model Ensemble",
      description: "4 specialized AI models work in parallel, each with unique strengths for different vulnerability types and analysis approaches.",
      models: ["Google Gemma 2B (General Security)", "DeepSeek Chat V3 (Logic Analysis)", "DeepSeek R1 (Code Quality)", "Google Gemini 2.0 Flash (DeFi Risks)"],
      specialties: ["Economic attack vectors", "Complex reasoning", "Gas optimization", "DeFi-specific vulnerabilities"]
    },
    {
      icon: "🧠",
      title: "Intelligent Prompt Modes",
      description: "Three distinct analysis approaches: Normal for standard audits, Aggressive for penetration testing, and Custom for specialized requirements.",
      modes: ["Normal (Balanced analysis)", "Aggressive (Attack simulation)", "Custom (Tailored requirements)"],
      approaches: ["Standard security patterns", "Adversarial analysis", "Business logic validation", "Compliance checks"]
    },
    {
      icon: "⚡",
      title: "Real-time Progress Tracking",
      description: "Monitor each analysis phase with live progress updates, model status, and detailed failure diagnostics for complete transparency.",
      features: ["Live model progress", "Status monitoring", "Error diagnostics", "Performance metrics"],
      benefits: ["Complete transparency", "Debugging insights", "Quality assurance", "Time optimization"]
    },
    {
      icon: "📊",
      title: "Comprehensive Security Reports",
      description: "Multi-format reports with security scores, vulnerability findings, gas optimization, and actionable fix recommendations.",
      outputs: ["Security scoring", "Risk assessment", "Gas analysis", "Code quality metrics"],
      formats: ["JSON/CSV/HTML/XML", "Professional audit reports", "Actionable recommendations", "Executive summaries"]
    },
    {
      icon: "🌐",
      title: "Multi-Network Support",
      description: "Analyze contracts across 10+ blockchain networks including Ethereum, Polygon, BSC, Arbitrum, Optimism, and more.",
      networks: ["Ethereum Mainnet", "Polygon", "BSC", "Arbitrum", "Optimism", "Linea", "Sonic", "Base", "Avalanche", "Fantom"],
      features: ["Cross-chain compatibility", "Network-specific patterns", "Explorer integration", "Unified interface"]
    }
  ];

  // Analysis tiers
  const analysisTiers = [
    {
      name: "Free Tier",
      icon: "🆓",
      price: "Free",
      description: "Essential security analysis with single AI model",
      features: [
        "1 AI Model (Google Gemma 2B)",
        "All 5 static analysis tools",
        "Basic vulnerability detection",
        "Standard security patterns",
        "Simple report format",
        "~1 minute analysis"
      ],
      color: "from-green-500 to-emerald-600",
      popular: false
    },
    {
      name: "Premium Tier", 
      icon: "🚀",
      price: "$0.10",
      priceNote: "per analysis",
      description: "Professional multi-AI analysis with advanced features",
      features: [
        "4 AI Models in parallel",
        "All 5 static analysis tools",
        "Advanced vulnerability detection", 
        "Multiple prompt modes",
        "Real-time progress tracking",
        "Gas optimization analysis",
        "Code quality assessment",
        "Comprehensive reporting",
        "~4 minute deep analysis"
      ],
      color: "from-purple-500 to-indigo-600",
      popular: true
    }
  ];

  // Workflow steps with enhanced detail
  const workflowSteps = [
    {
      number: "01",
      title: "Input Contract",
      description: "Paste any verified smart contract address from supported networks",
      details: "Supports 10+ networks: Ethereum, Polygon, BSC, Arbitrum, Optimism, Linea, Sonic, Base, and more",
      color: "from-blue-500 to-blue-600",
      icon: "📝"
    },
    {
      number: "02", 
      title: "Static Analysis",
      description: "Run 5 industry-standard static analysis tools in parallel",
      details: "Slither, Mythril, Manticore, Semgrep, and Oyente provide comprehensive baseline security checks",
      color: "from-purple-500 to-purple-600",
      icon: "🔍"
    },
    {
      number: "03",
      title: "AI Analysis",
      description: "4 specialized AI models analyze in parallel with real-time tracking",
      details: "Watch each AI model's progress and see which ones succeed or fail with detailed diagnostics",
      color: "from-indigo-500 to-indigo-600",
      icon: "🤖"
    },
    {
      number: "04",
      title: "Report Generation",
      description: "Get comprehensive findings with actionable recommendations",
      details: "Security scores, gas optimizations, detailed fix suggestions, and professional audit reports",
      color: "from-pink-500 to-pink-600",
      icon: "📊"
    }
  ];

  // Enhanced security tools showcase with all 9 tools
  const securityTools = [
    {
      name: "Slither",
      description: "Solidity static analysis framework by Trail of Bits",
      icon: "🐍",
      capabilities: ["70+ vulnerability detectors", "Control flow analysis", "Solidity best practices"],
      type: "static"
    },
    {
      name: "Mythril",
      description: "Security analysis tool using symbolic execution",
      icon: "⚔️", 
      capabilities: ["Symbolic execution", "Taint analysis", "Transaction sequence analysis"],
      type: "static"
    },
    {
      name: "Manticore",
      description: "Dynamic binary analysis tool with EVM support",
      icon: "🦁",
      capabilities: ["Property verification", "Exploit generation", "State space exploration"],
      type: "static"
    },
    {
      name: "Semgrep",
      description: "Pattern-based static analysis engine",
      icon: "🎯",
      capabilities: ["Pattern matching", "Custom rules", "Fast scanning"],
      type: "static"
    },
    {
      name: "Oyente",
      description: "Academic symbolic execution tool",
      icon: "🎓",
      capabilities: ["Research-grade precision", "Academic validation", "Deep analysis"],
      type: "static"
    }
  ];

  // AI Models data
  const aiModels = [
    { name: "Google Gemma 2B", icon: "🤖", specialty: "General Security Analysis", strength: "Fast & Reliable", description: "Comprehensive vulnerability detection with balanced speed and accuracy" },
    { name: "DeepSeek Chat V3", icon: "🧠", specialty: "Logic & Economic Analysis", strength: "Deep Reasoning", description: "Advanced pattern recognition for complex logic vulnerabilities" },
    { name: "DeepSeek R1", icon: "🔍", specialty: "Code Quality & Optimization", strength: "Best Practices", description: "Gas optimization and code quality assessment" },
    { name: "Google Gemini 2.0 Flash", icon: "⚡", specialty: "DeFi & Gas Optimization", strength: "Protocol Expert", description: "Specialized in DeFi protocols and gas efficiency" }
  ];

  return (
    <Layout>
      <Head>
        <title>DeFi Watchdog - AI-Powered Smart Contract Security Platform</title>
        <meta name="description" content="The most comprehensive smart contract security platform combining 5 industry-standard static analysis tools with 4 specialized AI models. Professional-grade security audits in minutes." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28" ref={sectionRefs.hero}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-[10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 left-[5%] w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-[10%] right-[20%] w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-6">
                <span className="animate-pulse mr-2">🔴</span>
                9 Security Analysis Tools Platform
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Know Your Smart Contract
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Before You Interact
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                The most comprehensive smart contract security platform combining <strong>5 industry-standard static analysis tools</strong> with 
                <strong> 4 specialized AI models</strong>. From basic vulnerability detection to advanced DeFi risk analysis, 
                get professional-grade security audits in minutes with real-time progress tracking.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link href="/audit" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  Start Security Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
                <Link href="/how-it-works" className="group bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                  How It Works
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Enhanced live stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <p className="text-gray-400 text-sm">Security Tools</p>
                  <p className="text-2xl font-bold text-white">9</p>
                  <p className="text-xs text-gray-300">5 Static + 4 AI</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <p className="text-gray-400 text-sm">Networks Supported</p>
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="text-xs text-gray-300">EVM Compatible</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <p className="text-gray-400 text-sm">Analysis Modes</p>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-gray-300">Normal/Aggressive/Custom</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <p className="text-gray-400 text-sm">Report Formats</p>
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-gray-300">JSON/CSV/HTML/XML/PDF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Tiers Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={sectionRefs.analysis}>
        <div className="container">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible.analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Choose Your Analysis Tier
            </h2>
            <p className="text-gray-600 text-lg">
              From free comprehensive analysis to premium multi-AI deep audits with real-time tracking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {analysisTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl p-8 shadow-xl border-2 transition-all duration-1000 hover:shadow-2xl hover:-translate-y-2 ${
                  tier.popular 
                    ? 'border-purple-200 ring-4 ring-purple-100' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isVisible.analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${200 * index}ms` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.color} text-white text-2xl mb-4`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    {tier.priceNote && <span className="text-gray-500">{tier.priceNote}</span>}
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link 
                    href="/audit" 
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-center block transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Start {tier.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED Features Section */}
      <section className="py-20 bg-white" ref={sectionRefs.features}>
        <div className="container">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Complete Security Analysis Platform
            </h2>
            <p className="text-gray-600 text-lg">
              9 powerful security analysis tools working together: 5 industry-standard static analyzers + 4 specialized AI models
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center text-2xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                {/* Enhanced feature lists with categories */}
                <div className="space-y-4">
                  {(feature.tools || feature.models || feature.modes || feature.networks) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        {feature.tools ? 'Tools & Capabilities:' : 
                         feature.models ? 'AI Models:' : 
                         feature.modes ? 'Analysis Modes:' :
                         feature.networks ? 'Supported Networks:' : 'Features:'}
                      </h4>
                      <div className="space-y-1">
                        {(feature.tools || feature.models || feature.modes || feature.networks)?.slice(0, 4).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 flex-shrink-0"></div>
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(feature.detections || feature.specialties || feature.approaches || feature.benefits || feature.outputs || feature.formats) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        {feature.detections ? 'Key Detections:' :
                         feature.specialties ? 'Specialties:' :
                         feature.approaches ? 'Approaches:' :
                         feature.benefits ? 'Benefits:' :
                         feature.outputs ? 'Output Types:' :
                         feature.formats ? 'Report Formats:' : 'Additional:'}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(feature.detections || feature.specialties || feature.approaches || feature.benefits || feature.outputs || feature.formats)?.slice(0, 3).map((item, itemIndex) => (
                          <span key={itemIndex} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLETELY ENHANCED Security Tools Arsenal */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white" ref={sectionRefs.security}>
        <div className="container">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              9-Tool Security Analysis Arsenal
            </h2>
            <p className="text-gray-300 text-lg">
              The most comprehensive smart contract security platform: 5 industry-standard static analyzers + 4 specialized AI models
            </p>
          </div>

          {/* Static Tools Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-purple-300">
              🔍 Static Analysis Foundation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {securityTools.map((tool, index) => (
                <div 
                  key={index}
                  className={`bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 ${isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${150 * index}ms` }}
                >
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h4 className="text-lg font-bold mb-3">{tool.name}</h4>
                  <p className="text-gray-300 text-sm mb-4">{tool.description}</p>
                  <div className="space-y-2">
                    {tool.capabilities.slice(0, 2).map((capability, capIndex) => (
                      <div key={capIndex} className="text-xs text-gray-400 bg-white/10 rounded-full px-3 py-1 inline-block mr-1 mb-1">
                        {capability}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Models Section */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-purple-300">
              🤖 AI Analysis Layer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiModels.map((ai, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur border border-purple-300/30 rounded-2xl p-6 text-center hover:from-purple-600/30 hover:to-indigo-600/30 transition-all duration-500 hover:-translate-y-2 ${isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${150 * (index + 5)}ms` }}
                >
                  <div className="text-4xl mb-4">{ai.icon}</div>
                  <h4 className="text-lg font-bold mb-2">{ai.name}</h4>
                  <p className="text-purple-200 text-sm mb-3">{ai.specialty}</p>
                  <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-gray-300 mb-3">
                    {ai.strength}
                  </div>
                  <p className="text-xs text-gray-300">{ai.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Benefits Comparison */}
          <div className="mt-16 bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-center mb-6">Why 9 Tools Are Better Than 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold mb-2">Multi-Layer Detection</h4>
                <p className="text-sm text-gray-300">Static tools catch basic vulnerabilities, AI models find complex logic issues and economic attacks</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2">Reduced False Positives</h4>
                <p className="text-sm text-gray-300">Cross-validation between 9 tools eliminates noise and confirms real security issues</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔬</div>
                <h4 className="font-semibold mb-2">Comprehensive Coverage</h4>
                <p className="text-sm text-gray-300">From syntax errors to DeFi protocol attacks - complete security analysis spectrum</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Workflow Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={sectionRefs.workflow}>
        <div className="container">
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible.workflow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How Our 9-Tool Analysis Works
            </h2>
            <p className="text-gray-600 text-lg">
              A comprehensive 4-stage security analysis process combining static analysis with AI intelligence
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`relative transition-all duration-1000 ${isVisible.workflow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${200 * index}ms` }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold shadow-lg z-10`}>
                      {step.number}
                    </div>
                    
                    <div className="text-center mt-6">
                      <div className="text-3xl mb-4">{step.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <p className="text-sm text-gray-500">{step.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white" ref={sectionRefs.cta}>
        <div className="container">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Secure Your Smart Contracts Today
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Don't risk your funds on unaudited contracts. Get comprehensive 9-tool security analysis in minutes, not days.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
              <Link href="/audit" className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                Start Free Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/how-it-works" className="bg-white/20 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300">
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2">Fast Analysis</h4>
                <p className="text-sm opacity-80">Get results in 1-4 minutes with 9 tools working in parallel</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-2xl mb-3">🎯</div>
                <h4 className="font-semibold mb-2">High Accuracy</h4>
                <p className="text-sm opacity-80">9-tool consensus reduces false positives and confirms real threats</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-2xl mb-3">💎</div>
                <h4 className="font-semibold mb-2">Actionable Insights</h4>
                <p className="text-sm opacity-80">Professional audit reports with specific fix recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
