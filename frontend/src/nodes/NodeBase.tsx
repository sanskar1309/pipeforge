import React from 'react';
import { Handle, Position } from 'reactflow';

export interface HandleConfig {
  id: string;
  type?: 'source' | 'target';
  style?: React.CSSProperties;
}

interface NodeBaseProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  leftHandles?: HandleConfig[];
  rightHandles?: HandleConfig[];
}

const baseStyle: React.CSSProperties = {
  minWidth: 160,
  padding: 12,
  borderRadius: 8,
  background: '#0f1724',
  color: '#e6eef8',
  border: '1px solid #213243',
  boxShadow: '0 4px 12px rgba(2,6,23,0.6)',
  fontFamily: 'Inter, Roboto, sans-serif',
};

export const NodeBase: React.FC<NodeBaseProps> = ({
  title,
  children,
  style = {},
  leftHandles = [],
  rightHandles = [],
}) => {
  return (
    <div style={{ ...baseStyle, ...style }}>
      {leftHandles.map((h, i) => (
        <Handle
          key={`left-${i}-${h.id}`}
          type={h.type ?? 'target'}
          position={Position.Left}
          id={h.id}
          style={h.style}
        />
      ))}

      <div style={{ marginBottom: 8, fontWeight: 600 }}>{title}</div>
      <div className="nodrag">{children}</div>

      {rightHandles.map((h, i) => (
        <Handle
          key={`right-${i}-${h.id}`}
          type={h.type ?? 'source'}
          position={Position.Right}
          id={h.id}
          style={h.style}
        />
      ))}
    </div>
  );
};

export default NodeBase;
