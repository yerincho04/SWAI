#!/usr/bin/env python3
"""FastAPI web server for the DB chatbot."""

from __future__ import annotations

import os
import time
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from chat_app import run_once


ROOT = Path(__file__).resolve().parent.parent
BUILD_DIR = ROOT / "db_chatbot" / "build_api_selected"
API_DATA_ROOT = ROOT / "db_chatbot" / "api_data"

app = FastAPI(title="DB Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str
    brand_name: str = ""
    model: str = "gpt-4.1-mini"


@app.get("/")
@app.get("/health")
def health():
    return {"ok": True, "service": "db_chatbot"}


@app.post("/api/chat")
def chat(body: ChatRequest):
    query = body.query.strip()
    brand_name = body.brand_name.strip()

    if not query:
        return JSONResponse(status_code=400, content={"error": "Missing query."})

    full_query = query
    if brand_name and brand_name not in query:
        full_query = f"{brand_name} 브랜드 기준으로 답변해줘. 질문: {query}"

    started_at = time.perf_counter()
    try:
        answer = run_once(
            full_query,
            model=body.model,
            source_mode="build",
            build_dir=BUILD_DIR,
            api_data_root=API_DATA_ROOT,
            load_enrichment=False,
        )
    except Exception as exc:
        elapsed = time.perf_counter() - started_at
        print(f"Chat request failed after {elapsed:.2f}s: {exc}")
        return JSONResponse(status_code=500, content={"error": str(exc)})

    elapsed = time.perf_counter() - started_at
    print(f"Chat request completed in {elapsed:.2f}s for brand='{brand_name or '-'}'")
    return {"answer": answer, "brand_name": brand_name}


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8001"))
    uvicorn.run("web_api:app", host=host, port=port, reload=False)
