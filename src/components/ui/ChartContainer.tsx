import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';

interface ChartContainerProps {
  children: React.ReactElement;
  height?: number;
  className?: string;
}

export function ChartContainer({ children, height = 300, className }: ChartContainerProps) {
  return (
    <div
      className={cn('w-full min-w-0', className)}
      style={{ height, minHeight: height }}
    >
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
