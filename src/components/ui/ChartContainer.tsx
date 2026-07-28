import React, { useRef, useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChartContainerProps {
  children: React.ReactElement;
  height?: number;
  className?: string;
  minHeight?: number;
}

export function ChartContainer({ children, height = 300, className, minHeight }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height: h } = entry.contentRect;
      if (width > 0 && h > 0) {
        setReady(true);
        observer.disconnect();
      }
    };

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('w-full min-w-0', className)}
      style={{ height: minHeight ?? height, minHeight: minHeight ?? height }}
    >
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-dark-600">
          <BarChart3 className="h-8 w-8 mb-2 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Loading chart…</p>
        </div>
      )}
    </div>
  );
}
