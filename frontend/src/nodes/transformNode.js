// transformNode.js – one input, one output

import { BaseNode } from './baseNode';

export const TransformNode = ({ id }) => (
  <BaseNode
    title="Transform"
    leftHandles={[{ id: `${id}-input` }]}
    rightHandles={[{ id: `${id}-output` }]}
  >
    <span>Apply transformation</span>
  </BaseNode>
);
