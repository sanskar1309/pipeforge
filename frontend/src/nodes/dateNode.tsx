import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const DateNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const date: string = data?.date ?? new Date().toISOString().slice(0, 10);

  return (
    <NodeBase title="Date" style={{ width: 220 }} rightHandles={[{ id: `${id}-date` }]}>
      <input
        type="date"
        value={date}
        onChange={(e) => updateNodeField(id, 'date', e.target.value)}
        style={{ width: '100%' }}
      />
    </NodeBase>
  );
};

export default DateNode;
