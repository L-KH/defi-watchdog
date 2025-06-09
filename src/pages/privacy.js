import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Contract Analysis Data",
          text: "When you use our smart contract analysis service, we collect the contract addresses you submit and the analysis results. We do not store the actual smart contract source code permanently."
        },
        {
          subtitle: "Usage Information", 
          text: "We collect information about how you interact with our platform, including IP addresses, browser types, device information, and usage patterns to improve our services."
        },
        {
          subtitle: "Account Information",
          text: "If you create an account, we collect your email address and any profile information you choose to provide."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide smart contract security analysis, generate reports, and improve our AI models and detection capabilities."
        },
        {
          subtitle: "Platform Improvement",
          text: "Usage data helps us understand how our platform is used and identify areas for improvement in our analysis tools and user experience."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you important updates about our services, security alerts, or respond to your inquiries."
        }
      ]
    },
    {
      title: "Data Storage and Security",
      content: [
        {
          subtitle: "Data Security",
          text: "We implement industry-standard security measures to protect your data, including encryption in transit and at rest, access controls, and regular security audits."
        },
        {
          subtitle: "Data Retention",
          text: "Analysis results are retained for 90 days to allow you to access your reports. Usage logs are retained for 1 year for security and service improvement purposes."
        },
        {
          subtitle: "Smart Contract Source Code",
          text: "We fetch smart contract source code from public blockchain explorers for analysis but do not permanently store this code on our servers."
        }
      ]
    },
    {
      title: "Data Sharing and Disclosure",
      content: [
        {
          subtitle: "No Sale of Personal Data",
          text: "We do not sell, rent, or trade your personal information to third parties for their commercial purposes."
        },
        {
          subtitle: "Service Providers",
          text: "We may share data with trusted service providers who assist us in operating our platform, such as cloud hosting providers and analytics services."
        },
        {
          subtitle: "Legal Compliance",
          text: "We may disclose information when required by law, to protect our rights, or to prevent fraud or security threats."
        }
      ]
    },
    {
      title: "Your Rights and Controls",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You can request access to your personal data and request corrections to any inaccurate information."
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your account and associated data. Some information may be retained for legal or security purposes."
        },
        {
          subtitle: "Opt-Out Rights",
          text: "You can opt out of non-essential communications and certain data collection practices through your account settings."
        }
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use essential cookies for platform functionality, security, and user authentication."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand platform usage and improve our services. You can opt out of these through your browser settings."
        },
        {
          subtitle: "Third-Party Services",
          text: "Our platform may include third-party services that have their own privacy practices. Please review their privacy policies."
        }
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Privacy Policy - DeFi Watchdog</title>
        <meta name="description" content="DeFi Watchdog Privacy Policy - Learn how we collect, use, and protect your data when using our smart contract security analysis platform." />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
                <span className="mr-2">🔒</span>
                Privacy Policy
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Privacy</span>
                <br />Matters
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We're committed to protecting your privacy and being transparent about how we collect, 
                use, and safeguard your information when you use DeFi Watchdog.
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl mr-3">ℹ️</span>
                  <div className="text-left">
                    <p className="text-sm text-gray-700">
                      <strong>Last Updated:</strong> January 2025<br/>
                      <strong>Effective Date:</strong> January 1, 2025<br/>
                      We may update this policy from time to time. Significant changes will be communicated via email or platform notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy at a Glance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🛡️</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                    <p className="text-sm text-gray-600">Industry-standard encryption and security measures</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🚫</div>
                    <h3 className="font-semibold text-gray-900 mb-2">No Data Sales</h3>
                    <p className="text-sm text-gray-600">We never sell your personal information to third parties</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">⚙️</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
                    <p className="text-sm text-gray-600">Access, correct, or delete your data anytime</p>
                  </div>
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-12">
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

              {/* Special Considerations for DeFi */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Considerations for DeFi Users</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-purple-600 text-lg mr-3">🔗</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Blockchain Data</h3>
                      <p className="text-gray-600">Smart contract addresses and transaction data analyzed through our platform may be publicly available on blockchain networks. We do not control this public blockchain data.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-blue-600 text-lg mr-3">🔍</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Analysis Reports</h3>
                      <p className="text-gray-600">Security analysis reports generated by our platform are private and only accessible to you unless you choose to share them.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-green-600 text-lg mr-3">🤖</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI Model Training</h3>
                      <p className="text-gray-600">We may use aggregated, anonymized analysis data to improve our AI models and detection capabilities, but never in a way that identifies individual users.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Compliance */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Compliance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">GDPR (European Union)</h3>
                    <p className="text-gray-600 mb-4">
                      For users in the EU, we comply with GDPR requirements including:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Right to access your personal data
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Right to rectification of inaccurate data
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Right to erasure (right to be forgotten)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Right to data portability
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">CCPA (California)</h3>
                    <p className="text-gray-600 mb-4">
                      For California residents, we provide additional rights including:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Right to know what personal information is collected
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Right to delete personal information
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Right to opt-out of sale of personal information
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Right to non-discrimination
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 mt-12">
                <h2 className="text-2xl font-bold mb-6">Privacy Questions?</h2>
                <p className="text-gray-300 mb-6">
                  If you have questions about this privacy policy or our data practices, 
                  please don't hesitate to contact us.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                    <p className="text-gray-300 text-sm">privacy@defiwatchdog.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">General Privacy Inquiries</h3>
                    <p className="text-gray-300 text-sm">support@defiwatchdog.com</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">
                    For urgent privacy concerns or data breach notifications, 
                    please mark your email with "URGENT PRIVACY" in the subject line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
