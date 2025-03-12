import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useConfig } from './ConfigContext';
import { sendMessageToLLM } from '../services/llmService';
import { storeChatHistory, loadChatHistory } from '../services/storageService';

// Create the chat context
export const ChatContext = createContext();

// Hook for using the chat context
export const useChat = () => useContext(ChatContext);

// ChatProvider component
export const ChatProvider = ({ children }) => {
  const { selectedModel, apiKey, contextWindow } = useConfig();
  
  // Chat messages for current conversation
  const [messages, setMessages] = useState([]);
  
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Chat history (list of past conversations)
  const [chatHistory, setChatHistory] = useState([]);
  
  // Active chat id
  const [activeChat, setActiveChat] = useState(null);

  // Load chat history on initial mount
  useEffect(() => {
    refreshChatHistory();
  }, []);

  // Refresh chat history from storage - enhanced to properly reset state
  const refreshChatHistory = () => {
    const history = loadChatHistory();
    setChatHistory(history);
    
    // If there's at least one chat, set it as active
    if (history.length > 0) {
      setActiveChat(history[0]);
      setMessages(history[0].messages || []);
    } else {
      // If no chats exist, reset active chat and messages
      setActiveChat(null);
      setMessages([]);
      // Create a new chat
      createNewChat();
    }
  };

  // Create a new chat
  const createNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messages: []
    };
    
    // Update chat history with the new chat at the beginning
    const updatedHistory = [newChat, ...chatHistory];
    setChatHistory(updatedHistory);
    setActiveChat(newChat);
    setMessages([]);
    
    // Store the updated history in localStorage
    storeChatHistory(updatedHistory);
    
    return newChat;
  };

  // Reset the current chat
  const resetChat = () => {
    createNewChat();
  };

  // Select a chat from history
  const selectChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
      setMessages(chat.messages || []);
    }
  };

  // Delete a chat from history
  const deleteChat = (chatId) => {
    const updatedHistory = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    // If deleted the active chat, switch to another one or create new
    if (activeChat && activeChat.id === chatId) {
      if (updatedHistory.length > 0) {
        selectChat(updatedHistory[0].id);
      } else {
        createNewChat();
      }
    }
  };

  // Send a message to the LLM
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Check if API key is provided
    if (!apiKey) {
      setError(new Error('API key is required. Please add your API key in the configuration panel.'));
      return;
    }
    
    // Create user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    // Update messages state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update chat history
    const updatedChat = {
      ...activeChat,
      messages: updatedMessages,
      lastUpdated: new Date().toISOString(),
      // Extract a title from the first user message if not already set
      title: activeChat.title === 'New Chat' && messages.length === 0 
        ? text.slice(0, 30) + (text.length > 30 ? '...' : '') 
        : activeChat.title
    };
    
    const updatedHistory = chatHistory.map(c => 
      c.id === activeChat.id ? updatedChat : c
    );
    
    setActiveChat(updatedChat);
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    // Start loading state
    setIsLoading(true);
    setError(null);
    
    try {
      // Send request to LLM
      const contextMessages = updatedMessages.slice(-Math.floor(contextWindow / 200)); // Rough approximation
      
      const response = await sendMessageToLLM({
        messages: contextMessages,
        model: selectedModel,
        apiKey
      });
      
      // Create assistant message
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };
      
      // Update messages with assistant response
      const messagesWithResponse = [...updatedMessages, assistantMessage];
      setMessages(messagesWithResponse);
      
      // Update chat history again
      const chatWithResponse = {
        ...updatedChat,
        messages: messagesWithResponse,
        lastUpdated: new Date().toISOString()
      };
      
      const finalHistory = updatedHistory.map(c => 
        c.id === activeChat.id ? chatWithResponse : c
      );
      
      setActiveChat(chatWithResponse);
      setChatHistory(finalHistory);
      storeChatHistory(finalHistory);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide feedback on a message
  const provideFeedback = (messageId, feedback) => {
    console.log(`Feedback for message ${messageId}:`, feedback);
    // In a real app, this would send the feedback to a server
  };

  // Context value
  const value = {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    provideFeedback,
    chatHistory,
    activeChat,
    createNewChat,
    selectChat,
    deleteChat,
    refreshChatHistory // Expose this method so it can be called from elsewhere
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};