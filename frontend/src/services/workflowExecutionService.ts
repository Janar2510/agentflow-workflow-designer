import { Node, Edge } from 'reactflow'

export interface ExecutionStep {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'error' | 'skipped'
  startTime?: number
  endTime?: number
  duration?: number
  error?: string
  input?: any
  output?: any
}

export interface WorkflowExecution {
  id: string
  status: 'idle' | 'running' | 'completed' | 'error' | 'cancelled'
  steps: ExecutionStep[]
  startTime?: number
  endTime?: number
  totalDuration?: number
  error?: string
}

export class WorkflowExecutionService {
  private executions: Map<string, WorkflowExecution> = new Map()
  private listeners: Map<string, (execution: WorkflowExecution) => void> = new Map()

  // Simulate agent execution
  private async executeAgent(node: Node, input: any = {}): Promise<any> {
    const { agentType, config } = node.data
    
    // Simulate different execution times based on agent type
    const executionTime = this.getExecutionTime(agentType)
    await this.delay(executionTime)
    
    // Simulate different outputs based on agent type
    return this.generateOutput(agentType, input, config)
  }

  // Simulate condition evaluation
  private async evaluateCondition(node: Node, input: any = {}): Promise<boolean> {
    const { condition } = node.data
    
    // Simple condition evaluation (in real implementation, use a proper expression evaluator)
    try {
      // Replace variables with actual values
      let expression = condition
      if (typeof input === 'object' && input !== null) {
        Object.keys(input).forEach(key => {
          expression = expression.replace(new RegExp(`data\\.${key}`, 'g'), JSON.stringify(input[key]))
        })
      }
      
      // Simple evaluation (in production, use a safe expression evaluator)
      return eval(expression) === true
    } catch (error) {
      throw new Error(`Invalid condition expression: ${condition}`)
    }
  }

  // Simulate action execution
  private async executeAction(node: Node, input: any = {}): Promise<any> {
    const { actionType, config } = node.data
    
    const executionTime = this.getExecutionTime(actionType)
    await this.delay(executionTime)
    
    return this.generateActionOutput(actionType, input, config)
  }

  private getExecutionTime(type: string): number {
    const times: Record<string, number> = {
      'llm_text_generator': 2000,
      'llm_chat': 1500,
      'llm_summarizer': 3000,
      'data_processor': 1000,
      'data_analyzer': 2500,
      'api_caller': 1500,
      'email': 500,
      'notification': 300,
      'webhook': 1000,
      'database': 800,
      'condition': 100,
      'trigger': 50
    }
    return times[type] || 1000
  }

  private generateOutput(agentType: string, input: any, config: any): any {
    switch (agentType) {
      case 'llm_text_generator':
        return {
          text: `Generated text based on: ${JSON.stringify(input)}`,
          tokens: Math.floor(Math.random() * 1000) + 100,
          model: config.model || 'gpt-3.5-turbo'
        }
      case 'llm_chat':
        return {
          response: `Chat response: ${JSON.stringify(input)}`,
          conversationId: `conv_${Date.now()}`
        }
      case 'llm_summarizer':
        return {
          summary: `Summary of: ${JSON.stringify(input)}`,
          originalLength: JSON.stringify(input).length,
          summaryLength: Math.floor(JSON.stringify(input).length * 0.3)
        }
      case 'data_processor':
        return {
          processedData: { ...input, processed: true, timestamp: Date.now() },
          processingStats: { recordsProcessed: 1, errors: 0 }
        }
      case 'data_analyzer':
        return {
          analysis: {
            patterns: ['pattern1', 'pattern2'],
            insights: ['insight1', 'insight2'],
            confidence: 0.85
          }
        }
      case 'api_caller':
        return {
          response: { status: 200, data: { success: true } },
          statusCode: 200,
          responseTime: Math.random() * 1000
        }
      default:
        return { result: `Processed: ${JSON.stringify(input)}` }
    }
  }

