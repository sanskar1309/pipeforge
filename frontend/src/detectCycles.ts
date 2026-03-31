interface NodeLike { id: string }
interface EdgeLike { source: string; target: string }

export function detectCycles(nodes: NodeLike[], edges: EdgeLike[]): Set<string> {
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push(e.target);
  });

  const visited = new Set<string>();
  const recstack = new Set<string>();
  const stackList: string[] = [];
  const cycles = new Set<string>();

  function dfs(v: string) {
    visited.add(v);
    recstack.add(v);
    stackList.push(v);
    for (const nei of adj[v] ?? []) {
      if (!visited.has(nei)) {
        dfs(nei);
      } else if (recstack.has(nei)) {
        const start = stackList.indexOf(nei);
        if (start >= 0) {
          for (let i = start; i < stackList.length; i++) cycles.add(stackList[i]);
        }
      }
    }
    stackList.pop();
    recstack.delete(v);
  }

  Object.keys(adj).forEach((n) => { if (!visited.has(n)) dfs(n); });
  return cycles;
}
