import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { GitBranch, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ConditionNodeData {
  condition: string
  config: Record<string, any>
  label: string
  status?: 'idle' | 'running' | 'completed' | 'error'
  result?: boolean
  lastExecution?: {
    duration: number
    timestamp: string
    error?: string
  }
}

export const ConditionNode = memo<NodeProps<ConditionNodeData>>(({ data, selected }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running': 
        return 'border-yellow-500 bg-yellow-500/10'
      case 'completed': 
        return data.result ? 'border-green-500 bg-green-500/10' : 'border-blue-500 bg-blue-500/10'
      case 'error': 
        return 'border-red-500 bg-red-500/10'
      default: 
        return 'border-purple-500 bg-purple-500/10'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running': 
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'completed': 
        return data.result ? 
          <CheckCircle className="w-4 h-4 text-green-500" /> : 
          <XCircle className="w-4 h-4 text-blue-500" />
      case 'error': 
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default: 
        return <GitBranch className="w-4 h-4 text-purple-500" />
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'running': return 'Evaluating'
      case 'completed': return data.result ? 'True' : 'False'
      case 'error': return 'Error'
      default: return 'Ready'
    }
  }

  return (
    <div className={cn(
      'agentflow-card min-w-[200px] max-w-[300px] transition-all duration-200',
      selected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-bg-primary' : '',
      getStatusColor(data.status)
    )}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-gray-300 bg-white hover:border-purple-500 transition-colors"
      />
      
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(data.status)}
            <span className="font-medium text-gray-900 text-sm">
              {data.label}
            </span>
          </div>
        </div>
        
        {/* Condition */}
        <div className="text-xs text-gray-600 bg-bg-tertiary px-2 py-1 rounded font-mono">
          {data.condition || 'No condition set'}
        </div>
        
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-xs font-medium',
            data.status === 'running' && 'text-yellow-500',
            data.status === 'completed' && (data.result ? 'text-green-500' : 'text-blue-500'),
            data.status === 'error' && 'text-red-500',
            !data.status && 'text-gray-500'
          )}>
            {getStatusText(data.status)}
          </span>
          
          {data.lastExecution && (
            <div className="text-xs text-gray-500">
              {data.lastExecution.duration}ms
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {data.status === 'error' && data.lastExecution?.error && (
          <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded">
            {data.lastExecution.error}
          </div>
        )}
      </div>
      
      {/* True Output */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 border-2 border-green-500 bg-white hover:border-green-600 transition-colors"
        style={{ left: '25%' }}
      />
      
      {/* False Output */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 border-2 border-blue-500 bg-white hover:border-blue-600 transition-colors"
        style={{ left: '75%' }}
      />
    </div>
  )
})

ConditionNode.displayName = 'ConditionNode'

