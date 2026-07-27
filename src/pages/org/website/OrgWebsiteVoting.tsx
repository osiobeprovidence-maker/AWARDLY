import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Trophy, ArrowRight, ShieldCheck, MousePointer2, Clock, Users } from 'lucide-react';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

interface OrgWebsiteVotingProps {
  org: any;
  events: any[];
}

export function OrgWebsiteVoting({ org, events }: OrgWebsiteVotingProps) {
  const [selectedEventId, setSelectedEventId] = React.useState<string>('');
  const activeVotingEvents = events.filter((e) => e.isVotingActive);

  React.useEffect(() => {
    if (activeVotingEvents.length > 0 && !selectedEventId) {
      setSelectedEventId(activeVotingEvents[0]._id);
    }
  }, [activeVotingEvents, selectedEventId]);

  const selectedEvent = activeVotingEvents.find((e) => e._id === selectedEventId);
  const categories = useQuery(
    api.categories.queries.getByEvent,
    selectedEvent ? { eventId: selectedEvent._id } : 'skip'
  ) ?? [];
  const totalVotes = events.reduce((sum: number, e) => sum + (e.totalVotes ?? 0), 0);

  if (activeVotingEvents.length === 0) {
    return (
      <div className="text-center py-16">
        <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" />
        <h3 className="text-xl text-white font-serif mb-2">No Active Voting</h3>
        <p className="text-dark-500 text-sm">There are currently no open voting categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Official Polls</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Voting Gateway</h2>
        <p className="text-dark-400 text-sm max-w-lg mx-auto">Official information hub for the current awards season.</p>
      </div>

      {activeVotingEvents.length > 1 && (
        <div className="flex justify-center">
          <div className="flex bg-dark-900/60 p-1 rounded-xl border border-white/5">
            {activeVotingEvents.map((event) => (
              <button key={event._id} onClick={() => setSelectedEventId(event._id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedEventId === event._id
                    ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20'
                    : 'text-dark-400 hover:text-white'
                }`}>
                {event.title.split(' ').slice(-1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedEvent && (
        <>
          <div className="relative overflow-hidden rounded-3xl bg-dark-900/40 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950 to-transparent z-10" />
            <div className="absolute inset-0 opacity-40">
              {selectedEvent.coverUrl ? (
                <img src={selectedEvent.coverUrl} className="w-full h-full object-cover grayscale" alt="hero" />
              ) : (
                <div className="w-full h-full bg-dark-900" />
              )}
            </div>
            <div className="relative z-20 p-8 md:p-16 max-w-2xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gold-500 text-dark-950 text-[10px] font-black uppercase tracking-widest rounded-full">Voting is Open</span>
                {selectedEvent.votingEnd && (
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ends {formatDate(selectedEvent.votingEnd)}</span>
                )}
              </div>
              <h3 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">{selectedEvent.title}</h3>
              <p className="text-dark-400 text-sm md:text-base leading-relaxed">
                {selectedEvent.description || 'Support your favorite talents. Every vote counts towards shaping the future of excellence.'}
              </p>
              <div className="pt-4">
                <Link to={`/org/${org.slug}/events/${selectedEvent._id}`}>
                  <Button className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-gold-500/20 group">
                    Enter Voting Portal <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-gold-500" />
              </div>
              <h4 className="text-xl text-white font-serif italic">Before You Vote</h4>
              <ul className="space-y-3">
                {['One account = one verified voter', 'Daily vote limits apply per category', 'Premium votes available for verified fans', 'Votes cannot be reversed', 'Suspicious activity will be flagged'].map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[11px] text-dark-400 leading-relaxed">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold-500/30 mt-1.5 shrink-0" />{rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <MousePointer2 className="h-6 w-6 text-gold-500" />
              </div>
              <h4 className="text-xl text-white font-serif italic">How Voting Works</h4>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Choose Category', desc: 'Browse through active award categories.' },
                  { step: '02', title: 'Select Nominee', desc: 'Pick your favorite candidate.' },
                  { step: '03', title: 'Confirm Vote', desc: 'Use your free or premium votes.' },
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gold-500 font-serif italic text-lg">{s.step}</span>
                    <div>
                      <h5 className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">{s.title}</h5>
                      <p className="text-[10px] text-dark-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-gold-500" />
              </div>
              <h4 className="text-xl text-white font-serif italic">Statistics</h4>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
                  <p className="text-gold-500 font-serif text-3xl mb-1">{categories.length}</p>
                  <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Active Categories</p>
                </div>
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
                  <p className="text-white font-serif text-3xl mb-1">{totalVotes.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Total Votes Cast</p>
                </div>
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/5">
                  <p className="text-white font-serif text-3xl mb-1">{org.followerCount.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Community Members</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gold-500 rounded-3xl p-12 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-6">
              <h4 className="text-dark-950 text-3xl md:text-5xl font-serif italic tracking-tight">Ready to make your voice heard?</h4>
              <p className="text-dark-950/60 max-w-xl mx-auto text-sm">Join fans across the globe in deciding the next generation of icons.</p>
              <Link to={`/org/${org.slug}/events/${selectedEvent._id}`}>
                <button className="bg-dark-950 text-white hover:bg-dark-900 h-16 px-12 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-2xl transition-all">
                  Start Voting Now
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`px-6 py-2 rounded-xl bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors ${className || ''}`} {...props}>
      {children}
    </button>
  );
}
