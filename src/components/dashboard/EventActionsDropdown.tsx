import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Eye, Send, Rocket, Trash2, Copy, Archive, RotateCcw, Trophy, BarChart3, Lock, Globe, Settings, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import type { EventStatus } from './EventStatusBadge';

interface ActionItem {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'danger' | 'default';
  dividerAfter?: boolean;
}

interface EventActionsDropdownProps {
  status: EventStatus;
  eventId: string;
  orgSlug?: string;
  onEdit: () => void;
  onPreview: () => void;
  onTransition: (toStatus: EventStatus) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function EventActionsDropdown({
  status,
  eventId,
  orgSlug,
  onEdit,
  onPreview,
  onTransition,
  onDuplicate,
  onDelete,
}: EventActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const publicUrl = orgSlug ? `/org/${orgSlug}/events/${eventId}` : '#';

  const actions: ActionItem[] = [];

  switch (status) {
    case 'draft':
      actions.push(
        { label: 'Edit', icon: Pencil, onClick: onEdit },
        { label: 'Preview', icon: Eye, onClick: onPreview },
        { label: 'Submit for Review', icon: Send, onClick: () => onTransition('ready_for_review'), dividerAfter: true },
        { label: 'Publish', icon: Rocket, onClick: () => onTransition('published') },
        { label: 'Duplicate', icon: Copy, onClick: onDuplicate },
        { label: 'Delete', icon: Trash2, onClick: onDelete, variant: 'danger' },
      );
      break;

    case 'ready_for_review':
      actions.push(
        { label: 'Edit', icon: Pencil, onClick: onEdit },
        { label: 'Preview', icon: Eye, onClick: onPreview },
        { label: 'Publish', icon: Rocket, onClick: () => onTransition('published'), dividerAfter: true },
        { label: 'Return to Draft', icon: RotateCcw, onClick: () => onTransition('draft') },
        { label: 'Duplicate', icon: Copy, onClick: onDuplicate },
        { label: 'Delete', icon: Trash2, onClick: onDelete, variant: 'danger' },
      );
      break;

    case 'published':
      actions.push(
        { label: 'Go Live', icon: Rocket, onClick: () => onTransition('live') },
        { label: 'Edit', icon: Pencil, onClick: onEdit },
        { label: 'View Public Page', icon: ExternalLink, onClick: onPreview },
        { label: 'Duplicate', icon: Copy, onClick: onDuplicate, dividerAfter: true },
        { label: 'Unpublish', icon: RotateCcw, onClick: () => onTransition('draft') },
        { label: 'Archive', icon: Archive, onClick: () => onTransition('archived') },
      );
      break;

    case 'live':
      actions.push(
        { label: 'Manage Live Event', icon: Settings, onClick: onPreview },
        { label: 'View Analytics', icon: BarChart3, onClick: onPreview },
        { label: 'End Voting', icon: Lock, onClick: () => onTransition('voting_ended') },
      );
      break;

    case 'voting_ended':
      actions.push(
        { label: 'Publish Winners', icon: Trophy, onClick: () => onTransition('winners_announced') },
        { label: 'View Results', icon: BarChart3, onClick: onPreview },
        { label: 'Duplicate', icon: Copy, onClick: onDuplicate, dividerAfter: true },
        { label: 'Archive', icon: Archive, onClick: () => onTransition('archived') },
      );
      break;

    case 'winners_announced':
      actions.push(
        { label: 'View Results', icon: BarChart3, onClick: onPreview },
        { label: 'View Public Page', icon: Globe, onClick: onPreview, dividerAfter: true },
        { label: 'Archive', icon: Archive, onClick: () => onTransition('archived') },
      );
      break;

    case 'closed':
      actions.push(
        { label: 'View Results', icon: BarChart3, onClick: onPreview },
        { label: 'Archive', icon: Archive, onClick: () => onTransition('archived') },
      );
      break;

    case 'archived':
      actions.push(
        { label: 'Restore', icon: RotateCcw, onClick: () => onTransition('draft') },
        { label: 'Delete Permanently', icon: Trash2, onClick: onDelete, variant: 'danger' },
      );
      break;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'h-8 w-8 inline-flex items-center justify-center rounded-lg transition-colors',
          'text-dark-500 hover:text-white hover:bg-white/5'
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 z-50 min-w-[200px] bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-1.5">
              {actions.map((action, i) => (
                <React.Fragment key={action.label}>
                  <button
                    onClick={() => { setOpen(false); action.onClick(); }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-xs',
                      action.variant === 'danger'
                        ? 'hover:bg-rose-500/10 text-rose-400'
                        : 'hover:bg-white/5 text-dark-200'
                    )}
                  >
                    <action.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{action.label}</span>
                  </button>
                  {action.dividerAfter && (
                    <div className="my-1 border-t border-white/5" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
