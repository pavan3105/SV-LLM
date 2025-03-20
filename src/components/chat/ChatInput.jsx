import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';

const ChatInput = ({ onSubmit, isLoading, value, onChange }) => {
  const { darkMode } = useTheme();
  const textareaRef = useRef(null);

  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);


  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() !== '' && !isLoading) {
      onSubmit(value);
    }
  };

  
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  
  const handleClear = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`relative rounded-lg border ${
        darkMode ? 'border-gray-700 bg-dark-100' : 'border-gray-300 bg-white'
      } overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500`}>
        {/* Textarea for input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a security question or enter code to analyze..."
          rows="1"
          className={`block w-full resize-none border-0 bg-transparent py-3 px-4 pr-24 focus:ring-0 ${
            darkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'
          }`}
          disabled={isLoading}
        />
        
        {/* Action buttons */}
        <div className="absolute bottom-0 right-0 flex items-center space-x-1 p-2">
          {/* Clear button (only show when there's input) */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 rounded-full ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <XMarkIcon className="h-5 w-5" />
              <span className="sr-only">Clear input</span>
            </button>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className={`p-1.5 rounded-full transition-colors ${
              isLoading || !value.trim()
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to send
      </div>
    </form>
  );
};

export default ChatInput;