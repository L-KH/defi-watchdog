'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useWallet } from '../hooks/useWallet';
import FeaturedReportCard from '../components/FeaturedReportCard';
import DashboardStats from '../components/DashboardStats';

// Dashboard page component with improved structure
export default function Dashboard() {
  const router = useRouter();
  const { account, isOnSupportedNetwork, isConnecting, formatAddress } = useWallet();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [featuredReports, setFeaturedReports] = useState([]);
  const [lineaAnalyses, setLineaAnalyses] = useState([]);
  const [sonicAnalyses, setSonicAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zerebyAgentStatus, setZerebyAgentStatus] = useState({ active: false, lastUpdated: null });
  const [activeTab, setActiveTab] = useState('all');
  const [expandedContractId, setExpandedContractId] = useState(null);
  
  // Toggle expanded state for a contract card
  const toggleExpanded = (id) => {
    setExpandedContractId(expandedContractId === id ? null : id);
  };
  
  // Fetch dashboard data only once on initial mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchDashboardData() {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use Promise.all to parallelize fetch requests
        const [recentResponse, statsResponse, featuredResponse] = await Promise.all([
          fetch('/api/reports/recent'),
          fetch('/api/stats'),
          fetch('/api/reports/featured?popular=true&limit=5')
        ]);
        
        // Check for individual fetch errors
        if (!recentResponse.ok) {
          throw new Error(`Error fetching recent reports: ${recentResponse.statusText}`);
        }
        
        if (!statsResponse.ok) {
          throw new Error(`Error fetching stats: ${statsResponse.statusText}`);
        }
        
        if (!featuredResponse.ok) {
          throw new Error(`Error fetching featured reports: ${featuredResponse.statusText}`);
        }
        
        // Process response data if component is still mounted
        if (isMounted) {
          const recentData = await recentResponse.json();
          const statsData = await statsResponse.json();
          const featuredData = await featuredResponse.json();
          
          // Update state only once with all the data
          setRecentAnalyses(recentData.reports || []);
          setLineaAnalyses(recentData.reports?.filter(report => report.network === 'linea') || []);
          setSonicAnalyses(recentData.reports?.filter(report => report.network === 'sonic') || []);
          setStats(statsData);
          setFeaturedReports(featuredData.reports || []);
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
  const formatAddressLocal = (address) => {
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

  // Define network icon components directly without dynamic imports
  const LineaIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
      <path d="M12 22V2M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Render the Sonic SVG icon
  const SonicIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
      <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Network icon selector
  const NetworkIcon = ({ network }) => {
    if (network === 'linea') return <LineaIcon />;
    if (network === 'sonic') return <SonicIcon />;
    return null;
  };

  return (
    <Layout>
      <Head>
        <title>Dashboard - DeFi Watchdog</title>
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Security Intelligence Dashboard</h1>
        
        {/* Dashboard Stats */}
        <DashboardStats />
        
        {/* Featured Contract Reports */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Featured Security Reports
            </h2>
            
            <Link 
              href="/reports"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#3b82f6',
                textDecoration: 'none'
              }}
            >
              View all reports
            </Link>
          </div>
          
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', color: '#3b82f6' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                </svg>
                Loading featured reports...
              </div>
            </div>
          ) : error ? (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error loading data:</p>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          ) : featuredReports.length > 0 ? (
            <>
              {/* Featured Contract Card - Large */}
              <div style={{ marginBottom: '1rem' }}>
                <FeaturedReportCard report={featuredReports[0]} large={true} />
              </div>
              
              {/* Grid of smaller featured contract cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {featuredReports.slice(1).map((report) => (
                  <FeaturedReportCard key={report.id} report={report} />
                ))}
              </div>
            </>
          ) : (
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '2rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', margin: 0 }}>
                No featured reports available. Start by analyzing a contract.
              </p>
            </div>
          )}
        </div>
        
        {/* Tabs Navigation for Recent Analysis */}
        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Recent Contract Analysis
          </h2>
          
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
              <LineaIcon />
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
              <SonicIcon />
              Sonic Contracts
            </button>
          </div>
        </div>
        
        {/* Recent Analyses Section */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', color: '#3b82f6' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
              </svg>
              Loading analysis data...
            </div>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.5rem'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error loading data:</p>
            <p style={{ margin: '0 0 0.75rem 0' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#b91c1c',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : getReports().length > 0 ? (
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
                      Contract
                    </th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      Analysis Date
                    </th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      Security Score
                    </th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      AI Agents
                    </th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getReports().map((report, index) => (
                    <tr 
                      key={index} 
                      style={{ 
                        borderBottom: index === getReports().length - 1 ? 'none' : '1px solid #e5e7eb',
                        backgroundColor: expandedContractId === report.id ? '#f9fafb' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <NetworkIcon network={report.network || 'unknown'} />
                          <span style={{ textTransform: 'capitalize' }}>{report.network || 'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{report.contractName || `Contract-${report.address?.slice(0, 6)}`}</div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6b7280' }}>
                            {formatAddressLocal(report.address)}
                          </div>
                        </div>
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
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#4b5563' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                          {Array.from({ length: report.aiAgents || 3 }).map((_, i) => (
                            <div 
                              key={i}
                              style={{
                                width: '0.75rem',
                                height: '0.75rem',
                                borderRadius: '9999px',
                                backgroundColor: i === 0 ? '#3b82f6' : 
                                                i === 1 ? '#8b5cf6' :
                                                i === 2 ? '#10b981' :
                                                i === 3 ? '#f59e0b' : '#6b7280'
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => toggleExpanded(report.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.375rem 0.75rem',
                              backgroundColor: 'white',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#4b5563',
                              cursor: 'pointer'
                            }}
                          >
                            {expandedContractId === report.id ? 'Hide' : 'Details'}
                          </button>
                          
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '2rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
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
