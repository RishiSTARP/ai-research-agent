package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Config holds all configuration for the application
type Config struct {
	// Server configuration
	Port string

	// Database configuration
	DatabaseURL string

	// Supabase configuration
	SupabaseURL         string
	SupabaseServiceKey  string
	SupabaseAnonKey     string
	JWTSecret           string

	// Worker configuration
	WorkerURL string

	// External services
	OpenAlexBaseURL string
	UnpaywallEmail  string
	GROBIDURL       string
	ChromaURL       string
	LanguageToolURL string

	// Redis configuration (optional)
	RedisURL string

	// CORS and security
	AllowedOrigins []string
	FrontendURL    string

	// Feature flags
	EnableLocalLLM bool
	LogLevel       string

	// Rate limiting
	RateLimitPerMinute int
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        getEnv("DB_URL", ""),
		SupabaseURL:        getEnv("SUPABASE_URL", ""),
		SupabaseServiceKey: getEnv("SUPABASE_KEY", ""),
		SupabaseAnonKey:    getEnv("SUPABASE_ANON_KEY", ""),
		JWTSecret:          getEnv("JWT_SECRET", ""),
		WorkerURL:          getEnv("WORKER_URL", "http://localhost:8000"),
		OpenAlexBaseURL:    getEnv("OPENALEX_BASE_URL", "https://api.openalex.org"),
		UnpaywallEmail:     getEnv("UNPAYWALL_EMAIL", ""),
		GROBIDURL:          getEnv("GROBID_URL", "http://localhost:8070"),
		ChromaURL:          getEnv("CHROMA_URL", "http://localhost:8000"),
		LanguageToolURL:    getEnv("LANGUAGETOOL_URL", "http://localhost:8010"),
		RedisURL:           getEnv("REDIS_URL", ""),
		FrontendURL:        getEnv("FRONTEND_URL", "http://localhost:3000"),
		EnableLocalLLM:     getEnvBool("ENABLE_LOCAL_LLM", false),
		LogLevel:           getEnv("LOG_LEVEL", "info"),
		RateLimitPerMinute: getEnvInt("RATE_LIMIT_PER_MINUTE", 100),
	}

	// Parse allowed origins
	origins := getEnv("ALLOWED_ORIGINS", "")
	if origins != "" {
		cfg.AllowedOrigins = strings.Split(origins, ",")
	} else {
		cfg.AllowedOrigins = []string{cfg.FrontendURL}
	}

	// Validate required configuration
	if err := cfg.validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return cfg, nil
}

// validate ensures all required configuration is present
func (c *Config) validate() error {
	if c.SupabaseURL == "" {
		return fmt.Errorf("SUPABASE_URL is required")
	}
	if c.SupabaseServiceKey == "" {
		return fmt.Errorf("SUPABASE_SERVICE_ROLE_KEY is required")
	}
	if c.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}
	if c.DatabaseURL == "" {
		return fmt.Errorf("DB_URL is required")
	}
	return nil
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvBool gets a boolean environment variable
func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if b, err := strconv.ParseBool(value); err == nil {
			return b
		}
	}
	return defaultValue
}

// getEnvInt gets an integer environment variable
func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return defaultValue
}
