package workerclient

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Client handles communication with the Python worker service
type Client struct {
	baseURL    string
	httpClient *http.Client
}

// NewClient creates a new worker client
func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 300 * time.Second, // 5 minutes for long-running tasks
		},
	}
}

// IngestRequest represents a request to ingest a paper
type IngestRequest struct {
	StoragePath      string `json:"storage_path,omitempty"`
	DOI              string `json:"doi,omitempty"`
	NotifyCallback   string `json:"notify_callback,omitempty"`
}

// IngestResponse represents the response from ingest
type IngestResponse struct {
	PaperID     string `json:"paperId"`
	ChunkCount  int    `json:"chunkCount"`
	Summary     string `json:"summary"`
	Status      string `json:"status"`
}

// ParaphraseRequest represents a request to paraphrase text
type ParaphraseRequest struct {
	Text         string `json:"text"`
	Variant      string `json:"variant"`
	Tone         int    `json:"tone"`
	Alternatives int    `json:"alternatives"`
	NoAI         bool   `json:"no_ai"`
}

// ParaphraseResponse represents the response from paraphrase
type ParaphraseResponse struct {
	Alternatives []ParaphraseAlternative `json:"alternatives"`
	Warnings     []string                `json:"warnings"`
}

// ParaphraseAlternative represents a paraphrased alternative
type ParaphraseAlternative struct {
	ID             string  `json:"id"`
	Text           string  `json:"text"`
	GrammarScore   float64 `json:"grammarScore"`
	Notes          string  `json:"notes"`
	IsAIAssisted   bool    `json:"is_ai_assisted"`
}

// SummarizeRequest represents a request to summarize a paper
type SummarizeRequest struct {
	PaperID     string `json:"paperId"`
	Scope       string `json:"scope"`
	Granularity string `json:"granularity"`
}

// SummarizeResponse represents the response from summarize
type SummarizeResponse struct {
	Summary []SummaryItem `json:"summary"`
}

// SummaryItem represents a summary item with provenance
type SummaryItem struct {
	Text       string       `json:"text"`
	Provenance []Provenance `json:"provenance"`
}

// Provenance represents the source of a summary item
type Provenance struct {
	ChunkID         string `json:"chunk_id"`
	DOI             string `json:"doi"`
	Page            int    `json:"page"`
	ParagraphIndex  int    `json:"paragraph_index"`
	SentenceIndex   int    `json:"sentence_index"`
	Quote           string `json:"quote"`
}

// ProofreadRequest represents a request to proofread text
type ProofreadRequest struct {
	Text    string   `json:"text,omitempty"`
	PaperID string   `json:"paperId,omitempty"`
	Checks  []string `json:"checks"`
}

// ProofreadResponse represents the response from proofread
type ProofreadResponse struct {
	Issues []ProofreadIssue `json:"issues"`
	Summary ProofreadSummary `json:"summary"`
}

// ProofreadIssue represents a proofreading issue
type ProofreadIssue struct {
	ID          string      `json:"id"`
	Category    string      `json:"category"`
	Severity    string      `json:"severity"`
	Location    interface{} `json:"location"`
	Original    string      `json:"original"`
	Suggestion  string      `json:"suggestion"`
	Explanation string      `json:"explanation"`
	Confidence  float64     `json:"confidence"`
}

// ProofreadSummary represents a summary of proofreading results
type ProofreadSummary struct {
	Grammar      int `json:"grammar"`
	Coherence    int `json:"coherence"`
	Redundancy   int `json:"redundancy"`
	References   int `json:"references"`
	AISuspicion  int `json:"ai_suspicion"`
}

// GapFindRequest represents a request to find research gaps
type GapFindRequest struct {
	PaperIDs    []string `json:"paperIds"`
	Topic       string   `json:"topic"`
	YearsWindow int      `json:"yearsWindow"`
}

