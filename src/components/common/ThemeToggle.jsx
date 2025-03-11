import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

/**
 * Toggle switch for dark/light theme
 */
const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-full p-2 transition-colors ${
        darkMode 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
      } ${className}`}
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;