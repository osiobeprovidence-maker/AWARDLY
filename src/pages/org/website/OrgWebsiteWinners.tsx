import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Calendar } from 'lucide-react';

interface OrgWebsiteWinnersProps {
  org: any;
  events: any[];
}

export function OrgWebsiteWinners({ org, events }: OrgWebsiteWinnersProps) {
  const winnerEvents = events.filter((e) => e.status === 'winners_announced');

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Hall of Fame</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Our Winners</h2>
        <p className="text-dark-400 text-sm max-w-lg mx-auto">Celebrating the outstanding achievements of our past winners.</p>
      </div>

      {winnerEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winnerEvents.map((event) => (
            <Link to={`/org/${org.slug}/events/${event._id}`} key={event._id}>
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 hover:bg-gold-500/10 transition-all p-6 text-center group">
                <div className="h-14 w-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="h-7 w-7 text-gold-500" />
                </div>
                <h3 className="text-lg text-white font-serif mb-2 group-hover:text-gold-400 transition-colors">{event.title}</h3>
                <p className="text-xs text-dark-400 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-dark-500 uppercase tracking-widest mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {(() => { try { return new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return event.date; } })()}
                  </span>
                </div>
                <span className="text-xs font-bold text-gold-500 flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                  View Winners <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" />
          <h3 className="text-xl text-white font-serif mb-2">No Winners Yet</h3>
          <p className="text-dark-500 text-sm">Winners will be announced after our events conclude.</p>
        </div>
      )}
    </div>
  );
}
