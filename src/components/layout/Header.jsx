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
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, toggleInfoPanel, sidebarOpen, infoPanelOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { createNewChat } = useChat();
  const navigate = useNavigate();

  // Handle new chat creation
  const handleNewChat = () => {
    createNewChat();
    navigate('/'); // Navigate to the chat page
  };

  return (
    <header className={`shrink-0 border-b ${
      darkMode ? 'bg-dark-200 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left section: Menu button */}
        <div className="flex items-center">
          {/* Only show hamburger when sidebar is closed and not on the icon area */}
          {sidebarOpen ? (
            <button
              type="button"
              className={`p-2 rounded-md ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </button>
          ) : (
            <button
              type="button"
              className={`p-2 rounded-md ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </button>
          )}
          
          {/* Push header contents to the right when sidebar is closed to make room for icon */}
          {!sidebarOpen && <div className="w-28"></div>}
        </div>
        
        {/* Center section: Title (mobile only) */}
        <div className="md:hidden flex items-center">
          <h1 className="text-lg font-semibold">SV-LLM</h1>
        </div>
        
        {/* Right section: Actions */}
        <div className="flex items-center space-x-2">
          {/* New chat button */}
          <button
            type="button"
            className={`p-2 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={handleNewChat}
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