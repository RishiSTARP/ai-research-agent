import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, User, FileText, ExternalLink, Download, BookOpen } from 'lucide-react';
import { searchPapers } from '../lib/api';
import { Paper, SearchFilters } from '../types/api';
import toast from 'react-hot-toast';

const Results: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchFilters>({
    oaOnly: false,
    yearFrom: undefined,
    yearTo: undefined,
    sortBy: 'relevance',
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchPapers({ q: query, limit: 50, filters }),
    enabled: !!query,
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  const handleDidYouMean = (suggestion: string) => {
    setSearchParams({ q: suggestion });
    toast.success(`Searching for: ${suggestion}`);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleIngest = async (paper: Paper) => {
    try {
      // Navigate to paper detail page for ingestion
      navigate(`/paper/${paper.id}`);
      toast.success('Redirecting to paper analysis...');
    } catch (error) {
      toast.error('Failed to process paper');
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-text mb-2">No Search Query</h2>
          <p className="text-muted mb-4">Please enter a search term to find research papers.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost"
            >
              ← Back to Search
            </button>
            <h1 className="text-3xl font-serif font-bold text-text">
              Search Results
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for research papers..."
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Did You Mean */}
          {data?.didYouMean && (
            <div className="mt-4 p-4 bg-surface border border-border rounded-lg">
              <p className="text-muted mb-2">Did you mean:</p>
              <button
                onClick={() => handleDidYouMean(data.didYouMean!)}
                className="text-text underline hover:no-underline font-medium"
              >
                {data.didYouMean}
              </button>
            </div>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="btn-secondary"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>

          <div className="flex-1" />
          
          <div className="text-sm text-muted">
            {data?.results ? `${data.results.length} results` : 'Searching...'}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="card mb-8">
            <h3 className="font-serif font-bold text-text mb-4">Search Filters</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.oaOnly}
                  onChange={(e) => handleFilterChange('oaOnly', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Open Access Only</span>
              </label>

              <div>
                <label className="block text-sm text-muted mb-1">Year From</label>
                <input
                  type="number"
                  value={filters.yearFrom || ''}
                  onChange={(e) => handleFilterChange('yearFrom', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 2020"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Year To</label>
                <input
                  type="number"
                  value={filters.yearTo || ''}
                  onChange={(e) => handleFilterChange('yearTo', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 2024"
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text mx-auto mb-4"></div>
            <p className="text-muted">Searching for papers...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-serif font-bold text-text mb-2">Search Failed</h3>
            <p className="text-muted mb-4">Unable to search for papers. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="btn-primary"
            >
              Retry Search
            </button>
          </div>
        )}

        {data?.results && data.results.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-text mb-2">No Results Found</h3>
            <p className="text-muted mb-4">Try different keywords or check your spelling.</p>
          </div>
        )}

        {data?.results && data.results.length > 0 && (
          <div className="space-y-6">
            {data.results.map((paper, index) => (
              <div key={paper.id || index} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-serif font-bold text-text leading-tight flex-1 mr-4">
                    {paper.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {paper.oa && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Open Access
                      </span>
                    )}
                    {paper.is_thesis && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Thesis
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted mb-4 leading-relaxed">{paper.snippet}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{paper.authors?.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{paper.year}</span>
                  </div>
                  {paper.doi && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>DOI: {paper.doi}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/paper/${paper.id}`)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Analysis
                  </button>

                  {!paper.ingested && (
                    <button
                      onClick={() => handleIngest(paper)}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Ingest
                    </button>
                  )}

                  {paper.publisher_url && (
                    <a
                      href={paper.publisher_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-sm px-4 py-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Publisher
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
