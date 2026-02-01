// embeddingNode.js – one input, one output

import { BaseNode } from './baseNode';

export const EmbeddingNode = ({ id }) => (
  <BaseNode
    title="Embedding"
    leftHandles={[{ id: `${id}-text` }]}
    rightHandles={[{ id: `${id}-vector` }]}
  >
    <span>Text → vector</span>
  </BaseNode>
);
