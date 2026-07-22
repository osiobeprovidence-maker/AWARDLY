import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  MessageSquare, Heart, Share2, Image as ImageIcon, Video, 
  Send, MoreHorizontal, Pin, Bookmark, Flame, Zap, CheckCircle2 
} from 'lucide-react';
import { mockPosts, mockOrganizations } from '../../data';
import { motion } from 'motion/react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

export function DashboardFeed() {
  const org = mockOrganizations[0];
  const { toast } = useToast();

  return (
    <div className="max-w-xl mx-auto space-y-10 pb-32">
      <div>
        <Breadcrumbs />
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight italic">Hub Feed</h1>
          <p className="text-dark-500 text-xs font-bold uppercase tracking-widest mt-1">Community Insights & Highlights</p>
        </div>
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="h-8 w-8 rounded-full border-2 border-dark-950 bg-dark-800" />
           ))}
           <div className="h-8 w-8 rounded-full border-2 border-dark-950 bg-gold-500 flex items-center justify-center text-[10px] font-black text-dark-950">+12</div>
         </div>
        </div>
      </div>

      {/* Premium Create Post */}
      <Card className="bg-dark-900 border-white/5 overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
              <img 
                src={org.logoUrl} 
                className="h-full w-full object-cover" 
                alt="org logo" 
                referrerPolicy="no-referrer"
              />
            </div>
            <textarea 
              className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-dark-600 resize-none py-2 text-md leading-relaxed outline-none"
              placeholder="Announce something spectacular..."
              rows={2}
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-10 px-4 text-dark-400 hover:text-gold-400 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5">
                <ImageIcon className="h-4 w-4 mr-2" /> 
                <span className="text-[10px] font-bold uppercase tracking-widest">Media</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 px-4 text-dark-400 hover:text-gold-400 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5">
                <Video className="h-4 w-4 mr-2" /> 
                <span className="text-[10px] font-bold uppercase tracking-widest">Broadcast</span>
              </Button>
            </div>
            <Button size="sm" className="px-8 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gold-500/10" onClick={() => toast('Post broadcast to your community!', 'success')}>Broadcast Post</Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-12">
        {mockPosts.map((post, idx) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="group relative">
              <Card className="bg-transparent border-0 p-0 overflow-visible relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                       <img 
                        src={org.logoUrl} 
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-gold-500/20" 
                        alt="org" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-dark-950 rounded-full flex items-center justify-center">
                         <CheckCircle2 className="h-3 w-3 text-gold-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-base leading-none mb-1 uppercase italic tracking-tight">{org.name}</h4>
                      <p className="text-dark-500 text-[10px] font-bold uppercase tracking-widest">
                        {idx === 0 ? 'Just Now' : idx === 1 ? '2 Hours Ago' : 'Yesterday'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     {post.isPinned && (
                       <div className="flex items-center h-6 px-3 bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
                          <Pin className="h-2 w-2 mr-1.5" /> Pinned Highlight
                       </div>
                     )}
                     <button className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-dark-500 transition-colors">
                       <MoreHorizontal className="h-5 w-5" />
                     </button>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-white/90 text-md leading-relaxed font-light">{post.content}</p>

                   {post.mediaUrls && post.mediaUrls.length > 0 && (
                     <div className="rounded-[32px] overflow-hidden border border-white/10 aspect-[4/5] relative group/media shadow-2xl bg-dark-900">
                        <img 
                          src={post.mediaUrls[0]} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover/media:scale-110" 
                          alt="media" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
                        
                        {/* Overlay Engagement Stats like TikTok */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-6 items-center">
                           <button className="flex flex-col items-center gap-1 group/btn">
                              <div className="h-12 w-12 rounded-full bg-dark-950/50 backdrop-blur-xl flex items-center justify-center text-white group-hover/btn:bg-red-500 transition-all">
                                 <Heart className="h-6 w-6" />
                              </div>
                              <span className="text-[10px] font-bold text-white shadow-sm">{post.likesCount.toLocaleString()}</span>
                           </button>
                           <button className="flex flex-col items-center gap-1 group/btn">
                              <div className="h-12 w-12 rounded-full bg-dark-950/50 backdrop-blur-xl flex items-center justify-center text-white group-hover/btn:bg-gold-500 transition-all">
                                 <MessageSquare className="h-6 w-6" />
                              </div>
                              <span className="text-[10px] font-bold text-white shadow-sm">{post.commentsCount.toLocaleString()}</span>
                           </button>
                           <button className="flex flex-col items-center gap-1 group/btn">
                              <div className="h-12 w-12 rounded-full bg-dark-950/50 backdrop-blur-xl flex items-center justify-center text-white group-hover/btn:bg-sky-500 transition-all">
                                 <Share2 className="h-6 w-6" />
                              </div>
                              <span className="text-[10px] font-bold text-white shadow-sm">Share</span>
                           </button>
                        </div>
                     </div>
                   )}
                </div>

                {!post.mediaUrls?.length && (
                   <div className="flex items-center pt-6 mt-4 border-t border-white/5 gap-10">
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-500 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" /> {post.likesCount} Likes
                      </button>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-500 hover:text-white transition-colors">
                        <MessageSquare className="h-4 w-4" /> {post.commentsCount} Comments
                      </button>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-500 hover:text-white transition-colors ml-auto">
                        <Share2 className="h-4 w-4" /> Share
                      </button>
                   </div>
                )}
              </Card>
              
              {/* Status decoration for feed items */}
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
              {idx === 0 && (
                <div className="absolute -left-[5px] top-4 h-2 w-2 rounded-full bg-gold-500 shadow-[0_0_10px_#c68a35] hidden md:block" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="py-12 text-center">
         <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-dark-400 group cursor-pointer hover:bg-gold-500/10 hover:text-gold-500 transition-all" onClick={() => toast('Loading older posts...', 'info')}>
            <Flame className="h-4 w-4 group-hover:animate-bounce" />
            Catch up on older updates
         </div>
      </div>
    </div>
  );
}
