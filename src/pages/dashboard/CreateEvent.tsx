import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Trophy, Calendar, Image as ImageIcon, Plus, Trash2, ArrowLeft, Save,
  Globe, Edit3, Settings, Check, ChevronRight, PartyPopper,
  Vote, DollarSign, Eye, ArrowRight, Palette, Tag, BarChart3,
  CreditCard, Sparkles, ExternalLink, LayoutGrid, Home, Star,
  Clock, Users, ShieldCheck, Megaphone,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageUpload } from '../../components/ImageUpload';
import { Category, VotingRules } from '../../types';
import { mockEvents } from '../../data';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../lib/auth';

interface StepDef {
  label: string;
  icon: React.ElementType;
}

const STEPS: StepDef[] = [
  { label: 'General', icon: Calendar },
  { label: 'Branding', icon: Palette },
  { label: 'Categories', icon: Trophy },
  { label: 'Voting', icon: Vote },
  { label: 'Monetize', icon: DollarSign },
  { label: 'Review', icon: Eye },
  { label: 'Publish', icon: PartyPopper },
];

const THEME_COLORS = [
  { name: 'Gold', hex: '#c68a35' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Rose', hex: '#db2777' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Orange', hex: '#f97316' },
];

interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  bannerUrl: string;
  themeColor: string;
  tagline: string;
  categories: Category[];
  votingEnabled: boolean;
  publicVoting: boolean;
  judgeVoting: boolean;
  nominationStart: string;
  nominationEnd: string;
  votingStart: string;
  votingEnd: string;
  paidVoting: boolean;
}

const DEFAULT_DATA: EventData = {
  title: '',
  description: '',
  date: '',
  time: '',
  bannerUrl: '',
  themeColor: '#c68a35',
  tagline: '',
  categories: [
    { id: '1', eventId: 'e1', name: 'Artiste of the Year', rulesSource: 'global' },
    { id: '2', eventId: 'e1', name: 'Best Innovation', rulesSource: 'custom', customRules: { title: 'Expert Jury', description: '', eligibility: 'Judges Only', dailyLimit: 0, isPaid: false, verificationRequired: true, duplicatePolicy: '', fraudPrevention: '', startDate: '', endDate: '', terms: '' } },
    { id: '3', eventId: 'e1', name: 'Rookie of the Year', rulesSource: 'global' },
  ],
  votingEnabled: true,
  publicVoting: true,
  judgeVoting: false,
  nominationStart: '',
  nominationEnd: '',
  votingStart: '',
  votingEnd: '',
  paidVoting: false,
};

