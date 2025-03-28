import os
import uuid
import hashlib
from typing import Dict, List, Optional, Tuple

import asyncio
import aiofiles
import aiohttp
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func

# Image processing libraries
from PIL import Image
import exif
import imagehash
import face_recognition
import numpy as np

# Metadata extraction
from pypdf import PdfReader
from docx import Document
from exif import Image as ExifImage

# Cloud storage integration
import boto3
from botocore.exceptions import ClientError

# Machine learning for image analysis
from transformers import pipeline

# Async database configuration
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/silakbo_photos"
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# SQLAlchemy Base
Base = declarative_base()

# Photo Metadata Model
class PhotoMetadata(Base):
    __tablename__ = "photo_metadata"

    id = sa.Column(sa.UUID, primary_key=True, default=uuid.uuid4)
    filename = sa.Column(sa.String, nullable=False)
    original_path = sa.Column(sa.String)
    storage_path = sa.Column(sa.String, nullable=False)
    file_hash = sa.Column(sa.String, unique=True)
    mime_type = sa.Column(sa.String)
    file_size = sa.Column(sa.Integer)
    
    # Image specific metadata
    width = sa.Column(sa.Integer)
    height = sa.Column(sa.Integer)
    color_palette = sa.Column(sa.JSON)
    dominant_colors = sa.Column(sa.JSON)
    
    # Perceptual hash for duplicate detection
    phash = sa.Column(sa.String)
    
    # Facial recognition
    detected_faces = sa.Column(sa.JSON)
    
    # AI-powered tags and description
    ai_tags = sa.Column(sa.JSON)
    ai_description = sa.Column(sa.String)
    
    # EXIF metadata
    camera_make = sa.Column(sa.String)
    camera_model = sa.Column(sa.String)
    capture_date = sa.Column(sa.DateTime)
    gps_info = sa.Column(sa.JSON)
    
    # Timestamps
    created_at = sa.Column(sa.DateTime, server_default=func.now())
    updated_at = sa.Column(sa.DateTime, onupdate=func.now())

# Pydantic models for request/response
class PhotoUploadRequest(BaseModel):
    article_id: Optional[uuid.UUID] = None
    tags: List[str] = []
    description: Optional[str] = None

class PhotoMetadataResponse(BaseModel):
    id: uuid.UUID
    filename: str
    storage_path: str
    file_size: int
    width: int
    height: int
    ai_tags: List[str]
    ai_description: str

