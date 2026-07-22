import React from 'react';

interface LiveBadgeProps {
  status: 'live' | 'replay' | 'upcoming';
  viewerCount: number;
  timeLive?: number;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function LiveBadge({ status, viewerCount, timeLive }: LiveBadgeProps) {
  if (status === 'replay') {
    return (
      <div className="flex items-center gap-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">▶ Replay</span>
      </div>
    );
  }

  if (status === 'upcoming') {
    return (
      <div className="flex items-center gap-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
        <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Upcoming</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-dark-300">
        <span>{viewerCount.toLocaleString()} watching</span>
        {timeLive !== undefined && <span className="text-dark-500">• {formatDuration(timeLive)} elapsed</span>}
      </div>
    </div>
  );
}
