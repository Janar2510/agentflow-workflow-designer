import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Bot, Settings, Play, AlertCircle, CheckCircle, Clock, Zap, Trash2, Copy, X, Plus } from 'lucide-react'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'
import ServiceIcon from '../ui/ServiceIcons'
import Loader from '../ui/Loader'
import { AnimatedBorder } from './AnimatedBorder'
import { ConnectionPoints } from './ConnectionPoints'
import { NodeHeader } from './NodeHeader'
import { getNodeCategory } from './NodeStyles'
import './TriggerNode.css'

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
  serviceType?: string
  onDelete?: (nodeId: string) => void
  onReplace?: (nodeId: string) => void
  onDisconnect?: (nodeId: string) => void
  onAdd?: () => void
  onSettings?: () => void
}

export const AgentNode = memo<NodeProps<AgentNodeData>>(({ data, selected, isConnectable, id }) => {
  const design = useCoronaDesign()
  const category = getNodeCategory('agentNode', data)

  const getServiceColor = (serviceType?: string) => {
    switch (serviceType?.toLowerCase()) {
      case 'gmail':
        return { primary: '#EA4335', secondary: '#FCE8E6' }
      case 'slack':
        return { primary: '#4A154B', secondary: '#F4E4F6' }
      case 'discord':
        return { primary: '#5865F2', secondary: '#E8E9FF' }
      case 'github':
        return { primary: '#181717', secondary: '#F6F8FA' }
      case 'aws-lambda':
        return { primary: '#FF9900', secondary: '#FFF4E6' }
      case 'telegram':
        return { primary: '#0088CC', secondary: '#E6F7FF' }
      case 'microsoft-outlook':
        return { primary: '#0078D4', secondary: '#E6F2FF' }
      case 'airtable':
        return { primary: '#18BFFF', secondary: '#E6F9FF' }
      case 'servicenow':
        return { primary: '#81C784', secondary: '#E8F5E8' }
      case 'pagerduty':
        return { primary: '#06AC38', secondary: '#E6F7E6' }
      case 'rabbitmq':
        return { primary: '#FF6600', secondary: '#FFF0E6' }
      default: 
        return { primary: '#6B7280', secondary: '#F3F4F6' }
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running': 
        return <Play className="w-4 h-4" style={{ color: '#f59e0b' }} />
      case 'completed': 
        return <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
      case 'error': 
        return <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
      default: 
        return <Bot className="w-4 h-4" style={{ color: '#40ffaa' }} />
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

  const serviceColors = getServiceColor(data.serviceType)
  const statusColors = getStatusColor(data.status)

  const handleDelete = () => {
    if (data.onDelete && id) {
      data.onDelete(id)
    }
  }

  const handleAdd = () => {
    if (data.onAdd) {
      data.onAdd()
    }
  }

  const handleSettings = () => {
    if (data.onSettings) {
      data.onSettings()
    }
  }

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
          background: serviceColors.secondary,
          color: serviceColors.primary,
          borderRadius: '8px',
        }}>
          <ServiceIcon service={data.serviceType || 'default'} size={24} />
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
              onClick={handleAdd}
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

AgentNode.displayName = 'AgentNode'