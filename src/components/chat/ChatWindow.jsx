import React, { useRef, useEffect, useState, useCallback } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import MissingInputsForm from './MissingInputsForm';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks/useChat';

const ChatWindow = ({
  messages,
  onSendMessage,
  onProvideFeedback,
  selectedModel,
  activeChatId
}) => {
  const { darkMode } = useTheme();
  const { isLoading, missingInputs, handleMissingInputsSubmit } = useChat();
  
  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const [scrollPositions, setScrollPositions] = useState({});
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  const previousChatIdRef = useRef(activeChatId);
  const previousMessagesLengthRef = useRef(messages.length);
  
  const isChatLoading = isLoading(activeChatId);

  const saveScrollPosition = useCallback(() => {
    if (messageContainerRef.current && activeChatId) {
      setScrollPositions(prev => ({
        ...prev,
        [activeChatId]: messageContainerRef.current.scrollTop
      }));
    }
  }, [activeChatId]);

  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    
    if (!isAtBottom && shouldAutoScroll) {
      setShouldAutoScroll(false);
    } else if (isAtBottom && !shouldAutoScroll) {
      setShouldAutoScroll(true);
    }
    
    saveScrollPosition();
  }, [shouldAutoScroll, saveScrollPosition]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (!messageContainerRef.current || !activeChatId) return;
    
    const savedPosition = scrollPositions[activeChatId];
    if (savedPosition !== undefined) {
      messageContainerRef.current.scrollTop = savedPosition;
    } else {
      scrollToBottom();
    }
  }, [activeChatId, scrollPositions, scrollToBottom]);

  useEffect(() => {
    const chatChanged = previousChatIdRef.current !== activeChatId;
    previousChatIdRef.current = activeChatId;

    if (chatChanged) {
      setTimeout(restoreScrollPosition, 50);
      
      setShouldAutoScroll(true);
    }
  }, [activeChatId, restoreScrollPosition]);

  useEffect(() => {
    const messagesChanged = previousMessagesLengthRef.current !== messages.length;
    previousMessagesLengthRef.current = messages.length;

    if (messagesChanged) {
      if (shouldAutoScroll) {
        setTimeout(scrollToBottom, 50);
      } else {
        saveScrollPosition();
      }
    }
  }, [messages, shouldAutoScroll, scrollToBottom, saveScrollPosition]);

  // Handle user sending a message
  const handleSubmit = (text) => {
    if (text.trim() === '') return;
    
    saveScrollPosition();
    setShouldAutoScroll(true);
    onSendMessage(text);
  };

  const emptyState = messages.length === 0 && !isChatLoading;

  const suggestedPrompts = [
    {
      title: "Security Analysis",
      description: "Get insights on the security of your system",
      text: "Can you analyze the security implications of a microservice architecture with a shared API gateway and service-to-service communication?"
    },
    {
      title: "Code Security Review",
      description: "Review code for security issues",
      text: "Review this authentication function for security vulnerabilities:\n\nfunction authenticate(username, password) {\n  const user = db.findUser(username);\n  if (user && user.password === password) {\n    return generateToken(user);\n  }\n  return null;\n}"
    },
    {
      title: "Security Best Practices",
      description: "Learn about security best practices",
      text: "What are the best practices for securely storing user credentials in a web application?"
    },
    {
      title: "Vulnerability Detection",
      description: "Detect vulnerabilities in your hardware design",
      text: "Can you detect vulnerabilities in this hardware design?"
    }
  ];

  return (
    <div className={`h-full flex flex-col rounded-lg overflow-hidden ${darkMode ? 'bg-dark-200' : 'bg-white'} shadow-lg`}>
      {/* Message area */}
      <div 
        className="flex-1 overflow-y-auto"
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        {emptyState ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Welcome to SV-LLM</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              Your security-focused AI assistant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className={`p-4 text-left rounded-lg transition-all ${
                    darkMode 
                      ? 'bg-dark-100 hover:bg-dark-400 border border-gray-700' 
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}
                  onClick={() => handleSubmit(prompt.text)}
                >
                  <h3 className="font-medium mb-1">{prompt.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            onProvideFeedback={onProvideFeedback} 
          />
        )}
        
        {/* Loading indicator */}
        {isChatLoading && (
          <div className="px-4 py-2">
            <LoadingIndicator model={selectedModel} />
          </div>
        )}
        
        {/* Missing inputs form - only shown when missingInputs state is not null */}
        {missingInputs && (
          <div className="px-4 py-2">
            <MissingInputsForm 
              missingInputs={missingInputs}
              onSubmit={handleMissingInputsSubmit}
            />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <ChatInput 
          onSubmit={handleSubmit} 
          isLoading={isChatLoading}
        />
      </div>
      
      {/* Scroll to bottom button - only shown when not at the bottom */}
      {!emptyState && !shouldAutoScroll && (
        <div className="absolute bottom-20 right-6">
          <button
            onClick={() => {
              scrollToBottom();
              setShouldAutoScroll(true);
            }}
            className={`p-2 rounded-full shadow-lg ${
              darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;