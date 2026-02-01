// textNode.js
// Text node with {{ variable }} parsing (left handles) and auto-resizing.

import { useState, useRef, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 80;
const MAX_WIDTH = 400;
const LINE_HEIGHT = 20;
const PADDING = 24;

/** Valid JS variable name: starts with letter or _, then alphanumeric or _ */
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

function extractVariables(text) {
  const names = new Set();
  let m;
  VARIABLE_REGEX.lastIndex = 0;
  while ((m = VARIABLE_REGEX.exec(text)) !== null) {
    names.add(m[1]);
  }
  return Array.from(names);
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  const handleTextChange = (e) => setCurrText(e.target.value);

  // Auto-resize: derive width/height from content
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.width = 'auto';
    const scrollHeight = el.scrollHeight;
    const scrollWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH - PADDING, el.scrollWidth));
    const width = Math.min(MAX_WIDTH, scrollWidth + PADDING);
    const height = Math.max(MIN_HEIGHT, scrollHeight + PADDING);
    setDimensions({ width, height });
    el.style.height = `${scrollHeight}px`;
    el.style.width = `${scrollWidth}px`;
  }, [currText]);

  const style = {
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    width: dimensions.width,
    height: dimensions.height,
  };

  return (
    <div className="base-node base-node--text" style={style}>
      {variables.map((name, i) => (
        <Handle
          key={name}
          type="target"
          position={Position.Left}
          id={`${id}-${name}`}
          style={{
            top: variables.length === 1 ? '50%' : `${((i + 1) / (variables.length + 1)) * 100}%`,
          }}
        />
      ))}
      <div className="base-node__header">
        <span>Text</span>
      </div>
      <div className="base-node__content">
        <label>
          Text:
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            rows={3}
            style={{
              resize: 'none',
              minHeight: LINE_HEIGHT * 3,
              minWidth: MIN_WIDTH - PADDING,
              boxSizing: 'border-box',
            }}
          />
        </label>
      </div>
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  );
};
