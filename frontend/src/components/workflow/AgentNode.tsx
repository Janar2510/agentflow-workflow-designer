import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Bot, Settings, Play, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AgentNodeData {
  agentType: string
  config: Record<string, any>
  label: string
  status?: 'idle' | 'running' | 'completed' | 'error'
  lastExecution?: {
    duration: number
    timestamp: string
    error?: string
  }
}

export const AgentNode = memo<NodeProps<AgentNodeData>>(({ data, selected }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running': 
        return 'border-yellow-500 bg-yellow-500/10'
      case 'completed': 
        return 'border-green-500 bg-green-500/10'
      case 'error': 
        return 'border-red-500 bg-red-500/10'
      default: 
        return 'border-blue-500 bg-blue-500/10'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running': 
        return <Play className="w-4 h-4 text-yellow-500" />
      case 'completed': 
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': 
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default: 
        return <Bot className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'running': return 'Running'
      case 'completed': return 'Completed'
      case 'error': return 'Error'
      default: return 'Ready'
    }
  }

  return (
    <div className={cn(
      'agentflow-card min-w-[200px] max-w-[300px] transition-all duration-200',
      selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-bg-primary' : '',
      getStatusColor(data.status)
    )}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-gray-300 bg-white hover:border-blue-500 transition-colors"
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
          <button className="p-1 hover:bg-bg-glass rounded transition-colors">
            <Settings className="w-4 h-4 text-gray-500 hover:text-gray-900" />
          </button>
        </div>
        
        {/* Agent Type */}
        <div className="text-xs text-gray-500 bg-bg-tertiary px-2 py-1 rounded">
          {data.agentType}
        </div>
        
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-xs font-medium',
            data.status === 'running' && 'text-yellow-500',
            data.status === 'completed' && 'text-green-500',
            data.status === 'error' && 'text-red-500',
            !data.status && 'text-gray-500'
          )}>
            {getStatusText(data.status)}
          </span>
          
          {data.lastExecution && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
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
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-gray-300 bg-white hover:border-blue-500 transition-colors"
      />
    </div>
  )
})

AgentNode.displayName = 'AgentNode'
