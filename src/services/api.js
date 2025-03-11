import axios from 'axios';

// Create an Axios instance with defaults
const api = axios.create({
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    // For example, add auth tokens from localStorage
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      config.headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify the response data here
    return response.data;
  },
  (error) => {
    // Handle errors
    let message = 'Something went wrong';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      message = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      console.error('API Error Response:', error.response);
    } else if (error.request) {
      // The request was made but no response was received
      message = 'No response received from server';
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
      console.error('API Request Error:', error.message);
    }
    
    const enhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export default api;