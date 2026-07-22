import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { showToast } from '../../lib/feedData';

interface FollowButtonProps {
  following: boolean;
  onToggle: () => void;
  orgName?: string;
}

export function FollowButton({ following, onToggle, orgName }: FollowButtonProps) {
  const handleToggle = () => {
    onToggle();
    showToast(following ? `Unfollowed ${orgName || 'user'}` : `Following ${orgName || 'user'}`, '✓');
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
        following
          ? 'bg-white/5 border-white/10 text-dark-300 hover:border-red-500/30 hover:text-red-400'
          : 'bg-gold-500 border-gold-500 text-dark-950 hover:bg-gold-400'
      }`}
    >
      {following ? <UserCheck className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
