import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const OutputNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const currName: string = data?.outputName ?? id.replace('customOutput-', 'output_');
  const outputType: string = data?.outputType ?? 'Text';

  return (
    <NodeBase title="Output" style={{ width: 220 }} leftHandles={[{ id: `${id}-value` }]}>
      <div>
        <label style={{ display: 'block' }}>
          Name:
          <input
            type="text"
            value={currName}
            onChange={(e) => updateNodeField(id, 'outputName', e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          Type:
          <select
            value={outputType}
            onChange={(e) => updateNodeField(id, 'outputType', e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </label>
      </div>
    </NodeBase>
  );
};

export default OutputNode;
