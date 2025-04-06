import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import FeaturedReportCard from '../components/FeaturedReportCard';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchReports() {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch from both featured and recent endpoints
        const [featuredResponse, recentResponse] = await Promise.all([
          fetch('/api/reports/featured'),
          fetch('/api/reports/recent')
        ]);
        
        if (!featuredResponse.ok) {
          throw new Error(`Error fetching featured reports: ${featuredResponse.statusText}`);
        }
        
        if (!recentResponse.ok) {
          throw new Error(`Error fetching recent reports: ${recentResponse.statusText}`);
        }
        
        const featuredData = await featuredResponse.json();
        const recentData = await recentResponse.json();
        
        // Merge and deduplicate reports by ID
        const mergedReports = [...featuredData.reports, ...recentData.reports];
        const uniqueReports = Array.from(
          new Map(mergedReports.map(report => [report.id, report])).values()
        );
        
        if (isMounted) {
          setReports(uniqueReports);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchReports();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Filter and sort reports
  const filteredAndSortedReports = reports
    // Apply network filter
    .filter(report => {
      if (filter === 'all') return true;
      return report.network === filter;
    })
    // Apply search query filter
    .filter(report => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        report.contractName?.toLowerCase().includes(query) ||
        report.address?.toLowerCase().includes(query) ||
        report.summary?.toLowerCase().includes(query)
      );
    })
    // Apply sorting
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'score':
          comparison = b.score - a.score;
          break;
        case 'issues':
          comparison = b.issues - a.issues;
          break;
        case 'name':
          comparison = (a.contractName || '').localeCompare(b.contractName || '');
          break;
        default:
          comparison = new Date(b.date) - new Date(a.date);
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  
  return (
    <Layout>
      <Head>
        <title>Security Reports - DeFi Watchdog</title>
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Contract Security Reports</h1>
          
          <Link
            href="/audit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Analyze New Contract
          </Link>
        </div>
        
        {/* Filters and Search */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Network</div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            >
              <option value="all">All Networks</option>
              <option value="linea">Linea</option>
              <option value="sonic">Sonic</option>
            </select>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Sort By</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            >
              <option value="date">Date</option>
              <option value="score">Security Score</option>
              <option value="issues">Issues Found</option>
              <option value="name">Contract Name</option>
            </select>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Order</div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          
          <div style={{ flex: '2 1 300px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Search</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contract name or address..."
              style={{ 
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            />
          </div>
        </div>
        
        {/* Report Listings */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', width: '1.25rem', height: '1.25rem', marginRight: '0.75rem', color: '#3b82f6' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
              </svg>
              Loading security reports...
            </div>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1.5rem',
            borderRadius: '0.5rem'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error loading reports:</p>
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
        ) : filteredAndSortedReports.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredAndSortedReports.map(report => (
              <FeaturedReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '4rem 1.5rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <p style={{ fontWeight: '500', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#374151' }}>
              No reports found
            </p>
            <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>
              {searchQuery 
                ? `No reports match your search for "${searchQuery}".`
                : filter !== 'all'
                  ? `No reports found for ${filter} network.`
                  : 'There are no security reports available yet.'}
            </p>
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  color: '#4b5563',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
        
        {/* Pagination placeholder - would be implemented in a real application */}
        {!loading && !error && filteredAndSortedReports.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            gap: '0.5rem'
          }}>
            <button
              disabled
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                color: '#9ca3af'
              }}
            >
              Previous
            </button>
            
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '0.375rem',
                color: 'white',
                fontWeight: '500'
              }}
            >
              1
            </button>
            
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                color: '#4b5563'
              }}
            >
              2
            </button>
            
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                color: '#4b5563'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
