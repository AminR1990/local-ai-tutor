# Local AI Tutor

Full-stack local AI tutor built with **Next.js** (port 3000), **FastAPI** (port 8000), and **Ollama** (`qwen3.5:4b` on Windows RTX 4050) connected over WSL2 (`172.26.112.1:11434`).

## Run Locally
- Backend: `cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000`
- Frontend: `cd frontend && npm run dev`
