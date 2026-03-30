// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
                <div className="toolbar" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                    <DraggableNode type='number' label='Number' />
                    <DraggableNode type='date' label='Date' />
                    <DraggableNode type='math' label='Math' />
                    <DraggableNode type='condition' label='Condition' />
                    <DraggableNode type='logger' label='Logger' />
                </div>
            </div>
    );
};
