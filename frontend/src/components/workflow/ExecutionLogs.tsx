import React from 'react'
import { Clock, CheckCircle, XCircle, Play, AlertCircle } from 'lucide-react'
import { CoronaCard } from '../ui/CoronaCard'
import { CoronaBadge } from '../ui/CoronaBadge'

interface ExecutionStep {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'error' | 'skipped'
  startTime?: number
  endTime?: number
  duration?: number
  error?: string
  input?: any
  output?: any
}

interface ExecutionLogsProps {
  steps: ExecutionStep[]
  isExecuting: boolean
}

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ steps, isExecuting }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-yellow-500 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'agentflow-badge--warning'
      case 'completed': return 'agentflow-badge--success'
      case 'error': return 'agentflow-badge--danger'
      case 'skipped': return 'agentflow-badge--secondary'
      default: return 'agentflow-badge--secondary'
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '-'
    return `${duration}ms`
  }

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '-'
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Execution Logs</h3>
        {isExecuting && (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Executing...
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {steps.length === 0 ? (
          <CoronaCard className="p-4 text-center text-gray-500">
            No execution steps yet
          </CoronaCard>
        ) : (
          steps.map((step, index) => (
            <CoronaCard key={step.nodeId} className="p-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {step.nodeId}
                    </span>
                    <CoronaBadge variant={getStatusColor(step.status) as any} size="sm">
                      {step.status}
                    </CoronaBadge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Start:</span> {formatTime(step.startTime)}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {formatTime(step.endTime)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {formatDuration(step.duration)}
                    </div>
                    <div>
                      <span className="font-medium">Step:</span> {index + 1}
                    </div>
                  </div>
                  
                  {step.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      <strong>Error:</strong> {step.error}
                    </div>
                  )}
                  
                  {step.output && step.status === 'completed' && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                        View Output
                      </summary>
                      <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </CoronaCard>
          ))
        )}
      </div>
    </div>
  )
}
