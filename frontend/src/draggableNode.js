// draggableNode.js

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`toolbar-node ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      style={{ cursor: 'grab' }}
      draggable
    >
      <span>{label}</span>
    </div>
  );
};
