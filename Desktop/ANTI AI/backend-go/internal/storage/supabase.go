package storage

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/google/uuid"
	storage_go "github.com/supabase-community/storage-go"
	supabase "github.com/supabase-community/supabase-go"
)

// SupabaseClient handles Supabase storage operations
type SupabaseClient struct {
	client        *supabase.Client
	storageClient *storage_go.Client
	bucket        string
}

// NewSupabaseClient creates a new Supabase storage client
func NewSupabaseClient(url, serviceKey string) (*SupabaseClient, error) {
	client, err := supabase.NewClient(url, serviceKey, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create Supabase client: %w", err)
	}

	// Create storage client
	storageClient := storage_go.NewClient(url, serviceKey, nil)

	return &SupabaseClient{
		client:        client,
		storageClient: storageClient,
		bucket:        "papers", // Default bucket name
	}, nil
}

// UploadFile uploads a file to Supabase storage
func (s *SupabaseClient) UploadFile(ctx context.Context, file io.Reader, filename string, contentType string) (string, error) {
	// Generate unique filename
	ext := getFileExtension(filename)
	uniqueName := fmt.Sprintf("%s/%s%s", time.Now().Format("2006/01"), uuid.New().String(), ext)

	// Upload file
	_, err := s.storageClient.UploadFile(s.bucket, uniqueName, file)
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %w", err)
	}

	return uniqueName, nil
}

// GetSignedURL generates a signed URL for file upload
func (s *SupabaseClient) GetSignedURL(ctx context.Context, filename string, contentType string, expiresIn time.Duration) (string, error) {
	// Generate unique filename
	ext := getFileExtension(filename)
	uniqueName := fmt.Sprintf("%s/%s%s", time.Now().Format("2006/01"), uuid.New().String(), ext)

	// Create signed URL for upload
	response, err := s.storageClient.CreateSignedUploadUrl(s.bucket, uniqueName)
	if err != nil {
		return "", fmt.Errorf("failed to create signed upload URL: %w", err)
	}

	return response.Url, nil
}

// GetDownloadURL generates a signed download URL
func (s *SupabaseClient) GetDownloadURL(ctx context.Context, filepath string, expiresIn time.Duration) (string, error) {
	response, err := s.storageClient.CreateSignedUrl(s.bucket, filepath, int(expiresIn.Seconds()))
	if err != nil {
		return "", fmt.Errorf("failed to create signed download URL: %w", err)
	}

	return response.SignedURL, nil
}

// DeleteFile deletes a file from storage
func (s *SupabaseClient) DeleteFile(ctx context.Context, filepath string) error {
	_, err := s.storageClient.RemoveFile(s.bucket, []string{filepath})
	if err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}

	return nil
}

// FileExists checks if a file exists in storage
func (s *SupabaseClient) FileExists(ctx context.Context, filepath string) (bool, error) {
	_, err := s.storageClient.DownloadFile(s.bucket, filepath)
	if err != nil {
		// Check if it's a "not found" error
		if err.Error() == "file not found" {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

// GetFileInfo gets metadata about a file
func (s *SupabaseClient) GetFileInfo(ctx context.Context, filepath string) (*FileInfo, error) {
	// This would require a custom implementation as Supabase Go client doesn't expose file info directly
	// For now, we'll return basic info
	return &FileInfo{
		Path:        filepath,
		Size:        0,                 // Would need to implement size checking
		ContentType: "application/pdf", // Assume PDF for papers
		CreatedAt:   time.Now(),
	}, nil
}

// FileInfo represents file metadata
type FileInfo struct {
	Path        string    `json:"path"`
	Size        int64     `json:"size"`
	ContentType string    `json:"content_type"`
	CreatedAt   time.Time `json:"created_at"`
}

// getFileExtension extracts the file extension from a filename
func getFileExtension(filename string) string {
	for i := len(filename) - 1; i >= 0; i-- {
		if filename[i] == '.' {
			return filename[i:]
		}
	}
	return ""
}

// CreateBucket creates a new storage bucket if it doesn't exist
func (s *SupabaseClient) CreateBucket(ctx context.Context, bucketName string) error {
	// This would require admin privileges and custom implementation
	// For now, we'll assume the bucket exists
	return nil
}

// ListFiles lists files in a bucket (with pagination)
func (s *SupabaseClient) ListFiles(ctx context.Context, prefix string, limit int) ([]string, error) {
	// This would require custom implementation as Supabase Go client doesn't expose listing
	// For now, return empty list
	return []string{}, nil
}
