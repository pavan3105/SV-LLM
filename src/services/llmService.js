import axios from 'axios';

/**
 * Send a message to the LLM API
 * @param {Object} params
 * @param {Array} params.messages - Array of message objects
 * @param {string} params.model - Model ID (e.g., 'gpt-4')
 * @param {string} params.apiKey - API key for the service
 * @returns {Promise<Object>} - Response from the API
 */
export const sendMessageToLLM = async ({ messages, model, apiKey }) => {
  // Include a system message that instructs the model to focus on security aspects
  // This will be processed by the backend orchestrator to determine the appropriate agent
  const enhancedMessages = [
    {
      role: 'system',
      content: 'You are SV-LLM, a security-focused AI assistant. Analyze all queries with a security mindset, identifying potential vulnerabilities, risks, and best practices. Provide detailed, actionable security advice and recommendations.'
    },
    ...messages
  ];
  
  // Determine which API to use based on the model
  if (model.startsWith('gpt')) {
    return sendToOpenAI({ messages: enhancedMessages, model, apiKey });
  } else if (model.startsWith('claude')) {
    return sendToAnthropic({ messages: enhancedMessages, model, apiKey });
  } else if (model.startsWith('gemini')) {
    return sendToGoogle({ messages: enhancedMessages, model, apiKey });
  } else if (model.startsWith('grok')) {
    return sendToXAI({ messages: enhancedMessages, model, apiKey });
  } else if (model.startsWith('cohere') || model === 'cohere') {
    return sendToCohere({ messages: enhancedMessages, model, apiKey });
  } else {
    throw new Error(`Unsupported model: ${model}`);
  }
};

/**
 * Send a message to OpenAI API
 */
const sendToOpenAI = async ({ messages, model, apiKey }) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    return response.data.choices[0].message;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(error.response?.data?.error?.message || 'Error communicating with OpenAI');
  }
};

/**
 * Send a message to Anthropic API
 */
const sendToAnthropic = async ({ messages, model, apiKey }) => {
  try {
    // Convert messages to Anthropic format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model,
        messages: formattedMessages,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return {
      role: 'assistant',
      content: response.data.content[0].text
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error(error.response?.data?.error?.message || 'Error communicating with Anthropic');
  }
};

/**
 * Send a message to Google AI API
 */
const sendToGoogle = async ({ messages, model, apiKey }) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: apiKey
        }
      }
    );
    
    return {
      role: 'assistant',
      content: response.data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('Google AI API error:', error);
    throw new Error(error.response?.data?.error?.message || 'Error communicating with Google AI');
  }
};

/**
 * Send a message to xAI API
 */
const sendToXAI = async ({ messages, model, apiKey }) => {
  try {
    const response = await axios.post(
      'https://api.xai.com/v1/chat/completions',  // Example endpoint
      {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    return {
      role: 'assistant',
      content: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('xAI API error:', error);
    throw new Error(error.response?.data?.error?.message || 'Error communicating with xAI');
  }
};

/**
 * Send a message to Cohere API
 */
const sendToCohere = async ({ messages, model, apiKey }) => {
  try {
    // Extract the current user query (last message)
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    // Format chat history (excluding system message and the last user message)
    const chatHistory = [];
    let systemMessage = '';
    
    // Process all messages to build chat history
    for (const msg of messages) {
      if (msg.role === 'system') {
        systemMessage = msg.content;
      } else if (msg.role === 'user' && msg !== lastUserMessage) {
        // Add previous user messages
        chatHistory.push({
          role: 'USER',
          message: msg.content
        });
      } else if (msg.role === 'assistant') {
        // Add assistant messages
        chatHistory.push({
          role: 'CHATBOT',
          message: msg.content
        });
      }
    }
    
    // Determine which Cohere model to use
    const cohereModel = model === 'cohere' ? 'command' : model.replace('cohere-', '');
    
    // Prepare the request payload
    const payload = {
      model: cohereModel,
      message: lastUserMessage.content,
      temperature: 0.7,
    };
    
    // Only add chat history if we have previous messages
    if (chatHistory.length > 0) {
      payload.chat_history = chatHistory;
    }
    
    // Add preamble if we have a system message
    if (systemMessage) {
      payload.preamble = systemMessage;
    }
    
    // Send request to Cohere API
    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      }
    );
    
    // Return formatted response
    return {
      role: 'assistant',
      content: response.data.text
    };
  } catch (error) {
    console.error('Cohere API error:', error);
    
    // Enhanced error handling with more details
    let errorMessage = 'Error communicating with Cohere';
    
    if (error.response) {
      // The request was made and the server responded with a non-2xx status
      errorMessage = error.response.data?.message || `Cohere API error: ${error.response.status}`;
      console.error('Cohere API response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from Cohere API';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'Unknown error with Cohere API request';
    }
    
    throw new Error(errorMessage);
  }
};