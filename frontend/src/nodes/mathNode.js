import { useState } from 'react';
import { evaluate } from 'mathjs';
import NodeBase from './NodeBase';

export const MathNode = ({ id, data }) => {
  const [expr, setExpr] = useState(data?.expr || '1+1');
  const [result, setResult] = useState('2');

  const evalExpr = () => {
    try {
      const r = evaluate(expr);
      setResult(String(r));
    } catch (e) {
      setResult('err');
    }
  };

  return (
    <NodeBase id={id} title="Math" style={{ width: 240 }} rightHandles={[{ id: `${id}-out` }]}>
      <div>
        <input value={expr} onChange={(e) => setExpr(e.target.value)} style={{width: '100%'}} />
        <div style={{display: 'flex', gap: 8, marginTop: 8}}>
          <button onClick={evalExpr}>Eval</button>
          <div style={{flex: 1}}>Result: {result}</div>
        </div>
      </div>
    </NodeBase>
  );
};

export default MathNode;
