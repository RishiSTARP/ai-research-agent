import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Edit3, Settings, CheckCircle, AlertTriangle, Brain } from 'lucide-react';
import { paraphraseText, ParaphraseRequest, ParaphraseResponse } from '../lib/api';
import toast from 'react-hot-toast';

const Paraphrase: React.FC = () => {
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [options, setOptions] = useState({
    variant: 'us' as 'us' | 'uk',
    tone: 3,
    alternatives: 3,
    no_ai: true,
  });

  const paraphraseMutation = useMutation({
    mutationFn: (data: ParaphraseRequest) => paraphraseText(data),
    onSuccess: (data: ParaphraseResponse) => {
      toast.success(`Generated ${data.alternatives.length} alternatives`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate paraphrases');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text to paraphrase');
      return;
    }

    const requestData: ParaphraseRequest = {
      text: text.trim(),
      ...options,
    };

    paraphraseMutation.mutate(requestData);
  };

  const handleOptionChange = (key: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getToneLabel = (tone: number) => {
    const labels = ['Very Formal', 'Formal', 'Neutral', 'Casual', 'Very Casual'];
    return labels[tone - 1];
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
            Smart Paraphrasing
          </h1>
          <p className="text-muted">
            Improve your writing with AI-assisted paraphrasing and style adjustments
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-xl font-serif font-bold text-text mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                Original Text
              </h3>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to paraphrase..."
                  className="w-full h-64 p-4 border border-border rounded-lg bg-surface text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                />
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={paraphraseMutation.isPending || !text.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paraphraseMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bg mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Generate Alternatives
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setText('')}
                    className="btn-secondary"
                  >
                    Clear Text
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Options */}
          <div className="lg:col-span-1">
            <div className="tool-panel">
              <h3 className="text-xl font-serif font-bold text-text mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Paraphrase Options
              </h3>
              
              <div className="space-y-6">
                {/* Language Variant */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Language Variant
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOptionChange('variant', 'us')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        options.variant === 'us'
                          ? 'bg-text text-bg'
                          : 'bg-surface text-text border border-border hover:bg-bg'
                      }`}
                    >
                      US English
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOptionChange('variant', 'uk')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        options.variant === 'uk'
                          ? 'bg-text text-bg'
                          : 'bg-surface text-text border border-border hover:bg-bg'
                      }`}
                    >
                      UK English
                    </button>
                  </div>
                </div>

                {/* Tone Slider */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Tone: {getToneLabel(options.tone)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={options.tone}
                    onChange={(e) => handleOptionChange('tone', parseInt(e.target.value))}
                    className="w-full h-2 bg-surface border border-border rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>Very Formal</span>
                    <span>Very Casual</span>
                  </div>
                </div>

                {/* Number of Alternatives */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Number of Alternatives
                  </label>
                  <select
                    value={options.alternatives}
                    onChange={(e) => handleOptionChange('alternatives', parseInt(e.target.value))}
                    className="w-full p-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value={2}>2 alternatives</option>
                    <option value={3}>3 alternatives</option>
                    <option value={4}>4 alternatives</option>
                    <option value={5}>5 alternatives</option>
                  </select>
                </div>

                {/* AI Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.no_ai}
                      onChange={(e) => handleOptionChange('no_ai', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-text">No AI assistance (deterministic only)</span>
                  </label>
                  <p className="text-xs text-muted mt-1">
                    When checked, uses only rule-based paraphrasing techniques
                  </p>
                </div>

                {/* Info Box */}
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted">
                      <p className="font-medium mb-1">About AI Usage:</p>
                      <p>When AI assistance is enabled, paraphrases will be clearly labeled. 
                      Deterministic mode uses only linguistic rules and synonym substitution.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {paraphraseMutation.data && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold text-text mb-6">
              Generated Alternatives
            </h2>
            
            <div className="space-y-6">
              {paraphraseMutation.data.alternatives.map((alternative, index) => (
                <div key={alternative.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-serif font-bold text-text">
                      Alternative {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      {alternative.is_ai_assisted && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          <Brain className="w-3 h-3" />
                          AI-Assisted
                        </span>
                      )}
                      <span className="text-sm text-muted">
                        Grammar Score: {alternative.grammarScore}/10
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-text mb-4 leading-relaxed">
                    {alternative.text}
                  </p>
                  
                  {alternative.notes && (
                    <div className="mb-4 p-3 bg-surface border border-border rounded-lg">
                      <p className="text-sm text-muted">
                        <span className="font-medium">Notes:</span> {alternative.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Apply the paraphrase
                        toast.success('Paraphrase applied!');
                      }}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply This Version
                    </button>
                    
                    <button
                      onClick={() => {
                        // Copy to clipboard
                        navigator.clipboard.writeText(alternative.text);
                        toast.success('Copied to clipboard!');
                      }}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Copy Text
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Warnings */}
            {paraphraseMutation.data.warnings.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {paraphraseMutation.data.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Paraphrase;
