import { describe, it, expect } from 'vitest';
import { detectCycles } from './detectCycles';

const nodes = (ids: string[]) => ids.map((id) => ({ id }));
const edge = (source: string, target: string) => ({ source, target });

describe('detectCycles', () => {
  it('returns empty set for a valid DAG', () => {
    // A → B → C → D
    const result = detectCycles(
      nodes(['A', 'B', 'C', 'D']),
      [edge('A', 'B'), edge('B', 'C'), edge('C', 'D')]
    );
    expect(result.size).toBe(0);
  });

  it('detects a simple cycle between two nodes', () => {
    // A → B → A
    const result = detectCycles(
      nodes(['A', 'B']),
      [edge('A', 'B'), edge('B', 'A')]
    );
    expect(result.has('A')).toBe(true);
    expect(result.has('B')).toBe(true);
  });

  it('detects a cycle in a larger graph while leaving non-cycle nodes out', () => {
    // Input → A → B → C → A (cycle: A,B,C) — Input is not in the cycle
    const result = detectCycles(
      nodes(['Input', 'A', 'B', 'C']),
      [edge('Input', 'A'), edge('A', 'B'), edge('B', 'C'), edge('C', 'A')]
    );
    expect(result.has('A')).toBe(true);
    expect(result.has('B')).toBe(true);
    expect(result.has('C')).toBe(true);
    expect(result.has('Input')).toBe(false);
  });

  it('returns empty set for an empty graph', () => {
    const result = detectCycles([], []);
    expect(result.size).toBe(0);
  });
});
