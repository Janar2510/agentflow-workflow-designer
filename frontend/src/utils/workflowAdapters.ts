import { Node, Edge } from 'reactflow'
import { WorkflowNode, WorkflowEdge, WorkflowData } from '../types'

// Convert ReactFlow Node to WorkflowNode
export const nodeToWorkflowNode = (node: Node): WorkflowNode => {
  // Clean the node type by removing 'Node' suffix if it exists
  let cleanType = node.type
  if (cleanType.endsWith('Node')) {
    cleanType = cleanType.replace(/Node$/, '')
  }
  
  console.log('Converting Node to WorkflowNode:', {
    originalType: node.type,
    cleanedType: cleanType,
    nodeId: node.id
  })
  
  return {
    id: node.id,
    type: cleanType as 'agent' | 'condition' | 'trigger' | 'action',
    position: node.position,
    data: {
      agentType: node.data.agentType,
      serviceType: node.data.serviceType,
      config: node.data.config || {},
      label: node.data.label || node.id,
      status: node.data.status,
      lastExecution: node.data.lastExecution
    }
  }
}

// Convert WorkflowNode to ReactFlow Node
export const workflowNodeToNode = (workflowNode: WorkflowNode): Node => {
  // Ensure we don't have corrupted node types
  let nodeType = workflowNode.type
  if (nodeType.includes('Node')) {
    // If it already contains 'Node', just use it as is
    nodeType = nodeType
  } else {
    // Add 'Node' suffix only if it doesn't exist
    nodeType = `${nodeType}Node`
  }
  
  console.log('Converting WorkflowNode to Node:', {
    originalType: workflowNode.type,
    convertedType: nodeType,
    nodeId: workflowNode.id
  })
  
  return {
    id: workflowNode.id,
    type: nodeType as any,
    position: workflowNode.position,
    data: {
      agentType: workflowNode.data.agentType,
      serviceType: workflowNode.data.serviceType,
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
      serviceType: data.serviceType,
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
