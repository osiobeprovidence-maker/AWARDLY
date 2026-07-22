import React, { useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PublicNav } from '../components/navigation/PublicNav';
import {
  Trophy, Calendar, Clock, MapPin, Users, Vote, Award, Target, CheckCircle2,
  ArrowRight, Share2, Bookmark, ExternalLink, ChevronDown, ChevronUp,
  Globe, Star, TrendingUp, Play, Image as ImageIcon, X,
  Newspaper, Radio, Zap, Link2, CalendarPlus, Flag, Timer, ChevronLeft, ChevronRight, Copy
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
type EventStatus = 'Nominations Open' | 'Voting Live' | 'Judging' | 'Winners Announced' | 'Upcoming' | 'Live';

interface EventData {
  id: string;
  title: string;
  org: string;
  orgId: string;
  status: EventStatus;
  description: string;
  theme?: string;
  purpose: string;
  eligibility: string;
  banner: string;
  logo: string;
  dates: {
    nominationsOpen: string;
    nominationsClose: string;
    votingBegins: string;
    votingEnds: string;
    judging: string;
    finalists: string;
    winnersAnnounced: string;
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
    attendees: number;
  };
  categories: Array<{ id: string; name: string; nomineesCount: number; status: string }>;
  nominees: Array<{ name: string; category: string; photo: string; votes?: number; country: string; org?: string }>;
  judges: Array<{ name: string; photo: string; position: string; organization: string; bio: string }>;
  schedule: Array<{ time: string; event: string; location?: string }>;
  gallery: Array<{ type: 'photo' | 'video'; url: string; caption: string }>;
  sponsors: Array<{ name: string; tier: string }>;
  faq: Array<{ question: string; answer: string }>;
  relatedEvents: Array<{ id: string; title: string; image: string; date: string }>;
  broadcast?: {
    youtubeVideoId?: string;
    status: 'live' | 'upcoming' | 'replay' | 'none';
    startedAt?: string;
    scheduledAt?: string;
    viewerCount: number;
    duration?: string;
    description: string;
    relatedVideos: Array<{ title: string; youtubeVideoId: string; duration: string; status: string }>;
  };
  liveActivity: {
    votesToday: number;
    trendingNominees: string[];
    recentVotes: number;
    remainingTime: string;
  };
}

// ─── Data ──────────────────────────────────────────────────────────────────
const eventsData: Record<string, EventData> = {
  evt1: {
    id: 'evt1',
    title: 'The 17th Headies 2026',
    org: 'Headies Official',
    orgId: 'headies',
    status: 'Voting Live',
    description: 'Global Edition featuring top talents across Africa and the diaspora. The 17th Headies celebrates the best in African music with 24 categories spanning Afrobeats, Hip Hop, R&B, and more.',
    theme: 'Africa Rising: A New Era of Sound',
    purpose: 'To recognize and celebrate outstanding achievements in the Nigerian and African music industry, inspiring the next generation of artists.',
    eligibility: 'Open to all Nigerian and African recording artists with commercially released music during the eligibility period (January - December 2025).',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=200',
    dates: {
      nominationsOpen: '2026-03-01',
      nominationsClose: '2026-05-31',
      votingBegins: '2026-06-01',
      votingEnds: '2026-08-31',
      judging: '2026-09-01',
      finalists: '2026-09-02',
      winnersAnnounced: '2026-09-04',
      ceremony: '2026-09-04',
    },
    venue: 'Eko Convention Center',
    city: 'Lagos',
    country: 'Nigeria',
    mapUrl: 'https://maps.google.com/?q=Eko+Convention+Center+Lagos',
    ceremonyTime: '6:00 PM WAT',
    dressCode: 'Black Tie / Formal',
    stats: { categories: 24, nominees: 120, votes: 2341000, countries: 18, attendees: 5000 },
    categories: [
      { id: 'c1', name: 'Artiste of the Year', nomineesCount: 8, status: 'Voting' },
      { id: 'c2', name: 'Next Rated', nomineesCount: 6, status: 'Voting' },
      { id: 'c3', name: 'Best Male Vocalist', nomineesCount: 8, status: 'Voting' },
      { id: 'c4', name: 'Album of the Year', nomineesCount: 10, status: 'Voting' },
      { id: 'c5', name: 'Song of the Year', nomineesCount: 12, status: 'Voting' },
      { id: 'c6', name: 'Best Female Vocalist', nomineesCount: 8, status: 'Voting' },
    ],
    nominees: [
      { name: 'Burna Boy', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1521112376370-0a3b01544af1?auto=format&fit=crop&q=80&w=200', votes: 61000, country: 'Nigeria' },
      { name: 'Wizkid', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', votes: 58900, country: 'Nigeria' },
      { name: 'Asake', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 52140, country: 'Nigeria' },
      { name: 'Adekunle Gold', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', votes: 45210, country: 'Nigeria' },
      { name: 'Ayra Starr', category: 'Next Rated', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', votes: 34200, country: 'Nigeria' },
      { name: 'Rema', category: 'Next Rated', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 41000, country: 'Nigeria' },
    ],
    judges: [
      { name: 'Don Jazzy', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', position: 'Chairman', organization: 'Mavin Records', bio: 'Legendary Nigerian producer and music executive.' },
      { name: 'Tiwa Savage', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', position: 'Judge', organization: 'Independent', bio: 'Award-winning singer-songwriter, the Queen of Afrobeats.' },
    ],
    schedule: [
      { time: '4:00 PM', event: 'Red Carpet Arrivals', location: 'Main Entrance' },
      { time: '5:30 PM', event: 'Welcome Reception', location: 'Grand Ballroom' },
      { time: '6:00 PM', event: 'Opening Ceremony', location: 'Main Stage' },
      { time: '6:30 PM', event: 'Live Performances', location: 'Main Stage' },
      { time: '8:00 PM', event: 'Category Presentations', location: 'Main Stage' },
      { time: '10:00 PM', event: 'Winner Announcements', location: 'Main Stage' },
      { time: '11:00 PM', event: 'Closing Ceremony & After Party', location: 'Rooftop Lounge' },
    ],
    gallery: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800', caption: 'Main Stage' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', caption: 'Red Carpet' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', caption: 'Audience' },
      { type: 'video', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800', caption: 'Highlight Reel' },
    ],
    sponsors: [
      { name: 'Coca-Cola', tier: 'Platinum' },
      { name: 'MTN', tier: 'Gold' },
      { name: 'Pepsi', tier: 'Gold' },
      { name: 'DStv', tier: 'Silver' },
    ],
    faq: [
      { question: 'How do I register to attend?', answer: 'Registration opens on our official website. Limited VIP seats are available.' },
      { question: 'Can I vote online?', answer: 'Yes! Public voting is open on Awardly. Vote once per category per day.' },
      { question: 'Is there a dress code?', answer: 'The ceremony follows a Black Tie dress code. Formal attire is required.' },
    ],
    relatedEvents: [
      { id: 'evt2', title: 'Headies Next Rated 2026', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400', date: '2026-10-15' },
      { id: 'evt3', title: 'Global Music Festival', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=400', date: '2026-12-20' },
    ],
    broadcast: {
      youtubeVideoId: 'dQw4w9WgXcQ',
      status: 'live',
      startedAt: '2026-07-22T18:00:00Z',
      viewerCount: 12483,
      duration: '2h 14m',
      description: 'Live from Lagos, Nigeria — The 17th Headies celebrating the best in African music.',
      relatedVideos: [
        { title: 'Opening Ceremony', youtubeVideoId: 'dQw4w9WgXcQ', duration: '24:10', status: 'Upcoming' },
        { title: 'Red Carpet Highlights', youtubeVideoId: 'dQw4w9WgXcQ', duration: '18:35', status: 'Upcoming' },
        { title: 'Best New Artist', youtubeVideoId: 'dQw4w9WgXcQ', duration: '12:22', status: 'Upcoming' },
        { title: 'Closing Ceremony', youtubeVideoId: 'dQw4w9WgXcQ', duration: '31:45', status: 'Upcoming' },
        { title: 'Winner Highlights', youtubeVideoId: 'dQw4w9WgXcQ', duration: '15:20', status: 'Upcoming' },
      ],
    },
    liveActivity: { votesToday: 2341, trendingNominees: ['Burna Boy', 'Wizkid', 'Asake'], recentVotes: 45, remainingTime: '42d 8h' },
  },
  evt2: {
    id: 'evt2',
    title: 'Headies Next Rated 2026',
    org: 'Headies Official',
    orgId: 'headies',
    status: 'Upcoming',
    description: 'A special spotlight on the breakout stars of the year. Who will take home the gold?',
    purpose: 'To discover and celebrate the most promising emerging talents in African music.',
    eligibility: 'Open to artists who released their debut project within the last 24 months.',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=200',
    dates: {
      nominationsOpen: '2026-07-01',
      nominationsClose: '2026-08-31',
      votingBegins: '2026-09-15',
      votingEnds: '2026-10-10',
      judging: '2026-10-12',
      finalists: '2026-10-13',
      winnersAnnounced: '2026-10-15',
      ceremony: '2026-10-15',
    },
    venue: 'Federal Palace Hotel',
    city: 'Lagos',
    country: 'Nigeria',
    mapUrl: 'https://maps.google.com/?q=Federal+Palace+Hotel+Lagos',
    ceremonyTime: '7:00 PM WAT',
    stats: { categories: 8, nominees: 32, votes: 0, countries: 12, attendees: 2000 },
    categories: [
      { id: 'nc1', name: 'Best New Artist', nomineesCount: 8, status: 'Nominations' },
      { id: 'nc2', name: 'Breakthrough Act', nomineesCount: 6, status: 'Nominations' },
    ],
    nominees: [],
    judges: [],
    schedule: [
      { time: '6:00 PM', event: 'Red Carpet', location: 'Main Lobby' },
      { time: '7:00 PM', event: 'Opening Performance', location: 'Main Stage' },
      { time: '8:00 PM', event: 'Category Presentations', location: 'Main Stage' },
    ],
    gallery: [],
    sponsors: [{ name: 'Coca-Cola', tier: 'Platinum' }],
    faq: [{ question: 'When do nominations open?', answer: 'Nominations open on July 1, 2026.' }],
    relatedEvents: [{ id: 'evt1', title: 'The 17th Headies 2026', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400', date: '2026-09-04' }],
    broadcast: {
      status: 'upcoming',
      scheduledAt: '2026-10-15T19:00:00Z',
      viewerCount: 0,
      description: 'The Headies Next Rated spotlight — live from the Federal Palace Hotel.',
      relatedVideos: [],
    },
    liveActivity: { votesToday: 0, trendingNominees: [], recentVotes: 0, remainingTime: '68d' },
  },
  evt3: {
    id: 'evt3',
    title: 'Global Music Festival',
    org: 'Headies Official',
    orgId: 'headies',
    status: 'Upcoming',
    description: 'The ultimate celebration of sounds from the continent. 3 Days of pure magic.',
    purpose: 'To showcase the diversity and richness of African music through live performances, workshops, and celebrations.',
    eligibility: 'Open to the public. Registration required for attendance.',
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=200',
    dates: {
      nominationsOpen: '2026-09-01',
      nominationsClose: '2026-11-01',
      votingBegins: '2026-11-15',
      votingEnds: '2026-12-10',
      judging: '2026-12-12',
      finalists: '2026-12-14',
      winnersAnnounced: '2026-12-20',
      ceremony: '2026-12-20',
    },
    venue: 'Eko Atlantic City',
    city: 'Lagos',
    country: 'Nigeria',
    mapUrl: 'https://maps.google.com/?q=Eko+Atlantic+City+Lagos',
    ceremonyTime: '2:00 PM WAT',
    stats: { categories: 6, nominees: 24, votes: 0, countries: 25, attendees: 15000 },
    categories: [
      { id: 'mf1', name: 'Best Live Performance', nomineesCount: 8, status: 'Upcoming' },
      { id: 'mf2', name: 'Best Festival Act', nomineesCount: 8, status: 'Upcoming' },
    ],
    nominees: [],
    judges: [],
    schedule: [
      { time: '2:00 PM', event: 'Gates Open', location: 'Main Entrance' },
      { time: '3:00 PM', event: 'Opening Act', location: 'Main Stage' },
      { time: '5:00 PM', event: 'Headliner Performance', location: 'Main Stage' },
    ],
    gallery: [],
    sponsors: [{ name: 'MTN', tier: 'Platinum' }],
    faq: [{ question: 'How many days is the festival?', answer: 'The festival runs for 3 days from December 18-20, 2026.' }],
    relatedEvents: [{ id: 'evt1', title: 'The 17th Headies 2026', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400', date: '2026-09-04' }],
    broadcast: {
      status: 'none',
      viewerCount: 0,
      description: 'The broadcast will be available closer to the event date.',
      relatedVideos: [],
    },
    liveActivity: { votesToday: 0, trendingNominees: [], recentVotes: 0, remainingTime: '150d' },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function getStatusColor(s: EventStatus) {
  switch (s) {
    case 'Voting Live': case 'Live': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    case 'Nominations Open': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    case 'Upcoming': return 'bg-gold-500/10 border-gold-500/20 text-gold-500';
    case 'Winners Announced': return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
    case 'Judging': return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
    default: return 'bg-dark-800 border-white/10 text-dark-400';
  }
}

function getStatusIcon(s: EventStatus) {
  switch (s) {
    case 'Voting Live': case 'Live': return <Radio className="h-3 w-3" />;
    case 'Nominations Open': return <Target className="h-3 w-3" />;
    case 'Upcoming': return <Clock className="h-3 w-3" />;
    case 'Winners Announced': return <CheckCircle2 className="h-3 w-3" />;
    case 'Judging': return <Star className="h-3 w-3" />;
    default: return <Calendar className="h-3 w-3" />;
  }
}

function getCTA(s: EventStatus) {
  switch (s) {
    case 'Nominations Open': return { label: 'Submit Nomination', icon: Target };
    case 'Voting Live': case 'Live': return { label: 'Vote Now', icon: Vote };
    case 'Upcoming': return { label: 'Register', icon: Users };
    case 'Winners Announced': return { label: 'View Winners', icon: Trophy };
    case 'Judging': return { label: 'Stay Updated', icon: Clock };
    default: return { label: 'Learn More', icon: ExternalLink };
  }
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Sub-components ────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
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

function LightboxModal({ url, caption, onClose }: { url: string; caption: string; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X className="h-5 w-5 text-white" /></button>
      <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <img src={url} alt={caption} className="w-full rounded-2xl" referrerPolicy="no-referrer" />
        <p className="text-center text-sm text-dark-400 mt-4">{caption}</p>
      </div>
    </motion.div>
  );
}

// ─── Tab Sections ──────────────────────────────────────────────────────────
function OverviewSection({ event }: { event: EventData }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-serif text-white italic mb-3">About This Event</h3>
        <p className="text-dark-300 text-sm leading-relaxed">{event.description}</p>
      </div>
      {event.theme && (
        <div className="bg-gold-500/5 border border-gold-500/10 rounded-xl p-5">
          <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-1">Theme</p>
          <p className="text-white text-sm font-medium">{event.theme}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-dark-600 uppercase tracking-widest mb-1">Purpose</p>
          <p className="text-dark-400 text-sm leading-relaxed">{event.purpose}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-dark-600 uppercase tracking-widest mb-1">Eligibility</p>
          <p className="text-dark-400 text-sm leading-relaxed">{event.eligibility}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Categories', value: event.stats.categories, icon: Award },
          { label: 'Nominees', value: event.stats.nominees, icon: Users },
          { label: 'Countries', value: event.stats.countries, icon: Globe },
          { label: 'Total Votes', value: formatNumber(event.stats.votes), icon: Vote },
          { label: 'Expected', value: event.stats.attendees.toLocaleString(), icon: TrendingUp },
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

function TimelineSection({ event }: { event: EventData }) {
  const steps = [
    { label: 'Nominations Open', date: event.dates.nominationsOpen, done: true },
    { label: 'Nominations Close', date: event.dates.nominationsClose, done: true },
    { label: 'Voting Begins', date: event.dates.votingBegins, done: event.status !== 'Nominations Open' && event.status !== 'Upcoming' },
    { label: 'Voting Ends', date: event.dates.votingEnds, done: event.status === 'Judging' || event.status === 'Winners Announced' },
    { label: 'Judging', date: event.dates.judging, done: event.status === 'Winners Announced' },
    { label: 'Finalists Announced', date: event.dates.finalists, done: event.status === 'Winners Announced' },
    { label: 'Winners Announced', date: event.dates.winnersAnnounced, done: event.status === 'Winners Announced' },
    { label: 'Award Ceremony', date: event.dates.ceremony, done: event.status === 'Winners Announced' },
  ];
  const active = steps.findIndex(s => !s.done);
  const activeStep = active === -1 ? steps.length - 1 : active;
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
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-gold-500 border-gold-500' : isDone ? 'bg-gold-500/20 border-gold-500/40' : 'bg-dark-900 border-white/10'}`}>
                  {isDone ? <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-dark-950' : 'text-gold-500'}`} /> : <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-dark-950' : 'bg-dark-600'}`} />}
                </div>
              </div>
              <div className={`flex-1 pb-5 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
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

function CategoriesSection({ event }: { event: EventData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {event.categories.map((cat, i) => (
        <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group cursor-pointer">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{cat.name}</h4>
              <p className="text-[10px] text-dark-500 mt-0.5">{cat.nomineesCount} nominees</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${cat.status === 'Voting' ? 'text-emerald-500 bg-emerald-500/10' : cat.status === 'Nominations' ? 'text-blue-500 bg-blue-500/10' : 'text-gold-500 bg-gold-500/10'}`}>{cat.status}</span>
              <ArrowRight className="h-4 w-4 text-dark-600 group-hover:text-gold-500 transition-colors" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NomineesSection({ event }: { event: EventData }) {
  const [voted, setVoted] = React.useState<Set<number>>(new Set());
  const toggle = (i: number) => setVoted(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  if (event.nominees.length === 0) return <Card className="p-12 text-center border-dashed border-white/10"><Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" /><h3 className="text-xl text-white font-serif mb-2">No Nominees Yet</h3><p className="text-dark-500 text-sm">Nominees will appear once nominations open.</p></Card>;
  return (
    <div>
      {event.status === 'Voting Live' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
          <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Voting is Live</span>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {event.nominees.map((nom, i) => (
          <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group p-0">
            <div className="aspect-square relative overflow-hidden">
              <img src={nom.photo} alt={nom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent" />
              {nom.votes !== undefined && (
                <div className="absolute top-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/10">
                  <Vote className="h-2.5 w-2.5 text-emerald-500" /><span className="text-[9px] font-bold text-white">{formatNumber(nom.votes)}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-medium text-white truncate">{nom.name}</p>
                <p className="text-[9px] text-dark-400 uppercase tracking-widest">{nom.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Globe className="h-2.5 w-2.5 text-dark-500" /><span className="text-[9px] text-dark-500">{nom.country}</span>
                </div>
              </div>
            </div>
            {event.status === 'Voting Live' && (
              <div className="p-2 border-t border-white/5">
                <button onClick={() => toggle(i)} className={`w-full h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${voted.has(i) ? 'bg-emerald-500 text-dark-950' : 'bg-white/5 text-dark-400 hover:bg-emerald-500/10 hover:text-emerald-500 border border-white/10 hover:border-emerald-500/30'}`}>
                  {voted.has(i) ? <><CheckCircle2 className="h-3 w-3" /> Voted</> : <><Vote className="h-3 w-3" /> Vote</>}
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function VotingSection({ event }: { event: EventData }) {
  if (event.status !== 'Voting Live' && event.status !== 'Live') return <Card className="p-12 text-center border-dashed border-white/10"><Vote className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" /><h3 className="text-xl text-white font-serif mb-2">Voting Not Active</h3><p className="text-dark-500 text-sm">Voting will open when the event reaches the voting stage.</p></Card>;
  const topNominees = [...event.nominees].sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Votes', value: formatNumber(event.stats.votes), icon: Vote, color: 'text-emerald-500' },
          { label: 'Votes Today', value: formatNumber(event.liveActivity.votesToday), icon: Zap, color: 'text-gold-500' },
          { label: 'Recent Activity', value: `${event.liveActivity.recentVotes} votes/hr`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Time Left', value: event.liveActivity.remainingTime, icon: Clock, color: 'text-purple-500' },
        ].map((s, i) => (
          <Card key={i} className="border-white/5 text-center">
            <CardContent className="p-4">
              <s.icon className={`h-4 w-4 ${s.color} mx-auto mb-1.5`} />
              <p className="text-lg font-serif text-white italic">{s.value}</p>
              <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {topNominees.length > 0 && (
        <div>
          <h3 className="text-lg font-serif text-white italic mb-4">Trending Nominees</h3>
          <div className="space-y-2">
            {topNominees.map((nom, i) => (
              <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <span className="text-lg font-serif text-gold-500 w-6 text-center">{i + 1}</span>
                  <img src={nom.photo} alt={nom.name} className="h-10 w-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{nom.name}</p>
                    <p className="text-[10px] text-dark-500">{nom.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-serif text-emerald-500 italic">{formatNumber(nom.votes || 0)}</p>
                    <p className="text-[8px] text-dark-600 uppercase tracking-widest">votes</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleSection({ event }: { event: EventData }) {
  return (
    <div className="space-y-2">
      {event.schedule.map((item, i) => (
        <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-20 shrink-0 text-center">
              <p className="text-sm font-serif text-gold-500 italic font-bold">{item.time}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{item.event}</p>
              {item.location && <p className="text-[10px] text-dark-500 mt-0.5 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {item.location}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function JudgesSection({ event }: { event: EventData }) {
  if (event.judges.length === 0) return <p className="text-dark-500 text-sm text-center py-8">Judges to be announced.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {event.judges.map((j, i) => (
        <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <img src={j.photo} alt={j.name} className="h-14 w-14 rounded-full object-cover border-2 border-gold-500/20" referrerPolicy="no-referrer" />
              <div><p className="text-sm font-medium text-white">{j.name}</p><p className="text-[10px] text-gold-500">{j.position}</p></div>
            </div>
            <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-2">{j.organization}</p>
            <p className="text-[11px] text-dark-400 leading-relaxed">{j.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GallerySection({ event, onImageClick }: { event: EventData; onImageClick: (u: string, c: string) => void }) {
  if (event.gallery.length === 0) return <p className="text-dark-500 text-sm text-center py-8">No media available yet.</p>;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {event.gallery.map((m, i) => (
        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5" onClick={() => onImageClick(m.url, m.caption)}>
          <img src={m.url} alt={m.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center">
            {m.type === 'video' ? <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" /> : <ImageIcon className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950/80 to-transparent p-3"><p className="text-[10px] text-dark-300 truncate">{m.caption}</p></div>
        </div>
      ))}
    </div>
  );
}

function SponsorsSection({ event }: { event: EventData }) {
  if (event.sponsors.length === 0) return <p className="text-dark-500 text-sm text-center py-8">Sponsors to be announced.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {event.sponsors.map((s, i) => (
        <Card key={i} className="border-white/5 text-center hover:border-gold-500/20 transition-all">
          <CardContent className="p-5">
            <p className="text-base font-serif text-white italic mb-1">{s.name}</p>
            <p className="text-[9px] font-bold text-gold-500 uppercase tracking-widest">{s.tier}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FAQSection({ event }: { event: EventData }) {
  if (event.faq.length === 0) return <p className="text-dark-500 text-sm text-center py-8">No FAQs yet.</p>;
  return (
    <Card className="border-white/5"><CardContent className="p-5 sm:p-6">{event.faq.map((f, i) => <FAQItem key={i} question={f.question} answer={f.answer} />)}</CardContent></Card>
  );
}

function RelatedEventsSection({ event }: { event: EventData }) {
  if (event.relatedEvents.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {event.relatedEvents.map((re, i) => (
        <Link key={i} to={`/events/${re.id}`}>
          <Card className="border-white/5 hover:border-gold-500/20 transition-all group p-0">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img src={re.image} alt={re.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3"><p className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{re.title}</p><p className="text-[10px] text-dark-400">{formatDate(re.date)}</p></div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function getBroadcastStatusInfo(status: 'live' | 'upcoming' | 'replay' | 'none', scheduledAt?: string) {
  switch (status) {
    case 'live':
      return { label: 'LIVE NOW', color: 'bg-red-500', textColor: 'text-red-500', ringColor: 'border-red-500/20', bg: 'bg-red-500/10', pulse: true };
    case 'upcoming': {
      const diff = scheduledAt ? Math.max(0, Math.ceil((new Date(scheduledAt).getTime() - Date.now()) / 86400000)) : null;
      return { label: diff ? `Starts in ${diff} Day${diff === 1 ? '' : 's'}` : 'Coming Soon', color: 'bg-gold-500', textColor: 'text-gold-500', ringColor: 'border-gold-500/20', bg: 'bg-gold-500/10', pulse: false };
    }
    case 'replay':
      return { label: 'Replay Available', color: 'bg-purple-500', textColor: 'text-purple-500', ringColor: 'border-purple-500/20', bg: 'bg-purple-500/10', pulse: false };
    default:
      return { label: 'Not Available', color: 'bg-dark-600', textColor: 'text-dark-500', ringColor: 'border-white/10', bg: 'bg-white/5', pulse: false };
  }
}

function RelatedVideoCard({ video, onClick }: { video: { title: string; youtubeVideoId: string; duration: string; status: string }; onClick: () => void }) {
  return (
    <button onClick={onClick} className="shrink-0 w-64 sm:w-72 group">
      <div className="aspect-video rounded-xl overflow-hidden relative bg-dark-800 border border-white/5 group-hover:border-gold-500/30 transition-all">
        <img
          src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
            <Play className="h-4 w-4 text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950/90 to-transparent p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-dark-300 bg-dark-950/80 backdrop-blur-sm rounded px-1.5 py-0.5">{video.duration}</span>
            {video.status === 'Live' && <span className="text-[8px] font-bold text-red-500 bg-red-500/10 rounded px-1.5 py-0.5 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE</span>}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-dark-300 mt-2 truncate group-hover:text-gold-500 transition-colors font-medium">{video.title}</p>
    </button>
  );
}

function BroadcastSection({ event, onFullscreen }: { event: EventData; onFullscreen: () => void }) {
  const bc = event.broadcast;
  if (!bc) return <Card className="p-12 text-center border-dashed border-white/10"><Radio className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" /><h3 className="text-xl text-white font-serif mb-2">No Broadcast</h3><p className="text-dark-500 text-sm">Broadcast details will appear here when available.</p></Card>;

  const statusInfo = getBroadcastStatusInfo(bc.status, bc.scheduledAt);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const scrollRelated = useCallback((dir: 'left' | 'right') => {
    if (relatedScrollRef.current) {
      relatedScrollRef.current.scrollBy({ left: dir === 'left' ? -290 : 290, behavior: 'smooth' });
    }
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const addToCalendar = () => {
    const date = bc.scheduledAt ? new Date(bc.scheduledAt) : new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const icsDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${icsDate}\nSUMMARY:${event.title} - Live Broadcast\nDESCRIPTION:${bc.description}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '-')}-broadcast.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Main Player */}
      <div id="broadcast-player" className="space-y-4">
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-dark-900" style={{ aspectRatio: '16/9' }}>
          {bc.youtubeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${bc.youtubeVideoId}?rel=0&modestbranding=1&playsinline=1`}
              title={`${event.title} Live Broadcast`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Radio className="h-8 w-8 text-dark-600" />
              </div>
              <h3 className="text-lg font-serif text-white italic mb-2">Broadcast Coming Soon</h3>
              <p className="text-dark-500 text-sm max-w-sm">The live stream for this event is not available yet. Please check back closer to the event date.</p>
              {bc.scheduledAt && (
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gold-500 uppercase tracking-widest">
                  <Timer className="h-3.5 w-3.5" />
                  <span>Starts {formatDate(bc.scheduledAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusInfo.bg} ${statusInfo.textColor} ${statusInfo.ringColor}`}>
            {statusInfo.pulse && <span className="relative flex h-2 w-2"><span className={`absolute inline-flex h-full w-full rounded-full ${statusInfo.color} opacity-75 animate-ping`} /><span className={`relative inline-flex h-2 w-2 rounded-full ${statusInfo.color}`} /></span>}
            {!statusInfo.pulse && bc.status === 'replay' && <CheckCircle2 className="h-3 w-3" />}
            {!statusInfo.pulse && bc.status === 'upcoming' && <Clock className="h-3 w-3" />}
            {statusInfo.label}
          </span>
          {bc.duration && <span className="text-[10px] text-dark-500 font-medium">{bc.duration}</span>}
        </div>

        {/* Event Info */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif text-white italic">{event.title}</h2>
          <p className="text-sm text-dark-400">{bc.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-dark-500">
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-gold-500" /> {event.city}, {event.country}</span>
            {bc.startedAt && <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-gold-500" /> Started {Math.max(0, Math.floor((Date.now() - new Date(bc.startedAt).getTime()) / 60000))} minutes ago</span>}
            {bc.scheduledAt && bc.status === 'upcoming' && <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-gold-500" /> {formatDate(bc.scheduledAt)}</span>}
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-gold-500" /> {bc.viewerCount.toLocaleString()} Watching</span>
            {bc.status === 'live' && <span className="flex items-center gap-1.5"><Radio className="h-3 w-3 text-red-500 animate-pulse" /> Stream Active</span>}
          </div>
        </div>

        {/* Broadcast Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <Button variant="ghost" className="h-9 px-3 text-[10px] font-bold uppercase tracking-widest" onClick={() => { navigator.share ? navigator.share({ title: event.title, url: window.location.href }) : copyLink(); }}>
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
          </Button>
          <Button variant="ghost" className="h-9 px-3 text-[10px] font-bold uppercase tracking-widest" onClick={copyLink}>
            {copiedLink ? <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> Copied!</> : <><Link2 className="h-3.5 w-3.5 mr-1.5" /> Copy Link</>}
          </Button>
          {bc.youtubeVideoId && (
            <Button variant="ghost" className="h-9 px-3 text-[10px] font-bold uppercase tracking-widest" onClick={onFullscreen}>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Watch Full Screen
            </Button>
          )}
          <Button variant="ghost" className="h-9 px-3 text-[10px] font-bold uppercase tracking-widest" onClick={addToCalendar}>
            <CalendarPlus className="h-3.5 w-3.5 mr-1.5" /> Add to Calendar
          </Button>
          <Button variant="ghost" className="h-9 px-3 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-400 hover:bg-red-500/10">
            <Flag className="h-3.5 w-3.5 mr-1.5" /> Report Stream
          </Button>
        </div>
      </div>

      {/* Related Videos Carousel */}
      {bc.relatedVideos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif text-white italic">Related Broadcasts</h3>
            <div className="flex gap-1.5">
              <button onClick={() => scrollRelated('left')} className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronLeft className="h-4 w-4 text-dark-400" /></button>
              <button onClick={() => scrollRelated('right')} className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight className="h-4 w-4 text-dark-400" /></button>
            </div>
          </div>
          <div ref={relatedScrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {bc.relatedVideos.map((v, i) => (
              <RelatedVideoCard key={i} video={v} onClick={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FloatingMiniPlayer({ event, visible, onClose }: { event: EventData; visible: boolean; onClose: () => void }) {
  const bc = event.broadcast;
  if (!bc || !bc.youtubeVideoId || !visible) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 w-80 sm:w-96"
        >
          <Card className="border-white/10 bg-dark-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${bc.youtubeVideoId}?rel=0&modestbranding=1&playsinline=1&controls=1`}
                title={`${event.title} Mini Player`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
              <button
                onClick={onClose}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-dark-950/80 backdrop-blur-sm flex items-center justify-center hover:bg-dark-950 transition-colors border border-white/10"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="px-3 py-2.5 border-t border-white/5">
              <p className="text-[11px] text-white font-medium truncate">{event.title}</p>
              <p className="text-[9px] text-dark-500 mt-0.5">{bc.viewerCount.toLocaleString()} watching</p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
const tabs = ['Overview', 'Timeline', 'Categories', 'Nominees', 'Voting', 'Broadcast', 'Schedule', 'Judges', 'Gallery', 'Sponsors', 'FAQ'] as const;
type Tab = typeof tabs[number];

export function EventHub() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventsData[eventId || ''];
  const [activeTab, setActiveTab] = React.useState<Tab>('Overview');
  const [lightbox, setLightbox] = React.useState<{ url: string; caption: string } | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = React.useState(false);

  useEffect(() => {
    if (!event.broadcast?.youtubeVideoId || activeTab !== 'Broadcast') {
      setShowMiniPlayer(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniPlayer(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    const el = document.getElementById('broadcast-player');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [event.broadcast?.youtubeVideoId, activeTab]);

  if (!event) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5"><Trophy className="h-10 w-10 text-dark-600" /></div>
          <h1 className="text-3xl font-serif text-white italic mb-3">Event Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">This event doesn't exist or hasn't been published yet.</p>
          <Link to="/schedule"><Button variant="primary">Browse Events</Button></Link>
        </div>
      </div>
    );
  }

  const cta = getCTA(event.status);
  const ctaIcon = cta.icon;

  const renderTab = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewSection event={event} />;
      case 'Timeline': return <TimelineSection event={event} />;
      case 'Categories': return <CategoriesSection event={event} />;
      case 'Nominees': return <NomineesSection event={event} />;
      case 'Voting': return <VotingSection event={event} />;
      case 'Broadcast': return <BroadcastSection event={event} onFullscreen={() => { if (event.broadcast?.youtubeVideoId) window.open(`https://www.youtube.com/watch?v=${event.broadcast.youtubeVideoId}`, '_blank'); }} />;
      case 'Schedule': return <ScheduleSection event={event} />;
      case 'Judges': return <JudgesSection event={event} />;
      case 'Gallery': return <GallerySection event={event} onImageClick={(u, c) => setLightbox({ url: u, caption: c })} />;
      case 'Sponsors': return <SponsorsSection event={event} />;
      case 'FAQ': return <FAQSection event={event} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />
      {lightbox && <LightboxModal url={lightbox.url} caption={lightbox.caption} onClose={() => setLightbox(null)} />}

      {/* Hero */}
      <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        <img src={event.banner} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(event.status)}`}>{getStatusIcon(event.status)} {event.status}</span>
                <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">{event.org}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white italic leading-[1] tracking-tighter">{event.title}</h1>
              <p className="text-dark-300 text-sm sm:text-base max-w-xl">{event.description}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button variant="primary" className="h-11 px-6 text-[11px] font-bold uppercase tracking-widest">
                  <ctaIcon className="h-4 w-4 mr-2" />{cta.label}
                </Button>
                <Link to={`/org/${event.orgId}`}>
                  <Button variant="glass" className="h-11 px-5 text-[11px] font-bold uppercase tracking-widest">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Visit Org
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live Activity Bar */}
      {(event.status === 'Voting Live' || event.status === 'Live') && (
        <div className="border-b border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-4 sm:gap-6 py-3 overflow-x-auto no-scrollbar">
              {[
                { icon: Vote, label: `${formatNumber(event.liveActivity.votesToday)} votes today`, color: 'text-emerald-500' },
                { icon: TrendingUp, label: `${event.liveActivity.recentVotes} votes/hr`, color: 'text-gold-500' },
                { icon: Clock, label: `${event.liveActivity.remainingTime} remaining`, color: 'text-purple-500' },
                { icon: Users, label: `Trending: ${event.liveActivity.trendingNominees.slice(0, 3).join(', ')}`, color: 'text-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 shrink-0">
                  <item.icon className={`h-3 w-3 ${item.color}`} />
                  <span className="text-[10px] text-dark-400 font-medium whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-dark-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
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
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(event.status)}`}>{getStatusIcon(event.status)} {event.status}</span>
                  </div>
                  <Button variant="primary" className="w-full h-12 text-sm font-bold uppercase tracking-widest">
                    <ctaIcon className="h-4 w-4 mr-2" />{cta.label}
                  </Button>
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Event Info</p>
                    <div className="flex items-center gap-2 text-[11px] text-dark-300"><MapPin className="h-3.5 w-3.5 text-gold-500 shrink-0" />{event.venue}, {event.city}</div>
                    <div className="flex items-center gap-2 text-[11px] text-dark-300"><Calendar className="h-3.5 w-3.5 text-gold-500 shrink-0" />{formatDate(event.dates.ceremony)}</div>
                    <div className="flex items-center gap-2 text-[11px] text-dark-300"><Clock className="h-3.5 w-3.5 text-gold-500 shrink-0" />{event.ceremonyTime}</div>
                    {event.dressCode && <div className="flex items-center gap-2 text-[11px] text-dark-300"><Award className="h-3.5 w-3.5 text-gold-500 shrink-0" />{event.dressCode}</div>}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button variant="ghost" className="flex-1 h-10 text-[10px] font-bold uppercase tracking-widest"><Bookmark className="h-3.5 w-3.5 mr-1.5" /> Save</Button>
                    <Button variant="ghost" className="flex-1 h-10 text-[10px] font-bold uppercase tracking-widest" onClick={() => { navigator.share ? navigator.share({ title: event.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href); }}><Share2 className="h-3.5 w-3.5 mr-1.5" /> Share</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/5">
                <CardContent className="p-5 space-y-3">
                  <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Quick Facts</p>
                  {[
                    { icon: Award, label: 'Categories', value: event.stats.categories },
                    { icon: Users, label: 'Nominees', value: event.stats.nominees },
                    { icon: Globe, label: 'Countries', value: event.stats.countries },
                    { icon: Vote, label: 'Total Votes', value: formatNumber(event.stats.votes) },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-2 text-dark-400"><s.icon className="h-3.5 w-3.5 text-gold-500" />{s.label}</span>
                      <span className="font-medium text-white">{s.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Events */}
      {event.relatedEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12">
          <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Related Events</h2>
          <RelatedEventsSection event={event} />
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-xs"><p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">The world's leading platform for award management, secure voting, and community recognition.</p></div>
          <div className="flex gap-6">
            <Link to="/discover" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Explore</Link>
            <Link to="/schedule" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Schedule</Link>
            <Link to={`/org/${event.orgId}`} className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Organization</Link>
          </div>
        </div>
      </footer>

      {/* Floating Mini Player */}
      <FloatingMiniPlayer
        event={event}
        visible={showMiniPlayer}
        onClose={() => setShowMiniPlayer(false)}
      />
    </div>
  );
}
