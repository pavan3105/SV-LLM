/**
 * Get a user-friendly error message from an error object
 * @param {Error|Object} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If the error is already a string, return it
  if (typeof error === 'string') return error;
  
  // Check for Axios error response
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle common API error formats
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
    if (data?.error) return typeof data.error === 'string' ? data.error : 'API error';
    
    // Handle status codes
    if (status === 401) return 'Authentication failed. Please check your API key.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 429) return 'Rate limit exceeded. Please try again later.';
    if (status >= 500) return 'Server error. Please try again later.';
    
    return `Error ${status}: ${data.statusText || 'Unknown error'}`;
  }
  
  // Network errors
  if (error.request && !error.response) {
    return 'Network error. Please check your internet connection.';
  }
  
  // Use error message if available
  if (error.message) return error.message;
  
  // Fallback for unknown errors
  return 'An unexpected error occurred';
};

/**
 * Format API-specific errors
 * @param {Error|Object} error - Error object
 * @param {string} apiType - Type of API (openai, anthropic, etc.)
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error, apiType) => {
  const baseMessage = getErrorMessage(error);
  
  // Add specific context based on API type
  switch (apiType) {
    case 'openai':
      if (error.response?.status === 401) {
        return 'Invalid OpenAI API key. Please check your credentials.';
      }
      if (error.response?.status === 429) {
        return 'OpenAI rate limit exceeded or quota reached.';
      }
      return `OpenAI API error: ${baseMessage}`;
      
    case 'anthropic':
      if (error.response?.status === 401) {
        return 'Invalid Anthropic API key. Please check your credentials.';
      }
      return `Anthropic API error: ${baseMessage}`;
      
    case 'google':
      return `Google AI API error: ${baseMessage}`;
      
    case 'xai':
      return `xAI API error: ${baseMessage}`;

    case 'cohere':
        if (error.response?.status === 401) {
          return 'Invalid Cohere API key. Please check your credentials.';
        }
        if (error.response?.status === 429) {
          return 'Cohere rate limit exceeded. Please try again later.';
        }
        if (error.response?.data?.message) {
          return `Cohere API error: ${error.response.data.message}`;
        }
        return `Cohere API error: ${baseMessage}`;
    
    case 'mistral':
        if (error.response?.status === 401) {
          return 'Invalid Mistral API key. Please check your credentials.';
        }
        if (error.response?.status === 429) {
          return 'Mistral rate limit exceeded. Please try again later.';
        }
        return `Mistral API error: ${baseMessage}`;
      
    default:
      return baseMessage;
  }
};

/**
 * Log an error to the console with context
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalInfo - Additional information about the error
 */
export const logError = (error, context = '', additionalInfo = {}) => {
  // Create a detailed error log
  console.error(
    `Error in ${context || 'application'}:`,
    {
      message: getErrorMessage(error),
      originalError: error,
      time: new Date().toISOString(),
      ...additionalInfo
    }
  );
  
  // In a production app, you might want to send this to a logging service
};

/**
 * Create an error object with additional context
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Error} - Enhanced error object
 */
export const createError = (message, details = {}) => {
  const error = new Error(message);
  
  // Add additional properties
  Object.keys(details).forEach(key => {
    error[key] = details[key];
  });
  
  return error;
};
/**
 * Format a backend API error
 * @param {Error|Object} error - Error object
 * @returns {string} - Formatted error message
 */
export const formatBackendError = (error) => {
  const baseMessage = getErrorMessage(error);
  
  // Check for specific backend error status
  if (error.response?.data?.status) {
    switch (error.response.data.status) {
      case 'missing_inputs':
        const missingFields = Object.values(error.response.data.required_inputs || {}).flat();
        return `Additional information required: ${missingFields.join(', ')}`;
        
      case 'error':
        return `Backend processing error: ${error.response.data.message || baseMessage}`;
        
      default:
        return `Backend error: ${baseMessage}`;
    }
  }
  
  return `Backend error: ${baseMessage}`;
};