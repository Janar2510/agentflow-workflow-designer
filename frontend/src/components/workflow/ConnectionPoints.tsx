import React from 'react'
import { Handle, Position } from 'reactflow'
import { NodeCategory } from './NodeStyles'

interface ConnectionPointsProps {
  category: NodeCategory
  nodeId: string
  isConnectable?: boolean
}

export const ConnectionPoints: React.FC<ConnectionPointsProps> = ({ 
  category, 
  nodeId, 
  isConnectable = true 
}) => {
  console.log('🔗 ConnectionPoints rendered for node:', nodeId, 'category:', category.name, 'connectionPoints:', category.connectionPoints)
  const handleStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    border: '2px solid #40ffaa',
    backgroundColor: '#40ffaa',
    borderRadius: '50%',
    transition: 'all 0.2s ease-in-out',
    zIndex: 1000,
  }

  const handles = []

  if (category.connectionPoints.top) {
    console.log('🔝 Adding top handle for node:', nodeId)
    handles.push(
      <Handle
        key="top"
        type="target"
        position={Position.Top}
        id="top"
        style={{
          ...handleStyle,
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        isConnectable={isConnectable}
      />
    )
  }

  if (category.connectionPoints.bottom) {
    console.log('🔽 Adding bottom handle for node:', nodeId)
    handles.push(
      <Handle
        key="bottom"
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          ...handleStyle,
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        isConnectable={isConnectable}
      />
    )
  }

  if (category.connectionPoints.left) {
    console.log('⬅️ Adding left handle for node:', nodeId)
    handles.push(
      <Handle
        key="left"
        type="target"
        position={Position.Left}
        id="left"
        style={{
          ...handleStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        isConnectable={isConnectable}
      />
    )
  }

  if (category.connectionPoints.right) {
    console.log('➡️ Adding right handle for node:', nodeId)
    handles.push(
      <Handle
        key="right"
        type="source"
        position={Position.Right}
        id="right"
        style={{
          ...handleStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        isConnectable={isConnectable}
      />
    )
  }

  return <>{handles}</>
}


