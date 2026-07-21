import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Settings2, ShieldCheck, Scale, Globe, Lock, Clock, 
  Info, Save, ChevronRight, AlertCircle, MapPin, Target, Users,
  BarChart3, CalendarDays, Timer
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { mockCategories } from '../../data';

const SECTIONS = [
  { id: 'voting-limits', label: 'Voting Limits', icon: Target },
  { id: 'eligibility', label: 'Eligibility', icon: Users },
  { id: 'scoring-model', label: 'Scoring Model', icon: Scale },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
  { id: 'geofencing', label: 'Geofencing', icon: MapPin },
];

export function CategoryCriteria() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = mockCategories.find(c => c.id === categoryId) || mockCategories[0];
  
  const [activeSection, setActiveSection] = React.useState('voting-limits');
  const [hasChanges, setHasChanges] = React.useState(false);
  const [showSaveToast, setShowSaveToast] = React.useState(false);

  // Handle intersection observer for active section highlighting
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -20% 0px' }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSave = () => {
    setHasChanges(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Prevent accidental navigation
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl py-6 -mt-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Settings2 className="h-4 w-4 text-gold-500" />
               <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Category Configuration</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">{category.name} <span className="text-dark-500 not-italic">/ Criteria</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {hasChanges && (
            <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 animate-pulse">Unsaved Changes</span>
          )}
          <Button 
            onClick={handleSave}
            className="h-12 px-8 shadow-xl shadow-gold-500/20"
          >
            <Save className="h-4 w-4 mr-2" /> Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        {/* Sticky Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-32 space-y-8">
            <div className="p-6 rounded-3xl bg-gold-500/10 border border-gold-500/20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-gold-500/20 flex items-center justify-center border border-gold-500/30">
                     <BarChart3 className="h-5 w-5 text-gold-500" />
                  </div>
                  <h3 className="text-white font-medium">Real-time Insights</h3>
               </div>
               <p className="text-[10px] text-dark-400 leading-relaxed relative z-10 uppercase tracking-wider font-medium">Estimated Category Reach</p>
               <div className="mt-2 text-2xl font-serif text-white italic relative z-10">245k+ <span className="text-dark-500 text-sm not-italic">Voters</span></div>
            </div>

            <Card className="border-white/5 bg-dark-900/40">
               <CardHeader className="pb-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-dark-500">Settings Shortcut</CardTitle>
               </CardHeader>
               <CardContent className="space-y-1 p-2">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button 
                        key={section.id} 
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                          isActive 
                            ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/10' 
                            : 'text-dark-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                         <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${isActive ? 'text-dark-950' : 'text-dark-600 group-hover:text-gold-500'}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">{section.label}</span>
                         </div>
                         <ChevronRight className={`h-4 w-4 ${isActive ? 'text-dark-950 opacity-100' : 'opacity-0 group-hover:opacity-100 text-dark-600'}`} />
                      </button>
                    );
                  })}
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-12">
           {/* Intro Card */}
           <Card className="bg-dark-900/40 border-dashed border-2 border-white/5">
              <CardContent className="p-8">
                 <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gold-500/10 flex items-center justify-center shrink-0">
                       <Timer className="h-6 w-6 text-gold-500" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-medium text-white">Global Rules Applied</h3>
                       <p className="text-sm text-dark-400 leading-relaxed">
                          This category is currently using <span className="text-gold-500">Global Voting Rules</span>. Modifying sections below will convert this to a <span className="text-white">Custom Strategy</span> for this specific category.
                       </p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Voting Limits */}
           <section id="voting-limits" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px flex-1 bg-white/5" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">01. Voting Limits</h2>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <Card>
                 <CardHeader>
                    <CardTitle>Vote Allocation</CardTitle>
                    <CardDescription>Configure how many votes each user is allocated.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Max Votes per Category</label>
                          <Input type="number" defaultValue={5} onChange={() => setHasChanges(true)} />
                          <p className="text-[10px] text-dark-500 italic">Total lifetime votes allowed for this category.</p>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Votes per Day</label>
                          <Input type="number" defaultValue={1} onChange={() => setHasChanges(true)} />
                          <p className="text-[10px] text-dark-500 italic">Daily limit for recurring voters.</p>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Premium Vote Multiplier</label>
                          <div className="flex items-center gap-4">
                             <Input type="number" defaultValue={2} className="flex-1" onChange={() => setHasChanges(true)} />
                             <span className="text-xs font-bold text-gold-500 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full">x Boost</span>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Vote Cooldown (Minutes)</label>
                          <Input type="number" defaultValue={60} onChange={() => setHasChanges(true)} />
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </section>

           {/* Eligibility */}
           <section id="eligibility" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px flex-1 bg-white/5" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">02. Eligibility</h2>
                 <div className="h-px flex-1 bg-white/5" />
              </div>

              <Card>
                 <CardHeader>
                    <CardTitle>Voter Requirements</CardTitle>
                    <CardDescription>Define who is allowed to cast a vote in this category.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="space-y-4">
                       {[
                         { label: 'Verified Account Only', sub: 'Users must have a verified email or phone.', active: true },
                         { label: 'Minimum Account Age', sub: 'Account must be at least 30 days old.', active: false },
                         { label: 'VPN Detection', sub: 'Block votes from known VPN/Proxy addresses.', active: true },
                         { label: 'Region Lock', sub: 'Restrict voting to specific geographical regions.', active: false },
                       ].map((rule) => (
                          <div key={rule.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors cursor-pointer group" onClick={() => setHasChanges(true)}>
                             <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${rule.active ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-dark-800 border-white/5'}`}>
                                   <ShieldCheck className={`h-4 w-4 ${rule.active ? 'text-emerald-500' : 'text-dark-500'}`} />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-white uppercase tracking-widest">{rule.label}</p>
                                   <p className="text-[10px] text-dark-500">{rule.sub}</p>
                                </div>
                             </div>
                             <div className={`w-10 h-5 rounded-full relative transition-colors ${rule.active ? 'bg-gold-500' : 'bg-dark-800'}`}>
                                <div className={`absolute top-1 h-3 w-3 bg-dark-950 rounded-full transition-all ${rule.active ? 'right-1' : 'left-1'}`} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </section>

           {/* Scoring Model */}
           <section id="scoring-model" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px flex-1 bg-white/5" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">03. Scoring Model</h2>
                 <div className="h-px flex-1 bg-white/5" />
              </div>

              <Card>
                 <CardHeader>
                    <CardTitle>Calculation Logic</CardTitle>
                    <CardDescription>Configure how different vote types impact the final score.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-10">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between mb-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Public Weight (Fans)</label>
                          <span className="text-sm font-serif text-gold-500 italic">60%</span>
                       </div>
                       <div className="h-2 w-full bg-dark-950 rounded-full relative">
                          <div className="absolute inset-y-0 left-0 w-[60%] bg-gold-500 rounded-full shadow-[0_0_20px_rgba(198,138,53,0.3)]" />
                          <div className="absolute left-[60%] top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 bg-white rounded-full border-4 border-gold-500 cursor-pointer" />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between mb-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Jury Weight (Experts)</label>
                          <span className="text-sm font-serif text-emerald-500 italic">40%</span>
                       </div>
                       <div className="h-2 w-full bg-dark-950 rounded-full relative">
                          <div className="absolute inset-y-0 left-0 w-[40%] bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                          <div className="absolute left-[40%] top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 bg-white rounded-full border-4 border-emerald-500 cursor-pointer" />
                       </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-dark-400">Winner Formula Preview</h4>
                       <div className="text-xl font-serif text-white italic tracking-wide">
                          Score = <span className="text-gold-500">(P × 0.6)</span> + <span className="text-emerald-500">(J × 0.4)</span>
                       </div>
                       <p className="text-[10px] text-dark-500 leading-relaxed uppercase tracking-widest">Where P is Public total and J is Jury weighted average.</p>
                    </div>
                 </CardContent>
              </Card>
           </section>

           {/* Timeline */}
           <section id="timeline" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px flex-1 bg-white/5" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">04. Timeline</h2>
                 <div className="h-px flex-1 bg-white/5" />
              </div>

              <Card>
                 <CardHeader>
                    <CardTitle>Schedule & Phases</CardTitle>
                    <CardDescription>Override global timeline for this specific category.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Nomination Opens</label>
                          <Input type="datetime-local" onChange={() => setHasChanges(true)} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Opens</label>
                          <Input type="datetime-local" onChange={() => setHasChanges(true)} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Closes</label>
                          <Input type="datetime-local" onChange={() => setHasChanges(true)} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Result Announcement</label>
                          <Input type="datetime-local" onChange={() => setHasChanges(true)} />
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </section>

           {/* Geofencing */}
           <section id="geofencing" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px flex-1 bg-white/5" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">05. Geofencing</h2>
                 <div className="h-px flex-1 bg-white/5" />
              </div>

              <Card>
                 <CardHeader>
                    <CardTitle>Geographical Controls</CardTitle>
                    <CardDescription>Restrict voting activity based on user location.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-dark-950 border border-white/5">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                             <Globe className="h-6 w-6 text-rose-500" />
                          </div>
                          <div>
                             <h4 className="text-white font-medium">Enable Global Restriction</h4>
                             <p className="text-xs text-dark-500">Block all traffic outside of allowed regions.</p>
                          </div>
                       </div>
                       <div className="w-12 h-6 bg-dark-800 rounded-full relative cursor-pointer" onClick={() => setHasChanges(true)}>
                          <div className="absolute left-1 top-1 h-4 w-4 bg-dark-600 rounded-full" />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Allowed Countries</label>
                          <div className="flex flex-wrap gap-2">
                             {['Nigeria', 'Ghana', 'Kenya', 'South Africa'].map((c) => (
                                <div key={c} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                   {c} <ChevronRight className="h-3 w-3 text-dark-500 rotate-90" />
                                </div>
                             ))}
                             <Button variant="ghost" size="sm" className="h-8 rounded-full border border-dashed border-white/20 text-[10px] uppercase font-bold tracking-widest">+ Add Country</Button>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </section>

           {/* Warning Area */}
           <div className="p-8 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 flex items-center gap-8">
              <div className="h-16 w-16 rounded-3xl bg-rose-500/20 flex items-center justify-center shrink-0">
                 <AlertCircle className="h-8 w-8 text-rose-500" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-lg font-medium text-white italic font-serif">A note on Category Integrity</h4>
                 <p className="text-sm text-dark-400 leading-relaxed">Modifying voting criteria after the event has launched will invalidate current results and may require a partial or total reset of votes. Please verify all settings before going live.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-emerald-500 text-dark-950 rounded-2xl shadow-2xl z-[100] flex items-center gap-3"
          >
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Configuration Saved Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

