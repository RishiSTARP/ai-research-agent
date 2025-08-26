
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Results from './pages/Results';
import Paper from './pages/Paper';
import Paraphrase from './pages/Paraphrase';
import Tools from './pages/Tools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-bg text-text">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<Results />} />
                <Route path="/paper/:id" element={<Paper />} />
                <Route path="/paraphrase" element={<Paraphrase />} />
                <Route path="/tools" element={<Tools />} />
              </Routes>
            </Layout>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: 'var(--text)',
                    secondary: 'var(--bg)',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: 'var(--text)',
                    secondary: 'var(--bg)',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
