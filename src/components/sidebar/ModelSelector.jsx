import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useTheme } from '../../context/ThemeContext';

// Available models
const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable GPT model for complex tasks' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and cost-effective for most tasks' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most powerful Claude model for complex tasks' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance and efficiency' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Google\'s advanced reasoning model' },
  { id: 'grok-1', name: 'Grok-1', provider: 'xAI', description: 'Real-time knowledge and witty responses' },
  { id: 'cohere', name: 'Cohere', provider: 'CohereAI', description: 'Chat with Cohere' },
  { id: 'cohere-command', name: 'Command', provider: 'CohereAI', description: 'Flagship model for complex reasoning' },
  { id: 'cohere-command-light', name: 'Command Light', provider: 'CohereAI', description: 'Faster, more efficient alternative' },
  { id: 'cohere-command-r', name: 'Command-R', provider: 'CohereAI', description: 'Specialized for retrieval and RAG' },
  { id: 'cohere-command-r-plus', name: 'Command-R+', provider: 'CohereAI', description: 'Enhanced retrieval and reasoning' }
];

const ModelSelector = ({ selectedModel, onSelectModel }) => {
  const { darkMode } = useTheme();
  
  // Find the selected model object
  const selected = models.find(model => model.id === selectedModel) || models[0];

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={(model) => onSelectModel(model.id)}>
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button 
              className={`relative w-full cursor-default rounded-lg py-3 pl-4 pr-10 text-left shadow-sm 
              ${darkMode 
                ? 'bg-dark-100 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600' 
                : 'bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500'
              }`}
            >
              <div className="flex flex-col">
                <span className="block truncate font-medium">{selected.name}</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {selected.provider} • {selected.description}
                </span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            
            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options 
                className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm
                ${darkMode ? 'bg-dark-100 border border-gray-700' : 'bg-white border border-gray-200'}`}
              >
                {models.map((model) => (
                  <Listbox.Option
                    key={model.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active
                          ? darkMode 
                            ? 'bg-primary-900 text-white' 
                            : 'bg-primary-100 text-primary-900'
                          : darkMode 
                            ? 'text-gray-300' 
                            : 'text-gray-900'
                      }`
                    }
                    value={model}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex flex-col">
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {model.name}
                          </span>
                          <span className={`block truncate text-xs ${
                            active
                              ? darkMode 
                                ? 'text-gray-300' 
                                : 'text-primary-700'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {model.provider} • {model.description}
                          </span>
                        </div>
                        
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                              active ? 'text-white dark:text-white' : 'text-primary-600 dark:text-primary-400'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default ModelSelector;