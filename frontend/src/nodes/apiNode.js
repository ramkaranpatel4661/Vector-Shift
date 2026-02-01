// apiNode.js – one input, one output

import { useState } from 'react';
import { BaseNode } from './baseNode';

export const ApiNode = ({ id }) => {
  const [url, setUrl] = useState('');
  return (
    <BaseNode
      title="API"
      leftHandles={[{ id: `${id}-input` }]}
      rightHandles={[{ id: `${id}-response` }]}
    >
      <label>
        URL:
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/api/..." />
      </label>
    </BaseNode>
  );
};
