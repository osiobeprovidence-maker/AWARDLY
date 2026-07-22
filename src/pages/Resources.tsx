import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PublicNav } from '../components/navigation/PublicNav';
import {
  Search, BookOpen, Play, Clock, Eye, Download, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, ArrowRight, FileText, Star, Users, Zap,
  Shield, BarChart3, Code, Mail, CheckCircle2, Bookmark, BookmarkCheck,
  PlayCircle, ExternalLink, Tag, TrendingUp, Award, Briefcase,
  BadgeCheck, Wallet, ShieldCheck, Puzzle, ClipboardList, Trophy,
  Handshake, Megaphone, Lock, Lightbulb, MessageSquare
} from 'lucide-react';
import {
  categories, articles, videos, caseStudies, templates, bestPractices, faqs,
  searchResources, type ResourceCategory
} from '../data/resources';

// ─── Icon Map ──────────────────────────────────────────────────────────────
const categoryIcons: Record<ResourceCategory, React.ElementType> = {
  documentation: BookOpen,
  tutorials: PlayCircle,
  'case-studies': Briefcase,
  templates: FileText,
  'best-practices': BadgeCheck,
  monetization: Wallet,
  community: Users,
  security: ShieldCheck,
  analytics: BarChart3,
  api: Puzzle,
};

const templateIcons: Record<string, React.ElementType> = {
  'event-planning-checklist': ClipboardList,
  'award-timeline-template': Clock,
  'sponsor-proposal-template': Briefcase,
  'judge-evaluation-form': FileText,
  'marketing-toolkit': Megaphone,
  'social-media-kit': Tag,
};

const bestPracticeIcons: Record<string, React.ElementType> = {
  'increasing-nominations': FileText,
  'boosting-voter-engagement': TrendingUp,
  'managing-judges-effectively': BadgeCheck,
  'preventing-vote-fraud': ShieldCheck,
  'attracting-sponsors': Handshake,
  'marketing-your-awards': Megaphone,
};

// ─── Helpers ───────────────────────────────────────────────────────────────
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

