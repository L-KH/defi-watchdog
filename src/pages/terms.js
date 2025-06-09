import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Terms() {
  const sections = [
    {
      title: "Service Description",
      content: [
        {
          subtitle: "Platform Overview",
          text: "DeFi Watchdog is a smart contract security analysis platform that combines static analysis tools with AI-powered analysis to identify potential vulnerabilities and security issues in smart contracts."
        },
        {
          subtitle: "Analysis Tools",
          text: "Our platform utilizes 9 analysis tools including 5 static analysis tools (Slither, Mythril, Manticore, Semgrep, Oyente) and 4 AI models to provide comprehensive security analysis."
        },
        {
          subtitle: "Service Availability",
          text: "We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance when possible."
        }
      ]
    },
    {
      title: "User Responsibilities",
      content: [
        {
          subtitle: "Appropriate Use",
          text: "You must use our platform in compliance with all applicable laws and regulations. You are responsible for ensuring that smart contracts you analyze are legitimate and that you have proper authorization to analyze them."
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
        },
        {
          subtitle: "Prohibited Activities",
          text: "You may not use our platform to analyze malicious contracts for the purpose of exploitation, attempt to reverse-engineer our analysis algorithms, or use our service to harm others or violate laws."
        }
      ]
    },
    {
      title: "Analysis Results and Limitations",
      content: [
        {
          subtitle: "No Guarantees",
          text: "Our analysis results are provided for informational purposes only. We do not guarantee that our analysis will identify all vulnerabilities or that contracts deemed 'safe' are free from all security issues."
        },
        {
          subtitle: "Professional Judgment Required",
          text: "Our analysis should be used as one component of a comprehensive security review. Professional security audits by qualified experts are recommended for production contracts handling significant value."
        },
        {
          subtitle: "False Positives and Negatives",
          text: "Our analysis may produce false positives (flagging safe code as vulnerable) or false negatives (missing actual vulnerabilities). Users should exercise independent judgment."
        }
      ]
    },
    {
      title: "Payment Terms",
      content: [
        {
          subtitle: "Free Tier",
          text: "We offer a free tier with basic analysis features. Free tier usage may be subject to rate limits and feature restrictions."
        },
        {
          subtitle: "Premium Services",
          text: "Premium analysis services are available for $0.10 per analysis. Payment is processed immediately upon service delivery."
        },
        {
          subtitle: "Refund Policy",
          text: "Due to the immediate delivery of digital services, refunds are generally not available. Refunds may be considered for technical failures preventing service delivery."
        }
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Platform Ownership",
          text: "DeFi Watchdog, including all analysis algorithms, AI models, and platform technology, is our proprietary intellectual property."
        },
        {
          subtitle: "Analysis Reports",
          text: "Analysis reports generated for your smart contracts belong to you. You may share, distribute, or use these reports as you see fit."
        },
        {
          subtitle: "User Content",
          text: "Smart contract addresses and code you submit remain your property. We do not claim ownership of your smart contracts or their code."
        }
      ]
    },
    {
      title: "Disclaimers and Limitation of Liability",
      content: [
        {
          subtitle: "Service Disclaimer",
          text: "Our service is provided 'as is' without warranties of any kind. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement."
        },
        {
          subtitle: "Limitation of Liability",
          text: "Our liability for any claims related to our service is limited to the amount you paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages."
        },
        {
          subtitle: "Security Limitations",
          text: "We cannot guarantee that our analysis will prevent all security breaches or financial losses. Users assume full responsibility for the security of their smart contracts."
        }
      ]
    },
    {
      title: "Termination",
      content: [
        {
          subtitle: "User Termination",
          text: "You may terminate your account at any time by contacting us or using account deletion features. Termination does not entitle you to refunds for unused services."
        },
        {
          subtitle: "Service Termination",
          text: "We may terminate or suspend accounts for violations of these terms, illegal activity, or abuse of our platform. We will provide notice when reasonably possible."
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your access to the platform will cease, and we may delete your account data in accordance with our privacy policy."
        }
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Terms of Service - DeFi Watchdog</title>
        <meta name="description" content="DeFi Watchdog Terms of Service - Legal terms and conditions for using our smart contract security analysis platform." />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <span className="mr-2">📋</span>
                Terms of Service
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Terms &
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Conditions</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Please read these terms carefully before using DeFi Watchdog. 
                By using our platform, you agree to be bound by these terms and conditions.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                    <p className="text-sm text-yellow-700">
                      <strong>Last Updated:</strong> January 2025<br/>
                      <strong>Effective Date:</strong> January 1, 2025<br/>
                      By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acceptance Section */}
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceptance of Terms</h2>
                <div className="prose text-gray-600">
                  <p className="mb-4">
                    By accessing and using DeFi Watchdog ("the Platform"), you accept and agree to be bound by the terms and 
                    provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p className="mb-4">
                    These Terms of Service ("Terms") constitute a legally binding agreement between you ("User" or "you") 
                    and DeFi Watchdog ("we," "us," or "our") regarding your use of our smart contract security analysis platform.
                  </p>
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                    Your continued use of the platform after changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {sections.map((section, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Warnings */}
        <section className="py-20 bg-red-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
                  <span className="mr-3">⚠️</span>
                  Important Risk Warnings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Smart Contract Risks</h3>
                    <p className="text-red-700">
                      Smart contracts are experimental technology with inherent risks. Even contracts that pass our analysis 
                      may contain vulnerabilities or behave unexpectedly. Never interact with contracts involving significant 
                      value without professional security audits.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Financial Risk</h3>
                    <p className="text-red-700">
                      DeFi protocols can result in total loss of funds due to smart contract bugs, economic attacks, 
                      or protocol failures. Our analysis does not guarantee financial safety or investment returns.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Analysis Limitations</h3>
                    <p className="text-red-700">
                      Our analysis tools have limitations and may not detect all types of vulnerabilities, especially 
                      complex business logic issues, economic attacks, or novel vulnerability patterns.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Regulatory Risk</h3>
                    <p className="text-red-700">
                      DeFi and smart contract regulations vary by jurisdiction and are rapidly evolving. 
                      Ensure compliance with applicable laws in your jurisdiction before using any analyzed contracts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal and Compliance */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal and Compliance</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Governing Law</h3>
                    <p className="text-gray-600 mb-4">
                      These terms are governed by and construed in accordance with international commercial law principles. 
                      Any disputes will be resolved through binding arbitration.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Severability</h3>
                    <p className="text-gray-600">
                      If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Updates to Terms</h3>
                    <p className="text-gray-600 mb-4">
                      We may update these terms to reflect changes in our services or legal requirements. 
                      Significant changes will be communicated via email or platform notifications.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact for Legal Matters</h3>
                    <p className="text-gray-600">
                      For legal inquiries or disputes, contact us at: legal@defiwatchdog.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary and Agreement */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Agreement Summary</h2>
              <p className="text-xl mb-8 opacity-90">
                By using DeFi Watchdog, you agree to use our platform responsibly, 
                understand the limitations of automated analysis, and assume responsibility 
                for your smart contract security decisions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="font-semibold mb-2">Your Responsibilities</h3>
                  <p className="text-sm opacity-90">Use platform legally and responsibly</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h3 className="font-semibold mb-2">Our Service</h3>
                  <p className="text-sm opacity-90">9-tool analysis for security insights</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h3 className="font-semibold mb-2">Limitations</h3>
                  <p className="text-sm opacity-90">Analysis has inherent limitations</p>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                <p className="text-sm">
                  <strong>Last Updated:</strong> January 2025 | 
                  <strong> Questions?</strong> Contact us at legal@defiwatchdog.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
