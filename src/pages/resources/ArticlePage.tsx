import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, Tag, Bookmark, BookmarkCheck, Share2, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { PublicNav } from '../../components/navigation/PublicNav';
import { articles, categories } from '../../data/resources';
import { showToast } from '../../lib/feedData';

function difficultyColor(d: string) {
  switch (d) {
    case 'Beginner': return 'text-emerald-500 bg-emerald-500/10';
    case 'Intermediate': return 'text-gold-500 bg-gold-500/10';
    case 'Advanced': return 'text-red-400 bg-red-400/10';
    default: return 'text-dark-400 bg-white/5';
  }
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = useMemo(() => articles.find(a => a.slug === slug), [slug]);
  const [bookmarked, setBookmarked] = React.useState(false);

  if (!article) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-3xl font-serif text-white italic mb-3">Article Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">This article doesn't exist or has been moved.</p>
          <Link to="/resources"><Button variant="primary">Back to Learning Center</Button></Link>
        </div>
      </div>
    );
  }

  const related = articles.filter(a => a.slug !== article.slug && a.category === article.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-dark-500 mb-6">
          <Link to="/resources" className="hover:text-gold-500 transition-colors">Learning Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-dark-400">{categories.find(c => c.id === article.category)?.label}</span>
        </div>

        {/* Back */}
        <Link to="/resources" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-6 hover:text-gold-400 transition-colors">
          <ArrowLeft className="h-3 w-3" /> All Articles
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${difficultyColor(article.difficulty)}`}>{article.difficulty}</span>
            <span className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{categories.find(c => c.id === article.category)?.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white italic leading-tight">{article.title}</h1>
          <p className="text-dark-400 text-base leading-relaxed">{article.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-dark-500">
            <span className="flex items-center gap-1.5"><img src={article.authorAvatar} alt="" className="h-5 w-5 rounded-full border border-white/10" referrerPolicy="no-referrer" />{article.author}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{article.readingTime}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />Updated {article.lastUpdated}</span>
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
        </motion.div>

        {/* Cover Image */}
        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-10 border border-white/5">
          <img src={article.cover} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose-dark max-w-none">
          {article.content.map((block, i) => {
            if (block.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-serif text-white italic mt-10 mb-4">{block.replace('## ', '')}</h2>;
            }
            return <p key={i} className="text-sm text-dark-300 leading-relaxed mb-4">{block}</p>;
          })}
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/5">
          {article.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-dark-500 uppercase tracking-widest">
              <Tag className="h-2.5 w-2.5" /> {tag}
            </span>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5">
            <h3 className="text-lg font-serif text-white italic mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(a => (
                <Link key={a.slug} to={`/resources/articles/${a.slug}`}>
                  <Card className="border-white/5 hover:border-gold-500/20 transition-all group p-0 overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-[10px] text-dark-500 mb-1">{a.readingTime}</p>
                      <p className="text-xs font-bold text-white group-hover:text-gold-500 transition-colors line-clamp-2">{a.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
