#!/bin/bash

# Gaply Backend Local Development Script
# This script sets up and runs the complete backend locally

set -e

echo "🚀 Starting Gaply Backend Local Development..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp ../env.example ../.env
    echo "📝 Please edit ../.env with your configuration values:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - JWT_SECRET"
    echo "   - UNPAYWALL_EMAIL"
    echo ""
    echo "Press Enter when you're ready to continue..."
    read
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ../backend-go/migrations
mkdir -p ../worker-python/app/routes
mkdir -p ../worker-python/app/services

# Check if migrations directory exists
if [ ! -f "../backend-go/migrations/001_initial_schema.sql" ]; then
    echo "❌ Database migrations not found. Please ensure migrations are in place."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
cd ../infra

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Build services
echo "🔨 Building services..."
docker-compose build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
timeout=300
elapsed=0

while [ $elapsed -lt $timeout ]; do
    if docker-compose ps | grep -q "healthy"; then
        echo "✅ All services are healthy!"
        break
    fi
    
    echo "⏳ Waiting for services to be healthy... ($elapsed/$timeout seconds)"
    sleep 10
    elapsed=$((elapsed + 10))
done

if [ $elapsed -ge $timeout ]; then
    echo "❌ Timeout waiting for services to be healthy"
    echo "📋 Service status:"
    docker-compose ps
    echo "📋 Service logs:"
    docker-compose logs --tail=50
    exit 1
fi

# Show service status
echo "📋 Service status:"
docker-compose ps

# Show service URLs
echo ""
echo "🌐 Service URLs:"
echo "   Go API:      http://localhost:8080"
echo "   Python Worker: http://localhost:8001"
echo "   GROBID:      http://localhost:8070"
echo "   Chroma:      http://localhost:8000"
echo "   LanguageTool: http://localhost:8010"
echo "   Redis:       localhost:6379"
echo "   PostgreSQL:  localhost:5432"
echo ""

# Test API health
echo "🔍 Testing API health..."
sleep 5

if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Go API is healthy"
else
    echo "❌ Go API health check failed"
fi

if curl -f http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ Python Worker is healthy"
else
    echo "❌ Python Worker health check failed"
fi

echo ""
echo "🎉 Gaply Backend is running locally!"
echo ""
echo "📚 Next steps:"
echo "   1. Set VITE_API_BASE_URL=http://localhost:8080 in your frontend .env"
echo "   2. Test the API endpoints with curl or Postman"
echo "   3. Check logs with: docker-compose logs -f [service-name]"
echo "   4. Stop services with: docker-compose down"
echo ""
echo "🔗 API Documentation: http://localhost:8080/health"
echo "🔗 Worker Health: http://localhost:8001/health"
echo ""

# Keep script running to show logs
echo "📋 Showing logs (Ctrl+C to stop)..."
docker-compose logs -f
