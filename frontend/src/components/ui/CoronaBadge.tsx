import React, { ReactNode } from 'react'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'

interface CoronaBadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export const CoronaBadge: React.FC<CoronaBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {}
}) => {
  const design = useCoronaDesign()
  
  const baseStyles: React.CSSProperties = {
    fontFamily: design.typography.fontFamily,
    fontWeight: design.typography.weights.semibold,
    borderRadius: '0.5rem', // Corona Admin rounded corners
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'baseline',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    ...style
  }
  
  const sizeStyles: React.CSSProperties = {
    sm: {
      padding: `${design.spacing.xs} ${design.spacing.sm}`,
      fontSize: design.typography.sizes.xs,
    },
    md: {
      padding: `${design.spacing.xs} ${design.spacing.sm}`,
      fontSize: design.typography.sizes.sm,
    },
    lg: {
      padding: `${design.spacing.sm} ${design.spacing.md}`,
      fontSize: design.typography.sizes.base,
    }
  }[size]
  
  const variantStyles: React.CSSProperties = {
    primary: {
      backgroundColor: design.colors.primary,
      color: design.colors.white,
    },
    secondary: {
      backgroundColor: design.colors.secondary,
      color: design.colors.white,
    },
    success: {
      backgroundColor: design.colors.success,
      color: design.colors.white,
    },
    danger: {
      backgroundColor: design.colors.danger,
      color: design.colors.white,
    },
    warning: {
      backgroundColor: design.colors.warning,
      color: design.colors.black,
    },
    info: {
      backgroundColor: design.colors.info,
      color: design.colors.white,
    },
    light: {
      backgroundColor: design.colors.light,
      color: design.colors.black,
    },
    dark: {
      backgroundColor: design.colors.dark,
      color: design.colors.white,
    }
  }[variant]
  
  return (
    <span
      className={className}
      style={{
        ...baseStyles,
        ...sizeStyles,
        ...variantStyles,
      }}
    >
      {children}
    </span>
  )
}

export default CoronaBadge
