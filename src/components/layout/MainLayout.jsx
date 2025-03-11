import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import InfoPanel from './InfoPanel';

/**
 * MainLayout component - Provides the main application layout structure
 * Includes responsive sidebar, header, and content area
 */
const MainLayout = ({ children }) => {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle info panel visibility
  const toggleInfoPanel = () => {
    setInfoPanelOpen(!infoPanelOpen);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark bg-dark-300 text-white' : 'bg-light-300 text-gray-800'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

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