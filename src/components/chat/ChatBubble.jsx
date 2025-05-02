// Update to ChatBubble.jsx to properly extract and display threat modeling results

import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useTheme } from '../../context/ThemeContext';
import SecurityPropertyDisplay from './SecurityPropertyDisplay';
// Import the utility functions
import { extractSVAContent, formatTextContent, formatCodeBlocks } from '../../utils/messageFormatter';
import ThreatModelingResultsDisplay from './ThreatModelingResultsDisplay';

// Initialize markdown parser with enhanced settings
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true, // Enable line breaks
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (error) {
        console.error("Highlight error:", error);
      }
    }
    return ''; // use external default escaping
  }
});

const ChatBubble = ({ message, isUser }) => {
  const { darkMode } = useTheme();
  const [renderedContent, setRenderedContent] = useState('');
  
  // State for SVA content if present
  const [svaContent, setSvaContent] = useState(null);
  // State for threat modeling results
  const [threatModelingResults, setThreatModelingResults] = useState(null);
  
  useEffect(() => {
    if (message.content) {
      try {
        // Extract threat modeling results from JSON in the content
        let contentWithoutResults = message.content;
        
        // Check for threat modeling results in various formats
        // First try looking for a JSON code block with threatModelingResults
        const jsonBlockRegex = /```json\n([\s\S]*?)\n```/;
        const jsonMatch = message.content.match(jsonBlockRegex);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const jsonData = JSON.parse(jsonMatch[1]);
            if (jsonData.threatModelingResults) {
              setThreatModelingResults(jsonData.threatModelingResults);
              // Remove the JSON block from the content
              contentWithoutResults = message.content.replace(jsonMatch[0], '');
            }
          } catch (jsonError) {
            console.error("Error parsing threat modeling results from JSON block:", jsonError);
          }
        }
        
        // If not found in a JSON code block, try other formats
        if (!threatModelingResults) {
          // Try to find threatModelingResults in a more free-form format
          const threatModelingMatch = contentWithoutResults.match(/\{?\s*"threatModelingResults"\s*:\s*(\{[\s\S]*?\})\s*\}?/);
          if (threatModelingMatch && threatModelingMatch[1]) {
            try {
              // Try parsing just the results object
              const resultsObject = JSON.parse(threatModelingMatch[1]);
              setThreatModelingResults(resultsObject);
              // Remove the results from the content
              contentWithoutResults = contentWithoutResults.replace(threatModelingMatch[0], '');
            } catch (innerJsonError) {
              // Try parsing the whole match as a JSON object
              try {
                const fullObject = JSON.parse(`{${threatModelingMatch[0]}}`);
                if (fullObject.threatModelingResults) {
                  setThreatModelingResults(fullObject.threatModelingResults);
                  // Remove the results from the content
                  contentWithoutResults = contentWithoutResults.replace(threatModelingMatch[0], '');
                }
              } catch (fullJsonError) {
                console.error("Error parsing threat modeling results:", fullJsonError);
              }
            }
          }
        }
        
        // Use the utility function to extract SVA content
        const { svaContent, contentWithoutSva } = extractSVAContent(contentWithoutResults.trim());
        setSvaContent(svaContent);
        
        // Process the remaining content using formatting utilities
        let processedContent = contentWithoutSva;
        
        if (!isUser) {
          // Use the formatTextContent utility to clean up the text
          processedContent = formatTextContent(processedContent);
          
          // Use the formatCodeBlocks utility to improve code block display
          processedContent = formatCodeBlocks(processedContent);
          
          // Render the markdown
          const html = md.render(processedContent);
          setRenderedContent(html);
        } else {
          setRenderedContent(md.render(processedContent));
        }
      } catch (error) {
        console.error("Markdown rendering error:", error);
        setRenderedContent(`<p>${message.content}</p>`);
      }
    }
  }, [message.content, isUser]);

  // Redesigned bubble style based on sender and theme
  const bubbleClasses = isUser
    ? `bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-none rounded-br-2xl shadow-md`
    : darkMode 
      ? `bg-gradient-to-br from-dark-100 to-dark-200 text-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none border-l-4 border-cyan-600 shadow-md` 
      : `bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none border-l-4 border-cyan-600 shadow-md`;

  return (
    <div>
      <div className={`px-6 py-4 ${bubbleClasses}`}>
        <div 
          className="prose custom-bullets dark:prose-invert max-w-none prose-pre:bg-gray-800 dark:prose-pre:bg-black prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-li:my-1.5 prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: renderedContent }} 
        />
      </div>
      
      {/* Render SVA display component if svaContent exists */}
      {svaContent && !isUser && (
        <SecurityPropertyDisplay 
          svaContent={svaContent} 
          fileName="security_properties.sva" 
        />
      )}
      
      {/* Render threat modeling results if available */}
      {!isUser && threatModelingResults && (
        <ThreatModelingResultsDisplay results={threatModelingResults} />
      )}
    </div>
  );
};

export default ChatBubble;