// inputNode.js

import { useState } from 'react';
import NodeBase from './NodeBase';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <NodeBase id={id} title="Input" style={{ width: 220 }} rightHandles={[{ id: `${id}-value` }]}>
      <div>
        <label style={{display: 'block'}}>
          Name:
          <input type="text" value={currName} onChange={(e) => setCurrName(e.target.value)} style={{marginLeft: 8}} />
        </label>
        <label style={{display: 'block', marginTop: 6}}>
          Type:
          <select value={inputType} onChange={(e) => setInputType(e.target.value)} style={{marginLeft: 8}}>
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </NodeBase>
  );
};

export default InputNode;
