import axios from 'axios';

// Backend API URL - can be set via environment variable
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Send a message to the SV-LLM backend
 * @param {Object} params
 * @param {Array} params.messages - Array of message objects
 * @param {string} params.model - Model ID selected by the user (e.g., 'gpt-4')
 * @param {string} params.apiKey - API key provided by the user
 * @returns {Promise<Object>} - Response from the backend
 */
export const sendMessageToLLM = async ({ messages, model, apiKey }) => {
  // Extract the latest user message
  const userMessages = messages.filter(msg => msg.role === 'user');
  const latestUserMessage = userMessages[userMessages.length - 1];
  
  // Format conversation history for the backend
  // Remove the system message and latest user message from history
  const history = messages
    .filter(msg => msg.role !== 'system' && msg !== latestUserMessage)
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  
  try {
    console.log('Sending request to backend:', {
      query: latestUserMessage.content,
      history: history,
      model: model
      // API key not logged for security
    });
    
    const response = await axios.post(`${BACKEND_API_URL}/api/chat`, {
      query: latestUserMessage.content,
      history: history,
      model: model,
      api_key: apiKey
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Return in the format expected by the frontend
    return {
      role: 'assistant',
      content: response.data.response
    };
  } catch (error) {
    // Handle missing inputs case
    if (error.response && error.response.data.status === 'missing_inputs') {
      console.error('Missing inputs:', error.response.data.required_inputs);
      return {
        role: 'assistant',
        content: `I need additional information to answer your question. Please provide details about: ${Object.values(error.response.data.required_inputs).flat().join(', ')}`
      };
    }
    
    // Handle other errors
    console.error('Backend API error:', error);
    
    // Provide a user-friendly error message
    const errorMessage = error.response?.data?.message || 'Error communicating with backend';
    
    return {
      role: 'assistant',
      content: `I encountered an issue while processing your request: ${errorMessage}. Please try again or consider using a different model.`
    };
  }
};