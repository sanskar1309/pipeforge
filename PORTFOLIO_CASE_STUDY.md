# Pipeline Builder — Portfolio Case Study

## What I Built

Pipeline Builder is a full-stack visual workflow designer that lets users construct and validate computational pipelines through a drag-and-drop canvas. Users compose pipelines from typed nodes — data inputs, text templates, math evaluators, conditional branches, LLM placeholders, and logging points — connect them with directional edges, and submit the graph for structural validation.

The core validation question the app answers: **Is this pipeline a valid Directed Acyclic Graph?** If not, where are the cycles?

---

## The Problem

Modern AI and data workflows are increasingly graph-shaped — inputs feed into transformations, transformations branch on conditions, branches converge at outputs. Designing these visually (rather than writing YAML or JSON by hand) dramatically lowers the iteration cost. But a visual editor is only useful if it can catch invalid states — specifically circular dependencies, which cause pipelines to hang or produce undefined behavior.

I built this as a focused demonstration of the full problem: interactive graph editing, typed node abstraction, and server-backed structural validation.

---

## Technical Decisions

### React Flow for graph rendering

React Flow handles the rendering, drag/drop, edge drawing, and pan/zoom that would otherwise require hundreds of lines of custom canvas code. My job was to build on top of it — defining the node type system, handle positioning logic, and state integration — rather than solving graph layout primitives from scratch. This was a deliberate scope decision: the interesting engineering problems here are the node architecture and validation logic, not SVG hit-testing.

### Zustand over Redux or Context

The app's state is simple: a list of nodes, a list of edges, and the ReactFlow instance reference. Redux would introduce unnecessary boilerplate. React Context re-renders the entire tree on any state change. Zustand provides direct subscriptions per-selector — only the component that cares about `nodes` re-renders when nodes change. The entire store is ~50 lines.

### Dual cycle detection

I implemented cycle detection twice — once on the frontend (in `submit.js`), once on the backend (in `main.py`). This was intentional:

- **Frontend DFS** runs the moment the user clicks Submit, before the network round-trip completes. It immediately highlights problematic nodes and edges in red, giving the user visual feedback with zero latency.
- **Backend DFS** is authoritative. It validates the canonical structure of the pipeline as the backend sees it, independent of any client-side state.

The two should always agree. If they don't, it surfaces a serialization bug — which is a useful invariant to have.

### Dynamic handles on the Text node

The Text node solves a real UX problem: how do you wire inputs into a template string? My solution is to parse the node's content in real time for `{{ varName }}` patterns and programmatically create left-side connection handles for each variable found. The handle ID matches the variable name, so incoming edges are semantically typed to a specific slot in the template. This makes the data flow self-documenting on the canvas.

### NodeBase pattern

All nine node types share a `NodeBase` wrapper that handles:
- Consistent dark-theme styling
- Standard handle positioning (left = inputs, right = outputs)
- Custom handle ID registration

Adding a new node type means creating one file that renders inside NodeBase. The pattern makes the system horizontally scalable without touching existing node code.

### Stateless backend

The FastAPI backend holds no state between requests. It receives a snapshot of `nodes` and `edges`, builds an adjacency list, runs DFS, and returns three values: node count, edge count, and whether the graph is acyclic. This keeps the backend trivially testable and horizontally scalable. Persistence, if added, belongs in a separate layer.

---

## Challenges

**Managing handle registration with ReactFlow**

ReactFlow's handle system expects handles to exist in the DOM before edges are connected to them. The Text node's dynamic handles — created from template parsing — could violate this if the node re-renders after edges are already drawn. I solved this by keying handle registration to the parsed variable list and ensuring that handle IDs are stable (derived from the variable name, not an index), so React's reconciliation preserves the handle DOM nodes across re-renders.

**Cycle highlighting UX**

It's not enough to tell the user "there's a cycle." The useful information is *which nodes* are in it. The frontend DFS tracks back-edges during traversal and accumulates the set of nodes visited along the cycle path. These get stored in Zustand state, and the node/edge components read from that state to apply red highlighting. Getting the DFS to correctly attribute blame to the right nodes (not just the first back-edge found) required careful tracking of the traversal stack.

**Math node live evaluation**

The Math node provides a live "Eval" button that evaluates the expression the user has typed. This uses `eval()` — appropriate for a local tool where the user is the only one entering input, but something I explicitly flagged as a production concern. For a deployed version, I'd replace it with a sandboxed expression parser (e.g., `mathjs`) or move evaluation to the backend where it can be isolated.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│                   Browser                    │
│                                              │
│  ┌──────────┐   ┌──────────┐  ┌──────────┐  │
│  │ Toolbar  │   │ Canvas   │  │  Result  │  │
│  │ (nodes)  │──▶│(ReactFlow│  │  Modal   │  │
│  └──────────┘   │+ Zustand)│  └────▲─────┘  │
│                 └────┬─────┘       │         │
│                      │ POST        │ JSON     │
└──────────────────────┼─────────────┼─────────┘
                       ▼             │
              ┌────────────────┐     │
              │   FastAPI      │─────┘
              │ /pipelines/    │
              │    parse       │
              │  (DFS + DAG)   │
              └────────────────┘
```

---

## What I Would Do Differently at Scale

| Current state | Production path |
|---|---|
| `eval()` in Math node | Replace with `mathjs` or sandboxed backend eval |
| Hardcoded `localhost` URLs | Environment-variable-driven API base URL |
| No persistence | JSON import/export + optional backend storage |
| CORS fully open | Origin whitelist |
| Single-file backend | Split validation logic, routing, and models |
| No auth | JWT or session-based auth for multi-user scenarios |

---

## What I Learned

- **React Flow is a serious tool.** The handle/edge system has enough nuance that it rewards reading the source, not just the docs.
- **Zustand's selector pattern is underrated.** Granular subscriptions mean you never fight unnecessary re-renders on a graph with dozens of nodes.
- **Dual validation (client + server) is a real pattern.** It separates UX latency from correctness. The client makes the app feel fast; the server makes it trustworthy.
- **Small surface area APIs age well.** The backend's single endpoint with three response fields is trivially testable and has never needed to change. Doing less, clearly, is a feature.

---

## Stack Summary

**Frontend:** React 18 · React Flow 11 · Zustand · CSS
**Backend:** FastAPI · Pydantic v2 · Uvicorn · Python 3.8+
**Tooling:** Create React App · pip · venv
