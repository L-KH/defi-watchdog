import React, { useState, useEffect, useRef } from 'react';

const aiAgents = {
  ethexpert: {
    name: "EthExpert",
    color: "#0284c7", // Blue
    avatar: "🔷",
    specialty: "Ethereum standards and patterns"
  },
  vulnerabilityScanner: {
    name: "VulnScanner",
    color: "#8b5cf6", // Purple
    avatar: "🛡️",
    specialty: "Vulnerability detection"
  },
  gasOptimizer: {
    name: "GasOptimizer",
    color: "#f59e0b", // Amber
    avatar: "⚡",
    specialty: "Gas optimization analysis"
  },
  securityAuditor: {
    name: "SecAuditor",
    color: "#10b981", // Green
    avatar: "🔐",
    specialty: "Security audit coordination"
  }
};

// Generate conversation lines based on contract type
function generateConversation(contractName, contractType, isLongAnalysis = false) {
  const baseConversation = [
    { 
      agent: "ethexpert", 
      message: `Analyzing ${contractName}... I'm identifying the contract type and core functionality.`,
      delay: 1000
    },
    { 
      agent: "vulnerabilityScanner", 
      message: "Running initial vulnerability scan on the source code. Looking for common attack vectors.",
      delay: 2000
    },
    { 
      agent: "gasOptimizer", 
      message: "Starting gas consumption analysis to identify potential optimizations.",
      delay: 2500
    },
    { 
      agent: "ethexpert", 
      message: `Initial assessment: This appears to be a ${contractType} contract.`,
      delay: 3000
    }
  ];

  const typeSpecificMessages = {
    "ERC20 Token": [
      { agent: "vulnerabilityScanner", message: "Analyzing token transfer and approval functions for reentrancy risks.", delay: 3500 },
      { agent: "securityAuditor", message: "Checking access controls on administrative functions like minting and pausing.", delay: 4000 },
      { agent: "ethexpert", message: "Reviewing compliance with the ERC20 standard. Checking for potential edge cases in transfer logic.", delay: 4500 }
    ],
    "ERC721 NFT": [
      { agent: "vulnerabilityScanner", message: "Analyzing NFT transfer safety and checking for proper ownership validation.", delay: 3500 },
      { agent: "securityAuditor", message: "Checking access controls on minting functions and metadata management.", delay: 4000 },
      { agent: "ethexpert", message: "Reviewing compliance with ERC721 standard. Checking for proper implemention of tokenURI and metadata functions.", delay: 4500 }
    ],
    "DEX / AMM": [
      { agent: "vulnerabilityScanner", message: "Analyzing swap functions for reentrancy and price manipulation vulnerabilities.", delay: 3500 },
      { agent: "gasOptimizer", message: "Swap functions typically have high gas usage. Checking for optimization opportunities.", delay: 4000 },
      { agent: "securityAuditor", message: "Checking oracle implementations and price calculation formulas for manipulation risks.", delay: 4500 }
    ],
    "Smart Contract": [
      { agent: "vulnerabilityScanner", message: "Running general security scan for common vulnerabilities like reentrancy and unchecked returns.", delay: 3500 },
      { agent: "securityAuditor", message: "Checking access control patterns and privilege management.", delay: 4000 },
      { agent: "ethexpert", message: "Analyzing contract interactions with external protocols and dependencies.", delay: 4500 }
    ]
  };

  // Add appropriate type-specific messages
  const specificMessages = typeSpecificMessages[contractType] || typeSpecificMessages["Smart Contract"];
  
  let conversation = [...baseConversation, ...specificMessages];

  // Add consensus and conclusion messages
  const conclusionMessages = [
    { agent: "securityAuditor", message: "Coordinating findings from all analysis agents to generate a consensus report.", delay: 5000 },
    { agent: "securityAuditor", message: "Finalizing security score based on all discovered issues and their severity.", delay: 5500 }
  ];

  conversation = [...conversation, ...conclusionMessages];

  // Add more detailed messages for long analysis
  if (isLongAnalysis) {
    const detailedMessages = [
      { agent: "vulnerabilityScanner", message: "Running deep scan on contract logic and edge cases.", delay: 6000 },
      { agent: "gasOptimizer", message: "Performing detailed analysis of storage patterns and optimizations.", delay: 6500 },
      { agent: "ethexpert", message: "Checking for recent development standards and best practices compliance.", delay: 7000 },
      { agent: "securityAuditor", message: "Running additional validation checks and cross-referencing findings.", delay: 7500 },
      { agent: "securityAuditor", message: "Compiling final assessment with actionable recommendations.", delay: 8000 }
    ];
    
    conversation = [...conversation, ...detailedMessages];
  }

  return conversation;
}

function AnalysisConversation({ contractName = "Contract", contractType = "Smart Contract", isRunning, longAnalysis = false }) {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate the conversation if not already generated and analysis is running
    if (isRunning && !hasStarted) {
      const generatedConversation = generateConversation(contractName, contractType, longAnalysis);
      setConversation(generatedConversation);
      setHasStarted(true);
      setVisibleMessages([]);
    }
    
    // Reset when analysis stops
    if (!isRunning && hasStarted) {
      setHasStarted(false);
      setVisibleMessages([]);
    }
  }, [isRunning, contractName, contractType, longAnalysis, hasStarted]);

  useEffect(() => {
    // Progressively reveal messages when conversation is available
    if (conversation.length > 0 && hasStarted && visibleMessages.length < conversation.length) {
      const nextMessage = conversation[visibleMessages.length];
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, nextMessage]);
      }, nextMessage.delay);
      
      return () => clearTimeout(timer);
    }
  }, [conversation, visibleMessages, hasStarted]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages]);

  if (!isRunning || visibleMessages.length === 0) return null;

  return (
    <div style={{
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      maxHeight: '350px',
      overflowY: 'auto'
    }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: '600',
        marginTop: 0,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: '0.5rem' }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        AI Analysis in Progress
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        {visibleMessages.map((msg, index) => {
          const agent = aiAgents[msg.agent];
          return (
            <div
              key={index}
              style={{
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  backgroundColor: agent.color,
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginRight: '8px',
                  marginTop: '2px',
                  fontSize: '14px'
                }}
              >
                {agent.avatar}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: agent.color }}>
                  {agent.name}
                  <span style={{ color: '#64748b', fontWeight: 'normal', marginLeft: '4px' }}>
                    {agent.specialty}
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '8px 12px',
                    borderRadius: '0 8px 8px 8px',
                    border: '1px solid #e2e8f0',
                    marginTop: '4px',
                    fontSize: '0.875rem',
                    maxWidth: '90%'
                  }}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />

        {/* Typing indicator for the next message */}
        {visibleMessages.length < conversation.length && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '36px',
            marginTop: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#cbd5e1',
              borderRadius: '50%',
              margin: '0 2px',
              animation: 'typingBounce 1s infinite'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#cbd5e1',
              borderRadius: '50%',
              margin: '0 2px',
              animation: 'typingBounce 1s infinite',
              animationDelay: '0.2s'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#cbd5e1',
              borderRadius: '50%',
              margin: '0 2px',
              animation: 'typingBounce 1s infinite',
              animationDelay: '0.4s'
            }}></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

export default AnalysisConversation;