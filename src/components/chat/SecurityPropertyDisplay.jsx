import React, { useState, useEffect } from 'react';
//import { DownloadIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'


/**
 * Component to display generated security properties and SVA file
 * with download functionality
 */
const SecurityPropertyDisplay = ({ svaContent, fileName = 'security_properties.sva' }) => {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Handle file download
  const handleDownload = () => {
    const blob = new Blob([svaContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(svaContent).then(() => {
      setCopied(true);
    });
  };

  if (!svaContent) {
    return null;
  }

  return (
    <div className={`mt-4 rounded-lg border overflow-hidden ${
      darkMode ? 'border-gray-700' : 'border-gray-300'
    }`}>
      {/* Header */}
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
      
      {/* SVA Content */}
      <pre className={`p-4 overflow-auto max-h-96 text-sm ${
        darkMode ? 'bg-dark-100 text-gray-300' : 'bg-gray-50 text-gray-800'
      }`}>
        {svaContent}
      </pre>
    </div>
  );
};

export default SecurityPropertyDisplay;