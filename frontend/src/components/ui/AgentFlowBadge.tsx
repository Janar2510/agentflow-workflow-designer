import React from 'react';
import { cn } from '../../lib/utils';

interface AgentFlowBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AgentFlowBadge: React.FC<AgentFlowBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span 
      className={cn(
        'af-badge',
        `af-badge--${variant}`,
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};