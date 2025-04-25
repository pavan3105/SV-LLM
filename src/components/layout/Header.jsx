import React from 'react';
import { 
  Bars3Icon, 
  SunIcon,
  MoonIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`shrink-0 ${
      darkMode 
        ? 'bg-gradient-to-r from-dark-300 via-dark-200 to-dark-300 border-b border-gray-700' 
        : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200'
    }`}>
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left section: Menu button and Logo */}
        <div className="flex items-center">
          {/* Hamburger menu button */}
          <button
            type="button"
            className={`p-2 mr-3 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Bars3Icon className="h-6 w-6" />
            <span className="sr-only">{sidebarOpen ? "Close sidebar" : "Open sidebar"}</span>
          </button>
          
          {/* App logo and name */}
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 rounded-lg mr-2 shadow-sm">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-700 dark:from-cyan-400 dark:to-cyan-500">
              SV-LLM
            </h1>
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 hidden sm:block">
              HW Security Verification Assistant
            </span>
          </div>
        </div>
        
        {/* Right section: Dark mode toggle only */}
        <div className="flex items-center space-x-2">
          {/* Dark mode toggle */}
          <button
            type="button"
            className={`p-2 rounded-full ${
              darkMode 
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">
              {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;