import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Simple Header with proper Next.js routing
const Header = React.memo(() => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/audit', label: 'Audit' },
    { path: '/audit-pro', label: 'Audit Pro' },
    { path: '/how-it-works', label: 'How It Works' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Always clickable */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-semibold text-lg text-gray-800">
            DeFi<span className="text-blue-600">Watchdog</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button 
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Wallet Connect Button - Always clickable */}
        <div className="hidden md:block">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`block px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
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
    </header>
  );
});

Header.displayName = 'Header';

export { Header };
export default Header;
