import chromadb
import logging
from typing import List, Dict, Any, Optional
import uuid

logger = logging.getLogger(__name__)

class ChromaVectorDB:
    """
    Client for interacting with Chroma vector database
    """
    
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.client = chromadb.HttpClient(host=self.base_url)
        self.collection_name = "gaply_papers"
        self._ensure_collection()
    
    def _ensure_collection(self):
        """Ensure the collection exists"""
        try:
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"description": "Research paper chunks and embeddings"}
            )
            logger.info(f"Chroma collection '{self.collection_name}' ready")
        except Exception as e:
            logger.error(f"Error ensuring Chroma collection: {e}")
            raise
    
    def is_healthy(self) -> bool:
        """Check if Chroma service is healthy"""
        try:
            # Try to get collection info
            self.client.get_collection(self.collection_name)
            return True
        except Exception as e:
            logger.error(f"Chroma health check failed: {e}")
            return False
    
    def add_chunks(self, paper_id: str, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> bool:
        """
        Add paper chunks with embeddings to the vector database
        """
        try:
            if not chunks or not embeddings:
                logger.warning("No chunks or embeddings provided")
                return False
            
            # Prepare data for Chroma
            ids = [f"{paper_id}_{i}" for i in range(len(chunks))]
            documents = [chunk['text'] for chunk in chunks]
            metadatas = [
                {
                    'paper_id': paper_id,
                    'chunk_id': chunk['chunk_id'],
                    'page': chunk['page'],
                    'paragraph_index': chunk['paragraph_index'],
                    'sentence_index': chunk['sentence_index'],
                    'doi': chunk.get('doi', ''),
                    'title': chunk.get('title', '')
                }
                for chunk in chunks
            ]
            
            # Add to collection
            self.collection.add(
                ids=ids,
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas
            )
            
            logger.info(f"Added {len(chunks)} chunks for paper {paper_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding chunks to Chroma: {e}")
            return False
    
    def search_chunks(self, query: str, n_results: int = 10, filter_dict: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """
        Search for similar chunks using vector similarity
        """
        try:
            # For now, return mock results since we don't have embeddings yet
            # TODO: Implement actual vector search when embeddings are available
            
            logger.info(f"Searching for chunks with query: {query}")
            
            # Mock search results
            mock_results = [
                {
                    'chunk_id': 'mock-chunk-1',
                    'text': f'Mock chunk containing "{query}"',
                    'paper_id': 'mock-paper-1',
                    'page': 1,
                    'paragraph_index': 1,
                    'sentence_index': 1,
                    'distance': 0.1
                }
            ]
            
            return mock_results[:n_results]
            
        except Exception as e:
            logger.error(f"Error searching chunks in Chroma: {e}")
            return []
    
    def get_chunk_by_id(self, chunk_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a specific chunk by ID
        """
        try:
            # TODO: Implement actual retrieval
            return None
        except Exception as e:
            logger.error(f"Error retrieving chunk {chunk_id}: {e}")
            return None
    
    def delete_paper_chunks(self, paper_id: str) -> bool:
        """
        Delete all chunks for a specific paper
        """
        try:
            # TODO: Implement actual deletion
            logger.info(f"Deleted chunks for paper {paper_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting chunks for paper {paper_id}: {e}")
            return False
    
    def close(self):
        """Close the Chroma client"""
        try:
            self.client.reset()
            logger.info("Chroma client closed")
        except Exception as e:
            logger.error(f"Error closing Chroma client: {e}")
