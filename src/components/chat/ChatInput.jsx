import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { CommandLineIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks/useChat';

const ChatInput = ({ onSubmit, isLoading }) => {
  const { darkMode } = useTheme();
  const { activeChat, chatPrompts, updateChatPrompt } = useChat();
  const textareaRef = useRef(null);

  // Get the current chat's prompt, defaulting to empty string
  const currentPrompt = activeChat ? chatPrompts[activeChat.id] || '' : '';
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, [currentPrompt]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPrompt.trim() !== '' && !isLoading && activeChat) {
      onSubmit(currentPrompt);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleChange = (value) => {
    if (activeChat) {
      updateChatPrompt(activeChat.id, value);
    }
  };

  const handleClear = () => {
    if (activeChat) {
      updateChatPrompt(activeChat.id, '');
      textareaRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`relative rounded-xl border ${
        darkMode 
          ? 'border-primary-900 bg-primary-900 bg-opacity-20 shadow-inner shadow-primary-800' 
          : 'border-primary-200 bg-primary-50 shadow-sm'
      } overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500`}>
        {/* Command icon */}
        <div className="absolute left-3 top-3 text-gray-400">
          <CommandLineIcon className="h-5 w-5" />
        </div>
        
        {/* Textarea for input */}
        <textarea
          ref={textareaRef}
          value={currentPrompt}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Chat for help in security verification"
          rows="1"
          className={`block w-full resize-none border-0 bg-transparent py-3 px-4 pl-12 pr-24 focus:ring-0 ${
            darkMode ? 'text-white placeholder:text-primary-400' : 'text-gray-900 placeholder:text-primary-600'
          }`}
          disabled={isLoading}
        />
        
        {/* Action buttons */}
        <div className="absolute bottom-0 right-0 flex items-center space-x-1 p-2">
          {/* Clear button (only show when there's input) */}
          {currentPrompt && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 rounded-full ${
                darkMode 
                  ? 'text-primary-400 hover:text-primary-200 hover:bg-primary-700 hover:bg-opacity-50' 
                  : 'text-primary-600 hover:text-primary-700 hover:bg-primary-100'
              }`}
            >
              <XMarkIcon className="h-5 w-5" />
              <span className="sr-only">Clear input</span>
            </button>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !currentPrompt.trim()}
            className={`p-2 rounded-full transition-colors ${
              isLoading || !currentPrompt.trim()
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