import React from 'react';
import { AlertTriangle, Rocket, Lock, Trophy, Archive, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { EventStatus, STATUS_CONFIG } from './EventStatusBadge';

interface StatusChangeConfirmModalProps {
  open: boolean;
  fromStatus: EventStatus;
  toStatus: EventStatus;
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const STATUS_ACTION_INFO: Record<string, { title: string; description: string; icon: React.ElementType; danger?: boolean }> = {
  'live':              { title: 'Go Live?',              description: 'This will make the event visible to the public and activate voting. This action starts the event.', icon: Rocket },
  'voting_ended':      { title: 'End Voting?',           description: 'This will stop all voting immediately. Voters will no longer be able to cast votes.', icon: Lock },
  'winners_announced': { title: 'Announce Winners?',     description: 'This will finalize the results and publicly announce the winners. This cannot be undone.', icon: Trophy, danger: true },
  'archived':          { title: 'Archive Event?',        description: 'This will hide the event from public view. You can restore it later.', icon: Archive, danger: true },
  'draft':             { title: 'Restore to Draft?',     description: 'This will restore the event back to draft status for further editing.', icon: RotateCcw },
};

function getActionInfo(toStatus: EventStatus) {
  return STATUS_ACTION_INFO[toStatus] || {
    title: `Change to ${STATUS_CONFIG[toStatus].label}?`,
    description: `Update the event status to ${STATUS_CONFIG[toStatus].label}.`,
    icon: AlertTriangle,
  };
}

export function StatusChangeConfirmModal({
  open,
  fromStatus,
  toStatus,
  eventTitle,
  onConfirm,
  onCancel,
  loading,
}: StatusChangeConfirmModalProps) {
  const info = getActionInfo(toStatus);
  const toConfig = STATUS_CONFIG[toStatus];
  const Icon = info.icon;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
          >
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
              info.danger ? 'bg-rose-500/10' : 'bg-gold-500/10'
            }`}>
              <Icon className={`h-8 w-8 ${info.danger ? 'text-rose-500' : 'text-gold-500'}`} />
            </div>

            <h2 className="text-2xl font-serif text-white mb-2">{info.title}</h2>
            <p className="text-dark-400 text-sm mb-2">{info.description}</p>
            <p className="text-dark-500 text-xs mb-8">
              <span className="text-dark-300 font-medium">{eventTitle}</span>
              {' '}&mdash;{' '}
              <span className={toConfig.color}>{toConfig.label}</span>
            </p>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className={`w-full text-white ${
                  info.danger
                    ? 'bg-rose-600 hover:bg-rose-700 border-rose-600'
                    : 'bg-gold-600 hover:bg-gold-700 border-gold-600'
                }`}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {loading ? 'Processing...' : `Confirm ${toConfig.label}`}
              </Button>
              <Button variant="ghost" className="w-full" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
