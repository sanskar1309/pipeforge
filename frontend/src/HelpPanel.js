import React, { useState } from 'react';

export const HelpPanel = () => {
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
            <li>Drag nodes from the toolbar onto the canvas to add them.</li>
            <li>Connect nodes by dragging from a right handle to a left handle.</li>
            <li>Text nodes resize as you type; define variables with <code>{'{{ varName }}'}</code> to create input handles.</li>
            <li>Click <strong>Submit</strong> to validate the pipeline. If cycles are found they'll be highlighted and listed.</li>
            <li>Use <strong>Clear</strong> to empty the canvas without reloading the page.</li>
          </ul>
          <div style={{marginTop:8}}>
            <small>Need more help? Open an issue or contact the developer.</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPanel;
