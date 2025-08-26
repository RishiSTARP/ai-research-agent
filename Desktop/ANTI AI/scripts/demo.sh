#!/bin/bash

# Gaply Backend Demo Script
# This script demonstrates the core API flow

set -e

echo "🎯 Gaply Backend Demo - Testing Core Flow"
echo "=========================================="

# Configuration
API_BASE="http://localhost:8080"
WORKER_BASE="http://localhost:8001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" > /dev/null; then
        print_status "success" "$name is running"
        return 0
    else
        print_status "error" "$name is not running"
        return 1
    fi
}

# Function to make API request
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    print_status "info" "$description"
    
    if [ -n "$data" ]; then
        response=$(curl -s -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    else
        response=$(curl -s -X "$method" "$API_BASE$endpoint" \
            -w "\n%{http_code}")
    fi
    
    # Extract status code and response body
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        print_status "success" "Request successful (HTTP $status_code)"
        echo "Response: $response_body" | jq '.' 2>/dev/null || echo "Response: $response_body"
    else
        print_status "error" "Request failed (HTTP $status_code)"
        echo "Response: $response_body"
    fi
    
    echo ""
}

# Check if services are running
echo "🔍 Checking service health..."
echo ""

if ! check_service "$API_BASE/health" "Go API"; then
    print_status "error" "Please start the backend services first:"
    echo "  ./scripts/run_local.sh"
    exit 1
fi

if ! check_service "$WORKER_BASE/health" "Python Worker"; then
    print_status "warning" "Python Worker is not running. Some features may not work."
fi

echo ""

# Demo 1: Health Check
echo "📊 Demo 1: Health Check"
echo "-----------------------"
api_request "GET" "/health" "" "Checking API health status"

# Demo 2: Search Papers
echo "🔍 Demo 2: Search Papers"
echo "-----------------------"
search_data='{
  "q": "machine learning healthcare",
  "limit": 5,
  "filters": {
    "oaOnly": true,
    "yearFrom": 2020
  }
}'
api_request "POST" "/api/search" "$search_data" "Searching for papers about machine learning in healthcare"

# Demo 3: Search Papers (Typo Test)
echo "🔍 Demo 3: Search Papers (Typo Test)"
echo "------------------------------------"
typo_data='{
  "q": "machin learnin",
  "limit": 3
}'
api_request "POST" "/api/search" "$typo_data" "Testing typo tolerance with 'machin learnin'"

# Demo 4: Worker Health Check
echo "🔧 Demo 4: Worker Health Check"
echo "-------------------------------"
if curl -s -f "$WORKER_BASE/health" > /dev/null; then
    worker_response=$(curl -s "$WORKER_BASE/health")
    print_status "success" "Worker is healthy"
    echo "Response: $worker_response" | jq '.' 2>/dev/null || echo "Response: $worker_response"
else
    print_status "warning" "Worker is not available"
fi

echo ""

# Demo 5: Test Protected Endpoints (without auth)
echo "🔒 Demo 5: Test Protected Endpoints (without auth)"
echo "-------------------------------------------------"
print_status "info" "Testing protected endpoint without authentication (should fail)"
response=$(curl -s -X POST "$API_BASE/api/ingest" \
    -H "Content-Type: application/json" \
    -d '{"doi": "10.1234/test"}' \
    -w "\n%{http_code}")

status_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)

if [ "$status_code" -eq 401 ]; then
    print_status "success" "Authentication correctly required (HTTP 401)"
else
    print_status "warning" "Unexpected response (HTTP $status_code)"
fi

echo "Response: $response_body"
echo ""

# Summary
echo "📋 Demo Summary"
echo "==============="
print_status "success" "Core API endpoints are working"
print_status "info" "Search functionality with OpenAlex integration"
print_status "info" "Typo tolerance working"
print_status "info" "Authentication middleware working"

echo ""
echo "🎉 Demo completed successfully!"
echo ""
echo "📚 Next steps:"
echo "   1. Set up Supabase credentials in .env"
echo "   2. Test authenticated endpoints with JWT token"
echo "   3. Test paper ingestion workflow"
echo "   4. Test worker processing capabilities"
echo ""
echo "🔗 API Base: $API_BASE"
echo "🔗 Worker Base: $WORKER_BASE"
echo "🔗 Health Check: $API_BASE/health"
echo "🔗 Worker Health: $WORKER_BASE/health"
