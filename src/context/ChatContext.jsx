import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useConfig } from './ConfigContext';
import { sendMessageToLLM } from '../services/llmService';
import { storeChatHistory, loadChatHistory } from '../services/storageService';

export const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { selectedModel, apiKey, contextWindow } = useConfig();
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState({});
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatPrompts, setChatPrompts] = useState({});  // State to track prompts per chat
  const [missingInputs, setMissingInputs] = useState(null); // State for missing inputs
  
  const activeChatRef = useRef(null);

  useEffect(() => {
    refreshChatHistory();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      const chat = chatHistory.find(c => c.id === activeChatId);
      if (chat) {
        setMessages(chat.messages || []);
        activeChatRef.current = chat;
      }
    }
  }, [activeChatId, chatHistory]);

  const refreshChatHistory = () => {
    const history = loadChatHistory();
    setChatHistory(history);
    
    if (history.length > 0) {
      setActiveChatId(history[0].id);
      setMessages(history[0].messages || []);
      activeChatRef.current = history[0];
      // Reset missing inputs when refreshing chat history
      setMissingInputs(null);
    } else {
      setActiveChatId(null);
      setMessages([]);
      activeChatRef.current = null;
      createNewChat();
    }
  };

  const createNewChat = () => {
    setMissingInputs(null);
    
    const newChat = {
      id: uuidv4(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messages: []
    };
    
    const updatedHistory = [newChat, ...chatHistory];
    setChatHistory(updatedHistory);
    
    setActiveChatId(newChat.id);
    setMessages([]);
    activeChatRef.current = newChat;
    
    // Initialize prompt for new chat
    setChatPrompts(prev => ({
      ...prev,
      [newChat.id]: ''
    }));
    
    storeChatHistory(updatedHistory);
    
    return newChat;
  };

  const resetChat = () => {
    setMissingInputs(null);
    createNewChat();
  };

  const selectChat = (chatId) => {
    setMissingInputs(null);
    
    setActiveChatId(chatId);
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      activeChatRef.current = chat;
    }
  };

  const deleteChat = (chatId) => {
    if (activeChatId === chatId) {
      setMissingInputs(null);
    }
    
    const updatedHistory = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    // Remove loading state and prompt for this chat
    setLoadingChats(prev => {
      const updated = {...prev};
      delete updated[chatId];
      return updated;
    });
    
    // Remove prompt for deleted chat
    setChatPrompts(prev => {
      const updated = {...prev};
      delete updated[chatId];
      return updated;
    });
    
    if (activeChatId === chatId) {
      if (updatedHistory.length > 0) {
        selectChat(updatedHistory[0].id);
      } else {
        createNewChat();
      }
    }
  };

  // New helper function to send messages with additional data
  const sendMessageWithAdditionalData = async (text, additionalData = {}) => {
    if (!text.trim()) return;
    
    if (!apiKey) {
      setError(new Error('API key is required. Please add your API key in the configuration panel.'));
      return;
    }
    
    const targetChatId = activeChatId;
    const targetChat = activeChatRef.current;
    
    if (!targetChat) {
      console.error("No active chat found");
      return;
    }
    
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    if (activeChatId === targetChatId) {
      setMessages(prev => [...prev, userMessage]);
    }

    const chatWithUserMessage = {
      ...targetChat,
      messages: [...(targetChat.messages || []), userMessage],
      lastUpdated: new Date().toISOString(),
      title: targetChat.title === 'New Chat' && targetChat.messages.length === 0 
        ? text.slice(0, 30) + (text.length > 30 ? '...' : '') 
        : targetChat.title
    };
    
    const updatedHistory = chatHistory.map(c => 
      c.id === targetChatId ? chatWithUserMessage : c
    );
    
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    setLoadingChats(prev => ({
      ...prev,
      [targetChatId]: true
    }));
    
    // Clear the prompt for this specific chat
    setChatPrompts(prev => ({
      ...prev,
      [targetChatId]: ''
    }));
    
    // Reset error and missing inputs state
    setError(null);
    setMissingInputs(null);
    
    try {
      const contextMessages = chatWithUserMessage.messages.slice(-Math.floor(contextWindow / 200)); 
      
      // Send the message with additional data
      const response = await sendMessageToLLM({
        messages: contextMessages,
        model: selectedModel,
        apiKey,
        additionalData
      });
      
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };
      
      const latestChatHistory = loadChatHistory();
      
      const latestTargetChat = latestChatHistory.find(c => c.id === targetChatId);
      
      if (latestTargetChat) {
        const chatWithResponse = {
          ...latestTargetChat,
          messages: [...latestTargetChat.messages, assistantMessage],
          lastUpdated: new Date().toISOString()
        };
        
        const finalHistory = latestChatHistory.map(c => 
          c.id === targetChatId ? chatWithResponse : c
        );
        
        if (activeChatId === targetChatId) {
          setMessages(chatWithResponse.messages);
        }
        
        setChatHistory(finalHistory);
        storeChatHistory(finalHistory);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if this is a missing_inputs error
      if (error.response?.data?.status === 'missing_inputs') {
        // Set missing inputs state to be displayed in the UI
        setMissingInputs(error.response.data.required_inputs);
        
        // Create an assistant message to prompt for missing inputs
        const missingInputsMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: error.response.data.content || `I need additional information to process your request. Please provide the missing details.`,
          timestamp: new Date().toISOString(),
          hasMissingInputs: true // Flag to indicate this message has missing inputs
        };
        
        if (activeChatId === targetChatId) {
          setMessages(prev => [...prev, missingInputsMessage]);
        }
        
        // Update chat history with error message
        const latestChatHistory = loadChatHistory();
        const latestTargetChat = latestChatHistory.find(c => c.id === targetChatId);
        
        if (latestTargetChat) {
          const chatWithMissingInputs = {
            ...latestTargetChat,
            messages: [...latestTargetChat.messages, missingInputsMessage],
            lastUpdated: new Date().toISOString()
          };
          
          const updatedHistory = latestChatHistory.map(c => 
            c.id === targetChatId ? chatWithMissingInputs : c
          );
          
          setChatHistory(updatedHistory);
          storeChatHistory(updatedHistory);
        }
      } else {
        // Handle other types of errors
        setError(error);
        
        // Create an error message to show to the user
        const errorMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: `I encountered an error: ${error.message || 'Unknown error'}. Please try again or check your input.`,
          timestamp: new Date().toISOString()
        };
        
        if (activeChatId === targetChatId) {
          setMessages(prev => [...prev, errorMessage]);
        }
        
        // Update chat history with error message
        const latestChatHistory = loadChatHistory();
        const latestTargetChat = latestChatHistory.find(c => c.id === targetChatId);
        
        if (latestTargetChat) {
          const chatWithError = {
            ...latestTargetChat, 
            messages: [...latestTargetChat.messages, errorMessage],
            lastUpdated: new Date().toISOString()
          };
          
          const updatedHistory = latestChatHistory.map(c => 
            c.id === targetChatId ? chatWithError : c
          );
          
          setChatHistory(updatedHistory);
          storeChatHistory(updatedHistory);
        }
      }
    } finally {
      // Clear loading state
      setLoadingChats(prev => ({
        ...prev,
        [targetChatId]: false
      }));
    }
  };

  const sendMessage = async (text) => {
    // Call the helper function without additional data
    await sendMessageWithAdditionalData(text, {});
  };
  

