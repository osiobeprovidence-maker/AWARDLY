import React from 'react';
import { Radio, MessageCircle, FileText, Video } from 'lucide-react';

type EmptyType = 'livestream' | 'comments' | 'posts' | 'videos';

interface EmptyStateProps {
  type: EmptyType;
  action?: React.ReactNode;
}

const configs: Record<EmptyType, { icon: React.ElementType; title: string; description: string }> = {
  livestream: { icon: Radio, title: 'No Livestream Available', description: 'The broadcast has not started yet. Check back when the event goes live.' },
  comments: { icon: MessageCircle, title: 'No Comments Yet', description: 'Be the first to share your thoughts!' },
  posts: { icon: FileText, title: 'No Posts Yet', description: 'There are no posts in the feed right now.' },
  videos: { icon: Video, title: 'No Videos Available', description: 'No videos have been uploaded for this event.' },
};

export function EmptyState({ type, action }: EmptyStateProps) {
  const cfg = configs[type];
  const Icon = cfg.icon;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-5">
        <Icon className="h-8 w-8 text-dark-600" />
      </div>
      <h3 className="text-lg font-serif text-white italic mb-2">{cfg.title}</h3>
      <p className="text-dark-500 text-sm max-w-xs mb-4">{cfg.description}</p>
      {action}
    </div>
  );
}