# Image Processing Service
class ImageProcessingService:
    def __init__(self, storage_path: str = "/app/uploads"):
        self.storage_path = storage_path
        self.s3_client = boto3.client('s3')
        self.bucket_name = 'silakbo-photos'
        
        # AI models
        self.image_classifier = pipeline("image-classification")
        self.image_captioner = pipeline("image-to-text")

    async def process_image(self, file: UploadFile) -> Dict:
        """
        Comprehensive image processing workflow
        """
        # Generate unique filename
        file_ext = file.filename.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        local_path = os.path.join(self.storage_path, unique_filename)

        # Save file locally first
        async with aiofiles.open(local_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        try:
            # Open image with Pillow
            with Image.open(local_path) as img:
                # Basic image metadata
                width, height = img.size
                file_size = os.path.getsize(local_path)
                
                # Perceptual hash for duplicate detection
                phash = str(imagehash.phash(img))
                
                # Color palette extraction
                color_palette = self._extract_color_palette(img)
                
                # Facial recognition
                detected_faces = self._detect_faces(local_path)
                
                # EXIF metadata extraction
                exif_data = self._extract_exif_metadata(local_path)
                
                # AI-powered analysis
                ai_tags = self._get_ai_tags(local_path)
                ai_description = self._generate_image_description(local_path)

                # Upload to S3
                s3_path = self._upload_to_s3(local_path, unique_filename)

                # Prepare metadata for database
                metadata = {
                    'filename': file.filename,
                    'original_path': local_path,
                    'storage_path': s3_path,
                    'file_hash': hashlib.md5(content).hexdigest(),
                    'mime_type': file.content_type,
                    'file_size': file_size,
                    'width': width,
                    'height': height,
                    'phash': phash,
                    'color_palette': color_palette,
                    'detected_faces': detected_faces,
                    'ai_tags': ai_tags,
                    'ai_description': ai_description,
                    **exif_data
                }

                return metadata

        except Exception as e:
            # Clean up local file in case of processing error here
            os.remove(local_path)
            raise HTTPException(status_code=500, detail=str(e))

    def _extract_color_palette(self, img: Image) -> List[str]:
        """
        Extract dominant colors from image
        """
        # Resize image for faster processing
        img = img.convert('RGB').resize((150, 150))
        
        # Use k-means for color clustering
        img_array = np.array(img)
        img_array = img_array.reshape(-1, 3)
        
        # Perform k-means clustering
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=5).fit(img_array)
        
        # Convert cluster centers to hex colors
        colors = ['#%02x%02x%02x' % tuple(map(int, center)) for center in kmeans.cluster_centers_]
        return colors

    def _detect_faces(self, image_path: str) -> List[Dict]:
        """
        Detect faces in image using face_recognition
        """
        img = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(img)
        
        faces = []
        for (top, right, bottom, left) in face_locations:
            faces.append({
                'location': {'top': top, 'right': right, 'bottom': bottom, 'left': left},
                'confidence': 1.0  # Basic implementation
            })
        
        return faces

    def _extract_exif_metadata(self, image_path: str) -> Dict:
        """
        Extract EXIF metadata from image
        """
        try:
            with open(image_path, 'rb') as img_file:
                img = ExifImage(img_file)
                
                return {
                    'camera_make': getattr(img, 'make', None),
                    'camera_model': getattr(img, 'model', None),
                    'capture_date': getattr(img, 'datetime', None),
                    'gps_info': self._extract_gps_info(img) if hasattr(img, 'gps_latitude') else None
                }
        except Exception:
            return {}

    def _extract_gps_info(self, img: ExifImage) -> Dict:
        """
        Extract GPS information from EXIF
        """
        def convert_to_decimal(coordinate, reference):
            degrees, minutes, seconds = coordinate
            decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
            return -decimal if reference in ['S', 'W'] else decimal

        return {
            'latitude': convert_to_decimal(img.gps_latitude, img.gps_latitude_ref),
            'longitude': convert_to_decimal(img.gps_longitude, img.gps_longitude_ref)
        }

    def _get_ai_tags(self, image_path: str) -> List[str]:
        """
        Use AI to generate image tags
        """
        try:
            tags = self.image_classifier(image_path)
            return [tag['label'] for tag in tags[:5]]  # Top 5 tags
        except Exception:
            return []

    def _generate_image_description(self, image_path: str) -> str:
        """
        Generate AI-powered image description
        """
        try:
            descriptions = self.image_captioner(image_path)
            return descriptions[0]['generated_text'] if descriptions else ""
        except Exception:
            return ""

    def _upload_to_s3(self, local_path: str, filename: str) -> str:
        """
        Upload file to S3 with intelligent storage strategy
        """
        try:
            # Determine storage path based on current date
            from datetime import datetime
            today = datetime.now()
            s3_path = f"uploads/{today.year}/{today.month:02d}/{filename}"
            
            self.s3_client.upload_file(
                local_path, 
                self.bucket_name, 
                s3_path,
                ExtraArgs={'ContentType': 'image/jpeg'}
            )
            
            return f"s3://{self.bucket_name}/{s3_path}"
        except ClientError as e:
            # Log error, but don't prevent further processing
            print(f"S3 Upload Error: {e}")
            return local_path

# FastAPI Application
app = FastAPI(title="Silakbo Photo Service")

@app.post("/upload", response_model=PhotoMetadataResponse)
async def upload_photo(
    file: UploadFile = File(...), 
    metadata: PhotoUploadRequest = None
):
    """
    Comprehensive photo upload endpoint
    """
    processing_service = ImageProcessingService()
    
    # Process image
    photo_metadata = await processing_service.process_image(file)
    
    # Save to database
    async with AsyncSessionLocal() as session:
        db_metadata = PhotoMetadata(**photo_metadata)
        session.add(db_metadata)
        await session.commit()
        await session.refresh(db_metadata)
    
    return PhotoMetadataResponse(
        id=db_metadata.id,
        filename=db_metadata.filename,
        storage_path=db_metadata.storage_path,
        file_size=db_metadata.file_size,
        width=db_metadata.width,
        height=db_metadata.height,
        ai_tags=db_metadata.ai_tags,
        ai_description=db_metadata.ai_description
    )

@app.get("/photos/{photo_id}", response_model=PhotoMetadataResponse)
async def get_photo_metadata(photo_id: uuid.UUID):
    """
    Retrieve photo metadata
    """
    async with AsyncSessionLocal() as session:
        result = await session.get(PhotoMetadata, photo_id)
        if not result:
            raise HTTPException(status_code=404, detail="Photo not found")
        return result

# Duplicate Detection Service
class DuplicateDetectionService:
    @staticmethod
    async def is_duplicate(file_hash: str, phash: str) -> bool:
        """
        Check if photo is a duplicate using file hash and perceptual hash
        """
        async with AsyncSessionLocal() as session:
            existing_photo = await session.execute(
                sa.select(PhotoMetadata)
                .where(
                    (PhotoMetadata.file_hash == file_hash) | 
                    (PhotoMetadata.phash == phash)
                )
            )
            return existing_photo.first() is not None

# Startup and Shutdown Events
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
