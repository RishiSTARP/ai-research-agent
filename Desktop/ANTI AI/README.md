# Gaply - Research Paper Analysis Platform

A comprehensive research paper analysis platform with AI-powered summarization, gap detection, and paraphrasing capabilities.

## 🏗️ Architecture

This is a **monorepo** containing both frontend and backend services:

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Go API Gateway + Python Worker + Supabase
- **Infrastructure**: Docker Compose for local development

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & npm
- Go 1.21+ (for backend development)
- Python 3.11+ (for worker development)

### 1. Clone the Repository
```bash
git clone https://github.com/RishiSTARP/Gaply.git
cd Gaply
```

### 2. Set Up Environment Variables
```bash
cp env.example .env
# Edit .env with your Supabase credentials
```

### 3. Start the Full Stack
```bash
# Start backend services
./scripts/run_local.sh

# In another terminal, start frontend
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Python Worker**: http://localhost:8001

## 📁 Project Structure

```
Gaply/
├── src/                    # Frontend React components
├── backend-go/            # Go API service
├── worker-python/         # Python NLP worker
├── infra/                 # Docker & infrastructure
├── scripts/               # Setup & utility scripts
├── .github/               # CI/CD workflows
└── README.md              # This file
```

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run unit tests
npm run storybook    # Start Storybook
```

### Backend Development
```bash
# Go API
cd backend-go
go run cmd/gaply-api/main.go

# Python Worker
cd worker-python
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Development
```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f api
docker-compose logs -f worker
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/search` - Search papers
- `GET /api/paper/:id` - Get paper details

### Protected Endpoints (require JWT)
- `POST /api/ingest` - Ingest new paper
- `POST /api/paraphrase` - Paraphrase text
- `POST /api/proofread` - Proofread text
- `POST /api/gapfind` - Find research gaps
- `POST /api/journal-check` - Check journal compliance

## 🚀 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` for infrastructure-as-code
3. Set environment variables in Render dashboard

### Manual Deployment
```bash
# Build frontend
npm run build

# Deploy backend
cd backend-go
docker build -t gaply-api .
docker push your-registry/gaply-api:latest
```

## 🧪 Testing

```bash
# Frontend tests
npm run test
npm run test:e2e

# Backend tests
cd backend-go
go test ./...

cd worker-python
pytest
```

## 📚 Documentation

- [Frontend Design Tokens](design-tokens.md)
- [Backend Deployment Guide](DEPLOYMENT_SUMMARY.md)
- [API Reference](backend-go/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the deployment guides

---

**Gaply** - Making research analysis accessible and intelligent. 🧠📚
