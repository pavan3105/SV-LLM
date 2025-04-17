import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Error fallback component for the ErrorBoundary
 * Displays when an uncaught error occurs in the app
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Use a default dark mode state if theme context is not available
  const { darkMode = true } = useTheme() || {};
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-dark-300 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className={`max-w-md w-full rounded-lg shadow-lg p-6 ${
        darkMode ? 'bg-dark-200 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-danger-900 text-danger-200' : 'bg-danger-100 text-danger-700'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          
          <div className={`w-full p-3 mb-4 rounded text-left overflow-auto ${
            darkMode ? 'bg-dark-100 text-danger-300' : 'bg-danger-50 text-danger-800'
          }`}>
            <p className="font-mono text-sm">
              {error.message || 'An unknown error occurred'}
            </p>
          </div>
          
          <div className="space-y-3 w-full">
            <button
              onClick={resetErrorBoundary}
              className="w-full py-2 px-4 rounded bg-primary-600 text-white hover:bg-primary-700"
            >
              Try again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className={`w-full py-2 px-4 rounded ${
                darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Go to homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;