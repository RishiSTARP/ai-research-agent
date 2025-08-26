import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '../Home';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the API
jest.mock('../../lib/api', () => ({
  ingestPaper: jest.fn(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the hero section with title', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Discover Research Gaps')).toBeInTheDocument();
    expect(screen.getByText('with AI-Powered Analysis')).toBeInTheDocument();
  });

  it('renders the search form', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByPlaceholderText('Search for research papers, topics, or authors...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders the upload section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Upload PDF')).toBeInTheDocument();
    expect(screen.getByText('Analyze your own research papers')).toBeInTheDocument();
  });

  it('navigates to results page on search submit', () => {
    renderWithProviders(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search for research papers, topics, or authors...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'machine learning' } });
    fireEvent.click(searchButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/results?q=machine learning');
  });

  it('shows features section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('How Gaply Helps Researchers')).toBeInTheDocument();
    expect(screen.getByText('Smart Discovery')).toBeInTheDocument();
    expect(screen.getByText('Gap Identification')).toBeInTheDocument();
    expect(screen.getByText('Evidence-Based Insights')).toBeInTheDocument();
  });

  it('shows tools preview section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Powerful Research Tools')).toBeInTheDocument();
    expect(screen.getByText('Paper Analysis')).toBeInTheDocument();
    expect(screen.getByText('Smart Paraphrasing')).toBeInTheDocument();
    expect(screen.getByText('Proofreading')).toBeInTheDocument();
    expect(screen.getByText('Journal Matching')).toBeInTheDocument();
  });
});
