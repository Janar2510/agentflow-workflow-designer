import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { WorkflowNode, WorkflowEdge, ExecutionLog, Workflow, WorkflowData } from '../types'
import { nodeToWorkflowNode, edgeToWorkflowEdge, workflowNodeToNode, workflowEdgeToEdge, reactFlowToWorkflowData, workflowDataToReactFlow } from '../utils/workflowAdapters'

interface WorkflowState {
  // Current workflow
  currentWorkflow: Workflow | null
  
  // Execution state
  isExecuting: boolean
  executionLogs: ExecutionLog[]
  
  // UI state
  selectedNodes: string[]
  sidebarOpen: boolean
  
  // Workflow management
  workflows: Workflow[]
  hasUnsavedChanges: boolean
  lastSaved: Date | null
  
  // History for undo/redo
  history: WorkflowData[]
  historyIndex: number
  
  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void
  updateNodes: (nodes: WorkflowNode[]) => void
  updateEdges: (edges: WorkflowEdge[]) => void
  setExecuting: (executing: boolean) => void
  addExecutionLog: (log: ExecutionLog) => void
  clearExecutionLogs: () => void
  setSelectedNodes: (nodeIds: string[]) => void
  toggleSidebar: () => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode['data']>) => void
  addNode: (node: WorkflowNode) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: WorkflowEdge) => void
  removeEdge: (edgeId: string) => void
  clearWorkflow: () => void
  
  // Workflow CRUD operations
  createWorkflow: (name: string, description?: string) => void
  loadWorkflow: (workflowId: string) => void
  saveWorkflow: () => Promise<void>
  deleteWorkflow: (workflowId: string) => void
  duplicateWorkflow: (workflowId: string) => void
  
  // History management
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveToHistory: () => void
  
  // Auto-save
  setHasUnsavedChanges: (hasChanges: boolean) => void
  markAsSaved: () => void
  
  // Workflow validation
  validateWorkflow: () => { isValid: boolean; errors: string[] }
  
  // Import/Export
  exportWorkflow: () => string
  importWorkflow: (workflowData: string) => void
}

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    persist(
      (set, get) => ({
        currentWorkflow: null,
        isExecuting: false,
        executionLogs: [],
        selectedNodes: [],
        sidebarOpen: true,
        workflows: [],
        hasUnsavedChanges: false,
        lastSaved: null,
        history: [],
        historyIndex: -1,
        
        setCurrentWorkflow: (workflow) => 
          set({ currentWorkflow: workflow }, false, 'setCurrentWorkflow'),
        
        updateNodes: (nodes) =>
          set((state) => ({
            currentWorkflow: state.currentWorkflow 
              ? { 
                  ...state.currentWorkflow, 
                  workflow_data: {
                    ...state.currentWorkflow.workflow_data,
                    nodes
                  }
                }
              : null
          }), false, 'updateNodes'),
        
        updateEdges: (edges) =>
          set((state) => ({
            currentWorkflow: state.currentWorkflow 
              ? { 
                  ...state.currentWorkflow, 
                  workflow_data: {
                    ...state.currentWorkflow.workflow_data,
                    edges
                  }
                }
              : null
          }), false, 'updateEdges'),
        
        setExecuting: (executing) => 
          set({ isExecuting: executing }, false, 'setExecuting'),
        
        addExecutionLog: (log) =>
          set((state) => ({
            executionLogs: [log, ...state.executionLogs].slice(0, 1000)
          }), false, 'addExecutionLog'),
        
        clearExecutionLogs: () => 
          set({ executionLogs: [] }, false, 'clearExecutionLogs'),
        
        setSelectedNodes: (nodeIds) => 
          set({ selectedNodes: nodeIds }, false, 'setSelectedNodes'),
        
        toggleSidebar: () => 
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
        
        updateNodeData: (nodeId, data) =>
          set((state) => {
            if (!state.currentWorkflow) return state
            
            const updatedNodes = state.currentWorkflow.workflow_data.nodes.map(node =>
              node.id === nodeId 
                ? { ...node, data: { ...node.data, ...data } }
                : node
            )
            
            return {
              currentWorkflow: {
                ...state.currentWorkflow,
                workflow_data: {
                  ...state.currentWorkflow.workflow_data,
                  nodes: updatedNodes
                }
              }
            }
          }, false, 'updateNodeData'),
        
        addNode: (node) =>
          set((state) => {
            if (!state.currentWorkflow) return state
            
            return {
              currentWorkflow: {
                ...state.currentWorkflow,
                workflow_data: {
                  ...state.currentWorkflow.workflow_data,
                  nodes: [...state.currentWorkflow.workflow_data.nodes, node]
                }
              }
            }
          }, false, 'addNode'),
        
        removeNode: (nodeId) =>
          set((state) => {
            if (!state.currentWorkflow) return state
            
            const updatedNodes = state.currentWorkflow.workflow_data.nodes.filter(
              node => node.id !== nodeId
            )
            
            const updatedEdges = state.currentWorkflow.workflow_data.edges.filter(
              edge => edge.source !== nodeId && edge.target !== nodeId
            )
            
            return {
              currentWorkflow: {
                ...state.currentWorkflow,
                workflow_data: {
                  ...state.currentWorkflow.workflow_data,
                  nodes: updatedNodes,
                  edges: updatedEdges
                }
              },
              selectedNodes: state.selectedNodes.filter(id => id !== nodeId)
            }
          }, false, 'removeNode'),
        
        addEdge: (edge) =>
          set((state) => {
            if (!state.currentWorkflow) return state
            
            return {
              currentWorkflow: {
                ...state.currentWorkflow,
                workflow_data: {
                  ...state.currentWorkflow.workflow_data,
                  edges: [...state.currentWorkflow.workflow_data.edges, edge]
                }
              }
            }
          }, false, 'addEdge'),
        
        removeEdge: (edgeId) =>
          set((state) => {
            if (!state.currentWorkflow) return state
            
            const updatedEdges = state.currentWorkflow.workflow_data.edges.filter(
              edge => edge.id !== edgeId
            )
            
            return {
              currentWorkflow: {
                ...state.currentWorkflow,
                workflow_data: {
                  ...state.currentWorkflow.workflow_data,
                  edges: updatedEdges
                }
              }
            }
          }, false, 'removeEdge'),
        
        clearWorkflow: () =>
          set({
            currentWorkflow: null,
            selectedNodes: [],
            executionLogs: [],
            isExecuting: false,
            hasUnsavedChanges: false,
            lastSaved: null,
            history: [],
            historyIndex: -1
          }, false, 'clearWorkflow'),

        // Workflow CRUD operations
        createWorkflow: (name, description) => {
          const newWorkflow: Workflow = {
            id: `workflow_${Date.now()}`,
            user_id: 'current_user', // TODO: Get from auth store
            name,
            description: description || '',
            version: 1,
            status: 'draft',
            is_public: false,
            tags: [],
            workflow_data: {
              nodes: [],
              edges: [],
              viewport: { x: 0, y: 0, zoom: 1 }
            },
            execution_config: {
              timeout: 30000,
              retries: 3,
              parallel: false,
              variables: {}
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          set((state) => ({
            currentWorkflow: newWorkflow,
            workflows: [...state.workflows, newWorkflow],
            hasUnsavedChanges: true,
            history: [newWorkflow.workflow_data],
            historyIndex: 0
          }), false, 'createWorkflow')
        },

        loadWorkflow: (workflowId) => {
          const workflow = get().workflows.find(w => w.id === workflowId)
          if (workflow) {
            set({
              currentWorkflow: workflow,
              hasUnsavedChanges: false,
              lastSaved: new Date(workflow.updated_at),
              history: [workflow.workflow_data],
              historyIndex: 0
            }, false, 'loadWorkflow')
          }
        },

        saveWorkflow: async () => {
          const state = get()
          if (!state.currentWorkflow) return

          const updatedWorkflow = {
            ...state.currentWorkflow,
            updated_at: new Date().toISOString(),
            version: state.currentWorkflow.version + 1
          }

          // TODO: Implement actual API call
          console.log('Saving workflow:', updatedWorkflow)

          set((state) => ({
            currentWorkflow: updatedWorkflow,
            workflows: state.workflows.map(w => 
              w.id === updatedWorkflow.id ? updatedWorkflow : w
            ),
            hasUnsavedChanges: false,
            lastSaved: new Date()
          }), false, 'saveWorkflow')
        },

        deleteWorkflow: (workflowId) => {
          set((state) => ({
            workflows: state.workflows.filter(w => w.id !== workflowId),
            currentWorkflow: state.currentWorkflow?.id === workflowId ? null : state.currentWorkflow
          }), false, 'deleteWorkflow')
        },

        duplicateWorkflow: (workflowId) => {
          const workflow = get().workflows.find(w => w.id === workflowId)
          if (workflow) {
            const duplicatedWorkflow: Workflow = {
              ...workflow,
              id: `workflow_${Date.now()}`,
              name: `${workflow.name} (Copy)`,
              version: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            set((state) => ({
              workflows: [...state.workflows, duplicatedWorkflow]
            }), false, 'duplicateWorkflow')
          }
        },

        // History management
        undo: () => {
          const state = get()
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1
            const previousState = state.history[newIndex]
            
            set((state) => ({
              currentWorkflow: state.currentWorkflow ? {
                ...state.currentWorkflow,
                workflow_data: previousState
              } : null,
              historyIndex: newIndex,
              hasUnsavedChanges: true
            }), false, 'undo')
          }
        },

        redo: () => {
          const state = get()
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1
            const nextState = state.history[newIndex]
            
            set((state) => ({
              currentWorkflow: state.currentWorkflow ? {
                ...state.currentWorkflow,
                workflow_data: nextState
              } : null,
              historyIndex: newIndex,
              hasUnsavedChanges: true
            }), false, 'redo')
          }
        },

        canUndo: () => {
          return get().historyIndex > 0
        },

        canRedo: () => {
          const state = get()
          return state.historyIndex < state.history.length - 1
        },

        saveToHistory: () => {
          const state = get()
          if (!state.currentWorkflow) return

          const newHistory = state.history.slice(0, state.historyIndex + 1)
          newHistory.push(state.currentWorkflow.workflow_data)

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
            hasUnsavedChanges: true
          }, false, 'saveToHistory')
        },

        // Auto-save
        setHasUnsavedChanges: (hasChanges) =>
          set({ hasUnsavedChanges: hasChanges }, false, 'setHasUnsavedChanges'),

        markAsSaved: () =>
          set({ 
            hasUnsavedChanges: false, 
            lastSaved: new Date() 
          }, false, 'markAsSaved'),

        // Workflow validation
        validateWorkflow: () => {
          const state = get()
          if (!state.currentWorkflow) {
            return { isValid: false, errors: ['No workflow loaded'] }
          }

          const errors: string[] = []
          const { nodes, edges } = state.currentWorkflow.workflow_data

          // Check for empty workflow
          if (nodes.length === 0) {
            errors.push('Workflow must have at least one node')
          }

          // Check for orphaned nodes
          const connectedNodes = new Set<string>()
          edges.forEach(edge => {
            connectedNodes.add(edge.source)
            connectedNodes.add(edge.target)
          })

          const orphanedNodes = nodes.filter(node => 
            !connectedNodes.has(node.id) && nodes.length > 1
          )
          if (orphanedNodes.length > 0) {
            errors.push(`Orphaned nodes found: ${orphanedNodes.map(n => n.id).join(', ')}`)
          }

          // Check for cycles (basic check)
          const visited = new Set<string>()
          const recStack = new Set<string>()
          
          const hasCycle = (nodeId: string): boolean => {
            if (recStack.has(nodeId)) return true
            if (visited.has(nodeId)) return false
            
            visited.add(nodeId)
            recStack.add(nodeId)
            
            const outgoingEdges = edges.filter(e => e.source === nodeId)
            for (const edge of outgoingEdges) {
              if (hasCycle(edge.target)) return true
            }
            
            recStack.delete(nodeId)
            return false
          }

          for (const node of nodes) {
            if (hasCycle(node.id)) {
              errors.push('Workflow contains cycles')
              break
            }
          }

          return { isValid: errors.length === 0, errors }
        },

        // Import/Export
        exportWorkflow: () => {
          const state = get()
          if (!state.currentWorkflow) return ''
          
          return JSON.stringify({
            workflow: state.currentWorkflow,
            exportedAt: new Date().toISOString(),
            version: '1.0'
          }, null, 2)
        },

        importWorkflow: (workflowData) => {
          try {
            const data = JSON.parse(workflowData)
            if (data.workflow) {
              const workflow: Workflow = {
                ...data.workflow,
                id: `imported_${Date.now()}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              set((state) => ({
                workflows: [...state.workflows, workflow],
                currentWorkflow: workflow,
                hasUnsavedChanges: true
              }), false, 'importWorkflow')
            }
          } catch (error) {
            console.error('Failed to import workflow:', error)
          }
        }
      }),
      {
        name: 'agentflow-workflow-storage',
        partialize: (state) => ({
          currentWorkflow: state.currentWorkflow,
          workflows: state.workflows,
          sidebarOpen: state.sidebarOpen,
          hasUnsavedChanges: state.hasUnsavedChanges,
          lastSaved: state.lastSaved,
        }),
      }
    )
  )
)
