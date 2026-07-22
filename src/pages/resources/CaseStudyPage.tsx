import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Share2, Trophy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { PublicNav } from '../../components/navigation/PublicNav';
import { caseStudies } from '../../data/resources';
import { showToast } from '../../lib/feedData';

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const cs = useMemo(() => caseStudies.find(c => c.slug === slug), [slug]);

  if (!cs) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-3xl font-serif text-white italic mb-3">Case Study Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">This case study doesn't exist or has been removed.</p>
          <Link to="/resources"><Button variant="primary">Back to Learning Center</Button></Link>
        </div>
      </div>
    );
  }

  const related = caseStudies.filter(c => c.slug !== cs.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="flex items-center gap-2 text-[10px] text-dark-500 mb-6">
          <Link to="/resources" className="hover:text-gold-500 transition-colors">Learning Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-dark-400">Case Studies</span>
        </div>
        <Link to="/resources" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-6 hover:text-gold-400 transition-colors">
          <ArrowLeft className="h-3 w-3" /> All Case Studies
        </Link>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
              <Trophy className="h-6 w-6 text-gold-500" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{cs.organization}</p>
              <h1 className="text-2xl sm:text-3xl font-serif text-white italic">{cs.title}</h1>
            </div>
          </div>

          <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-white/5">
            <img src={cs.cover} alt={cs.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cs.stats.map((s, i) => (
              <Card key={i} className="border-white/5 text-center">
                <CardContent className="p-4">
                  <p className="text-xl font-serif text-gold-500 italic">{s.value}</p>
                  <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sections */}
          {[
            { title: 'The Challenge', text: cs.challenge, color: 'border-red-500/20 bg-red-500/5' },
            { title: 'The Solution', text: cs.solution, color: 'border-gold-500/20 bg-gold-500/5' },
            { title: 'The Results', text: cs.results, color: 'border-emerald-500/20 bg-emerald-500/5' },
          ].map((section, i) => (
            <div key={i} className={`rounded-xl border p-6 ${section.color}`}>
              <h2 className="text-lg font-serif text-white italic mb-3">{section.title}</h2>
              <p className="text-sm text-dark-300 leading-relaxed">{section.text}</p>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-4">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', '✓'); }} className="h-9 px-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-dark-400 hover:text-dark-200 transition-all">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5">
            <h3 className="text-lg font-serif text-white italic mb-4">More Case Studies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(c => (
                <Link key={c.slug} to={`/resources/case-studies/${c.slug}`}>
                  <Card className="border-white/5 hover:border-gold-500/20 transition-all group p-0 overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3 bg-dark-800">
                        <img src={c.cover} alt={c.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <CardContent className="p-4 flex-1">
                        <p className="text-[9px] text-dark-500 mb-1">{c.organization}</p>
                        <p className="text-xs font-bold text-white group-hover:text-gold-500 transition-colors">{c.title}</p>
                      </CardContent>
                    </div>
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
