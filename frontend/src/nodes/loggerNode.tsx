import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const LoggerNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const label: string = data?.label ?? 'log';

  return (
    <NodeBase
      title="Logger"
      style={{ width: 200 }}
      leftHandles={[{ id: `${id}-in` }]}
      rightHandles={[{ id: `${id}-out` }]}
    >
      <input
        value={label}
        onChange={(e) => updateNodeField(id, 'label', e.target.value)}
        style={{ width: '100%' }}
      />
      <div style={{ fontSize: 12, marginTop: 6, color: '#9fb3d0' }}>Logs incoming value</div>
    </NodeBase>
  );
};

export default LoggerNode;
