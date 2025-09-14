import React from 'react'
import { cn } from '../../lib/utils'
import { CardProps } from '../../types'
import { AGENTFLOW_CLASSES } from '../../contexts/BrandDesignContext'

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  title,
  subtitle,
  actions,
  variant = 'gradient-border',
  hoverable = false,
  className,
  onClick,
  ...props
}, ref) => {
  const baseClasses = AGENTFLOW_CLASSES.CARD
  
  const variantClasses = {
    default: 'af-card',
    glass: AGENTFLOW_CLASSES.CARD_GLASS,
    'gradient-border': AGENTFLOW_CLASSES.CARD_GRADIENT_BORDER
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverable && 'hover:shadow-lg transition-shadow duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 
                className="af-text-lg af-font-semibold mb-1 af-text-primary"
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p 
                className="af-text-sm af-text-secondary"
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
})

Card.displayName = 'Card'
