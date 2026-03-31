import { useState } from 'react';
import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';

export const MathNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const expr: string = data?.expr ?? '1+1';
  const [result, setResult] = useState<string>('');

  const evalExpr = async () => {
    try {
      const { evaluate } = await import('mathjs');
      const r = evaluate(expr);
      setResult(String(r));
    } catch {
      setResult('err');
    }
  };

  return (
    <NodeBase title="Math" style={{ width: 240 }} rightHandles={[{ id: `${id}-out` }]}>
      <input
        value={expr}
        onChange={(e) => updateNodeField(id, 'expr', e.target.value)}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={evalExpr}>Eval</button>
        <div style={{ flex: 1 }}>{result !== '' ? `= ${result}` : ''}</div>
      </div>
    </NodeBase>
  );
};

export default MathNode;
