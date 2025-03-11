// Application info
export const APP_NAME = 'SV-LLM';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Security Verification LLM Assistant';

// LocalStorage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  API_KEY: 'apiKey',
  SELECTED_MODEL: 'selectedModel',
  CONTEXT_WINDOW: 'contextWindow',
  CHAT_HISTORY: 'chatHistory',
  USER_SETTINGS: 'userSettings',
  FEEDBACK: 'feedback',
};

// Available LLM models
export const MODELS = {
  // OpenAI models
  OPENAI: {
    GPT_4: 'gpt-4',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
  },
  
  // Anthropic models
  ANTHROPIC: {
    CLAUDE_3_OPUS: 'claude-3-opus',
    CLAUDE_3_SONNET: 'claude-3-sonnet',
    CLAUDE_3_HAIKU: 'claude-3-haiku',
  },
  
  // Google models
  GOOGLE: {
    GEMINI_PRO: 'gemini-pro',
    GEMINI_ULTRA: 'gemini-ultra',
  },
  
  // xAI models
  XAI: {
    GROK_1: 'grok-1',
  },

  COHERE: {
    COMMAND: 'cohere-command',
    COMMAND_LIGHT: 'cohere-command-light',
    COMMAND_R: 'cohere-command-r',
    COMMAND_R_PLUS: 'cohere-command-r-plus',
  },
};

// Default model settings
export const DEFAULT_MODEL = MODELS.OPENAI.GPT_4;
export const DEFAULT_CONTEXT_WINDOW = 4096;

// Message roles
export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

// Security categories
export const SECURITY_CATEGORIES = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATA_VALIDATION: 'data-validation',
  INJECTION: 'injection',
  CRYPTOGRAPHY: 'cryptography',
  SECURE_CONFIGURATION: 'secure-configuration',
  XSS: 'cross-site-scripting',
  CSRF: 'cross-site-request-forgery',
  SECURE_COMMUNICATION: 'secure-communication',
  GENERAL: 'general-security',
};

// API endpoints
export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
  GOOGLE: 'https://generativelanguage.googleapis.com/v1beta/models',
  XAI: 'https://api.xai.com/v1/chat/completions',
  COHERE: 'https://api.cohere.ai/v1/chat',
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  API_KEY: /^[a-zA-Z0-9_-]{20,}$/,
};

// Maximum limits
export const LIMITS = {
  MAX_MESSAGES: 100,
  MAX_MESSAGE_LENGTH: 10000,
  MAX_CONTEXT_WINDOW: 32768,
  MAX_CHAT_HISTORY: 50,
};

// Timeout durations (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 60000, // 60 seconds
  DEBOUNCE: 300,
  FEEDBACK_TOAST: 3000,
  INACTIVE_SESSION: 30 * 60 * 1000, // 30 minutes
};

// Error codes
export const ERROR_CODES = {
  AUTHENTICATION_FAILED: 'auth_failed',
  INVALID_API_KEY: 'invalid_api_key',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  NETWORK_ERROR: 'network_error',
  SERVER_ERROR: 'server_error',
  UNKNOWN_ERROR: 'unknown_error',
};