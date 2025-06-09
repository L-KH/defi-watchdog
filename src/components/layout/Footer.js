import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-300">
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Logo and description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">
                    DeFi<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Watchdog</span>
                  </span>
                  <div className="text-xs text-blue-400 font-medium mt-1">AI-Powered Security Platform</div>
                </div>
              </div>
              
              <p className="text-gray-300 max-w-lg leading-relaxed mb-6">
                The world's most comprehensive smart contract security platform. Combining 9 powerful analysis tools (5 static analyzers + 4 AI models) to protect DeFi users from vulnerabilities and exploits.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                🚀 Product
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/audit" className="text-gray-300 hover:text-white transition-colors">
                    Contract Audit
                  </Link>
                </li>
                <li>
                  <Link href="/audit-pro" className="text-gray-300 hover:text-white transition-colors">
                    Premium Audit
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                📚 Resources
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="text-gray-300 hover:text-white transition-colors">
                    Sample Reports
                  </Link>
                </li>
                <li>
                  <Link href="/ai-agents" className="text-gray-300 hover:text-white transition-colors">
                    AI Models
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="text-gray-300 hover:text-white transition-colors">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                🏢 Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 DeFi Watchdog. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Built with ❤️ for DeFi security</span>
                <span>•</span>
                <span>9-Tool Analysis Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
