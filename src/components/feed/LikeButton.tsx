import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export function LikeButton({ liked, count, onToggle, size = 'md' }: LikeButtonProps) {
  const [burst, setBurst] = useState(false);

  const handleClick = () => {
    onToggle();
    if (!liked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
  };

  return (
    <button onClick={handleClick} className="relative flex items-center gap-1.5 group">
      <div className="relative">
        <motion.div animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
          <Heart className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-dark-400 group-hover:text-red-400'}`} />
        </motion.div>
        <AnimatePresence>
          {burst && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 0, x: (Math.cos(i * 60 * Math.PI / 180) * 20), y: (Math.sin(i * 60 * Math.PI / 180) * 20) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Heart className="h-2 w-2 fill-red-500 text-red-500" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
      <span className={`text-[11px] font-medium transition-colors ${liked ? 'text-red-500' : 'text-dark-400 group-hover:text-red-400'}`}>
        {count > 0 ? count.toLocaleString() : ''}
      </span>
    </button>
  );
}
