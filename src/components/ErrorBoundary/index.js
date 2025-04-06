'use client';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }
  
  handleRetry = () => {
    // Clear the error state and attempt to re-render
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // If a specific retry action is provided via props, call it
    if (typeof this.props.onRetry === 'function') {
      this.props.onRetry();
    } else {
      // Default behavior: reload the page
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '800px',
          margin: '3rem auto',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Something went wrong
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              The application encountered an unexpected error.
            </p>
            
            {/* Show technical details in development */}
            {process.env.NODE_ENV === 'development' && (
              <details style={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                padding: '1rem',
                borderRadius: '0.25rem',
                marginTop: '1rem',
                textAlign: 'left'
              }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                  Technical details
                </summary>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {this.state.error?.toString() || 'Unknown error'}
                  {this.state.errorInfo?.componentStack || ''}
                </pre>
              </details>
            )}
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#0284c7',
                color: 'white',
                fontWeight: '500',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 150ms',
                marginRight: '0.5rem'
              }}
            >
              Retry
            </button>
            
            <a
              href="/"
              style={{
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                fontWeight: '500',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                display: 'inline-block',
                marginLeft: '0.5rem'
              }}
            >
              Go to Home Page
            </a>
          </div>
        </div>
      );
    }

    // If no error, just render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
