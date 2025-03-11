import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTheme } from '../../context/ThemeContext';

/**
 * Dropdown menu component using Headless UI
 */
const Dropdown = ({ 
  buttonText, 
  items, 
  icon: Icon = null, 
  variant = 'primary',
  placement = 'bottom-end', 
  width = 'w-48' 
}) => {
  const { darkMode } = useTheme();
  
  // Button styles based on variant
  const buttonStyles = {
    primary: `${darkMode 
      ? 'bg-primary-600 text-white hover:bg-primary-700' 
      : 'bg-primary-600 text-white hover:bg-primary-700'
    }`,
    secondary: `${darkMode 
      ? 'bg-gray-700 text-white hover:bg-gray-600' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`,
    outline: `${darkMode 
      ? 'border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800' 
      : 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100'
    }`,
    ghost: `${darkMode 
      ? 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white' 
      : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`,
  };
  
  // Menu placement styles
  const placements = {
    'bottom-end': 'origin-top-right right-0',
    'bottom-start': 'origin-top-left left-0',
    'top-end': 'origin-bottom-right right-0 bottom-full mb-2',
    'top-start': 'origin-bottom-left left-0 bottom-full mb-2',
  };
  
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button 
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${buttonStyles[variant]}`}
      >
        {Icon && <Icon className="h-5 w-5 mr-2" />}
        {buttonText}
        <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
      </Menu.Button>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className={`absolute z-50 mt-2 ${width} rounded-md shadow-lg ${placements[placement]} ${
            darkMode 
              ? 'bg-dark-100 border border-gray-700' 
              : 'bg-white border border-gray-200'
          } focus:outline-none`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      active
                        ? darkMode 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-900'
                        : darkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-700'
                    }`}
                    disabled={item.disabled}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                      {item.label}
                    </div>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;