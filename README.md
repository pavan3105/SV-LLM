# SV-LLM: Security Verification LLM

SV-LLM is a production-grade React application that provides a security-focused LLM interface for threat modeling, bug detection, bug repair, and security verification tasks.

## Features

- **Chat Interface**: Modern, responsive chat UI similar to ChatGPT and Claude
- **Model Selection**: Support for multiple LLM providers (OpenAI, Anthropic, Google, xAI)
- **API Key Management**: Secure handling of user-provided API keys
- **Context Window Control**: Adjustable context window size for different tasks
- **Security Agents**: Specialized functionality for threat modeling, bug detection, code review, and bug repair
- **Chat History**: Persistent storage of conversations
- **Feedback System**: Detailed feedback mechanisms for model responses
- **Theme Support**: Light and dark mode with system preference detection
- **Markdown & Code Highlighting**: Rich text formatting with syntax highlighting
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React**: UI library for building component-based interfaces
- **JavaScript**: Programming language
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Headless UI**: Accessible UI components
- **Heroicons**: SVG icon collection
- **Highlight.js**: Syntax highlighting for code blocks
- **Markdown-it**: Markdown parsing and rendering
- **Vite**: Build tool and development server

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sv-llm.git
   cd sv-llm
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Building for Production

```
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
sv-llm/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and icons
│   ├── components/      # React components
│   │   ├── chat/        # Chat-related components
│   │   ├── sidebar/     # Sidebar components
│   │   ├── common/      # Shared UI components
│   │   └── layout/      # Layout components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and storage services
│   ├── utils/           # Helper functions
│   ├── pages/           # Page components
│   ├── App.jsx          # Main App component
│   ├── index.jsx        # Entry point
│   └── tailwind.css     # Tailwind styles
├── .eslintrc.js         # ESLint configuration
├── tailwind.config.js   # Tailwind configuration
└── vite.config.js       # Vite configuration
```

## Security Considerations

- API keys are stored in localStorage and never sent to our servers
- All API calls are made directly from the client to the LLM provider
- No data persistence on servers - everything stays in the user's browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Heroicons](https://heroicons.com/)
- [Vite](https://vitejs.dev/)