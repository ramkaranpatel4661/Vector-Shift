// submit.js
// Sends pipeline (nodes + edges) to backend and shows parse result in an alert.

import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    const payload = {
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: data || {},
      })),
      edges: edges.map(({ id, source, target }) => ({
        id,
        source,
        target,
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(`Error: ${res.status}\n${errText || res.statusText}`);
        return;
      }

      const data = await res.json();
      const { num_nodes, num_edges, is_dag } = data;
      const dagText = is_dag ? 'Yes' : 'No';
      alert(
        `Pipeline parsed\n\n` +
          `Nodes: ${num_nodes}\n` +
          `Edges: ${num_edges}\n` +
          `Is DAG: ${dagText}`
      );
    } catch (err) {
      alert(`Request failed: ${err.message}`);
    }
  };

  return (
    <div className="submit-section">
      <button type="button" className="submit-section__button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
