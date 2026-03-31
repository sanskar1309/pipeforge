import { useMemo } from 'react';
import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase, { type HandleConfig } from './NodeBase';
import ScrollCapture from './ScrollCapture';

export const TextNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const currText: string = data?.text ?? '{{input}}';

  const size = useMemo(() => {
    const lines = currText.split(/\n/);
    const longest = lines.reduce((m: number, l: string) => Math.max(m, l.length), 0);
    return {
      width: Math.min(520, Math.max(160, 12 + longest * 8)),
      height: Math.min(400, Math.max(64, 20 + lines.length * 20)),
    };
  }, [currText]);

  const variables = useMemo(() => {
    const vars = new Set<string>();
    for (const m of currText.matchAll(/\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g)) {
      vars.add(m[1]);
    }
    return Array.from(vars);
  }, [currText]);

  const leftHandles: HandleConfig[] = variables.map((v, i) => ({
    id: `${id}-var-${v}`,
    style: { top: `${20 + i * 18}px` },
  }));

  return (
    <NodeBase
      title="Text"
      style={{ width: size.width, height: size.height }}
      leftHandles={leftHandles}
      rightHandles={[{ id: `${id}-output` }]}
    >
      <ScrollCapture>
        <label style={{ display: 'block' }}>
          Text:
          <textarea
            value={currText}
            onChange={(e) => updateNodeField(id, 'text', e.target.value)}
            style={{
              width: '100%',
              height: Math.max(24, size.height - 48),
              resize: 'none',
              marginTop: 6,
              background: '#071126',
              color: '#e6eef8',
              border: '1px solid #213243',
              padding: 8,
              borderRadius: 6,
            }}
          />
        </label>
      </ScrollCapture>
    </NodeBase>
  );
};

export default TextNode;
