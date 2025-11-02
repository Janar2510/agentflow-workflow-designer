import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AgentNode } from '../components/workflow/AgentNode';
import { useCoronaDesign } from '../hooks/useCoronaDesign';

const nodeTypes = {
  agentNode: AgentNode,
};

const initialNodes: Node[] = [
  {
    id: 'agent-1',
    type: 'agentNode',
    position: { x: 100, y: 100 },
    data: {
      agentType: 'llm_text_generator',
      serviceType: 'gmail',
      config: {},
      label: 'Text Generator',
      status: 'idle',
      onDelete: (id: string) => console.log('Delete:', id),
      onReplace: (id: string) => console.log('Replace:', id),
      onDisconnect: (id: string) => console.log('Disconnect:', id),
    },
  },
  {
    id: 'agent-2',
    type: 'agentNode',
    position: { x: 400, y: 100 },
    data: {
      agentType: 'llm_chat',
      serviceType: 'slack',
      config: {},
      label: 'Chat Agent',
      status: 'running',
      onDelete: (id: string) => console.log('Delete:', id),
      onReplace: (id: string) => console.log('Replace:', id),
      onDisconnect: (id: string) => console.log('Disconnect:', id),
    },
  },
  {
    id: 'agent-3',
    type: 'agentNode',
    position: { x: 100, y: 300 },
    data: {
      agentType: 'data_processor',
      serviceType: 'aws-lambda',
      config: {},
      label: 'Data Processor',
      status: 'completed',
      onDelete: (id: string) => console.log('Delete:', id),
      onReplace: (id: string) => console.log('Replace:', id),
      onDisconnect: (id: string) => console.log('Disconnect:', id),
    },
  },
  {
    id: 'agent-4',
    type: 'agentNode',
    position: { x: 400, y: 300 },
    data: {
      agentType: 'email_sender',
      serviceType: 'gmail',
      config: {},
      label: 'Email Sender',
      status: 'error',
      lastExecution: {
        duration: 1500,
        timestamp: new Date().toISOString(),
        error: 'Connection failed'
      },
      onDelete: (id: string) => console.log('Delete:', id),
      onReplace: (id: string) => console.log('Replace:', id),
      onDisconnect: (id: string) => console.log('Disconnect:', id),
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'agent-1',
    target: 'agent-2',
    type: 'default',
    animated: true,
    style: { stroke: '#6366f1' }
  },
  {
    id: 'e2-3',
    source: 'agent-2',
    target: 'agent-3',
    type: 'default',
    animated: true,
    style: { stroke: '#6366f1' }
  },
  {
    id: 'e3-4',
    source: 'agent-3',
    target: 'agent-4',
    type: 'default',
    animated: true,
    style: { stroke: '#6366f1' }
  },
];

export const TestWorkflowPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const design = useCoronaDesign();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'default',
        animated: true,
        style: { stroke: '#6366f1' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const handleReplaceNode = useCallback((nodeId: string) => {
    console.log('Replace node:', nodeId);
  }, []);

  const handleDisconnectNode = useCallback((nodeId: string) => {
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  }, [setEdges]);

  // Update nodes with callback functions
  const updatedNodes = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onDelete: handleDeleteNode,
      onReplace: handleReplaceNode,
      onDisconnect: handleDisconnectNode,
    }
  }));

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: design.colors.bgPrimary,
      fontFamily: design.typography.fontFamily 
    }}>
      <div style={{ 
        padding: '20px', 
        backgroundColor: design.colors.bgSecondary,
        borderBottom: `1px solid ${design.colors.borderPrimary}`,
        color: design.colors.textPrimary
      }}>
        <h1>Test Workflow Page</h1>
        <p>This page shows the enhanced agent nodes with service icons, colors, and loading animations.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => {
              setNodes(prevNodes => 
                prevNodes.map(node => ({
                  ...node,
                  data: {
                    ...node.data,
                    status: node.data.status === 'running' ? 'idle' : 'running'
                  }
                }))
              );
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: design.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Running Status
          </button>
        </div>
      </div>
      
      <div style={{ height: 'calc(100vh - 120px)' }}>
        <ReactFlow
          nodes={updatedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gradient-to-br from-bg-primary to-bg-secondary"
          defaultEdgeOptions={{
            type: 'default',
            animated: true,
            style: { 
              stroke: '#007AFF', 
              strokeWidth: 2,
              strokeDasharray: '5,5',
              animation: 'dash 1s linear infinite'
            }
          }}
        >
          <Controls 
            className="bg-white border-gray-300"
            style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)'
            }}
          />
          <MiniMap 
            className="bg-white border-gray-300"
            style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)'
            }}
            nodeColor={(node) => {
              switch (node.data?.status) {
                case 'completed': return '#00FF87'
                case 'running': return '#FFB800'
                case 'error': return '#FF3B30'
                default: return '#6366f1'
              }
            }}
          />
          <Background 
            gap={20} 
            size={1} 
            color="rgba(255, 255, 255, 0.1)"
            style={{ backgroundColor: '#0f0f1c' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider
export const TestWorkflowPageWithProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <TestWorkflowPage />
    </ReactFlowProvider>
  );
};

export default TestWorkflowPageWithProvider;





