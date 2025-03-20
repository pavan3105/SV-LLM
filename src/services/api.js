import axios from 'axios';

const api = axios.create({
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
  
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
    return response.data;
  },
  (error) => {
    
    let message = 'Something went wrong';
    
    if (error.response) {
      message = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      console.error('API Error Response:', error.response);
    } else if (error.request) {

      message = 'No response received from server';
      console.error('API No Response:', error.request);
    } else {
    
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