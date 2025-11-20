from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks, Header, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from ..database import get_db
from ..models import Generation, JobStatus
from ..schemas import GenerationCreateResponse, GenerationResponse, GenerationResult, CharacterCard
from ..services.storage import save_upload_file, get_generated_path, get_file_url
from ..services.ai_service import ai_service

router = APIRouter()

@router.post("/generations", response_model=GenerationCreateResponse)
async def create_generation(
    request: Request,
    background_tasks: BackgroundTasks,
    universe_id: str = Form(...),
    image: UploadFile = File(...),
    x_device_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Create a new generation job"""
    
    # Save uploaded image
    image_path = await save_upload_file(image)
    
    # Use device ID from header or None
    user_id = x_device_id
    
    # Create database record
    generation = Generation(
        universe_id=universe_id,
        user_id=user_id,
        original_image_path=image_path,
        status=JobStatus.PENDING
    )
    
    db.add(generation)
    db.commit()
    db.refresh(generation)
    
    # Get base URL from request
    base_url = str(request.base_url).rstrip('/')
    
    # Start async processing with BackgroundTasks
    background_tasks.add_task(process_generation, generation.id, base_url)
    
    return GenerationCreateResponse(
        job_id=generation.id,
        status=generation.status
    )

def process_generation(job_id: str, base_url: str):
    """Background task to process the generation"""
    from ..database import SessionLocal
    
    db = SessionLocal()
    
    try:
        # Get the generation record
        generation = db.query(Generation).filter(Generation.id == job_id).first()
        if not generation:
            return
        
        # Update status to processing
        generation.status = JobStatus.PROCESSING
        generation.progress = 10
        db.commit()
        
        # Generate avatar image (synchronous in background task)
        generated_path = get_generated_path(job_id)
        import asyncio
        asyncio.run(ai_service.generate_avatar(
            generation.original_image_path,
            generation.universe_id,
            generated_path
        ))
        generation.generated_image_path = generated_path
        generation.progress = 60
        db.commit()
        
        # Generate story
        story = ai_service.generate_story(generation.universe_id)
        generation.story = story
        generation.progress = 80
        db.commit()
        
        # Generate character card
        character_card = ai_service.generate_character_card(generation.universe_id)
        generation.character_card = json.dumps(character_card)
        generation.progress = 100
        generation.status = JobStatus.COMPLETED
        db.commit()
        
    except Exception as e:
        generation.status = JobStatus.FAILED
        generation.progress = 0
        db.commit()
        print(f"Error processing generation {job_id}: {e}")
    finally:
        db.close()

@router.get("/generations/{generation_id}", response_model=GenerationResponse)
def get_generation(generation_id: str, request: Request, db: Session = Depends(get_db)):
    """Get generation status and result"""
    
    generation = db.query(Generation).filter(Generation.id == generation_id).first()
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    
    base_url = str(request.base_url).rstrip('/')
    
    result = None
    if generation.status == JobStatus.COMPLETED:
        character_card_data = json.loads(generation.character_card) if generation.character_card else {}
        
        result = GenerationResult(
            generated_image_url=get_file_url(generation.generated_image_path, base_url),
            story=generation.story,
            character_card=CharacterCard(**character_card_data)
        )
    
    return GenerationResponse(
        id=generation.id,
        status=generation.status,
        progress=generation.progress,
        result=result,
        created_at=generation.created_at,
        updated_at=generation.updated_at
    )

@router.get("/generations/user/{user_id}", response_model=List[GenerationResponse])
def get_user_generations(user_id: str, request: Request, db: Session = Depends(get_db)):
    """Get all generations for a user"""
    
    generations = db.query(Generation).filter(Generation.user_id == user_id).all()
    
    base_url = str(request.base_url).rstrip('/')
    
    response_list = []
    for gen in generations:
        result = None
        if gen.status == JobStatus.COMPLETED:
            character_card_data = json.loads(gen.character_card) if gen.character_card else {}
            result = GenerationResult(
                generated_image_url=get_file_url(gen.generated_image_path, base_url),
                story=gen.story,
                character_card=CharacterCard(**character_card_data)
            )
        
        response_list.append(GenerationResponse(
            id=gen.id,
            status=gen.status,
            progress=gen.progress,
            result=result,
            created_at=gen.created_at,
            updated_at=gen.updated_at
        ))
    
    return response_list