// ─── FAQ Item ──────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left group">
        <span className="text-sm text-white font-medium pr-4 group-hover:text-gold-500 transition-colors">{question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-dark-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-dark-500 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="text-sm text-dark-400 leading-relaxed pb-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Search Results ────────────────────────────────────────────────────────
function SearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  const results = useMemo(() => searchResources(query), [query]);
  const total = results.articles.length + results.videos.length + results.caseStudies.length + results.templates.length + results.bestPractices.length + results.faqs.length;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-400">{total} result{total !== 1 ? 's' : ''} for "<span className="text-white font-medium">{query}</span>"</p>
        <button onClick={onClear} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest hover:text-gold-400">Clear Search</button>
      </div>
      {results.articles.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3">Articles</h3>
          <div className="space-y-2">{results.articles.map(a => (
            <Link key={a.slug} to={`/resources/articles/${a.slug}`} className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition-all group">
              <p className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{a.title}</p>
              <p className="text-[11px] text-dark-500 mt-1 line-clamp-1">{a.description}</p>
            </Link>
          ))}</div>
        </div>
      )}
      {results.videos.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3">Videos</h3>
          <div className="space-y-2">{results.videos.map(v => (
            <Link key={v.slug} to={`/resources/videos/${v.slug}`} className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition-all group">
              <p className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{v.title}</p>
              <p className="text-[11px] text-dark-500 mt-1">{v.duration} · {v.instructor}</p>
            </Link>
          ))}</div>
        </div>
      )}
      {results.templates.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3">Templates</h3>
          <div className="space-y-2">{results.templates.map(t => (
            <Link key={t.slug} to={`/resources/templates/${t.slug}`} className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition-all group">
              <p className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{t.icon} {t.title}</p>
              <p className="text-[11px] text-dark-500 mt-1">{t.fileType} · {t.fileSize}</p>
            </Link>
          ))}</div>
        </div>
      )}
      {results.faqs.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3">FAQs</h3>
          <div className="space-y-2">{results.faqs.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-sm font-medium text-white">{f.question}</p>
              <p className="text-[11px] text-dark-500 mt-1 line-clamp-2">{f.answer}</p>
            </div>
          ))}</div>
        </div>
      )}
      {total === 0 && (
        <div className="text-center py-12">
          <Search className="h-10 w-10 text-dark-700 mx-auto mb-3" />
          <p className="text-dark-500 text-sm">No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function Resources() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleBookmark = (slug: string) => {
    setBookmarked(p => { const n = new Set(p); n.has(slug) ? n.delete(slug) : n.add(slug); return n; });
  };

  const filteredArticles = activeCategory ? articles.filter(a => a.category === activeCategory) : articles;
  const filteredFaqs = faqSearch ? faqs.filter(f => f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.answer.toLowerCase().includes(faqSearch.toLowerCase())) : faqs;

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gold-500/20 bg-gold-500/5 text-gold-500">
              <BookOpen className="h-3 w-3" /> Learning Center
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white italic leading-[1.1]">
              Master <span className="text-gold-500">Awardly</span>
            </h1>
            <p className="text-dark-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Expert guides, video tutorials, case studies, templates, and best practices for running world-class award programs.
            </p>
            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles, tutorials, templates..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30 transition-colors"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="#categories"><Button variant="primary" className="h-10 px-5 text-[10px] font-bold uppercase tracking-widest"><BookOpen className="h-3.5 w-3.5 mr-1.5" /> Browse Docs</Button></Link>
              <Link to="#videos"><Button variant="glass" className="h-10 px-5 text-[10px] font-bold uppercase tracking-widest"><Play className="h-3.5 w-3.5 mr-1.5" /> Watch Tutorials</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        {/* Search Results */}
        {search ? (
          <section className="py-8"><SearchResults query={search} onClear={() => setSearch('')} /></section>
        ) : (
          <>
            {/* Categories */}
            <section id="categories" className="py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-white italic">Browse by Topic</h2>
                {activeCategory && (
                  <button onClick={() => setActiveCategory(null)} className="text-[10px] font-bold text-gold-500 uppercase tracking-widest hover:text-gold-400">View All</button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${activeCategory === cat.id ? 'bg-gold-500/10 border-gold-500/20' : 'bg-white/[0.02] border-white/5 hover:border-gold-500/20'}`}
                  >
                    {(() => { const Icon = categoryIcons[cat.id]; return Icon ? <Icon className="h-5 w-5 text-gold-500 mb-3" /> : null; })()}
                    <p className="text-xs font-bold text-white mb-0.5">{cat.label}</p>
                    <p className="text-[9px] text-dark-500">{cat.count} resources</p>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Featured Articles */}
            <section className="py-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-white italic">Featured Articles</h2>
                <Link to="#" className="text-[10px] font-bold text-gold-500 uppercase tracking-widest hover:text-gold-400">View All →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.slice(0, activeCategory ? 6 : 6).map((article, i) => (
                  <motion.div key={article.slug} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link to={`/resources/articles/${article.slug}`}>
                      <Card className="h-full border-white/5 hover:border-gold-500/20 transition-all group p-0 overflow-hidden">
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <img src={article.cover} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${difficultyColor(article.difficulty)}`}>{article.difficulty}</span>
                          </div>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(article.slug); }} className="absolute top-3 right-3 h-7 w-7 rounded-full bg-dark-950/60 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-gold-500/30 transition-colors">
                            {bookmarked.has(article.slug) ? <BookmarkCheck className="h-3.5 w-3.5 text-gold-500" /> : <Bookmark className="h-3.5 w-3.5 text-dark-400" />}
                          </button>
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-[9px] text-dark-500">
                            <span className="uppercase tracking-widest font-bold">{categories.find(c => c.id === article.category)?.label}</span>
                            <span>·</span>
                            <span>{article.readingTime}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors line-clamp-2">{article.title}</h3>
                          <p className="text-[11px] text-dark-400 line-clamp-2 leading-relaxed">{article.description}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <img src={article.authorAvatar} alt="" className="h-5 w-5 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                            <span className="text-[9px] text-dark-500">{article.author} · Updated {article.lastUpdated}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Video Tutorials */}
            <section id="videos" className="py-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-white italic">Video Tutorials</h2>
                <div className="flex gap-1.5">
                  <button onClick={() => scrollCarousel('left')} className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronLeft className="h-4 w-4 text-dark-400" /></button>
                  <button onClick={() => scrollCarousel('right')} className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight className="h-4 w-4 text-dark-400" /></button>
                </div>
              </div>
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {videos.map((video, i) => (
                  <Link key={video.slug} to={`/resources/videos/${video.slug}`} className="shrink-0 w-72 sm:w-80">
                    <Card className="h-full border-white/5 hover:border-gold-500/20 transition-all group p-0 overflow-hidden">
                      <div className="aspect-video relative overflow-hidden bg-dark-800">
                        <img src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-gold-500/20 backdrop-blur-sm flex items-center justify-center border border-gold-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-5 w-5 text-gold-500 ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[9px] font-bold text-white">{video.duration}</div>
                        <div className="absolute top-2 left-2"><span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${difficultyColor(video.difficulty)}`}>{video.difficulty}</span></div>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors line-clamp-2">{video.title}</h3>
                        <p className="text-[11px] text-dark-400 line-clamp-2">{video.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <img src={video.instructorAvatar} alt="" className="h-5 w-5 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                            <span className="text-[9px] text-dark-500">{video.instructor}</span>
                          </div>
                          <span className="text-[9px] text-dark-600 flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{formatViews(video.views)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Case Studies */}
            <section className="py-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-white italic">Case Studies</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudies.map((cs, i) => (
                  <motion.div key={cs.slug} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Link to={`/resources/case-studies/${cs.slug}`}>
                      <Card className="h-full border-white/5 hover:border-gold-500/20 transition-all group p-0 overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 aspect-video sm:aspect-auto bg-dark-800">
                            <img src={cs.cover} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                          <CardContent className="p-5 sm:p-6 flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-gold-500" />
                              <span className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{cs.organization}</span>
                            </div>
                            <h3 className="text-base font-bold text-white group-hover:text-gold-500 transition-colors">{cs.title}</h3>
                            <p className="text-[11px] text-dark-400 line-clamp-2 leading-relaxed">{cs.challenge}</p>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {cs.stats.slice(0, 4).map((s, j) => (
                                <div key={j}>
                                  <p className="text-sm font-serif text-gold-500 italic">{s.value}</p>
                                  <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest">{s.label}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Templates & Best Practices */}
            <section className="py-12 border-t border-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Templates */}
                <div>
                  <h2 className="text-2xl font-serif text-white italic mb-6">Download Center</h2>
                  <div className="space-y-3">
                    {templates.map((t, i) => (
                      <motion.div key={t.slug} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                        <Link to={`/resources/templates/${t.slug}`}>
                          <Card className="border-white/5 hover:border-gold-500/20 transition-all group">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-gold-500/5 border border-gold-500/10 flex items-center justify-center shrink-0">
                                {(() => { const Icon = templateIcons[t.slug] || FileText; return <Icon className="h-5 w-5 text-gold-500" />; })()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors truncate">{t.title}</p>
                                <p className="text-[10px] text-dark-500 mt-0.5 line-clamp-1">{t.description}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-[9px] text-dark-600">
                                  <span>{t.fileType}</span>
                                  <span>{t.fileSize}</span>
                                  <span>{t.downloads.toLocaleString()} downloads</span>
                                </div>
                              </div>
                              <Download className="h-4 w-4 text-dark-600 group-hover:text-gold-500 transition-colors shrink-0" />
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Best Practices */}
                <div>
                  <h2 className="text-2xl font-serif text-white italic mb-6">Best Practices</h2>
                  <div className="space-y-3">
                    {bestPractices.map((bp, i) => (
                      <motion.div key={bp.slug} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                        <Card className="border-white/5 hover:border-gold-500/20 transition-all group">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                              {(() => { const Icon = bestPracticeIcons[bp.slug] || BadgeCheck; return <Icon className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />; })()}
                              <div>
                                <p className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors">{bp.title}</p>
                                <p className="text-[10px] text-dark-500 mt-0.5">{bp.description}</p>
                              </div>
                            </div>
                            <ul className="space-y-1.5 ml-8">
                              {bp.tips.slice(0, 3).map((tip, j) => (
                                <li key={j} className="flex items-start gap-2 text-[10px] text-dark-400 leading-relaxed">
                                  <CheckCircle2 className="h-3 w-3 text-gold-500 shrink-0 mt-0.5" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="py-12 border-t border-white/5">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif text-white italic mb-3">Frequently Asked Questions</h2>
                  <p className="text-dark-500 text-sm">Quick answers to common questions about Awardly.</p>
                </div>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-600" />
                  <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)} placeholder="Search FAQs..." className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30 transition-colors" />
                </div>
                <Card className="border-white/5">
                  <CardContent className="p-5 sm:p-6">
                    {filteredFaqs.length === 0 && <p className="text-center text-dark-500 text-sm py-4">No matching questions found.</p>}
                    {filteredFaqs.map((f, i) => <FAQItem key={i} question={f.question} answer={f.answer} />)}
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Community Highlights */}
            <section className="py-12 border-t border-white/5">
              <h2 className="text-2xl sm:text-3xl font-serif text-white italic mb-8">Community Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: TrendingUp, label: 'Trending Now', value: 'Voting Best Practices', sub: '2.4K views this week' },
                  { icon: Download, label: 'Most Downloaded', value: 'Social Media Kit', sub: '7,890 downloads' },
                  { icon: Play, label: 'Popular Tutorial', value: 'Advanced Voting Config', sub: '8.9K views' },
                  { icon: Award, label: 'New Case Study', value: 'Headies Success Story', sub: 'Published 3 days ago' },
                ].map((item, i) => (
                  <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group">
                    <CardContent className="p-5">
                      <item.icon className="h-5 w-5 text-gold-500 mb-3" />
                      <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors">{item.value}</p>
                      <p className="text-[10px] text-dark-500 mt-1">{item.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section className="py-12 border-t border-white/5">
              <Card className="border-white/10 bg-gradient-to-br from-gold-500/5 to-transparent">
                <CardContent className="p-8 sm:p-12 text-center">
                  <Mail className="h-10 w-10 text-gold-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-serif text-white italic mb-2">Stay in the Loop</h2>
                  <p className="text-dark-400 text-sm mb-6 max-w-md mx-auto">Get weekly tips, new tutorials, and platform updates delivered to your inbox.</p>
                  {subscribed ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5" /> You're subscribed! Check your inbox.
                    </div>
                  ) : (
                    <div className="flex gap-2 max-w-sm mx-auto">
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 h-11 bg-white/5 border border-white/10 rounded-full px-5 text-sm text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30 transition-colors" />
                      <Button variant="primary" className="h-11 px-6 text-[10px] font-bold uppercase tracking-widest" onClick={() => { if (email.trim()) { setSubscribed(true); setEmail(''); } }}>Subscribe</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Footer CTA */}
            <section className="py-16 border-t border-white/5 text-center">
              <h2 className="text-3xl sm:text-4xl font-serif text-white italic mb-4">Ready to launch your own award program?</h2>
              <p className="text-dark-400 text-sm mb-8 max-w-md mx-auto">Join thousands of organizers who use Awardly to run world-class award ceremonies.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/onboarding"><Button variant="primary" className="h-12 px-8 text-[11px] font-bold uppercase tracking-widest"><Zap className="h-4 w-4 mr-2" /> Create Hub</Button></Link>
                <Link to="/pricing"><Button variant="glass" className="h-12 px-8 text-[11px] font-bold uppercase tracking-widest"><BarChart3 className="h-4 w-4 mr-2" /> Explore Pricing</Button></Link>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-xs"><p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">The world's leading platform for award management, secure voting, and community recognition.</p></div>
          <div className="flex gap-6">
            <Link to="/discover" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Explore</Link>
            <Link to="/schedule" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Schedule</Link>
            <Link to="/pricing" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
