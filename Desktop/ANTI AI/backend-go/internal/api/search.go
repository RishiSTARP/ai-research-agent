package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// SearchRequest represents the search request body
type SearchRequest struct {
	Query   string                 `json:"q"`
	Limit   int                    `json:"limit,omitempty"`
	Filters map[string]interface{} `json:"filters,omitempty"`
}

// SearchResponse represents the search response
type SearchResponse struct {
	Results    []SearchResult `json:"results"`
	DidYouMean *string        `json:"didYouMean,omitempty"`
	Total      int            `json:"total"`
}

// SearchResult represents a single search result
type SearchResult struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Authors      []string `json:"authors"`
	Year         int      `json:"year"`
	DOI          string   `json:"doi"`
	OA           bool     `json:"oa"`
	PublisherURL string   `json:"publisher_url"`
	IsThesis     bool     `json:"is_thesis"`
	Snippet      string   `json:"snippet"`
	Ingested     bool     `json:"ingested"`
	Score        float64  `json:"score"`
}

// OpenAlexWork represents a work from OpenAlex API
type OpenAlexWork struct {
	ID              string           `json:"id"`
	Title           string           `json:"title"`
	PublicationYear int              `json:"publication_year"`
	DOI             string           `json:"doi"`
	Type            string           `json:"type"`
	Abstract        map[string][]int `json:"abstract_inverted_index"`
	Authorships     []struct {
		Author struct {
			DisplayName string `json:"display_name"`
		} `json:"author"`
	} `json:"authorships"`
	HostVenue struct {
		URL string `json:"url"`
	} `json:"host_venue"`
}

// OpenAlexResponse represents the OpenAlex API response
type OpenAlexResponse struct {
	Results []OpenAlexWork `json:"results"`
	Meta    struct {
		Count int `json:"count"`
	} `json:"meta"`
}

// UnpaywallResponse represents the Unpaywall API response
type UnpaywallResponse struct {
	IsOA          bool   `json:"is_oa"`
	BestOALink    string `json:"best_oa_location,omitempty"`
	BestOALinkURL string `json:"best_oa_location_url,omitempty"`
}

// Search handles the search endpoint
func (h *Handlers) Search(c *fiber.Ctx) error {
	var req SearchRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Query == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Query parameter 'q' is required",
		})
	}

	// Set default limit
	if req.Limit == 0 {
		req.Limit = 50
	}

	// Search OpenAlex
	results, err := h.searchOpenAlex(c.Context(), req.Query, req.Limit)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to search OpenAlex",
		})
	}

	// Enrich with Unpaywall data
	for i := range results {
		if results[i].DOI != "" {
			oa, oaURL, err := h.getUnpaywallData(c.Context(), results[i].DOI)
			if err == nil {
				results[i].OA = oa
				if oa && oaURL != "" {
					results[i].PublisherURL = oaURL
				}
			}
		}
	}

	// Check if paper is ingested
	for i := range results {
		if results[i].DOI != "" {
			ingested, _ := h.checkIfIngested(c.Context(), results[i].DOI)
			results[i].Ingested = ingested
		}
	}

	// Generate "Did you mean" suggestion for common typos
	didYouMean := h.generateDidYouMean(req.Query)

	response := SearchResponse{
		Results:    results,
		Total:      len(results),
		DidYouMean: didYouMean,
	}

	return c.JSON(response)
}

// searchOpenAlex searches the OpenAlex API
func (h *Handlers) searchOpenAlex(ctx context.Context, query string, limit int) ([]SearchResult, error) {
	url := fmt.Sprintf("%s/works?search=%s&per_page=%d", h.config.OpenAlexBaseURL, query, limit)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", "Gaply/1.0 (https://gaply.in)")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("OpenAlex API returned status: %d", resp.StatusCode)
	}

	var openAlexResp OpenAlexResponse
	if err := json.NewDecoder(resp.Body).Decode(&openAlexResp); err != nil {
		return nil, err
	}

	var results []SearchResult
	for _, work := range openAlexResp.Results {
		// Extract authors
		var authors []string
		for _, authorship := range work.Authorships {
			authors = append(authors, authorship.Author.DisplayName)
		}

		// Generate snippet from abstract
		snippet := h.generateSnippet(work.Abstract)

		// Determine if it's a thesis
		isThesis := strings.Contains(strings.ToLower(work.Type), "thesis")

		result := SearchResult{
			ID:           work.ID,
			Title:        work.Title,
			Authors:      authors,
			Year:         work.PublicationYear,
			DOI:          work.DOI,
			PublisherURL: work.HostVenue.URL,
			IsThesis:     isThesis,
			Snippet:      snippet,
			Score:        0.9, // Default score, could be enhanced with relevance scoring
		}

		results = append(results, result)
	}

	return results, nil
}

// getUnpaywallData gets Open Access information from Unpaywall
func (h *Handlers) getUnpaywallData(ctx context.Context, doi string) (bool, string, error) {
	if h.config.UnpaywallEmail == "" {
		return false, "", fmt.Errorf("Unpaywall email not configured")
	}

	url := fmt.Sprintf("https://api.unpaywall.org/v2/%s?email=%s", doi, h.config.UnpaywallEmail)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return false, "", err
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, "", fmt.Errorf("Unpaywall API returned status: %d", resp.StatusCode)
	}

	var unpaywallResp UnpaywallResponse
	if err := json.NewDecoder(resp.Body).Decode(&unpaywallResp); err != nil {
		return false, "", err
	}

	var oaURL string
	if unpaywallResp.BestOALinkURL != "" {
		oaURL = unpaywallResp.BestOALinkURL
	} else if unpaywallResp.BestOALink != "" {
		oaURL = unpaywallResp.BestOALink
	}

	return unpaywallResp.IsOA, oaURL, nil
}

// checkIfIngested checks if a paper is already ingested
func (h *Handlers) checkIfIngested(ctx context.Context, doi string) (bool, error) {
	_, err := h.models.GetPaperByDOI(ctx, doi)
	if err != nil {
		return false, nil // Paper not found, not ingested
	}
	return true, nil
}

// generateSnippet generates a snippet from abstract data
func (h *Handlers) generateSnippet(abstract map[string][]int) string {
	if abstract == nil {
		return "Abstract not available"
	}

	// Convert inverted index to text (simplified)
	var words []string
	for word := range abstract {
		words = append(words, word)
		if len(words) >= 20 { // Limit snippet length
			break
		}
	}

	if len(words) == 0 {
		return "Abstract not available"
	}

	snippet := strings.Join(words, " ")
	if len(snippet) > 200 {
		snippet = snippet[:200] + "..."
	}

	return snippet
}

// generateDidYouMean generates "Did you mean" suggestions for common typos
func (h *Handlers) generateDidYouMean(query string) *string {
	// Simple typo detection - could be enhanced with more sophisticated algorithms
	commonTypos := map[string]string{
		"machin":      "machine",
		"learnin":     "learning",
		"researc":     "research",
		"artificil":   "artificial",
		"intelligenc": "intelligence",
	}

	for typo, correction := range commonTypos {
		if strings.Contains(strings.ToLower(query), typo) {
			suggestion := strings.ReplaceAll(strings.ToLower(query), typo, correction)
			return &suggestion
		}
	}

	return nil
}
