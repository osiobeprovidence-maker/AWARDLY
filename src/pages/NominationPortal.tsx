import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { PlatformNav } from '../components/navigation/PlatformNav';
import { useAuth } from '../lib/convex-auth';
import { useToast } from '../lib/toast';
import {
  Trophy, Clock, Users, CheckCircle2, ArrowRight, Send, Loader2,
  Globe, Twitter, Instagram, Linkedin, Youtube, FileText, Upload,
  Star, Award, Calendar, MapPin, ChevronRight, User, Mail, Building2,
  LinkIcon, PenTool, Heart, Sparkles, ExternalLink, X,
} from 'lucide-react';

function timeRemaining(dateStr: string): string {
  const now = Date.now();
  const end = new Date(dateStr).getTime();
  const diff = end - now;
  if (diff <= 0) return 'Closed';
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hrs}h remaining`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m remaining`;
}

export function NominationPortal() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Id<'categories'> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSelfNomination, setIsSelfNomination] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    nomineeName: '',
    nomineeEmail: '',
    nomineeOrganization: '',
    nomineeTitle: '',
    nomineeBio: '',
    achievementSummary: '',
    whyNominated: '',
    website: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    submitterEmail: user?.email || '',
  });

  const event = useQuery(
    api.events.queries.getById,
    eventId ? { eventId: eventId as Id<'events'> } : 'skip'
  );

  const categories = useQuery(
    api.categories.queries.getByEvent,
    eventId ? { eventId: eventId as Id<'events'> } : 'skip'
  );

  const nominationStatus = useQuery(
    api.nominations.queries.getEventNominationStatus,
    eventId ? { eventId: eventId as Id<'events'> } : 'skip'
  );

  const submitNomination = useMutation(api.nominations.mutations.submit);

  React.useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, submitterEmail: user.email || '' }));
      if (isSelfNomination) {
        setForm(prev => ({
          ...prev,
          nomineeName: user.name || '',
          nomineeEmail: user.email || '',
        }));
      }
    }
  }, [user, isSelfNomination]);

  const handleSubmit = async () => {
    if (!selectedCategory || !eventId) return;
    if (!form.nomineeName.trim() || !form.nomineeBio.trim() || !form.whyNominated.trim() || !form.submitterEmail.trim()) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitNomination({
        eventId: eventId as Id<'events'>,
        categoryId: selectedCategory,
        submitterEmail: form.submitterEmail,
        isSelfNomination,
        nomineeName: form.nomineeName,
        nomineeEmail: form.nomineeEmail || undefined,
        nomineeOrganization: form.nomineeOrganization || undefined,
        nomineeTitle: form.nomineeTitle || undefined,
        nomineeBio: form.nomineeBio,
        nomineeLinks: {
          website: form.website || undefined,
          twitter: form.twitter || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
          youtube: form.youtube || undefined,
        },
        achievementSummary: form.achievementSummary,
        whyNominated: form.whyNominated,
        firebaseUid: user?.id,
      });
      setSubmitted(true);
      toast('Nomination submitted successfully!', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to submit nomination', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-950">
        <PlatformNav />
        <div className="max-w-2xl mx-auto py-20 px-6 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-4">Nomination Submitted!</h1>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              Your nomination has been received and is pending review. The organizer will review it shortly.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to={`/events/${eventId}`}>
                <Button variant="outline">View Event</Button>
              </Link>
              <Button onClick={() => { setSubmitted(false); setShowForm(false); setSelectedCategory(null); }}>
                Submit Another
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <PlatformNav />

      {/* Hero */}
      <div className="relative overflow-hidden">
        {event?.coverUrl ? (
          <div className="h-64 sm:h-80">
            <img src={event.coverUrl} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/20" />
          </div>
        ) : (
          <div className="h-64 sm:h-80 bg-gradient-to-br from-gold-500/20 via-dark-900 to-dark-950" />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto w-full px-6 pb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {nominationStatus?.nominationsOpen ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Nominations Open
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-800 border border-white/10 text-dark-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  Nominations Closed
                </span>
              )}

              <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-tight mb-3">
                {event?.title || 'Loading...'}
              </h1>

              <div className="flex items-center gap-4 text-dark-300 text-sm flex-wrap">
                {event?.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {event?.venue && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {event.venue}
                  </span>
                )}
                {nominationStatus?.nominationEnd && nominationStatus.nominationsOpen && (
                  <span className="flex items-center gap-1.5 text-gold-500">
                    <Clock className="h-4 w-4" /> {timeRemaining(nominationStatus.nominationEnd)}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* About */}
        {event?.description && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-white mb-4">About This Award</h2>
            <p className="text-dark-300 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-white mb-2">Categories</h2>
          <p className="text-dark-400 text-sm mb-6">Select a category to nominate someone</p>

          {!categories || categories.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-white/10">
              <Trophy className="h-10 w-10 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">No categories available yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.filter(c => !c.isDeleted).map((cat) => (
                <motion.div
                  key={cat._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-5 cursor-pointer transition-all ${
                      selectedCategory === cat._id
                        ? 'border-gold-500 bg-gold-500/5'
                        : 'hover:border-white/10'
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      setShowForm(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                        <Trophy className="h-5 w-5 text-gold-500" />
                      </div>
                      <ChevronRight className={`h-5 w-5 ${selectedCategory === cat._id ? 'text-gold-500' : 'text-dark-600'}`} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-[11px] text-dark-400 line-clamp-2">{cat.description}</p>
                    )}
                    <p className="text-[10px] text-dark-500 mt-2">{cat.nomineeCount} nominees</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Nomination Form */}
        <AnimatePresence>
          {showForm && selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-gold-500" />
                    Submit Nomination
                  </CardTitle>
                  <CardDescription>
                    Nominating for: {categories?.find(c => c._id === selectedCategory)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Self vs Other Toggle */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isSelfNomination}
                        onChange={() => setIsSelfNomination(false)}
                        className="accent-gold-500"
                      />
                      <span className="text-sm text-dark-300">Nominating someone else</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={isSelfNomination}
                        onChange={() => setIsSelfNomination(true)}
                        className="accent-gold-500"
                      />
                      <span className="text-sm text-dark-300">Nominating myself</span>
                    </label>
                  </div>

                  {/* Submitter Email */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Your Email *</label>
                    <input
                      type="email"
                      value={form.submitterEmail}
                      onChange={e => setForm({ ...form, submitterEmail: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                    />
                  </div>

                  {/* Nominee Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Nominee Name *</label>
                      <input
                        value={form.nomineeName}
                        onChange={e => setForm({ ...form, nomineeName: e.target.value })}
                        placeholder="Full name"
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={form.nomineeEmail}
                        onChange={e => setForm({ ...form, nomineeEmail: e.target.value })}
                        placeholder="nominee@email.com"
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Organization</label>
                      <input
                        value={form.nomineeOrganization}
                        onChange={e => setForm({ ...form, nomineeOrganization: e.target.value })}
                        placeholder="Company or organization"
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Title / Role</label>
                      <input
                        value={form.nomineeTitle}
                        onChange={e => setForm({ ...form, nomineeTitle: e.target.value })}
                        placeholder="CEO, Founder, etc."
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">About the Nominee *</label>
                    <textarea
                      value={form.nomineeBio}
                      onChange={e => setForm({ ...form, nomineeBio: e.target.value })}
                      placeholder="Tell us about this person — their background, expertise, and what makes them stand out..."
                      rows={4}
                      className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 resize-none placeholder:text-dark-600"
                    />
                  </div>

                  {/* Achievement Summary */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Key Achievements *</label>
                    <textarea
                      value={form.achievementSummary}
                      onChange={e => setForm({ ...form, achievementSummary: e.target.value })}
                      placeholder="List their most notable achievements, awards, projects, or contributions..."
                      rows={3}
                      className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 resize-none placeholder:text-dark-600"
                    />
                  </div>

                  {/* Why Nominated */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Why Are They Being Nominated? *</label>
                    <textarea
                      value={form.whyNominated}
                      onChange={e => setForm({ ...form, whyNominated: e.target.value })}
                      placeholder="Explain why this person deserves this award..."
                      rows={3}
                      className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 resize-none placeholder:text-dark-600"
                    />
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-2 block">Social Links</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'website', label: 'Website', icon: Globe },
                        { key: 'twitter', label: 'Twitter', icon: Twitter },
                        { key: 'instagram', label: 'Instagram', icon: Instagram },
                        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                        { key: 'youtube', label: 'YouTube', icon: Youtube },
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center gap-2 bg-dark-800/60 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-gold-500/30">
                          <Icon className="h-4 w-4 text-dark-500 shrink-0" />
                          <input
                            value={(form as any)[key] || ''}
                            onChange={e => setForm({ ...form, [key]: e.target.value })}
                            placeholder={label}
                            className="bg-transparent text-sm text-white outline-none w-full placeholder:text-dark-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <p className="text-[10px] text-dark-500">* Required fields</p>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="h-12 px-8 shadow-xl shadow-gold-500/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Submit Nomination
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
