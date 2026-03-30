// submit.js

import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';
import ResultModal from './ResultModal';

// detect cycles and return set of node ids involved
function detectCycles(nodes, edges) {
    const adj = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach((e) => {
        if (!e.source || !e.target) return;
        if (!adj[e.source]) adj[e.source] = [];
        adj[e.source].push(e.target);
    });

    const visited = new Set();
    const recstack = new Set();
    const stackList = [];
    const cycles = new Set();

    function dfs(v) {
        visited.add(v);
        recstack.add(v);
        stackList.push(v);
        const neighbors = adj[v] || [];
        for (const nei of neighbors) {
            if (!visited.has(nei)) {
                dfs(nei);
            } else if (recstack.has(nei)) {
                // record cycle nodes from nei..end of stackList
                const start = stackList.indexOf(nei);
                if (start >= 0) {
                    for (let i = start; i < stackList.length; i++) cycles.add(stackList[i]);
                }
            }
        }
        stackList.pop();
        recstack.delete(v);
    }

    Object.keys(adj).forEach((n) => {
        if (!visited.has(n)) dfs(n);
    });

    return cycles; // Set of node ids
}

export const SubmitButton = () => {
    const { nodes, edges, setNodes, setEdges, reactFlowInstance } = useStore(
        (s) => ({ nodes: s.nodes, edges: s.edges, setNodes: s.setNodes, setEdges: s.setEdges, reactFlowInstance: s.reactFlowInstance }),
        shallow
    );

    const clearHighlights = () => {
        setNodes(nodes.map((n) => ({ ...n, style: undefined })));
        setEdges(edges.map((e) => ({ ...e, animated: false, style: undefined })));
    };

    const applyHighlights = (cycleNodeIds) => {
        const nodeSet = new Set(Array.from(cycleNodeIds));
        const newNodes = nodes.map((n) => {
            if (nodeSet.has(n.id)) {
                return { ...n, style: { border: '2px solid #ff4d4f', boxShadow: '0 6px 14px rgba(255,77,79,0.12)' } };
            }
            return { ...n, style: undefined };
        });

        const newEdges = edges.map((e) => {
            if (nodeSet.has(e.source) && nodeSet.has(e.target)) {
                return { ...e, animated: true, style: { stroke: '#ff4d4f' } };
            }
            return { ...e, animated: false, style: undefined };
        });

        setNodes(newNodes);
        setEdges(newEdges);

        // try to focus view (fit view to show graph and highlight)
        try {
            if (reactFlowInstance && reactFlowInstance.fitView) reactFlowInstance.fitView({ padding: 0.1 });
        } catch (e) {
            // ignore
        }
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleSubmit = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const resp = await fetch(`${API_URL}/pipelines/parse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!resp.ok) throw new Error(`Status ${resp.status}`);

            const data = await resp.json();
            const { num_nodes, num_edges, is_dag } = data;

            if (is_dag) {
                clearHighlights();
                setModalData({ num_nodes, num_edges, is_dag, cycles: new Set() });
                setModalOpen(true);
            } else {
                // detect cycles client-side to highlight problematic nodes/edges
                const cycles = detectCycles(nodes, edges);
                applyHighlights(cycles);
                setModalData({ num_nodes, num_edges, is_dag, cycles });
                setModalOpen(true);
            }
        } catch (err) {
            setModalData({ num_nodes: 0, num_edges: 0, is_dag: false, cycles: new Set(), error: err.message });
            setModalOpen(true);
        }
    };

    return (
        <>
            <div className="vs-submit-bar">
                <div className="vs-submit-inner">
                    <button type="button" onClick={handleSubmit}>Submit</button>
                    <button type="button" onClick={() => {
                        try { setNodes([]); setEdges([]); } catch (e) {}
                        setModalOpen(false);
                        try {
                            if (reactFlowInstance && reactFlowInstance.setViewport) {
                                reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 200 });
                            }
                        } catch (e) {}
                    }}>Clear</button>
                </div>
            </div>
            <ResultModal open={modalOpen} onClose={() => setModalOpen(false)} result={modalData} />
        </>
    );
};

export default SubmitButton;
