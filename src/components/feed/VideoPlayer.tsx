import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, MonitorPlay, PictureInPicture2, Radio } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  status: 'live' | 'replay' | 'upcoming';
  scheduledAt?: number;
}

export function VideoPlayer({ videoId, status, scheduledAt }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheatre, setIsTheatre] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  const resetControls = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) { document.exitFullscreen(); }
    else { containerRef.current.requestFullscreen(); }
  };

  if (status === 'upcoming' && !videoId) {
    const diff = scheduledAt ? Math.max(0, Math.ceil((scheduledAt - Date.now()) / 86400000)) : null;
    return (
      <div className="relative w-full bg-dark-900 rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-20 w-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6">
            <Radio className="h-10 w-10 text-gold-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-serif text-white italic mb-2">Broadcast Coming Soon</h3>
          <p className="text-dark-500 text-sm max-w-sm">The live stream will begin shortly. Stay tuned!</p>
          {diff !== null && (
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-gold-500 uppercase tracking-widest">
              <span>Starts in {diff} Day{diff === 1 ? '' : 's'}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-dark-900 rounded-2xl overflow-hidden border border-white/10 group transition-all duration-300 ${isTheatre ? 'max-w-6xl mx-auto' : ''}`}
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetControls}
      onMouseLeave={() => setShowControls(false)}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&mute=1&autoplay=1`}
        title="Live Broadcast"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />

      {/* Live Badge */}
      {status === 'live' && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Now</span>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950/90 via-dark-950/40 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setIsPlaying(!isPlaying)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-white" /> : <Play className="h-3.5 w-3.5 text-white ml-0.5" />}
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-white" /> : <Volume2 className="h-3.5 w-3.5 text-white" />}
          </button>
          <div className="flex-1" />
          <button onClick={() => setIsTheatre(!isTheatre)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <MonitorPlay className="h-3.5 w-3.5 text-white" />
          </button>
          <button onClick={() => { const el = document.querySelector('iframe'); if (el) { const doc = el.contentDocument || el.contentWindow?.document; if (doc) doc.documentElement.requestPictureInPicture?.(); } }} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <PictureInPicture2 className="h-3.5 w-3.5 text-white" />
          </button>
          <button onClick={toggleFullscreen} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            {isFullscreen ? <Minimize className="h-3.5 w-3.5 text-white" /> : <Maximize className="h-3.5 w-3.5 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
