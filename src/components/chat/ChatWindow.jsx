import React, { useRef, useEffect, useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import MissingInputsForm from './MissingInputsForm';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../hooks/useChat';

const ChatWindow = ({
  messages,
  onSendMessage,
  onProvideFeedback,
  selectedModel,
  activeChatId 
}) => {
  const { darkMode } = useTheme();
  const { isLoading } = useChat(); // Get the isLoading function from context
  const messagesEndRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [missingInputs, setMissingInputs] = useState(null);

  
  const isChatLoading = isLoading(activeChatId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (text) => {
    if (text.trim() === '') return;
    onSendMessage(text)
      .catch(error => {
        // Check if the error indicates missing inputs
        if (error.response?.data?.status === 'missing_inputs') {
          setMissingInputs(error.response.data.required_inputs);
        }
      });
    setPrompt('');
  };

  const handleMissingInputsSubmit = (inputs) => {
    setMissingInputs(null);
    
    // Format the inputs into a string to append to the query
    const inputsText = Object.entries(inputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    // Create an updated query with the additional information
    const updatedPrompt = `${prompt}\n\nAdditional Information:\n${inputsText}`;
    
    // Send the updated query
    handleSubmit(updatedPrompt);
  };

  const emptyState = messages.length === 0 && !isChatLoading;

  return (
    <div className={`h-full flex flex-col rounded-lg overflow-hidden ${darkMode ? 'bg-dark-200' : 'bg-white'} shadow-lg`}>
      {/* Message area */}
      <div className="flex-1 overflow-y-auto">
        {emptyState ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Welcome to SV-LLM</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              Your security-focused AI assistant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className={`p-4 text-left rounded-lg transition-all ${
                    darkMode 
                      ? 'bg-dark-100 hover:bg-dark-400 border border-gray-700' 
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}
                  onClick={() => setPrompt(prompt.text)}
                >
                  <h3 className="font-medium mb-1">{prompt.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            onProvideFeedback={onProvideFeedback} 
          />
        )}
        
        {/* Loading indicator */}
        {isChatLoading && (
          <div className="px-4 py-2">
            <LoadingIndicator model={selectedModel} />
          </div>
        )}
        
        {/* Missing inputs form */}
        {missingInputs && (
          <div className="px-4 py-2">
            <MissingInputsForm 
              missingInputs={missingInputs}
              onSubmit={handleMissingInputsSubmit}
            />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <ChatInput 
          onSubmit={handleSubmit} 
          isLoading={isChatLoading}
          value={prompt}
          onChange={setPrompt}
        />
      </div>
    </div>
  );
};

const suggestedPrompts = [
  {
    title: "Security Analysis",
    description: "Get insights on the security of your system",
    text: "Can you analyze the security implications of a microservice architecture with a shared API gateway and service-to-service communication?"
  },
  {
    title: "Code Security Review",
    description: "Review code for security issues",
    text: "Review this authentication function for security vulnerabilities:\n\nfunction authenticate(username, password) {\n  const user = db.findUser(username);\n  if (user && user.password === password) {\n    return generateToken(user);\n  }\n  return null;\n}"
  },
  {
    title: "Security Best Practices",
    description: "Learn about security best practices",
    text: "What are the best practices for securely storing user credentials in a web application?"
  },
  {
    title: "Fix Security Issues",
    description: "Get help improving your code's security",
    text: "How can I fix this potentially vulnerable code in my Node.js application?\n\napp.get('/users', (req, res) => {\n  const userId = req.query.id;\n  const query = `SELECT * FROM users WHERE id = ${userId}`;\n  db.query(query, (err, results) => {\n    res.json(results);\n  });\n});"
  }
];

export default ChatWindow;