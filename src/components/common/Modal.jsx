import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

/**
 * Modal component using Headless UI
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer = null,
}) => {
  const { darkMode } = useTheme();
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg text-left align-middle shadow-xl transition-all ${
                darkMode 
                  ? 'bg-dark-200 border border-gray-700' 
                  : 'bg-white'
              }`}>
                {/* Header */}
                {title && (
                  <div className={`px-6 py-4 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {title}
                      </Dialog.Title>
                      
                      {showCloseButton && (
                        <button
                          type="button"
                          className={`rounded-md p-1 ${
                            darkMode
                              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                              : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                          }`}
                          onClick={onClose}
                        >
                          <XMarkIcon className="h-5 w-5" />
                          <span className="sr-only">Close</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Body */}
                <div className="px-6 py-4">
                  {children}
                </div>
                
                {/* Footer */}
                {footer && (
                  <div className={`px-6 py-3 border-t ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-end space-x-3">
                      {footer}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;