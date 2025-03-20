import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useConfig } from './ConfigContext';
import { sendMessageToLLM } from '../services/llmService';
import { storeChatHistory, loadChatHistory } from '../services/storageService';


export const ChatContext = createContext();


export const useChat = () => useContext(ChatContext);


export const ChatProvider = ({ children }) => {
  const { selectedModel, apiKey, contextWindow } = useConfig();
  
  const [messages, setMessages] = useState([]);
  
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState(null);
  
  const [chatHistory, setChatHistory] = useState([]);
  
  
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    refreshChatHistory();
  }, []);

  
  const refreshChatHistory = () => {
    const history = loadChatHistory();
    setChatHistory(history);
    
    if (history.length > 0) {
      setActiveChat(history[0]);
      setMessages(history[0].messages || []);
    } else {
      setActiveChat(null);
      setMessages([]);
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
    setActiveChat(newChat);
    setMessages([]);
    
   
    storeChatHistory(updatedHistory);
    
    return newChat;
  };

  
  const resetChat = () => {
    createNewChat();
  };

  
  const selectChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
      setMessages(chat.messages || []);
    }
  };

  
  const deleteChat = (chatId) => {
    const updatedHistory = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updatedHistory);
    storeChatHistory(updatedHistory);
    
    
    if (activeChat && activeChat.id === chatId) {
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
    
   
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
  
    const updatedChat = {
      ...activeChat,
      messages: updatedMessages,
      lastUpdated: new Date().toISOString(),
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
    setIsLoading(true);
    setError(null);
    
    try {
      
      const contextMessages = updatedMessages.slice(-Math.floor(contextWindow / 200)); 
      
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
      
      
      const messagesWithResponse = [...updatedMessages, assistantMessage];
      setMessages(messagesWithResponse);
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

  
  const provideFeedback = (messageId, feedback) => {
    console.log(`Feedback for message ${messageId}:`, feedback);
   
  };

  
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