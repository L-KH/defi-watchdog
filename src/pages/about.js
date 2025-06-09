import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function About() {
  const teamMembers = [
    {
      name: "Security Team",
      role: "AI & Blockchain Security Experts",
      description: "Our team combines deep expertise in blockchain security, AI/ML research, and DeFi protocols.",
      icon: "🛡️"
    },
    {
      name: "Development Team", 
      role: "Full-Stack & Smart Contract Developers",
      description: "Building robust, scalable security infrastructure for the DeFi ecosystem.",
      icon: "⚡"
    },
    {
      name: "Research Team",
      role: "Security Researchers & Data Scientists", 
      description: "Continuously researching new attack vectors and improving our detection algorithms.",
      icon: "🔬"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "Launched DeFi Watchdog with 5 static analysis tools and 4 AI models.",
      icon: "🚀"
    },
    {
      year: "2024",
      title: "Multi-Chain Support",
      description: "Expanded to support multiple blockchain networks starting with Linea.",
      icon: "🌐"
    },
    {
      year: "2025",
      title: "AI Enhancement", 
      description: "Integrated advanced AI models for superior vulnerability detection.",
      icon: "🤖"
    },
    {
      year: "2025",
      title: "Enterprise Solutions",
      description: "Launching enterprise-grade security solutions for institutional clients.",
      icon: "🏢"
    }
  ];

  return (
    <Layout>
      <Head>
        <title>About Us - DeFi Watchdog</title>
        <meta name="description" content="Learn about DeFi Watchdog's mission to secure the DeFi ecosystem through AI-powered smart contract analysis." />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <span className="mr-2">🛡️</span>
                About DeFi Watchdog
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Securing the Future of 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> DeFi</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We're building the world's most comprehensive smart contract security platform, 
                combining cutting-edge AI technology with proven static analysis tools to protect 
                the DeFi ecosystem from vulnerabilities and exploits.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  To democratize smart contract security by making professional-grade security 
                  analysis accessible to everyone in the DeFi ecosystem - from individual users 
                  to enterprise developers.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  We believe that security should not be a barrier to innovation. Our platform 
                  combines 9 powerful analysis tools to provide comprehensive security insights 
                  in minutes, not weeks.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">9</div>
                    <div className="text-sm text-gray-600">Analysis Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
                    <div className="text-sm text-gray-600">AI Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">1-4</div>
                    <div className="text-sm text-gray-600">Minutes Analysis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    A DeFi ecosystem where every smart contract is thoroughly analyzed 
                    and secured before deployment, preventing exploits and protecting 
                    user funds through advanced AI-powered security analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Expert Teams
              </h2>
              <p className="text-lg text-gray-600">
                Built by security experts, blockchain developers, and AI researchers 
                with deep experience in DeFi security and smart contract analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{member.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Technology Stack
              </h2>
              <p className="text-lg text-gray-600">
                Combining the best of traditional static analysis with cutting-edge AI technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🔧</span>
                  Static Analysis Tools
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <span>Slither - 70+ vulnerability detectors</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    <span>Mythril - Symbolic execution analysis</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>Manticore - Property verification</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    <span>Semgrep - Pattern matching</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    <span>Oyente - Academic precision</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🤖</span>
                  AI Models
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <span>Google Gemma 2B - General security</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    <span>DeepSeek Chat V3 - Logic analysis</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>DeepSeek R1 - Code quality</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    <span>Google Gemini 2.0 Flash - DeFi risks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600">
                Key milestones in building the most comprehensive smart contract security platform.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-600"></div>
                
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                      <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'}`}>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                          <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">{milestone.icon}</span>
                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                              {milestone.year}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      
                      {/* Timeline dot */}
                      <div className="hidden lg:block w-2/12 flex justify-center">
                        <div className="w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
                      </div>
                      
                      <div className="hidden lg:block w-5/12"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us in Securing DeFi
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Whether you're a developer, security researcher, or DeFi user, 
              help us build a more secure decentralized future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/audit"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Our Platform
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
