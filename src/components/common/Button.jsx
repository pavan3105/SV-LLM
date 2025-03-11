import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Reusable Button component with various styles and sizes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const { darkMode } = useTheme();
  
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-3',
    xl: 'text-lg px-6 py-3.5',
  };
  
  // Variant classes
  const variantClasses = {
    primary: `${darkMode 
      ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500' 
      : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
    }`,
    secondary: `${darkMode 
      ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
    }`,
    outline: `${darkMode 
      ? 'border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500' 
      : 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    }`,
    danger: `${darkMode 
      ? 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500' 
      : 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500'
    }`,
    success: `${darkMode 
      ? 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500' 
      : 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500'
    }`,
    ghost: `${darkMode 
      ? 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white' 
      : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`,
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : ''}
        ${widthClass}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;