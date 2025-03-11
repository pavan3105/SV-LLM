/**
 * Check if a string is a valid email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Basic email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  /**
   * Check if a string is empty or only whitespace
   * @param {string} text - Text to validate
   * @returns {boolean} - Whether text is empty
   */
  export const isEmpty = (text) => {
    return !text || text.trim() === '';
  };
  
  /**
   * Check if a string meets minimum length requirement
   * @param {string} text - Text to validate
   * @param {number} minLength - Minimum length
   * @returns {boolean} - Whether text meets minimum length
   */
  export const isMinLength = (text, minLength) => {
    if (!text) return false;
    return text.length >= minLength;
  };
  
  /**
   * Check if a string is within maximum length limit
   * @param {string} text - Text to validate
   * @param {number} maxLength - Maximum length
   * @returns {boolean} - Whether text is within maximum length
   */
  export const isMaxLength = (text, maxLength) => {
    if (!text) return true;
    return text.length <= maxLength;
  };
  
  /**
   * Check if a value is a valid number
   * @param {any} value - Value to validate
   * @returns {boolean} - Whether value is a valid number
   */
  export const isValidNumber = (value) => {
    if (value === null || value === undefined || value === '') return false;
    return !isNaN(Number(value));
  };
  
  /**
   * Check if a number is within range
   * @param {number} value - Number to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} - Whether number is within range
   */
  export const isInRange = (value, min, max) => {
    if (!isValidNumber(value)) return false;
    
    const num = Number(value);
    return num >= min && num <= max;
  };
  
  /**
   * Check if a string is a valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} - Whether URL is valid
   */
  export const isValidUrl = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Validate an API key format (basic check)
   * @param {string} apiKey - API key to validate
   * @param {Object} options - Validation options
   * @returns {boolean} - Whether API key format is valid
   */
  export const isValidApiKey = (apiKey, options = { minLength: 20 }) => {
    if (!apiKey) return false;
    
    // Basic checks for common API key formats
    return (
      isMinLength(apiKey, options.minLength) && 
      // Most API keys don't have spaces
      !apiKey.includes(' ') &&
      // Common API key formats start with specific prefixes
      (apiKey.startsWith('sk-') || 
       apiKey.startsWith('key-') || 
       apiKey.startsWith('api-') ||
       // No specific prefix requirement
       true)
    );
  };