import httpx
import logging
from typing import Optional, Dict, Any
import xml.etree.ElementTree as ET

logger = logging.getLogger(__name__)

class GROBIDClient:
    """
    Client for interacting with GROBID service
    """
    
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(timeout=300.0)  # 5 minutes timeout
        
    async def is_healthy(self) -> bool:
        """Check if GROBID service is healthy"""
        try:
            response = await self.client.get(f"{self.base_url}/api/isalive")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"GROBID health check failed: {e}")
            return False
    
    async def process_fulltext_document(self, pdf_content: bytes, filename: str) -> Optional[str]:
        """
        Process a PDF document and return TEI XML
        """
        try:
            files = {'input': (filename, pdf_content, 'application/pdf')}
            data = {'consolidateHeader': '1', 'consolidateCitations': '1'}
            
            response = await self.client.post(
                f"{self.base_url}/api/processFulltextDocument",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                return response.text
            else:
                logger.error(f"GROBID processing failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error processing document with GROBID: {e}")
            return None
    
    async def process_header_document(self, pdf_content: bytes, filename: str) -> Optional[Dict[str, Any]]:
        """
        Process a PDF document header and return metadata
        """
        try:
            files = {'input': (filename, pdf_content, 'application/pdf')}
            
            response = await self.client.post(
                f"{self.base_url}/api/processHeaderDocument",
                files=files
            )
            
            if response.status_code == 200:
                # Parse TEI XML to extract metadata
                return self._parse_tei_metadata(response.text)
            else:
                logger.error(f"GROBID header processing failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error processing header with GROBID: {e}")
            return None
    
    def _parse_tei_metadata(self, tei_xml: str) -> Dict[str, Any]:
        """
        Parse TEI XML to extract metadata
        """
        try:
            root = ET.fromstring(tei_xml)
            
            # Extract title
            title_elem = root.find('.//{http://www.tei-c.org/ns/1.0}title')
            title = title_elem.text if title_elem is not None else ""
            
            # Extract authors
            authors = []
            for author_elem in root.findall('.//{http://www.tei-c.org/ns/1.0}author'):
                pers_name = author_elem.find('.//{http://www.tei-c.org/ns/1.0}persName')
                if pers_name is not None:
                    forename = pers_name.find('.//{http://www.tei-c.org/ns/1.0}forename')
                    surname = pers_name.find('.//{http://www.tei-c.org/ns/1.0}surname')
                    if forename is not None and surname is not None:
                        authors.append(f"{forename.text} {surname.text}")
            
            # Extract abstract
            abstract_elem = root.find('.//{http://www.tei-c.org/ns/1.0}abstract')
            abstract = abstract_elem.text if abstract_elem is not None else ""
            
            # Extract publication date
            date_elem = root.find('.//{http://www.tei-c.org/ns/1.0}date')
            date = date_elem.text if date_elem is not None else ""
            
            return {
                'title': title,
                'authors': authors,
                'abstract': abstract,
                'date': date
            }
            
        except Exception as e:
            logger.error(f"Error parsing TEI metadata: {e}")
            return {}
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
