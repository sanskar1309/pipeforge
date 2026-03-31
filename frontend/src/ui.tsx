import { useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ConnectionLineType, type Node } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { NumberNode } from './nodes/numberNode';
import { DateNode } from './nodes/dateNode';
import { MathNode } from './nodes/mathNode';
import { ConditionNode } from './nodes/conditionNode';
import { LoggerNode } from './nodes/loggerNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  number: NumberNode,
  date: DateNode,
  math: MathNode,
  condition: ConditionNode,
  logger: LoggerNode,
};

export const PipelineUI: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect, setReactFlowInstance, reactFlowInstance } =
    useStore(
      (s) => ({
        nodes: s.nodes,
        edges: s.edges,
        getNodeID: s.getNodeID,
        addNode: s.addNode,
        onNodesChange: s.onNodesChange,
        onEdgesChange: s.onEdgesChange,
        onConnect: s.onConnect,
        setReactFlowInstance: s.setReactFlowInstance,
        reactFlowInstance: s.reactFlowInstance,
      }),
      shallow
    );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType } = JSON.parse(raw) as { nodeType: string };
      if (!nodeType) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(nodeType);
      const newNode: Node = {
        id: nodeID,
        type: nodeType,
        position,
        data: { id: nodeID, nodeType },
      };
      addNode(newNode);
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background color="#aaa" gap={gridSize} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
