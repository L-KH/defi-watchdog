import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ALTERNATIVE: Using Next.js Link components properly
const HeaderNextJS = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/audit', label: 'Audit' },
    { path: '/audit-pro', label: 'Audit Pro' },
    { path: '/how-it-works', label: 'How It Works' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" passHref>
            <a className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-gray-800">
                DeFi<span className="text-blue-600">Watchdog</span>
              </span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path;
              
              return (
                <Link key={item.path} href={item.path} passHref>
                  <a className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600'
                  }`}>
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Wallet Connect Button - Desktop */}
          <div className="hidden md:block">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="mt-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = router.pathname === item.path;
                
                return (
                  <Link key={item.path} href={item.path} passHref>
                    <a 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block w-full text-left px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                        isActive
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                );
              })}
              
              {/* Mobile Wallet Button */}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Connect Wallet
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNextJS;
