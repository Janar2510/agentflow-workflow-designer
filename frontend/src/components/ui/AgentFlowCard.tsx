import React from 'react';
import { cn } from '../../lib/utils';

interface AgentFlowCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'glass-light' | 'glass-strong' | 'gradient-border';
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const AgentFlowCard: React.FC<AgentFlowCardProps> = ({
  children,
  variant = 'default',
  className,
  animate = true,
  onClick,
  style
}) => {
  return (
    <div 
      className={cn(
        'af-card',
        variant === 'glass' && 'af-card--glass',
        variant === 'glass-light' && 'af-card--glass-light',
        variant === 'glass-strong' && 'af-card--glass-strong',
        variant === 'gradient-border' && 'af-card--gradient-border',
        animate && 'af-fade-in',
        onClick && 'cursor-pointer hover:scale-105 transition-transform',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};