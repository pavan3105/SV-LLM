import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useTheme } from '../../context/ThemeContext';

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
  
useEffect(() => {
  if (message.content) {
    try {
      if (!isUser) {
        let processedContent = message.content;
        
        processedContent = processedContent.replace(/^(\s*)(\*|-)\s+/gm, (match, spaces, bullet) => {
          const level = Math.floor(spaces.length / 2);
          return `${'  '.repeat(level)}${bullet} `;
        });
        
        processedContent = processedContent.replace(/^([A-Za-z0-9\s]+):\s*$/gm, '**$1:**');
        
        processedContent = processedContent.replace(/^(\s*)(\*|-)\s+([A-Za-z0-9\s]+):\s*/gm, 
          '$1$2 **$3:** ');
        
        processedContent = processedContent.replace(/^(\d+)\.\s+/gm, '$1. ');
        
        processedContent = processedContent.replace(/^(\s*)(\*|-)\s{2,}/gm, '$1$2 ');
        
        const html = md.render(processedContent);
        
        setRenderedContent(html);
      } else {
        setRenderedContent(md.render(message.content));
      }
    } catch (error) {
      console.error("Markdown rendering error:", error);
      setRenderedContent(`<p>${message.content}</p>`);
    }
  }
}, [message.content, isUser]);

  // Bubble style based on sender and theme
  const bubbleClasses = isUser
    ? `bg-primary-600 text-white rounded-t-2xl rounded-bl-2xl`
    : darkMode 
      ? `bg-dark-100 text-gray-100 rounded-t-2xl rounded-br-2xl border border-gray-700` 
      : `bg-gray-100 text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-200`;

  return (
    <div className={`px-4 py-3 ${bubbleClasses} shadow-sm`}>
      <div 
        className="prose custom-bullets dark:prose-invert max-w-none prose-pre:bg-gray-800 dark:prose-pre:bg-black prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-li:my-1.5 prose-p:my-2.5 prose-headings:mt-5 prose-headings:mb-3 prose-strong:font-bold"
        dangerouslySetInnerHTML={{ __html: renderedContent }} 
      />
    </div>
  );
};

export default ChatBubble;