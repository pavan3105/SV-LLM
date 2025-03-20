import React from 'react';
import ChatBubble from './ChatBubble';
import FeedbackButtons from './FeedbackButtons';
import { useTheme } from '../../context/ThemeContext';

const MessageList = ({ messages, onProvideFeedback }) => {
  const { darkMode } = useTheme();
  
  
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    
   
    if (!prevMessage || prevMessage.role !== message.role) {
      acc.push([message]);
    } else {
      
      acc[acc.length - 1].push(message);
    }
    
    return acc;
  }, []);

  return (
    <div className="flex flex-col space-y-6 py-4 px-4 md:px-6">
      {groupedMessages.map((group, groupIndex) => {
        const isUser = group[0].role === 'user';
        
        return (
          <div key={groupIndex} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            {/* Sender label */}
            <div className={`text-xs font-medium mb-2 ${
              isUser ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-600 dark:text-secondary-400'
            }`}>
              {isUser ? 'You' : 'SV-LLM'}
            </div>
            
            {/* Message bubbles */}
            <div className="flex flex-col space-y-2 max-w-[85%]">
              {group.map((message, msgIndex) => (
                <ChatBubble 
                  key={message.id || msgIndex} 
                  message={message}
                  isUser={isUser}
                />
              ))}
            </div>
            
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
        );
      })}
    </div>
  );
};

export default MessageList;