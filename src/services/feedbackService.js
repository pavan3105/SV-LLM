import api from './api';

// Storage key for local feedback
const FEEDBACK_STORAGE_KEY = 'sv-llm-feedback';

/**
 * Send feedback to API
 * @param {Object} feedback - Feedback data
 * @returns {Promise} - API response
 */
export const sendFeedback = async (feedback) => {
  try {
    // Add timestamp if not present
    const enhancedFeedback = {
      ...feedback,
      timestamp: feedback.timestamp || new Date().toISOString()
    };

    // Since we're not implementing a real backend yet,
    // we'll store the feedback locally
    storeFeedbackLocally(enhancedFeedback);
    
    // In a production app, you would send to an API endpoint:
    // return api.post('/feedback', enhancedFeedback);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log the feedback for debugging
    console.log('Feedback submitted:', enhancedFeedback);
    
    return { success: true, message: 'Feedback recorded' };
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};

/**
 * Store feedback in localStorage
 * @param {Object} feedback - Feedback data
 */
const storeFeedbackLocally = (feedback) => {
  try {
    // Get existing feedback
    const existingFeedback = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
    
    // Add new feedback
    existingFeedback.push(feedback);
    
    // Save back to localStorage
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existingFeedback));
  } catch (error) {
    console.error('Error storing feedback locally:', error);
  }
};

/**
 * Get all stored feedback
 * @returns {Array} - Array of feedback items
 */
export const getStoredFeedback = () => {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error getting stored feedback:', error);
    return [];
  }
};

/**
 * Get feedback statistics
 * @returns {Object} - Counts of each reaction type
 */
export const getFeedbackStats = () => {
  try {
    const feedback = getStoredFeedback();
    
    // Count reactions
    const stats = feedback.reduce((acc, item) => {
      if (item.reaction) {
        acc[item.reaction] = (acc[item.reaction] || 0) + 1;
      }
      return acc;
    }, {});
    
    return stats;
  } catch (error) {
    console.error('Error calculating feedback stats:', error);
    return {};
  }
};

/**
 * Clear all stored feedback
 */
export const clearStoredFeedback = () => {
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
};