# Parallel Universe AI Backend

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST /api/generations
Create a new generation job
- **Headers**: 
  - `x-device-id`: (Optional) Unique device identifier for tracking user generations
- **Form Data**: 
  - `universe_id`: ID of the selected universe (cyberpunk, medieval, samurai, viking, anime)
  - `image`: Image file to transform
- **Response**: `{ "job_id": "uuid", "status": "PENDING" }`

**Example with curl:**
```bash
curl -X POST http://localhost:8000/api/generations \
  -H "x-device-id: your-unique-device-id" \
  -F "universe_id=cyberpunk" \
  -F "image=@/path/to/your/image.jpg"
```

### GET /api/generations/{id}
Get generation status and result
- **Response**: Generation details with status, progress, and result (if completed)

**Example:**
```bash
curl http://localhost:8000/api/generations/{job_id}
```

### GET /api/generations/user/{user_id}
Get all generations for a user (using device ID)
- **Response**: Array of generation records

**Example:**
```bash
curl http://localhost:8000/api/generations/user/your-unique-device-id
```

## Features

### ✅ BackgroundTasks
Uses FastAPI's built-in BackgroundTasks for safe async job processing

### ✅ Device ID Tracking
Anonymous user tracking via `x-device-id` header - no authentication required

### ✅ Dynamic URLs
Image URLs automatically adjust based on server's base URL (works with localhost, remote servers, ngrok, etc.)

### ✅ Turkish Story Templates
Engaging, narrative-driven stories in Turkish for each universe

## Database

SQLite database file: `parallel_universe.db`

## Mock AI Service

The current implementation uses a **dual-mode AI service**:

### Real AI Mode (Replicate)
When `REPLICATE_API_TOKEN` is set in `.env`:
- Uses Stable Diffusion SDXL for image generation
- High quality AI-generated avatars
- ~10-15 seconds processing time
- Costs ~$0.01-0.02 per image

### Mock Mode (Fallback)
When API token is not set:
- Creates placeholder images
- Generates template-based stories
- 3 seconds processing time
- Free

## Setup Replicate

1. Get API key from https://replicate.com/account/api-tokens
2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env and add: REPLICATE_API_TOKEN=r8_xxxxx
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Restart server

See `REPLICATE_SETUP.md` for detailed instructions.

## To Integrate Real AI

The frontend should:
1. Generate a UUID on first launch and store in AsyncStorage
2. Send this UUID in `x-device-id` header with every request
3. Poll `GET /api/generations/{id}` every 2-3 seconds to check status
4. Display result when status is "COMPLETED"

## To Integrate Real AI

Replace `MockAIService` in `app/services/ai_service.py` with:
- Stable Diffusion API for image generation
- OpenAI GPT for story generation
- Custom trained models
