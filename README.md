# VectorShift Pipeline

A pipeline builder with a React frontend and FastAPI backend. Build workflows by adding nodes, connecting them, and submitting to validate the graph.

## Prerequisites

- **Node.js** (v16 or later) and **npm**
- **Python** (3.8 or later) and **pip**

## How to Run the Project

### 1. Backend (FastAPI)

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

- API: [http://localhost:8000](http://localhost:8000)
- Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend (React)

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm start
```

- App: [http://localhost:3000](http://localhost:3000)

Keep both the backend and frontend terminals running.

## Quick Usage

1. **Add nodes** – Drag a node (Input, Output, Text, LLM, etc.) from the toolbar and drop it on the gray canvas.
2. **Connect nodes** – Drag from the **right** handle (circle) of one node to the **left** handle of another.
3. **Submit** – Click **Submit** to send the pipeline to the backend. You’ll see an alert with node count, edge count, and whether the graph is a DAG.

## Optional: Backend URL

If the backend runs on a different host/port, set:

```bash
# Windows (PowerShell)
$env:REACT_APP_API_URL="http://your-backend-url:8000"

# Windows (CMD)
set REACT_APP_API_URL=http://your-backend-url:8000

# Linux / macOS
export REACT_APP_API_URL=http://your-backend-url:8000
```

Then run `npm start` again in the frontend folder.

## Project Structure

```
VectorShift/
├── backend/
│   └── main.py          # FastAPI app, /pipelines/parse endpoint
├── frontend/
│   ├── src/
│   │   ├── nodes/       # Node components (Input, Output, Text, etc.)
│   │   ├── store.js     # Zustand store (nodes, edges)
│   │   ├── ui.js        # React Flow canvas
│   │   ├── submit.js    # Submit button & API call
│   │   └── toolbar.js   # Draggable node toolbar
│   └── package.json
└── README.md
```

## Troubleshooting

- **Drop not working** – Make sure you drop on the **gray canvas** (the big area below the toolbar), not on the toolbar.
- **Submit fails** – Ensure the backend is running at [http://localhost:8000](http://localhost:8000) and CORS allows [http://localhost:3000](http://localhost:3000).
- **Port in use** – Change frontend port: `PORT=3001 npm start` (or use another free port). Backend: `uvicorn main:app --reload --port 8001`.
