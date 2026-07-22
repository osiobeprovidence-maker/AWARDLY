import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Download, FileText, Share2, ClipboardList, Clock, Briefcase, Megaphone, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { PublicNav } from '../../components/navigation/PublicNav';
import { templates } from '../../data/resources';
import { showToast } from '../../lib/feedData';

export function TemplatePage() {
  const { slug } = useParams<{ slug: string }>();
  const template = useMemo(() => templates.find(t => t.slug === slug), [slug]);

  if (!template) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-3xl font-serif text-white italic mb-3">Template Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">This template doesn't exist or has been removed.</p>
          <Link to="/resources"><Button variant="primary">Back to Learning Center</Button></Link>
        </div>
      </div>
    );
  }

  const related = templates.filter(t => t.slug !== template.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="flex items-center gap-2 text-[10px] text-dark-500 mb-6">
          <Link to="/resources" className="hover:text-gold-500 transition-colors">Learning Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-dark-400">Templates</span>
        </div>
        <Link to="/resources" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-6 hover:text-gold-400 transition-colors">
          <ArrowLeft className="h-3 w-3" /> All Templates
        </Link>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          {/* Template Card */}
          <Card className="border-white/10 mb-8">
            <CardContent className="p-8 sm:p-10 text-center">
              <div className="h-20 w-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6">
                {(() => { const icons: Record<string, React.ElementType> = { 'event-planning-checklist': ClipboardList, 'award-timeline-template': Clock, 'sponsor-proposal-template': Briefcase, 'judge-evaluation-form': FileText, 'marketing-toolkit': Megaphone, 'social-media-kit': Tag }; const Icon = icons[template.slug] || FileText; return <Icon className="h-8 w-8 text-gold-500" />; })()}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-white italic mb-3">{template.title}</h1>
              <p className="text-dark-400 text-sm leading-relaxed max-w-lg mx-auto mb-6">{template.description}</p>
              <div className="flex items-center justify-center gap-4 text-[10px] text-dark-500 mb-8">
                <span className="flex items-center gap-1.5"><FileText className="h-3 w-3" />{template.fileType}</span>
                <span>{template.fileSize}</span>
                <span>{template.downloads.toLocaleString()} downloads</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="primary" className="h-11 px-8 text-[10px] font-bold uppercase tracking-widest" onClick={() => showToast('Download started!', '✓')}>
                  <Download className="h-4 w-4 mr-2" /> Download Template
                </Button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', '✓'); }} className="h-11 px-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-bold text-dark-400 hover:text-dark-200 transition-all">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Placeholder */}
          <Card className="border-white/5 mb-8">
            <CardContent className="p-12 text-center">
              <div className="h-48 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center">
                <FileText className="h-10 w-10 text-dark-700 mb-3" />
                <p className="text-sm text-dark-500">Template preview will appear here</p>
                <p className="text-[10px] text-dark-600 mt-1">Click download to get the full template</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-white/5">
            <h3 className="text-lg font-serif text-white italic mb-4">More Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(t => (
                <Link key={t.slug} to={`/resources/templates/${t.slug}`}>
                  <Card className="border-white/5 hover:border-gold-500/20 transition-all group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-gold-500 transition-colors truncate">{t.title}</p>
                        <p className="text-[9px] text-dark-500">{t.fileType} · {t.fileSize}</p>
                      </div>
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
