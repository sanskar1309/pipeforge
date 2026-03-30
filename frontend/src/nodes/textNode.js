// textNode.js

import { useEffect, useMemo, useState } from 'react';
import NodeBase from './NodeBase';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [size, setSize] = useState({ width: 220, height: 80 });

  useEffect(() => {
    const lines = currText.split(/\n/);
    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    const width = Math.min(520, Math.max(160, 12 + longest * 8));
    const height = Math.min(400, Math.max(64, 20 + lines.length * 20));
    setSize({ width, height });
  }, [currText]);

  const variables = useMemo(() => {
    const vars = new Set();
    let m;
    while ((m = VAR_REGEX.exec(currText))) {
      vars.add(m[1]);
    }
    return Array.from(vars);
  }, [currText]);

  const leftHandles = variables.map((v, i) => ({ id: `${id}-var-${v}`, style: { top: `${20 + i * 18}px` } }));
  const rightHandles = [{ id: `${id}-output` }];

  return (
    <NodeBase id={id} title="Text" style={{ width: size.width, height: size.height }} leftHandles={leftHandles} rightHandles={rightHandles}>
      <div>
        <label style={{display: 'block'}}>
          Text:
          <textarea
            value={currText}
            onChange={(e) => setCurrText(e.target.value)}
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
      </div>
    </NodeBase>
  );
};

export default TextNode;
