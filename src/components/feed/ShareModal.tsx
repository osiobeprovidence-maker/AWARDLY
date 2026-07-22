import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link2, CheckCircle2 } from 'lucide-react';
import { showToast } from '../../lib/feedData';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

const shareOptions = [
  { label: 'Copy Link', icon: '🔗', color: 'text-white', action: 'copy' },
  { label: 'WhatsApp', icon: '💬', color: 'text-green-500', action: 'whatsapp' },
  { label: 'Facebook', icon: '📘', color: 'text-blue-500', action: 'facebook' },
  { label: 'X (Twitter)', icon: '🐦', color: 'text-white', action: 'twitter' },
  { label: 'LinkedIn', icon: '💼', color: 'text-blue-400', action: 'linkedin' },
  { label: 'Email', icon: '✉️', color: 'text-dark-400', action: 'email' },
];

export function ShareModal({ open, onClose, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (action: string) => {
    const text = encodeURIComponent(`${title} — Watch live on Awardly`);
    const encodedUrl = encodeURIComponent(url);
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('Link copied!', '✓');
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'whatsapp': window.open(`https://wa.me/?text=${text}%20${encodedUrl}`, '_blank'); break;
      case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank'); break;
      case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank'); break;
      case 'linkedin': window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank'); break;
      case 'email': window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${text}%0A%0A${encodedUrl}`, '_blank'); break;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Share</h3>
              <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><X className="h-4 w-4 text-dark-400" /></button>
            </div>
            <div className="p-5 space-y-2">
              {shareOptions.map(opt => (
                <button key={opt.action} onClick={() => handleShare(opt.action)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[12px] font-medium text-dark-300 group-hover:text-white transition-colors">{opt.label}</span>
                  {opt.action === 'copy' && copied && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
