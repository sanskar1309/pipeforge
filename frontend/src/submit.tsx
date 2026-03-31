import { useState } from 'react';
import { useStore } from './store';
import { useStore as useZustandStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import ResultModal from './ResultModal';
import { detectCycles } from './detectCycles';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const SubmitButton: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, reactFlowInstance, savePipeline, loadPipeline } = useStore(
    (s) => ({
      nodes: s.nodes,
      edges: s.edges,
      setNodes: s.setNodes,
      setEdges: s.setEdges,
      reactFlowInstance: s.reactFlowInstance,
      savePipeline: s.savePipeline,
      loadPipeline: s.loadPipeline,
    }),
    shallow
  );

  const { undo, redo, pastStates, futureStates } = useZustandStore(useStore.temporal, (s) => s);
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    num_nodes: number;
    num_edges: number;
    is_dag: boolean;
    cycles: Set<string>;
    error?: string;
  } | null>(null);

  const clearHighlights = () => {
    setNodes(nodes.map((n) => ({ ...n, style: undefined })));
    setEdges(edges.map((e) => ({ ...e, animated: false, style: undefined })));
  };

  const applyHighlights = (cycleNodeIds: Set<string>) => {
    setNodes(
      nodes.map((n) =>
        cycleNodeIds.has(n.id)
          ? { ...n, style: { border: '2px solid #ff4d4f', boxShadow: '0 6px 14px rgba(255,77,79,0.12)' } }
          : { ...n, style: undefined }
      )
    );
    setEdges(
      edges.map((e) =>
        cycleNodeIds.has(e.source) && cycleNodeIds.has(e.target)
          ? { ...e, animated: true, style: { stroke: '#ff4d4f' } }
          : { ...e, animated: false, style: undefined }
      )
    );
    try { reactFlowInstance?.fitView({ padding: 0.1 }); } catch { /* ignore */ }
  };

  const handleSubmit = async () => {
    try {
      const resp = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const data = await resp.json() as { num_nodes: number; num_edges: number; is_dag: boolean };
      if (data.is_dag) {
        clearHighlights();
        setModalData({ ...data, cycles: new Set() });
      } else {
        const cycles = detectCycles(nodes, edges);
        applyHighlights(cycles);
        setModalData({ ...data, cycles });
      }
      setModalOpen(true);
    } catch (err) {
      setModalData({ num_nodes: 0, num_edges: 0, is_dag: false, cycles: new Set(), error: (err as Error).message });
      setModalOpen(true);
    }
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setModalOpen(false);
    try { reactFlowInstance?.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 200 }); } catch { /* ignore */ }
  };

  const btnStyle = (disabled = false): React.CSSProperties => ({
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <>
      <div className="vs-submit-bar">
        <div className="vs-submit-inner">
          <button onClick={() => undo()} disabled={!canUndo} style={btnStyle(!canUndo)} title="Undo">↩ Undo</button>
          <button onClick={() => redo()} disabled={!canRedo} style={btnStyle(!canRedo)} title="Redo">Redo ↪</button>
          <div className="vs-submit-divider" />
          <button onClick={savePipeline} title="Save to browser">Save</button>
          <button onClick={loadPipeline} title="Load from browser">Load</button>
          <div className="vs-submit-divider" />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
      <ResultModal open={modalOpen} onClose={() => setModalOpen(false)} result={modalData} />
    </>
  );
};

export default SubmitButton;
