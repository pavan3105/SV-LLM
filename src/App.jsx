import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';

// Pages
import Home from './pages/Home';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import VulnerabilityDetectionTest from './pages/VulnerabilityDetectionTest';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { ConfigProvider } from './context/ConfigContext';
import { AuthProvider } from './context/AuthContext';

// Components
import ErrorFallback from './components/common/ErrorFallback';

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <ConfigProvider>
              <ChatProvider>
                <Router 
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/test/vulnerability-detection" element={<VulnerabilityDetectionTest />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              </ChatProvider>
            </ConfigProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;