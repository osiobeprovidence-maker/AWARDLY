import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Clock, ChevronRight, Play, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { PublicNav } from '../../components/navigation/PublicNav';
import { videos, categories } from '../../data/resources';
import { showToast } from '../../lib/feedData';

function difficultyColor(d: string) {
  switch (d) {
    case 'Beginner': return 'text-emerald-500 bg-emerald-500/10';
    case 'Intermediate': return 'text-gold-500 bg-gold-500/10';
    case 'Advanced': return 'text-red-400 bg-red-400/10';
    default: return 'text-dark-400 bg-white/5';
  }
}

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function VideoPage() {
  const { slug } = useParams<{ slug: string }>();
  const video = useMemo(() => videos.find(v => v.slug === slug), [slug]);
  const [bookmarked, setBookmarked] = useState(false);

  if (!video) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-3xl font-serif text-white italic mb-3">Video Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">This tutorial doesn't exist or has been removed.</p>
          <Link to="/resources"><Button variant="primary">Back to Learning Center</Button></Link>
        </div>
      </div>
    );
  }

  const related = videos.filter(v => v.slug !== video.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-dark-500 mb-6">
          <Link to="/resources" className="hover:text-gold-500 transition-colors">Learning Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-dark-400">Video Tutorials</span>
        </div>

        <Link to="/resources" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-6 hover:text-gold-400 transition-colors">
          <ArrowLeft className="h-3 w-3" /> All Tutorials
        </Link>

        {/* Video Player */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-dark-900" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeVideoId}?rel=0&modestbranding=1&playsinline=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </motion.div>

        {/* Info */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${difficultyColor(video.difficulty)}`}>{video.difficulty}</span>
            <span className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{categories.find(c => c.id === video.category)?.label}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white italic">{video.title}</h1>
          <p className="text-dark-400 text-sm leading-relaxed">{video.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-dark-500">
            <span className="flex items-center gap-1.5"><img src={video.instructorAvatar} alt="" className="h-5 w-5 rounded-full border border-white/10" referrerPolicy="no-referrer" />{video.instructor}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{video.duration}</span>
            <span className="flex items-center gap-1.5"><Eye className="h-3 w-3" />{formatViews(video.views)} views</span>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button onClick={() => { setBookmarked(b => !b); showToast(bookmarked ? 'Removed from bookmarks' : 'Bookmarked!', '✓'); }} className="h-9 px-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-dark-400 hover:text-gold-500 hover:border-gold-500/20 transition-all">
              {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5 text-gold-500" /> : <Bookmark className="h-3.5 w-3.5" />}
              {bookmarked ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', '✓'); }} className="h-9 px-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-dark-400 hover:text-dark-200 transition-all">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>

        {/* Related Videos */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-white/5">
            <h3 className="text-lg font-serif text-white italic mb-4">More Tutorials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(v => (
                <Link key={v.slug} to={`/resources/videos/${v.slug}`}>
                  <Card className="border-white/5 hover:border-gold-500/20 transition-all group p-0 overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-dark-800">
                      <img src={`https://img.youtube.com/vi/${v.youtubeVideoId}/mqdefault.jpg`} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[9px] font-bold text-white">{v.duration}</div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs font-bold text-white group-hover:text-gold-500 transition-colors line-clamp-2">{v.title}</p>
                      <p className="text-[9px] text-dark-500 mt-1">{v.instructor} · {formatViews(v.views)} views</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
