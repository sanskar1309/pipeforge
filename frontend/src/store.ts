import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type ReactFlowInstance,
} from 'reactflow';

const STORAGE_KEY = 'pipeforge_pipeline';

export interface StoreState {
  nodes: Node[];
  edges: Edge[];
  nodeIDs: Record<string, number>;
  reactFlowInstance: ReactFlowInstance | null;
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setReactFlowInstance: (inst: ReactFlowInstance) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: unknown) => void;
  savePipeline: () => void;
  loadPipeline: () => void;
}

export const useStore = create<StoreState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      nodeIDs: {} as Record<string, number>,
      reactFlowInstance: null,

      getNodeID: (type: string) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) newIDs[type] = 0;
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
      },

      addNode: (node: Node) => {
        set({ nodes: [...get().nodes, node] });
      },

      setNodes: (nodes: Node[]) => set({ nodes }),
      setEdges: (edges: Edge[]) => set({ edges }),
      setReactFlowInstance: (inst: ReactFlowInstance) => set({ reactFlowInstance: inst }),

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(
            {
              ...connection,
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
            },
            get().edges
          ),
        });
      },

      updateNodeField: (nodeId: string, fieldName: string, fieldValue: unknown) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
            }
            return node;
          }),
        });
      },

      savePipeline: () => {
        const { nodes, edges } = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
      },

      loadPipeline: () => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return;
          const { nodes, edges } = JSON.parse(raw) as { nodes: Node[]; edges: Edge[] };
          set({ nodes, edges });
        } catch {
          // ignore corrupt data
        }
      },
    }),
    {
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
      limit: 50,
    }
  )
);
