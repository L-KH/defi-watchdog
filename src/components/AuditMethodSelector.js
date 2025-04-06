'use client';
import { useState, useEffect } from 'react';
import { isExtendedAnalysisAvailable } from '../lib/AuditAPI';

/**
 * Component for selecting the audit method with enhanced explanation
 */
export default function AuditMethodSelector({ 
  value, 
  onChange, 
  disabled = false 
}) {
  const [extendedAvailable, setExtendedAvailable] = useState(false);
  
  // Check if extended analysis is available
  useEffect(() => {
    async function checkExtendedAvailability() {
      const available = await isExtendedAnalysisAvailable();
      setExtendedAvailable(available);
    }
    
    checkExtendedAvailability();
  }, []);
  
  const getMethodDescription = (method) => {
    switch (method) {
      case 'extended':
        return 'Deep Analysis ​·​ Most accurate ​·​ No timeout ​·​ Slower (3-5 min)';
      case 'server':
        return 'Standard Server Analysis ​·​ Comprehensive ​·​ May timeout ​·​ Medium speed';
      case 'browser':
        return 'Client-Side Analysis ​·​ Never times out ​·​ Faster ​·​ Limited features';
      case 'basic':
        return 'Basic Metadata ​·​ Fastest ​·​ Contract info only ​·​ No security analysis';
      default:
        return '';
    }
  };
  
  const methodIcons = {
    extended: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    server: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
        <line x1="6" y1="6" x2="6" y2="6"/>
        <line x1="6" y1="18" x2="6" y2="18"/>
      </svg>
    ),
    browser: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    basic: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  };

  return (
    <div>
      <label htmlFor="analysis-method" className="block mb-2 text-sm font-medium text-gray-700">
        Analysis Method
      </label>
      <div className="relative">
        <select
          id="analysis-method"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-70 disabled:bg-gray-100"
        >
          {extendedAvailable && (
            <option value="extended">Deep Analysis (Most Accurate)</option>
          )}
          <option value="server">Standard Server Analysis</option>
          <option value="browser">Client-Side Analysis (Faster)</option>
          <option value="basic">Basic Metadata Only (Fastest)</option>
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
      
      {/* Method description */}
      <div className="mt-2 flex items-start">
        <div className="text-blue-600 mt-0.5 mr-2">
          {methodIcons[value]}
        </div>
        <p className="text-xs text-gray-500">
          {getMethodDescription(value)}
        </p>
      </div>
    </div>
  );
}