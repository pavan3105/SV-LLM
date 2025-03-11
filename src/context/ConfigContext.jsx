import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the config context
const ConfigContext = createContext();

// Hook for using the config context
export const useConfig = () => useContext(ConfigContext);

// ConfigProvider component
export const ConfigProvider = ({ children }) => {
  // Model selection
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('selectedModel') || 'gpt-4';
  });

  // API Key
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('apiKey') || '';
  });

  // Context window size
  const [contextWindow, setContextWindow] = useState(() => {
    return parseInt(localStorage.getItem('contextWindow') || '4096', 10);
  });

  // Update localStorage when values change
  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('contextWindow', contextWindow.toString());
  }, [contextWindow]);

  // Context value
  const value = {
    selectedModel,
    setSelectedModel,
    apiKey,
    setApiKey,
    contextWindow,
    setContextWindow
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};