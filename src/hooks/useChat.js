import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

/**
 * Hook for using the chat functionality throughout the app
 * This is a convenience wrapper around the ChatContext
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};