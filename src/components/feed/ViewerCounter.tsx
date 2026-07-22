import React from 'react';
import { Eye } from 'lucide-react';

interface ViewerCounterProps {
  count: number;
}

export function ViewerCounter({ count }: ViewerCounterProps) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-dark-300 font-medium">
      <Eye className="h-3.5 w-3.5 text-gold-500" />
      <span>{count.toLocaleString()} Watching</span>
    </div>
  );
}
