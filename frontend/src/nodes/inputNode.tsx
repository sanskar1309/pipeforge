import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const InputNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const currName: string = data?.inputName ?? id.replace('customInput-', 'input_');
  const inputType: string = data?.inputType ?? 'Text';

  return (
    <NodeBase title="Input" style={{ width: 220 }} rightHandles={[{ id: `${id}-value` }]}>
      <div>
        <label style={{ display: 'block' }}>
          Name:
          <input
            type="text"
            value={currName}
            onChange={(e) => updateNodeField(id, 'inputName', e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          Type:
          <select
            value={inputType}
            onChange={(e) => updateNodeField(id, 'inputType', e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </NodeBase>
  );
};

export default InputNode;
