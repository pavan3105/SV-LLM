import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  ShieldExclamationIcon, 
  QuestionMarkCircleIcon,
  CodeBracketIcon,
  ServerIcon,
  KeyIcon,
  LightBulbIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import MainLayout from '../components/layout/MainLayout';
import { useTheme } from '../context/ThemeContext';

const Help = () => {
  const { darkMode } = useTheme();
  
  // State for tracking which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    getting_started: true,
    usage_tips: false,
    api_connections: false,
    security_advice: false,
    faq: false
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Section header classes
  const sectionHeaderClasses = `flex items-center justify-between w-full p-4 text-left font-medium rounded-lg ${
    darkMode ? 'bg-dark-100 hover:bg-dark-200' : 'bg-gray-100 hover:bg-gray-200'
  }`;
  
  // Section content classes
  const sectionContentClasses = `p-4 pt-2 ${
    darkMode ? 'text-gray-300' : 'text-gray-700'
  }`;
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-4">
        <h1 className="text-2xl font-bold mb-2">Help Center</h1>
        <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Learn how to use SV-LLM and get the most out of our security-focused AI assistant.
        </p>
        
        <div className="space-y-4">
          {/* Getting Started Section */}
          <div className={`border rounded-lg overflow-hidden ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              className={sectionHeaderClasses}
              onClick={() => toggleSection('getting_started')}
            >
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3 text-primary-500" />
                <span>Getting Started</span>
              </div>
              {expandedSections.getting_started ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.getting_started && (
              <div className={sectionContentClasses}>
                <p className="mb-4">
                  SV-LLM is a security-focused AI assistant that helps you analyze and improve 
                  the security of your code, systems, and practices.
                </p>
                
                <h3 className="font-medium mb-2 mt-4">To get started:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <span className="font-medium">Configure your API key</span> - Go to the Settings 
                    page and enter your API key for the LLM provider you want to use.
                  </li>
                  <li>
                    <span className="font-medium">Select a model</span> - Choose from various 
                    available models depending on your needs.
                  </li>
                  <li>
                    <span className="font-medium">Start a conversation</span> - Ask security-related 
                    questions, submit code for review, or request assistance with security analysis.
                  </li>
                </ol>
                
                <h3 className="font-medium mb-2 mt-4">Examples of what you can do:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Analyze code for security vulnerabilities</li>
                  <li>Get advice on implementing security best practices</li>
                  <li>Understand potential threats and attack vectors</li>
                  <li>Learn about secure coding techniques</li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Usage Tips Section */}
          <div className={`border rounded-lg overflow-hidden ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              className={sectionHeaderClasses}
              onClick={() => toggleSection('usage_tips')}
            >
              <div className="flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-3 text-yellow-500" />
                <span>Usage Tips</span>
              </div>
              {expandedSections.usage_tips ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.usage_tips && (
              <div className={sectionContentClasses}>
                <h3 className="font-medium mb-2">Tips for effective conversations:</h3>
                
                <div className="space-y-4 mt-3">
                  <div className="p-3 rounded-lg bg-opacity-10 border-l-4 border-blue-500 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20">
                    <h4 className="font-medium text-blue-700 dark:text-blue-400">Be specific</h4>
                    <p className="text-sm mt-1">
                      The more specific your question or request, the more precise the response will be. 
                      Include relevant details like programming language, framework, or environment.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-opacity-10 border-l-4 border-green-500 bg-green-100 dark:bg-green-900 dark:bg-opacity-20">
                    <h4 className="font-medium text-green-700 dark:text-green-400">Include code samples</h4>
                    <p className="text-sm mt-1">
                      When discussing code-related security issues, include the relevant code 
                      snippets to allow for more concrete analysis and recommendations.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-opacity-10 border-l-4 border-purple-500 bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20">
                    <h4 className="font-medium text-purple-700 dark:text-purple-400">Ask for explanations</h4>
                    <p className="text-sm mt-1">
                      If you don't understand a security concept or recommendation, ask for 
                      clarification. The AI can provide simpler explanations or additional context.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-opacity-10 border-l-4 border-amber-500 bg-amber-100 dark:bg-amber-900 dark:bg-opacity-20">
                    <h4 className="font-medium text-amber-700 dark:text-amber-400">Use iterative conversations</h4>
                    <p className="text-sm mt-1">
                      Complex security issues are best addressed through back-and-forth discussion. 
                      Start with a general question, then refine with follow-up questions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* API Connections Section */}
          <div className={`border rounded-lg overflow-hidden ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              className={sectionHeaderClasses}
              onClick={() => toggleSection('api_connections')}
            >
              <div className="flex items-center">
                <KeyIcon className="h-5 w-5 mr-3 text-purple-500" />
                <span>API Connections</span>
              </div>
              {expandedSections.api_connections ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.api_connections && (
              <div className={sectionContentClasses}>
                <p className="mb-4">
                  SV-LLM supports multiple LLM providers. Here's how to set up your API connections:
                </p>
                
                <div className="space-y-4 mt-3">
                  <div className="p-3 rounded-lg bg-opacity-10 border border-gray-300 dark:border-gray-700">
                    <h4 className="font-medium mb-1">OpenAI (GPT-4, GPT-3.5 Turbo)</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                      <li>Create an account at <a href="https://platform.openai.com/" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">OpenAI</a></li>
                      <li>Generate an API key in your account settings</li>
                      <li>Enter the API key in the Settings page of SV-LLM</li>
                    </ol>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-opacity-10 border border-gray-300 dark:border-gray-700">
                    <h4 className="font-medium mb-1">Anthropic (Claude 3 models)</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                      <li>Create an account at <a href="https://console.anthropic.com/" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">Anthropic</a></li>
                      <li>Generate an API key in your account settings</li>
                      <li>Enter the API key in the Settings page of SV-LLM</li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-lg bg-opacity-10 border border-gray-300 dark:border-gray-700">
                  <h4 className="font-medium mb-1">Cohere (Command models)</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                    <li>Create an account at <a href="https://dashboard.cohere.com/api-keys" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">Cohere Dashboard</a></li>
                    <li>Generate an API key in the API Keys section</li>
                    <li>Enter the API key in the Settings page of SV-LLM</li>
                    </ol>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-opacity-10 border border-gray-300 dark:border-gray-700">
                    <h4 className="font-medium mb-1">Google (Gemini models)</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                      <li>Create an account at <a href="https://ai.google.dev/" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                      <li>Generate an API key in your account settings</li>
                      <li>Enter the API key in the Settings page of SV-LLM</li>
                    </ol>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Your API keys are stored locally in your browser and are never sent to our servers. 
                  All API calls are made directly from your browser to the respective provider.
                </p>
              </div>
            )}
          </div>
          
          {/* Security Advice Section */}
          <div className={`border rounded-lg overflow-hidden ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              className={sectionHeaderClasses}
              onClick={() => toggleSection('security_advice')}
            >
              <div className="flex items-center">
                <ShieldExclamationIcon className="h-5 w-5 mr-3 text-red-500" />
                <span>Security Advice</span>
              </div>
              {expandedSections.security_advice ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.security_advice && (
              <div className={sectionContentClasses}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Code Security</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Always validate and sanitize input from users</li>
                      <li>Use parameterized queries to prevent SQL injection</li>
                      <li>Implement proper authentication and authorization</li>
                      <li>Keep dependencies updated to avoid known vulnerabilities</li>
                      <li>Use secure defaults and fail securely</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Web Application Security</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use HTTPS for all communications</li>
                      <li>Implement proper CORS policies</li>
                      <li>Set secure HTTP headers</li>
                      <li>Protect against XSS and CSRF attacks</li>
                      <li>Implement proper session management</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Data Protection</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Encrypt sensitive data at rest and in transit</li>
                      <li>Implement proper access controls</li>
                      <li>Regularly backup important data</li>
                      <li>Be mindful of data retention policies</li>
                      <li>Follow relevant regulations (GDPR, CCPA, etc.)</li>
                    </ul>
                  </div>
                </div>
                
                <p className="mt-4 text-sm">
                  For more detailed security advice specific to your application or system, 
                  ask in the chat window and our AI will provide context-aware recommendations.
                </p>
              </div>
            )}
          </div>
          
          {/* FAQ Section */}
          <div className={`border rounded-lg overflow-hidden ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              className={sectionHeaderClasses}
              onClick={() => toggleSection('faq')}
            >
              <div className="flex items-center">
                <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-green-500" />
                <span>Frequently Asked Questions</span>
              </div>
              {expandedSections.faq ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.faq && (
              <div className={sectionContentClasses}>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-3 rounded-lg bg-opacity-5 border border-gray-300 dark:border-gray-700">
                      <h4 className="font-medium">{faq.question}</h4>
                      <p className="text-sm mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Contact Support */}
        <div className={`mt-8 p-6 rounded-lg bg-opacity-10 border ${
          darkMode ? 'bg-primary-900 border-primary-800' : 'bg-primary-50 border-primary-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-primary-400' : 'text-primary-800'
          }`}>
            Need more help?
          </h2>
          <p className="mb-4">
            If you can't find the information you need, reach out to our support team.
          </p>
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => window.location.href = 'mailto:support@sv-llm.com'}
          >
            Contact Support
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

// FAQ data
const faqs = [
  {
    question: "Is my code secure when I submit it to SV-LLM?",
    answer: "Yes. Your code is only sent to the selected LLM provider (e.g., OpenAI) using your own API key. We don't store your code on our servers or share it with third parties."
  },
  {
    question: "Which model should I choose for the best security analysis?",
    answer: "For the most comprehensive security analysis, we recommend GPT-4 or Claude 3 Opus, as they have the most advanced reasoning capabilities. For simpler tasks or faster responses, GPT-3.5 Turbo or Claude 3 Sonnet may be sufficient."
  },
  {
    question: "How accurate is the security advice provided by SV-LLM?",
    answer: "While SV-LLM provides valuable security insights based on current best practices, it should be used as a supplementary tool, not a replacement for professional security audits. Always validate critical security decisions with security experts."
  },
  {
    question: "Can I export my chat history for documentation?",
    answer: "Currently, chat history is stored locally in your browser. We plan to add export functionality in a future update to allow you to save your security analysis discussions."
  },
  {
    question: "Does SV-LLM support languages other than English?",
    answer: "The underlying LLM models support multiple languages, but the SV-LLM interface is currently only available in English. We plan to add additional language support in future updates."
  },
  {
    question: "How can I report a bug or request a feature?",
    answer: "You can report bugs or request features by contacting our support team at support@sv-llm.com or by opening an issue on our GitHub repository."
  }
];

export default Help;