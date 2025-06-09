import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { useState } from 'react';

export default function APIDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('analyze');
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  const endpoints = [
    {
      id: 'analyze',
      method: 'POST',
      path: '/api/v1/analyze',
      title: 'Analyze Contract',
      description: 'Submit a smart contract for comprehensive security analysis',
      tier: 'Free & Premium'
    },
    {
      id: 'status',
      method: 'GET', 
      path: '/api/v1/analyze/{id}/status',
      title: 'Get Analysis Status',
      description: 'Check the status of an ongoing analysis',
      tier: 'Free & Premium'
    },
    {
      id: 'report',
      method: 'GET',
      path: '/api/v1/analyze/{id}/report',
      title: 'Get Analysis Report',
      description: 'Retrieve the completed analysis report',
      tier: 'Free & Premium'
    },
    {
      id: 'tools',
      method: 'GET',
      path: '/api/v1/tools',
      title: 'Available Tools',
      description: 'List all available analysis tools and their status',
      tier: 'Free & Premium'
    }
  ];

  const codeExamples = {
    curl: {
      analyze: `curl -X POST "https://api.defiwatchdog.com/v1/analyze" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contract_address": "0x742d35Cc6634C0532925a3b8D42C5D7c5041234d",
    "network": "linea",
    "analysis_type": "premium",
    "include_gas_optimization": true,
    "include_code_quality": true
  }'`,
      status: `curl -X GET "https://api.defiwatchdog.com/v1/analyze/abc123/status" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      report: `curl -X GET "https://api.defiwatchdog.com/v1/analyze/abc123/report" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`,
      tools: `curl -X GET "https://api.defiwatchdog.com/v1/tools" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    javascript: {
      analyze: `const response = await fetch('https://api.defiwatchdog.com/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contract_address: '0x742d35Cc6634C0532925a3b8D42C5D7c5041234d',
    network: 'linea',
    analysis_type: 'premium',
    include_gas_optimization: true,
    include_code_quality: true
  })
});

const result = await response.json();
console.log(result);`,
      status: `const response = await fetch('https://api.defiwatchdog.com/v1/analyze/abc123/status', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const status = await response.json();
console.log(status);`,
      report: `const response = await fetch('https://api.defiwatchdog.com/v1/analyze/abc123/report', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Accept': 'application/json'
  }
});

const report = await response.json();
console.log(report);`,
      tools: `const response = await fetch('https://api.defiwatchdog.com/v1/tools', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const tools = await response.json();
console.log(tools);`
    },
    python: {
      analyze: `import requests

url = "https://api.defiwatchdog.com/v1/analyze"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "contract_address": "0x742d35Cc6634C0532925a3b8D42C5D7c5041234d",
    "network": "linea",
    "analysis_type": "premium",
    "include_gas_optimization": True,
    "include_code_quality": True
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,
      status: `import requests

url = "https://api.defiwatchdog.com/v1/analyze/abc123/status"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
status = response.json()
print(status)`,
      report: `import requests

url = "https://api.defiwatchdog.com/v1/analyze/abc123/report"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
report = response.json()
print(report)`,
      tools: `import requests

url = "https://api.defiwatchdog.com/v1/tools"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
tools = response.json()
print(tools)`
    }
  };

  const responseExamples = {
    analyze: {
      success: `{
  "success": true,
  "analysis_id": "abc123def456",
  "status": "queued",
  "estimated_completion": "2025-06-09T10:30:00Z",
  "message": "Analysis started successfully"
}`,
      error: `{
  "success": false,
  "error": "invalid_contract_address",
  "message": "Contract address is not valid or not verified on the specified network"
}`
    },
    status: {
      success: `{
  "analysis_id": "abc123def456",
  "status": "processing",
  "progress": 65,
  "current_stage": "ai_analysis",
  "tools_completed": ["slither", "mythril", "semgrep"],
  "tools_remaining": ["manticore", "oyente"],
  "ai_models_status": {
    "google_gemma_2b": "completed",
    "deepseek_chat_v3": "processing",
    "deepseek_r1": "queued",
    "google_gemini_2_flash": "queued"
  },
  "estimated_completion": "2025-06-09T10:32:15Z"
}`
    },
    report: {
      success: `{
  "analysis_id": "abc123def456",
  "contract_info": {
    "address": "0x742d35Cc6634C0532925a3b8D42C5D7c5041234d",
    "network": "linea",
    "name": "ExampleContract",
    "compiler_version": "0.8.19"
  },
  "scores": {
    "security_score": 85,
    "gas_optimization_score": 92,
    "code_quality_score": 88,
    "overall_score": 88
  },
  "findings": {
    "security": [
      {
        "severity": "medium",
        "title": "Potential Reentrancy",
        "description": "...",
        "location": "line 45",
        "recommendation": "..."
      }
    ],
    "gas_optimizations": [...],
    "code_quality": [...]
  },
  "ai_analysis": {
    "models_used": 4,
    "consensus_level": 0.87,
    "high_confidence_findings": 3
  }
}`
    }
  };

  const apiFeatures = [
    {
      icon: "🚀",
      title: "Fast Analysis",
      description: "Get comprehensive security analysis in 1-4 minutes"
    },
    {
      icon: "🤖", 
      title: "Multi-AI Powered",
      description: "Leverage 6 specialized AI models for maximum coverage"
    },
    {
      icon: "🔄",
      title: "Real-time Status",
      description: "Track analysis progress with detailed status updates"
    },
    {
      icon: "📊",
      title: "Structured Data",
      description: "Get results in JSON, CSV, or HTML formats"
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime"
    },
    {
      icon: "📈",
      title: "Scalable",
      description: "From single contracts to batch analysis workflows"
    }
  ];

  return (
    <Layout>
      <Head>
        <title>API Documentation - DeFi Watchdog</title>
        <meta name="description" content="Complete API documentation for DeFi Watchdog's smart contract security analysis platform. Integrate AI-powered security analysis into your workflow." />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
                <span className="mr-2">🔧</span>
                API Documentation
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Developer
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> API</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Integrate DeFi Watchdog's AI-powered smart contract security analysis 
                directly into your development workflow, CI/CD pipeline, or application.
              </p>
              
              <div className="bg-gray-900 text-white rounded-xl p-6 text-left max-w-2xl mx-auto">
                <div className="text-sm text-gray-400 mb-2">Base URL</div>
                <div className="font-mono text-green-400">https://api.defiwatchdog.com/v1</div>
              </div>
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                API Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {apiFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                API Endpoints
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Endpoint Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
                    <h3 className="text-lg font-semibold mb-4">Endpoints</h3>
                    <div className="space-y-2">
                      {endpoints.map((endpoint) => (
                        <button
                          key={endpoint.id}
                          onClick={() => setSelectedEndpoint(endpoint.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedEndpoint === endpoint.id
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-mono px-2 py-1 rounded ${
                              endpoint.method === 'POST' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="text-xs text-gray-500">{endpoint.tier}</span>
                          </div>
                          <div className="font-medium text-sm">{endpoint.title}</div>
                          <div className="text-xs text-gray-600 font-mono">{endpoint.path}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Documentation */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Endpoint Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">
                          {endpoints.find(e => e.id === selectedEndpoint)?.title}
                        </h3>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          endpoints.find(e => e.id === selectedEndpoint)?.method === 'POST' 
                            ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          {endpoints.find(e => e.id === selectedEndpoint)?.method}
                        </span>
                      </div>
                      <p className="text-blue-100 mb-3">
                        {endpoints.find(e => e.id === selectedEndpoint)?.description}
                      </p>
                      <div className="font-mono text-sm bg-black/20 rounded p-2">
                        {endpoints.find(e => e.id === selectedEndpoint)?.path}
                      </div>
                    </div>

                    {/* Code Examples */}
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="flex space-x-2 mb-4">
                          {['curl', 'javascript', 'python'].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setSelectedLanguage(lang)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedLanguage === lang
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                          ))}
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm">
                            Request Example
                          </div>
                          <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                            <code>{codeExamples[selectedLanguage][selectedEndpoint]}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Response Examples */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Response Examples</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                              <div className="bg-green-100 px-4 py-2 text-green-800 text-sm font-medium">
                                200 Success
                              </div>
                              <pre className="p-4 text-sm text-green-800 overflow-x-auto">
                                <code>{responseExamples[selectedEndpoint]?.success}</code>
                              </pre>
                            </div>
                          </div>
                          
                          {responseExamples[selectedEndpoint]?.error && (
                            <div>
                              <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                                <div className="bg-red-100 px-4 py-2 text-red-800 text-sm font-medium">
                                  400 Error
                                </div>
                                <pre className="p-4 text-sm text-red-800 overflow-x-auto">
                                  <code>{responseExamples[selectedEndpoint].error}</code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Getting Started
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Get API Key</h3>
                  <p className="text-gray-600 text-sm">
                    Sign up and get your API key from the dashboard. Free tier includes 100 requests per month.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Make First Request</h3>
                  <p className="text-gray-600 text-sm">
                    Use the analyze endpoint to submit your first smart contract for security analysis.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Get Results</h3>
                  <p className="text-gray-600 text-sm">
                    Monitor status and retrieve comprehensive security analysis results in minutes.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Rate Limits</h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <div className="flex justify-between">
                    <span>Free Tier:</span>
                    <span>100 requests/month, 5 requests/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Tier:</span>
                    <span>10,000 requests/month, 100 requests/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise:</span>
                    <span>Custom limits available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Integrate?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Start building with our API today. Get your free API key and 
              begin integrating AI-powered security analysis into your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get API Key
              </a>
              <a
                href="/audit"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Try the Platform
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
