import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Keyboard, Flag } from 'lucide-react';

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
  playbackRate: number;
  onRateChange: (r: number) => void;
  quality: string;
  onQualityChange: (q: string) => void;
  captions: boolean;
  onCaptionsToggle: () => void;
}

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
const qualities = ['Auto', '1080p', '720p', '480p', '360p'];

const shortcuts = [
  { key: 'Space', action: 'Play / Pause' },
  { key: '←', action: 'Seek back 10s' },
  { key: '→', action: 'Seek forward 10s' },
  { key: '↑', action: 'Volume up' },
  { key: '↓', action: 'Volume down' },
  { key: 'F', action: 'Fullscreen' },
  { key: 'M', action: 'Mute' },
  { key: 'C', action: 'Captions' },
];

export function SettingsMenu({ open, onClose, playbackRate, onRateChange, quality, onQualityChange, captions, onCaptionsToggle }: SettingsMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full right-0 mb-3 w-72 bg-dark-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Settings</span>
            <button onClick={onClose} className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><X className="h-3 w-3 text-dark-400" /></button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Playback Speed */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-2">Playback Speed</p>
              <div className="grid grid-cols-3 gap-1.5">
                {speeds.map(s => (
                  <button key={s} onClick={() => onRateChange(s)} className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${playbackRate === s ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                    {s === 1 ? 'Normal' : `${s}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-2">Quality</p>
              <div className="space-y-1">
                {qualities.map(q => (
                  <button key={q} onClick={() => onQualityChange(q)} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] transition-all ${quality === q ? 'bg-gold-500/10 text-gold-500' : 'text-dark-400 hover:text-white hover:bg-white/5'}`}>
                    <span>{q}</span>
                    {quality === q && <span className="text-gold-500">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitles */}
            <div className="px-4 py-3 border-b border-white/5">
              <button onClick={onCaptionsToggle} className="w-full flex items-center justify-between">
                <span className="text-[11px] text-dark-300">Subtitles / CC</span>
                <div className={`w-8 h-4.5 rounded-full transition-colors ${captions ? 'bg-gold-500' : 'bg-white/10'} relative`}>
                  <div className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform ${captions ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="h-3 w-3 text-dark-500" />
                <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Keyboard Shortcuts</p>
              </div>
              <div className="space-y-1.5">
                {shortcuts.map(sc => (
                  <div key={sc.key} className="flex items-center justify-between text-[10px]">
                    <span className="text-dark-400">{sc.action}</span>
                    <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-dark-300">{sc.key}</kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Report */}
            <div className="px-4 py-3">
              <button className="w-full flex items-center gap-2 text-[11px] text-dark-400 hover:text-red-400 transition-colors">
                <Flag className="h-3.5 w-3.5" /> Report Stream
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
