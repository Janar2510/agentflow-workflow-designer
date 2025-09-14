import React, { useCallback, useState, useRef, useEffect } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'
import { AgentNode } from './AgentNode'
import { ConditionNode } from './ConditionNode'
import { TriggerNode } from './TriggerNode'
import { ActionNode } from './ActionNode'
import { AgentPalette } from './AgentPalette'
import { WorkflowToolbar } from './WorkflowToolbar'
import { NodePropertiesPanel } from './NodePropertiesPanel'
import { ExecutionLogs } from './ExecutionLogs'
import { WorkflowManager } from './WorkflowManager'
import { useWorkflowStore } from '../../stores/workflowStore'
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution'
import { workflowDataToReactFlow, reactFlowToWorkflowData } from '../../utils/workflowAdapters'

const nodeTypes = {
  agentNode: AgentNode,
  conditionNode: ConditionNode,
  triggerNode: TriggerNode,
  actionNode: ActionNode,
}

interface WorkflowEditorProps {
  workflowId?: string
  isReadOnly?: boolean
  onSave?: (workflow: any) => void
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflowId: _workflowId,
  isReadOnly = false,
  onSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false)
  const [showExecutionLogs, setShowExecutionLogs] = useState(false)
  const [showWorkflowManager, setShowWorkflowManager] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const { 
    currentWorkflow, 
    updateNodes, 
    updateEdges, 
    updateNodeData,
    hasUnsavedChanges,
    saveWorkflow,
    validateWorkflow,
    undo,
    redo,
    setHasUnsavedChanges
  } = useWorkflowStore()

  const {
    currentExecution,
    isExecuting,
    executeWorkflow,
    cancelExecution,
    getNodeStatus,
    getNodeExecutionData
  } = useWorkflowExecution()

  // Load workflow data when component mounts or workflowId changes
  useEffect(() => {
    if (currentWorkflow) {
      const reactFlowData = workflowDataToReactFlow(currentWorkflow.workflow_data)
      setNodes(reactFlowData.nodes)
      setEdges(reactFlowData.edges)
      
      // Set viewport if available
      if (reactFlowInstance && reactFlowData.viewport) {
        reactFlowInstance.setViewport(reactFlowData.viewport)
      }
    }
  }, [currentWorkflow, setNodes, setEdges, reactFlowInstance])

  // Update node statuses based on execution
  useEffect(() => {
    if (currentExecution) {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const status = getNodeStatus(node.id)
          const executionData = getNodeExecutionData(node.id)
          
          return {
            ...node,
            data: {
              ...node.data,
              status,
              lastExecution: executionData ? {
                duration: executionData.duration || 0,
                timestamp: new Date(executionData.startTime || Date.now()).toISOString(),
                error: executionData.error
              } : node.data.lastExecution
            }
          }
        })
      )
    }
  }, [currentExecution, getNodeStatus, getNodeExecutionData])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'default',
        animated: true,
        style: { stroke: '#6366f1' }
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      
      if (!reactFlowWrapper.current) return
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const dragData = event.dataTransfer.getData('application/reactflow')
      
      if (!dragData) return

      const { nodeType, agentType, label } = JSON.parse(dragData)
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      }

      let newNode: Node

      switch (nodeType) {
        case 'condition':
          newNode = {
            id: `condition-${Date.now()}`,
            type: 'conditionNode',
            position,
            data: {
              condition: 'true',
              config: {},
              label: label || 'Condition',
            },
          }
          break
        case 'trigger':
          newNode = {
            id: `trigger-${Date.now()}`,
            type: 'triggerNode',
            position,
            data: {
              triggerType: 'manual',
              config: {},
              label: label || 'Trigger',
            },
          }
          break
        case 'action':
          newNode = {
            id: `action-${Date.now()}`,
            type: 'actionNode',
            position,
            data: {
              actionType: 'notification',
              config: {},
              label: label || 'Action',
            },
          }
          break
        default:
          newNode = {
            id: `agent-${Date.now()}`,
            type: 'agentNode',
            position,
            data: {
              agentType,
              config: {},
              label: label || agentType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            },
          }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodes([node.id])
    setSelectedNode(node)
    setShowPropertiesPanel(true)
  }, [setSelectedNodes])

  const onPaneClick = useCallback(() => {
    setSelectedNodes([])
    setSelectedNode(null)
    setShowPropertiesPanel(false)
    setShowExecutionLogs(true)
  }, [setSelectedNodes])

  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    )
    updateNodeData(nodeId, data)
  }, [setNodes, updateNodeData])

  const onNodesChangeCallback = useCallback((changes: any) => {
    onNodesChange(changes)
    
    // Update local state
    const newNodes = changes.reduce((acc: Node[], change: any) => {
      if (change.type === 'remove') {
        return acc.filter(node => node.id !== change.id)
      }
      if (change.type === 'add') {
        return [...acc, change.item]
      }
      if (change.type === 'position' && change.position) {
        return acc.map(node => 
          node.id === change.id 
            ? { ...node, position: change.position }
            : node
        )
      }
      return acc
    }, nodes)
    
    // Update store with workflow data
    if (currentWorkflow) {
      const workflowData = reactFlowToWorkflowData(newNodes, edges, reactFlowInstance?.getViewport())
      updateNodes(workflowData.nodes)
      setHasUnsavedChanges(true)
    }
  }, [nodes, edges, onNodesChange, updateNodes, currentWorkflow, reactFlowInstance, setHasUnsavedChanges])

  const onEdgesChangeCallback = useCallback((changes: any) => {
    onEdgesChange(changes)
    
    // Update local state
    const newEdges = changes.reduce((acc: Edge[], change: any) => {
      if (change.type === 'remove') {
        return acc.filter(edge => edge.id !== change.id)
      }
      if (change.type === 'add') {
        return [...acc, change.item]
      }
      return acc
    }, edges)
    
    // Update store with workflow data
    if (currentWorkflow) {
      const workflowData = reactFlowToWorkflowData(nodes, newEdges, reactFlowInstance?.getViewport())
      updateEdges(workflowData.edges)
      setHasUnsavedChanges(true)
    }
  }, [nodes, edges, onEdgesChange, updateEdges, currentWorkflow, reactFlowInstance, setHasUnsavedChanges])

  const handleSave = useCallback(async () => {
    // Validate workflow before saving
    const validation = validateWorkflow()
    if (!validation.isValid) {
      alert(`Cannot save workflow: ${validation.errors.join(', ')}`)
      return
    }
    
    // Update workflow data with current viewport
    if (currentWorkflow) {
      const workflowData = reactFlowToWorkflowData(nodes, edges, reactFlowInstance?.getViewport())
      updateNodes(workflowData.nodes)
      updateEdges(workflowData.edges)
    }
    
    // Save to store
    await saveWorkflow()
    
    // Call external save handler if provided
    if (onSave) {
      const workflowData = reactFlowToWorkflowData(nodes, edges, reactFlowInstance?.getViewport())
      onSave(workflowData)
    }
  }, [nodes, edges, reactFlowInstance, onSave, updateNodes, updateEdges, validateWorkflow, currentWorkflow, saveWorkflow])

  const handleRun = useCallback(() => {
    // Validate workflow before execution
    const validation = validateWorkflow()
    if (!validation.isValid) {
      alert(`Cannot execute workflow: ${validation.errors.join(', ')}`)
      return
    }
    
    if (nodes.length === 0) {
      alert('Please add some nodes to the workflow first')
      return
    }
    
    executeWorkflow(nodes, edges)
  }, [nodes, edges, executeWorkflow, validateWorkflow])

  const handleStop = useCallback(() => {
    cancelExecution()
  }, [cancelExecution])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault()
            if (event.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case 'y':
            event.preventDefault()
            redo()
            break
          case 's':
            event.preventDefault()
            handleSave()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, handleSave])

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {showWorkflowManager ? (
        <WorkflowManager
          onWorkflowSelect={(_workflowId) => {
            setShowWorkflowManager(false)
          }}
          onClose={() => setShowWorkflowManager(false)}
        />
      ) : (
        <AgentPalette />
      )}
      
      <div className="flex-1 flex flex-col">
        <WorkflowToolbar 
          onSave={handleSave}
          onRun={handleRun}
          onStop={handleStop}
          onOpenWorkflowManager={() => setShowWorkflowManager(true)}
          isReadOnly={isReadOnly}
          selectedNodes={selectedNodes}
          isExecuting={isExecuting}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        
        <div className="flex flex-1">
          <div ref={reactFlowWrapper} className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChangeCallback}
              onEdgesChange={onEdgesChangeCallback}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gradient-to-br from-bg-primary to-bg-secondary"
              defaultEdgeOptions={{
                type: 'default',
                animated: true,
                style: { stroke: '#6366f1', strokeWidth: 2 }
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
                gap={12} 
                size={1} 
                color="var(--border-primary)"
              />
            </ReactFlow>
          </div>
          
          {(showPropertiesPanel || showExecutionLogs) && (
            <div className="w-80 bg-white border-l border-gray-300 p-4 overflow-y-auto">
              {selectedNode ? (
                <NodePropertiesPanel
                  selectedNode={selectedNode}
                  onClose={() => setShowPropertiesPanel(false)}
                  onUpdateNode={handleUpdateNode}
                />
              ) : (
                <ExecutionLogs
                  steps={currentExecution?.steps || []}
                  isExecuting={isExecuting}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Wrap with ReactFlowProvider
export const WorkflowEditorWithProvider: React.FC<WorkflowEditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowEditor {...props} />
    </ReactFlowProvider>
  )
}
