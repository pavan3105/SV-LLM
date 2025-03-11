import { useState, useCallback } from 'react';

/**
 * Hook for making API calls with loading and error handling
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Additional options
 * @returns {Object} - Status and function to make the API call
 */
export const useApiCall = (apiFunction, options = {}) => {
  const { onSuccess, onError, autoReset = true } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  
  /**
   * Reset the state
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setCalled(false);
  }, []);
  
  /**
   * Execute the API call
   * @param {Array} args - Arguments to pass to the API function
   * @returns {Promise} - Result of the API call
   */
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setCalled(true);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error('API call error:', err);
      setError(err);
      setLoading(false);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    }
  }, [apiFunction, onSuccess, onError]);
  
  return {
    execute,
    reset,
    data,
    loading,
    error,
    called,
  };
};