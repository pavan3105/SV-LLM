import React, { createContext, useState, useContext, useEffect } from 'react';


const ConfigContext = createContext();


export const useConfig = () => useContext(ConfigContext);


export const ConfigProvider = ({ children }) => {
 
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('selectedModel') || 'gpt-4o-2024-11-20';
  });

  
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('apiKey') || '';
  });

  
  const [contextWindow, setContextWindow] = useState(() => {
    return parseInt(localStorage.getItem('contextWindow') || '4096', 10);
  });

 
  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('contextWindow', contextWindow.toString());
  }, [contextWindow]);

  
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