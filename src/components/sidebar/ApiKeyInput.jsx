import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ApiKeyInput = ({ apiKey, onApiKeyChange, showApiKey }) => {
  const { darkMode } = useTheme();
  
  const handleChange = (e) => {
    onApiKeyChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type={showApiKey ? 'text' : 'password'}
        id="api-key"
        value={apiKey || ''}
        onChange={handleChange}
        placeholder="Enter your API key"
        className={`block w-full rounded-lg border pr-10 py-3 px-4 ${
          darkMode 
            ? 'bg-dark-100 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-primary-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500'
        }`}
      />
    </div>
  );
};

export default ApiKeyInput;