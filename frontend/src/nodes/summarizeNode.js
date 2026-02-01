// summarizeNode.js – one input, one output

import { BaseNode } from './baseNode';

export const SummarizeNode = ({ id }) => (
  <BaseNode
    title="Summarize"
    leftHandles={[{ id: `${id}-input` }]}
    rightHandles={[{ id: `${id}-summary` }]}
  >
    <span>Summarize content</span>
  </BaseNode>
);
