import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const LoadingIndicator = ({ model }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ${
      darkMode ? 'bg-dark-100 text-gray-300' : 'bg-gray-100 text-gray-700'
    }`}>
      {/* Animated dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '600ms' }}></div>
      </div>
      
      {/* Text */}
      <span className="text-sm font-medium">
        {'SV-LLM is thinking'}
      </span>
    </div>
  );
};

export default LoadingIndicator;