// GapFindResponse represents the response from gap finding
type GapFindResponse struct {
	Gaps []Gap `json:"gaps"`
}

// Gap represents a research gap
type Gap struct {
	ID       string    `json:"id"`
	Statement string   `json:"statement"`
	Score    float64   `json:"score"`
	Evidence []Evidence `json:"evidence"`
	Rationale string   `json:"rationale"`
}

// Evidence represents evidence for a gap
type Evidence struct {
	PaperID string `json:"paperId"`
	Title   string `json:"title"`
	DOI     string `json:"doi"`
}

// JournalCheckRequest represents a request to check journal compliance
type JournalCheckRequest struct {
	PaperID     string `json:"paperId,omitempty"`
	Text        string `json:"text,omitempty"`
	JournalName string `json:"journalName,omitempty"`
	JournalURL  string `json:"journalUrl,omitempty"`
}

// JournalCheckResponse represents the response from journal check
type JournalCheckResponse struct {
	Checklist   []JournalCheckItem `json:"checklist"`
	Suggestions []JournalSuggestion `json:"suggestions"`
}

// JournalCheckItem represents a journal compliance item
type JournalCheckItem struct {
	Item   string `json:"item"`
	Status string `json:"status"`
	Detail string `json:"detail"`
}

// JournalSuggestion represents a journal suggestion
type JournalSuggestion struct {
	Text           string `json:"text"`
	IsAIAssisted   bool   `json:"is_ai_assisted"`
}

// IngestPaper sends an ingest request to the worker
func (c *Client) IngestPaper(ctx context.Context, req IngestRequest) (*IngestResponse, error) {
	var resp IngestResponse
	err := c.post(ctx, "/worker/ingest", req, &resp)
	return &resp, err
}

// ParaphraseText sends a paraphrase request to the worker
func (c *Client) ParaphraseText(ctx context.Context, req ParaphraseRequest) (*ParaphraseResponse, error) {
	var resp ParaphraseResponse
	err := c.post(ctx, "/worker/paraphrase", req, &resp)
	return &resp, err
}

// SummarizePaper sends a summarize request to the worker
func (c *Client) SummarizePaper(ctx context.Context, req SummarizeRequest) (*SummarizeResponse, error) {
	var resp SummarizeResponse
	err := c.post(ctx, "/worker/summarize", req, &resp)
	return &resp, err
}

// ProofreadText sends a proofread request to the worker
func (c *Client) ProofreadText(ctx context.Context, req ProofreadRequest) (*ProofreadResponse, error) {
	var resp ProofreadResponse
	err := c.post(ctx, "/worker/proofread", req, &resp)
	return &resp, err
}

// FindGaps sends a gap finding request to the worker
func (c *Client) FindGaps(ctx context.Context, req GapFindRequest) (*GapFindResponse, error) {
	var resp GapFindResponse
	err := c.post(ctx, "/worker/gapfind", req, &resp)
	return &resp, err
}

// CheckJournal sends a journal check request to the worker
func (c *Client) CheckJournal(ctx context.Context, req JournalCheckRequest) (*JournalCheckResponse, error) {
	var resp JournalCheckResponse
	err := c.post(ctx, "/worker/journal-check", req, &resp)
	return &resp, err
}

// post sends a POST request to the worker
func (c *Client) post(ctx context.Context, endpoint string, requestBody interface{}, responseBody interface{}) error {
	url := c.baseURL + endpoint
	
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request body: %w", err)
	}
	
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("worker returned status %d: %s", resp.StatusCode, string(body))
	}
	
	if err := json.NewDecoder(resp.Body).Decode(responseBody); err != nil {
		return fmt.Errorf("failed to decode response: %w", err)
	}
	
	return nil
}

// HealthCheck checks if the worker is healthy
func (c *Client) HealthCheck(ctx context.Context) error {
	url := c.baseURL + "/health"
	
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("worker returned status %d", resp.StatusCode)
	}
	
	return nil
}
