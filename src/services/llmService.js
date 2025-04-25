import axios from 'axios';

// Backend API URL - can be set via environment variable
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Send a message to the SV-LLM backend
 * @param {Object} params
 * @param {Array} params.messages - Array of message objects
 * @param {string} params.model - Model ID selected by the user (e.g., 'gpt-4')
 * @param {string} params.apiKey - API key provided by the user
 * @param {Object} params.additionalData - Additional data like files or vulnerability selections
 * @returns {Promise<Object>} - Response from the backend
 * @throws {Error} - Error object with response data for missing inputs
 */
export const sendMessageToLLM = async ({ 
  messages, 
  model, 
  apiKey, 
  additionalData = {} 
}) => {
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
      model: model,
      ...additionalData
      // API key not logged for security
    });
    
    const requestData = {
      query: latestUserMessage.content,
      history: history,
      model: model,
      api_key: apiKey,
      // Include any additional data like design files or vulnerability selections
      ...additionalData
    };
    
    const response = await axios.post(`${BACKEND_API_URL}/api/chat`, requestData, {
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
    // Handle missing inputs case - throw the error with response data
    if (error.response && error.response.data.status === 'missing_inputs') {
      console.log('Missing inputs detected:', error.response.data.required_inputs);
      
      // For security_property_generation, add a specific message
      if (error.response.data.detected_intent && 
          error.response.data.detected_intent.includes('security_property_generation')) {
        error.response.data.content = 'To generate security properties, I need your design specification file and the vulnerability type you want to protect against.';
      }
      // For vulnerability detection, add a special message
      else if (error.response.data.detected_intent && 
          error.response.data.detected_intent.includes('vulnerability_detection')) {
        error.response.data.content = 'To perform vulnerability detection, I need additional information. Please provide your design specification file and select a vulnerability type from the options below.';
      } else {
        error.response.data.content = `I need additional information to answer your question. Please provide details about: ${Object.values(error.response.data.required_inputs).flat().join(', ')}`;
      }
      
      throw error; 
    }
    
    // Handle other errors
    console.error('Backend API error:', error);
    const errorMessage = error.response?.data?.message || 'Error communicating with backend';
    
    return {
      role: 'assistant',
      content: `I encountered an issue while processing your request: ${errorMessage}. Please try again or consider using a different model.`
    };
  }
}