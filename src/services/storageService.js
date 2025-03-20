/**
 * Save the chat history to local storage
 * @param {Array} history - Array of chat objects
 */
export const storeChatHistory = (history) => {
  try {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error storing chat history:', error);
  }
};

/**
 * Load the chat history from local storage
 * @returns {Array} - Array of chat objects
 */
export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem('chatHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Save a chat to local storage
 * @param {Object} chat - Chat object
 */
export const storeChat = (chat) => {
  try {
    
    const history = loadChatHistory();
    
   
    const index = history.findIndex(c => c.id === chat.id);
    
    if (index >= 0) {
     
      history[index] = chat;
    } else {
      
      history.unshift(chat);
    }
    
    
    storeChatHistory(history);
  } catch (error) {
    console.error('Error storing chat:', error);
  }
};

/**
 * Delete a chat from local storage
 * @param {string} chatId - ID of chat to delete
 */
export const deleteChat = (chatId) => {
  try {
    
    const history = loadChatHistory();
    const updatedHistory = history.filter(chat => chat.id !== chatId);
    storeChatHistory(updatedHistory);
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};

/**
 * Clear all chats from local storage
 */
export const clearAllChats = () => {
  try {
    localStorage.removeItem('chatHistory');
    return [];
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error; 
  }
};

/**
 * Get a specific chat by ID
 * @param {string} chatId - ID of chat to retrieve
 * @returns {Object|null} - Chat object or null if not found
 */
export const getChatById = (chatId) => {
  try {
    const history = loadChatHistory();
    return history.find(chat => chat.id === chatId) || null;
  } catch (error) {
    console.error('Error getting chat by ID:', error);
    return null;
  }
};