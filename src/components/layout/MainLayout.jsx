import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import InfoPanel from './InfoPanel';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * MainLayout component - Provides the main application layout structure
 * Includes responsive sidebar, header, and content area with a more distinctive design
 */
const MainLayout = ({ children }) => {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  // Check screen size to set default sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  // Toggle info panel visibility
  const toggleInfoPanel = () => {
    setInfoPanelOpen(!infoPanelOpen);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${
      darkMode 
        ? 'dark bg-gradient-to-br from-dark-300 via-dark-400 to-dark-300 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-800'
    }`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Collapsed Sidebar Icon (visible only when sidebar is closed) */}
      {!sidebarOpen && (
        <div 
          className={`fixed top-0 left-0 z-40 flex items-center h-16 px-4 border-b border-r ${
            darkMode 
              ? 'bg-gradient-to-r from-dark-300 via-dark-200 to-dark-300 border-gray-700' 
              : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-gray-200'
          } cursor-pointer`}
          onClick={toggleSidebar}
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 rounded-lg shadow-sm">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-700 dark:from-cyan-400 dark:to-cyan-500">
              SV-LLM
            </h1>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          toggleSidebar={toggleSidebar} 
          toggleInfoPanel={toggleInfoPanel}
          sidebarOpen={sidebarOpen}
          infoPanelOpen={infoPanelOpen}
        />

        {/* Content area with info panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out ${
            infoPanelOpen ? 'lg:mr-72' : ''
          } ${
            darkMode ? 'bg-opacity-10' : 'bg-opacity-5'
          }`}>
            <div className="container mx-auto h-full">
              {children}
            </div>
          </main>

          {/* Info Panel (right sidebar) */}
          <InfoPanel isOpen={infoPanelOpen} toggleInfoPanel={toggleInfoPanel} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;