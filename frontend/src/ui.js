// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TransformNode } from './nodes/transformNode';
import { ConditionNode } from './nodes/conditionNode';
import { ApiNode } from './nodes/apiNode';
import { EmbeddingNode } from './nodes/embeddingNode';
import { SummarizeNode } from './nodes/summarizeNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
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

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    // Store the latest values in refs so event handlers always have current values
    const reactFlowInstanceRef = useRef(null);
    const getNodeIDRef = useRef(getNodeID);
    const addNodeRef = useRef(addNode);
    
    useEffect(() => {
        reactFlowInstanceRef.current = reactFlowInstance;
    }, [reactFlowInstance]);
    
    useEffect(() => {
        getNodeIDRef.current = getNodeID;
        addNodeRef.current = addNode;
    }, [getNodeID, addNode]);

    // Set up drag and drop using window-level listeners
    useEffect(() => {
        const handleDragOver = (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        };

        const handleDrop = (event) => {
            event.preventDefault();
            
            const wrapper = reactFlowWrapper.current;
            if (!wrapper) return;

            // Check if drop is within the wrapper bounds
            const bounds = wrapper.getBoundingClientRect();
            if (
                event.clientX < bounds.left ||
                event.clientX > bounds.right ||
                event.clientY < bounds.top ||
                event.clientY > bounds.bottom
            ) {
                return; // Drop outside canvas, ignore
            }

            const data = event.dataTransfer.getData('application/reactflow');
            if (!data) return;

            let type;
            try {
                const parsed = JSON.parse(data);
                type = parsed.nodeType;
            } catch (e) {
                type = data;
            }

            if (!type) return;

            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            // Use project if available, otherwise use raw coordinates
            const instance = reactFlowInstanceRef.current;
            const position = instance?.project
                ? instance.project({ x, y })
                : { x, y };

            const nodeID = getNodeIDRef.current(type);
            const newNode = {
                id: nodeID,
                type,
                position,
                data: { id: nodeID, nodeType: type },
            };

            addNodeRef.current(newNode);
        };

        // Add listeners to window to catch all drops
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, []);

    return (
        <div ref={reactFlowWrapper} className="react-flow-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType="smoothstep"
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
