import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
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
    } else {
      setActiveChatId(null);
      setMessages([]);
      activeChatRef.current = null;
      createNewChat();
    }
  };

  const createNewChat = () => {
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
    
    storeChatHistory(updatedHistory);
    
    return newChat;
  };

  const resetChat = () => {
    createNewChat();
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      activeChatRef.current = chat;
    }
  };

  const deleteChat = (chatId) => {
    const updatedHistory = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    setLoadingChats(prev => {
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

  const sendMessage = async (text) => {
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
    
    setError(null);
    
    try {
      const contextMessages = chatWithUserMessage.messages.slice(-Math.floor(contextWindow / 200)); 
      
      const response = await sendMessageToLLM({
        messages: contextMessages,
        model: selectedModel,
        apiKey
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
        
        // Create updated history
        const finalHistory = latestChatHistory.map(c => 
          c.id === targetChatId ? chatWithResponse : c
        );
        
        if (activeChatId === targetChatId) {
          setMessages(chatWithResponse.messages);
        }
        
        setChatHistory(finalHistory);
        storeChatHistory(finalHistory);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err);
    } finally {
      // Clear loading state
      setLoadingChats(prev => ({
        ...prev,
        [targetChatId]: false
      }));
    }
  };

  const provideFeedback = (messageId, feedback) => {
    console.log(`Feedback for message ${messageId}:`, feedback);
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
    refreshChatHistory
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};