import React from 'react';
import ChatBubble from './ChatBubble';
import FeedbackButtons from './FeedbackButtons';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const MessageList = ({ messages, onProvideFeedback }) => {
  const { darkMode } = useTheme();
  
  // Group messages by sender
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    
    // Start a new group if this is the first message or the sender changed
    if (!prevMessage || prevMessage.role !== message.role) {
      acc.push([message]);
    } else {
      // Add to the existing group if the sender is the same
      acc[acc.length - 1].push(message);
    }
    
    return acc;
  }, []);

  return (
    <div className="flex flex-col space-y-8 py-6 px-4 md:px-6">
      {groupedMessages.map((group, groupIndex) => {
        const isUser = group[0].role === 'user';
        
        return (
          <div key={groupIndex} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[90%] md:max-w-[85%]`}>
              {/* Avatar */}
              <div className={`flex flex-col items-center mr-3 ${isUser ? 'ml-3 mr-0' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isUser 
                    ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300' 
                    : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300'
                }`}>
                  {isUser 
                    ? <UserCircleIcon className="w-8 h-8" />
                    : <ShieldCheckIcon className="w-6 h-6" />
                  }
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  isUser 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-cyan-600 dark:text-cyan-400'
                }`}>
                  {isUser ? 'You' : 'SV-LLM'}
                </div>
              </div>
              
              {/* Message content */}
              <div className="flex flex-col space-y-2">
                {group.map((message, msgIndex) => (
                  <ChatBubble 
                    key={message.id || msgIndex} 
                    message={message}
                    isUser={isUser}
                  />
                ))}
                
                {/* Feedback buttons (only for assistant messages) */}
                {!isUser && group.length > 0 && (
                  <div className="mt-2">
                    <FeedbackButtons 
                      messageId={group[group.length - 1].id}
                      onProvideFeedback={onProvideFeedback}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;