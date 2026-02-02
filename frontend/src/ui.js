// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useEffect, useCallback } from 'react';
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

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            if (!reactFlowWrapper.current) return;

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const data = event.dataTransfer.getData('application/reactflow');
            
            if (!data) {
                return;
            }

            let type;
            try {
                const parsed = JSON.parse(data);
                type = parsed.nodeType;
            } catch (e) {
                type = data;
            }

            if (!type) {
                return;
            }

            const x = event.clientX - reactFlowBounds.left;
            const y = event.clientY - reactFlowBounds.top;
            
            // Use project if available, otherwise use raw coordinates
            const position = reactFlowInstance?.project 
                ? reactFlowInstance.project({ x, y })
                : { x, y };

            const nodeID = getNodeID(type);
            const newNode = {
                id: nodeID,
                type,
                position,
                data: { id: nodeID, nodeType: type },
            };

            addNode(newNode);
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    return (
        <div ref={reactFlowWrapper} className="react-flow-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
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
