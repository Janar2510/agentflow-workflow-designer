import { Node, Edge } from 'reactflow'
import { WorkflowNode, WorkflowEdge, WorkflowData } from '../types'

// Convert ReactFlow Node to WorkflowNode
export const nodeToWorkflowNode = (node: Node): WorkflowNode => {
  return {
    id: node.id,
    type: node.type as 'agent' | 'condition' | 'trigger' | 'action',
    position: node.position,
    data: {
      agentType: node.data.agentType,
      config: node.data.config || {},
      label: node.data.label || node.id,
      status: node.data.status,
      lastExecution: node.data.lastExecution
    }
  }
}

// Convert WorkflowNode to ReactFlow Node
export const workflowNodeToNode = (workflowNode: WorkflowNode): Node => {
  return {
    id: workflowNode.id,
    type: `${workflowNode.type}Node` as any, // agent -> agentNode, condition -> conditionNode, etc.
    position: workflowNode.position,
    data: {
      agentType: workflowNode.data.agentType,
      config: workflowNode.data.config,
      label: workflowNode.data.label,
      status: workflowNode.data.status,
      lastExecution: workflowNode.data.lastExecution
    }
  }
}

// Convert ReactFlow Edge to WorkflowEdge
export const edgeToWorkflowEdge = (edge: Edge): WorkflowEdge => {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || undefined,
    targetHandle: edge.targetHandle || undefined,
    type: edge.type as 'default' | 'smoothstep' | 'straight',
    animated: edge.animated,
    style: edge.style
  }
}

// Convert WorkflowEdge to ReactFlow Edge
export const workflowEdgeToEdge = (workflowEdge: WorkflowEdge): Edge => {
  return {
    id: workflowEdge.id,
    source: workflowEdge.source,
    target: workflowEdge.target,
    sourceHandle: workflowEdge.sourceHandle,
    targetHandle: workflowEdge.targetHandle,
    type: workflowEdge.type || 'default',
    animated: workflowEdge.animated,
    style: workflowEdge.style
  }
}

// Convert WorkflowData to ReactFlow format
export const workflowDataToReactFlow = (workflowData: WorkflowData) => {
  return {
    nodes: workflowData.nodes.map(workflowNodeToNode),
    edges: workflowData.edges.map(workflowEdgeToEdge),
    viewport: workflowData.viewport
  }
}

// Convert ReactFlow format to WorkflowData
export const reactFlowToWorkflowData = (nodes: Node[], edges: Edge[], viewport: any): WorkflowData => {
  return {
    nodes: nodes.map(nodeToWorkflowNode),
    edges: edges.map(edgeToWorkflowEdge),
    viewport: viewport || { x: 0, y: 0, zoom: 1 }
  }
}

// Create a new workflow node with proper defaults
export const createWorkflowNode = (
  id: string,
  type: 'agent' | 'condition' | 'trigger' | 'action',
  position: { x: number; y: number },
  data: Partial<WorkflowNode['data']> = {}
): WorkflowNode => {
  return {
    id,
    type,
    position,
    data: {
      agentType: data.agentType,
      config: data.config || {},
      label: data.label || id,
      status: data.status || 'idle',
      lastExecution: data.lastExecution
    }
  }
}

// Create a new workflow edge with proper defaults
export const createWorkflowEdge = (
  id: string,
  source: string,
  target: string,
  options: Partial<WorkflowEdge> = {}
): WorkflowEdge => {
  return {
    id,
    source,
    target,
    sourceHandle: options.sourceHandle,
    targetHandle: options.targetHandle,
    type: options.type || 'default',
    animated: options.animated || true,
    style: options.style || { stroke: '#6366f1', strokeWidth: 2 }
  }
}
