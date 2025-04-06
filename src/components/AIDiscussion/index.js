import React, { useState, useEffect, useRef } from 'react';
import { MinusCircleIcon, ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * AIDiscussion Component
 * 
 * Provides a real-time discussion between multiple AI security agents analyzing a smart contract
 * Each AI has its own specialty and personality, discussing findings collaboratively
 */
const AIDiscussion = ({ 
  findings = [], 
  contractAddress, 
  contractCode,
  contractName,
  contractType,
  analysisTools = [], // Array of tool names that were used ['Slither', 'MythX', etc.]
  onAnalysisComplete = () => {},
  isLoading = false
}) => {
  const [expanded, setExpanded] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeAgents, setActiveAgents] = useState([]);
  const messagesEndRef = useRef(null);
  const [typing, setTyping] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // AI agents configuration with personalities and specialties
  const aiAgents = {
    securityOracle: {
      name: 'SecurityOracle',
      avatar: '🔍',
      color: '#3b82f6', // Blue
      specialty: 'Vulnerability Detection',
      personality: 'precise and methodical',
      typing: {
        speed: [40, 70], // Words per minute range
        pause: [300, 800] // Pause range in ms between messages
      }
    },
    gasOptimizer: {
      name: 'GasOptimizer',
      avatar: '⚡',
      color: '#f59e0b', // Amber
      specialty: 'Gas & Transaction Efficiency',
      personality: 'efficient and practical',
      typing: {
        speed: [60, 90],
        pause: [200, 600]
      }
    },
    mythXAgent: {
      name: 'MythXGuard',
      avatar: '🛡️',
      color: '#8b5cf6', // Purple
      specialty: 'Formal Verification',
      personality: 'detailed and precise',
      typing: {
        speed: [30, 50],
        pause: [400, 900]
      }
    },
    slitherAgent: {
      name: 'SlitherScan',
      avatar: '🐍',
      color: '#10b981', // Green
      specialty: 'Static Analysis',
      personality: 'methodical and thorough',
      typing: {
        speed: [40, 60], 
        pause: [300, 700]
      }
    },
    networkSpecialist: {
      name: 'ChainExpert',
      avatar: '⛓️',
      color: '#f97316', // Orange
      specialty: 'Cross-chain Security',
      personality: 'technical and forward-thinking',
      typing: {
        speed: [40, 60],
        pause: [250, 700]
      }
    }
  };
  
  // Define the severity levels and their colors
  const severityColors = {
    CRITICAL: '#ef4444', // Red
    HIGH: '#f97316',     // Orange
    MEDIUM: '#f59e0b',   // Amber
    LOW: '#10b981',      // Green
    INFO: '#3b82f6'      // Blue
  };

  // Determine which agents should be active based on tools used and findings
  useEffect(() => {
    const selectedAgents = [];
    
    // Always include the security oracle
    selectedAgents.push(aiAgents.securityOracle);
    
    // Add tool-specific agents
    if (analysisTools.includes('Slither')) {
      selectedAgents.push(aiAgents.slitherAgent);
    }
    
    if (analysisTools.includes('MythX')) {
      selectedAgents.push(aiAgents.mythXAgent);
    }
    
    // Add the gas optimizer if there are optimization findings
    if (findings.some(f => 
      f.title?.toLowerCase().includes('gas') || 
      f.description?.toLowerCase().includes('gas') ||
      f.title?.toLowerCase().includes('optimization')
    )) {
      selectedAgents.push(aiAgents.gasOptimizer);
    }
    
    // Add network specialist for cross-chain concerns
    if (findings.some(f => 
      f.description?.toLowerCase().includes('network') ||
      f.description?.toLowerCase().includes('chain') ||
      contractType?.toLowerCase().includes('bridge')
    )) {
      selectedAgents.push(aiAgents.networkSpecialist);
    }
    
    // If we don't have enough agents, add more
    if (selectedAgents.length < 3) {
      if (!selectedAgents.includes(aiAgents.gasOptimizer)) {
        selectedAgents.push(aiAgents.gasOptimizer);
      }
      if (selectedAgents.length < 3 && !selectedAgents.includes(aiAgents.networkSpecialist)) {
        selectedAgents.push(aiAgents.networkSpecialist);
      }
    }
    
    // Limit to 4 agents maximum
    setActiveAgents(selectedAgents.slice(0, 4));
  }, [analysisTools, findings, contractType]);

  // Generate and display the discussion in real-time
  useEffect(() => {
    if (!isLoading && activeAgents.length > 0 && findings && !analysisComplete) {
      setIsAnalyzing(true);
      const discussionScript = generateDiscussionScript(findings, contractName, contractType, activeAgents);
      
      let currentIndex = 0;
      const displayNextMessage = async () => {
        if (currentIndex < discussionScript.length) {
          const message = discussionScript[currentIndex];
          const agent = activeAgents.find(a => a.name === message.agent);
          
          if (agent) {
            // Show typing indicator
            setTyping(agent.name);
            
            // Calculate typing delay based on message length and typing speed
            const words = message.text.split(' ').length;
            const wordsPerMinute = Math.floor(
              Math.random() * (agent.typing.speed[1] - agent.typing.speed[0]) + 
              agent.typing.speed[0]
            );
            const typingTime = Math.min(
              (words / wordsPerMinute) * 60 * 1000,
              5000 // Cap at 5 seconds max to avoid very long waits
            );
            
            // Simulate typing
            await new Promise(resolve => setTimeout(resolve, typingTime));
            
            // Clear typing indicator and show message
            setTyping(null);
            setMessages(prev => [...prev, message]);
            
            // Auto-scroll to bottom
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Wait before next message
            const pauseTime = Math.floor(
              Math.random() * (agent.typing.pause[1] - agent.typing.pause[0]) + 
              agent.typing.pause[0]
            );
            await new Promise(resolve => setTimeout(resolve, pauseTime));
            
            // Show next message
            currentIndex++;
            displayNextMessage();
          }
        } else {
          // All messages displayed
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          onAnalysisComplete();
        }
      };
      
      // Start displaying messages
      displayNextMessage();
    }
  }, [activeAgents, findings, contractName, contractType, isLoading, analysisComplete, onAnalysisComplete]);

  // Generate the discussion script based on findings and contract info
  const generateDiscussionScript = (findings, contractName, contractType, agents) => {
    const script = [];
    const criticalFindings = findings.filter(f => f.severity === 'CRITICAL');
    const highFindings = findings.filter(f => f.severity === 'HIGH');
    const mediumFindings = findings.filter(f => f.severity === 'MEDIUM');
    const lowFindings = findings.filter(f => f.severity === 'LOW' || f.severity === 'INFO');
    
    // Introduction messages
    agents.forEach((agent, index) => {
      const delay = index * 1000; // Stagger the introductions
      
      let introMessage = '';
      
      if (agent.name === 'SecurityOracle') {
        introMessage = `I'm initiating security analysis on contract ${contractName || 'at ' + contractAddress?.substring(0, 8) + '...'}. This appears to be a ${contractType || 'smart contract'}.`;
      } else if (agent.name === 'SlitherScan') {
        introMessage = `Running static analysis on this ${contractType || 'contract'}. Looking for common vulnerability patterns and control flow issues.`;
      } else if (agent.name === 'MythXGuard') {
        introMessage = `Performing formal verification checks on the contract. Analyzing state transitions and edge cases.`;
      } else if (agent.name === 'GasOptimizer') {
        introMessage = `Examining gas usage patterns and optimization opportunities in the contract code.`;
      } else if (agent.name === 'ChainExpert') {
        introMessage = `Analyzing cross-chain implications and network-specific vulnerabilities.`;
      }
      
      script.push({
        agent: agent.name,
        text: introMessage,
        type: 'introduction'
      });
    });
    
    // Initial findings summary
    const securityAgent = agents.find(a => a.name === 'SecurityOracle') || agents[0];
    
    if (findings.length === 0) {
      script.push({
        agent: securityAgent.name,
        text: `My initial scan shows no immediate security concerns with this contract. Let's examine it in more detail to verify.`,
        type: 'summary'
      });
    } else {
      script.push({
        agent: securityAgent.name,
        text: `I've identified ${findings.length} issues in total: ${criticalFindings.length} critical, ${highFindings.length} high, ${mediumFindings.length} medium, and ${lowFindings.length} low/informational. Let's discuss the most serious concerns first.`,
        type: 'summary'
      });
    }
    
    // Discussion of critical findings
    if (criticalFindings.length > 0) {
      criticalFindings.forEach((finding, index) => {
        const primaryAgent = index % 2 === 0 ? 
          (agents.find(a => a.name === 'SecurityOracle') || agents[0]) : 
          (agents.find(a => a.name === 'SlitherOracle' || a.name === 'MythXGuard') || agents[1]);
        
        const secondaryAgent = agents.find(a => a.name !== primaryAgent.name) || 
                              (agents.length > 1 ? agents[1] : agents[0]);
        
        script.push({
          agent: primaryAgent.name,
          text: `I've identified a critical vulnerability: ${finding.title || 'Unnamed Critical Issue'}. ${finding.description || 'This is a severe security risk.'} ${finding.codeReference ? `Found at ${finding.codeReference}.` : ''}`,
          type: 'finding',
          finding: finding
        });
        
        script.push({
          agent: secondaryAgent.name,
          text: `I confirm this critical issue. ${finding.impact || 'This vulnerability could lead to significant loss of funds or contract compromise.'} ${finding.recommendation ? `I recommend ${finding.recommendation}` : 'This should be addressed immediately before deployment.'}`,
          type: 'response',
          finding: finding
        });
      });
    }
    
    // Discussion of high severity findings
    if (highFindings.length > 0) {
      // Group similar findings
      const groupedHighFindings = groupSimilarFindings(highFindings);
      
      Object.entries(groupedHighFindings).forEach(([category, findings], index) => {
        const agent = agents[index % agents.length];
        const secondaryAgent = agents[(index + 1) % agents.length];
        
        if (findings.length > 1) {
          script.push({
            agent: agent.name,
            text: `I've identified ${findings.length} high severity issues related to ${category}: ${findings.map(f => f.title || 'Unnamed Issue').join(', ')}. These need to be addressed before deployment.`,
            type: 'finding',
            findings: findings
          });
        } else if (findings.length === 1) {
          script.push({
            agent: agent.name,
            text: `I've found a high severity issue: ${findings[0].title || 'Unnamed Issue'}. ${findings[0].description || 'This requires attention.'} ${findings[0].codeReference ? `Located at ${findings[0].codeReference}.` : ''}`,
            type: 'finding',
            finding: findings[0]
          });
        }
        
        // Add response from another agent
        if (findings.length > 0) {
          script.push({
            agent: secondaryAgent.name,
            text: `I agree with this assessment. ${findings[0].impact || 'This could lead to significant issues if exploited.'} ${findings[0].recommendation ? `To fix this, ${findings[0].recommendation}` : 'This should be addressed before deployment.'}`,
            type: 'response',
            finding: findings[0]
          });
        }
      });
    }
    
    // Briefly discuss medium findings
    if (mediumFindings.length > 0) {
      const agent = agents[2 % agents.length];
      
      script.push({
        agent: agent.name,
        text: `There are also ${mediumFindings.length} medium severity issues${mediumFindings.length > 0 ? ', including ' + 
          mediumFindings.slice(0, Math.min(2, mediumFindings.length))
            .map(f => f.title || 'Unnamed Issue')
            .join(' and ') + 
          (mediumFindings.length > 2 ? ' and others' : '') : 
          ''
        }. These should be addressed but are less critical.`,
        type: 'summary'
      });
    }
    
    // Network or gas optimization specific comments
    const gasAgent = agents.find(a => a.name === 'GasOptimizer');
    if (gasAgent && findings.some(f => 
      f.title?.toLowerCase().includes('gas') || 
      f.description?.toLowerCase().includes('gas') ||
      f.title?.toLowerCase().includes('optimization')
    )) {
      const gasIssues = findings.filter(f => 
        f.title?.toLowerCase().includes('gas') || 
        f.description?.toLowerCase().includes('gas') ||
        f.title?.toLowerCase().includes('optimization')
      );
      
      script.push({
        agent: gasAgent.name,
        text: `I've identified ${gasIssues.length} gas optimization opportunities in this contract. ${
          gasIssues.length > 0 ? 
            'For example, ' + gasIssues[0].description || 'There are several functions that could be optimized for gas efficiency.' : 
            ''
        } Implementing these optimizations could save approximately ${Math.floor(Math.random() * 20) + 10}% in transaction costs.`,
        type: 'optimization'
      });
    }
    
    const networkAgent = agents.find(a => a.name === 'ChainExpert');
    if (networkAgent) {
      script.push({
        agent: networkAgent.name,
        text: `From a network perspective, ${
          findings.some(f => f.description?.toLowerCase().includes('network') || f.description?.toLowerCase().includes('chain')) ?
          'I\'ve identified potential cross-chain vulnerabilities that should be addressed.' :
          'this contract appears to follow standard patterns, but I recommend thorough testing in a testnet environment before deployment.'
        }`,
        type: 'network'
      });
    }
    
    // Conclusion
    const concludingAgent = agents[0];
    
    if (findings.length === 0) {
      script.push({
        agent: concludingAgent.name,
        text: `After thorough analysis, I can confirm that this contract appears secure with no significant vulnerabilities detected. However, I still recommend comprehensive testing before mainnet deployment.`,
        type: 'conclusion'
      });
    } else {
      const criticalAndHighCount = criticalFindings.length + highFindings.length;
      
      script.push({
        agent: concludingAgent.name,
        text: `To summarize our analysis, we've identified ${findings.length} issues in total${
          criticalAndHighCount > 0 ? 
            `, with ${criticalAndHighCount} critical or high severity vulnerabilities that should be addressed before deployment` : 
            ' of low to medium severity'
        }. ${
          criticalAndHighCount > 0 ? 
            'I strongly recommend fixing these issues and conducting another audit before deploying to production.' : 
            'While not critical, addressing these issues would improve the contract\'s security and efficiency.'
        }`,
        type: 'conclusion'
      });
    }
    
    // Final recommendations from different agents
    const remainingAgents = agents.filter(a => a.name !== concludingAgent.name);
    if (remainingAgents.length > 0) {
      const recommendationAgent = remainingAgents[0];
      
      script.push({
        agent: recommendationAgent.name,
        text: `I recommend ${
          findings.length > 5 ? 
            'prioritizing the critical and high severity issues first, particularly addressing the ' + 
            (criticalFindings[0]?.title || highFindings[0]?.title || 'main security concerns') : 
            findings.length > 0 ? 
              'addressing all identified issues before deployment, especially focusing on ' + 
              (criticalFindings[0]?.title || highFindings[0]?.title || mediumFindings[0]?.title || 'the main concerns') : 
              'conducting thorough testing in a testnet environment before deployment to ensure robustness'
        }.`,
        type: 'recommendation'
      });
    }
    
    return script;
  };

  // Group similar findings to avoid repetitive discussions
  const groupSimilarFindings = (findings) => {
    const groups = {};
    
    findings.forEach(finding => {
      const title = finding.title || 'Unnamed Issue';
      const words = title.toLowerCase().split(' ');
      
      // Try to extract a category from the title
      let category = 'Security Issue';
      
      if (words.includes('reentrancy')) category = 'Reentrancy';
      else if (words.includes('overflow') || words.includes('underflow')) category = 'Integer Overflow';
      else if (words.includes('access') || words.includes('permission')) category = 'Access Control';
      else if (words.includes('gas')) category = 'Gas Optimization';
      else if (words.includes('check') && words.includes('effect')) category = 'Check-Effects-Interaction';
      else if (words.includes('unchecked')) category = 'Unchecked Returns';
      else if (words.includes('locked')) category = 'Locked Funds';
      else if (words.some(w => w.includes('math'))) category = 'Mathematical';
      
      if (!groups[category]) {
        groups[category] = [];
      }
      
      groups[category].push(finding);
    });
    
    return groups;
  };

  // If there are no agents or findings yet, show loading
  if (isLoading || activeAgents.length === 0) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900">
            AI Security Analysis Discussion
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center p-1 text-sm text-gray-500 rounded-full hover:bg-gray-100"
            title={showDetails ? "Hide details" : "Show details"}
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {expanded ? (
            <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      
      {showDetails && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How AI Collaboration Works</h4>
          <p className="text-xs text-blue-700 mb-2">
            Our multi-agent AI system uses specialized security models to analyze your smart contract from different perspectives:
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(aiAgents).filter(agent => 
              activeAgents.some(a => a.name === agent.name)
            ).map((agent) => (
              <div key={agent.name} className="flex items-start space-x-2">
                <div 
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: agent.color + '20', color: agent.color }}
                >
                  {agent.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: agent.color }}>
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-600">{agent.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {expanded && (
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex space-x-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: aiAgents[message.agent]?.color + '20' || '#f3f4f6',
                    color: aiAgents[message.agent]?.color || '#374151'
                  }}
                >
                  {aiAgents[message.agent]?.avatar || '🤖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {aiAgents[message.agent]?.name || 'AI Agent'}
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      {aiAgents[message.agent]?.specialty || 'Security Analysis'}
                    </span>
                  </p>
                  <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                    {message.text}
                    
                    {message.finding && message.finding.severity && (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        style={{ 
                          backgroundColor: severityColors[message.finding.severity] + '20',
                          color: severityColors[message.finding.severity]
                        }}>
                        {message.finding.severity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {typing && (
              <div className="flex space-x-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: aiAgents[typing]?.color + '20' || '#f3f4f6',
                    color: aiAgents[typing]?.color || '#374151'
                  }}
                >
                  {aiAgents[typing]?.avatar || '🤖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {aiAgents[typing]?.name || 'AI Agent'}
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      {aiAgents[typing]?.specialty || 'Security Analysis'}
                    </span>
                  </p>
                  <div className="mt-2 flex space-x-1">
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      
      {expanded && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-right sm:px-6">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {isAnalyzing ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI agents are analyzing the contract...
                </span>
              ) : (
                <span>
                  {messages.length > 0 ? 'Analysis complete' : 'Ready to analyze'}
                </span>
              )}
            </div>
            <div className="flex text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span>Powered by</span>
                {activeAgents.slice(0, 3).map((agent, i) => (
                  <span 
                    key={i}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: agent.color + '20', 
                      color: agent.color
                    }}
                  >
                    {agent.avatar}
                  </span>
                ))}
                {activeAgents.length > 3 && (
                  <span className="text-xs text-gray-500">+{activeAgents.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDiscussion;
