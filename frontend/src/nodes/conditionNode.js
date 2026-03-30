import { useState } from 'react';
import NodeBase from './NodeBase';

export const ConditionNode = ({ id, data }) => {
  const [cond, setCond] = useState(data?.cond || 'x>0');

  return (
    <NodeBase id={id} title="Condition" style={{ width: 260 }} leftHandles={[{ id: `${id}-in` }]} rightHandles={[{ id: `${id}-true` }, { id: `${id}-false` }]}>
      <div>
        <input value={cond} onChange={(e) => setCond(e.target.value)} style={{width: '100%'}} />
        <div style={{fontSize: 12, marginTop: 6}}>True / False branches</div>
      </div>
    </NodeBase>
  );
};

export default ConditionNode;
