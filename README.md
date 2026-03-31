# Pipeforge

A visual, drag-and-drop pipeline designer with real-time DAG validation and LLM integration. Build computational workflows by connecting typed nodes, validate the structure, and run AI inference — all in the browser.

**Live demo:** https://pipeforge-beta.vercel.app

---

## Overview

Pipeforge lets you design data processing pipelines visually. Connect nodes of different types (text, math, conditional branching, LLM, logging, and more), validate the pipeline to ensure it forms a valid Directed Acyclic Graph, and run LLM inference directly from the canvas.

**Key capabilities:**
- 9 built-in node types covering input, transformation, branching, AI inference, and output
- Dynamic variable handles on Text nodes via `{{ varName }}` template syntax
- Dual cycle detection — client-side (visual feedback) + server-side (authoritative)
- LLM node with OpenRouter integration — multiple free-tier models
- Undo/Redo (50 steps), Save/Load pipeline to localStorage
- TypeScript throughout, Vite build tooling, Vitest test suite

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Flow 11, Zustand + zundo, TypeScript, Vite |
| Backend | FastAPI, Pydantic v2, Uvicorn, httpx |
| Runtime | Python 3.10+, Node.js 22+ |
| Deployment | Vercel (frontend), Render (backend) |

---

## Node Types

| Node | Purpose |
|---|---|
| **Input** | Entry point — accepts Text or File data |
| **Output** | Exit point — emits Text or Image data |
| **Text** | Template string with dynamic `{{ variable }}` handles |
| **Number** | Numeric constant |
| **Date** | Date picker input |
| **Math** | Safe expression evaluator (mathjs) with live result preview |
| **Condition** | Boolean branch — exposes `true` and `false` output handles |
| **LLM** | Calls OpenRouter API — model selector, system + user prompt, streamed response |
| **Logger** | Debug passthrough — logs incoming value, forwards to next node |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 22+ (use `nvm use 22`)

### 1. Clone and install

```bash
git clone https://github.com/your-username/pipeforge.git
cd pipeforge
make install
```

Or manually:

```bash
# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 2. Configure environment

```bash
# backend/.env
OPENROUTER_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:8000
```

### 3. Start both services

```bash
make dev
```

Or manually in two terminals:

```bash
# Terminal 1
cd backend && .venv/bin/uvicorn main:app --reload --port 8000

# Terminal 2
cd frontend && npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

---

## API Reference

### `POST /pipelines/parse`

Validates a pipeline and returns structural metrics.

**Request**
```json
{
  "nodes": [{ "id": "node-1", "type": "customInput", "data": {}, "position": { "x": 0, "y": 0 } }],
  "edges": [{ "id": "e1", "source": "node-1", "target": "node-2" }]
}
```

**Response**
```json
{ "num_nodes": 2, "num_edges": 1, "is_dag": true }
```

### `POST /pipelines/llm`

Calls an OpenRouter model and returns the response.

**Request**
```json
{ "model": "nvidia/nemotron-3-super-120b-a12b:free", "system": "You are a helpful assistant.", "prompt": "Explain React Server Components" }
```

**Response**
```json
{ "response": "React Server Components are..." }
```

**Quick test**
```bash
curl -s -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{"nodes":[{"id":"n1","type":"customInput","data":{},"position":{"x":0,"y":0}},{"id":"n2","type":"customOutput","data":{},"position":{"x":200,"y":0}}],"edges":[{"id":"e1","source":"n1","target":"n2"}]}' | jq
```

---

## Project Structure

```
pipeforge/
├── Makefile                  # make dev / make install
├── render.yaml               # Render backend deploy config
├── backend/
│   ├── main.py               # FastAPI — /pipelines/parse + /pipelines/llm
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── App.tsx
        ├── store.ts              # Zustand + zundo (undo/redo, save/load)
        ├── ui.tsx                # ReactFlow canvas
        ├── toolbar.tsx           # Draggable node palette
        ├── submit.tsx            # Submit bar — undo/redo, save/load, validate
        ├── detectCycles.ts       # Pure DFS cycle detection (tested)
        ├── detectCycles.test.ts  # Vitest test suite
        ├── ResultModal.tsx
        ├── HelpPanel.tsx
        └── nodes/
            ├── NodeBase.tsx      # Shared base for all node types
            ├── ScrollCapture.tsx # Fixes trackpad scroll inside ReactFlow nodes
            ├── inputNode.tsx
            ├── outputNode.tsx
            ├── textNode.tsx      # Dynamic {{ varName }} handles
            ├── numberNode.tsx
            ├── dateNode.tsx
            ├── mathNode.tsx      # mathjs (lazy loaded)
            ├── conditionNode.tsx
            ├── llmNode.tsx       # OpenRouter integration
            └── loggerNode.tsx
```

---

## Architecture Notes

**Dual cycle detection** — DFS runs client-side for instant visual feedback (cycle nodes highlighted red) and server-side via FastAPI for authoritative validation. Logic lives in `detectCycles.ts` — a pure function with no dependencies, independently tested.

**Dynamic handles** — The Text node parses its template string in real time using `matchAll()` and generates a connection handle for each `{{ varName }}` found, enabling typed variable wiring between nodes.

**NodeBase pattern** — All 9 node types share a common base component handling handle positioning, dark-theme styling, and layout. Adding a new node type is a single file.

**Undo/Redo** — `zundo` wraps the Zustand store with a temporal middleware, partializing to `nodes` and `edges` only. 50-step history limit.

**LLM via backend** — OpenRouter calls go through the FastAPI backend, keeping the API key server-side. The frontend never touches the key.

**Code splitting** — `mathjs` (~650KB) is dynamically imported only when the Math node's Eval button is clicked, keeping the initial bundle under 310KB.

---

## Running Tests

```bash
cd frontend
npm test
```

---

## Deployment

- **Backend**: Render — set `OPENROUTER_API_KEY` and `ALLOWED_ORIGINS` env vars
- **Frontend**: Vercel — set `VITE_API_URL` to your Render backend URL
- Both auto-deploy on `git push` to `main`

---

## License

MIT
