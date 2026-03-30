import { useState } from 'react';
import NodeBase from './NodeBase';

export const NumberNode = ({ id, data }) => {
  const [value, setValue] = useState(data?.value || 0);

  return (
    <NodeBase id={id} title="Number" style={{ width: 200 }} rightHandles={[{ id: `${id}-value` }]}>
      <div>
        <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} style={{width: '100%'}} />
      </div>
    </NodeBase>
  );
};

export default NumberNode;
