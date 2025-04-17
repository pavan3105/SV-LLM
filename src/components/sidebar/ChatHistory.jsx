import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ChatBubbleLeftRightIcon, 
  TrashIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldExclamationIcon,
  BugAntIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks/useChat';

const ChatHistory = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { 
    chatHistory, 
    activeChat, 
    selectChat, 
    deleteChat,
    renameChatTitle 
  } = useChat();

  // State to track which chat is being edited
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const getChatIcon = (title) => {
    title = title.toLowerCase();
    if (title.includes('threat') || title.includes('security') || title.includes('vulnerability')) {
      return <ShieldExclamationIcon className="h-5 w-5 flex-shrink-0" />;
    } else if (title.includes('bug') || title.includes('fix') || title.includes('issue')) {
      return <BugAntIcon className="h-5 w-5 flex-shrink-0" />;
    } else if (title.includes('code') || title.includes('function') || title.includes('api')) {
      return <CodeBracketIcon className="h-5 w-5 flex-shrink-0" />;
    }
    return <ChatBubbleLeftRightIcon className="h-5 w-5 flex-shrink-0" />;
  };

  const handleSelectChat = (chatId) => {
    selectChat(chatId);
    navigate('/');
  };

  const startEditing = (chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title || 'Untitled Chat');
  };

  const handleSaveTitle = () => {
    if (editingChatId && editTitle.trim()) {
      renameChatTitle(editingChatId, editTitle.trim());
      setEditingChatId(null);
    }
  };

  const handleCancelEditing = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditing();
    }
  };

  if (chatHistory.length === 0) {
    return (
      <div className={`p-6 text-center rounded-lg border ${
        darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
      }`}>
        <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <h3 className="text-sm font-medium mb-1">No chat history yet</h3>
        <p className="text-xs">Your conversations will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
        Recent Conversations
      </h3>
      
      <div className="space-y-2">
        {chatHistory.map((chat) => {
          const isActive = activeChat && activeChat.id === chat.id;
          const isEditing = editingChatId === chat.id;
          
          return (
            <div 
              key={chat.id} 
              className={`group relative flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? darkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                if (!isEditing) {
                  handleSelectChat(chat.id);
                }
              }}
            >
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <div className={`mt-0.5 ${
                  isActive
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {getChatIcon(chat.title || '')}
                </div>
                
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        className={`w-full px-2 py-1 rounded ${
                          darkMode 
                            ? 'bg-dark-100 border border-gray-700 text-white' 
                            : 'bg-white border border-gray-300 text-gray-900'
                        }`}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveTitle();
                        }}
                        className={`p-1 rounded-full ${
                          darkMode 
                            ? 'text-green-400 hover:bg-green-900' 
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEditing();
                        }}
                        className={`p-1 rounded-full ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-900' 
                            : 'text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {chat.title || 'Untitled Chat'}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(chat);
                        }}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded-full transition-opacity ${
                          darkMode 
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-label="Edit chat title"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {format(new Date(chat.lastUpdated), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  aria-label="Delete chat"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatHistory;