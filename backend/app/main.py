from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .database import engine, Base
from .api.generations import router as generations_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Parallel Universe AI API", version="1.0.0")

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for serving images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/generated", StaticFiles(directory="generated"), name="generated")

# Include routers
app.include_router(generations_router, prefix="/api", tags=["generations"])

@app.get("/")
def root():
    return {"message": "Parallel Universe AI API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
