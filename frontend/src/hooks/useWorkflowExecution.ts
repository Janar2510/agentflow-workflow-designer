import { useState, useEffect, useCallback } from 'react'
import { Node, Edge } from 'reactflow'
import { workflowExecutionService, WorkflowExecution } from '../services/workflowExecutionService'

export const useWorkflowExecution = () => {
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<WorkflowExecution[]>([])

  const executeWorkflow = useCallback(async (nodes: Node[], edges: Edge[]) => {
    if (isExecuting) {
      console.warn('Workflow is already executing')
      return
    }

    setIsExecuting(true)
    setCurrentExecution(null)

    try {
      const executionId = await workflowExecutionService.executeWorkflow(nodes, edges)
      
      // Subscribe to execution updates
      const unsubscribe = workflowExecutionService.subscribe(executionId, (execution) => {
        setCurrentExecution(execution)
        
        if (execution.status === 'completed' || execution.status === 'error' || execution.status === 'cancelled') {
          setIsExecuting(false)
          setExecutionHistory(prev => [execution, ...prev.slice(0, 9)]) // Keep last 10 executions
          unsubscribe()
        }
      })
    } catch (error) {
      console.error('Failed to execute workflow:', error)
      setIsExecuting(false)
    }
  }, [isExecuting])

  const cancelExecution = useCallback(() => {
    if (currentExecution && isExecuting) {
      workflowExecutionService.cancelExecution(currentExecution.id)
    }
  }, [currentExecution, isExecuting])

  const clearHistory = useCallback(() => {
    setExecutionHistory([])
  }, [])

  // Update node statuses based on current execution
  const getNodeStatus = useCallback((nodeId: string): 'idle' | 'running' | 'completed' | 'error' => {
    if (!currentExecution) return 'idle'
    
    const step = currentExecution.steps.find(s => s.nodeId === nodeId)
    if (!step) return 'idle'
    
    switch (step.status) {
      case 'running': return 'running'
      case 'completed': return 'completed'
      case 'error': return 'error'
      case 'skipped': return 'idle'
      default: return 'idle'
    }
  }, [currentExecution])

  const getNodeExecutionData = useCallback((nodeId: string) => {
    if (!currentExecution) return null
    
    const step = currentExecution.steps.find(s => s.nodeId === nodeId)
    if (!step) return null
    
    return {
      duration: step.duration,
      error: step.error,
      output: step.output,
      startTime: step.startTime,
      endTime: step.endTime
    }
  }, [currentExecution])

  return {
    currentExecution,
    isExecuting,
    executionHistory,
    executeWorkflow,
    cancelExecution,
    clearHistory,
    getNodeStatus,
    getNodeExecutionData
  }
}

