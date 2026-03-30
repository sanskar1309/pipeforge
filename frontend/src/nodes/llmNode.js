// llmNode.js

import NodeBase from './NodeBase';

export const LLMNode = ({ id, data }) => {
  const leftHandles = [
    { id: `${id}-system`, style: { top: '28%' } },
    { id: `${id}-prompt`, style: { top: '60%' } },
  ];

  return (
    <NodeBase id={id} title="LLM" style={{ width: 260 }} leftHandles={leftHandles} rightHandles={[{ id: `${id}-response` }]}>
      <div>
        <div style={{fontSize: 13, color: '#9fb3d0'}}>Large Language Model</div>
      </div>
    </NodeBase>
  );
};

export default LLMNode;
