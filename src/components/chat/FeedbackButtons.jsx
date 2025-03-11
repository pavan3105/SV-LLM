import React, { useState } from 'react';
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const FeedbackButtons = ({ messageId, onProvideFeedback }) => {
  const { darkMode } = useTheme();
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Handle emoji reaction
  const handleReaction = (reaction) => {
    setFeedback(reaction);
    onProvideFeedback(messageId, { reaction });
    
    // If it's a negative reaction, prompt for more feedback
    if (reaction === 'negative') {
      setShowFeedbackForm(true);
    } else {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  // Handle text feedback submission
  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      onProvideFeedback(messageId, { reaction: feedback, text: feedbackText });
    }
    setShowFeedbackForm(false);
    setFeedbackText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Cancel text feedback
  const handleFeedbackCancel = () => {
    setShowFeedbackForm(false);
    setFeedbackText('');
  };

  // Button style based on theme and selection
  const buttonClass = (type) => {
    const isSelected = feedback === type;
    return `p-1.5 rounded-full transition-colors ${
      isSelected 
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
        : `${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
    }`;
  };

  // If feedback has been submitted, show thank you message
  if (submitted) {
    return (
      <div className="flex items-center text-xs text-success-600 dark:text-success-400">
        <CheckIcon className="h-3 w-3 mr-1" />
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Emoji reaction buttons */}
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
          Was this helpful?
        </span>
        
        <button
          className={buttonClass('positive')}
          onClick={() => handleReaction('positive')}
          aria-label="Positive feedback"
        >
          <HandThumbUpIcon className="h-4 w-4" />
        </button>
        
        <button
          className={buttonClass('negative')}
          onClick={() => handleReaction('negative')}
          aria-label="Negative feedback"
        >
          <HandThumbDownIcon className="h-4 w-4" />
        </button>
        
        {!showFeedbackForm && (
          <button
            className={`p-1.5 rounded-full transition-colors ${
              darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setShowFeedbackForm(true)}
            aria-label="Provide detailed feedback"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Text feedback form */}
      {showFeedbackForm && (
        <div className="mt-2">
          <textarea
            className={`w-full p-2 text-sm rounded border ${
              darkMode 
                ? 'bg-dark-200 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
            placeholder="Tell us more about your feedback..."
            rows="3"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className={`px-3 py-1 text-xs rounded ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={handleFeedbackCancel}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-xs rounded bg-primary-600 text-white hover:bg-primary-700"
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackButtons;