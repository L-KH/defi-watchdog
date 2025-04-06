import React, { useState } from 'react';

/**
 * AIAgentsInfo Component
 * Displays information about the AI agents used for contract analysis
 */
const AIAgentsInfo = ({ expanded = false, network = null }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Define the AI agents used for analysis
  const aiAgents = [
    {
      name: 'OpenAI GPT-4',
      role: 'Primary Analyzer',
      description: 'Conducts deep analysis of contract code, checking for known vulnerabilities, logic flaws, and security best practices.',
      strengthsText: 'Excellent at identifying complex logic vulnerabilities and suggesting best practices.',
      icon: '🧠',
      iconColor: '#fef3c7',
      iconTextColor: '#d97706',
      expanded: true
    },
    {
      name: 'Deepseek Coder',
      role: 'Code Structure Specialist',
      description: 'Evaluates code organization, dependency management, and structural vulnerabilities like centralization risks.',
      strengthsText: 'Specialized in detecting subtle code patterns and architectural flaws.',
      icon: '🔍',
      iconColor: '#ede9fe',
      iconTextColor: '#8b5cf6',
      expanded: false
    },
    {
      name: 'Mistral',
      role: 'Economic Validator',
      description: 'Analyzes economic attack vectors, incentive structures, and game-theoretic vulnerabilities.',
      strengthsText: 'Focuses on financial security aspects and potential economic exploits.',
      icon: '🔮',
      iconColor: '#dbeafe',
      iconTextColor: '#3b82f6',
      expanded: false
    },
    {
      name: 'ZerePy',
      role: 'Network-Specific Expert',
      description: 'Provides specialized analysis for Sonic blockchain contracts, focusing on network-specific optimizations and vulnerabilities.',
      strengthsText: 'In-depth knowledge of Sonic blockchain architecture and conventions.',
      icon: '🤖',
      iconColor: '#ecfdf5',
      iconTextColor: '#10b981',
      expanded: false,
      networkSpecific: 'sonic'
    },
    {
      name: 'LineaLens',
      role: 'Network-Specific Expert',
      description: 'Specialized in Linea network contracts, focusing on optimizations and security practices specific to Linea.',
      strengthsText: 'Deep knowledge of Linea\'s EVM implementation and specific security concerns.',
      icon: '⚡',
      iconColor: '#e0f2fe',
      iconTextColor: '#0ea5e9',
      expanded: false,
      networkSpecific: 'linea'
    }
  ];
  
  // Filter agents by network if specified
  const filteredAgents = network
    ? aiAgents.filter(agent => !agent.networkSpecific || agent.networkSpecific === network)
    : aiAgents;
  
  // Agent detail section
  const AgentDetail = ({ agent }) => {
    const [showDetails, setShowDetails] = useState(agent.expanded);
    
    return (
      <div style={{ 
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: showDetails ? '0.75rem' : 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: agent.iconColor,
              color: agent.iconTextColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              fontSize: '1.25rem'
            }}>
              {agent.icon}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{agent.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{agent.role}</div>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: showDetails ? '#f3f4f6' : 'white',
              cursor: 'pointer'
            }}
          >
            <svg 
              width="16" 
              height="16" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {showDetails && (
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#4b5563',
            paddingTop: '0.5rem',
            borderTop: '1px solid #e5e7eb',
            marginTop: '0.5rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>{agent.description}</p>
            <div style={{ 
              backgroundColor: agent.iconColor, 
              padding: '0.5rem', 
              borderRadius: '0.25rem',
              color: agent.iconTextColor,
              fontWeight: '500'
            }}>
              <strong>Strengths:</strong> {agent.strengthsText}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          AI Analysis Agents
        </h3>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: '#3b82f6',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            style={{ 
              marginLeft: '0.25rem',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isExpanded ? (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              border: '1px solid #bae6fd'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: 0, marginBottom: '0.5rem' }}>
                How Multi-AI Analysis Works
              </h4>
              <p style={{ fontSize: '0.875rem', margin: '0 0 0.75rem 0' }}>
                Our system employs multiple specialized AI models to analyze smart contracts from different perspectives. This approach:
              </p>
              <ul style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '1.5rem' }}>
                <li>Reduces false positives through cross-validation between models</li>
                <li>Provides confidence scores based on how many models identified each issue</li>
                <li>Combines specialized expertise from different AI agents</li>
                <li>Delivers more comprehensive analysis than any single model could provide</li>
              </ul>
            </div>
          </div>
          
          <div>
            {filteredAgents.map((agent, index) => (
              <AgentDetail key={index} agent={agent} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          flexWrap: 'wrap',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          {filteredAgents.map((agent, index) => (
            <div key={index} style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              backgroundColor: agent.iconColor,
              borderRadius: '9999px',
              color: agent.iconTextColor,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <span style={{ marginRight: '0.25rem' }}>{agent.icon}</span>
              {agent.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAgentsInfo;
