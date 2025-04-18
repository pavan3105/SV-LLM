import React, { useRef, useEffect, useState, useCallback } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import MissingInputsForm from './MissingInputsForm';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks/useChat';
import { 
  ChatBubbleLeftRightIcon, 
  BugAntIcon, 
  ClipboardDocumentCheckIcon, 
  ExclamationTriangleIcon, 
  BeakerIcon, 
  DocumentMagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

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

  // Security agent boxes
  const securityAgentBoxes = [
    {
      title: "Security Question Answering",
      description: "Get answers to security-related questions and concepts",
      icon: ChatBubbleLeftRightIcon,
      color: "primary",
      prompt: "What are the most common web application vulnerabilities and how can I protect against them?"
    },
    {
      title: "Vulnerability Detection",
      description: "Scan code and systems for potential security issues",
      icon: BugAntIcon,
      color: "primary",
      prompt: "Can you analyze this authentication function for potential vulnerabilities?\n\nfunction login(username, password) {\n  const user = users.find(u => u.username === username);\n  if(user && user.password === password) {\n    return generateToken(user);\n  }\n  return null;\n}"
    },
    {
      title: "Security Asset Identification",
      description: "Identify critical assets that need protection",
      icon: DocumentMagnifyingGlassIcon,
      color: "primary",
      prompt: "Help me identify the critical security assets in a typical e-commerce application that handles payment information."
    },
    {
      title: "Threat Modeling & Test Plan",
      description: "Create threat models and security test plans",
      icon: ExclamationTriangleIcon,
      color: "primary",
      prompt: "Can you help me create a threat model for a mobile banking application? Include potential threats and a test plan to validate security controls."
    },
    {
      title: "Security Property Generation",
      description: "Generate security properties and requirements",
      icon: ClipboardDocumentCheckIcon,
      color: "primary",
      prompt: "Generate security properties and requirements for a healthcare application that handles patient data and must be HIPAA compliant."
    },
    {
      title: "Bug Validation Through Testbench",
      description: "Validate security fixes with virtual testbenches",
      icon: BeakerIcon,
      color: "primary",
      prompt: "I fixed a SQL injection vulnerability in my code. Can you help me create a testbench to validate the fix is working properly?"
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
              One-Stop Solution for Security Verification
            </p>
            
            {/* Security agent boxes - 3x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full mb-6">
              {securityAgentBoxes.map((agent, index) => (
                <button
                  key={index}
                  className={`p-5 text-left rounded-lg transition-all flex flex-col h-full ${
                    darkMode 
                      ? 'bg-primary-900 bg-opacity-20 hover:bg-opacity-30 border border-primary-700 text-white' 
                      : 'bg-primary-50 hover:bg-primary-100 border border-primary-200 text-gray-800'
                  }`}
                  onClick={() => handleSubmit(agent.prompt)}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${
                    darkMode 
                      ? 'bg-primary-900 bg-opacity-50 text-primary-400' 
                      : 'bg-primary-100 text-primary-700'
                  }`}>
                    <agent.icon className="h-5 w-5" />
                  </div>
                  <h3 className={`font-medium mb-2 text-primary-600 dark:text-primary-400`}>{agent.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{agent.description}</p>
                  <div className={`text-xs mt-auto text-primary-600 dark:text-primary-400 font-medium`}>
                    Try now →
                  </div>
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