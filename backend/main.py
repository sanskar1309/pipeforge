import os
import httpx
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

app = FastAPI()

_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


# ── Pipeline models ────────────────────────────────────────────────────────────

class NodeModel(BaseModel):
    id: str
    type: Optional[str] = None
    data: Dict[str, Any] = {}
    position: Dict[str, Any] = {}


class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelinePayload(BaseModel):
    nodes: List[NodeModel] = []
    edges: List[EdgeModel] = []


class PipelineResult(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


# ── LLM models ─────────────────────────────────────────────────────────────────

class LLMRequest(BaseModel):
    model: str
    system: str = ""
    prompt: str


class LLMResponse(BaseModel):
    response: str


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse', response_model=PipelineResult)
def parse_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges

    adj: Dict[str, List[str]] = {n.id: [] for n in nodes}
    for e in edges:
        if e.source not in adj:
            adj[e.source] = []
        adj[e.source].append(e.target)

    visited: set = set()
    recstack: set = set()

    def has_cycle(v: str) -> bool:
        if v in recstack:
            return True
        if v in visited:
            return False
        visited.add(v)
        recstack.add(v)
        for nei in adj.get(v, []):
            if has_cycle(nei):
                return True
        recstack.remove(v)
        return False

    cycle_found = any(
        has_cycle(node_id)
        for node_id in list(adj.keys())
        if node_id not in visited
    )

    return PipelineResult(
        num_nodes=len(nodes),
        num_edges=len(edges),
        is_dag=not cycle_found,
    )


@app.post('/pipelines/llm', response_model=LLMResponse)
async def call_llm(req: LLMRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY not configured")

    messages = []
    if req.system.strip():
        messages.append({"role": "system", "content": req.system})
    messages.append({"role": "user", "content": req.prompt})

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={"model": req.model, "messages": messages},
        )

    if resp.status_code == 429:
        raise HTTPException(status_code=429, detail="Rate limited — wait a moment and try again")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json()
    text: str = data["choices"][0]["message"]["content"]
    return LLMResponse(response=text)
