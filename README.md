# Pipeline Builder

A visual, drag-and-drop pipeline designer with real-time DAG validation. Build complex computational workflows by connecting typed nodes, then submit to a FastAPI backend for structural analysis.

![Pipeline Builder Demo](https://via.placeholder.com/900x500?text=Pipeline+Builder+Demo)

---

## Overview

Pipeline Builder lets you design data processing workflows visually — no code required. Connect nodes of different types (text processing, math, conditional branching, LLM, logging, and more), then validate the pipeline to ensure it forms a valid Directed Acyclic Graph (no circular dependencies).

**Key capabilities:**
- 9 built-in node types covering data input, transformation, branching, and output
- Dynamic variable handles on Text nodes via `{{ varName }}` template syntax
- Client-side cycle detection with visual highlighting of problematic edges
- FastAPI backend for authoritative DAG validation
- Dark-themed, responsive UI with minimap and zoom controls

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Flow 11, Zustand |
| Backend | FastAPI, Pydantic v2, Uvicorn |
| Runtime | Python 3.8+, Node.js 14+ |

---

## Node Types

| Node | Purpose |
|---|---|
| **Input** | Entry point — accepts Text or File data |
| **Output** | Exit point — emits Text or Image data |
| **Text** | Template string with dynamic `{{ variable }}` handles |
| **Number** | Numeric constant |
| **Date** | Date picker input |
| **Math** | Expression evaluator with live result preview |
| **Condition** | Boolean branch — exposes `true` and `false` output handles |
| **LLM** | Language model placeholder node |
| **Logger** | Debug/logging passthrough |

---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+ and npm

### 1. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will open automatically at `http://localhost:3000`.

> Both services must run simultaneously for full functionality.

---

## API Reference

### `POST /pipelines/parse`

Validates a pipeline and returns structural metrics.

**Request**
```json
{
  "nodes": [{ "id": "node-1" }, { "id": "node-2" }],
  "edges": [{ "source": "node-1", "target": "node-2" }]
}
```

**Response**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

**Quick test**
```bash
curl -s -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{"nodes":[{"id":"n1"},{"id":"n2"}],"edges":[{"source":"n1","target":"n2"}]}' | jq
```

---

## Project Structure

```
.
├── backend/
│   └── main.py          # FastAPI app — /pipelines/parse endpoint + DAG validation
└── frontend/
    └── src/
        ├── App.js
        ├── store.js         # Zustand store — nodes, edges, ReactFlow instance
        ├── ui.js            # ReactFlow canvas (drag-drop, snap-to-grid)
        ├── toolbar.js       # Draggable node type palette
        ├── submit.js        # Submit button + client-side cycle detection
        ├── ResultModal.js   # Validation results overlay
        ├── HelpPanel.js     # Toggleable help sidebar
        └── nodes/
            ├── NodeBase.js       # Shared base for all node types
            ├── inputNode.js
            ├── outputNode.js
            ├── textNode.js
            ├── numberNode.js
            ├── dateNode.js
            ├── mathNode.js
            ├── conditionNode.js
            ├── llmNode.js
            └── loggerNode.js
```

---

## Architecture Notes

**Dual cycle detection** — Cycle detection runs both client-side (immediate visual feedback, DFS on the frontend) and server-side (authoritative DAG validation via FastAPI). This separates UX responsiveness from correctness guarantees.

**Dynamic handles** — The Text node parses its template string in real time and generates connection handles for each `{{ varName }}` it finds, enabling typed variable wiring between nodes.

**NodeBase pattern** — All 9 node types share a common base component that handles handle positioning, dark-theme styling, and consistent layout. Adding a new node type requires only a new component file.

**Stateless backend** — The backend performs no persistence. It accepts a pipeline snapshot, validates it, and returns results. All state lives in the React frontend via Zustand.

---

## Development Notes

- CORS is fully open on the backend — tighten for any non-local deployment
- Math node uses `eval()` for expression parsing — not safe for untrusted user input in production
- Default ports: backend `8000`, frontend `3000` — both are hardcoded in the frontend fetch call

---

## Roadmap

- [ ] Pipeline persistence (save/load as JSON)
- [ ] Live pipeline execution (not just validation)
- [ ] LLM node integration with real model APIs
- [ ] Node configuration panels (expanded settings per node)
- [ ] Export pipeline as code
- [ ] Authentication and multi-user support
- [ ] Docker Compose for one-command startup

---

## License

MIT
