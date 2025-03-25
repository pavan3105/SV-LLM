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
  } else if (model.startsWith('mistral') || model.startsWith('pixtral') || model.startsWith('open-mistral') || model.startsWith('open-codestral') || model === 'mathstral') {
    return sendToMistral({ messages: enhancedMessages, model, apiKey });
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
    
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    const chatHistory = [];
    let systemMessage = '';
    
   
    for (const msg of messages) {
      if (msg.role === 'system') {
        systemMessage = msg.content;
      } else if (msg.role === 'user' && msg !== lastUserMessage) {
        
        chatHistory.push({
          role: 'USER',
          message: msg.content
        });
      } else if (msg.role === 'assistant') {
       
        chatHistory.push({
          role: 'CHATBOT',
          message: msg.content
        });
      }
    }
    
   
    const cohereModel = model === 'cohere' ? 'command' : model.replace('cohere-', '');
    
   
    const payload = {
      model: cohereModel,
      message: lastUserMessage.content,
      temperature: 0.7,
    };
    
    
    if (chatHistory.length > 0) {
      payload.chat_history = chatHistory;
    }
    
   
    if (systemMessage) {
      payload.preamble = systemMessage;
    }
    
   
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
    
   
    return {
      role: 'assistant',
      content: response.data.text
    };
  } catch (error) {
    console.error('Cohere API error:', error);
    
    
    let errorMessage = 'Error communicating with Cohere';
    
    if (error.response) {
      
      errorMessage = error.response.data?.message || `Cohere API error: ${error.response.status}`;
      console.error('Cohere API response data:', error.response.data);
    } else if (error.request) {
      
      errorMessage = 'No response received from Cohere API';
    } else {
      
      errorMessage = error.message || 'Unknown error with Cohere API request';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Send a message to Mistral API
 */
const sendToMistral = async ({ messages, model, apiKey }) => {
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1000,
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
    console.error('Mistral API error:', error);
    
    let errorMessage = 'Error communicating with Mistral API';
    
    if (error.response) {
      errorMessage = error.response.data?.error?.message || `Mistral API error: ${error.response.status}`;
      console.error('Mistral API response data:', error.response.data);
    } else if (error.request) {
      errorMessage = 'No response received from Mistral API';
    } else {
      errorMessage = error.message || 'Unknown error with Mistral API request';
    }
    
    throw new Error(errorMessage);
  }
};