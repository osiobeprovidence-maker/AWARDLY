import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export type EventStatus =
  | 'draft' | 'ready_for_review' | 'published'
  | 'live' | 'voting_ended' | 'winners_announced'
  | 'closed' | 'archived';

export const STATUS_CONFIG: Record<EventStatus, { label: string; color: string; dot: string; bg: string; border: string }> = {
  draft:             { label: 'Draft',              color: 'text-dark-400',   dot: 'bg-dark-400',   bg: 'bg-dark-800',          border: 'border-white/5' },
  ready_for_review:  { label: 'Ready for Review',   color: 'text-amber-400',  dot: 'bg-amber-400',  bg: 'bg-amber-500/10',      border: 'border-amber-500/20' },
  published:         { label: 'Published',           color: 'text-blue-400',   dot: 'bg-blue-400',   bg: 'bg-blue-500/10',       border: 'border-blue-500/20' },
  live:              { label: 'Live',                color: 'text-emerald-400', dot: 'bg-emerald-400', bg: 'bg-emerald-500/10',  border: 'border-emerald-500/20' },
  voting_ended:      { label: 'Voting Ended',        color: 'text-orange-400', dot: 'bg-orange-400', bg: 'bg-orange-500/10',     border: 'border-orange-500/20' },
  winners_announced: { label: 'Winners Announced',   color: 'text-gold-500',   dot: 'bg-gold-500',   bg: 'bg-gold-500/10',       border: 'border-gold-500/20' },
  closed:            { label: 'Closed',              color: 'text-dark-400',   dot: 'bg-dark-500',   bg: 'bg-dark-800',          border: 'border-white/5' },
  archived:          { label: 'Archived',            color: 'text-dark-500',   dot: 'bg-dark-600',   bg: 'bg-dark-900',          border: 'border-white/5' },
};

export const VALID_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  draft:             ['ready_for_review', 'published', 'archived'],
  ready_for_review:  ['draft', 'published', 'archived'],
  published:         ['live', 'draft', 'archived'],
  live:              ['voting_ended'],
  voting_ended:      ['winners_announced', 'archived'],
  winners_announced: ['archived'],
  closed:            ['archived'],
  archived:          ['draft'],
};

const DANGEROUS_TRANSITIONS = new Set(['live', 'archived', 'winners_announced']);

interface EventStatusBadgeProps {
  status: EventStatus;
  onTransition?: (toStatus: EventStatus) => void;
  disabled?: boolean;
}

export function EventStatusBadge({ status, onTransition, disabled }: EventStatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const config = STATUS_CONFIG[status];
  const transitions = VALID_TRANSITIONS[status];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!onTransition || disabled) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        config.bg, config.color, config.border
      )}>
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot, status === 'live' && 'animate-pulse')} />
        {config.label}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all hover:brightness-110 cursor-pointer',
          config.bg, config.color, config.border
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot, status === 'live' && 'animate-pulse')} />
        {config.label}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[200px] bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-1.5">
              <p className="px-3 py-1.5 text-[9px] font-bold text-dark-500 uppercase tracking-widest">
                Change Status
              </p>
              {transitions.map((ts) => {
                const tc = STATUS_CONFIG[ts];
                const isDanger = DANGEROUS_TRANSITIONS.has(ts);
                return (
                  <button
                    key={ts}
                    onClick={() => { setOpen(false); onTransition(ts); }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-xs',
                      isDanger
                        ? 'hover:bg-rose-500/10 text-rose-400'
                        : 'hover:bg-white/5 text-dark-200'
                    )}
                  >
                    <span className={cn('h-2 w-2 rounded-full shrink-0', tc.dot)} />
                    <span className="flex-1">{tc.label}</span>
                    {ts === status && <Check className="h-3 w-3 text-gold-500" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
