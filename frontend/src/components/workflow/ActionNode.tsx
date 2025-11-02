import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Mail, Bell, Webhook, Database, FileText, Globe, Settings, X, Plus } from 'lucide-react'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'
import { AnimatedBorder } from './AnimatedBorder'
import { ConnectionPoints } from './ConnectionPoints'
import { NodeHeader } from './NodeHeader'
import { getNodeCategory } from './NodeStyles'
import './TriggerNode.css'

interface ActionNodeData {
  actionType: 'email' | 'notification' | 'webhook' | 'database' | 'file' | 'api'
  config: Record<string, any>
  label: string
  status?: 'idle' | 'running' | 'completed' | 'error'
  lastExecution?: {
    duration: number
    timestamp: string
    error?: string
  }
  onDelete?: () => void
  onAdd?: () => void
  onSettings?: () => void
}

export const ActionNode = memo<NodeProps<ActionNodeData>>(({ data, selected, isConnectable }) => {
  const design = useCoronaDesign()
  const category = getNodeCategory('actionNode', data)

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'notification': return <Bell className="w-4 h-4" />
      case 'webhook': return <Webhook className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'file': return <FileText className="w-4 h-4" />
      case 'api': return <Globe className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'running': return 'Running'
      case 'completed': return 'Completed'
      case 'error': return 'Failed'
      default: return 'Ready'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running': 
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
      case 'completed': 
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
      case 'error': 
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
      default: 
        return { color: '#40ffaa', bg: 'rgba(64, 255, 170, 0.1)' }
    }
  }

  const statusColors = getStatusColor(data.status)

  return (
    <div style={{ position: 'relative' }}>
      {/* Node Name - Outside the node */}
      <div style={{
        position: 'absolute',
        top: '-25px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '12px',
        fontWeight: 600,
        color: '#ffffff',
        whiteSpace: 'nowrap',
        zIndex: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '2px 8px',
        borderRadius: '4px',
      }}>
        {data.label}
      </div>
      
      <AnimatedBorder 
        category={category} 
        isActive={selected}
        status={data.status === 'running' ? 'executing' : data.status === 'completed' ? 'data-flow' : 'idle'}
        style={{
          width: '80px',
          height: '80px',
          fontFamily: design.typography.fontFamily,
        }}
      >
        {/* Node Icon - Centered */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'rgba(64, 255, 170, 0.1)',
          borderRadius: '8px',
        }}>
          {getActionIcon(data.actionType)}
        </div>
        
        {/* Control Buttons - Overlay */}
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          display: 'flex',
          gap: '2px',
          zIndex: 10,
        }}>
          {data.onAdd && (
            <button 
              onClick={data.onAdd}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '2px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(64, 121, 255, 0.8)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              +
            </button>
          )}
        </div>
        
        <ConnectionPoints 
          category={category}
          nodeId={data.label}
          isConnectable={isConnectable}
        />
      </AnimatedBorder>
    </div>
  )
})

ActionNode.displayName = 'ActionNode'