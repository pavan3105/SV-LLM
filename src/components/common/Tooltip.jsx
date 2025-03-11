import React, { useState } from 'react';

/**
 * Simple tooltip component
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  
  // Position styles
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  // Arrow styles
  const arrows = {
    top: 'left-1/2 -translate-x-1/2 -bottom-1 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800',
    bottom: 'left-1/2 -translate-x-1/2 -top-1 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-800',
    left: 'top-1/2 -translate-y-1/2 -right-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 dark:border-l-gray-800',
    right: 'top-1/2 -translate-y-1/2 -left-1 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900 dark:border-r-gray-800',
  };
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    // Clear any existing timeout to avoid flickering
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    // Set timeout to show tooltip after delay
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    // Clear the timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    setIsVisible(false);
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip trigger */}
      {children}
      
      {/* Tooltip content */}
      {isVisible && content && (
        <div 
          className={`absolute z-50 whitespace-nowrap rounded px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-800 ${positions[position]} ${className}`}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrows[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;