export function CreateEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const existingEvent = eventId ? mockEvents.find(e => e.id === eventId) : null;
  const { toast } = useToast();
  const { currentOrg } = useAuth();

  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<EventData>(DEFAULT_DATA);
  const [published, setPublished] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [brandingCategoryId, setBrandingCategoryId] = React.useState<string | null>(null);

  const update = React.useCallback((patch: Partial<EventData>) => {
    setData(prev => ({ ...prev, ...patch }));
  }, []);

  const validate = React.useCallback((s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.title.trim()) e.title = 'Title is required';
      if (!data.description.trim()) e.description = 'Description is required';
      if (!data.date) e.date = 'Date is required';
    }
    if (s === 3 && data.votingEnabled) {
      if (!data.votingStart) e.votingStart = 'Required';
      if (!data.votingEnd) e.votingEnd = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [data]);

  const next = () => { if (validate(step) && step < 6) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };
  const goTo = (s: number) => { setStep(s); };

  const addCategory = () => {
    const name = prompt('Enter category name:');
    if (name && name.trim()) {
      const newCat: Category = {
        id: Date.now().toString(),
        eventId: eventId || 'new',
        name: name.trim(),
        rulesSource: 'global',
      };
      update({ categories: [...data.categories, newCat] });
      toast('Category added', 'success');
    }
  };

  const removeCategory = (id: string) => {
    if (confirm('Remove this category?')) {
      update({ categories: data.categories.filter(c => c.id !== id) });
      toast('Category removed', 'info');
    }
  };

  const saveDraft = () => {
    toast('Draft saved successfully', 'success');
  };

  const publish = () => {
    toast('Event published!', 'success');
    setPublished(true);
    setStep(6);
  };

  const stepValid = (s: number) => {
    if (s === 0) return !!data.title.trim() && !!data.description.trim() && !!data.date;
    if (s === 1) return true;
    if (s === 2) return data.categories.length > 0;
    if (s === 3) return !data.votingEnabled || (!!data.votingStart && !!data.votingEnd);
    if (s === 4) return true;
    if (s === 5) return true;
    return true;
  };

  const renderStepIndicator = () => (
    <div className="relative mb-12">
      <div className="flex items-center justify-between relative">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isComplete = i < step;
          const isLast = i === STEPS.length - 1;
          return (
            <React.Fragment key={i}>
              <button
                onClick={() => i <= step && goTo(i)}
                className={`flex flex-col items-center gap-2 z-10 transition-all ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isComplete ? '#c68a35' : isActive ? '#c68a35' : 'rgb(30,30,30)',
                    borderColor: isComplete || isActive ? '#c68a35' : 'rgba(255,255,255,0.1)',
                  }}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-colors shadow-lg`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5 text-dark-950" />
                  ) : (
                    <Icon className={`h-5 w-5 ${isActive ? 'text-dark-950' : 'text-dark-500'}`} />
                  )}
                </motion.div>
                <span className={`text-[10px] uppercase tracking-[0.15em] font-bold transition-colors hidden sm:block ${isActive ? 'text-gold-500' : isComplete ? 'text-gold-500/60' : 'text-dark-600'}`}>
                  {s.label}
                </span>
              </button>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 relative -mt-6 sm:-mt-8">
                  <div className="absolute inset-0 bg-dark-800 rounded-full" />
                  <motion.div
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    className="absolute inset-0 bg-gold-500 rounded-full origin-left"
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  const renderStep = () => {
    if (published && step === 6) return renderPublishSuccess();
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {step === 0 && renderGeneral()}
          {step === 1 && renderBranding()}
          {step === 2 && renderCategories()}
          {step === 3 && renderVoting()}
          {step === 4 && renderMonetization()}
          {step === 5 && renderReview()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderGeneral = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-gold-500" />
          </div>
          General Information
        </CardTitle>
        <CardDescription>Set the basics for your award ceremony.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Event Title *</label>
          <Input
            placeholder="e.g. The 18th Annual Excellence Awards"
            value={data.title}
            onChange={e => update({ title: e.target.value })}
            className={errors.title ? 'border-rose-500' : ''}
          />
          {errors.title && <p className="text-xs text-rose-400">{errors.title}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Description *</label>
          <textarea
            className={`w-full min-h-[140px] bg-dark-900 border rounded-lg p-4 text-white text-sm outline-none focus:ring-1 focus:ring-gold-500 resize-none ${errors.description ? 'border-rose-500' : 'border-white/10'}`}
            placeholder="Describe the purpose and scale of this event..."
            value={data.description}
            onChange={e => update({ description: e.target.value })}
          />
          {errors.description && <p className="text-xs text-rose-400">{errors.description}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Event Date *</label>
            <Input
              type="date"
              value={data.date}
              onChange={e => update({ date: e.target.value })}
              className={errors.date ? 'border-rose-500' : ''}
            />
            {errors.date && <p className="text-xs text-rose-400">{errors.date}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Time (UTC)</label>
            <Input
              type="time"
              value={data.time}
              onChange={e => update({ time: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBranding = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-gold-500" />
            </div>
            Event Branding
          </CardTitle>
          <CardDescription>Customize the look and feel of your event.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ImageUpload
            label="Event Banner"
            onImageSelect={(file) => update({ bannerUrl: URL.createObjectURL(file) })}
          />
          <div className="space-y-4">
            <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Theme Color</label>
            <div className="flex flex-wrap gap-3">
              {THEME_COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => update({ themeColor: c.hex })}
                  className={`h-14 w-14 rounded-2xl transition-all border-3 relative ${data.themeColor === c.hex ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {data.themeColor === c.hex && (
                    <motion.div layoutId="colorCheck" className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white drop-shadow-lg" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Tagline</label>
            <Input
              placeholder="e.g. Celebrating the pinnacle of innovation"
              value={data.tagline}
              onChange={e => update({ tagline: e.target.value })}
              icon={Tag}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest text-dark-500 flex items-center gap-2">
            <Eye className="h-4 w-4" /> Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-dark-950">
            <div className="h-48 w-full relative" style={{ background: `linear-gradient(135deg, ${data.themeColor}33, ${data.themeColor}11)` }}>
              {data.bannerUrl ? (
                <img src={data.bannerUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-white/10" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />
            </div>
            <div className="p-6 -mt-8 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: data.themeColor }} />
                <span className="text-[10px] uppercase tracking-widest text-dark-500 font-bold">Live Event Card</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-1">{data.title || 'Your Event Title'}</h3>
              {data.tagline && <p className="text-sm text-dark-400 italic mb-3">"{data.tagline}"</p>}
              {data.date && (
                <p className="text-xs text-dark-500 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-gold-500" />
              </div>
              Award Categories
            </CardTitle>
            <CardDescription>Configure honors and criteria for this event.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addCategory} className="border-white/10 hover:bg-white/5">
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.categories.map(cat => (
            <Card key={cat.id} className="hover:border-gold-500/30 transition-all group overflow-hidden">
              <CardContent className="pt-5">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-dark-800 rounded-xl border border-white/5 flex items-center justify-center relative">
                      <Trophy className="h-6 w-6 text-gold-500" />
                      {cat.rulesSource === 'custom' && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 flex items-center justify-center border-2 border-dark-900">
                          <Edit3 className="h-2 w-2 text-dark-950" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg text-white font-serif">{cat.name}</h3>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${
                          cat.rulesSource === 'global'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                            : 'bg-gold-500/10 border-gold-500/20 text-gold-500'
                        }`}>
                          {cat.rulesSource === 'global' ? <Globe className="h-2.5 w-2.5" /> : <Edit3 className="h-2.5 w-2.5" />}
                          {cat.rulesSource === 'global' ? 'Global Rules' : 'Custom Rules'}
                        </div>
                      </div>
                      <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">
                        {cat.rulesSource === 'global' ? 'Inheriting Organization Defaults' : 'Independent Voting Policy'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-dark-500 hover:text-rose-400 transition-colors"
                    onClick={() => removeCategory(cat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button
                    variant="glass"
                    onClick={() => navigate(`/dashboard/events/${eventId || 'new'}/categories/${cat.id}/rules`)}
                    className="h-10 text-[9px] uppercase font-bold tracking-[0.2em] bg-white/5 hover:bg-gold-500 hover:text-dark-950"
                  >
                    <ShieldCheck className="h-3 w-3 mr-2" /> Rules
                  </Button>
                  <Button
                    variant="glass"
                    onClick={() => navigate(`/dashboard/events/${eventId || 'new'}/categories/${cat.id}/nominees`)}
                    className="h-10 text-[9px] uppercase font-bold tracking-[0.2em] bg-white/5 hover:bg-white/10"
                  >
                    Nominees
                  </Button>
                  <Button
                    variant="glass"
                    onClick={() => navigate(`/dashboard/events/${eventId || 'new'}/categories/${cat.id}/criteria`)}
                    className="h-10 text-[9px] uppercase font-bold tracking-[0.2em] bg-white/5 hover:bg-white/10"
                  >
                    Criteria
                  </Button>
                  <Button
                    variant="glass"
                    onClick={() => setBrandingCategoryId(cat.id)}
                    className="h-10 text-[9px] uppercase font-bold tracking-[0.2em] bg-white/5 hover:bg-white/10"
                  >
                    Branding
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full h-16 border-dashed border-2 bg-white/0 hover:bg-white/5 border-white/10 text-dark-400 rounded-2xl"
            onClick={addCategory}
          >
            <Plus className="h-5 w-5 mr-2" /> Add New Category
          </Button>
        </CardContent>
      </Card>

      <BrandingModal
        isOpen={!!brandingCategoryId}
        onClose={() => setBrandingCategoryId(null)}
        categoryName={data.categories.find(c => c.id === brandingCategoryId)?.name || ''}
      />
    </div>
  );

  const renderVoting = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <Vote className="h-5 w-5 text-gold-500" />
            </div>
            Voting Configuration
          </CardTitle>
          <CardDescription>Control how audiences and judges participate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Toggle
            label="Enable Voting"
            description="Allow public or judge-based voting for this event"
            enabled={data.votingEnabled}
            onChange={v => update({ votingEnabled: v })}
          />
          {data.votingEnabled && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
              <div className="pl-4 border-l-2 border-gold-500/20 space-y-6">
                <Toggle
                  label="Public Voting"
                  description="Allow anyone with an account to vote"
                  enabled={data.publicVoting}
                  onChange={v => update({ publicVoting: v })}
                />
                <Toggle
                  label="Judge Voting"
                  description="Enable panel-based expert judging"
                  enabled={data.judgeVoting}
                  onChange={v => update({ judgeVoting: v })}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {data.votingEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              <Clock className="h-5 w-5 text-dark-400" />
              Periods & Schedules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-dark-400" /> Nomination Period
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Start Date</label>
                  <Input type="date" value={data.nominationStart} onChange={e => update({ nominationStart: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">End Date</label>
                  <Input type="date" value={data.nominationEnd} onChange={e => update({ nominationEnd: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Vote className="h-4 w-4 text-dark-400" /> Voting Period
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Start Date *</label>
                  <Input
                    type="date"
                    value={data.votingStart}
                    onChange={e => update({ votingStart: e.target.value })}
                    className={errors.votingStart ? 'border-rose-500' : ''}
                  />
                  {errors.votingStart && <p className="text-xs text-rose-400">{errors.votingStart}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">End Date *</label>
                  <Input
                    type="date"
                    value={data.votingEnd}
                    onChange={e => update({ votingEnd: e.target.value })}
                    className={errors.votingEnd ? 'border-rose-500' : ''}
                  />
                  {errors.votingEnd && <p className="text-xs text-rose-400">{errors.votingEnd}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderMonetization = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-gold-500" />
            </div>
            Monetization
          </CardTitle>
          <CardDescription>Optionally enable paid voting packages for supporters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Toggle
            label="Paid Voting"
            description="Require supporters to purchase voting packages"
            enabled={data.paidVoting}
            onChange={v => update({ paidVoting: v })}
          />

          {data.paidVoting && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Fan Starter', price: '$5', votes: '10 Votes', color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20' },
                  { name: 'Mega Supporter', price: '$20', votes: '50 Votes', color: 'from-gold-500/10 to-gold-500/5 border-gold-500/20' },
                  { name: 'Elite Bundle', price: '$50', votes: '150 Votes', color: 'from-violet-500/10 to-violet-500/5 border-violet-500/20' },
                ].map(pkg => (
                  <div key={pkg.name} className={`p-5 rounded-2xl bg-gradient-to-br ${pkg.color} border`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-dark-400 mb-2">{pkg.name}</p>
                    <p className="text-2xl font-serif text-white">{pkg.price}</p>
                    <p className="text-xs text-dark-400 mt-1">{pkg.votes}</p>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
                onClick={() => navigate('/dashboard/monetization')}
              >
                <CreditCard className="h-4 w-4 mr-2" /> Configure Packages
              </Button>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-gold-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Payment Gateway Setup</p>
                  <p className="text-xs text-dark-400 mt-1">Connect your Stripe or Paystack account to start accepting payments. Revenue reports are available in the monetization dashboard.</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <Eye className="h-5 w-5 text-gold-500" />
          </div>
          Review & Publish
        </CardTitle>
        <CardDescription>Verify everything before going live.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReviewSection title="General Information" onEdit={() => goTo(0)}>
          <ReviewRow label="Title" value={data.title || '—'} />
          <ReviewRow label="Date" value={data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'} />
          <ReviewRow label="Description" value={data.description ? (data.description.length > 100 ? data.description.slice(0, 100) + '...' : data.description) : '—'} />
        </ReviewSection>

        <ReviewSection title="Branding" onEdit={() => goTo(1)}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Theme</span>
            <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: data.themeColor }} />
            <span className="text-sm text-white">{THEME_COLORS.find(c => c.hex === data.themeColor)?.name || 'Custom'}</span>
          </div>
          <ReviewRow label="Tagline" value={data.tagline || '—'} />
        </ReviewSection>

        <ReviewSection title="Categories" onEdit={() => goTo(2)}>
          <ReviewRow label="Total Categories" value={data.categories.length.toString()} />
          <div className="flex flex-wrap gap-2 mt-2">
            {data.categories.map(c => (
              <span key={c.id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-dark-300">{c.name}</span>
            ))}
          </div>
        </ReviewSection>

        <ReviewSection title="Voting" onEdit={() => goTo(3)}>
          <ReviewRow label="Voting Enabled" value={data.votingEnabled ? 'Yes' : 'No'} />
          {data.votingEnabled && (
            <>
              <ReviewRow label="Public Voting" value={data.publicVoting ? 'Yes' : 'No'} />
              <ReviewRow label="Judge Voting" value={data.judgeVoting ? 'Yes' : 'No'} />
              <ReviewRow label="Voting Period" value={data.votingStart && data.votingEnd ? `${data.votingStart} to ${data.votingEnd}` : '—'} />
            </>
          )}
        </ReviewSection>

        <ReviewSection title="Monetization" onEdit={() => goTo(4)}>
          <ReviewRow label="Paid Voting" value={data.paidVoting ? 'Enabled' : 'Disabled'} />
        </ReviewSection>
      </CardContent>
    </Card>
  );

  const renderPublishSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-2xl mx-auto text-center py-12"
    >
      <div className="relative inline-block mb-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
            className="absolute h-2 w-2 rounded-full bg-gold-500"
            style={{
              top: `${50 + Math.sin(i * 0.8) * 60}%`,
              left: `${50 + Math.cos(i * 0.8) * 60}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="h-24 w-24 rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold-500/30 mx-auto"
        >
          <PartyPopper className="h-12 w-12 text-dark-950" />
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-serif text-white mb-3"
      >
        Event Published Successfully!
      </motion.h2>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <p className="text-xl text-gold-500 font-serif italic mb-1">{data.title}</p>
        {data.date && (
          <p className="text-sm text-dark-400 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" /> {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 gap-4 mt-12 max-w-md mx-auto"
      >
        <Button variant="outline" className="h-14 border-white/10 hover:bg-white/5 flex-col gap-1" onClick={() => navigate(`/events/${eventId || 'new'}`)}>
          <ExternalLink className="h-5 w-5" /> <span className="text-[10px] uppercase tracking-widest">View Event</span>
        </Button>
        <Button variant="outline" className="h-14 border-white/10 hover:bg-white/5 flex-col gap-1" onClick={() => goTo(2)}>
          <LayoutGrid className="h-5 w-5" /> <span className="text-[10px] uppercase tracking-widest">Categories</span>
        </Button>
        <Button variant="outline" className="h-14 border-white/10 hover:bg-white/5 flex-col gap-1" onClick={() => { setData(DEFAULT_DATA); setPublished(false); setStep(0); }}>
          <Plus className="h-5 w-5" /> <span className="text-[10px] uppercase tracking-widest">Create Another</span>
        </Button>
        <Button variant="outline" className="h-14 border-white/10 hover:bg-white/5 flex-col gap-1" onClick={() => navigate('/dashboard')}>
          <Home className="h-5 w-5" /> <span className="text-[10px] uppercase tracking-widest">Dashboard</span>
        </Button>
      </motion.div>
    </motion.div>
  );

  const showActions = step < 6 && !published;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <Breadcrumbs />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/events')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight">
            {eventId ? `Manage Event` : 'Create New Event'}
          </h1>
          <p className="text-dark-400 text-sm">
            Step {Math.min(step + 1, 7)} of 7 — {STEPS[Math.min(step, 6)].label}
          </p>
        </div>
      </div>

      {renderStepIndicator()}
      {renderStep()}

      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-xl border-t border-white/5"
        >
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={prev} className="border-white/10 hover:bg-white/5">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={saveDraft} className="border-white/10 hover:bg-white/5">
                <Save className="h-4 w-4 mr-2" /> Save Draft
              </Button>
              {step < 5 ? (
                <Button onClick={next} className="bg-gold-500 hover:bg-gold-600 text-dark-950">
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={publish} className="bg-gold-500 hover:bg-gold-600 text-dark-950 shadow-lg shadow-gold-500/20">
                  <Sparkles className="h-4 w-4 mr-2" /> Publish Event
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Toggle({ label, description, enabled, onChange }: { label: string; description: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-white">{label}</h4>
        <p className="text-xs text-dark-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`h-7 w-12 rounded-full relative transition-colors ${enabled ? 'bg-gold-500' : 'bg-dark-800'}`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1.5 h-4 w-4 rounded-full transition-colors ${enabled ? 'bg-dark-950' : 'bg-dark-500'}`}
        />
      </button>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h4>
        <Button variant="ghost" size="sm" onClick={onEdit} className="text-gold-500 hover:text-gold-400 text-[10px] uppercase tracking-widest">
          <Edit3 className="h-3 w-3 mr-1" /> Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-dark-500">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

function BrandingModal({ isOpen, onClose, categoryName }: { isOpen: boolean; onClose: () => void; categoryName: string }) {
  const [activeTheme, setActiveTheme] = React.useState('gold');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-dark-900 border-l border-white/10 shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark-900/80 backdrop-blur-md z-10">
              <div>
                <h3 className="text-2xl font-serif text-white italic">Branding <span className="text-dark-500 not-italic">/ {categoryName}</span></h3>
                <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">Customize Category Appearance</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-6">
                <ImageUpload
                  label="Category Icon / Logo"
                  aspectRatio="square"
                  onImageSelect={() => {}}
                />
                <ImageUpload
                  label="Sponsor Logo (Optional)"
                  aspectRatio="video"
                  onImageSelect={() => {}}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Theme Palette</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'gold', color: 'bg-gold-500' },
                    { id: 'rose', color: 'bg-rose-500' },
                    { id: 'emerald', color: 'bg-emerald-500' },
                    { id: 'blue', color: 'bg-blue-500' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTheme(t.id)}
                      className={`h-12 rounded-xl transition-all border-2 ${t.color} ${activeTheme === t.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Background Overlay</label>
                <div className="aspect-video rounded-2xl bg-dark-950 border border-white/5 flex items-center justify-center group cursor-pointer hover:border-gold-500/30 transition-all overflow-hidden relative">
                  <ImageIcon className="h-8 w-8 text-dark-800 group-hover:text-gold-500 transition-colors" />
                  <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-dark-950/50 sticky bottom-0">
              <Button className="w-full h-12">
                <Save className="h-4 w-4 mr-2" /> Save Branding Changes
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
