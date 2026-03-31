import { useState } from 'react';
import { type NodeProps } from 'reactflow';
import { useStore } from '../store';
import NodeBase from './NodeBase';
import ScrollCapture from './ScrollCapture';

const MODELS = [
  { label: 'Nemotron 120B (free)', value: 'nvidia/nemotron-3-super-120b-a12b:free' },
  { label: 'GLM 4.5 Air (free)', value: 'z-ai/glm-4.5-air:free' },
  { label: 'Llama 3.3 70B (free)', value: 'meta-llama/llama-3.3-70b-instruct:free' },
  { label: 'Llama 3.2 3B (free)', value: 'meta-llama/llama-3.2-3b-instruct:free' },
  { label: 'Qwen3 Coder (free)', value: 'qwen/qwen3-coder:free' },
  { label: 'Hermes 3 405B (free)', value: 'nousresearch/hermes-3-llama-3.1-405b:free' },
];

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const LLMNode: React.FC<NodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const model: string = data?.model ?? MODELS[0].value;
  const systemPrompt: string = data?.systemPrompt ?? '';
  const prompt: string = data?.prompt ?? '';
  const response: string = data?.response ?? '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/pipelines/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, system: systemPrompt, prompt }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json() as { response: string };
      updateNodeField(id, 'response', json.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NodeBase
      title="LLM"
      style={{ width: 300 }}
      leftHandles={[
        { id: `${id}-system`, style: { top: '30%' } },
        { id: `${id}-prompt`, style: { top: '55%' } },
      ]}
      rightHandles={[{ id: `${id}-response` }]}
    >
      <ScrollCapture style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <select
          value={model}
          onChange={(e) => updateNodeField(id, 'model', e.target.value)}
          style={{ width: '100%', background: '#071126', color: '#e6eef8', border: '1px solid #213243', borderRadius: 6, padding: '4px 6px' }}
        >
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <textarea
          placeholder="System prompt…"
          value={systemPrompt}
          onChange={(e) => updateNodeField(id, 'systemPrompt', e.target.value)}
          rows={2}
          style={{ width: '100%', resize: 'none', background: '#071126', color: '#e6eef8', border: '1px solid #213243', borderRadius: 6, padding: 6, fontSize: 12 }}
        />

        <textarea
          placeholder="User prompt…"
          value={prompt}
          onChange={(e) => updateNodeField(id, 'prompt', e.target.value)}
          rows={2}
          style={{ width: '100%', resize: 'none', background: '#071126', color: '#e6eef8', border: '1px solid #213243', borderRadius: 6, padding: 6, fontSize: 12 }}
        />

        <button onClick={handleRun} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Running…' : 'Run'}
        </button>

        {error && <div style={{ fontSize: 11, color: '#f87171' }}>{error}</div>}

        {response && (
          <div style={{ fontSize: 12, background: '#071126', border: '1px solid #213243', borderRadius: 6, padding: 8, maxHeight: 120, overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#a3c4f3' }}>
            {response}
          </div>
        )}
      </ScrollCapture>
    </NodeBase>
  );
};

export default LLMNode;
