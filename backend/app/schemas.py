from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class GenerationCreate(BaseModel):
    universe_id: str
    user_id: Optional[str] = None

class CharacterCard(BaseModel):
    name: str
    class_name: str
    level: int
    stats: Dict[str, int]

class GenerationResult(BaseModel):
    generated_image_url: str
    story: str
    character_card: CharacterCard

class GenerationResponse(BaseModel):
    id: str
    status: JobStatus
    progress: int
    result: Optional[GenerationResult] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GenerationCreateResponse(BaseModel):
    job_id: str
    status: JobStatus
