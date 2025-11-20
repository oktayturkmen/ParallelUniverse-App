from sqlalchemy import Column, String, Integer, Text, DateTime, Enum as SQLEnum
from datetime import datetime
import uuid
import enum
from .database import Base

class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Generation(Base):
    __tablename__ = "generations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=True)
    universe_id = Column(String, nullable=False)
    original_image_path = Column(String, nullable=False)
    generated_image_path = Column(String, nullable=True)
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING)
    progress = Column(Integer, default=0)
    story = Column(Text, nullable=True)
    character_card = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
