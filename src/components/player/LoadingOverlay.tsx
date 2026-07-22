import React from 'react';
import { motion } from 'motion/react';

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-dark-950/60 backdrop-blur-sm z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative h-14 w-14">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gold-500/20" />
          {/* Spinning arc */}
          <svg className="absolute inset-0 h-14 w-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="url(#gold-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="120" strokeDashoffset="40" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '1.2s' }} />
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a843" />
                <stop offset="50%" stopColor="#f5d77a" />
                <stop offset="100%" stopColor="#d4a843" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold text-white uppercase tracking-widest">Loading Stream</p>
          <p className="text-[9px] text-dark-500 mt-1">Connecting to broadcast...</p>
        </div>
      </motion.div>
    </div>
  );
}

export function ErrorOverlay({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 text-center px-8"
      >
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-serif text-white italic mb-1">Broadcast Unavailable</h3>
          <p className="text-dark-500 text-sm">The stream could not be loaded. Please check your connection and try again.</p>
        </div>
        <button onClick={onRetry} className="h-10 px-6 rounded-full bg-gold-500 text-dark-950 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors">
          Retry
        </button>
      </motion.div>
    </div>
  );
}
