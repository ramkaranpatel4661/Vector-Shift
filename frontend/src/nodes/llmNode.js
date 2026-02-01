// llmNode.js

import { BaseNode } from './baseNode';

export const LLMNode = ({ id }) => {
  const leftHandles = [
    { id: `${id}-system`, style: { top: `${100 / 3}%` } },
    { id: `${id}-prompt`, style: { top: `${200 / 3}%` } },
  ];
  const rightHandles = [{ id: `${id}-response` }];

  return (
    <BaseNode
      title="LLM"
      leftHandles={leftHandles}
      rightHandles={rightHandles}
    >
      <span>This is a LLM.</span>
    </BaseNode>
  );
};
