// ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TransformNode } from './nodes/transformNode';
import { ConditionNode } from './nodes/conditionNode';
import { ApiNode } from './nodes/apiNode';
import { EmbeddingNode } from './nodes/embeddingNode';
import { SummarizeNode } from './nodes/summarizeNode';

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  transform: TransformNode,
  condition: ConditionNode,
  api: ApiNode,
  embedding: EmbeddingNode,
  summarize: SummarizeNode,
};

// Start with two test nodes
const initialNodes = [
  {
    id: 'node-1',
    type: 'customInput',
    position: { x: 100, y: 100 },
    data: { id: 'node-1', nodeType: 'customInput' },
  },
  {
    id: 'node-2',
    type: 'llm',
    position: { x: 400, y: 100 },
    data: { id: 'node-2', nodeType: 'llm' },
  },
];

let nodeId = 3;
const getNodeId = () => `node-${nodeId++}`;

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      let type = event.dataTransfer.getData('application/reactflow');
      
      // Try parsing as JSON if it looks like JSON
      if (type && type.startsWith('{')) {
        try {
          const parsed = JSON.parse(type);
          type = parsed.nodeType;
        } catch (e) {
          // Keep original type
        }
      }

      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: getNodeId(),
        type,
        position,
        data: { nodeType: type },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance]
  );

  // Export nodes and edges for submit button
  window.__pipelineData = { nodes, edges };

  return (
    <div ref={reactFlowWrapper} className="react-flow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#aaa" gap={20} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
