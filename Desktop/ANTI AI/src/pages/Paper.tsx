import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, ExternalLink, ChevronRight, ChevronUp, Quote, MapPin, Calendar, User, FileText, Edit3, CheckCircle, BookOpen } from 'lucide-react';
import { getPaper } from '../lib/api';

import toast from 'react-hot-toast';

const Paper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());

  const { data: paper, isLoading, error } = useQuery({
    queryKey: ['paper', id],
    queryFn: () => getPaper(id!),
    enabled: !!id,
  });

  const toggleChunkExpansion = (chunkId: string) => {
    setExpandedChunks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chunkId)) {
        newSet.delete(chunkId);
      } else {
        newSet.add(chunkId);
      }
      return newSet;
    });
  };

  const scrollToChunk = (chunkId: string) => {
    const element = document.getElementById(`chunk-${chunkId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-accent');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-accent');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text mx-auto mb-4"></div>
          <p className="text-muted">Loading paper analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-bold text-text mb-2">Paper Not Found</h3>
          <p className="text-muted mb-4">Unable to load the requested paper.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

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

          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-serif font-bold text-text mb-4 leading-tight">
                  {paper.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{paper.authors.join(', ')}</span>
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

                <div className="flex items-center gap-2">
                  {paper.oa_pdf_url && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Open Access
                    </span>
                  )}
                  {paper.ingested && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Analyzed
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {paper.oa_pdf_url && (
                  <a
                    href={paper.oa_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                )}
                {paper.doi && (
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View DOI
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Evidence */}
          <div className="lg:col-span-1">
            <div className="tool-panel">
              <h3 className="text-xl font-serif font-bold text-text mb-4 flex items-center gap-2">
                <Quote className="w-5 h-5" />
                Evidence & Chunks
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {paper.chunks.map((chunk) => (
                  <div
                    key={chunk.chunk_id}
                    id={`chunk-${chunk.chunk_id}`}
                    className={`evidence-chunk transition-all duration-200 ${
                      selectedChunkId === chunk.chunk_id ? 'ring-2 ring-accent' : ''
                    }`}
                    onClick={() => setSelectedChunkId(chunk.chunk_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-muted mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>Page {chunk.page}, Para {chunk.para}, Sent {chunk.sent}</span>
                        </div>
                        <p className="text-sm text-text leading-relaxed">
                          {expandedChunks.has(chunk.chunk_id) 
                            ? chunk.text 
                            : chunk.text.length > 150 
                              ? `${chunk.text.substring(0, 150)}...`
                              : chunk.text
                          }
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChunkExpansion(chunk.chunk_id);
                        }}
                        className="ml-2 p-1 hover:bg-bg rounded transition-colors"
                      >
                        {expandedChunks.has(chunk.chunk_id) 
                          ? <ChevronUp className="w-4 h-4" />
                          : <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Summary & Gaps */}
          <div className="lg:col-span-1">
            {/* Summary */}
            <div className="tool-panel mb-6">
              <h3 className="text-xl font-serif font-bold text-text mb-4">
                Summary
              </h3>
              
              <div className="space-y-4">
                {paper.summary.map((summaryItem) => (
                  <div key={`summary-${summaryItem.text.substring(0, 20)}`} className="p-4 border border-border rounded-lg">
                    <p className="text-text mb-3 leading-relaxed">
                      {summaryItem.text}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {summaryItem.provenance.map((prov, provIndex) => (
                        <button
                          key={provIndex}
                          onClick={() => scrollToChunk(prov.chunk_id)}
                          className="provenance-chip hover:bg-accent hover:text-bg"
                        >
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">
                            p{prov.page}:{prov.para}:{prov.sent}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Gaps */}
            <div className="tool-panel">
              <h3 className="text-xl font-serif font-bold text-text mb-4">
                Research Gaps
              </h3>
              
              <div className="space-y-4">
                {paper.gaps.map((gap) => (
                  <div key={gap.id} className="p-4 border border-border rounded-lg">
                    <p className="text-text mb-3 leading-relaxed">
                      {gap.statement}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-muted font-medium">Supporting Evidence:</p>
                      {gap.evidence.map((evidence, evIndex) => (
                        <div key={evIndex} className="text-xs text-muted pl-2 border-l border-border">
                          • {evidence.title} (DOI: {evidence.doi})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Tools */}
          <div className="lg:col-span-1">
            <div className="tool-panel">
              <h3 className="text-xl font-serif font-bold text-text mb-4">
                Analysis Tools
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/paraphrase')}
                  className="w-full btn-secondary text-left"
                >
                  <Edit3 className="w-4 h-4 mr-2 inline" />
                  Paraphrase Selected Text
                </button>
                
                <button
                  onClick={() => navigate('/tools')}
                  className="w-full btn-secondary text-left"
                >
                  <CheckCircle className="w-4 h-4 mr-2 inline" />
                  Proofread & AI-Scan
                </button>
                
                <button
                  onClick={() => navigate('/tools')}
                  className="w-full btn-secondary text-left"
                >
                  <BookOpen className="w-4 h-4 mr-2 inline" />
                  Journal Compliance Check
                </button>
                
                <button
                  onClick={() => {
                    // Export functionality
                    toast.success('Export feature coming soon!');
                  }}
                  className="w-full btn-secondary text-left"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paper;
