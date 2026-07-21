import React from 'react';
import { cn } from '../../lib/utils';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex flex-col -space-y-1", className)}>
      <span className="font-serif text-3xl font-black tracking-[-0.05em] text-white uppercase leading-none">
        Award<span className="text-gold-500">ly</span>
      </span>
      <span className="text-[7px] font-black tracking-[0.6em] uppercase text-gold-500/40 ml-1">The Global Stage</span>
    </div>
  );
}
