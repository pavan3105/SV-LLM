import React, { useState } from 'react';
import { 
  KeyIcon, 
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  BugAntIcon,
  CodeBracketIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';
import ModelSelector from './ModelSelector';
import ApiKeyInput from './ApiKeyInput';
import ContextWindowSlider from './ContextWindowSlider';
import { useTheme } from '../../context/ThemeContext';
import { useConfig } from '../../context/ConfigContext';

const ConfigPanel = () => {
  const { darkMode } = useTheme();
  const { 
    selectedModel, 
    setSelectedModel,
    apiKey, 
    setApiKey,
    contextWindow, 
    setContextWindow,
    enabledAgents,
    toggleAgent
  } = useConfig();
  
  const [showApiKey, setShowApiKey] = useState(false);

  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="space-y-6">
      {/* Section: Model Selection */}
      <div>
        <h3 className="flex items-center text-sm font-medium mb-3">
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          Model Selection
        </h3>
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={setSelectedModel} 
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Choose the AI model that best fits your security needs and performance requirements.
        </p>
      </div>
      
      {/* Section: API Key */}
      <div>
        <h3 className="flex items-center text-sm font-medium mb-3">
          <KeyIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          API Key
        </h3>
        <div className="relative">
          <ApiKeyInput 
            apiKey={apiKey} 
            onApiKeyChange={setApiKey}
            showApiKey={showApiKey}
          />
          <button
            type="button"
            onClick={toggleApiKeyVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showApiKey ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Your API key is stored locally and never sent to our servers.
        </p>
      </div>
      
      {/* Section: Context Window */}
      <div>
        <h3 className="flex items-center text-sm font-medium mb-3">
          <InformationCircleIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          Context Window
        </h3>
        <ContextWindowSlider 
          value={contextWindow} 
          onChange={setContextWindow} 
          min={1024} 
          max={32768} 
          step={1024}
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Control how much conversation history is sent to the model. Larger values provide more context but may be slower and more expensive.
        </p>
      </div>
    </div>
  );
};

// Security agent definitions
const securityAgents = [
  {
    id: 'threat-modeling',
    name: 'Threat Modeling',
    description: 'Analyzes potential security threats and attack vectors',
    icon: ShieldCheckIcon,
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
  {
    id: 'bug-detection',
    name: 'Bug Detection',
    description: 'Identifies security bugs and vulnerabilities in code',
    icon: ({className}) => <BugAntIcon className={className} />,
    iconColor: 'text-danger-600 dark:text-danger-400',
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Reviews code for security best practices',
    icon: ({className}) => <CodeBracketIcon className={className} />,
    iconColor: 'text-secondary-600 dark:text-secondary-400',
  },
  {
    id: 'bug-repair',
    name: 'Bug Repair',
    description: 'Suggests fixes for identified security issues',
    icon: ({className}) => <WrenchIcon className={className} />,
    iconColor: 'text-success-600 dark:text-success-400',
  },
];

export default ConfigPanel;