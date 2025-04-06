'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import AuditMethodSelector from './AuditMethodSelector';
import ExternalAuditModal from './ExternalAuditModal';
import { analyzeContract } from '../lib/AuditAPI';

/**
 * Enhanced audit form component with improved error handling and multiple analysis methods
 */
export default function ModifiedAudit({ onResultReceived }) {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('linea');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisMethod, setAnalysisMethod] = useState('server');
  const [showExternalAuditModal, setShowExternalAuditModal] = useState(false);
  
  // Detect if address is provided in URL query
  useEffect(() => {
    if (router.query.address) {
      setAddress(router.query.address);
      if (router.query.network) {
        setNetwork(router.query.network);
      }
    }
  }, [router.query]);
  
  // Handle form submission
  async function handleSubmit(e) {
    if (e) e.preventDefault();
    
    if (!address.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the unified API to analyze the contract
      const result = await analyzeContract(address, network, {
        method: analysisMethod
      });
      
      // Update URL with the address
      router.push({
        pathname: router.pathname,
        query: { address, network }
      }, undefined, { shallow: true });
      
      // Send result to parent component
      onResultReceived(result);
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Handle timeout errors specifically
      if (error.message && (error.message.includes('timeout') || error.message.includes('504'))) {
        setShowExternalAuditModal(true);
        setError('Analysis timed out. You can try our extended analysis service.');
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        {/* Contract Address Input */}
        <div className="mb-4">
          <label htmlFor="contract-address" className="block mb-2 text-sm font-medium text-gray-700">
            Contract Address
          </label>
          <input 
            type="text" 
            id="contract-address"
            placeholder="0x..." 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Network Selector */}
        <div className="mb-4">
          <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-700">
            Network
          </label>
          <div className="relative">
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="linea">Linea Network</option>
              <option value="sonic">Sonic Network</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Analysis Method Selector */}
        <div className="mb-4">
          <AuditMethodSelector 
            value={analysisMethod}
            onChange={setAnalysisMethod}
            disabled={isLoading}
          />
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-50 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isLoading || !address.trim()}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing...
            </>
          ) : 'Analyze Contract'}
        </button>
      </form>
      
      {/* External Audit Modal */}
      <ExternalAuditModal
        isOpen={showExternalAuditModal}
        onClose={() => {
          setShowExternalAuditModal(false);
          setError('Choose another analysis method or try again.');
        }}
        onConfirm={(result) => {
          setShowExternalAuditModal(false);
          onResultReceived(result);
        }}
        address={address}
        network={network}
      />
    </div>
  );
}