// src/components/ExternalAuditModal.js
'use client';
import { useState, useEffect } from 'react';

/**
 * Modal component that offers external audit service for complex contracts
 * This appears when a timeout occurs during normal analysis
 */
export default function ExternalAuditModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  address, 
  network 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Simulate progress updates during analysis
  useEffect(() => {
    let interval;
    
    if (isLoading && progress < 95) {
      interval = setInterval(() => {
        // Gradually increase progress but slow down as it approaches 95%
        const increment = Math.max(1, 10 * (1 - progress / 100));
        setProgress(prev => Math.min(95, prev + increment));
      }, 2000);
    } else if (progress >= 100) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isLoading, progress]);
  
  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(5); // Start at 5%
    
    try {
      // Call the extended analysis API
      const response = await fetch('/api/external-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          network
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Extended analysis failed');
      }
      
      const result = await response.json();
      setProgress(100);
      
      // Pass results back to parent component
      onConfirm(result);
    } catch (err) {
      console.error('Extended analysis error:', err);
      setError(err.message || 'Extended analysis failed');
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">Deep Analysis Required</h3>
          
          <p className="text-gray-700 mb-4">
            This contract is large or complex and requires extended analysis time beyond what our fast API can provide.
          </p>
          
          {!isLoading && !showConfirmation && (
            <>
              <p className="text-gray-700 mb-4">
                Would you like to run a comprehensive analysis? This analysis:
              </p>
              
              <ul className="list-disc ml-6 mb-4 text-gray-700">
                <li>Takes 3-5 minutes to complete</li>
                <li>Uses advanced AI models with longer context</li>
                <li>Offers deeper security evaluation</li>
                <li>Is not limited by API timeouts</li>
              </ul>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Contract:</span> {address.slice(0, 6)}...{address.slice(-4)} on {network}
                </p>
              </div>
            </>
          )}
          
          {isLoading && (
            <div className="mb-4">
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {progress < 100 ? 'Analyzing...' : 'Analysis Complete!'}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">
                  {progress < 30 && "Fetching contract source code..."}
                  {progress >= 30 && progress < 60 && "Running deep code analysis..."}
                  {progress >= 60 && progress < 90 && "Validating findings and generating recommendations..."}
                  {progress >= 90 && "Finalizing analysis report..."}
                </p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-sm text-red-700">
                Error: {error}
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            
            {!isLoading && (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
              >
                Start Extended Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}