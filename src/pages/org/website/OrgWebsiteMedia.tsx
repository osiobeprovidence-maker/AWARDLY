import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlayCircle, Users, Image, MessageSquare, Newspaper, ExternalLink,
} from 'lucide-react';

interface OrgWebsiteMediaProps {
  org: any;
  posts: any[];
  broadcasts: any[];
}

export function OrgWebsiteMedia({ org, posts, broadcasts }: OrgWebsiteMediaProps) {
  const liveBroadcast = broadcasts.find((b) => b.status === 'live');
  const endedBroadcasts = broadcasts.filter((b) => b.status === 'ended');

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Media</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Media & Broadcasts</h2>
        <p className="text-dark-400 text-sm max-w-lg mx-auto">Watch live broadcasts and explore our latest content.</p>
      </div>

      {liveBroadcast && (
        <Link to={`/org/${org.slug}`}>
          <div className="relative rounded-2xl overflow-hidden border border-red-500/20 group cursor-pointer">
            <div className="aspect-video relative">
              {liveBroadcast.thumbnailUrl ? (
                <img src={liveBroadcast.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="live" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-dark-900" />
              )}
              <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-all" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-red-600 text-[10px] font-bold text-white rounded flex items-center uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-2" /> Live Now
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-xl font-serif text-white">{liveBroadcast.title}</h4>
                <p className="text-dark-400 text-xs flex items-center gap-2 mt-1">
                  <Users className="h-3 w-3" /> {liveBroadcast.concurrentViewers.toLocaleString()} watching
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {endedBroadcasts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-white">Past Broadcasts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {endedBroadcasts.map((broadcast) => (
              <div key={broadcast._id} className="rounded-xl overflow-hidden border border-white/5 bg-dark-900/50 group">
                <div className="aspect-video relative">
                  {broadcast.thumbnailUrl ? (
                    <img src={broadcast.thumbnailUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={broadcast.title} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-dark-800" />
                  )}
                  <div className="absolute inset-0 bg-dark-950/40" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-dark-900/80 backdrop-blur text-[10px] font-bold text-white rounded uppercase tracking-widest">Ended</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-10 w-10 text-white/80" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white text-sm font-medium">{broadcast.title}</h4>
                  <p className="text-dark-500 text-[10px] uppercase tracking-widest mt-1">
                    {broadcast.duration && `${Math.floor(broadcast.duration / 60)} min`}
                    {broadcast.peakViewerCount > 0 && ` · Peak: ${broadcast.peakViewerCount.toLocaleString()} viewers`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-white">Latest Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.slice(0, 6).map((post) => (
              <div key={post._id} className="p-5 rounded-xl bg-dark-900/50 border border-white/5">
                <p className="text-white text-sm mb-3 line-clamp-4 leading-relaxed">{post.content}</p>
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {post.mediaUrls.slice(0, 3).map((url: string, i: number) => (
                      <div key={i} className="h-16 w-16 rounded-lg bg-dark-800 overflow-hidden">
                        <img src={url} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-dark-500 text-[10px] uppercase tracking-widest">
                    {(() => { try { return new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return ''; } })()}
                  </p>
                  <div className="flex items-center gap-3 text-dark-500 text-[10px]">
                    {post.likesCount > 0 && <span>{post.likesCount} likes</span>}
                    {post.commentsCount > 0 && <span>{post.commentsCount} comments</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {broadcasts.length === 0 && posts.length === 0 && (
        <div className="text-center py-16">
          <Image className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" />
          <h3 className="text-xl text-white font-serif mb-2">No Media Yet</h3>
          <p className="text-dark-500 text-sm">Broadcasts and posts will appear here.</p>
        </div>
      )}
    </div>
  );
}
