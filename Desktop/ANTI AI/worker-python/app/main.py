from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager
import os
from typing import Optional

from .routes import ingest, paraphrase, summarize, proofread, gapfind, journal_check
from .services.grobid_client import GROBIDClient
from .services.vectordb_chroma import ChromaVectorDB
from .services.embeddings import EmbeddingService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global service instances
grobid_client: Optional[GROBIDClient] = None
vector_db: Optional[ChromaVectorDB] = None
embedding_service: Optional[EmbeddingService] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup services"""
    global grobid_client, vector_db, embedding_service
    
    # Startup
    logger.info("Starting Gaply Worker...")
    
    try:
        # Initialize GROBID client
        grobid_url = os.getenv("GROBID_URL", "http://localhost:8070")
        grobid_client = GROBIDClient(grobid_url)
        logger.info(f"GROBID client initialized: {grobid_url}")
        
        # Initialize Chroma vector database
        chroma_url = os.getenv("CHROMA_URL", "http://localhost:8000")
        vector_db = ChromaVectorDB(chroma_url)
        logger.info(f"Chroma vector DB initialized: {chroma_url}")
        
        # Initialize embedding service
        embedding_service = EmbeddingService()
        logger.info("Embedding service initialized")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Gaply Worker...")
    if vector_db:
        vector_db.close()

# Create FastAPI app
app = FastAPI(
    title="Gaply Worker",
    description="Python worker service for Gaply research paper analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check if all services are healthy
        grobid_healthy = grobid_client.is_healthy() if grobid_client else False
        vector_db_healthy = vector_db.is_healthy() if vector_db else False
        
        return {
            "status": "healthy",
            "services": {
                "grobid": grobid_healthy,
                "vector_db": vector_db_healthy,
                "embedding_service": embedding_service is not None
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

# Include routers
app.include_router(ingest.router, prefix="/worker", tags=["ingest"])
app.include_router(paraphrase.router, prefix="/worker", tags=["paraphrase"])
app.include_router(summarize.router, prefix="/worker", tags=["summarize"])
app.include_router(proofread.router, prefix="/worker", tags=["proofread"])
app.include_router(gapfind.router, prefix="/worker", tags=["gapfind"])
app.include_router(journal_check.router, prefix="/worker", tags=["journal-check"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    
    logger.info(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
