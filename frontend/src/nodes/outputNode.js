// outputNode.js

import { useState } from 'react';
import NodeBase from './NodeBase';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  return (
    <NodeBase id={id} title="Output" style={{ width: 220 }} leftHandles={[{ id: `${id}-value` }]}>
      <div>
        <label style={{display: 'block'}}>
          Name:
          <input type="text" value={currName} onChange={(e) => setCurrName(e.target.value)} style={{marginLeft: 8}} />
        </label>
        <label style={{display: 'block', marginTop: 6}}>
          Type:
          <select value={outputType} onChange={(e) => setOutputType(e.target.value)} style={{marginLeft: 8}}>
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </NodeBase>
  );
};

export default OutputNode;
