import React from 'react';
import { Handle, Position } from 'reactflow';

export const NodeBase = ({ id, title, children, style = {}, leftHandles = [], rightHandles = [] }) => {
  const baseStyle = {
    minWidth: 160,
    padding: 12,
    borderRadius: 8,
    background: '#0f1724',
    color: '#e6eef8',
    border: '1px solid #213243',
    boxShadow: '0 4px 12px rgba(2,6,23,0.6)',
    fontFamily: 'Inter, Roboto, sans-serif',
    ...style,
  };

  return (
    <div style={baseStyle}>
      {leftHandles.map((h, i) => (
        <Handle
          key={`left-${i}-${h.id || i}`}
          type={h.type || 'target'}
          position={Position.Left}
          id={h.id}
          style={h.style}
        />
      ))}

      <div style={{marginBottom: 8, fontWeight: 600}}>{title}</div>

      <div>{children}</div>

      {rightHandles.map((h, i) => (
        <Handle
          key={`right-${i}-${h.id || i}`}
          type={h.type || 'source'}
          position={Position.Right}
          id={h.id}
          style={h.style}
        />
      ))}
    </div>
  );
};

export default NodeBase;
