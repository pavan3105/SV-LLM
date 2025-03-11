import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ContextWindowSlider = ({ value, onChange, min, max, step }) => {
  const { darkMode } = useTheme();
  const [localValue, setLocalValue] = useState(value);
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Handle slider change
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
  };
  
  // Update parent state on slider release
  const handleSliderRelease = () => {
    onChange(localValue);
  };
  
  // Format tokens as K (thousands)
  const formatTokens = (tokens) => {
    return `${tokens >= 1000 ? tokens / 1000 : tokens}${tokens >= 1000 ? 'K' : ''}`;
  };
  
  // Calculate percentage for slider background
  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {formatTokens(localValue)} tokens
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const newValue = Math.max(min, localValue - step);
              setLocalValue(newValue);
              onChange(newValue);
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={localValue <= min}
          >
            -
          </button>
          
          <button
            onClick={() => {
              const newValue = Math.min(max, localValue + step);
              setLocalValue(newValue);
              onChange(newValue);
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={localValue >= max}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              ${darkMode ? '#3b82f6' : '#2563eb'} 0%, 
              ${darkMode ? '#3b82f6' : '#2563eb'} ${percentage}%, 
              ${darkMode ? '#374151' : '#d1d5db'} ${percentage}%, 
              ${darkMode ? '#374151' : '#d1d5db'} 100%)`,
          }}
        />
      </div>
      
      {/* Token scale */}
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{formatTokens(min)}</span>
        <span>{formatTokens((min + max) / 2)}</span>
        <span>{formatTokens(max)}</span>
      </div>
    </div>
  );
};

export default ContextWindowSlider;