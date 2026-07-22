import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PublicNav } from '../components/navigation/PublicNav';
import {
  Trophy, Calendar, Clock, MapPin, Users, Vote, Award, Target, CheckCircle2,
  ArrowRight, Share2, Bookmark, ExternalLink, ChevronDown, ChevronUp,
  Globe, Star, TrendingUp, Heart, Play, Image as ImageIcon, X
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────
type AwardStatus = 'Nominations Open' | 'Voting Live' | 'Judging' | 'Winners Announced' | 'Upcoming';

interface AwardData {
  id: string;
  name: string;
  org: string;
  category: string;
  status: AwardStatus;
  banner: string;
  logo: string;
  overview: string;
  history: string;
  mission: string;
  organizer: string;
  website?: string;
  dates: {
    nominationsOpen: string;
    nominationsClose: string;
    publicVoting: string;
    finalJudging: string;
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
    previousWinners: number;
  };
  categories: Array<{ id: string; name: string; description: string }>;
  judges: Array<{ name: string; photo: string; position: string; organization: string; bio: string }>;
  nominees: Array<{ name: string; category: string; photo: string; votes?: number }>;
  mediaGallery: Array<{ type: 'photo' | 'video'; url: string; caption: string }>;
  faq: Array<{ question: string; answer: string }>;
  relatedAwards: Array<{ id: string; name: string; image: string }>;
  liveActivity: {
    votesToday: number;
    nominationsToday: number;
    participantCountries: number;
    nominationsDeadline: string;
  };
}

const awardsData: Record<string, AwardData> = {
  headies: {
    id: 'headies',
    name: 'The 17th Headies',
    org: 'Headies Official',
    category: 'Entertainment',
    status: 'Voting Live',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=200',
    overview: 'The Headies (originally the Hip Hop World Awards) is a prestigious music awards show established in 2006 to recognize outstanding achievements in the Nigerian music industry. The 17th edition is a Global Edition featuring top talents across Africa and the diaspora.',
    history: 'Founded in 2006 by Ayo Animashaun, the Headies has grown from a niche music awards show into one of Africa\'s most recognized entertainment events. Over 16 editions, the awards have celebrated legends and launched careers, with past winners including Burna Boy, Wizkid, Davido, and Tiwa Savage.',
    mission: 'To celebrate and promote excellence in African music by providing a world-class platform that connects artists, fans, and the global entertainment industry.',
    organizer: 'Hip Hop World Foundation',
    website: 'https://theheadies.com',
    dates: {
      nominationsOpen: '2026-03-01',
      nominationsClose: '2026-05-31',
      publicVoting: '2026-06-01',
      finalJudging: '2026-08-15',
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
      previousWinners: 192,
    },
    categories: [
      { id: 'cat1', name: 'Artiste of the Year', description: 'Most critically and commercially adjudged artiste in the year under review.' },
      { id: 'cat2', name: 'Next Rated', description: 'Most promising upcoming act.' },
      { id: 'cat3', name: 'Best Male Vocalist', description: 'Most outstanding male vocal performance.' },
      { id: 'cat4', name: 'Album of the Year', description: 'Best full-length studio album.' },
      { id: 'cat5', name: 'Song of the Year', description: 'Most impactful single of the year.' },
      { id: 'cat6', name: 'Best Female Vocalist', description: 'Most outstanding female vocal performance.' },
      { id: 'cat7', name: 'Rap Album of the Year', description: 'Best rap project of the year.' },
      { id: 'cat8', name: 'Best Music Video', description: 'Most creative and well-produced music video.' },
    ],
    judges: [
      { name: 'Don Jazzy', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', position: 'Chairman', organization: 'Mavin Records', bio: 'Legendary Nigerian producer and music executive with over two decades of shaping African music.' },
      { name: 'Tiwa Savage', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', position: 'Judge', organization: 'Independent Artist', bio: 'Award-winning singer-songwriter known as the Queen of Afrobeats.' },
      { name: 'Olu Maintain', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', position: 'Judge', organization: 'Independent', bio: 'Pioneer of Nigerian pop culture and one of the most respected figures in the industry.' },
    ],
    nominees: [
      { name: 'Burna Boy', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1521112376370-0a3b01544af1?auto=format&fit=crop&q=80&w=200', votes: 61000 },
      { name: 'Wizkid', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', votes: 58900 },
      { name: 'Asake', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 52140 },
      { name: 'Adekunle Gold', category: 'Artiste of the Year', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', votes: 45210 },
      { name: 'Ayra Starr', category: 'Next Rated', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', votes: 34200 },
      { name: 'Rema', category: 'Next Rated', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', votes: 41000 },
    ],
    mediaGallery: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800', caption: 'Headies Main Stage 2025' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', caption: 'Red Carpet Highlights' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', caption: 'Audience at the 16th Headies' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800', caption: 'Previous Winner Celebration' },
    ],
    faq: [
      { question: 'How do I nominate?', answer: 'Nominations are submitted through the official Headies portal during the nomination window. Artists, labels, and fans can submit entries for consideration by the screening committee.' },
      { question: 'Can anyone vote?', answer: 'Yes! Public voting is open to everyone with a valid email address. You can vote once per category per day during the voting period.' },
      { question: 'Is voting free?', answer: 'Yes, public voting on Awardly is completely free. Premium voting packages with additional features are available but not required.' },
      { question: 'How are winners selected?', answer: 'Winners are determined through a combination of public voting (40%) and academy voting (60%). The final judging panel reviews all nominees before the ceremony.' },
      { question: 'Can organizations sponsor the awards?', answer: 'Yes, sponsorship packages are available. Visit our partnerships page or contact our team for more information about brand integration opportunities.' },
    ],
    relatedAwards: [
      { id: 'oscars', name: 'Cinema Excellence Awards', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400' },
      { id: 'banking', name: 'Global Banking Awards', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=400' },
      { id: 'fintech', name: 'Fintech Innovation Awards', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400' },
    ],
    liveActivity: {
      votesToday: 2341,
      nominationsToday: 56,
      participantCountries: 18,
      nominationsDeadline: '8 days',
    },
  },
  oscars: {
    id: 'oscars',
    name: 'Cinema Excellence Awards',
    org: 'Academy of Cinema',
    category: 'Entertainment',
    status: 'Nominations Open',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=200',
    overview: 'The Cinema Excellence Awards celebrate the finest achievements in filmmaking, from groundbreaking directing to exceptional performances. This annual event brings together the brightest minds in cinema.',
    history: 'Established in 1995, the Cinema Excellence Awards has become the gold standard for recognizing cinematic achievement worldwide.',
    mission: 'To honor the art of cinema and inspire the next generation of filmmakers through recognition of outstanding creative work.',
    organizer: 'Academy of Cinema Foundation',
    website: 'https://cinemaexcellence.org',
    dates: {
      nominationsOpen: '2026-04-01',
      nominationsClose: '2026-07-31',
      publicVoting: '2026-08-15',
      finalJudging: '2026-10-01',
      ceremony: '2026-11-15',
    },
    venue: 'Dolby Theatre',
    city: 'Los Angeles',
    country: 'United States',
    mapUrl: 'https://maps.google.com/?q=Dolby+Theatre+Los+Angeles',
    ceremonyTime: '7:00 PM PST',
    dressCode: 'Formal / Black Tie',
    stats: {
      categories: 18,
      nominees: 90,
      votes: 1560000,
      countries: 45,
      yearsRunning: 31,
      previousWinners: 342,
    },
    categories: [
      { id: 'c1', name: 'Best Picture', description: 'The most outstanding motion picture of the year.' },
      { id: 'c2', name: 'Best Director', description: 'Outstanding achievement in directing.' },
      { id: 'c3', name: 'Best Actor', description: 'Outstanding performance by a male actor.' },
      { id: 'c4', name: 'Best Actress', description: 'Outstanding performance by a female actor.' },
    ],
    judges: [
      { name: 'James Cameron', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', position: 'Head Judge', organization: 'Academy of Cinema', bio: 'Legendary filmmaker known for pushing the boundaries of visual storytelling.' },
    ],
    nominees: [
      { name: 'Dune: Part Three', category: 'Best Picture', photo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=200', votes: 28000 },
      { name: 'The Last Frontier', category: 'Best Picture', photo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=200', votes: 21000 },
    ],
    mediaGallery: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', caption: 'Dolby Theatre Stage' },
    ],
    faq: [
      { question: 'How do I nominate?', answer: 'Submit entries through our official portal during the open nomination period.' },
    ],
    relatedAwards: [
      { id: 'headies', name: 'The 17th Headies', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400' },
    ],
    liveActivity: {
      votesToday: 0,
      nominationsToday: 142,
      participantCountries: 45,
      nominationsDeadline: '42 days',
    },
  },
  banking: {
    id: 'banking',
    name: 'Global Banking Awards',
    org: 'Global Banking Association',
    category: 'Corporate',
    status: 'Upcoming',
    banner: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=200',
    overview: 'Recognizing the brightest minds and most innovative institutions in global banking. This award celebrates excellence in financial services, digital innovation, and customer experience.',
    history: 'The Global Banking Awards have been recognizing excellence in banking since 2010, growing to become one of the most respected accolades in the financial industry.',
    mission: 'To promote innovation and excellence in banking by celebrating institutions and individuals who push the boundaries of financial services.',
    organizer: 'Global Banking Association',
    dates: {
      nominationsOpen: '2026-06-01',
      nominationsClose: '2026-08-31',
      publicVoting: '2026-09-15',
      finalJudging: '2026-11-01',
      ceremony: '2026-12-10',
    },
    venue: 'Marina Bay Sands',
    city: 'Singapore',
    country: 'Singapore',
    mapUrl: 'https://maps.google.com/?q=Marina+Bay+Sands+Singapore',
    ceremonyTime: '7:00 PM SGT',
    stats: {
      categories: 12,
      nominees: 60,
      votes: 0,
      countries: 32,
      yearsRunning: 16,
      previousWinners: 96,
    },
    categories: [
      { id: 'b1', name: 'Digital Bank of the Year', description: 'Most innovative digital banking platform.' },
      { id: 'b2', name: 'Best Customer Experience', description: 'Outstanding customer service and satisfaction.' },
    ],
    judges: [],
    nominees: [],
    mediaGallery: [],
    faq: [
      { question: 'Who can enter?', answer: 'Any licensed banking or financial institution worldwide is eligible to submit entries.' },
    ],
    relatedAwards: [
      { id: 'fintech', name: 'Fintech Innovation Awards', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400' },
    ],
    liveActivity: {
      votesToday: 0,
      nominationsToday: 0,
      participantCountries: 0,
      nominationsDeadline: '40 days',
    },
  },
  fintech: {
    id: 'fintech',
    name: 'Fintech Innovation Awards',
    org: 'Tech Excellence Foundation',
    category: 'Tech',
    status: 'Voting Live',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200',
    overview: 'Celebrating the most innovative fintech solutions and startups reshaping the future of money, payments, and financial inclusion worldwide.',
    history: 'Founded in 2018, the Fintech Innovation Awards quickly became the premier recognition platform for financial technology breakthroughs.',
    mission: 'To accelerate financial innovation by recognizing and promoting the companies and individuals driving change in financial services.',
    organizer: 'Tech Excellence Foundation',
    dates: {
      nominationsOpen: '2026-02-01',
      nominationsClose: '2026-04-30',
      publicVoting: '2026-05-01',
      finalJudging: '2026-06-15',
      ceremony: '2026-07-20',
    },
    venue: 'Virtual Event',
    city: 'Online',
    country: 'Global',
    mapUrl: '',
    ceremonyTime: '2:00 PM GMT',
    stats: {
      categories: 8,
      nominees: 40,
      votes: 890000,
      countries: 52,
      yearsRunning: 8,
      previousWinners: 48,
    },
    categories: [
      { id: 'f1', name: 'Best Payment Solution', description: 'Most innovative payment technology.' },
      { id: 'f2', name: 'Best Neobank', description: 'Leading digital-first banking platform.' },
    ],
    judges: [],
    nominees: [],
    mediaGallery: [],
    faq: [],
    relatedAwards: [
      { id: 'banking', name: 'Global Banking Awards', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=400' },
    ],
    liveActivity: {
      votesToday: 1205,
      nominationsToday: 23,
      participantCountries: 52,
      nominationsDeadline: 'Completed',
    },
  },
  ngo: {
    id: 'ngo',
    name: 'Impact Global Recognition',
    org: 'United Nations Foundation',
    category: 'Non-Profit',
    status: 'Upcoming',
    banner: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=200',
    overview: 'Honoring the individuals, organizations, and governments making the most significant contributions to sustainable development and humanitarian causes worldwide.',
    history: 'Established in 2005 by the UN Foundation, this award has highlighted over 300 impactful initiatives across 120 countries.',
    mission: 'To inspire global action toward the Sustainable Development Goals by celebrating those who lead by example.',
    organizer: 'United Nations Foundation',
    dates: {
      nominationsOpen: '2026-07-01',
      nominationsClose: '2026-09-30',
      publicVoting: '2026-10-15',
      finalJudging: '2026-11-30',
      ceremony: '2026-12-15',
    },
    venue: 'Palais des Nations',
    city: 'Geneva',
    country: 'Switzerland',
    mapUrl: 'https://maps.google.com/?q=Palais+des+Nations+Geneva',
    ceremonyTime: '6:00 PM CET',
    stats: {
      categories: 15,
      nominees: 75,
      votes: 0,
      countries: 68,
      yearsRunning: 21,
      previousWinners: 210,
    },
    categories: [
      { id: 'n1', name: 'Humanitarian Impact', description: 'Outstanding contribution to humanitarian relief.' },
      { id: 'n2', name: 'Sustainability Champion', description: 'Most impactful sustainability initiative.' },
    ],
    judges: [],
    nominees: [],
    mediaGallery: [],
    faq: [],
    relatedAwards: [],
    liveActivity: {
      votesToday: 0,
      nominationsToday: 0,
      participantCountries: 0,
      nominationsDeadline: '30 days',
    },
  },
  govt: {
    id: 'govt',
    name: 'National Honors GH',
    org: 'Government of Ghana',
    category: 'Government',
    status: 'Winners Announced',
    banner: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=1600',
    logo: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=200',
    overview: 'Ghana\'s highest national award recognizing outstanding service to the nation in various fields including governance, education, health, and public service.',
    history: 'Instituted in 1960, the National Honors of Ghana is the country\'s most prestigious recognition of contribution to national development.',
    mission: 'To publicly recognize and reward individuals who have made exceptional contributions to the progress and development of Ghana.',
    organizer: 'Office of the President, Republic of Ghana',
    dates: {
      nominationsOpen: '2025-10-01',
      nominationsClose: '2025-12-31',
      publicVoting: '2026-01-15',
      finalJudging: '2026-02-28',
      ceremony: '2026-03-15',
    },
    venue: 'Accra International Conference Center',
    city: 'Accra',
    country: 'Ghana',
    mapUrl: 'https://maps.google.com/?q=Accra+International+Conference+Center',
    ceremonyTime: '10:00 AM GMT',
    dressCode: 'National Dress / Formal',
    stats: {
      categories: 10,
      nominees: 50,
      votes: 345000,
      countries: 1,
      yearsRunning: 66,
      previousWinners: 520,
    },
    categories: [
      { id: 'g1', name: 'Order of the Star', description: 'Highest honor for national service.' },
    ],
    judges: [],
    nominees: [],
    mediaGallery: [],
    faq: [],
    relatedAwards: [],
    liveActivity: {
      votesToday: 0,
      nominationsToday: 0,
      participantCountries: 0,
      nominationsDeadline: 'Completed',
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
    case 'Winners Announced': return { label: 'Watch Ceremony', icon: Play };
    case 'Judging': return { label: 'Stay Updated', icon: Bell };
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
  if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d`;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
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
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 sm:py-5 text-left group">
        <span className="text-sm sm:text-base text-white font-medium pr-4 group-hover:text-gold-500 transition-colors">{question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-dark-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-dark-500 shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="pb-4 sm:pb-5"
        >
          <p className="text-sm text-dark-400 leading-relaxed">{answer}</p>
        </motion.div>
      )}
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

// ─── Main Component ────────────────────────────────────────────────────────
export function AwardDetails() {
  const { awardId } = useParams<{ awardId: string }>();
  const award = awardsData[awardId || ''];
  const [lightbox, setLightbox] = React.useState<{ url: string; caption: string } | null>(null);

  if (!award) {
    return (
      <div className="min-h-screen bg-dark-950 font-sans">
        <PublicNav />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
            <Trophy className="h-10 w-10 text-dark-600" />
          </div>
          <h1 className="text-3xl font-serif text-white italic mb-3">Award Not Found</h1>
          <p className="text-dark-500 text-sm mb-6">The award you're looking for doesn't exist or has been removed.</p>
          <Link to="/schedule"><Button variant="primary">Back to Schedule</Button></Link>
        </div>
      </div>
    );
  }

  const cta = getCTA(award.status);
  const ctaIcon = cta.icon;
  const countdown = getTimeRemaining(award.dates.ceremony);
  const ceremonyDone = award.status === 'Winners Announced';

  const timelineSteps = [
    { label: 'Nominations Open', date: award.dates.nominationsOpen, done: true },
    { label: 'Nominations Close', date: award.dates.nominationsClose, done: true },
    { label: 'Public Voting', date: award.dates.publicVoting, done: ceremonyDone || award.status === 'Judging' || award.status === 'Voting Live' },
    { label: 'Final Judging', date: award.dates.finalJudging, done: ceremonyDone },
    { label: 'Winner Announcement', date: award.dates.ceremony, done: ceremonyDone },
    { label: 'Award Ceremony', date: award.dates.ceremony, done: ceremonyDone },
  ];

  // Find the current (next incomplete) step
  const currentStep = timelineSteps.findIndex(s => !s.done);
  const activeStep = currentStep === -1 ? timelineSteps.length - 1 : currentStep;

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />

      {lightbox && <LightboxModal url={lightbox.url} caption={lightbox.caption} onClose={() => setLightbox(null)} />}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
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
              <p className="text-dark-300 text-sm sm:text-base max-w-xl">by {award.org}</p>

              {/* Live Activity Bar */}
              {award.status === 'Voting Live' && (
                <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                  {[
                    { icon: Vote, text: `${formatNumber(award.liveActivity.votesToday)} voted today`, color: 'text-emerald-500' },
                    { icon: Award, text: `${award.liveActivity.nominationsToday} nominations today`, color: 'text-blue-500' },
                    { icon: Globe, text: `${award.liveActivity.participantCountries} countries`, color: 'text-purple-500' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/5">
                      <item.icon className={`h-3 w-3 ${item.color}`} />
                      <span className="text-[10px] text-dark-300 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {award.status === 'Nominations Open' && (
                <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                  {[
                    { icon: Clock, text: `Nominations close in ${award.liveActivity.nominationsDeadline}`, color: 'text-gold-500' },
                    { icon: Globe, text: `${award.liveActivity.participantCountries} countries participating`, color: 'text-purple-500' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/5">
                      <item.icon className={`h-3 w-3 ${item.color}`} />
                      <span className="text-[10px] text-dark-300 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left: Main Content */}
          <div className="flex-1 min-w-0 space-y-12 sm:space-y-16">

            {/* About */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-4">About the Award</h2>
              <div className="space-y-4">
                <p className="text-dark-300 text-sm sm:text-base leading-relaxed">{award.overview}</p>
                {award.history && <p className="text-dark-400 text-sm leading-relaxed">{award.history}</p>}
                {award.mission && (
                  <div className="bg-gold-500/5 border border-gold-500/10 rounded-xl p-4 sm:p-5">
                    <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-2">Mission</p>
                    <p className="text-dark-300 text-sm leading-relaxed">{award.mission}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-[11px] text-dark-500">
                  <span>Organized by <span className="text-dark-300">{award.organizer}</span></span>
                  {award.website && (
                    <a href={award.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold-500 hover:text-gold-400 transition-colors">
                      Official Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Timeline */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-0">
                  {timelineSteps.map((step, i) => {
                    const isActive = i === activeStep;
                    const isDone = step.done;
                    return (
                      <div key={i} className="relative flex gap-4 sm:gap-6">
                        <div className="relative z-10 shrink-0 mt-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                            isActive ? 'bg-gold-500 border-gold-500' :
                            isDone ? 'bg-gold-500/20 border-gold-500/40' :
                            'bg-dark-900 border-white/10'
                          }`}>
                            {isDone ? <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-dark-950' : 'text-gold-500'}`} /> :
                             <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-dark-950' : 'bg-dark-600'}`} />}
                          </div>
                        </div>
                        <div className={`flex-1 pb-6 ${i === timelineSteps.length - 1 ? 'pb-0' : ''}`}>
                          <p className={`text-sm font-medium ${isActive ? 'text-gold-500' : isDone ? 'text-dark-300' : 'text-dark-500'}`}>{step.label}</p>
                          <p className="text-[11px] text-dark-500 mt-0.5">{formatDate(step.date)}</p>
                          {isActive && <span className="inline-block mt-1 text-[9px] font-bold text-gold-500 uppercase tracking-widest">Current Stage</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>

            {/* Stats */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Award Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Categories', value: award.stats.categories, icon: Award },
                  { label: 'Nominees', value: award.stats.nominees, icon: Users },
                  { label: 'Total Votes', value: formatNumber(award.stats.votes), icon: Vote },
                  { label: 'Countries', value: award.stats.countries, icon: Globe },
                  { label: 'Years Running', value: award.stats.yearsRunning, icon: TrendingUp },
                  { label: 'Past Winners', value: award.stats.previousWinners, icon: Trophy },
                ].map((stat, i) => (
                  <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
                    <CardContent className="p-4 sm:p-5 text-center">
                      <stat.icon className="h-5 w-5 text-gold-500 mx-auto mb-2" />
                      <p className="text-xl sm:text-2xl font-serif text-white italic">{stat.value}</p>
                      <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Categories */}
            {award.categories.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {award.categories.map((cat, i) => (
                    <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group cursor-pointer">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{cat.name}</h4>
                            {cat.description && <p className="text-[11px] text-dark-500 mt-1 line-clamp-2">{cat.description}</p>}
                          </div>
                          <ArrowRight className="h-4 w-4 text-dark-600 group-hover:text-gold-500 shrink-0 mt-0.5 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Judges */}
            {award.judges.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Judges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {award.judges.map((judge, i) => (
                    <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={judge.photo} alt={judge.name} className="h-12 w-12 rounded-full object-cover border-2 border-gold-500/20" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-medium text-white">{judge.name}</p>
                            <p className="text-[10px] text-dark-500">{judge.position}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest mb-2">{judge.organization}</p>
                        <p className="text-[11px] text-dark-400 leading-relaxed">{judge.bio}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Nominees */}
            {award.nominees.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-serif text-white italic">Nominees</h2>
                  <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-gold-500">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {award.nominees.map((nom, i) => (
                    <Card key={i} className="border-white/5 hover:border-gold-500/20 transition-all group p-0">
                      <div className="aspect-square relative overflow-hidden">
                        <img src={nom.photo} alt={nom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                        {nom.votes !== undefined && (
                          <div className="absolute top-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/10">
                            <Vote className="h-2.5 w-2.5 text-emerald-500" />
                            <span className="text-[9px] font-bold text-white">{formatNumber(nom.votes)}</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-sm font-medium text-white truncate">{nom.name}</p>
                          <p className="text-[9px] text-dark-400 uppercase tracking-widest">{nom.category}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Event Info */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Event Information</h2>
              <Card className="border-white/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { icon: MapPin, label: 'Venue', value: award.venue },
                      { icon: Globe, label: 'Location', value: `${award.city}, ${award.country}` },
                      { icon: Calendar, label: 'Ceremony Date', value: formatDate(award.dates.ceremony) },
                      { icon: Clock, label: 'Time', value: award.ceremonyTime },
                      ...(award.dressCode ? [{ icon: Award, label: 'Dress Code', value: award.dressCode }] : []),
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                          <item.icon className="h-4 w-4 text-gold-500" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">{item.label}</p>
                          <p className="text-sm text-white mt-0.5">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {award.mapUrl && (
                    <a href={award.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors">
                      <MapPin className="h-3 w-3" /> View on Google Maps
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.section>

            {/* Media Gallery */}
            {award.mediaGallery.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Media Gallery</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {award.mediaGallery.map((media, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5" onClick={() => setLightbox({ url: media.url, caption: media.caption })}>
                      <img src={media.url} alt={media.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center">
                        {media.type === 'video' ? <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" /> : <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950/80 to-transparent p-3">
                        <p className="text-[10px] text-dark-300 truncate">{media.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* FAQ */}
            {award.faq.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Frequently Asked Questions</h2>
                <Card className="border-white/5">
                  <CardContent className="p-5 sm:p-6">
                    {award.faq.map((item, i) => (
                      <FAQItem key={i} question={item.question} answer={item.answer} />
                    ))}
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Related Awards */}
            {award.relatedAwards.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-xl sm:text-2xl font-serif text-white italic mb-6">Related Awards</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {award.relatedAwards.map((related, i) => (
                    <Link key={i} to={`/awards/${related.id}`}>
                      <Card className="border-white/5 hover:border-gold-500/20 transition-all group p-0">
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <img src={related.image} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">{related.name}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* ── Sticky Sidebar ─────────────────────────────────────────── */}
          <aside className="lg:w-80 xl:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* CTA + Status Card */}
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

                  {/* Quick Dates */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Important Dates</p>
                    {[
                      { label: 'Noms Open', date: award.dates.nominationsOpen },
                      { label: 'Noms Close', date: award.dates.nominationsClose },
                      { label: 'Voting', date: award.dates.publicVoting },
                      { label: 'Judging', date: award.dates.finalJudging },
                      { label: 'Ceremony', date: award.dates.ceremony },
                    ].map((d, i) => {
                      const now = new Date();
                      const dDate = new Date(d.date);
                      const isPast = dDate < now;
                      return (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className={`font-medium ${isPast ? 'text-dark-600 line-through' : 'text-dark-300'}`}>{d.label}</span>
                          <span className={isPast ? 'text-dark-600' : 'text-dark-400'}>{formatDate(d.date)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
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

              {/* Quick Stats Card */}
              <Card className="border-white/5">
                <CardContent className="p-5 space-y-3">
                  <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest">Quick Facts</p>
                  {[
                    { icon: Award, label: 'Categories', value: award.stats.categories },
                    { icon: Users, label: 'Nominees', value: award.stats.nominees },
                    { icon: Globe, label: 'Countries', value: award.stats.countries },
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
            </div>
          </aside>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-12 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-xs">
            <p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">The world's leading platform for award management, secure voting, and community recognition.</p>
          </div>
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
