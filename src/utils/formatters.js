import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a date to a readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format string (default: 'MMM d, yyyy h:mm a')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatString = 'MMM d, yyyy h:mm a') => {
  if (!date) return '';
  
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date as relative time (e.g., '5 minutes ago')
 * @param {string|Date} date - Date to format
 * @param {Object} options - Options for formatDistanceToNow
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date, options = { addSuffix: true }) => {
  if (!date) return '';
  
  try {
    return formatDistanceToNow(new Date(date), options);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Format a number with thousand separators
 * @param {number} number - Number to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - Formatted number
 */
export const formatNumber = (number, options = {}) => {
  if (number === undefined || number === null) return '';
  
  try {
    return new Intl.NumberFormat('en-US', options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(number);
  }
};

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted size (e.g., '1.5 MB')
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Truncate text to a certain length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= length) return text;
  
  return text.substring(0, length).trim() + suffix;
};