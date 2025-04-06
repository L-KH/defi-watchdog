import React, { useState, useEffect } from 'react';

/**
 * AIWorkflowVisual Component
 * Visualizes the AI analysis workflow process
 */
const AIWorkflowVisual = ({ isActive = false, currentStep = 0, speed = 'normal' }) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  
  // Define the workflow steps
  const workflowSteps = [
    {
      title: 'Source Code Extraction',
      description: 'Contract source code is retrieved from blockchain explorers and parsed for analysis.',
      icon: '📄',
      color: '#e0f2fe',
      textColor: '#0ea5e9'
    },
    {
      title: 'Initial AI Modeling',
      description: 'Multiple AI models independently analyze the source code for different types of vulnerabilities.',
      icon: '🧠',
      color: '#fef3c7',
      textColor: '#d97706'
    },
    {
      title: 'Vulnerability Detection',
      description: 'AI models identify potential security issues and categorize them by severity and type.',
      icon: '🔍',
      color: '#fee2e2',
      textColor: '#dc2626'
    },
    {
      title: 'Cross-Validation',
      description: 'Results from various AI models are compared to reduce false positives and establish consensus.',
      icon: '🔄',
      color: '#dcfce7',
      textColor: '#059669'
    },
    {
      title: 'Code Flow Analysis',
      description: 'Execution paths and state transitions are evaluated to identify complex security issues.',
      icon: '📊',
      color: '#ede9fe',
      textColor: '#8b5cf6'
    },
    {
      title: 'Remediation Generation',
      description: 'AI models propose concrete fixes for each identified vulnerability.',
      icon: '🛠️',
      color: '#dbeafe',
      textColor: '#3b82f6'
    },
    {
      title: 'Final Report Compilation',
      description: 'Analysis results are summarized and organized into a comprehensive security report.',
      icon: '📋',
      color: '#f3f4f6',
      textColor: '#4b5563'
    }
  ];

  // Animate through steps if active
  useEffect(() => {
    if (!isActive) {
      setActiveStep(currentStep);
      return;
    }
    
    // Set time delay based on speed
    const delay = speed === 'fast' ? 1500 : speed === 'slow' ? 3000 : 2000;
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % workflowSteps.length;
        // If we've reached the end, stop the animation
        if (next === 0) {
          clearInterval(interval);
          return workflowSteps.length - 1;
        }
        return next;
      });
    }, delay);
    
    return () => clearInterval(interval);
  }, [isActive, currentStep, speed, workflowSteps.length]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        AI Analysis Workflow
      </h3>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {workflowSteps.map((step, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              opacity: index <= activeStep ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: step.color,
              color: step.textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              fontSize: '1.25rem',
              flexShrink: 0,
              boxShadow: index === activeStep ? `0 0 0 4px ${step.color}40` : 'none',
              transition: 'box-shadow 0.3s ease'
            }}>
              {step.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1rem', 
                color: index <= activeStep ? step.textColor : '#9ca3af',
                transition: 'color 0.3s ease'
              }}>
                Step {index + 1}: {step.title}
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: index <= activeStep ? '#4b5563' : '#9ca3af',
                transition: 'color 0.3s ease'
              }}>
                {step.description}
              </div>
              
              {index < workflowSteps.length - 1 && (
                <div style={{ 
                  width: '1px', 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  margin: '0.5rem 0 0 1.25rem'
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '1.5rem',
        backgroundColor: '#f9fafb',
        padding: '1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
          <span style={{ fontWeight: '500' }}>Need to know more?</span>
        </div>
        <p style={{ margin: 0 }}>
          Each step of our analysis employs specialized AI techniques. The entire process typically takes 20-45 seconds depending on contract complexity.
        </p>
      </div>
    </div>
  );
};

export default AIWorkflowVisual;
