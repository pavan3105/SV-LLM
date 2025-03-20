import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendFeedback } from '../services/feedbackService';

/**
 * Hook for handling user feedback on responses
 */
export const useFeedback = () => {
  const [pending, setPending] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [error, setError] = useState(null);
  
  /**
   * Record feedback for a message
   * @param {string} messageId - ID of the message being rated
   * @param {Object} feedback - Feedback data (rating, comment, etc.)
   */
  const submitFeedback = async (messageId, feedback) => {
    const feedbackId = uuidv4();
    const feedbackData = {
      id: feedbackId,
      messageId,
      timestamp: new Date().toISOString(),
      ...feedback
    };
    
    
    setPending(prev => [...prev, feedbackData]);
    
    try {
     
      await sendFeedback(feedbackData);
      
     
      setPending(prev => prev.filter(item => item.id !== feedbackId));
      setSubmitted(prev => [...prev, feedbackData]);
      
      return { success: true };
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err);
      return { success: false, error: err };
    }
  };
  
  /**
   * Check if feedback exists for a message
   * @param {string} messageId - ID of the message to check
   * @returns {boolean} - Whether feedback exists
   */
  const hasFeedback = (messageId) => {
    return (
      pending.some(item => item.messageId === messageId) ||
      submitted.some(item => item.messageId === messageId)
    );
  };
  
  /**
   * Get feedback for a message
   * @param {string} messageId - ID of the message
   * @returns {Object|null} - Feedback data or null
   */
  const getFeedback = (messageId) => {
    const pendingItem = pending.find(item => item.messageId === messageId);
    if (pendingItem) return { ...pendingItem, status: 'pending' };
    
    const submittedItem = submitted.find(item => item.messageId === messageId);
    if (submittedItem) return { ...submittedItem, status: 'submitted' };
    
    return null;
  };
  
  return {
    submitFeedback,
    hasFeedback,
    getFeedback,
    pending,
    submitted,
    error
  };
};