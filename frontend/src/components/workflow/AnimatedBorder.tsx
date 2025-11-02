import React from 'react'
import { NodeCategory } from './NodeStyles'

interface AnimatedBorderProps {
  category: NodeCategory
  isActive?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
  status?: 'idle' | 'active' | 'executing' | 'data-flow'
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({ 
  category, 
  isActive = false, 
  children, 
  style,
  status = 'idle'
}) => {
  // Get colors based on category
  const getCategoryColors = () => {
    if (category.borderStyle === 'solid') {
      return {
        primary: category.colors[0],
        secondary: category.colors[1] || category.colors[0],
        background: '#2a2a3e'
      }
    }
    // Use category-specific colors for gradient borders
    const primaryColor = category.colors[0]
    const secondaryColor = category.colors[1] || category.colors[0]
    const tertiaryColor = category.colors[2] || category.colors[1] || category.colors[0]
    
    return {
      primary: primaryColor,
      secondary: secondaryColor,
      tertiary: tertiaryColor,
      background: '#2a2a3e'
    }
  }

  const colors = getCategoryColors()

  // Get status-based styles
  const getStatusStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      borderRadius: '12px',
      overflow: 'visible' as const,
      width: '80px',
      height: '80px',
      ...style
    }

    switch (status) {
      case 'executing':
        return {
          ...baseStyles,
          boxShadow: '0 0 30px rgba(64, 121, 255, 0.4)',
          transform: 'scale(1.02)',
        }
      case 'data-flow':
        return {
          ...baseStyles,
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
        }
      case 'active':
        return {
          ...baseStyles,
          boxShadow: '0 0 20px rgba(64, 255, 170, 0.3)',
        }
      default:
        return {
          ...baseStyles,
          boxShadow: '0 0 10px rgba(64, 255, 170, 0.2)',
        }
    }
  }

  const nodeStyles = getStatusStyles()


  // Node content styles
  const contentStyles: React.CSSProperties = {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 1,
    transition: 'all 0.3s ease',
  }

  // Status indicator styles
  const statusIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#1f2937',
    border: `2px solid ${colors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  }

  const statusDotStyles: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: colors.primary,
    animation: status === 'executing' ? 'pulse-blue 1s infinite' : 
               status === 'data-flow' ? 'pulse-purple 0.8s infinite' :
               status === 'active' ? 'pulse-green 2s infinite' : 'none',
  }

  return (
    <div style={{
      ...nodeStyles,
      border: `2px solid ${colors.primary}`,
      boxShadow: `0 0 15px ${colors.primary}60`,
      background: colors.background,
    }}>
      {/* Node Content */}
      <div style={{
        ...contentStyles,
        background: 'transparent',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>
      
      {/* Status Indicator */}
      <div style={statusIndicatorStyles}>
        <div style={statusDotStyles} />
      </div>
    </div>
  )
}

