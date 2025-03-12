import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import InfoPanel from './InfoPanel';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * MainLayout component - Provides the main application layout structure
 * Includes responsive sidebar, header, and content area
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
    console.log("Toggling sidebar, current state:", sidebarOpen);
    setSidebarOpen(prevState => !prevState);
  };

  // Toggle info panel visibility
  const toggleInfoPanel = () => {
    setInfoPanelOpen(!infoPanelOpen);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark bg-dark-300 text-white' : 'bg-light-300 text-gray-800'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Collapsed Sidebar Icon (visible only when sidebar is closed) */}
      {!sidebarOpen && (
        <div 
          className={`fixed top-0 left-0 z-40 flex items-center h-16 px-4 border-b border-r ${
            darkMode ? 'bg-dark-200 border-gray-700' : 'bg-white border-gray-200'
          } cursor-pointer`}
          onClick={toggleSidebar}
        >
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
            <h1 className="ml-2 text-xl font-bold">SV-LLM</h1>
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
          <main className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out ${
            infoPanelOpen ? 'lg:mr-72' : ''
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