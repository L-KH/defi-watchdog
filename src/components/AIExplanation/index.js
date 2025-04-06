import React, { useState } from 'react';

/**
 * AIExplanation Component
 * Educational component that explains how AI is used for smart contract security analysis
 */
const AIExplanation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Content for each tab
  const tabContent = {
    overview: {
      title: 'How AI Analyzes Smart Contracts',
      content: (
        <>
          <p>
            DeFi Watchdog employs advanced AI models to analyze smart contract security from multiple perspectives. Rather than using a single model, we leverage several specialized AI agents, each focusing on different aspects of contract security.
          </p>
          <p>
            This multi-model approach helps identify issues that might be missed by any single system and provides confidence scores based on how many models identify each potential vulnerability.
          </p>
        </>
      )
    },
    detection: {
      title: 'Vulnerability Detection',
      content: (
        <>
          <h4>How AI Detects Contract Vulnerabilities</h4>
          <ul>
            <li>
              <strong>Pattern Recognition:</strong> AI models have been trained on thousands of secure and vulnerable contracts to recognize code patterns that indicate potential issues.
            </li>
            <li>
              <strong>Control Flow Analysis:</strong> AI examines execution paths to identify conditions where vulnerabilities could be exploited.
            </li>
            <li>
              <strong>Semantic Understanding:</strong> Beyond pattern matching, AI comprehends the semantic meaning of code to identify logic flaws.
            </li>
            <li>
              <strong>Cross-Contract Analysis:</strong> Examines interactions between contracts to find vulnerabilities that emerge from composition.
            </li>
          </ul>
        </>
      )
    },
    remediation: {
      title: 'AI-Generated Fixes',
      content: (
        <>
          <h4>Automatic Remediation</h4>
          <p>
            For each identified vulnerability, our AI system proposes concrete code changes to fix the issue while preserving the contract's intended functionality.
          </p>
          <p>
            The fix generation process involves:
          </p>
          <ol>
            <li>Precisely identifying the vulnerable code segment</li>
            <li>Understanding the intended function of that code</li>
            <li>Applying security best practices to rewrite the code</li>
            <li>Validating that the new code resolves the issue without introducing new problems</li>
          </ol>
        </>
      )
    },
    consensus: {
      title: 'AI Consensus Mechanism',
      content: (
        <>
          <h4>How Multiple AI Models Reach Agreement</h4>
          <p>
            When multiple AI models analyze the same contract, they often find overlapping but not identical issues. Our consensus mechanism:
          </p>
          <ol>
            <li>Collects findings from all AI models</li>
            <li>Groups similar findings together</li>
            <li>Assigns confidence scores based on how many models identified each issue</li>
            <li>Prioritizes high-confidence issues</li>
            <li>Eliminates likely false positives with low consensus</li>
          </ol>
          <p>
            This approach significantly reduces false positives and ensures that reported issues are genuine security concerns.
          </p>
        </>
      )
    },
    networks: {
      title: 'Network-Specific Analysis',
      content: (
        <>
          <h4>Specialized Analysis for Each Blockchain</h4>
          <p>
            Different blockchains have unique characteristics that affect contract security. Our AI models are fine-tuned for specific networks:
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div style={{ 
              flex: '1 1 250px',
              padding: '1rem',
              backgroundColor: '#e0f2fe',
              borderRadius: '0.5rem',
              border: '1px solid #bae6fd'
            }}>
              <h5 style={{ color: '#0284c7', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                  <path d="M12 22V2M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Linea Analysis
              </h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Optimized for Linea's EVM implementation</li>
                <li>Special focus on gas optimization</li>
                <li>Cross-layer integration security</li>
                <li>Linea-specific best practices</li>
              </ul>
            </div>
            
            <div style={{ 
              flex: '1 1 250px',
              padding: '1rem',
              backgroundColor: '#f5f3ff',
              borderRadius: '0.5rem',
              border: '1px solid #ddd6fe'
            }}>
              <h5 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sonic Analysis
              </h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Customized for Sonic blockchain architecture</li>
                <li>Sonic-specific vulnerability patterns</li>
                <li>Optimized fee structure analysis</li>
                <li>Sonic governance interaction safety</li>
              </ul>
            </div>
          </div>
        </>
      )
    }
  };
  
  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Smart Contract AI Security Analysis
      </h3>
      
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', padding: '0 1rem' }}>
          {Object.keys(tabContent).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              style={{
                padding: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tabKey ? '2px solid #3b82f6' : 'none',
                fontWeight: activeTab === tabKey ? 'bold' : 'normal',
                color: activeTab === tabKey ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tabContent[tabKey].title}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#4b5563' }}>
            {tabContent[activeTab].content}
          </div>
          
          {/* Common footer */}
          <div style={{ 
            marginTop: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
            <span>
              Our AI analysis technology is continuously improving. While highly accurate, we recommend manual verification of critical contracts before deployment.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExplanation;
