import React from 'react';
import { cn } from '../../lib/utils';

interface AgentFlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  asChild?: boolean;
}

export const AgentFlowButton = React.forwardRef<HTMLButtonElement, AgentFlowButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  asChild = false,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const buttonClasses = cn(
    'af-btn',
    `af-btn--${variant}`,
    sizeClasses[size],
    className
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(buttonClasses, (children as React.ReactElement).props.className),
      ref,
      ...props
    });
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      {...props}
    >
      {icon && <span className="af-btn__icon">{icon}</span>}
      {children}
    </button>
  );
});

AgentFlowButton.displayName = 'AgentFlowButton';