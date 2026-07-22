import React, { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onMuteToggle: () => void;
}

export function VolumeControl({ volume, muted, onVolumeChange, onMuteToggle }: VolumeControlProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const displayVol = muted ? 0 : volume;
  const Icon = muted || displayVol === 0 ? VolumeX : displayVol < 0.5 ? Volume1 : Volume2;

  const handleSlider = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onVolumeChange(pct);
  }, [onVolumeChange]);

  return (
    <div className="relative flex items-center gap-1 group/vol" onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
      <button onClick={onMuteToggle} className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
        <Icon className="h-4 w-4" />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}>
        <div ref={sliderRef} className="relative h-1 bg-white/10 rounded-full cursor-pointer group/slide hover:h-1.5 transition-all" onClick={handleSlider}>
          <div className="absolute inset-y-0 left-0 bg-gold-500 rounded-full" style={{ width: `${displayVol * 100}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gold-500 border-2 border-white opacity-0 group-hover/slide:opacity-100 transition-opacity" style={{ left: `${displayVol * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
