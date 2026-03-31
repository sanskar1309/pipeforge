interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  result: {
    num_nodes: number;
    num_edges: number;
    is_dag: boolean;
    cycles: Set<string>;
    error?: string;
  } | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ open, onClose, result }) => {
  if (!open) return null;
  const { num_nodes, num_edges, is_dag, cycles, error } = result ?? { num_nodes: 0, num_edges: 0, is_dag: false, cycles: new Set<string>() };

  return (
    <div className="vs-modal-backdrop" onClick={onClose}>
      <div className="vs-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="vs-modal-header">
          <h3>Pipeline result</h3>
        </div>
        <div className="vs-modal-body">
          {error ? (
            <div style={{ color: '#f87171' }}>Error: {error}</div>
          ) : (
            <>
              <div style={{ marginBottom: 8 }}>Nodes: <strong>{num_nodes}</strong></div>
              <div style={{ marginBottom: 8 }}>Edges: <strong>{num_edges}</strong></div>
              <div style={{ marginBottom: 8 }}>
                Is DAG:{' '}
                <strong style={{ color: is_dag ? '#4ade80' : '#f87171' }}>
                  {String(is_dag)}
                </strong>
              </div>
              {cycles && cycles.size > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Cycle nodes</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Array.from(cycles).map((id) => (
                      <div key={id} className="vs-badge">{id}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="vs-modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
