import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Trophy, Calendar, ArrowRight, PlayCircle, Users, Star, Megaphone,
  Ticket, Image, Newspaper, Mail, MessageSquare, Video, MapPin, Phone,
  FileText, HandHeart, Globe, ExternalLink, CheckCircle2, ShieldCheck,
  MousePointer2, Clock, Link as LinkIcon, Twitter, Instagram, Youtube,
} from 'lucide-react';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

function SponsorBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    strategic: { bg: 'bg-gold-500/10', text: 'text-gold-500', border: 'border-gold-500/20' },
    gold: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-400/20' },
    silver: { bg: 'bg-gray-400/10', text: 'text-gray-300', border: 'border-gray-300/20' },
    bronze: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-400/20' },
  };
  const c = colors[level] ?? colors.bronze;
  return (
    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${c.bg} ${c.text} border ${c.border}`}>
      {level}
    </span>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors group">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm">{label}</span>
      <ExternalLink className="h-3 w-3 text-dark-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

function renderSection(type: string, data: { section: any; org: any; events: any[]; activeEvents: any[]; activeVotingEvents: any[]; sponsors: any[]; posts: any[]; liveBroadcast: any; totalVotes: number; onNavigate: (pageId: string) => void }): React.ReactNode {
  const { section, org, events, activeEvents, sponsors, posts, liveBroadcast, onNavigate } = data;
  switch (type) {
    case 'hero':
      return <HeroSection org={org} section={section} onNavigate={onNavigate} />;
    case 'countdown':
      return <CountdownSection events={activeEvents} />;
    case 'featured_events':
      return <FeaturedEventsSection org={org} events={activeEvents} />;
    case 'open_nominations':
      return <OpenNominationsSection events={activeEvents} />;
    case 'call_for_entry':
      return <CallForEntrySection events={activeEvents} />;
    case 'ticket_sales':
      return <TicketSalesSection events={activeEvents} />;
    case 'sponsors':
      return sponsors.length > 0 ? <SponsorsSection sponsors={sponsors} /> : null;
    case 'featured_winners':
      return <FeaturedWinnersSection org={org} events={events} onNavigate={onNavigate} />;
    case 'video':
      return liveBroadcast ? <VideoSection broadcast={liveBroadcast} org={org} /> : null;
    case 'gallery':
      return <GallerySection org={org} />;
    case 'latest_news':
      return posts.length > 0 ? <LatestNewsSection posts={posts} /> : null;
    case 'newsletter':
      return <NewsletterSection section={section} />;
    case 'testimonials':
      return <TestimonialsSection section={section} />;
    case 'upcoming_events':
      return activeEvents.length > 0 ? <UpcomingEventsSection org={org} events={activeEvents} /> : null;
    case 'faq':
      return <FaqSection />;
    case 'contact':
      return <ContactPreviewSection org={org} />;
    case 'map':
      return org.headquarters ? <MapSection org={org} /> : null;
    case 'partners':
      return sponsors.length > 0 ? <PartnersSection sponsors={sponsors} /> : null;
    default:
      return null;
  }
}

interface OrgWebsiteHomeProps {
  org: any;
  events: any[];
  sponsors: any[];
  posts: any[];
  broadcasts: any[];
  sections: any[];
  onNavigate: (pageId: string) => void;
}

export function OrgWebsiteHome({ org, events, sponsors, posts, broadcasts, sections, onNavigate }: OrgWebsiteHomeProps) {
  const activeEvents = events.filter((e) => ['published', 'live', 'voting_ended', 'winners_announced'].includes(e.status));
  const activeVotingEvents = events.filter((e) => e.isVotingActive);
  const liveBroadcast = broadcasts.find((b) => b.status === 'live');
  const totalVotes = events.reduce((sum: number, e) => sum + (e.totalVotes ?? 0), 0);

  const socialLinks = org.socialLinks ?? {};
  const enabledSections = sections.filter((s) => s.isEnabled).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-16">
      {enabledSections.map((section) => {
        const el = renderSection(section.type, { section, org, events, activeEvents, activeVotingEvents, sponsors, posts, liveBroadcast, totalVotes, onNavigate });
        return el ? <React.Fragment key={section.id}>{el}</React.Fragment> : null;
      })}

      {enabledSections.length === 0 && (
        <div className="space-y-12">
          <HeroSection org={org} section={{}} onNavigate={onNavigate} />
          {activeEvents.length > 0 && <FeaturedEventsSection org={org} events={activeEvents} />}
          {sponsors.length > 0 && <SponsorsSection sponsors={sponsors} />}
          <NewsletterSection section={{}} />
        </div>
      )}
    </div>
  );
}

function HeroSection({ org, section, onNavigate }: { org: any; section: any; onNavigate: (p: string) => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-dark-900/40 border border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            {section.subtitle || 'Celebrating Excellence'}
          </p>
          <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight mb-6">
            {section.title || 'Welcome to'} {org.name}
          </h2>
          <p className="text-dark-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            {org.description || 'Recognizing outstanding achievements and empowering communities through transparent, engaging award experiences.'}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => onNavigate('events')}
            className="px-8 py-3 rounded-full bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20">
            Explore Awards
          </button>
          <button onClick={() => onNavigate('about')}
            className="px-8 py-3 rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-colors">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function CountdownSection({ events }: { events: any[] }) {
  const nextEvent = events.find((e) => e.date && new Date(e.date) > new Date());
  if (!nextEvent) return null;
  return (
    <div className="bg-dark-900/40 border border-white/5 rounded-2xl p-8 text-center">
      <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em] mb-4">Next Event</p>
      <h3 className="text-2xl font-serif text-white mb-2">{nextEvent.title}</h3>
      <p className="text-dark-400 text-sm">{formatDate(nextEvent.date)}</p>
    </div>
  );
}

function FeaturedEventsSection({ org, events }: { org: any; events: any[] }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Our Awards</p>
        <h3 className="text-3xl font-serif text-white italic">Featured Awards</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 6).map((event) => (
          <Link to={`/org/${org.slug}/events/${event._id}`} key={event._id}>
            <div className="group rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all bg-dark-900/50 h-full flex flex-col">
              <div className="h-44 overflow-hidden relative">
                {event.coverUrl ? (
                  <img src={event.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={event.title} referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-dark-800 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-dark-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 bg-gold-500 text-dark-950 text-[8px] font-bold uppercase rounded tracking-widest">
                    {event.status === 'live' ? 'Live Now' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-white font-serif text-lg mb-2 group-hover:text-gold-400 transition-colors">{event.title}</h4>
                <p className="text-xs text-dark-400 line-clamp-2 mb-4 flex-1">{event.description}</p>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-[10px] text-dark-500 uppercase font-bold tracking-widest flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDate(event.date)}
                  </span>
                  <span className="text-xs font-bold text-gold-500">View →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function OpenNominationsSection({ events }: { events: any[] }) {
  return (
    <div className="bg-gold-500/5 border border-gold-500/10 rounded-2xl p-8 md:p-12 text-center space-y-6">
      <Megaphone className="h-10 w-10 text-gold-500 mx-auto" />
      <h3 className="text-2xl font-serif text-white italic">Nominations Now Open</h3>
      <p className="text-dark-400 text-sm max-w-lg mx-auto">Submit your nominations and help us recognize outstanding achievements in the industry.</p>
    </div>
  );
}

function CallForEntrySection({ events }: { events: any[] }) {
  return (
    <div className="bg-dark-900/40 border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
      <Megaphone className="h-10 w-10 text-gold-500 mx-auto" />
      <h3 className="text-2xl font-serif text-white italic">Call for Entries</h3>
      <p className="text-dark-400 text-sm max-w-lg mx-auto">Submissions are now being accepted. Don't miss the chance to be part of something extraordinary.</p>
    </div>
  );
}

function TicketSalesSection({ events }: { events: any[] }) {
  return (
    <div className="bg-dark-900/40 border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
      <Ticket className="h-10 w-10 text-gold-500 mx-auto" />
      <h3 className="text-2xl font-serif text-white italic">Get Your Tickets</h3>
      <p className="text-dark-400 text-sm max-w-lg mx-auto">Secure your spot at the most prestigious awards ceremony of the year.</p>
    </div>
  );
}

function SponsorsSection({ sponsors }: { sponsors: any[] }) {
  return (
    <div className="text-center space-y-8">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500">Strategic Partners & Sponsors</p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        {sponsors.map((sponsor) => (
          <a key={sponsor._id} href={sponsor.website || '#'} target={sponsor.website ? '_blank' : undefined}
            rel="noopener noreferrer" className="flex items-center gap-3">
            {sponsor.logoUrl && (
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center">
                <img src={sponsor.logoUrl} className="h-full w-full object-contain" alt={sponsor.name} referrerPolicy="no-referrer" />
              </div>
            )}
            <div className="text-left">
              <SponsorBadge level={sponsor.level} />
              <p className="text-white font-serif text-sm italic mt-1">{sponsor.name}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function FeaturedWinnersSection({ org, events, onNavigate }: { org: any; events: any[]; onNavigate: (p: string) => void }) {
  const winnerEvents = events.filter((e) => e.status === 'winners_announced');
  if (winnerEvents.length === 0) return null;
  return (
    <div className="text-center space-y-8">
      <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Hall of Fame</p>
      <h3 className="text-3xl font-serif text-white italic">Featured Winners</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {winnerEvents.slice(0, 3).map((event) => (
          <Link to={`/org/${org.slug}/events/${event._id}`} key={event._id}>
            <div className="rounded-2xl border border-white/5 hover:border-gold-500/30 transition-all p-6 text-center bg-dark-900/50">
              <Trophy className="h-8 w-8 text-gold-500 mx-auto mb-3" />
              <h4 className="text-white font-serif">{event.title}</h4>
              <p className="text-[10px] text-dark-500 mt-1 uppercase tracking-widest">View Winners</p>
            </div>
          </Link>
        ))}
      </div>
      <button onClick={() => onNavigate('winners')}
        className="text-gold-500 text-xs font-bold uppercase tracking-widest hover:text-gold-400 transition-colors">
        View All Winners →
      </button>
    </div>
  );
}

function VideoSection({ broadcast, org }: { broadcast: any; org: any }) {
  return (
    <Link to={`/org/${org.slug}`}>
      <div className="relative rounded-2xl overflow-hidden border border-red-500/20 group cursor-pointer">
        <div className="aspect-video relative">
          {broadcast.thumbnailUrl ? (
            <img src={broadcast.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="live" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-dark-900" />
          )}
          <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-all" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-600 text-[10px] font-bold text-white rounded flex items-center uppercase tracking-widest">
              <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-2" /> Live Now
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlayCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h4 className="text-xl font-serif text-white">{broadcast.title}</h4>
            <p className="text-dark-400 text-xs flex items-center gap-2 mt-1">
              <Users className="h-3 w-3" /> {broadcast.concurrentViewers.toLocaleString()} watching
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function GallerySection({ org }: { org: any }) {
  return (
    <div className="text-center space-y-6">
      <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Gallery</p>
      <h3 className="text-2xl font-serif text-white italic">Moments of Excellence</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-dark-800 border border-white/5 flex items-center justify-center">
            <Image className="h-6 w-6 text-dark-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestNewsSection({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Updates</p>
        <h3 className="text-2xl font-serif text-white italic">Latest News</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {posts.slice(0, 4).map((post) => (
          <div key={post._id} className="p-5 rounded-xl bg-dark-900/50 border border-white/5">
            <p className="text-white text-sm mb-2 line-clamp-3">{post.content}</p>
            <p className="text-dark-500 text-[10px] uppercase tracking-widest">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterSection({ section }: { section: any }) {
  const [email, setEmail] = React.useState('');
  return (
    <div className="bg-dark-900/40 border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
      <Mail className="h-10 w-10 text-gold-500 mx-auto" />
      <h3 className="text-2xl font-serif text-white italic">{section.title || 'Stay Updated'}</h3>
      <p className="text-dark-400 text-sm max-w-md mx-auto">{section.subtitle || 'Subscribe to our newsletter for the latest updates.'}</p>
      <div className="flex max-w-md mx-auto">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
          className="flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 py-3 text-xs text-white placeholder:text-dark-500 focus:outline-none focus:border-gold-500/50" />
        <button className="bg-gold-500 text-dark-950 px-6 py-3 rounded-r-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
}

function TestimonialsSection({ section }: { section: any }) {
  return (
    <div className="text-center space-y-6">
      <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Testimonials</p>
      <h3 className="text-2xl font-serif text-white italic">{section.title || 'What People Say'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { quote: 'An incredible platform that truly celebrates excellence.', name: 'Industry Leader' },
          { quote: 'Transparent, fair, and genuinely impactful for the community.', name: 'Past Winner' },
          { quote: 'The best awards experience we have been part of.', name: 'Partner Organization' },
        ].map((t, i) => (
          <div key={i} className="p-6 rounded-xl bg-dark-900/50 border border-white/5 text-center space-y-4">
            <MessageSquare className="h-6 w-6 text-gold-500/50 mx-auto" />
            <p className="text-dark-300 text-sm italic leading-relaxed">"{t.quote}"</p>
            <p className="text-gold-500 text-[10px] font-bold uppercase tracking-widest">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingEventsSection({ org, events }: { org: any; events: any[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Upcoming</p>
        <h3 className="text-2xl font-serif text-white italic">Upcoming Events</h3>
      </div>
      <div className="space-y-3 max-w-2xl mx-auto">
        {events.slice(0, 5).map((event) => (
          <Link to={`/org/${org.slug}/events/${event._id}`} key={event._id}
            className="flex items-center gap-4 p-4 rounded-xl bg-dark-900/50 border border-white/5 hover:border-gold-500/20 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-gold-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate group-hover:text-gold-400 transition-colors">{event.title}</p>
              <p className="text-dark-500 text-[10px] uppercase tracking-widest">{formatDate(event.date)}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-dark-600 group-hover:text-gold-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">FAQ</p>
        <h3 className="text-2xl font-serif text-white italic">Frequently Asked Questions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
        {[
          { q: 'How do I submit a nomination?', a: 'Navigate to the Events page and select an active event with open nominations. Follow the submission guidelines.' },
          { q: 'Is voting free?', a: 'Yes, every category includes a free voting allowance. Additional premium votes may be available for some events.' },
          { q: 'How are winners selected?', a: 'Winners are determined by a combination of public voting and committee review, depending on the event format.' },
          { q: 'Can I attend the ceremony?', a: 'Yes, check the Tickets section for available passes and pricing information.' },
        ].map((item, idx) => (
          <div key={idx} className="space-y-3">
            <h5 className="text-white text-sm font-medium">{item.q}</h5>
            <p className="text-dark-400 text-xs leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPreviewSection({ org }: { org: any }) {
  const socialLinks = org.socialLinks ?? {};
  return (
    <div className="bg-dark-900/40 border border-white/5 rounded-2xl p-8 md:p-12 space-y-6">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Get in Touch</p>
        <h3 className="text-2xl font-serif text-white italic">Contact Us</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          {org.contactEmail && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold-500" />
              <a href={`mailto:${org.contactEmail}`} className="text-dark-300 text-sm hover:text-gold-400 transition-colors">{org.contactEmail}</a>
            </div>
          )}
          {org.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold-500" />
              <span className="text-dark-300 text-sm">{org.phone}</span>
            </div>
          )}
          {org.headquarters && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gold-500" />
              <span className="text-dark-300 text-sm">{org.headquarters}, {org.country}</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {socialLinks.twitter && <SocialLink href={`https://x.com/${socialLinks.twitter}`} icon={Twitter} label="X (Twitter)" />}
          {socialLinks.instagram && <SocialLink href={`https://instagram.com/${socialLinks.instagram}`} icon={Instagram} label="Instagram" />}
          {socialLinks.youtube && <SocialLink href={`https://youtube.com/@${socialLinks.youtube}`} icon={Youtube} label="YouTube" />}
          {socialLinks.website && <SocialLink href={socialLinks.website} icon={Globe} label="Website" />}
        </div>
      </div>
    </div>
  );
}

function MapSection({ org }: { org: any }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5 bg-dark-800 h-64 flex items-center justify-center">
      <div className="text-center space-y-2">
        <MapPin className="h-8 w-8 text-dark-500 mx-auto" />
        <p className="text-dark-400 text-sm">{org.headquarters}, {org.country}</p>
      </div>
    </div>
  );
}

function PartnersSection({ sponsors }: { sponsors: any[] }) {
  return (
    <div className="text-center space-y-6">
      <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Our Partners</p>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsors.map((sponsor) => (
          <div key={sponsor._id} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            {sponsor.logoUrl && (
              <img src={sponsor.logoUrl} className="h-8 w-8 rounded-lg object-contain" alt={sponsor.name} referrerPolicy="no-referrer" />
            )}
            <span className="text-white text-sm">{sponsor.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
