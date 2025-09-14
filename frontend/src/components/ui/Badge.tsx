import React from 'react'
import { cn } from '../../lib/utils'
import { AGENTFLOW_CLASSES } from '../../contexts/BrandDesignContext'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className
}) => {
  const baseClasses = AGENTFLOW_CLASSES.BADGE
  
  const variantClasses = {
    primary: AGENTFLOW_CLASSES.BADGE_PRIMARY,
    success: AGENTFLOW_CLASSES.BADGE_SUCCESS,
    warning: AGENTFLOW_CLASSES.BADGE_WARNING,
    danger: AGENTFLOW_CLASSES.BADGE_DANGER
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm'
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}
