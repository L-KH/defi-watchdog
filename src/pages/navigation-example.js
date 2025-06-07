// Example page showing navigation implementation
import React from 'react';
import Layout from '../components/layout/Layout';
import { useSimpleNavigation, navigationHelpers } from '../components/navigation/SimpleRouter';

export default function NavigationExample() {
  const { navigateTo, navigateWithQuery, currentPath } = useSimpleNavigation();
  
  const handleAuditNavigation = () => {
    // Example: Navigate to audit page with contract address
    navigateWithQuery('/audit', {
      address: '0x742d35Cc6634C0532925a3b8D42C5D7c5041234d',
      network: 'linea'
    });
  };
  
  const handleDirectNavigation = () => {
    // Example: Direct navigation using helper
    navigationHelpers.goToAuditPro('0x742d35Cc6634C0532925a3b8D42C5D7c5041234d', 'sonic');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">Navigation Example</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Path: {currentPath}</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Programmatic Navigation:</h3>
              <div className="space-x-4">
                <button
                  onClick={() => navigateTo('/audit')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Audit
                </button>
                
                <button
                  onClick={() => navigateTo('/audit-pro')}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Go to Audit Pro
                </button>
                
                <button
                  onClick={handleAuditNavigation}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Audit with Contract
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Direct Navigation Helpers:</h3>
              <div className="space-x-4">
                <button
                  onClick={handleDirectNavigation}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Audit Pro with Contract (Direct)
                </button>
                
                <button
                  onClick={() => navigationHelpers.goHome()}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold mb-4">How to Use Navigation in Your Components:</h3>
          <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
{`// Import navigation hook
import { useSimpleNavigation } from '../components/navigation/SimpleRouter';

// Inside your component
const { navigateTo, navigateWithQuery } = useSimpleNavigation();

// Navigate to a page
navigateTo('/audit');

// Navigate with query parameters
navigateWithQuery('/audit', {
  address: '0x...',
  network: 'linea'
});

// Or use direct helpers
import { navigationHelpers } from '../components/navigation/SimpleRouter';

navigationHelpers.goToAudit('0x...', 'linea');
navigationHelpers.goToAuditPro('0x...', 'sonic');`}
          </pre>
        </div>
      </div>
    </Layout>
  );
}
