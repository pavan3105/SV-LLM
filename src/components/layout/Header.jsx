import React from 'react';
import { 
  Bars3Icon, 
  InformationCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks/useChat';

const Header = ({ toggleSidebar, toggleInfoPanel, sidebarOpen, infoPanelOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { createNewChat } = useChat(); // Changed from resetChat to createNewChat

  return (
    <header className={`shrink-0 border-b ${
      darkMode ? 'bg-dark-200 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left section: Menu button */}
        <div className="flex items-center">
          <button
            type="button"
            className={`p-2 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={toggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" />
            <span className="sr-only">
              {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            </span>
          </button>
        </div>
        
        {/* Center section: Title (mobile only) */}
        <div className="md:hidden flex items-center">
          <h1 className="text-lg font-semibold">SV-LLM</h1>
        </div>
        
        {/* Right section: Actions */}
        <div className="flex items-center space-x-2">
          {/* New chat button - Use createNewChat instead of resetChat */}
          <button
            type="button"
            className={`p-2 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={createNewChat}
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span className="sr-only">New chat</span>
          </button>
          
          {/* Dark mode toggle */}
          <button
            type="button"
            className={`p-2 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
          
          {/* Info panel toggle */}
          <button
            type="button"
            className={`p-2 rounded-md ${
              infoPanelOpen
                ? 'text-primary-600 dark:text-primary-400'
                : darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={toggleInfoPanel}
          >
            <InformationCircleIcon className="h-5 w-5" />
            <span className="sr-only">
              {infoPanelOpen ? 'Close info panel' : 'Open info panel'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;