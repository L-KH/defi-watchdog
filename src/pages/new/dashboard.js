'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import dynamic from 'next/dynamic';
import { useWallet } from '../../hooks/useWallet';

// Import network icons dynamically to avoid hydration issues
const NetworkIcons = dynamic(() => import('../../components/NetworkIcons'), { ssr: false });

// Dashboard page component with improved structure
export default function Dashboard() {
  const router = useRouter();
  const { account, isOnSupportedNetwork, isConnecting, formatAddress } = useWallet();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [lineaAnalyses, setLineaAnalyses] = useState([]);
  const [sonicAnalyses, setSonicAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zerebyAgentStatus, setZerebyAgentStatus] = useState({ active: false, lastUpdated: null });
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch dashboard data only once on initial mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchDashboardData() {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use Promise.all to parallelize fetch requests
        const [recentResponse, statsResponse] = await Promise.all([
          fetch('/api/reports/recent'),
          fetch('/api/stats')
        ]);
        
        // Check for individual fetch errors
        if (!recentResponse.ok) {
          throw new Error(`Error fetching recent reports: ${recentResponse.statusText}`);
        }
        
        if (!statsResponse.ok) {
          throw new Error(`Error fetching stats: ${statsResponse.statusText}`);
        }
        
        // Process response data if component is still mounted
        if (isMounted) {
          const recentData = await recentResponse.json();
          const statsData = await statsResponse.json();
          
          // Update state only once with all the data
          setRecentAnalyses(recentData.reports || []);
          setLineaAnalyses(recentData.reports?.filter(report => report.network === 'linea') || []);
          setSonicAnalyses(recentData.reports?.filter(report => report.network === 'sonic') || []);
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    // Also check agent status but don't block dashboard loading
    async function checkAgentStatus() {
      if (!isMounted) return;
      
      try {
        const response = await fetch('/api/zerebro/status');
        if (response.ok && isMounted) {
          const data = await response.json();
          setZerebyAgentStatus({
            active: data.active,
            lastUpdated: data.lastUpdated
          });
        }
      } catch (error) {
        console.error('Error checking ZerePy agent status:', error);
      }
    }
    
    fetchDashboardData();
    checkAgentStatus();
    
    // Clean up to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  // Helper to format address
  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Get reports based on active tab
  const getReports = () => {
    if (activeTab === 'sonic') {
      return sonicAnalyses;
    } else if (activeTab === 'linea') {
      return lineaAnalyses;
    }
    return recentAnalyses;
  };

  // Helper to get color based on security score
  function getScoreColor(score) {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - DeFi Watchdog</title>
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contract Security Dashboard</h1>
        
        {/* Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'all' ? '2px solid #0284c7' : 'none',
              fontWeight: activeTab === 'all' ? 'bold' : 'normal',
              color: activeTab === 'all' ? '#0284c7' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            All Contracts
          </button>
          
          <button
            onClick={() => setActiveTab('linea')}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'linea' ? '2px solid #2563eb' : 'none',
              fontWeight: activeTab === 'linea' ? 'bold' : 'normal',
              color: activeTab === 'linea' ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <NetworkIcons network="linea" />
            Linea Contracts
          </button>
          
          <button
            onClick={() => setActiveTab('sonic')}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'sonic' ? '2px solid #8b5cf6' : 'none',
              fontWeight: activeTab === 'sonic' ? 'bold' : 'normal',
              color: activeTab === 'sonic' ? '#8b5cf6' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <NetworkIcons network="sonic" />
            Sonic Contracts
          </button>
        </div>
        
        {/* Status and Error Messages */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading dashboard data...
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontWeight: 'bold' }}>Error loading data:</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#b91c1c',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                marginTop: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Contract Cards - Pre-rendered with fixed data to avoid hydration issues */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Popular Contracts to Analyze
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem'
          }}>
            {/* Linea Contracts */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  <NetworkIcons network="linea" />
                  Linea
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '600' }}>Odos Router V2</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Advanced DEX aggregator with efficient multi-route swaps on Linea
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Address:</div>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>0x2d8879046f1559e53eb052e949e9544bcb72f414</div>
              </div>
              <Link 
                href={`/audit?address=0x2d8879046f1559e53eb052e949e9544bcb72f414&network=linea`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Analyze Contract
              </Link>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  <NetworkIcons network="linea" />
                  Linea
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '600' }}>Lynex</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Pioneering decentralized exchange with concentrated liquidity on Linea
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Address:</div>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>0x610d2f07b7edc67565160f587f37636194c34e74</div>
              </div>
              <Link 
                href={`/audit?address=0x610d2f07b7edc67565160f587f37636194c34e74&network=linea`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Analyze Contract
              </Link>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  <NetworkIcons network="linea" />
                  Linea
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '600' }}>Renzeo</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Innovative lending and borrowing protocol built for Linea ecosystem
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Address:</div>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>0x4D7572040B84b41a6AA2efE4A93eFFF182388F88</div>
              </div>
              <Link 
                href={`/audit?address=0x4D7572040B84b41a6AA2efE4A93eFFF182388F88&network=linea`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Analyze Contract
              </Link>
            </div>
            
            {/* Sonic Contracts */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  <NetworkIcons network="sonic" />
                  Sonic
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '600' }}>SonicSwap Router</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Main DEX router for SonicSwap on Sonic blockchain
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Address:</div>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13</div>
              </div>
              <Link 
                href={`/audit?address=0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13&network=sonic`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Analyze Contract
              </Link>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  <NetworkIcons network="sonic" />
                  Sonic
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '600' }}>Sonic Staking Contract</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Staking contract for Sonic token rewards and governance
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Address:</div>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>0x19B25E3f1B8d35a2C5a805c0b271ECeBE1E8A4Ec</div>
              </div>
              <Link 
                href={`/audit?address=0x19B25E3f1B8d35a2C5a805c0b271ECeBE1E8A4Ec&network=sonic`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Analyze Contract
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Analyses Section */}
        {!loading && !error && getReports().length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Recent Analyses
            </h2>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              overflow: 'hidden',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                        Network
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                        Contract Address
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                        Analysis Date
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                        Security Score
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getReports().map((report, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <NetworkIcons network={report.network || 'unknown'} />
                            <span style={{ textTransform: 'capitalize' }}>{report.network || 'Unknown'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#4b5563', fontFamily: 'monospace' }}>
                          {formatAddress(report.address)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#4b5563', fontSize: '0.875rem' }}>
                          {formatDate(report.date)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: getScoreColor(report.score || 0),
                            color: 'white',
                            borderRadius: '0.375rem',
                            height: '2rem',
                            width: '2.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}>
                            {Math.round(report.score) || 0}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <Link
                            href={`/report?id=${report.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              textDecoration: 'none'
                            }}
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* No Reports Message */}
        {!loading && !error && getReports().length === 0 && (
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '2rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            marginTop: '2rem'
          }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              No analysis reports found for {activeTab === 'all' ? 'any network' : `the ${activeTab} network`}.
            </p>
            <Link 
              href="/audit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Analyze a Contract
            </Link>
          </div>
        )}
        
        {/* Analyze New Contract Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginTop: '2rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link 
            href="/audit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0284c7',
              color: 'white',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Analyze New Contract
          </Link>
          
          {account && isOnSupportedNetwork && (
            <Link 
              href="/certificate"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#047857',
                color: 'white',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              My Certificates
            </Link>
          )}
          
          {!account && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              border: '1px dashed #d1d5db'
            }}>
              Connect wallet to view certificates
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
