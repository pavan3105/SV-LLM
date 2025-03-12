import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cog6ToothIcon, 
  KeyIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  ServerIcon,
  UserIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import Tooltip from '../components/common/Tooltip';
import { useTheme } from '../context/ThemeContext';
import { useConfig } from '../context/ConfigContext';
import { useChat } from '../hooks/useChat';
import { clearAllChats } from '../services/storageService';

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { 
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    contextWindow,
    setContextWindow
  } = useConfig();
  const { createNewChat, chatHistory } = useChat();
  
  // Local state for showing API key
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Active section
  const [activeSection, setActiveSection] = useState('general');
  
  // Handle clear chat history
  const handleClearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      // Clear chat history from localStorage
      clearAllChats();
      
      // Force page reload to reset state completely
      window.location.reload();
    }
  };
  
  // Sections
  const sections = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'api', name: 'API Settings', icon: KeyIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'advanced', name: 'Advanced', icon: ServerIcon },
    { id: 'account', name: 'Account', icon: UserIcon },
  ];
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className={`space-y-1 rounded-lg overflow-hidden border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`flex items-center w-full px-4 py-3 text-left ${
                    activeSection === section.id
                      ? darkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="h-5 w-5 mr-3" />
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </aside>
          
          {/* Main content */}
          <div className="flex-1">
            <div className={`p-6 rounded-lg border ${
              darkMode ? 'border-gray-700 bg-dark-100' : 'border-gray-200 bg-white'
            }`}>
              {activeSection === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Chat history section */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Chat History</h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        You have {chatHistory.length} saved chats.
                      </p>
                      
                      <div className="flex space-x-3">
                        <Button
                          variant="danger"
                          onClick={handleClearChatHistory}
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Clear All History
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            createNewChat();
                            navigate('/');
                          }}
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-2" />
                          New Chat
                        </Button>
                      </div>
                    </div>
                    
                    <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />
                    
                    {/* Model selection */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Model Selection</h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose which AI model to use for security analysis.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {models.map((model) => (
                            <Tooltip
                              key={model.id}
                              content={model.description}
                              position="top"
                            >
                              <div
                                className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                                  selectedModel === model.id
                                    ? darkMode
                                      ? 'border-primary-500 bg-primary-900 bg-opacity-20'
                                      : 'border-primary-500 bg-primary-50'
                                    : darkMode
                                      ? 'border-gray-700 hover:border-gray-600'
                                      : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedModel(model.id)}
                              >
                                <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                                  selectedModel === model.id
                                    ? 'bg-primary-500'
                                    : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                }`} />
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {model.provider}
                                  </div>
                                </div>
                              </div>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'api' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">API Settings</h2>
                  
                  <div className="space-y-6">
                    {/* API key */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">API Key</h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enter your API key for the selected model provider.
                      </p>
                      
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey || ''}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your API key"
                          className={`w-full p-3 rounded-lg border ${
                            darkMode
                              ? 'bg-dark-200 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {showApiKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Your API key is stored locally in your browser and never sent to our servers.
                      </p>
                    </div>
                    
                    <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />
                    
                    {/* Context window */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Context Window</h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Control how much conversation history is sent to the model.
                      </p>
                      
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="1024"
                          max="32768"
                          step="1024"
                          value={contextWindow}
                          onChange={(e) => setContextWindow(parseInt(e.target.value, 10))}
                          className="w-full"
                        />
                        
                        <div className="flex justify-between text-sm">
                          <span>1K</span>
                          <span>{Math.round(contextWindow / 1024)}K tokens</span>
                          <span>32K</span>
                        </div>
                        
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Larger context windows can provide more comprehensive analysis but may be slower and cost more.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Security settings will be implemented in a future update.
                  </p>
                </div>
              )}
              
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Notification settings will be implemented in a future update.
                  </p>
                </div>
              )}
              
              {activeSection === 'advanced' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Advanced settings will be implemented in a future update.
                  </p>
                </div>
              )}
              
              {activeSection === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Account settings will be implemented in a future update.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Available models
const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable GPT model for complex security tasks' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and cost-effective for most security tasks' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most powerful Claude model for complex security tasks' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance and efficiency' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Google\'s advanced reasoning model' },
  { id: 'grok-1', name: 'Grok-1', provider: 'xAI', description: 'Real-time knowledge and code analysis' },
  { id: 'cohere-command', name: 'Cohere Command', provider: 'CohereAI', description: 'Flagship model for comprehensive security analysis' },
  { id: 'cohere-command-light', name: 'Cohere Command Light', provider: 'CohereAI', description: 'Faster, more efficient security assessment' },
  { id: 'cohere-command-r', name: 'Cohere Command-R', provider: 'CohereAI', description: 'Enhanced for security research and retrieval' },
  { id: 'cohere-command-r-plus', name: 'Cohere Command-R+', provider: 'CohereAI', description: 'Advanced reasoning for complex security tasks' }
];

export default Settings;