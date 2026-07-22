import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToasts } from '../../lib/feedData';

export function NotificationToast() {
  const toasts = useToasts();
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/30 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              {t.icon && <span className="text-sm">{t.icon}</span>}
              <span className="text-[11px] text-white font-medium">{t.text}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
