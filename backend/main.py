import os
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
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


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


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse', response_model=PipelineResult)
def parse_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges

    num_nodes = len(nodes)
    num_edges = len(edges)

    # build adjacency list for directed graph (source -> target)
    adj: Dict[str, List[str]] = {n.id: [] for n in nodes}

    for e in edges:
        if e.source not in adj:
            adj[e.source] = []
        adj[e.source].append(e.target)

    # detect cycles with DFS
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

    cycle_found = False
    for node_id in list(adj.keys()):
        if node_id not in visited:
            if has_cycle(node_id):
                cycle_found = True
                break

    return PipelineResult(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=not cycle_found,
    )
