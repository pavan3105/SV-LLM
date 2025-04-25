import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
// Import the utility function for cleaning SVA content
import { cleanSVAContent } from '../../utils/messageFormatter';

/**
 * Component to display generated security properties and SVA file
 * with download functionality - improved layout
 */
const SecurityPropertyDisplay = ({ svaContent, fileName = 'security_properties.sva' }) => {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  // State for cleaned SVA content
  const [cleanedContent, setCleanedContent] = useState('');

  // Process and clean the SVA content
  useEffect(() => {
    if (svaContent) {
      // Use the utility function to clean SVA content
      setCleanedContent(cleanSVAContent(svaContent));
    }
  }, [svaContent]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Handle file download
  const handleDownload = () => {
    if (!cleanedContent) {
      console.error("Cannot download: SVA content is empty");
      return;
    }
    
    try {
      const blob = new Blob([cleanedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (!cleanedContent) return;
    
    navigator.clipboard.writeText(cleanedContent).then(() => {
      setCopied(true);
    }).catch(err => {
      console.error("Failed to copy text:", err);
    });
  };

  if (!cleanedContent) {
    return null;
  }

  return (
    <div className={`mt-4 mx-1 rounded-lg border overflow-hidden sva-display security-property-box ${
      darkMode ? 'border-gray-700' : 'border-gray-300'
    }`}>
      {/* Header with title and buttons */}
      <div className={`flex items-center justify-between px-4 py-3 ${
        darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-300'
      }`}>
        <div className="flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-500" />
          <h3 className="font-medium">Generated Security Properties</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${
              darkMode 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Download .sva
          </button>
        </div>
      </div>
      
      {/* SVA Content - improved layout with code-scrollbar class */}
      <pre className={`p-4 overflow-auto max-h-96 text-sm leading-snug code-scrollbar ${
        darkMode ? 'bg-dark-100 text-gray-300' : 'bg-gray-50 text-gray-800'
      }`}>
        {cleanedContent}
      </pre>
      
      {/* Footer download button */}
      <div className={`p-3 text-center border-t ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'
      }`}>
        <button
          onClick={handleDownload}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center mx-auto download-button ${
            darkMode 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Download Security Properties (.sva)
        </button>
      </div>
    </div>
  );
};

export default SecurityPropertyDisplay;