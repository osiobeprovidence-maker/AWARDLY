import React, { useState, useRef, useEffect, useCallback } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { LiveBadge } from './LiveBadge';
import { LoadingOverlay, ErrorOverlay } from './LoadingOverlay';

interface VideoPlayerProps {
  videoId: string;
  status: 'live' | 'replay' | 'upcoming';
  viewerCount: number;
  title: string;
  org?: string;
  scheduledAt?: number;
  className?: string;
}

export function VideoPlayer({ videoId, status, viewerCount, title, org, scheduledAt, className = '' }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [captions, setCaptions] = useState(false);
  const [theatre, setTheatre] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [timeLive, setTimeLive] = useState(0);

  // Timer for live duration
  useEffect(() => {
    if (status === 'live') {
      const iv = setInterval(() => setTimeLive(t => t + 1), 1000);
      return () => clearInterval(iv);
    }
  }, [status]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    if (playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3500);
    }
  }, [playing]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = () => resetControlsTimer();
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onMove);
    el.addEventListener('touchstart', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onMove);
      el.removeEventListener('touchstart', onMove);
    };
  }, [resetControlsTimer]);

  useEffect(() => {
    if (!playing) setShowControls(true);
  }, [playing]);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const p = playerRef.current?.getInternalPlayer?.();
      if (!p) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          playing ? p.pauseVideo() : p.playVideo();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          p.seekTo(Math.max(0, (p.getCurrentTime?.() || 0) - 10), true);
          break;
        case 'ArrowRight':
          e.preventDefault();
          p.seekTo((p.getCurrentTime?.() || 0) + 10, true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(v => { const nv = Math.min(1, v + 0.1); p.setVolume?.(nv * 100); return nv; });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(v => { const nv = Math.max(0, v - 0.1); p.setVolume?.(nv * 100); return nv; });
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'c':
          e.preventDefault();
          setCaptions(c => !c);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playing]);

  // YouTube callbacks
  const onReady = (e: YouTubeEvent) => {
    playerRef.current = e.target;
    const p = e.target;
    setDuration(p.getDuration?.() || 0);
    setVolume((p.getVolume?.() || 70) / 100);
    setLoading(false);
    setReady(true);
    if (status === 'live') p.playVideo?.();
  };

  const onStateChange = (e: YouTubeEvent) => {
    const state = e.data;
    if (state === 1) { setPlaying(true); resetControlsTimer(); }
    else if (state === 2) { setPlaying(false); setShowControls(true); }
    else if (state === 3) { /* buffering */ }
    else if (state === -1) { setLoading(true); }
  };

  const onError = () => { setLoading(false); setError(true); };

  // Time update loop
  useEffect(() => {
    const iv = setInterval(() => {
      const p = playerRef.current?.getInternalPlayer?.();
      if (p && typeof p.getCurrentTime === 'function') {
        setCurrentTime(p.getCurrentTime());
        setDuration(p.getDuration?.() || 0);
      }
    }, 250);
    return () => clearInterval(iv);
  }, []);

  // Controls
  const togglePlay = () => {
    const p = playerRef.current?.getInternalPlayer?.();
    if (!p) return;
    playing ? p.pauseVideo() : p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current?.getInternalPlayer?.();
    if (!p) return;
    if (muted) { p.unMute?.(); setMuted(false); } else { p.mute?.(); setMuted(true); }
  };

  const handleSeek = (time: number) => {
    const p = playerRef.current?.getInternalPlayer?.();
    if (p) p.seekTo(time, true);
    setCurrentTime(time);
  };

  const handleVolumeChange = (v: number) => {
    const p = playerRef.current?.getInternalPlayer?.();
    if (p) { p.setVolume?.(v * 100); if (v > 0 && muted) { p.unMute?.(); setMuted(false); } }
    setVolume(v);
  };

  const handleRateChange = (r: number) => {
    const p = playerRef.current?.getInternalPlayer?.();
    if (p) p.setPlaybackRate?.(r);
    setPlaybackRate(r);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  const toggleTheatre = () => setTheatre(t => !t);

  const togglePiP = async () => {
    try {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await iframe.requestPictureInPicture();
      }
    } catch {}
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    playerRef.current?.loadVideo?.(videoId);
  };

  if (status === 'upcoming' && !videoId) {
    const diff = scheduledAt ? Math.max(0, Math.ceil((scheduledAt - Date.now()) / 86400000)) : null;
    return (
      <div className={`relative bg-dark-900 rounded-2xl overflow-hidden border border-white/10 ${theatre ? 'max-w-6xl mx-auto' : ''} ${className}`} style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-20 w-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-gold-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
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
      className={`relative bg-dark-900 rounded-2xl overflow-hidden border border-white/10 group/player transition-all duration-300 select-none ${theatre ? 'max-w-6xl mx-auto' : ''} ${className}`}
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetControlsTimer}
    >
      {/* YouTube Player */}
      <YouTube
        videoId={videoId}
        opts={{
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            origin: window.location.origin,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
      />

      {/* Loading */}
      <AnimatePresence>{loading && !error && <LoadingOverlay />}</AnimatePresence>

      {/* Error */}
      {error && <ErrorOverlay onRetry={handleRetry} />}

      {/* Top Overlay */}
      <AnimatePresence>
        {showControls && ready && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-4 pb-12"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                {status === 'live' && (
                  <LiveBadge status={status} viewerCount={viewerCount} timeLive={timeLive} />
                )}
                {status === 'replay' && (
                  <LiveBadge status={status} viewerCount={viewerCount} />
                )}
                <h3 className="text-sm sm:text-base font-serif text-white italic drop-shadow-lg">{title}</h3>
                {org && <p className="text-[10px] text-dark-300 drop-shadow-lg">{org}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Button (when paused) */}
      <AnimatePresence>
        {!playing && ready && !loading && !error && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gold-500/20 backdrop-blur-sm flex items-center justify-center border border-gold-500/30 hover:bg-gold-500/30 transition-colors">
              <Play className="h-8 w-8 sm:h-10 sm:w-10 text-gold-500 ml-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && ready && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12"
          >
            {/* Progress */}
            <div className="px-3 pb-1">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                buffered={buffered}
                onSeek={handleSeek}
                live={status === 'live'}
              />
            </div>
            {/* Controls */}
            <PlayerControls
              playing={playing}
              onPlayPause={togglePlay}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              muted={muted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
              onSkipBack={() => handleSeek(Math.max(0, currentTime - 10))}
              onSkipForward={() => handleSeek(currentTime + 10)}
              onTheatre={toggleTheatre}
              theatre={theatre}
              onPiP={togglePiP}
              onFullscreen={toggleFullscreen}
              fullscreen={fullscreen}
              playbackRate={playbackRate}
              onRateChange={handleRateChange}
              quality={quality}
              onQualityChange={setQuality}
              captions={captions}
              onCaptionsToggle={() => setCaptions(c => !c)}
              live={status === 'live'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to Play/Pause */}
      <div className="absolute inset-0 z-[5] cursor-pointer" onClick={togglePlay} onDoubleClick={toggleFullscreen} />
    </div>
  );
}

export type { VideoPlayerProps };
