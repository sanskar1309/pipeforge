import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const NumberNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const value: number = data?.value ?? 0;

  return (
    <NodeBase title="Number" style={{ width: 200 }} rightHandles={[{ id: `${id}-value` }]}>
      <input
        type="number"
        value={value}
        onChange={(e) => updateNodeField(id, 'value', Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </NodeBase>
  );
};

export default NumberNode;
