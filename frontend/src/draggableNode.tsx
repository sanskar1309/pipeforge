import { useStore } from './store';
import type { Node } from 'reactflow';

export const DraggableNode: React.FC<{ type: string; label: string }> = ({ type, label }) => {
  const { getNodeID, addNode, reactFlowInstance } = useStore((s) => ({
    getNodeID: s.getNodeID,
    addNode: s.addNode,
    reactFlowInstance: s.reactFlowInstance,
  }));

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
    (event.target as HTMLElement).style.cursor = 'grabbing';
  };

  const onTap = () => {
    const center = reactFlowInstance
      ? reactFlowInstance.project({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      : { x: 200, y: 200 };
    const id = getNodeID(type);
    const node: Node = { id, type, position: center, data: { id, nodeType: type } };
    addNode(node);
  };

  return (
    <div
      className={`draggable ${type}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={(e) => ((e.target as HTMLElement).style.cursor = 'grab')}
      onClick={onTap}
      style={{
        cursor: 'grab',
        borderRadius: 8,
        backgroundColor: '#12303f',
        flexDirection: 'column',
      }}
    >
      <span style={{ color: '#e6eef8', fontWeight: 600 }}>{label}</span>
    </div>
  );
};
