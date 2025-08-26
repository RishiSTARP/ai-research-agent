// API Response Types
export interface SearchResponse {
  results: Paper[];
  didYouMean?: string;
  total?: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  oa: boolean;
  publisher_url?: string;
  is_thesis: boolean;
  snippet: string;
  ingested: boolean;
  oa_pdf_url?: string;
}

export interface PaperDetail {
  id: string;
  title: string;
  authors: string[];
  doi?: string;
  year: number;
  oa_pdf_url?: string;
  ingested: boolean;
  summary: Summary[];
  chunks: Chunk[];
  gaps: Gap[];
}

export interface Summary {
  text: string;
  provenance: Provenance[];
}

export interface Chunk {
  chunk_id: string;
  text: string;
  doi: string;
  page: number;
  para: number;
  sent: number;
}

export interface Provenance {
  chunk_id: string;
  doi: string;
  page: number;
  para: number;
  sent: number;
  quote: string;
}

export interface Gap {
  id: string;
  statement: string;
  evidence: Evidence[];
}

export interface Evidence {
  paperId: string;
  title: string;
  doi: string;
}

// API Request Types
export interface SearchRequest {
  q: string;
  limit?: number;
  filters?: {
    oaOnly?: boolean;
    yearFrom?: number;
    yearTo?: number;
  };
}

export interface IngestRequest {
  doi?: string;
  pdf_url?: string;
  file?: File;
}

export interface IngestResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface ParaphraseRequest {
  text: string;
  variant: 'us' | 'uk';
  tone: number; // 1-5
  alternatives: number;
  no_ai: boolean;
}

export interface ParaphraseResponse {
  alternatives: ParaphraseAlternative[];
  warnings: string[];
}

export interface ParaphraseAlternative {
  id: string;
  text: string;
  grammarScore: number;
  notes: string;
  is_ai_assisted: boolean;
}

export interface ProofreadRequest {
  text?: string;
  paperId?: string;
}

export interface ProofreadResponse {
  issues: ProofreadIssue[];
  summary: {
    grammar: number;
    coherence: number;
    redundancy: number;
    references: number;
    ai_suspicion: number;
  };
}

export interface ProofreadIssue {
  id: string;
  category: 'grammar' | 'coherence' | 'redundancy' | 'references' | 'ai_suspicion';
  severity: 'low' | 'medium' | 'high';
  location: string;
  original: string;
  suggestion: string;
  explanation: string;
  confidence: number;
}

export interface JournalCheckRequest {
  paperId?: string;
  text?: string;
  journalName?: string;
  journalUrl?: string;
}

export interface JournalCheckResponse {
  checklist: JournalCheckItem[];
  suggestions: JournalSuggestion[];
}

export interface JournalCheckItem {
  item: string;
  status: 'pass' | 'fail' | 'warning';
  detail: string;
}

export interface JournalSuggestion {
  text: string;
  is_ai_assisted: boolean;
}

// UI State Types
export interface SearchFilters {
  oaOnly: boolean;
  yearFrom?: number;
  yearTo?: number;
  sortBy: 'relevance' | 'date' | 'title';
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: any | null;
  login: () => void;
  logout: () => void;
}
