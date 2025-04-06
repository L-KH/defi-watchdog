'use client';
import { useState, useEffect } from 'react';

// The DashboardStats component fetches and displays real-time stats
export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalContracts: 0,
    contractsGrowth: 0,
    totalVulnerabilities: 0,
    vulnerabilitiesGrowth: 0,
    averageScore: 0,
    scoreGrowth: 0,
    aiAgents: 0,
    aiModels: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch stats when component mounts
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);
  
  // Define UI styles
  const statCard = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };
  
  const title = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  };
  
  const value = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.25rem'
  };
  
  const trend = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem'
  };
  
  const upTrend = {
    color: '#10b981'
  };
  
  // Skeletons for loading state
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ ...statCard, position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              height: '0.875rem', 
              width: '40%', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '0.25rem',
              marginBottom: '0.75rem'
            }} />
            <div style={{ 
              height: '1.875rem', 
              width: '60%', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '0.25rem',
              marginBottom: '0.75rem'
            }} />
            <div style={{ 
              height: '0.875rem', 
              width: '80%', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '0.25rem'
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              animation: 'shimmer 1.5s infinite',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
              transform: 'translateX(-100%)'
            }} />
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem'
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error loading stats:</p>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }
  
  // Build the AI models string (e.g., "OpenAI, Mistral, Deepseek")
  const aiModelsString = stats.aiModels?.length > 0 
    ? stats.aiModels.join(', ') 
    : "OpenAI, Mistral, Deepseek"; // Fallback
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {/* Contracts Analyzed */}
      <div style={statCard}>
        <p style={title}>Contracts Analyzed</p>
        <p style={value}>{stats.totalContracts.toLocaleString()}</p>
        <div style={{ ...trend, ...upTrend }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-1-5a1 1 0 00-1 1v3a1 1 0 001 1h4a1 1 0 001-1V3a1 1 0 00-1-1h-4z" clipRule="evenodd" />
            <path d="M2 13.692V16a1 1 0 001 1h5.5" />
            <path fillRule="evenodd" d="M7 16a1 1 0 011-1h.5a1 1 0 010 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M11 18a1 1 0 001-1v-2m1-5a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6a1 1 0 011-1h2z" />
          </svg>
          <span>+{stats.contractsGrowth}% this week</span>
        </div>
      </div>
      
      {/* Vulnerabilities Found */}
      <div style={statCard}>
        <p style={title}>Vulnerabilities Found</p>
        <p style={value}>{stats.totalVulnerabilities.toLocaleString()}</p>
        <div style={{ ...trend, ...upTrend }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-1-5a1 1 0 00-1 1v3a1 1 0 001 1h4a1 1 0 001-1V3a1 1 0 00-1-1h-4z" clipRule="evenodd" />
            <path d="M2 13.692V16a1 1 0 001 1h5.5" />
            <path fillRule="evenodd" d="M7 16a1 1 0 011-1h.5a1 1 0 010 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M11 18a1 1 0 001-1v-2m1-5a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6a1 1 0 011-1h2z" />
          </svg>
          <span>+{stats.vulnerabilitiesGrowth}% this week</span>
        </div>
      </div>
      
      {/* Average Security Score */}
      <div style={statCard}>
        <p style={title}>Average Security Score</p>
        <p style={value}>{stats.averageScore}/100</p>
        <div style={{ ...trend, ...upTrend }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-1-5a1 1 0 00-1 1v3a1 1 0 001 1h4a1 1 0 001-1V3a1 1 0 00-1-1h-4z" clipRule="evenodd" />
            <path d="M2 13.692V16a1 1 0 001 1h5.5" />
            <path fillRule="evenodd" d="M7 16a1 1 0 011-1h.5a1 1 0 010 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M11 18a1 1 0 001-1v-2m1-5a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6a1 1 0 011-1h2z" />
          </svg>
          <span>+{stats.scoreGrowth} points</span>
        </div>
      </div>
      
      {/* AI Analysis Agents */}
      <div style={statCard}>
        <p style={title}>AI Analysis Agents</p>
        <p style={value}>{stats.aiAgents} Models</p>
        <div style={{ 
          fontSize: '0.875rem', 
          color: '#6b7280', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {aiModelsString}
        </div>
      </div>
    </div>
  );
}