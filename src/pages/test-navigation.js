import React from 'react';
import Layout from '../components/layout/Layout';

export default function NavigationTest() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">Navigation Test Page</h1>
        
        {/* Test all navigation methods */}
        <div className="space-y-8">
          {/* Method 1: Plain HTML Links */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Method 1: Plain HTML Links (100% Guaranteed)</h2>
            <div className="space-x-4">
              <a href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Home</a>
              <a href="/audit" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Audit</a>
              <a href="/audit-pro" className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Audit Pro</a>
              <a href="/dashboard" className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Dashboard</a>
            </div>
          </div>

          {/* Method 2: JavaScript Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Method 2: JavaScript window.location</h2>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Home
              </button>
              <button 
                onClick={() => window.location.href = '/audit'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Audit
              </button>
              <button 
                onClick={() => window.location.href = '/audit-pro'}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Audit Pro
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Method 3: Full URLs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Method 3: Direct Links with onClick</h2>
            <div className="space-x-4">
              <a 
                href="/audit-pro" 
                onClick={(e) => {
                  console.log('Clicking Audit Pro link');
                }}
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Audit Pro (Direct Link)
              </a>
              <a 
                href="/audit" 
                onClick={(e) => {
                  console.log('Clicking Audit link');
                }}
                className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Audit (Direct Link)
              </a>
            </div>
          </div>

          {/* Current Page Info */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Page Information</h2>
            <p><strong>Current Path:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}</p>
            <p><strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
          </div>

          {/* Debug Info */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Try clicking the links in the navigation bar at the top</li>
              <li>If those don't work, use the yellow bar at the bottom of the page</li>
              <li>As a last resort, use the test links above</li>
              <li>Check the browser console for any errors (F12)</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
}
