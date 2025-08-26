package db

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Connection wraps the database connection pool
type Connection struct {
	pool *pgxpool.Pool
}

// NewConnection creates a new database connection pool
func NewConnection(databaseURL string) (*Connection, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database URL: %w", err)
	}

	// Configure connection pool
	config.MaxConns = 20
	config.MinConns = 5
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	// Create connection pool
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test connection
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &Connection{pool: pool}, nil
}

// Close closes the database connection pool
func (c *Connection) Close() {
	if c.pool != nil {
		c.pool.Close()
	}
}

// GetPool returns the underlying connection pool
func (c *Connection) GetPool() *pgxpool.Pool {
	return c.pool
}

// Ping checks if the database is accessible
func (c *Connection) Ping(ctx context.Context) error {
	return c.pool.Ping(ctx)
}
