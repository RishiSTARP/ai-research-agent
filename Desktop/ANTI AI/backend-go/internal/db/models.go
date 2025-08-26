package db

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// Models provides access to all database operations
type Models struct {
	conn *Connection
}

// NewModels creates a new Models instance
func NewModels(conn *Connection) *Models {
	return &Models{conn: conn}
}

// Paper represents a research paper
type Paper struct {
	ID           uuid.UUID       `json:"id"`
	DOI          string          `json:"doi"`
	Title        string          `json:"title"`
	Authors      json.RawMessage `json:"authors"`
	Year         int             `json:"year"`
	OAPDFURL     *string         `json:"oa_pdf_url"`
	StoragePath  *string         `json:"storage_path"`
	IngestedAt   *time.Time      `json:"ingested_at"`
	IngestStatus string          `json:"ingest_status"`
	Summary      json.RawMessage `json:"summary"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// Chunk represents a text chunk from a paper
type Chunk struct {
	ChunkID        string    `json:"chunk_id"`
	PaperID        uuid.UUID `json:"paper_id"`
	Page           int       `json:"page"`
	ParagraphIndex int       `json:"paragraph_index"`
	SentenceIndex  int       `json:"sentence_index"`
	Text           string    `json:"text"`
	CreatedAt      time.Time `json:"created_at"`
}

// Job represents a background job
type Job struct {
	JobID     uuid.UUID       `json:"job_id"`
	Type      string          `json:"type"`
	Status    string          `json:"status"`
	Progress  int             `json:"progress"`
	Result    json.RawMessage `json:"result"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// Gap represents a research gap
type Gap struct {
	ID        uuid.UUID       `json:"id"`
	PaperIDs  json.RawMessage `json:"paper_ids"`
	Statement string          `json:"statement"`
	Evidence  json.RawMessage `json:"evidence"`
	Score     float64         `json:"score"`
	CreatedAt time.Time       `json:"created_at"`
}

// Edit represents a user edit to a paper
type Edit struct {
	ID        uuid.UUID       `json:"id"`
	PaperID   uuid.UUID       `json:"paper_id"`
	UserID    uuid.UUID       `json:"user_id"`
	Location  json.RawMessage `json:"location"`
	OldText   string          `json:"old_text"`
	NewText   string          `json:"new_text"`
	CreatedAt time.Time       `json:"created_at"`
}

// CreatePaper creates a new paper record
func (m *Models) CreatePaper(ctx context.Context, paper *Paper) error {
	query := `
		INSERT INTO papers (id, doi, title, authors, year, oa_pdf_url, storage_path, ingest_status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`

	paper.ID = uuid.New()
	paper.CreatedAt = time.Now()
	paper.UpdatedAt = time.Now()

	_, err := m.conn.GetPool().Exec(ctx, query,
		paper.ID, paper.DOI, paper.Title, paper.Authors, paper.Year,
		paper.OAPDFURL, paper.StoragePath, paper.IngestStatus,
		paper.CreatedAt, paper.UpdatedAt)

	return err
}

// GetPaperByID retrieves a paper by its ID
func (m *Models) GetPaperByID(ctx context.Context, id uuid.UUID) (*Paper, error) {
	query := `SELECT * FROM papers WHERE id = $1`

	var paper Paper
	err := m.conn.GetPool().QueryRow(ctx, query, id).Scan(
		&paper.ID, &paper.DOI, &paper.Title, &paper.Authors, &paper.Year,
		&paper.OAPDFURL, &paper.StoragePath, &paper.IngestedAt, &paper.IngestStatus,
		&paper.Summary, &paper.CreatedAt, &paper.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &paper, nil
}

// GetPaperByDOI retrieves a paper by its DOI
func (m *Models) GetPaperByDOI(ctx context.Context, doi string) (*Paper, error) {
	query := `SELECT * FROM papers WHERE doi = $1`

	var paper Paper
	err := m.conn.GetPool().QueryRow(ctx, query, doi).Scan(
		&paper.ID, &paper.DOI, &paper.Title, &paper.Authors, &paper.Year,
		&paper.OAPDFURL, &paper.StoragePath, &paper.IngestedAt, &paper.IngestStatus,
		&paper.Summary, &paper.CreatedAt, &paper.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &paper, nil
}

// UpdatePaperStatus updates a paper's ingest status
func (m *Models) UpdatePaperStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `UPDATE papers SET ingest_status = $1, updated_at = $2 WHERE id = $3`
	_, err := m.conn.GetPool().Exec(ctx, query, status, time.Now(), id)
	return err
}

// CreateChunk creates a new chunk record
func (m *Models) CreateChunk(ctx context.Context, chunk *Chunk) error {
	query := `
		INSERT INTO chunks (chunk_id, paper_id, page, paragraph_index, sentence_index, text, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	chunk.CreatedAt = time.Now()

	_, err := m.conn.GetPool().Exec(ctx, query,
		chunk.ChunkID, chunk.PaperID, chunk.Page, chunk.ParagraphIndex,
		chunk.SentenceIndex, chunk.Text, chunk.CreatedAt)

	return err
}

// GetChunksByPaperID retrieves all chunks for a paper
func (m *Models) GetChunksByPaperID(ctx context.Context, paperID uuid.UUID) ([]Chunk, error) {
	query := `SELECT * FROM chunks WHERE paper_id = $1 ORDER BY page, paragraph_index, sentence_index`

	rows, err := m.conn.GetPool().Query(ctx, query, paperID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chunks []Chunk
	for rows.Next() {
		var chunk Chunk
		err := rows.Scan(&chunk.ChunkID, &chunk.PaperID, &chunk.Page,
			&chunk.ParagraphIndex, &chunk.SentenceIndex, &chunk.Text, &chunk.CreatedAt)
		if err != nil {
			return nil, err
		}
		chunks = append(chunks, chunk)
	}

	return chunks, nil
}

// CreateJob creates a new job record
func (m *Models) CreateJob(ctx context.Context, job *Job) error {
	query := `
		INSERT INTO jobs (job_id, type, status, progress, result, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	job.JobID = uuid.New()
	job.CreatedAt = time.Now()
	job.UpdatedAt = time.Now()

	_, err := m.conn.GetPool().Exec(ctx, query,
		job.JobID, job.Type, job.Status, job.Progress, job.Result,
		job.CreatedAt, job.UpdatedAt)

	return err
}

// GetJobByID retrieves a job by its ID
func (m *Models) GetJobByID(ctx context.Context, id uuid.UUID) (*Job, error) {
	query := `SELECT * FROM jobs WHERE job_id = $1`

	var job Job
	err := m.conn.GetPool().QueryRow(ctx, query, id).Scan(
		&job.JobID, &job.Type, &job.Status, &job.Progress, &job.Result,
		&job.CreatedAt, &job.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &job, nil
}

// UpdateJobStatus updates a job's status and progress
func (m *Models) UpdateJobStatus(ctx context.Context, id uuid.UUID, status string, progress int, result json.RawMessage) error {
	query := `UPDATE jobs SET status = $1, progress = $2, result = $3, updated_at = $4 WHERE job_id = $5`
	_, err := m.conn.GetPool().Exec(ctx, query, status, progress, result, time.Now(), id)
	return err
}

// CreateGap creates a new gap record
func (m *Models) CreateGap(ctx context.Context, gap *Gap) error {
	query := `
		INSERT INTO gaps (id, paper_ids, statement, evidence, score, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	gap.ID = uuid.New()
	gap.CreatedAt = time.Now()

	_, err := m.conn.GetPool().Exec(ctx, query,
		gap.ID, gap.PaperIDs, gap.Statement, gap.Evidence, gap.Score, gap.CreatedAt)

	return err
}

// GetGapsByPaperIDs retrieves gaps for specific papers
func (m *Models) GetGapsByPaperIDs(ctx context.Context, paperIDs []uuid.UUID) ([]Gap, error) {
	// This is a simplified implementation - in production you'd want to use proper JSONB queries
	query := `SELECT * FROM gaps WHERE paper_ids @> $1 ORDER BY score DESC`

	paperIDsJSON, err := json.Marshal(paperIDs)
	if err != nil {
		return nil, err
	}

	rows, err := m.conn.GetPool().Query(ctx, query, paperIDsJSON)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var gaps []Gap
	for rows.Next() {
		var gap Gap
		err := rows.Scan(&gap.ID, &gap.PaperIDs, &gap.Statement, &gap.Evidence, &gap.Score, &gap.CreatedAt)
		if err != nil {
			return nil, err
		}
		gaps = append(gaps, gap)
	}

	return gaps, nil
}
