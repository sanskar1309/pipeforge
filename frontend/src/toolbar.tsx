import { DraggableNode } from './draggableNode';

export const PipelineToolbar: React.FC = () => (
  <div style={{ padding: 10 }}>
    <div className="toolbar" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap' }}>
      <DraggableNode type="customInput" label="Input" />
      <DraggableNode type="llm" label="LLM" />
      <DraggableNode type="customOutput" label="Output" />
      <DraggableNode type="text" label="Text" />
      <DraggableNode type="number" label="Number" />
      <DraggableNode type="date" label="Date" />
      <DraggableNode type="math" label="Math" />
      <DraggableNode type="condition" label="Condition" />
      <DraggableNode type="logger" label="Logger" />
    </div>
  </div>
);
