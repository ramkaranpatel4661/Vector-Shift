// conditionNode.js – one input, two outputs (true / false)

import { BaseNode } from './baseNode';

export const ConditionNode = ({ id }) => (
  <BaseNode
    title="Condition"
    leftHandles={[{ id: `${id}-input` }]}
    rightHandles={[
      { id: `${id}-true`, style: { top: '35%' } },
      { id: `${id}-false`, style: { top: '65%' } },
    ]}
  >
    <span>Branch on condition</span>
  </BaseNode>
);
