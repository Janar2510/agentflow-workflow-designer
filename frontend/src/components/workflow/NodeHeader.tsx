import React from 'react'
import { Settings, X, Plus } from 'lucide-react'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'

interface NodeHeaderProps {
  icon: React.ReactNode
  label: string
  description?: string
  onDelete?: () => void
  onAdd?: () => void
  onSettings?: () => void
  showAddButton?: boolean
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({
  icon,
  label,
  description,
  onDelete,
  onAdd,
  onSettings,
  showAddButton = true
}) => {
  const design = useCoronaDesign()

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: design.spacing.sm
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: design.spacing.sm }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          {icon}
        </div>
        <div>
          <div style={{ 
            ...design.text('body'),
            fontWeight: design.typography.weights.semibold,
            color: 'white',
            fontSize: design.typography.sizes.sm
          }}>
            {label}
          </div>
          {description && (
            <div style={{
              ...design.text('caption'),
              color: '#a0a0a0',
              fontSize: '11px',
              marginTop: '2px'
            }}>
              {description}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: design.spacing.xs }}>
        {onSettings && (
          <button 
            onClick={onSettings}
            style={{
              padding: design.spacing.xs,
              borderRadius: design.spacing.xs,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#a0a0a0',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#a0a0a0'
            }}
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
        
        {showAddButton && onAdd && (
          <button 
            onClick={onAdd}
            style={{
              padding: design.spacing.xs,
              borderRadius: design.spacing.xs,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#a0a0a0',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(64, 255, 170, 0.2)'
              e.currentTarget.style.color = '#40ffaa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#a0a0a0'
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        
        {onDelete && (
          <button 
            onClick={onDelete}
            style={{
              padding: design.spacing.xs,
              borderRadius: design.spacing.xs,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#a0a0a0',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#a0a0a0'
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}