const handleMissingInputsSubmit = (inputs) => {
  // Clear missing inputs state
  setMissingInputs(null);
  
  // Store the additional inputs to be sent with the next message
  const additionalData = {};
  
  // Handle the design file content if provided
  if (inputs.design_spec) {
    additionalData.design_file = inputs.design_spec;
    console.log("Design file content prepared for sending");
  }
  
  // Handle vulnerability/threat selection
  if (inputs.vulnerability) {
    additionalData.vulnerability = inputs.vulnerability;
    console.log("Vulnerability selection prepared:", inputs.vulnerability);
  }
  
  if (activeChatRef.current && activeChatRef.current.messages.length > 0) {
    const userMessages = activeChatRef.current.messages.filter(m => m.role === 'user');
    if (userMessages.length > 0) {
      const originalQuery = userMessages[userMessages.length - 1].content;
      additionalData.original_query = originalQuery;
      console.log("Original query preserved:", originalQuery);
    }
  }
  
  // Format the inputs as text to include in the next message
  const inputsList = [];
  for (const [key, value] of Object.entries(inputs)) {
    if (key === 'design_spec') {
      // For design files, just include a placeholder text not the content
      inputsList.push(`Design File: [File uploaded]`);
    } else {
      inputsList.push(`${key}: ${value}`);
    }
  }
  
  const inputsText = inputsList.join('\n');
  
  // Send the prepared message with the additional data
  sendMessageWithAdditionalData(inputsText, additionalData);
};
  
  const provideFeedback = (messageId, feedback) => {
    console.log(`Feedback for message ${messageId}:`, feedback);
    
    // Implement actual feedback logic if needed
    try {
      // You can add more robust feedback handling here
      // For now, just a simple logging mechanism
      return { success: true, message: 'Feedback recorded' };
    } catch (error) {
      console.error('Error providing feedback:', error);
      return { success: false, message: 'Failed to record feedback' };
    }
  };

  const updateChatPrompt = useCallback((chatId, prompt) => {
    setChatPrompts(prev => ({
      ...prev,
      [chatId]: prompt
    }));
  }, []);

  const renameChatTitle = (chatId, newTitle) => {
    const updatedHistory = chatHistory.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle.trim() } 
        : chat
    );
    
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    // If the renamed chat is the active chat, update the reference
    if (activeChatId === chatId) {
      const updatedChat = updatedHistory.find(c => c.id === chatId);
      if (updatedChat) {
        activeChatRef.current = updatedChat;
      }
    }
  };

  const isLoading = (chatId) => {
    const idToCheck = chatId || activeChatId;
    return Boolean(loadingChats[idToCheck]);
  };

  const activeChat = chatHistory.find(c => c.id === activeChatId) || null;

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
    refreshChatHistory,
    chatPrompts,  // Expose chat prompts
    updateChatPrompt,  // Method to update chat prompts
    renameChatTitle,
    missingInputs,  // Expose missing inputs
    handleMissingInputsSubmit,  // Method to handle missing inputs submission
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};