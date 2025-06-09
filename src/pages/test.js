import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function TestPage() {
  return (
    <Layout>
      <Head>
        <title>Test Page - DeFi Watchdog</title>
      </Head>

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Test Page Works! ✅
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              If you can see this page, the routing is working correctly.
            </p>
            
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  ✅ Page loads successfully<br/>
                  ✅ Layout component works<br/>
                  ✅ Routing is functional
                </p>
              </div>
              
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Now test the footer links:
                </p>
                <div className="mt-2 space-x-4">
                  <a href="/about" className="text-blue-600 hover:underline">About</a>
                  <a href="/contact" className="text-blue-600 hover:underline">Contact</a>
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy</a>
                  <a href="/terms" className="text-blue-600 hover:underline">Terms</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
