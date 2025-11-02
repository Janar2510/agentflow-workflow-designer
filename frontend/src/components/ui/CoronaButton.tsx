import React, { ReactNode } from 'react'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'

interface CoronaButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const CoronaButton: React.FC<CoronaButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {},
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const design = useCoronaDesign()
  
  const baseStyles: React.CSSProperties = {
    fontFamily: design.typography.fontFamily,
    fontWeight: design.typography.weights.medium,
    borderRadius: '0.5rem', // Corona Admin rounded corners
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    ...style
  }
  
  const sizeStyles: React.CSSProperties = {
    sm: {
      padding: `${design.spacing.xs} ${design.spacing.sm}`,
      fontSize: design.typography.sizes.sm,
    },
    md: {
      padding: `${design.spacing.sm} ${design.spacing.md}`,
      fontSize: design.typography.sizes.base,
    },
    lg: {
      padding: `${design.spacing.md} ${design.spacing.lg}`,
      fontSize: design.typography.sizes.lg,
    }
  }[size]
  
  const variantStyles: React.CSSProperties = {
    primary: {
      backgroundColor: design.colors.primary,
      color: design.colors.white,
      border: `1px solid ${design.colors.primary}`,
    },
    secondary: {
      backgroundColor: design.colors.secondary,
      color: design.colors.white,
      border: `1px solid ${design.colors.secondary}`,
    },
    success: {
      backgroundColor: design.colors.success,
      color: design.colors.white,
      border: `1px solid ${design.colors.success}`,
    },
    danger: {
      backgroundColor: design.colors.danger,
      color: design.colors.white,
      border: `1px solid ${design.colors.danger}`,
    },
    warning: {
      backgroundColor: design.colors.warning,
      color: design.colors.black,
      border: `1px solid ${design.colors.warning}`,
    },
    info: {
      backgroundColor: design.colors.info,
      color: design.colors.white,
      border: `1px solid ${design.colors.info}`,
    },
    light: {
      backgroundColor: design.colors.light,
      color: design.colors.black,
      border: `1px solid ${design.colors.light}`,
    },
    dark: {
      backgroundColor: design.colors.dark,
      color: design.colors.white,
      border: `1px solid ${design.colors.dark}`,
    },
    'outline-primary': {
      backgroundColor: 'transparent',
      color: design.colors.primary,
      border: `1px solid ${design.colors.primary}`,
    },
    'outline-secondary': {
      backgroundColor: 'transparent',
      color: design.colors.secondary,
      border: `1px solid ${design.colors.secondary}`,
    }
  }[variant]
  
  const disabledStyles: React.CSSProperties = disabled ? {
    opacity: 0.65,
    cursor: 'not-allowed',
  } : {}
  
  const hoverStyles: React.CSSProperties = !disabled ? {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  } : {}
  
  return (
    <button
      type={type}
      className={className}
      style={{
        ...baseStyles,
        ...sizeStyles,
        ...variantStyles,
        ...disabledStyles,
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles)
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, {
            transform: 'translateY(0)',
            boxShadow: 'none'
          })
        }
      }}
    >
      {children}
    </button>
  )
}

export default CoronaButton
