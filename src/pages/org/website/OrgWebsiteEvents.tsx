import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, ArrowRight } from 'lucide-react';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

interface OrgWebsiteEventsProps {
  org: any;
  events: any[];
}

export function OrgWebsiteEvents({ org, events }: OrgWebsiteEventsProps) {
  const activeEvents = events.filter((e) => ['published', 'live', 'voting_ended', 'winners_announced'].includes(e.status));

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Awards</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Our Awards</h2>
        <p className="text-dark-400 text-sm max-w-lg mx-auto">Explore our award events and find out how you can participate.</p>
      </div>

      {activeEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeEvents.map((event) => (
            <Link to={`/org/${org.slug}/events/${event._id}`} key={event._id}>
              <div className="rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all bg-dark-900/50 h-full flex flex-col group">
                <div className="aspect-video relative overflow-hidden">
                  {event.coverUrl ? (
                    <img src={event.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={event.title} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-dark-800 flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-dark-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-dark-950/80 backdrop-blur text-[10px] font-bold text-gold-500 rounded uppercase tracking-widest border border-gold-500/20">
                    {event.status === 'live' ? 'Live Now' : event.status}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl text-white font-serif mb-2 group-hover:text-gold-400 transition-colors">{event.title}</h3>
                  <p className="text-xs text-dark-400 mb-6 leading-relaxed line-clamp-2 flex-1">{event.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] text-dark-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(event.date)}
                    </span>
                    <span className="text-xs font-bold text-gold-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Go to Hub <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" />
          <h3 className="text-xl text-white font-serif mb-2">No Events Yet</h3>
          <p className="text-dark-500 text-sm">No active events at the moment. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
