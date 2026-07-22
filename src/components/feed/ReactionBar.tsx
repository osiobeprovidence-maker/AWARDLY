import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const reactionEmojis = ['❤️', '👏', '🔥', '🎉', '😂'];

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

export function ReactionBar() {
  const [floating, setFloating] = useState<FloatingReaction[]>([]);

  const addReaction = (emoji: string) => {
    const id = `r${Date.now()}`;
    const x = 20 + Math.random() * 60;
    setFloating(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => setFloating(prev => prev.filter(r => r.id !== id)), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {reactionEmojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => addReaction(emoji)}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floating.map(r => (
            <motion.div
              key={r.id}
              initial={{ opacity: 1, y: 0, x: `${r.x}%` }}
              animate={{ opacity: 0, y: -120 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute bottom-0 text-2xl"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
