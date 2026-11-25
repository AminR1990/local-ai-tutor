import os
import subprocess
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_ollama_url() -> str:
    if os.getenv("OLLAMA_URL"):
        return os.getenv("OLLAMA_URL").rstrip("/")
    try:
        ip = subprocess.check_output(
            ["sh", "-c", "ip route show | awk '/default/ {print $3}'"],
            text=True,
        ).strip()
        if ip:
            return f"http://{ip}:11434"
    except Exception:
        pass
    return "http://localhost:11434"

OLLAMA_BASE_URL = get_ollama_url()

class PromptRequest(BaseModel):
    question: str

@app.post("/api/ask")
async def ask_ai(req: PromptRequest):
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": "qwen3.5:4b",
                "prompt": f"You are a helpful CS tutor. Answer clearly:\n\n{req.question}",
                "stream": False,
            },
        )
        response.raise_for_status()
        data = response.json()
        return {"answer": data.get("response", "No response from model.")}
