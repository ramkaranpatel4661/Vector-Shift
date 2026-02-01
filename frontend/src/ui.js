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
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const instanceRef = useRef(null);
    instanceRef.current = reactFlowInstance;

    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

    useEffect(() => {
        const wrapper = reactFlowWrapper.current;
        if (!wrapper) return;

        const handleDragOver = (e) => {
            if (!e.dataTransfer.types.includes('application/reactflow')) return;
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
        };

        const handleDrop = (e) => {
            if (!e.dataTransfer.types.includes('application/reactflow')) return;
            e.preventDefault();
            e.stopPropagation();

            const raw = e.dataTransfer.getData('application/reactflow');
            if (!raw) return;

            let type;
            try {
                const parsed = JSON.parse(raw);
                type = parsed?.nodeType || (typeof raw === 'string' && raw.length < 50 ? raw : null);
            } catch (_) {
                type = raw;
            }
            if (!type || typeof type !== 'string') return;

            const bounds = wrapper.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            const instance = instanceRef.current;
            const position = instance?.project ? instance.project({ x, y }) : { x, y };

            const { getNodeID, addNode } = useStore.getState();
            const nodeID = getNodeID(type);
            addNode({
                id: nodeID,
                type,
                position,
                data: { id: nodeID, nodeType: type },
            });
        };

        wrapper.addEventListener('dragover', handleDragOver, true);
        wrapper.addEventListener('drop', handleDrop, true);
        return () => {
            wrapper.removeEventListener('dragover', handleDragOver, true);
            wrapper.removeEventListener('drop', handleDrop, true);
        };
    }, []);

    return (
        <>
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
        </>
    );
}
