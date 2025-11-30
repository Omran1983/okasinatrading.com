import React, { useState, useCallback, useRef } from 'react';
import {
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Save } from 'lucide-react';

import Sidebar from './Sidebar';
import { TriggerNode, ActionNode } from './CustomNodes';
import { useToast } from '../../../contexts/ToastContext';
import { workflowTemplates } from './workflowTemplates';

const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
};

const initialNodes = [
    {
        id: '1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: { label: 'Manual Start' },
    },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const AutomationBuilderContent = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const { addToast } = useToast();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const actionType = event.dataTransfer.getData('actionType');
            const label = event.dataTransfer.getData('label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: label, actionType: actionType },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const handleRun = () => {
        addToast('Starting workflow execution...', 'info');

        // Simple simulation of execution
        setTimeout(() => {
            const triggerNode = nodes.find(n => n.type === 'trigger');
            if (!triggerNode) {
                addToast('No trigger node found!', 'error');
                return;
            }

            // Find connected nodes
            const connectedEdges = edges.filter(e => e.source === triggerNode.id);
            if (connectedEdges.length === 0) {
                addToast('Workflow completed (No actions connected)', 'success');
                return;
            }

            // Simulate processing actions
            connectedEdges.forEach(edge => {
                const targetNode = nodes.find(n => n.id === edge.target);
                if (targetNode) {
                    setTimeout(() => {
                        addToast(`Executed: ${targetNode.data.label}`, 'success');
                    }, 1000);
                }
            });
        }, 500);
    };

    const loadTemplate = (templateId) => {
        const template = workflowTemplates.find(t => t.id === templateId);
        if (!template) return;

        setNodes(template.nodes);
        setEdges(template.edges);
        addToast(`Loaded template: ${template.name}`, 'success');
        setSelectedTemplate('');
    };

    // Node Editing State
    const [editingNode, setEditingNode] = useState(null);
    const [editValue, setEditValue] = useState('');

    const onNodeClick = useCallback((event, node) => {
        setEditingNode(node);
        setEditValue(node.data.description || '');
    }, []);

    const saveNodeEdit = () => {
        if (!editingNode) return;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === editingNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            description: editValue,
                        },
                    };
                }
                return node;
            })
        );
        setEditingNode(null);
        addToast('Node updated', 'success');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-gray-50">
            <Sidebar />
            <div className="flex-1 relative" ref={reactFlowWrapper}>
                <div className="absolute top-4 left-4 right-4 z-10 flex gap-2 items-center">
                    <select
                        value={selectedTemplate}
                        onChange={(e) => loadTemplate(e.target.value)}
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium"
                    >
                        <option value="">Load Template...</option>
                        {workflowTemplates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex-1" />
                    <button
                        onClick={handleRun}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                    >
                        <Play size={18} />
                        Run Workflow
                    </button>
                    <button
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center gap-2 font-medium border border-gray-200"
                    >
                        <Save size={18} />
                        Save
                    </button>
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>

                {/* Edit Node Modal */}
                {editingNode && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                            <h3 className="text-lg font-bold mb-4">Edit Node</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Configuration
                                </label>
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter value (e.g. Category Name)"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the specific value for this action (e.g. "Jewelry" or "50%")
                                </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditingNode(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveNodeEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function AutomationBuilder() {
    return (
        <ReactFlowProvider>
            <AutomationBuilderContent />
        </ReactFlowProvider>
    );
}
