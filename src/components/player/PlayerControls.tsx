import React, { useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Maximize, Minimize,
  MonitorPlay, PictureInPicture2, Settings, Captions
} from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { SettingsMenu } from './SettingsMenu';
import { formatTimeDisplay } from './ProgressBar';

interface PlayerControlsProps {
  playing: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onMuteToggle: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onTheatre: () => void;
  theatre: boolean;
  onPiP: () => void;
  onFullscreen: () => void;
  fullscreen: boolean;
  playbackRate: number;
  onRateChange: (r: number) => void;
  quality: string;
  onQualityChange: (q: string) => void;
  captions: boolean;
  onCaptionsToggle: () => void;
  live?: boolean;
}

export function PlayerControls({
  playing, onPlayPause, currentTime, duration,
  volume, muted, onVolumeChange, onMuteToggle,
  onSkipBack, onSkipForward,
  onTheatre, theatre, onPiP, onFullscreen, fullscreen,
  playbackRate, onRateChange, quality, onQualityChange,
  captions, onCaptionsToggle, live,
}: PlayerControlsProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      {/* Bottom Controls Bar */}
      <div className="flex items-center gap-1 px-3 py-2">
        {/* Play */}
        <button onClick={onPlayPause} className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        {/* Skip */}
        {!live && (
          <>
            <button onClick={onSkipBack} className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors group/skip">
              <SkipBack className="h-3.5 w-3.5" />
              <span className="absolute text-[8px] font-bold text-white opacity-0 group-hover/skip:opacity-100 transition-opacity">10</span>
            </button>
            <button onClick={onSkipForward} className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors group/skip relative">
              <SkipForward className="h-3.5 w-3.5" />
              <span className="absolute text-[8px] font-bold text-white opacity-0 group-hover/skip:opacity-100 transition-opacity">10</span>
            </button>
          </>
        )}

        {/* Time */}
        <div className="text-[11px] text-dark-300 font-mono px-2 whitespace-nowrap">
          {live ? (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-bold">LIVE</span>
            </span>
          ) : (
            <span>{formatTimeDisplay(currentTime)} / {formatTimeDisplay(duration)}</span>
          )}
        </div>

        <div className="flex-1" />

        {/* Volume */}
        <VolumeControl volume={volume} muted={muted} onVolumeChange={onVolumeChange} onMuteToggle={onMuteToggle} />

        {/* Captions */}
        <button onClick={onCaptionsToggle} className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${captions ? 'text-gold-500' : 'text-dark-400 hover:text-white hover:bg-white/10'}`}>
          <Captions className="h-4 w-4" />
        </button>

        {/* Speed */}
        <button onClick={() => onRateChange(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : playbackRate === 2 ? 0.5 : 1)} className="h-8 px-2 rounded-lg flex items-center justify-center text-[10px] font-bold text-dark-400 hover:text-white hover:bg-white/10 transition-colors">
          {playbackRate === 1 ? '1x' : `${playbackRate}x`}
        </button>

        {/* Settings */}
        <div className="relative">
          <button onClick={() => setSettingsOpen(!settingsOpen)} className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${settingsOpen ? 'text-gold-500 bg-white/10' : 'text-dark-400 hover:text-white hover:bg-white/10'}`}>
            <Settings className="h-4 w-4" />
          </button>
          <SettingsMenu
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            playbackRate={playbackRate}
            onRateChange={(r) => { onRateChange(r); setSettingsOpen(false); }}
            quality={quality}
            onQualityChange={(q) => { onQualityChange(q); setSettingsOpen(false); }}
            captions={captions}
            onCaptionsToggle={onCaptionsToggle}
          />
        </div>

        {/* PiP */}
        <button onClick={onPiP} className="h-8 w-8 rounded-full flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-colors">
          <PictureInPicture2 className="h-4 w-4" />
        </button>

        {/* Theatre */}
        <button onClick={onTheatre} className="h-8 w-8 rounded-full flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-colors">
          <MonitorPlay className="h-4 w-4" />
        </button>

        {/* Fullscreen */}
        <button onClick={onFullscreen} className="h-8 w-8 rounded-full flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-colors">
          {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
