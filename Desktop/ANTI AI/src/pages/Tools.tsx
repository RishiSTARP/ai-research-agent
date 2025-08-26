import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, BookOpen, AlertTriangle, Brain, FileText } from 'lucide-react';
import { proofreadText, checkJournal, ProofreadRequest, JournalCheckRequest } from '../lib/api';
import toast from 'react-hot-toast';

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'proofread' | 'journal'>('proofread');
  
  // Proofread state
  const [proofreadTextInput, setProofreadTextInput] = useState('');
  const [proofreadPaperId, setProofreadPaperId] = useState('');
  
  // Journal check state
  const [journalName, setJournalName] = useState('');
  const [journalUrl, setJournalUrl] = useState('');
  const [journalPaperId, setJournalPaperId] = useState('');

  const proofreadMutation = useMutation({
    mutationFn: (data: ProofreadRequest) => proofreadText(data),
    onSuccess: (data: any) => {
      toast.success(`Found ${data.issues.length} issues to review`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to proofread text');
    },
  });

  const journalCheckMutation = useMutation({
    mutationFn: (data: JournalCheckRequest) => checkJournal(data),
    onSuccess: () => {
      toast.success('Journal compliance check completed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check journal compliance');
    },
  });

  const handleProofread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofreadTextInput.trim() && !proofreadPaperId) {
      toast.error('Please enter text or select a paper to proofread');
      return;
    }

    const requestData: ProofreadRequest = {
      text: proofreadTextInput.trim() || undefined,
      paperId: proofreadPaperId || undefined,
    };

    proofreadMutation.mutate(requestData);
  };

  const handleJournalCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalName && !journalUrl) {
      toast.error('Please enter a journal name or URL');
      return;
    }

    const requestData: JournalCheckRequest = {
      paperId: journalPaperId || undefined,
      journalName: journalName || undefined,
      journalUrl: journalUrl || undefined,
    };

    journalCheckMutation.mutate(requestData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar': return <CheckCircle className="w-4 h-4" />;
      case 'coherence': return <FileText className="w-4 h-4" />;
      case 'redundancy': return <AlertTriangle className="w-4 h-4" />;
      case 'references': return <BookOpen className="w-4 h-4" />;
      case 'ai_suspicion': return <Brain className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </button>

          <h1 className="text-3xl font-serif font-bold text-text mb-2">
            Research Tools
          </h1>
          <p className="text-muted">
            Proofread your text and check journal compliance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('proofread')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'proofread'
                ? 'text-text border-b-2 border-text'
                : 'text-muted hover:text-text'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Proofread & AI-Scan
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'journal'
                ? 'text-text border-b-2 border-text'
                : 'text-muted hover:text-text'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Journal Check
          </button>
        </div>

        {/* Proofread Tab */}
        {activeTab === 'proofread' && (
          <div className="space-y-8">
            {/* Input Section */}
            <div className="card">
              <h3 className="text-xl font-serif font-bold text-text mb-4">
                Text Input
              </h3>
              
              <form onSubmit={handleProofread} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Enter text to proofread
                  </label>
                  <textarea
                    value={proofreadTextInput}
                                          onChange={(e) => setProofreadTextInput(e.target.value)}
                    placeholder="Paste your text here for proofreading..."
                    className="w-full h-32 p-4 border border-border rounded-lg bg-surface text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  />
                </div>

                <div className="text-center text-muted text-sm">- or -</div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Select an ingested paper
                  </label>
                  <select
                    value={proofreadPaperId}
                    onChange={(e) => setProofreadPaperId(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Choose a paper...</option>
                    <option value="paper1">Machine Learning Applications in NLP</option>
                    <option value="paper2">Research Gap Analysis in Computer Science</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={proofreadMutation.isPending || (!proofreadTextInput.trim() && !proofreadPaperId)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {proofreadMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bg mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Start Proofreading
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Section */}
            {proofreadMutation.data && (
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-bold text-text">
                  Proofreading Results
                </h3>

                {/* Summary */}
                <div className="card">
                  <h4 className="font-serif font-bold text-text mb-4">Issue Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(proofreadMutation.data.summary).map(([category, count]) => (
                      <div key={category} className="text-center">
                        <div className="text-2xl font-bold text-text">{String(count)}</div>
                        <div className="text-sm text-muted capitalize">{category.replace('_', ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues by Category */}
                {['grammar', 'coherence', 'redundancy', 'references', 'ai_suspicion'].map(category => {
                  const categoryIssues = proofreadMutation.data.issues.filter(
                    (issue: any) => issue.category === category
                  );
                  
                  if (categoryIssues.length === 0) return null;

                  return (
                    <div key={category} className="card">
                      <h4 className="font-serif font-bold text-text mb-4 capitalize flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {category.replace('_', ' ')} Issues ({categoryIssues.length})
                      </h4>
                      
                      <div className="space-y-4">
                        {categoryIssues.map((issue: any) => (
                          <div key={issue.id} className="p-4 border border-border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                                {issue.severity} severity
                              </span>
                              <span className="text-sm text-muted">
                                Confidence: {issue.confidence}%
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm text-muted mb-1">Location: {issue.location}</p>
                              <p className="text-sm text-muted mb-2">Original: "{issue.original}"</p>
                              <p className="text-sm text-muted">Suggestion: "{issue.suggestion}"</p>
                            </div>
                            
                            <p className="text-sm text-text mb-3">{issue.explanation}</p>
                            
                            <div className="flex gap-2">
                              <button className="btn-primary text-sm px-3 py-1">
                                Accept Fix
                              </button>
                              <button className="btn-secondary text-sm px-3 py-1">
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Journal Check Tab */}
        {activeTab === 'journal' && (
          <div className="space-y-8">
            {/* Input Section */}
            <div className="card">
              <h3 className="text-xl font-serif font-bold text-text mb-4">
                Journal Information
              </h3>
              
              <form onSubmit={handleJournalCheck} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Journal Name
                    </label>
                    <input
                      type="text"
                      value={journalName}
                      onChange={(e) => setJournalName(e.target.value)}
                      placeholder="e.g., Nature, Science"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Journal URL
                    </label>
                    <input
                      type="url"
                      value={journalUrl}
                      onChange={(e) => setJournalUrl(e.target.value)}
                      placeholder="https://journal.example.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Select paper to check (optional)
                  </label>
                  <select
                    value={journalPaperId}
                    onChange={(e) => setJournalPaperId(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Choose a paper...</option>
                    <option value="paper1">Machine Learning Applications in NLP</option>
                    <option value="paper2">Research Gap Analysis in Computer Science</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={journalCheckMutation.isPending || (!journalName && !journalUrl)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {journalCheckMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bg mr-2"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Check Compliance
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Section */}
            {journalCheckMutation.data && (
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-bold text-text">
                  Journal Compliance Results
                </h3>

                {/* Checklist */}
                <div className="card">
                  <h4 className="font-serif font-bold text-text mb-4">Compliance Checklist</h4>
                  <div className="space-y-3">
                    {journalCheckMutation.data.checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                          item.status === 'pass' ? 'bg-green-500' :
                          item.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-text">{item.item}</p>
                          <p className="text-sm text-muted">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {journalCheckMutation.data.suggestions.length > 0 && (
                  <div className="card">
                    <h4 className="font-serif font-bold text-text mb-4">Recommendations</h4>
                    <div className="space-y-4">
                      {journalCheckMutation.data.suggestions.map((suggestion, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-medium text-text">Suggestion {index + 1}</h5>
                            {suggestion.is_ai_assisted && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                <Brain className="w-3 h-3" />
                                AI-Assisted
                              </span>
                            )}
                          </div>
                          <p className="text-text">{suggestion.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
