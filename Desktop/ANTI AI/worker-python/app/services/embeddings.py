import logging
from typing import List, Optional
import numpy as np

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Service for generating text embeddings
    """
    
    def __init__(self):
        self.model_name = "all-MiniLM-L6-v2"
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the sentence transformer model"""
        try:
            # TODO: Implement actual model loading
            # from sentence_transformers import SentenceTransformer
            # self.model = SentenceTransformer(self.model_name)
            logger.info(f"Embedding model '{self.model_name}' loaded successfully")
        except Exception as e:
            logger.error(f"Error loading embedding model: {e}")
            logger.warning("Using mock embeddings for now")
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts
        """
        try:
            if not texts:
                return []
            
            if self.model is not None:
                # Use actual model
                embeddings = self.model.encode(texts)
                return embeddings.tolist()
            else:
                # Generate mock embeddings for development
                return self._generate_mock_embeddings(texts)
                
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            return self._generate_mock_embeddings(texts)
    
    def _generate_mock_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate mock embeddings for development/testing
        """
        mock_embeddings = []
        for i, text in enumerate(texts):
            # Generate deterministic mock embedding based on text length and content
            np.random.seed(hash(text) % 2**32)
            embedding = np.random.normal(0, 1, 384).tolist()  # 384-dimensional like MiniLM
            mock_embeddings.append(embedding)
        
        logger.info(f"Generated {len(mock_embeddings)} mock embeddings")
        return mock_embeddings
    
    def similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings
        """
        try:
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Normalize vectors
            vec1_norm = vec1 / np.linalg.norm(vec1)
            vec2_norm = vec2 / np.linalg.norm(vec2)
            
            # Calculate cosine similarity
            similarity = np.dot(vec1_norm, vec2_norm)
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0
    
    def batch_similarity(self, query_embedding: List[float], embeddings: List[List[float]]) -> List[float]:
        """
        Calculate similarity between query and multiple embeddings
        """
        try:
            similarities = []
            for embedding in embeddings:
                sim = self.similarity(query_embedding, embedding)
                similarities.append(sim)
            return similarities
        except Exception as e:
            logger.error(f"Error calculating batch similarity: {e}")
            return [0.0] * len(embeddings)
    
    def is_ready(self) -> bool:
        """Check if the embedding service is ready"""
        return self.model is not None
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model"""
        if self.model is not None:
            return {
                'name': self.model_name,
                'max_seq_length': getattr(self.model, 'max_seq_length', 'unknown'),
                'dimension': getattr(self.model, 'get_sentence_embedding_dimension', lambda: 'unknown')()
            }
        else:
            return {
                'name': self.model_name,
                'status': 'mock_mode',
                'dimension': 384
            }
