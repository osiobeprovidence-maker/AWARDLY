import React from 'react';

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded-lg ${className || ''}`} />;
}

export function VideoSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5">
      <div className="aspect-video bg-dark-800 animate-pulse flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-white/10 border-t-gold-500 animate-spin" />
        </div>
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <SkeletonPulse className="h-3 w-32" />
          <SkeletonPulse className="h-2 w-20" />
        </div>
      </div>
      <SkeletonPulse className="h-3 w-full" />
      <SkeletonPulse className="h-3 w-3/4" />
      <SkeletonPulse className="h-48 w-full rounded-xl" />
      <div className="flex gap-4 pt-2">
        <SkeletonPulse className="h-4 w-16" />
        <SkeletonPulse className="h-4 w-12" />
        <SkeletonPulse className="h-4 w-10" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-2.5">
          <SkeletonPulse className="h-6 w-6 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1">
            <SkeletonPulse className="h-2 w-16" />
            <SkeletonPulse className="h-3 w-full max-w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
