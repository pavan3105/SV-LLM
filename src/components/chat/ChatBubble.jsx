import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useTheme } from '../../context/ThemeContext';

// Initialize markdown parser with syntax highlighting
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
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
  
  // Process message content when message changes
  useEffect(() => {
    if (message.content) {
      try {
        // Render markdown to HTML
        const html = md.render(message.content);
        setRenderedContent(html);
      } catch (error) {
        console.error("Markdown rendering error:", error);
        setRenderedContent(`<p>${message.content}</p>`);
      }
    }
  }, [message.content]);

  // Bubble style based on sender and theme
  const bubbleClasses = isUser
    ? `bg-primary-600 text-white rounded-t-2xl rounded-bl-2xl`
    : darkMode 
      ? `bg-dark-100 text-gray-100 rounded-t-2xl rounded-br-2xl border border-gray-700` 
      : `bg-gray-100 text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-200`;

  return (
    <div className={`px-4 py-3 ${bubbleClasses} shadow-sm`}>
      <div 
        className="prose dark:prose-invert max-w-none prose-pre:bg-gray-800 dark:prose-pre:bg-black prose-code:text-pink-600 dark:prose-code:text-pink-400"
        dangerouslySetInnerHTML={{ __html: renderedContent }} 
      />
    </div>
  );
};

export default ChatBubble;