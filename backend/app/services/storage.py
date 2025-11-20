import os
import shutil
from fastapi import UploadFile
import uuid
from pathlib import Path

UPLOAD_DIR = Path("uploads")
GENERATED_DIR = Path("generated")

# Create directories if they don't exist
UPLOAD_DIR.mkdir(exist_ok=True)
GENERATED_DIR.mkdir(exist_ok=True)

async def save_upload_file(upload_file: UploadFile) -> str:
    """Save uploaded file and return the file path"""
    file_extension = upload_file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / file_name
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return str(file_path)

def get_generated_path(job_id: str) -> str:
    """Get path for generated image"""
    file_name = f"{job_id}.png"
    return str(GENERATED_DIR / file_name)

def get_file_url(file_path: str, base_url: str = "http://localhost:8000") -> str:
    """Convert file path to URL"""
    return f"{base_url}/{file_path}"
