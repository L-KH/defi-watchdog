import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function AIAgents() {
  const [activeAgent, setActiveAgent] = useState('zerepyAgent');
  
  // Agent data
  const agents = {
    zerepyAgent: {
      name: 'ZerePy',
      description: 'Specialized agent for Sonic blockchain analysis with deep understanding of ZK-rollup vulnerabilities and gas optimization.',
      capabilities: [
        'Sonic blockchain-specific optimizations',
        'ZK-rollup security analysis',
        'Gas usage optimization recommendations',
        'Sonic ecosystem integration checks'
      ],
      modelBase: 'Custom ensemble of GPT-4, Deepseek-Coder, and Claude',
      accuracy: 94,
      icon: '🤖',
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    openaiAgent: {
      name: 'OpenAI Agent',
      description: 'Powered by GPT-4, this agent specializes in identifying common vulnerabilities, logical flaws, and best practices in smart contracts.',
      capabilities: [
        'Common vulnerability detection',
        'Static code analysis',
        'Access control verification',
        'Contract pattern recognition'
      ],
      modelBase: 'GPT-4 Turbo',
      accuracy: 92,
      icon: '🧠',
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    deepseekAgent: {
      name: 'DeepSeek Agent',
      description: 'Code-focused agent specialized in deep analysis of smart contract implementations and optimizations.',
      capabilities: [
        'Code flow analysis',
        'Resource usage optimization',
        'Complex vulnerability patterns',
        'Contract architecture assessment'
      ],
      modelBase: 'DeepSeek Coder 33B',
      accuracy: 89,
      icon: '🔍',
      color: '#8b5cf6',
      bgColor: '#f5f3ff'
    },
    mistralAgent: {
      name: 'Mistral Agent',
      description: 'Focuses on economic implications and game-theoretic vulnerabilities in DeFi contracts.',
      capabilities: [
        'Economic attack vector analysis',
        'Validator incentive checks',
        'MEV vulnerability detection',
        'Price oracle manipulation detection'
      ],
      modelBase: 'Mistral Large',
      accuracy: 87,
      icon: '🔮',
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    ensembleAgent: {
      name: 'AI Ensemble',
      description: 'Meta-agent that coordinates inputs from all other agents, mediates disagreements, and produces consensus reports.',
      capabilities: [
        'Cross-model validation',
        'False-positive reduction',
        'Confidence scoring',
        'Final recommendation synthesis'
      ],
      modelBase: 'Custom orchestration layer',
      accuracy: 97,
      icon: '🌐',
      color: '#6366f1',
      bgColor: '#eef2ff'
    }
  };
  
  // Recommendations for improvements from each agent
  const improvements = [
    {
      agent: 'zerepyAgent',
      title: 'Gas Optimization in Loops',
      description: 'Replace storage variables in loops with memory variables to save gas',
      code: `// Original code (inefficient)
for (uint i = 0; i < users.length; i++) {
    balances[users[i]] += rewards[i];
}

// Optimized code
mapping(address => uint) storage _balances = balances;
for (uint i = 0; i < users.length; i++) {
    _balances[users[i]] += rewards[i];
}`
    },
    {
      agent: 'openaiAgent',
      title: 'Reentrancy Prevention',
      description: 'Add ReentrancyGuard or implement checks-effects-interactions pattern',
      code: `// Vulnerable code
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    balances[msg.sender] -= amount; // State update after external call
}

// Secured code
function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount; // State update before external call
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}`
    },
    {
      agent: 'deepseekAgent',
      title: 'Precision Loss in Division',
      description: 'Multiplication before division to prevent precision loss',
      code: `// Original code with precision loss
uint256 percentage = amount / total * 100;

// Fixed code
uint256 percentage = amount * 100 / total;`
    },
    {
      agent: 'mistralAgent',
      title: 'Oracle Price Manipulation',
      description: 'Use time-weighted average prices instead of spot prices',
      code: `// Vulnerable code
function getPrice(address token) public view returns (uint256) {
    return oracle.getSpotPrice(token);
}

// Secured code
function getPrice(address token) public view returns (uint256) {
    return oracle.getTWAP(token, 30 minutes);
}`
    }
  ];
  
  // Simulate AI agent consensus
  const aiConsensus = {
    issueType: 'Reentrancy Vulnerability',
    agentOpinions: [
      {
        agent: 'ZerePy',
        opinion: 'Critical vulnerability detected in withdraw() function. External call is made before state update, allowing for potential reentrancy attack.',
        confidence: 98,
        agentIcon: '🤖',
        agentColor: '#10b981'
      },
      {
        agent: 'OpenAI',
        opinion: 'High risk reentrancy detected, recommend implementing checks-effects-interactions pattern or using OpenZeppelin ReentrancyGuard.',
        confidence: 95,
        agentIcon: '🧠',
        agentColor: '#f59e0b'
      },
      {
        agent: 'DeepSeek',
        opinion: 'Confirmed reentrancy vulnerability. Multiple withdrawal paths could drain contract funds.',
        confidence: 92,
        agentIcon: '🔍',
        agentColor: '#8b5cf6'
      },
      {
        agent: 'Mistral',
        opinion: 'Possible reentrancy, though unlikely due to gas limitations. Still recommend fixing using standard pattern.',
        confidence: 84,
        agentIcon: '🔮',
        agentColor: '#3b82f6'
      }
    ],
    consensusView: 'All AI agents agree this is a Critical vulnerability requiring immediate remediation. Implementing the checks-effects-interactions pattern is the recommended fix. The vulnerability has a potential to allow attackers to drain contract funds by recursively calling withdraw() function before the balance is updated.',
    confidenceScore: 96
  };
  
  return (
    <Layout>
      <Head>
        <title>AI Agents - DeFi Watchdog</title>
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          AI Agents
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem' }}>
          DeFi Watchdog employs multiple specialized AI agents to analyze smart contracts from different perspectives, 
          ensuring comprehensive security analysis and more accurate vulnerability detection.
        </p>
        
        {/* AI Agents Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {Object.entries(agents).map(([agentKey, agent]) => (
            <div 
              key={agentKey}
              onClick={() => setActiveAgent(agentKey)}
              style={{ 
                backgroundColor: activeAgent === agentKey ? agent.bgColor : 'white',
                border: `1px solid ${activeAgent === agentKey ? agent.color : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                padding: '1.25rem',
                cursor: 'pointer',
                boxShadow: activeAgent === agentKey ? `0 2px 8px rgba(0, 0, 0, 0.05)` : 'none',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                color: agent.color
              }}>
                {agent.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.25rem',
                color: activeAgent === agentKey ? agent.color : '#111827'
              }}>
                {agent.name}
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Accuracy: {agent.accuracy}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected Agent Details */}
        {activeAgent && agents[activeAgent] && (
          <div style={{ 
            backgroundColor: agents[activeAgent].bgColor,
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: `1px solid ${agents[activeAgent].color}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                marginRight: '1rem',
                color: agents[activeAgent].color
              }}>
                {agents[activeAgent].icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: agents[activeAgent].color }}>
                  {agents[activeAgent].name}
                </h2>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Based on {agents[activeAgent].modelBase}
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1.5rem' }}>
              {agents[activeAgent].description}
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Capabilities
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {agents[activeAgent].capabilities.map((capability, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', color: '#4b5563' }}>
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Code improvements from the active agent */}
            {improvements.filter(improvement => improvement.agent === activeAgent).map((improvement, index) => (
              <div key={index} style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Sample Improvement
                </h3>
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.375rem', 
                  padding: '1rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: agents[activeAgent].color }}>
                    {improvement.title}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
                    {improvement.description}
                  </p>
                  <pre style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '0.75rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {improvement.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* AI Consensus Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            How AI Consensus Works
          </h2>
          
          <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1.5rem' }}>
            Multiple AI models analyze the contract independently and then collaborate to reach a consensus. 
            This approach helps eliminate false positives and increases detection accuracy.
          </p>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {aiConsensus.issueType}
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {aiConsensus.agentOpinions.map((opinion, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ 
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: opinion.agentColor + '20', // 20% opacity
                    color: opinion.agentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    marginRight: '1rem',
                    flexShrink: 0
                  }}>
                    {opinion.agentIcon}
                  </div>
                  <div style={{ flex: '1' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <div style={{ fontWeight: 'bold', color: opinion.agentColor }}>
                        {opinion.agent}
                      </div>
                      <div style={{ 
                        backgroundColor: opinion.agentColor + '20', // 20% opacity
                        color: opinion.agentColor,
                        borderRadius: '9999px',
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {opinion.confidence}% Confident
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                      {opinion.opinion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              backgroundColor: '#eef2ff',
              borderRadius: '0.375rem',
              padding: '1rem',
              border: '1px solid #c7d2fe'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontWeight: 'bold', 
                  color: '#6366f1' 
                }}>
                  <span style={{ marginRight: '0.5rem' }}>🌐</span>
                  AI Consensus
                </div>
                <div style={{ 
                  backgroundColor: '#818cf8',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.125rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {aiConsensus.confidenceScore}% Confidence
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                {aiConsensus.consensusView}
              </p>
            </div>
          </div>
          
          {/* Process Flowchart */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              AI Agents Analysis Process
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '1rem 0' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  1
                </div>
                <div style={{ 
                  flex: '1', 
                  height: '4px', 
                  backgroundColor: '#f3f4f6', 
                  margin: '0 1rem' 
                }}></div>
                <div style={{ 
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  flex: '5'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Input Processing
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                    Smart contract code is parsed, normalized, and prepared for analysis by all AI agents simultaneously.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  2
                </div>
                <div style={{ 
                  flex: '1', 
                  height: '4px', 
                  backgroundColor: '#f3f4f6', 
                  margin: '0 1rem' 
                }}></div>
                <div style={{ 
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  flex: '5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                    Parallel Analysis
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ 
                      backgroundColor: '#ecfdf5', 
                      color: '#10b981',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      ZerePy Agent Analysis
                    </div>
                    <div style={{ 
                      backgroundColor: '#fffbeb', 
                      color: '#f59e0b',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      OpenAI Agent Analysis
                    </div>
                    <div style={{ 
                      backgroundColor: '#f5f3ff', 
                      color: '#8b5cf6',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      DeepSeek Agent Analysis
                    </div>
                    <div style={{ 
                      backgroundColor: '#eff6ff', 
                      color: '#3b82f6',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      Mistral Agent Analysis
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  3
                </div>
                <div style={{ 
                  flex: '1', 
                  height: '4px', 
                  backgroundColor: '#f3f4f6', 
                  margin: '0 1rem' 
                }}></div>
                <div style={{ 
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  flex: '5'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Finding Reconciliation
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                    AI Ensemble compares findings across all agents, identifies agreements and disagreements, and weighs confidence scores.
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  4
                </div>
                <div style={{ 
                  flex: '1', 
                  height: '4px', 
                  backgroundColor: '#f3f4f6', 
                  margin: '0 1rem' 
                }}></div>
                <div style={{ 
                  backgroundColor: '#eef2ff',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  flex: '5',
                  borderLeft: '4px solid #6366f1'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#6366f1' }}>
                    Final Consensus Report
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                    The AI Ensemble generates a final consensus report with validated findings, fixes, and recommendations, along with confidence scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: '#f5f3ff', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          marginTop: '2rem',
          border: '1px solid #ddd6fe'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#8b5cf6' }}>
            Analyze Your Smart Contract with our AI Agents
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Get comprehensive security analysis from multiple specialized AI models working together.
          </p>
          <Link 
            href="/audit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Start Contract Analysis
          </Link>
        </div>
      </div>
    </Layout>
  );
}
