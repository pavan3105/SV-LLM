import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  XCircleIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import ConfigPanel from '../sidebar/ConfigPanel';
import ChatHistory from '../sidebar/ChatHistory';
import { useChat } from '../../hooks/useChat';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('chats');
  const { createNewChat } = useChat();
  
  // Handle new chat creation
  const handleNewChat = () => {
    createNewChat();
    navigate('/'); // Navigate to home page
  };
  
  // Navigation items
  const navItems = [
    { name: 'Chat', href: '/', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/help', icon: QuestionMarkCircleIcon },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed z-50 md:relative inset-y-0 left-0 flex flex-col flex-shrink-0 w-72 max-w-full transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-dark-200 text-white' : 'bg-white text-gray-900'} border-r ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } md:shadow-none md:z-auto shadow-xl`}
      >
        {/* Sidebar header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b shrink-0 md:justify-center relative
          ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
            <h1 className="ml-2 text-xl font-bold">SV-LLM</h1>
          </div>
          
          {/* Close button (mobile only) */}
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XCircleIcon className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </button>
          
          {/* Collapse button (desktop only) */}
          <button 
            onClick={toggleSidebar}
            className="hidden md:block absolute right-2 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="sr-only">Collapse sidebar</span>
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'chats'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'config'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('config')}
            >
              Configuration
            </button>
          </div>
          
          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chats' ? (
              <div className="p-4">
                {/* New chat button - Add onClick handler to call createNewChat */}
                <button
                  className={`flex items-center w-full p-3 rounded-lg mb-4 ${
                    darkMode
                      ? 'bg-primary-900 hover:bg-primary-800 text-white'
                      : 'bg-primary-50 hover:bg-primary-100 text-primary-700'
                  } transition-colors`}
                  onClick={handleNewChat}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  <span>New Chat</span>
                </button>
                
                {/* Chat history */}
                <ChatHistory />
              </div>
            ) : (
              <div className="p-4">
                {/* Configuration panel */}
                <ConfigPanel />
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom navigation */}
        <div className={`flex justify-around border-t p-1 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;