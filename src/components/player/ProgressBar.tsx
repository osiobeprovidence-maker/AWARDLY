import React, { useRef, useState, useCallback } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  onPreview?: (time: number) => void;
  live?: boolean;
}

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`;
}

export function ProgressBar({ currentTime, duration, buffered, onSeek, live }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [dragging, setDragging] = useState(false);

  const getTimeFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!barRef.current || !duration) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return pct * duration;
  }, [duration]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverX(pct * 100);
    setHoverTime(pct * duration);
    if (dragging) onSeek(pct * duration);
  }, [duration, dragging, onSeek]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    const time = getTimeFromEvent(e);
    onSeek(time);
    const up = () => { setDragging(false); window.removeEventListener('mouseup', up); };
    window.addEventListener('mouseup', up);
  }, [getTimeFromEvent, onSeek]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true);
    onSeek(getTimeFromEvent(e));
  }, [getTimeFromEvent, onSeek]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
    onSeek(pct * duration);
  }, [duration, onSeek]);

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  if (live) {
    return (
      <div className="relative w-full h-1 group/progress cursor-pointer">
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full transition-all" style={{ width: '100%' }} />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-dark-950/90 backdrop-blur-sm rounded-full px-2 py-0.5 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Live</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={barRef}
      className="relative w-full h-1.5 group/progress cursor-pointer hover:h-2.5 transition-all"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setDragging(false); }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* Track */}
      <div className="absolute inset-0 bg-white/10 rounded-full" />
      {/* Buffered */}
      <div className="absolute inset-y-0 left-0 bg-white/20 rounded-full" style={{ width: `${bufPct}%` }} />
      {/* Progress */}
      <div className="absolute inset-y-0 left-0 bg-gold-500 rounded-full" style={{ width: `${pct}%` }} />
      {/* Hover Preview */}
      {hover && (
        <>
          <div className="absolute inset-y-0 left-0 bg-gold-500/30 rounded-full" style={{ width: `${hoverX}%` }} />
          <div className="absolute top-0 -translate-y-8 -translate-x-1/2 bg-dark-950/95 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded-md border border-white/10 pointer-events-none whitespace-nowrap font-mono" style={{ left: `${hoverX}%` }}>
            {formatTime(hoverTime)}
          </div>
        </>
      )}
      {/* Scrubber */}
      <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-gold-500 border-2 border-white shadow-lg transition-opacity ${hover || dragging ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${pct}%` }} />
    </div>
  );
}

export function formatTimeDisplay(s: number): string {
  return formatTime(s);
}
