import React, { useState, useEffect, useRef } from 'react';

// Conversation message component
const ConversationMessage = ({ speaker, text, typing, messages }) => {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(typing);
  const messageRef = useRef(null);

  // Typing animation effect
  useEffect(() => {
    if (!typing) {
      setTypedText(text);
      return;
    }

    let currentIndex = 0;
    const textLength = text.length;
    setIsTyping(true);

    // Save the interval ID so we can clear it later
    const typingInterval = setInterval(() => {
      setTypedText(text.substring(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex === textLength) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 20); // Speed of typing

    return () => clearInterval(typingInterval);
  }, [text, typing]);

  // Auto scroll to newest message
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [typedText, messages]);

  const getAvatar = () => {
    if (speaker === 'Contract') {
      return (
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          color: '#0284c7',
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          📄
        </div>
      );
    } else if (speaker === 'ZerePy') {
      return (
        <div style={{ 
          backgroundColor: '#ecfdf5', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          color: '#10b981',
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          🤖
        </div>
      );
    } else if (speaker === 'OpenAI') {
      return (
        <div style={{ 
          backgroundColor: '#fef3c7', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          color: '#d97706',
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          🧠
        </div>
      );
    } else if (speaker === 'Deepseek') {
      return (
        <div style={{ 
          backgroundColor: '#ede9fe', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          color: '#8b5cf6',
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          🔍
        </div>
      );
    } else if (speaker === 'Mistral') {
      return (
        <div style={{ 
          backgroundColor: '#dbeafe', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          color: '#3b82f6',
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          🔮
        </div>
      );
    } else {
      return (
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          color: '#6b7280',
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          AI
        </div>
      );
    }
  };

  return (
    <div 
      ref={messageRef}
      style={{ 
        display: 'flex', 
        marginBottom: '16px',
        animation: 'fadeIn 0.3s'
      }}
    >
      {getAvatar()}
      
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '14px', 
          marginBottom: '4px',
          color: speaker === 'Contract' ? '#0284c7' :
                 speaker === 'ZerePy' ? '#10b981' :
                 speaker === 'OpenAI' ? '#d97706' :
                 speaker === 'Deepseek' ? '#8b5cf6' :
                 speaker === 'Mistral' ? '#3b82f6' : '#6b7280'
        }}>
          {speaker}
        </div>
        
        <div style={{ 
          backgroundColor: speaker === 'Contract' ? '#f0f9ff' :
                          speaker === 'ZerePy' ? '#ecfdf5' :
                          speaker === 'OpenAI' ? '#fff7ed' :
                          speaker === 'Deepseek' ? '#f5f3ff' :
                          speaker === 'Mistral' ? '#eff6ff' : '#f9fafb',
          padding: '12px',
          borderRadius: '12px',
          fontSize: '14px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line'
        }}>
          {typedText}
          {isTyping && (
            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
              <span style={{ 
                height: '6px', 
                width: '6px', 
                backgroundColor: '#9ca3af', 
                borderRadius: '50%', 
                margin: '0 1px',
                animation: 'typingBounce 0.5s infinite',
                animationDelay: '0s'
              }}></span>
              <span style={{ 
                height: '6px', 
                width: '6px', 
                backgroundColor: '#9ca3af', 
                borderRadius: '50%', 
                margin: '0 1px',
                animation: 'typingBounce 0.5s infinite',
                animationDelay: '0.2s'
              }}></span>
              <span style={{ 
                height: '6px', 
                width: '6px', 
                backgroundColor: '#9ca3af', 
                borderRadius: '50%', 
                margin: '0 1px',
                animation: 'typingBounce 0.5s infinite',
                animationDelay: '0.4s'
              }}></span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main conversation component
const AnalysisConversation = ({ isRunning, contractName, contractType, longAnalysis }) => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const conversationRef = useRef(null);

  // Define stages based on contract type
  const getConversationSteps = () => {
    if (contractType?.toLowerCase().includes('sonic')) {
      return [
        { speaker: 'Contract', text: `I'm a ${contractType} deployed on the Sonic network. Please analyze me for security vulnerabilities.` },
        { speaker: 'ZerePy', text: 'Starting analysis on this Sonic contract. I'll look for common vulnerabilities specific to Sonic's architecture.' },
        { speaker: 'OpenAI', text: `Analyzing ${contractName}. I'll check for reentrancy, integer overflow, and other common vulnerabilities.` },
        { speaker: 'ZerePy', text: 'I'll also perform gas optimization analysis specific to the Sonic network.' },
        { speaker: 'Deepseek', text: 'Looking at potential centralization risks and ownership concerns...' },
        { speaker: 'Mistral', text: 'Examining function permissions and authentication control patterns...' },
        { speaker: 'ZerePy', text: 'I've identified some potential issues. Let me discuss with the other models to verify findings.' },
        { speaker: 'OpenAI', text: 'I'm evaluating potential attack vectors and consensus implications...' },
        { speaker: 'ZerePy', text: 'Finalizing my assessment. I'll reconcile my findings with other AI models to produce a comprehensive report.' }
      ];
    } else {
      return [
        { speaker: 'Contract', text: `I'm a ${contractType || 'smart contract'}. Please analyze me for security vulnerabilities.` },
        { speaker: 'OpenAI', text: `Analyzing ${contractName}. I'll check for common vulnerabilities like reentrancy and integer overflow.` },
        { speaker: 'Deepseek', text: 'I'm specializing in detecting subtle logic flaws and centralization risks...' },
        { speaker: 'Mistral', text: 'I'll focus on authentication patterns, permission systems, and economic attack vectors...' },
        { speaker: 'OpenAI', text: 'Checking for external calls to untrusted contracts and proper error handling...' },
        { speaker: 'Deepseek', text: 'Evaluating code for proper access controls and permission structures...' },
        { speaker: 'Mistral', text: 'Examining potential for sandwich attacks and front-running vulnerabilities...' },
        { speaker: 'OpenAI', text: 'I've found several potential issues. Let me classify them by risk level...' },
        { speaker: 'Deepseek', text: 'Comparing my findings with other AI models to eliminate false positives...' },
        { speaker: 'Mistral', text: 'Finalizing recommendations for security improvements and best practices...' }
      ];
    }
  };

  // For long analysis, add more detailed steps
  const getLongConversationSteps = () => {
    const baseSteps = getConversationSteps();
    
    const additionalSteps = [
      { speaker: 'OpenAI', text: 'Conducting in-depth review of external function calls and interactions...' },
      { speaker: 'Deepseek', text: 'Checking for dependency vulnerabilities and composability issues with other protocols...' },
      { speaker: 'ZerePy', text: 'Examining potential economic attack vectors through simulation...' },
      { speaker: 'Mistral', text: 'Validating state transitions and invariant properties of the contract...' },
      { speaker: 'OpenAI', text: 'Comparing contract patterns against known vulnerability databases...' },
      { speaker: 'Deepseek', text: 'Nearly complete with my static analysis. Moving to dynamic flow evaluation...' },
      { speaker: 'ZerePy', text: 'Synthesizing observations from multiple analysis runs...' },
      { speaker: 'OpenAI', text: 'We need to discuss our findings before finalizing the report. There are some points where our analyses differ.' },
      { speaker: 'Deepseek', text: 'I agree with most of OpenAI's findings, but I noticed an additional edge case in the access control function.' },
      { speaker: 'Mistral', text: 'Let me verify the severity of the issues discovered. Some might be false positives.' },
      { speaker: 'ZerePy', text: 'After our discussion, I believe we have a consensus on the major issues.' },
      { speaker: 'OpenAI', text: 'Finalizing security report with remediation recommendations...' }
    ];
    
    // Mix in the additional steps at regular intervals
    const extendedSteps = [...baseSteps];
    if (longAnalysis) {
      additionalSteps.forEach((step, i) => {
        const insertPosition = Math.min(1 + Math.floor(i * baseSteps.length / additionalSteps.length), baseSteps.length - 1);
        extendedSteps.splice(insertPosition + i, 0, step);
      });
    }
    
    return extendedSteps;
  };

  const conversationSteps = longAnalysis ? getLongConversationSteps() : getConversationSteps();

  // Progress through the conversation steps
  useEffect(() => {
    if (!isRunning) {
      setMessages([]);
      setCurrentStep(0);
      return;
    }

    if (currentStep < conversationSteps.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            ...conversationSteps[currentStep],
            typing: true,
            id: Date.now()
          }
        ]);
        setCurrentStep(prev => prev + 1);
      }, currentStep === 0 ? 500 : Math.random() * 2000 + 1000); // Random delay between messages
      
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, conversationSteps]);

  return (
    <div style={{ 
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      maxHeight: '400px',
      overflow: 'auto',
      marginTop: '24px',
      backgroundColor: 'white',
      marginBottom: '24px'
    }} ref={conversationRef}>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '16px',
        textAlign: 'center' 
      }}>
        AI Analysis in Progress
      </h3>
      
      {messages.map((message) => (
        <ConversationMessage
          key={message.id}
          speaker={message.speaker}
          text={message.text}
          typing={message.typing}
          messages={messages}
        />
      ))}
      
      {messages.length === 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '32px', 
          color: '#6b7280', 
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          Initializing AI analysis conversation...
        </div>
      )}
    </div>
  );
};

export default AnalysisConversation;
