import React, { useState, useEffect } from 'react';

const APIKeyManager = ({ onKeyUpdate = () => {} }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if API key exists
    const checkApiKey = () => {
      const savedKey = localStorage.getItem('openrouter_api_key');
      const envKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      
      if (savedKey || envKey) {
        setIsKeySet(true);
        if (savedKey) {
          setApiKey(savedKey);
        }
      }
    };
    
    checkApiKey();
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey || apiKey.trim().length === 0) {
      setMessage('Please enter a valid API key');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      // Validate API key format (basic check)
      if (!apiKey.startsWith('sk-or-') && !apiKey.includes('-')) {
        setMessage('Invalid API key format. OpenRouter keys usually start with "sk-or-"');
        setIsSaving(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem('openrouter_api_key', apiKey.trim());
      setIsKeySet(true);
      setMessage('API key saved successfully! You can now run AI analysis.');
      
      // Notify parent component
      onKeyUpdate(apiKey.trim());
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving API key: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveKey = () => {
    if (window.confirm('Are you sure you want to remove your API key?')) {
      localStorage.removeItem('openrouter_api_key');
      setApiKey('');
      setIsKeySet(false);
      setMessage('API key removed');
      onKeyUpdate(null);
    }
  };

  const maskApiKey = (key) => {
    if (!key) return '';
    const start = key.substring(0, 8);
    const end = key.substring(key.length - 4);
    const masked = '*'.repeat(Math.max(0, key.length - 12));
    return `${start}${masked}${end}`;
  };

  return (
    <div className="api-key-manager bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          OpenRouter API Configuration
        </h3>
        {isKeySet && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Configured
          </span>
        )}
      </div>

      {!isKeySet ? (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  API Key Required
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>To use the AI-powered security analysis features, you need an OpenRouter API key.</p>
                  <p className="mt-2">
                    Get your API key from{' '}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      openrouter.ai/keys
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenRouter API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showKey ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveKey}
            disabled={isSaving || !apiKey}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save API Key'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your OpenRouter API key is configured and ready to use.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current API Key
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <code className="text-sm text-gray-600 dark:text-gray-300">
                {maskApiKey(apiKey)}
              </code>
              <button
                onClick={handleRemoveKey}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Usage Tips:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Your API key is stored locally in your browser</li>
              <li>• The key is never sent to our servers</li>
              <li>• AI analysis runs directly from your browser</li>
              <li>• Monitor your usage at <a href="https://openrouter.ai/usage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">openrouter.ai/usage</a></li>
            </ul>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          message.includes('success') 
            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
            : message.includes('Error') || message.includes('Invalid')
            ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default APIKeyManager;
