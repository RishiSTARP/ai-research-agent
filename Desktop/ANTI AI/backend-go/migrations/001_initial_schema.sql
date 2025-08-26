-- Initial database schema for Gaply
-- Run this file to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Papers table
CREATE TABLE IF NOT EXISTS papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doi TEXT UNIQUE,
    title TEXT NOT NULL,
    authors JSONB,
    year INTEGER,
    oa_pdf_url TEXT,
    storage_path TEXT,
    ingested_at TIMESTAMPTZ,
    ingest_status TEXT DEFAULT 'pending',
    summary JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chunks table
CREATE TABLE IF NOT EXISTS chunks (
    chunk_id TEXT PRIMARY KEY,
    paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    page INTEGER NOT NULL,
    paragraph_index INTEGER NOT NULL,
    sentence_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    progress INTEGER DEFAULT 0,
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gaps table
CREATE TABLE IF NOT EXISTS gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_ids JSONB NOT NULL,
    statement TEXT NOT NULL,
    evidence JSONB,
    score NUMERIC(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Edits table
CREATE TABLE IF NOT EXISTS edits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location JSONB NOT NULL,
    old_text TEXT NOT NULL,
    new_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API cache table for external API responses
CREATE TABLE IF NOT EXISTS api_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key TEXT UNIQUE NOT NULL,
    response_data JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_papers_doi ON papers(doi);
CREATE INDEX IF NOT EXISTS idx_papers_year ON papers(year);
CREATE INDEX IF NOT EXISTS idx_papers_ingest_status ON papers(ingest_status);
CREATE INDEX IF NOT EXISTS idx_chunks_paper_id ON chunks(paper_id);
CREATE INDEX IF NOT EXISTS idx_chunks_page ON chunks(page);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);

-- Create unique constraint for chunk_id format
-- chunk_id should follow format: doi::p{page}::para{n}::s{m}
ALTER TABLE chunks ADD CONSTRAINT IF NOT EXISTS chunk_id_format 
CHECK (chunk_id ~ '^.+::p\d+::para\d+::s\d+$');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_papers_updated_at 
    BEFORE UPDATE ON papers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User');
-- INSERT INTO papers (doi, title, authors, year, ingest_status) 
-- VALUES ('10.1234/test', 'Sample Paper', '["Author 1", "Author 2"]', 2023, 'completed');
