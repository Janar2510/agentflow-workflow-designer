import React from 'react';
import { cn } from '../../lib/utils';

interface AgentFlowContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AgentFlowContainer: React.FC<AgentFlowContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('af-container', className)}>
      {children}
    </div>
  );
};

interface AgentFlowGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number;
}

export const AgentFlowGrid: React.FC<AgentFlowGridProps> = ({
  children,
  className,
  columns
}) => {
  const gridStyle = columns ? { 
    gridTemplateColumns: `repeat(${columns}, 1fr)` 
  } : {};

  return (
    <div 
      className={cn('af-grid', className)}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

interface AgentFlowHorizontalProps {
  children: React.ReactNode;
  className?: string;
}

export const AgentFlowHorizontal: React.FC<AgentFlowHorizontalProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('af-flex-horizontal', className)}>
      {children}
    </div>
  );
};











