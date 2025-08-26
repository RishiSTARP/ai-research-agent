import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, ArrowRight, BookOpen, Target, Brain, Edit3, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ingestPaper } from '../lib/api';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    navigate(`/results?q=${encodeURIComponent(query.trim())}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    try {
      await ingestPaper({ file });
      toast.success('PDF uploaded successfully! Processing...');
      // Could navigate to a status page or show progress
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-hero font-serif font-bold text-text mb-8 text-balance">
            Discover Research Gaps
            <br />
            <span className="text-muted">with AI-Powered Analysis</span>
          </h1>
          
          <p className="text-subtitle text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Gaply helps researchers find unexplored areas in their field by analyzing 
            thousands of papers and identifying opportunities for new discoveries.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-6 h-6" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for research papers, topics, or authors..."
                className="w-full pl-14 pr-6 py-4 text-lg border-2 border-border rounded-xl bg-surface text-text placeholder-muted focus:outline-none focus:border-text focus:ring-4 focus:ring-text/10 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-text text-bg px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Search
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Upload Section */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 text-muted mb-4">
              <span className="text-sm">or</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <label className="btn-primary cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
                {isUploading ? 'Uploading...' : 'Upload PDF'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <span className="text-sm text-muted">
                Analyze your own research papers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* How Gaply Helps Section */}
      <div className="bg-surface border-t border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-display font-serif font-bold text-text mb-6">
              How Gaply Helps Researchers
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Our platform combines advanced NLP and AI to provide insights that 
              traditional search methods miss.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-text rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-bg" />
              </div>
              <h3 className="text-title font-serif font-bold text-text mb-4">
                Smart Discovery
              </h3>
              <p className="text-muted leading-relaxed">
                Find relevant papers with typo-tolerant search and AI-powered 
                recommendations that understand research context.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-text rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-bg" />
              </div>
              <h3 className="text-title font-serif font-bold text-text mb-4">
                Gap Identification
              </h3>
              <p className="text-muted leading-relaxed">
                Automatically identify research gaps by analyzing claim patterns, 
                methodology coverage, and unexplored variables across papers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-text rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-bg" />
              </div>
              <h3 className="text-title font-bold text-text mb-4">
                Evidence-Based Insights
              </h3>
              <p className="text-muted leading-relaxed">
                Every insight is backed by specific evidence from source papers, 
                with clear provenance and citation tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-display font-serif font-bold text-text mb-6">
              Powerful Research Tools
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Everything you need to analyze, understand, and improve your research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BookOpen, title: 'Paper Analysis', desc: 'Deep insights with evidence tracking' },
              { icon: Edit3, title: 'Smart Paraphrasing', desc: 'AI-assisted text improvement' },
              { icon: CheckCircle, title: 'Proofreading', desc: 'Grammar, style, and AI detection' },
              { icon: Target, title: 'Journal Matching', desc: 'Format compliance checking' },
            ].map((feature, index) => (
              <div key={index} className="card text-center group hover:scale-105 transition-transform">
                <feature.icon className="w-8 h-8 text-text mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif font-bold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
