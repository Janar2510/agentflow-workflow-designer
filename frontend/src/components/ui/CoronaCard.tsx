import React, { ReactNode } from 'react'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'

interface CoronaCardProps {
  children: ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export const CoronaCard: React.FC<CoronaCardProps> = ({
  children,
  variant = 'default',
  className = '',
  style = {},
  onClick
}) => {
  const design = useCoronaDesign()
  
  const baseStyles: React.CSSProperties = {
    backgroundColor: design.colors.cardBg,
    borderRadius: '0.75rem', // Corona Admin rounded corners
    padding: design.spacing.lg,
    fontFamily: design.typography.fontFamily,
    transition: 'all 0.2s ease-in-out',
    cursor: onClick ? 'pointer' : 'default',
    border: `1px solid ${design.colors.borderPrimary}`,
    ...style
  }
  
  const variantStyles: React.CSSProperties = {
    default: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    outlined: {
      border: `2px solid ${design.colors.borderSecondary}`,
      boxShadow: 'none',
    },
    elevated: {
      border: 'none',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    }
  }[variant]
  
  const hoverStyles: React.CSSProperties = onClick ? {
    transform: 'translateY(-2px)',
    backgroundColor: design.colors.cardBgHover,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
  } : {}
  
  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          Object.assign(e.currentTarget.style, hoverStyles)
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          Object.assign(e.currentTarget.style, {
            transform: 'translateY(0)',
            backgroundColor: design.colors.cardBg,
            boxShadow: variantStyles.boxShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          })
        }
      }}
    >
      {children}
    </div>
  )
}

export default CoronaCard