  private generateActionOutput(actionType: string, input: any, config: any): any {
    switch (actionType) {
      case 'email':
        return {
          messageId: `email_${Date.now()}`,
          to: config.toEmail || 'user@example.com',
          subject: config.subject || 'Workflow Notification',
          status: 'sent'
        }
      case 'notification':
        return {
          notificationId: `notif_${Date.now()}`,
          status: 'delivered',
          channel: 'web'
        }
      case 'webhook':
        return {
          webhookId: `webhook_${Date.now()}`,
          status: 'sent',
          responseCode: 200
        }
      case 'database':
        return {
          operationId: `db_${Date.now()}`,
          recordsAffected: 1,
          status: 'success'
        }
      default:
        return { result: 'Action completed' }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get execution order based on graph topology
  private getExecutionOrder(nodes: Node[], edges: Edge[]): string[] {
    const inDegree = new Map<string, number>()
    const graph = new Map<string, string[]>()
    
    // Initialize
    nodes.forEach(node => {
      inDegree.set(node.id, 0)
      graph.set(node.id, [])
    })
    
    // Build graph and calculate in-degrees
    edges.forEach(edge => {
      const source = edge.source
      const target = edge.target
      
      if (graph.has(source) && graph.has(target)) {
        graph.get(source)!.push(target)
        inDegree.set(target, (inDegree.get(target) || 0) + 1)
      }
    })
    
    // Topological sort
    const queue: string[] = []
    const result: string[] = []
    
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId)
      }
    })
    
    while (queue.length > 0) {
      const current = queue.shift()!
      result.push(current)
      
      const neighbors = graph.get(current) || []
      neighbors.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1
        inDegree.set(neighbor, newDegree)
        
        if (newDegree === 0) {
          queue.push(neighbor)
        }
      })
    }
    
    return result
  }

  async executeWorkflow(nodes: Node[], edges: Edge[]): Promise<string> {
    const executionId = `exec_${Date.now()}`
    const executionOrder = this.getExecutionOrder(nodes, edges)
    
    const execution: WorkflowExecution = {
      id: executionId,
      status: 'running',
      steps: executionOrder.map(nodeId => ({
        nodeId,
        status: 'pending'
      })),
      startTime: Date.now()
    }
    
    this.executions.set(executionId, execution)
    this.notifyListeners(executionId, execution)
    
    try {
      let context: any = {}
      
      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId)
        if (!node) continue
        
        const step = execution.steps.find(s => s.nodeId === nodeId)!
        step.status = 'running'
        step.startTime = Date.now()
        this.notifyListeners(executionId, execution)
        
        try {
          let output: any
          
          switch (node.type) {
            case 'agentNode':
              output = await this.executeAgent(node, context)
              break
            case 'conditionNode':
              const conditionResult = await this.evaluateCondition(node, context)
              output = { result: conditionResult }
              step.output = output
              // Update node data with result
              node.data.result = conditionResult
              break
            case 'actionNode':
              output = await this.executeAction(node, context)
              break
            case 'triggerNode':
              output = { triggered: true, timestamp: Date.now() }
              break
            default:
              output = { processed: true }
          }
          
          step.status = 'completed'
          step.output = output
          step.endTime = Date.now()
          step.duration = step.endTime - step.startTime!
          
          // Update context for next nodes
          context = { ...context, [nodeId]: output }
          
        } catch (error) {
          step.status = 'error'
          step.error = error instanceof Error ? error.message : String(error)
          step.endTime = Date.now()
          step.duration = step.endTime - step.startTime!
          
          // Stop execution on error
          execution.status = 'error'
          execution.error = step.error
          break
        }
        
        this.notifyListeners(executionId, execution)
      }
      
      if (execution.status === 'running') {
        execution.status = 'completed'
      }
      
      execution.endTime = Date.now()
      execution.totalDuration = execution.endTime - execution.startTime!
      
    } catch (error) {
      execution.status = 'error'
      execution.error = error instanceof Error ? error.message : String(error)
      execution.endTime = Date.now()
      execution.totalDuration = execution.endTime - execution.startTime!
    }
    
    this.executions.set(executionId, execution)
    this.notifyListeners(executionId, execution)
    
    return executionId
  }

  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  subscribe(executionId: string, callback: (execution: WorkflowExecution) => void): () => void {
    this.listeners.set(executionId, callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(executionId)
    }
  }

  private notifyListeners(executionId: string, execution: WorkflowExecution): void {
    const listener = this.listeners.get(executionId)
    if (listener) {
      listener(execution)
    }
  }

  cancelExecution(executionId: string): void {
    const execution = this.executions.get(executionId)
    if (execution && execution.status === 'running') {
      execution.status = 'cancelled'
      execution.endTime = Date.now()
      execution.totalDuration = execution.endTime - execution.startTime!
      
      // Mark all pending steps as skipped
      execution.steps.forEach(step => {
        if (step.status === 'pending') {
          step.status = 'skipped'
        }
      })
      
      this.executions.set(executionId, execution)
      this.notifyListeners(executionId, execution)
    }
  }
}

// Singleton instance
export const workflowExecutionService = new WorkflowExecutionService()

