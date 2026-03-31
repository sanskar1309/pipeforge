import { useState } from 'react';

const HelpPanel: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`vs-help ${open ? 'open' : ''}`}>
      <button className="vs-help-toggle" onClick={() => setOpen((s) => !s)} aria-expanded={open}>
        {open ? '×' : '?'}
      </button>
      {open && (
        <div className="vs-help-body">
          <h4>Quick Help</h4>
          <ul>
            <li>Drag nodes from the toolbar onto the canvas.</li>
            <li>Connect nodes by dragging from a right handle to a left handle.</li>
            <li>Text nodes: use <code>{'{{varName}}'}</code> to create input handles.</li>
            <li>LLM node: pick a model, enter prompts, click <strong>Run</strong>.</li>
            <li><strong>Submit</strong> validates the pipeline and highlights cycles.</li>
            <li><strong>Save / Load</strong> persists your pipeline in the browser.</li>
            <li><strong>Undo / Redo</strong> steps through history (up to 50 steps).</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelpPanel;
