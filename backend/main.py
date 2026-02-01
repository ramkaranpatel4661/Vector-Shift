from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EdgeModel(BaseModel):
    id: Optional[str] = None
    source: str
    target: str


class NodeModel(BaseModel):
    id: str
    type: Optional[str] = None
    position: Optional[dict] = None
    data: Optional[dict] = None


class PipelineParseRequest(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]


def is_dag(nodes: List[dict], edges: List[dict]) -> bool:
    """Check if the pipeline graph is a directed acyclic graph (DAG)."""
    node_ids = {n["id"] for n in nodes}
    if not node_ids:
        return True

    # Build adjacency list: node -> list of outgoing targets
    adj = {nid: [] for nid in node_ids}
    in_degree = {nid: 0 for nid in node_ids}

    for e in edges:
        src = e.get("source")
        tgt = e.get("target")
        if src in node_ids and tgt in node_ids and src != tgt:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # Kahn's algorithm: repeatedly remove nodes with in_degree 0
    queue = [nid for nid in node_ids if in_degree[nid] == 0]
    removed = 0

    while queue:
        u = queue.pop(0)
        removed += 1
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    # If we removed all nodes, there was no cycle (DAG)
    return removed == len(node_ids)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(body: PipelineParseRequest):
    nodes = [n.model_dump() for n in body.nodes]
    edges = [e.model_dump() for e in body.edges]
    num_nodes = len(nodes)
    num_edges = len(edges)
    is_dag_result = is_dag(nodes, edges)
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag_result,
    }
