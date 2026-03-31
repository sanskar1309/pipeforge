import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const ConditionNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const cond: string = data?.cond ?? 'x > 0';

  return (
    <NodeBase
      title="Condition"
      style={{ width: 260 }}
      leftHandles={[{ id: `${id}-in` }]}
      rightHandles={[
        { id: `${id}-true`, style: { top: '35%' } },
        { id: `${id}-false`, style: { top: '65%' } },
      ]}
    >
      <input
        value={cond}
        onChange={(e) => updateNodeField(id, 'cond', e.target.value)}
        style={{ width: '100%' }}
      />
      <div style={{ fontSize: 12, marginTop: 6, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        <span style={{ color: '#4ade80' }}>true ↑</span>
        <span style={{ color: '#f87171' }}>false ↓</span>
      </div>
    </NodeBase>
  );
};

export default ConditionNode;
