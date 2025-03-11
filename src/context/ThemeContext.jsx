import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Get the initial theme value from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    // Check if localStorage is available (for SSR compatibility)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPreference = localStorage.getItem('darkMode');
      
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      
      // If no stored preference, respect system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false;
  });

  // Toggle between light and dark modes
  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  // Update localStorage and document when darkMode changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('darkMode', darkMode);
    
    // Update document class for global styling
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Context value
  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};