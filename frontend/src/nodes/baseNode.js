// baseNode.js
// Reusable node wrapper: title, configurable handles, styled container, children slot.

import { Handle, Position } from 'reactflow';

const defaultHandles = [];
const defaultContainerStyle = {
  minWidth: 200,
  minHeight: 80,
};

/**
 * Renders a single handle (target or source).
 * @param {Object} h - { id, type: 'target'|'source', position, style }
 */
function NodeHandle({ id, type, position, style = {} }) {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={style}
    />
  );
}

/**
 * Base node component. Use this to build new node types with minimal code.
 *
 * @param {string} title - Label shown at the top of the node
 * @param {Array<{id: string, style?: object}>} leftHandles - Target handles on the left
 * @param {Array<{id: string, style?: object}>} rightHandles - Source handles on the right
 * @param {React.ReactNode} children - Main content (forms, text, etc.)
 * @param {object} containerStyle - Override minWidth/minHeight/border etc.
 * @param {string} className - Optional CSS class for the node container
 */
export function BaseNode({
  title,
  leftHandles = defaultHandles,
  rightHandles = defaultHandles,
  children,
  containerStyle = {},
  className = '',
}) {
  const style = { ...defaultContainerStyle, ...containerStyle };

  return (
    <div className={`base-node ${className}`.trim()} style={style}>
      {leftHandles.map((h) => (
        <NodeHandle
          key={h.id}
          id={h.id}
          type="target"
          position={Position.Left}
          style={h.style}
        />
      ))}
      <div className="base-node__header">
        <span>{title}</span>
      </div>
      <div className="base-node__content">
        {children}
      </div>
      {rightHandles.map((h) => (
        <NodeHandle
          key={h.id}
          id={h.id}
          type="source"
          position={Position.Right}
          style={h.style}
        />
      ))}
    </div>
  );
}
