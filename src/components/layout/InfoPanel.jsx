import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ChevronRightIcon, 
  InformationCircleIcon, 
  BookOpenIcon,
  ShieldCheckIcon,
  BugAntIcon,
  CodeBracketIcon,
  CommandLineIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const InfoPanel = ({ isOpen, toggleInfoPanel }) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('usage');

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-72 flex flex-col border-l md:relative ${
        darkMode ? 'bg-dark-200 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
      } z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:z-0 overflow-hidden`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h2 className="text-lg font-medium">Information</h2>
        <button 
          onClick={toggleInfoPanel}
          className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'usage'
              ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('usage')}
        >
          Usage
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'about'
              ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'usage' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">How to Use SV-LLM</h3>
            
            {usageGuides.map((guide, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <guide.icon className={`h-5 w-5 ${guide.iconColor}`} />
                  <h4 className="font-medium">{guide.title}</h4>
                </div>
                <p className="text-sm ml-7 text-gray-600 dark:text-gray-300">
                  {guide.description}
                </p>
                {guide.examples && (
                  <div className="ml-7 mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Examples:</p>
                    <ul className="space-y-1">
                      {guide.examples.map((example, i) => (
                        <li 
                          key={i} 
                          className={`text-xs p-2 rounded-md ${
                            darkMode ? 'bg-dark-100' : 'bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start">
                            <ChevronRightIcon className="h-3 w-3 mt-0.5 mr-1 text-primary-500" />
                            <span>{example}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">About SV-LLM</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                SV-LLM is a security-focused AI assistant designed to help developers, security professionals, and researchers with security verification, threat modeling, bug detection, and repair.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <ul className="space-y-2 text-sm">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <feature.icon className={`h-5 w-5 mt-0.5 mr-2 ${feature.iconColor}`} />
                    <span className="text-gray-600 dark:text-gray-300">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Privacy & Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                SV-LLM prioritizes your privacy. Your code and API keys remain on your device and are not stored on our servers. All API calls are made directly from your browser to the LLM provider.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Contact & Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For support, feature requests, or to report issues, please contact us at support@sv-llm.com or visit our GitHub repository.
              </p>
              <div className="flex mt-2 space-x-3">
                <button className={`text-xs px-3 py-1 rounded ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}>
                  Documentation
                </button>
                <button className={`text-xs px-3 py-1 rounded ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Features list for About tab
const features = [
  {
    description: 'Intelligent security analysis of systems and code',
    icon: ShieldCheckIcon,
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
  {
    description: 'Advanced code understanding and security review capabilities',
    icon: CodeBracketIcon,
    iconColor: 'text-secondary-600 dark:text-secondary-400',
  },
  {
    description: 'Context-aware security recommendations',
    icon: LightBulbIcon,
    iconColor: 'text-success-600 dark:text-success-400',
  },
  {
    description: 'Support for multiple LLM providers (OpenAI, Anthropic, Google, xAI)',
    icon: CommandLineIcon,
    iconColor: 'text-warning-600 dark:text-warning-400',
  },
];

// Usage guides
const usageGuides = [
  {
    title: 'Ask Security Questions',
    description: 'Get information and advice about security concepts, best practices, and standards.',
    icon: ShieldCheckIcon,
    iconColor: 'text-primary-600 dark:text-primary-400',
    examples: [
      'What are the security implications of using JWT for authentication?',
      'Explain the OWASP Top 10 vulnerabilities for 2023.',
    ],
  },
  {
    title: 'Analyze Systems and Architecture',
    description: 'Get insights on potential security risks in your system design.',
    icon: ShieldCheckIcon,
    iconColor: 'text-warning-600 dark:text-warning-400',
    examples: [
      'Review the security of this architecture for a payment processing system.',
      'What security considerations should I have for my cloud-based application?'
    ],
  },
  {
    title: 'Review and Fix Code',
    description: 'Submit code for security analysis and get recommendations for improvement.',
    icon: CodeBracketIcon,
    iconColor: 'text-secondary-600 dark:text-secondary-400',
    examples: [
      'Check this authentication function for security vulnerabilities.',
      'How can I fix this potential SQL injection in my code?'
    ],
  },
  {
    title: 'Learn Security Techniques',
    description: 'Discover methods and approaches for improving application security.',
    icon: LightBulbIcon,
    iconColor: 'text-success-600 dark:text-success-400',
    examples: [
      'What are secure password storage practices?',
      'How should I implement secure API authentication?'
    ],
  },
];

export default InfoPanel;