import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ChatWindow from '../components/chat/ChatWindow';
import { useChat } from '../hooks/useChat';
import { useConfig } from '../context/ConfigContext';

const Home = () => {
  const { selectedModel, contextWindow } = useConfig();
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error,
    provideFeedback
  } = useChat();

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Display an error message if there is one */}
        {error && (
          <div className="bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-100 p-4 mb-4 rounded-lg">
            <p className="font-medium">Error: {error.message || 'An unknown error occurred'}</p>
            <p className="text-sm mt-1">Please check your API key and connection, then try again.</p>
          </div>
        )}

        {/* Main chat interface */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onProvideFeedback={provideFeedback}
            selectedModel={selectedModel}
            contextWindow={contextWindow}
          />
        </div>

        {/* Model info (optional) */}
        {selectedModel && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Using {selectedModel} • Context Window: {contextWindow} tokens
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;