import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

const HowItWorks = () => {
  return (
    <Layout>
      <Head>
        <title>How It Works - DeFi Watchdog</title>
      </Head>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          How DeFi Watchdog Works
        </h1>
        
        {/* Hero Section */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3b82f6' }}>
            AI-Powered Security for Smart Contracts
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '700px', margin: '0 auto' }}>
            DeFi Watchdog uses advanced AI models to analyze smart contracts for security vulnerabilities, 
            generating comprehensive reports and providing actionable fixes to enhance contract security.
          </p>
        </div>
        
        {/* Multi-AI Analysis Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Multi-AI Analysis Approach
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                backgroundColor: '#dbeafe', 
                borderRadius: '9999px', 
                width: '3rem', 
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🧠</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>OpenAI Analysis</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Uses GPT-4 to identify common vulnerabilities like reentrancy, access control issues, 
                and front-running risks.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                backgroundColor: '#ede9fe', 
                borderRadius: '9999px', 
                width: '3rem', 
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🔍</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Deepseek Analysis</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Specializes in detecting subtle logic flaws, centralization risks, and unexpected edge cases
                in contract execution.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                backgroundColor: '#d1fae5', 
                borderRadius: '9999px', 
                width: '3rem', 
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🔮</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mistral Analysis</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Focuses on authentication patterns, permission systems, and economic attack vectors that
                could compromise contract security.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                backgroundColor: '#ecfdf5', 
                borderRadius: '9999px', 
                width: '3rem', 
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🤖</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ZerePy Agent</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Specialized agent for Sonic blockchain analysis with deep understanding of Sonic-specific
                vulnerabilities and optimizations.
              </p>
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>The AI Consensus Process</h3>
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>Each AI agent independently analyzes the smart contract source code</li>
              <li style={{ marginBottom: '0.75rem' }}>Static analysis tools provide additional metrics and checks</li>
              <li style={{ marginBottom: '0.75rem' }}>AI agents discuss findings to eliminate false positives and validate issues</li>
              <li style={{ marginBottom: '0.75rem' }}>Issues are assigned confidence scores based on multi-AI agreement</li>
              <li style={{ marginBottom: '0.75rem' }}>Structured vulnerability report is generated with verified findings</li>
              <li style={{ marginBottom: '0.75rem' }}>AI suggests code fixes for each identified issue</li>
              <li style={{ marginBottom: '0' }}>A final security score is calculated based on the number and severity of findings</li>
            </ol>
          </div>
        </div>
        
        {/* Analysis Features Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Advanced Analysis Features
          </h2>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#eff6ff', 
              padding: '1.25rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                backgroundColor: '#3b82f6', 
                borderRadius: '9999px', 
                width: '2.5rem', 
                height: '2.5rem',
                minWidth: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>Comprehensive Vulnerability Detection</h3>
                <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                  Our AI models are trained on thousands of smart contract vulnerabilities and exploits, covering all major security
                  risks including reentrancy, integer overflow/underflow, access control issues, and more.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'white', 
              padding: '1.25rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                backgroundColor: '#3b82f6', 
                borderRadius: '9999px', 
                width: '2.5rem', 
                height: '2.5rem',
                minWidth: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>Audit Discussion Interface</h3>
                <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                  Watch our AI agents discuss your contract in real-time, highlighting concerns and validating each
                  other's findings. This transparent approach provides insight into the analysis process and reasoning.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#f9fafb', 
              padding: '1.25rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                backgroundColor: '#3b82f6', 
                borderRadius: '9999px', 
                width: '2.5rem', 
                height: '2.5rem',
                minWidth: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>AI-Generated Security Fixes</h3>
                <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                  For each identified vulnerability, our AI provides detailed fix recommendations with before/after code
                  comparisons and explanations of the changes. These fixes can be directly copied and implemented.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'white', 
              padding: '1.25rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                backgroundColor: '#3b82f6', 
                borderRadius: '9999px', 
                width: '2.5rem', 
                height: '2.5rem',
                minWidth: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                4
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>Network-Specific Optimizations</h3>
                <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                  Unique optimizations for Linea and Sonic blockchains that consider the specific characteristics
                  of each network's execution environment, gas model, and validator behavior.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#f9fafb', 
              padding: '1.25rem'
            }}>
              <div style={{ 
                backgroundColor: '#3b82f6', 
                borderRadius: '9999px', 
                width: '2.5rem', 
                height: '2.5rem',
                minWidth: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                5
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>Security Certifications</h3>
                <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                  Contracts that pass security checks can receive NFT certifications, providing an on-chain
                  verification of security analysis that users and investors can trust.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sonic Specific Features */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Sonic-Specific Features
          </h2>
          
          <div style={{ 
            backgroundColor: '#f5f3ff', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            marginBottom: '2rem',
            border: '1px solid #e9d5ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.75rem', color: '#8b5cf6' }}>
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>
                ZerePy: The Sonic-Specialized AI Agent
              </h3>
            </div>
            
            <p style={{ margin: '1rem 0' }}>
              ZerePy is our specialized AI agent trained specifically for the Sonic blockchain. It understands Sonic's
              unique architecture and optimization requirements, providing tailored analysis for Sonic contracts.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.375rem', 
                padding: '1rem',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  Sonic Gas Optimizations
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Tailored gas optimization recommendations that consider Sonic's specific gas model
                  and execution environment.
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.375rem', 
                padding: '1rem',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  Sonic-Specific Vulnerabilities
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Detection of vulnerabilities that are specific to or more severe on the Sonic network
                  due to its unique architecture.
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.375rem', 
                padding: '1rem',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  Cross-Chain Security
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Analysis of cross-chain interactions between Sonic and other networks, identifying
                  potential bridge or relay vulnerabilities.
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.375rem', 
                padding: '1rem',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  Enhanced ZK Circuit Analysis
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Specialized analysis of zero-knowledge circuits and proofs used in Sonic's privacy-preserving
                  applications.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div style={{ 
          backgroundColor: '#1e40af', 
          borderRadius: '0.5rem', 
          padding: '3rem 2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Analyze Your Smart Contract?
          </h2>
          <p style={{ fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto 1.5rem auto', color: '#e0f2fe' }}>
            Get a comprehensive security analysis from our multi-AI system and identify vulnerabilities
            before they can be exploited.
          </p>
          <Link 
            href="/audit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'white',
              color: '#1e40af',
              fontWeight: 'bold',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '1.125rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            Analyze Contract Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
