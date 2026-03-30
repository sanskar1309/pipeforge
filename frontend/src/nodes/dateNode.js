import { useState } from 'react';
import NodeBase from './NodeBase';

export const DateNode = ({ id, data }) => {
  const [date, setDate] = useState(data?.date || new Date().toISOString().slice(0,10));

  return (
    <NodeBase id={id} title="Date" style={{ width: 220 }} rightHandles={[{ id: `${id}-date` }]}>
      <div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{width: '100%'}} />
      </div>
    </NodeBase>
  );
};

export default DateNode;
