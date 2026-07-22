import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PublicNav } from '../components/navigation/PublicNav';
import {
  Trophy, Calendar, Clock, MapPin, Users, Vote, Award, Target, CheckCircle2,
  ArrowRight, Share2, Bookmark, ExternalLink, ChevronDown, ChevronUp,
  Globe, Star, TrendingUp, Heart, Play, Image as ImageIcon, X,
  Newspaper, MessageCircle, Zap, Radio
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────
type AwardStatus = 'Nominations Open' | 'Voting Live' | 'Judging' | 'Winners Announced' | 'Upcoming';

interface NewsItem {
  title: string;
  date: string;
  type: 'announcement' | 'update' | 'sponsor';
}

interface Sponsor {
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver';
}

interface PortalAward {
  id: string;
  name: string;
  shortName: string;
  org: string;
  category: string;
  status: AwardStatus;
  banner: string;
  logo: string;
  description: string;
  about: string;
  history: string;
  mission: string;
  eligibility: string;
  prizes: string;
  organizer: string;
  website?: string;
  dates: {
    nominationsOpen: string;
    nominationsClose: string;
    publicVoting: string;
    shortlisting: string;
    finalJudging: string;
    winnerAnnouncement: string;
    ceremony: string;
  };
  venue: string;
  city: string;
  country: string;
  mapUrl: string;
  ceremonyTime: string;
  dressCode?: string;
  stats: {
    categories: number;
    nominees: number;
    votes: number;
    countries: number;
    yearsRunning: number;
    activeVisitors: number;
  };
  categories: Array<{ id: string; name: string; nomineesCount: number; status: string }>;
  judges: Array<{ name: string; photo: string; position: string; organization: string; bio: string }>;
  nominees: Array<{ name: string; category: string; photo: string; votes?: number; country: string; organization?: string }>;
  gallery: Array<{ type: 'photo' | 'video'; url: string; caption: string }>;
  news: NewsItem[];
  sponsors: Sponsor[];
  faq: Array<{ question: string; answer: string }>;
  liveActivity: {
    votesToday: number;
    nominationsToday: number;
    participantCountries: number;
    activeVisitors: number;
    nextDeadline: string;
    nextDeadlineLabel: string;
  };
}

const portalData: Record<string, PortalAward> = {
  headies: {
    id: 'headies',
    name: 'The 17th Headies',
    shortName: 'Headies',
    org: 'Headies Official',
    category: 'Entertainment',
    status: 'Voting Live',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=200',
    description: 'The premier African music awards celebrating the brightest stars across the continent and diaspora.',
    about: 'The Headies is Africa\'s most prestigious music awards show, celebrating excellence in Nigerian and African music. The 17th edition brings together the continent\'s finest talents for a night of recognition, performance, and celebration.',
    history: 'Founded in 2006 by Ayo Animashaun, the Headies has grown from a niche music awards show into one of Africa\'s most recognized entertainment events. Over 16 editions, the awards have celebrated legends and launched careers.',
    mission: 'To celebrate and promote excellence in African music by providing a world-class platform that connects artists, fans, and the global entertainment industry.',
    eligibility: 'Open to all Nigerian and African recording artists with commercially released music during the eligibility period (January - December 2025). Both established and emerging artists are welcome to be nominated.',
    prizes: 'Winner receives the iconic Headies trophy, global media exposure, performance slot at the ceremony, and inclusion in the Headies Academy archive.',
    organizer: 'Hip Hop World Foundation',
    website: 'https://theheadies.com',
    dates: {
      nominationsOpen: '2026-03-01',
      nominationsClose: '2026-05-31',
      publicVoting: '2026-06-01',
      shortlisting: '2026-07-15',
      finalJudging: '2026-08-15',
      winnerAnnouncement: '2026-09-04',
      ceremony: '2026-09-04',
    },
    venue: 'Eko Convention Center',
    city: 'Lagos',
    country: 'Nigeria',
    mapUrl: 'https://maps.google.com/?q=Eko+Convention+Center+Lagos',
    ceremonyTime: '6:00 PM WAT',
    dressCode: 'Black Tie / Formal',
    stats: {
      categories: 24,
      nominees: 120,
      votes: 2341000,
      countries: 18,
      yearsRunning: 17,
      activeVisitors: 3847,
    },
    categories: [
      { id: 'cat1', name: 'Artiste of the Year', nomineesCount: 8, status: 'Voting' },
      { id: 'cat2', name: 'Next Rated', nomineesCount: 6, status: 'Voting' },
      { id: 'cat3', name: 'Best Male Vocalist', nomineesCount: 8, status: 'Voting' },
      { id: 'cat4', name: 'Album of the Year', nomineesCount: 10, status: 'Voting' },
      { id: 'cat5', name: 'Song of the Year', nomineesCount: 12, status: 'Voting' },
      { id: 'cat6', name: 'Best Female Vocalist', nomineesCount: 8, status: 'Voting' },
      { id: 'cat7', name: 'Rap Album of the Year', nomineesCount: 6, status: 'Voting' },
      { id: 'cat8', name: 'Best Music Video', nomineesCount: 8, status: 'Voting' },
    ],
    judges: [
      { name: 'Don Jazzy', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', position: 'Chairman', organization: 'Mavin Records', bio: 'Legendary Nigerian producer and music executive with over two decades of shaping African music.' },
      { name: 'Tiwa Savage', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', position: 'Judge', organization: 'Independent Artist', bio: 'Award-winning singer-songwriter known as the Queen of Afrobeats.' },
      { name: 'Olu Maintain', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', position: 'Judge', organization: 'Independent', bio: 'Pioneer of Nigerian pop culture and one of the most respected figures in the industry.' },
    ],
    nominees: [
      { name: 'Burna Boy', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1521112376370-0a3b01544af1?auto=format&fit=crop&q=80&w=200', votes: 61000, country: 'Nigeria' },
      { name: 'Wizkid', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', votes: 58900, country: 'Nigeria' },
      { name: 'Asake', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 52140, country: 'Nigeria' },
      { name: 'Adekunle Gold', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', votes: 45210, country: 'Nigeria' },
      { name: 'Ayra Starr', category: 'Next Rated', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', votes: 34200, country: 'Nigeria' },
      { name: 'Rema', category: 'Next Rated', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 41000, country: 'Nigeria' },
      { name: 'Tems', category: 'Best Female Vocalist', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', votes: 38700, country: 'Nigeria' },
      { name: 'Davido', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 42100, country: 'Nigeria' },
    ],
    gallery: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800', caption: 'Headies Main Stage 2025' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', caption: 'Red Carpet Highlights' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', caption: 'Audience at the 16th Headies' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800', caption: 'Previous Winner Celebration' },
      { type: 'video', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800', caption: '16th Headies Highlight Reel' },
    ],
    news: [
      { title: 'Voting extended by 48 hours due to massive participation', date: '2026-07-20', type: 'update' },
      { title: 'Coca-Cola announced as headline sponsor', date: '2026-07-15', type: 'sponsor' },
      { title: 'New category added: Best African Collaboration', date: '2026-07-10', type: 'announcement' },
      { title: 'Ceremony venue confirmed: Eko Convention Center', date: '2026-07-01', type: 'announcement' },
    ],
    sponsors: [
      { name: 'Coca-Cola', logo: 'https://images.unsplash.com/photo-1554478149-f0e9d6ee3a1c?auto=format&fit=crop&q=80&w=200', tier: 'platinum' },
      { name: 'MTN', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&q=80&w=200', tier: 'gold' },
      { name: 'Pepsi', logo: 'https://images.unsplash.com/photo-1554478149-f0e9d6ee3a1c?auto=format&fit=crop&q=80&w=200', tier: 'gold' },
      { name: 'DStv', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&q=80&w=200', tier: 'silver' },
    ],
    faq: [
      { question: 'How do I nominate?', answer: 'Nominations are submitted through the official Headies portal during the nomination window. Artists, labels, and fans can submit entries for consideration.' },
      { question: 'Can anyone vote?', answer: 'Yes! Public voting is open to everyone with a valid email address. You can vote once per category per day during the voting period.' },
      { question: 'Is voting free?', answer: 'Yes, public voting on Awardly is completely free. Premium voting packages with additional features are available but not required.' },
      { question: 'How are winners selected?', answer: 'Winners are determined through a combination of public voting (40%) and academy voting (60%). The final judging panel reviews all nominees.' },
      { question: 'Can organizations sponsor?', answer: 'Yes, sponsorship packages are available. Visit our partnerships page or contact our team for brand integration opportunities.' },
    ],
    liveActivity: {
      votesToday: 2341,
      nominationsToday: 56,
      participantCountries: 18,
      activeVisitors: 3847,
      nextDeadline: '2026-08-31',
      nextDeadlineLabel: 'Voting Ends',
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function getStatusColor(status: AwardStatus) {
  switch (status) {
    case 'Voting Live': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    case 'Nominations Open': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    case 'Upcoming': return 'bg-gold-500/10 border-gold-500/20 text-gold-500';
    case 'Winners Announced': return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
    case 'Judging': return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
    default: return 'bg-dark-800 border-white/10 text-dark-400';
  }
}

function getStatusIcon(status: AwardStatus) {
  switch (status) {
    case 'Voting Live': return <Vote className="h-3 w-3" />;
    case 'Nominations Open': return <Target className="h-3 w-3" />;
    case 'Upcoming': return <Clock className="h-3 w-3" />;
    case 'Winners Announced': return <CheckCircle2 className="h-3 w-3" />;
    case 'Judging': return <Star className="h-3 w-3" />;
    default: return <Calendar className="h-3 w-3" />;
  }
}

function getCTA(status: AwardStatus) {
  switch (status) {
    case 'Nominations Open': return { label: 'Nominate Now', icon: Target };
    case 'Voting Live': return { label: 'Vote Now', icon: Vote };
    case 'Upcoming': return { label: 'Register', icon: Users };
    case 'Winners Announced': return { label: 'View Winners', icon: Trophy };
    case 'Judging': return { label: 'Stay Updated', icon: Clock };
    default: return { label: 'Learn More', icon: ExternalLink };
  }
}

function getTimeRemaining(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d`;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// ─── Sub-components ────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 sm:py-5 text-left group">
        <span className="text-sm sm:text-base text-white font-medium pr-4 group-hover:text-gold-500 transition-colors">{question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-dark-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-dark-500 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-dark-400 leading-relaxed pb-4 sm:pb-5">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LightboxModal({ url, caption, onClose }: { url: string; caption: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
        <X className="h-5 w-5 text-white" />
      </button>
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <img src={url} alt={caption} className="w-full rounded-2xl" referrerPolicy="no-referrer" />
        <p className="text-center text-sm text-dark-400 mt-4">{caption}</p>
      </div>
    </motion.div>
  );
}

// ─── Tab Sections ──────────────────────────────────────────────────────────
function OverviewSection({ award }: { award: PortalAward }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-serif text-white italic mb-3">About</h3>
        <p className="text-dark-300 text-sm leading-relaxed">{award.about}</p>
      </div>
      {award.history && (
        <div>
          <h3 className="text-lg font-serif text-white italic mb-3">History</h3>
          <p className="text-dark-400 text-sm leading-relaxed">{award.history}</p>
        </div>
      )}
      {award.mission && (
        <div className="bg-gold-500/5 border border-gold-500/10 rounded-xl p-5">
          <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-2">Mission</p>
          <p className="text-dark-300 text-sm leading-relaxed">{award.mission}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-dark-600 uppercase tracking-widest mb-1">Eligibility</p>
          <p className="text-dark-400 text-sm leading-relaxed">{award.eligibility}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-dark-600 uppercase tracking-widest mb-1">Prizes</p>
          <p className="text-dark-400 text-sm leading-relaxed">{award.prizes}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Categories', value: award.stats.categories, icon: Award },
          { label: 'Nominees', value: award.stats.nominees, icon: Users },
          { label: 'Countries', value: award.stats.countries, icon: Globe },
          { label: 'Edition', value: `${award.stats.yearsRunning}${award.stats.yearsRunning === 1 ? 'st' : award.stats.yearsRunning === 2 ? 'nd' : award.stats.yearsRunning === 3 ? 'rd' : 'th'}`, icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i} className="border-white/5 text-center">
            <CardContent className="p-4">
              <stat.icon className="h-4 w-4 text-gold-500 mx-auto mb-1.5" />
              <p className="text-lg font-serif text-white italic">{stat.value}</p>
              <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TimelineSection({ award }: { award: PortalAward }) {
  const steps = [
    { label: 'Nominations Open', date: award.dates.nominationsOpen, done: true },
    { label: 'Nominations Close', date: award.dates.nominationsClose, done: true },
    { label: 'Public Voting', date: award.dates.publicVoting, done: award.status !== 'Nominations Open' && award.status !== 'Upcoming' },
    { label: 'Shortlisting', date: award.dates.shortlisting, done: award.status === 'Judging' || award.status === 'Winners Announced' },
    { label: 'Final Judging', date: award.dates.finalJudging, done: award.status === 'Winners Announced' },
    { label: 'Winner Announcement', date: award.dates.winnerAnnouncement, done: award.status === 'Winners Announced' },
    { label: 'Award Ceremony', date: award.dates.ceremony, done: award.status === 'Winners Announced' },
  ];
  const currentStep = steps.findIndex(s => !s.done);
  const activeStep = currentStep === -1 ? steps.length - 1 : currentStep;

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
      <div className="space-y-0">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = step.done;
          return (
            <div key={i} className="relative flex gap-4 sm:gap-6">
              <div className="relative z-10 shrink-0 mt-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive ? 'bg-gold-500 border-gold-500' :
                  isDone ? 'bg-gold-500/20 border-gold-500/40' :
                  'bg-dark-900 border-white/10'
                }`}>
                  {isDone ? <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-dark-950' : 'text-gold-500'}`} /> :
                   <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-dark-950' : 'bg-dark-600'}`} />}
                </div>
              </div>
              <div className={`flex-1 pb-6 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
                <p className={`text-sm font-medium ${isActive ? 'text-gold-500' : isDone ? 'text-dark-300' : 'text-dark-500'}`}>{step.label}</p>
                <p className="text-[11px] text-dark-500 mt-0.5">{formatDate(step.date)}</p>
                {isActive && <span className="inline-block mt-1 text-[9px] font-bold text-gold-500 uppercase tracking-widest animate-pulse">Current Stage</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoriesSection({ award }: { award: PortalAward }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {award.categories.map((cat, i) => (
        <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group cursor-pointer">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{cat.name}</h4>
              <p className="text-[10px] text-dark-500 mt-0.5">{cat.nomineesCount} nominees</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">{cat.status}</span>
              <ArrowRight className="h-4 w-4 text-dark-600 group-hover:text-gold-500 transition-colors" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NomineesSection({ award }: { award: PortalAward }) {
  const [votedIds, setVotedIds] = React.useState<Set<number>>(new Set());

  const toggleVote = (idx: number) => {
    setVotedIds(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div>
      {award.status === 'Voting Live' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
          <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Voting is Live — Cast your votes below</span>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {award.nominees.map((nom, i) => (
          <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group p-0">
            <div className="aspect-square relative overflow-hidden">
              <img src={nom.photo} alt={nom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent" />
              {nom.votes !== undefined && (
                <div className="absolute top-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/10">
                  <Vote className="h-2.5 w-2.5 text-emerald-500" />
                  <span className="text-[9px] font-bold text-white">{formatNumber(nom.votes)}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-medium text-white truncate">{nom.name}</p>
                <p className="text-[9px] text-dark-400 uppercase tracking-widest">{nom.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Globe className="h-2.5 w-2.5 text-dark-500" />
                  <span className="text-[9px] text-dark-500">{nom.country}</span>
                  {nom.organization && <span className="text-[9px] text-dark-600">• {nom.organization}</span>}
                </div>
              </div>
            </div>
            {award.status === 'Voting Live' && (
              <div className="p-2 border-t border-white/5">
                <button
                  onClick={() => toggleVote(i)}
                  className={`w-full h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                    votedIds.has(i)
                      ? 'bg-emerald-500 text-dark-950'
                      : 'bg-white/5 text-dark-400 hover:bg-emerald-500/10 hover:text-emerald-500 border border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  {votedIds.has(i) ? (
                    <><CheckCircle2 className="h-3 w-3" /> Voted</>
                  ) : (
                    <><Vote className="h-3 w-3" /> Vote</>
                  )}
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function JudgesSection({ award }: { award: PortalAward }) {
  if (award.judges.length === 0) return <p className="text-dark-500 text-sm text-center py-8">Judges to be announced.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {award.judges.map((judge, i) => (
        <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <img src={judge.photo} alt={judge.name} className="h-14 w-14 rounded-full object-cover border-2 border-gold-500/20" referrerPolicy="no-referrer" />
              <div>
                <p className="text-sm font-medium text-white">{judge.name}</p>
                <p className="text-[10px] text-gold-500">{judge.position}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-2">{judge.organization}</p>
            <p className="text-[11px] text-dark-400 leading-relaxed">{judge.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GallerySection({ award, onImageClick }: { award: PortalAward; onImageClick: (url: string, caption: string) => void }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {award.gallery.map((media, i) => (
        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5" onClick={() => onImageClick(media.url, media.caption)}>
          <img src={media.url} alt={media.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center">
            {media.type === 'video' ? <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" /> : <ImageIcon className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950/80 to-transparent p-3">
            <p className="text-[10px] text-dark-300 truncate">{media.caption}</p>
          </div>
          {media.type === 'video' && (
            <div className="absolute top-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/10">
              <Play className="h-2.5 w-2.5 text-white" />
              <span className="text-[8px] font-bold text-white uppercase">Video</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NewsSection({ award }: { award: PortalAward }) {
  const typeColors: Record<string, string> = {
    announcement: 'text-blue-500 bg-blue-500/10',
    update: 'text-gold-500 bg-gold-500/10',
    sponsor: 'text-emerald-500 bg-emerald-500/10',
  };
  return (
    <div className="space-y-3">
      {award.news.map((item, i) => (
        <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
          <CardContent className="p-4 sm:p-5 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
              <Newspaper className="h-4 w-4 text-dark-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${typeColors[item.type] || 'text-dark-400 bg-white/5'}`}>{item.type}</span>
                <span className="text-[10px] text-dark-500">{formatDate(item.date)}</span>
              </div>
              <p className="text-sm text-white font-medium">{item.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FAQSection({ award }: { award: PortalAward }) {
  if (award.faq.length === 0) return <p className="text-dark-500 text-sm text-center py-8">No frequently asked questions yet.</p>;
  return (
    <Card className="border-white/5">
      <CardContent className="p-5 sm:p-6">
        {award.faq.map((item, i) => (
          <FAQItem key={i} question={item.question} answer={item.answer} />
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
const tabs = ['Overview', 'Timeline', 'Categories', 'Nominees', 'Judges', 'Gallery', 'News', 'FAQ'] as const;
type Tab = typeof tabs[number];

export function AwardPortal() {
  const { awardId } = useParams<{ awardId: string }>();
  const award = portalData[awardId || ''];
  const [activeTab, setActiveTab] = React.useState<Tab>('Overview');
  const [lightbox, setLightbox] = React.useState<{ url: string; caption: string } | null>(null);

  if (!award) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
            <Trophy className="h-10 w-10 text-dark-600" />
          </div>
          <h1 className="text-3xl font-serif text-white italic mb-3">Portal Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">This award portal doesn't exist yet.</p>
          <Link to="/schedule"><Button variant="primary">Browse Awards</Button></Link>
        </div>
      </div>
    );
  }

  const cta = getCTA(award.status);
  const ctaIcon = cta.icon;
  const countdown = getTimeRemaining(award.liveActivity.nextDeadline);

  const renderTab = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewSection award={award} />;
      case 'Timeline': return <TimelineSection award={award} />;
      case 'Categories': return <CategoriesSection award={award} />;
      case 'Nominees': return <NomineesSection award={award} />;
      case 'Judges': return <JudgesSection award={award} />;
      case 'Gallery': return <GallerySection award={award} onImageClick={(url, caption) => setLightbox({ url, caption })} />;
      case 'News': return <NewsSection award={award} />;
      case 'FAQ': return <FAQSection award={award} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />

      {lightbox && <LightboxModal url={lightbox.url} caption={lightbox.caption} onClose={() => setLightbox(null)} />}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        <img src={award.banner} alt={award.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(award.status)}`}>
                  {getStatusIcon(award.status)}
                  {award.status}
                </span>
                <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">{award.category}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white italic leading-[1] tracking-tighter">{award.name}</h1>
              <p className="text-dark-300 text-sm sm:text-base max-w-xl">{award.description}</p>

              <div className="flex flex-wrap gap-3 mt-2">
                <Button variant="primary" className="h-11 px-6 text-[11px] font-bold uppercase tracking-widest">
                  <ctaIcon className="h-4 w-4 mr-2" />
                  {cta.label}
                </Button>
                {award.website && (
                  <a href={award.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="glass" className="h-11 px-5 text-[11px] font-bold uppercase tracking-widest">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Website
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Live Activity Bar ────────────────────────────────────────── */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4 sm:gap-6 py-3 overflow-x-auto no-scrollbar">
            {[
              { icon: Vote, label: `${formatNumber(award.liveActivity.votesToday)} votes today`, color: 'text-emerald-500' },
              { icon: Award, label: `${award.liveActivity.nominationsToday} nominations today`, color: 'text-blue-500' },
              { icon: Globe, label: `${award.liveActivity.participantCountries} countries`, color: 'text-purple-500' },
              { icon: Users, label: `${formatNumber(award.liveActivity.activeVisitors)} active`, color: 'text-gold-500' },
              { icon: Clock, label: `${award.liveActivity.nextDeadlineLabel}: ${countdown || 'Completed'}`, color: 'text-dark-300' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <item.icon className={`h-3 w-3 ${item.color}`} />
                <span className="text-[10px] text-dark-400 font-medium whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-dark-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 xl:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card className="border-white/10">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(award.status)}`}>
                      {getStatusIcon(award.status)}
                      {award.status}
                    </span>
                    {countdown && (
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest">Countdown</p>
                        <p className="text-base font-serif text-gold-500 italic font-bold">{countdown}</p>
                      </div>
                    )}
                  </div>

                  <Button variant="primary" className="w-full h-12 text-sm font-bold uppercase tracking-widest">
                    <ctaIcon className="h-4 w-4 mr-2" />
                    {cta.label}
                  </Button>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Event Info</p>
                    <div className="flex items-center gap-2 text-[11px] text-dark-300">
                      <MapPin className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {award.venue}, {award.city}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-dark-300">
                      <Calendar className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {formatDate(award.dates.ceremony)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-dark-300">
                      <Clock className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {award.ceremonyTime}
                    </div>
                    {award.dressCode && (
                      <div className="flex items-center gap-2 text-[11px] text-dark-300">
                        <Award className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                        {award.dressCode}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button variant="ghost" className="flex-1 h-10 text-[10px] font-bold uppercase tracking-widest">
                      <Bookmark className="h-3.5 w-3.5 mr-1.5" /> Save
                    </Button>
                    <Button variant="ghost" className="flex-1 h-10 text-[10px] font-bold uppercase tracking-widest"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: award.name, url: window.location.href });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-white/5">
                <CardContent className="p-5 space-y-3">
                  <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Quick Facts</p>
                  {[
                    { icon: Award, label: 'Categories', value: award.stats.categories },
                    { icon: Users, label: 'Nominees', value: award.stats.nominees },
                    { icon: Globe, label: 'Countries', value: award.stats.countries },
                    { icon: Vote, label: 'Total Votes', value: formatNumber(award.stats.votes) },
                    { icon: TrendingUp, label: 'Edition', value: `${award.stats.yearsRunning}${award.stats.yearsRunning === 1 ? 'st' : award.stats.yearsRunning === 2 ? 'nd' : award.stats.yearsRunning === 3 ? 'rd' : 'th'}` },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-2 text-dark-400">
                        <stat.icon className="h-3.5 w-3.5 text-gold-500" />
                        {stat.label}
                      </span>
                      <span className="font-medium text-white">{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sponsors */}
              {award.sponsors.length > 0 && (
                <Card className="border-white/5">
                  <CardContent className="p-5 space-y-3">
                    <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Sponsors</p>
                    <div className="grid grid-cols-2 gap-2">
                      {award.sponsors.map((sponsor, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-dark-400 text-center">{sponsor.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────────────── */}
      <section className="border-t border-white/5 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-4xl font-serif text-white italic mb-4">Ready to Participate?</h2>
            <p className="text-dark-400 text-sm sm:text-base mb-8">
              {award.status === 'Voting Live' && "Cast your vote and help choose this year's winners."}
              {award.status === 'Nominations Open' && "Submit your nomination and be part of this prestigious award."}
              {award.status === 'Upcoming' && "Register now to receive updates and secure your spot."}
              {award.status === 'Winners Announced' && "Explore the winners and relive the ceremony highlights."}
              {award.status === 'Judging' && "Stay tuned as the judges deliberate. Winners will be announced soon."}
            </p>
            <Button variant="primary" size="lg" className="h-14 px-10">
              <ctaIcon className="h-5 w-5 mr-2" />
              {cta.label}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-xs">
            <p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">The world's leading platform for award management, secure voting, and community recognition.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/discover" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Explore</Link>
            <Link to="/schedule" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Schedule</Link>
            <Link to={`/awards/${award.id}`} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Details</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
