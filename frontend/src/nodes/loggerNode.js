import { useState } from 'react';
import NodeBase from './NodeBase';

export const LoggerNode = ({ id, data }) => {
  const [label, setLabel] = useState(data?.label || 'log');

  return (
    <NodeBase id={id} title="Logger" style={{ width: 200 }} leftHandles={[{ id: `${id}-in` }]}>
      <div>
        <input value={label} onChange={(e) => setLabel(e.target.value)} style={{width: '100%'}} />
        <div style={{fontSize: 12, marginTop: 6}}>Logs incoming value</div>
      </div>
    </NodeBase>
  );
};

export default LoggerNode;
