// src/pages/audit-history.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import AuditHistoryNFT from '../components/AuditHistoryNFT';
import { useAuditNFT } from '../hooks/useAuditNFT';

export default function AuditHistory() {
  const {
    userAudits,
    contractStats,
    isLoading,
    isConnected,
    loadUserAudits,
    loadContractStats,
    currentNetwork
  } = useAuditNFT();
  
  // Check if we just minted and clear the flag
  useEffect(() => {
    const justMinted = sessionStorage.getItem('just_minted');
    if (justMinted) {
      sessionStorage.removeItem('just_minted');
      // If we just minted, delay loading stats to avoid the error
      console.log('Just minted, delaying stats load...');
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>Audit History - DeFi Watchdog</title>
        <meta name="description" content="View your security audit certificate NFT history" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8 mt-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center py-2 px-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium mb-4">
            <span className="animate-pulse mr-2">🏆</span>
            NFT Certificate History
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Audit Certificates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage your security audit certificate NFTs stored permanently on the blockchain
          </p>
        </div>

        {/* Main Content */}
        <AuditHistoryNFT />

        {/* Additional Info Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🛡️ About Audit Certificate NFTs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🆓</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Static Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Free static analysis certificates using automated security tools and pattern matching.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Premium AI analysis certificates (0.003 ETH) with multi-model verification and comprehensive reporting.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">IPFS Storage</h3>
                <p className="text-gray-600 text-sm">
                  All audit reports are stored permanently on IPFS with metadata linked to your NFT certificate.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contractStats && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{contractStats.totalAudits}</div>
                      <div className="text-sm text-gray-600">Total Certificates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{contractStats.staticAudits}</div>
                      <div className="text-sm text-gray-600">Static Analysis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{contractStats.aiAudits}</div>
                      <div className="text-sm text-gray-600">AI Analysis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{userAudits?.length || 0}</div>
                      <div className="text-sm text-gray-600">Your Certificates</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
