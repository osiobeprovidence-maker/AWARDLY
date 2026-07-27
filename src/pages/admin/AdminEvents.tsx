import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../lib/toast';
import {
  Trophy, Search, Loader2, ExternalLink, MoreHorizontal, Eye, Trash2,
  CheckCircle2, XCircle, Circle, Radio, Archive
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-dark-500 text-dark-300',
  ready_for_review: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  published: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  live: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  voting_ended: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  winners_announced: 'bg-gold-500/10 text-gold-400 border border-gold-500/20',
  closed: 'bg-dark-500/10 text-dark-400 border border-white/10',
  archived: 'bg-dark-800 text-dark-500 border border-white/5',
};

export function AdminEvents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const events = useQuery(
    api.admin.queries.getAllEvents,
    user?.id ? { firebaseUid: user.id, status: statusFilter } : 'skip'
  );

  const deleteEvent = useMutation(api.admin.mutations.deleteEvent);
  const featureEvent = useMutation(api.admin.mutations.featureEvent);

  if (!events) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const filtered = events.filter((e: any) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.orgName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Events</h1>
        <p className="text-dark-400 text-sm mt-1">All award events across the platform</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-80">
          <Input placeholder="Search events..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 text-xs" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'draft', 'published', 'live', 'voting_ended', 'winners_announced', 'archived'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-gold-500 text-dark-950' : 'bg-white/5 text-dark-400 hover:text-white'}`}>
              {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Votes</th>
                <th className="px-6 py-4">Nominees</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((event: any) => (
                <tr key={event._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <h4 className="text-white text-sm font-medium">{event.title}</h4>
                    <p className="text-dark-500 text-xs">{event.date}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-dark-300">{event.orgName}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[event.status] || 'bg-dark-800 text-dark-400'}`}>
                      {event.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-300">{event.totalVotes.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-dark-300">{event.nomineeCount}</td>
                  <td className="px-6 py-4 text-xs text-dark-500">{new Date(event.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === event._id ? null : event._id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === event._id && (
                        <div className="absolute right-0 top-10 z-50 w-48 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <a href={`/events/${event._id}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                            <ExternalLink className="h-3.5 w-3.5" /> View Event
                          </a>
                          <button onClick={() => { featureEvent({ firebaseUid: user?.id, eventId: event._id }); toast('Event featured', 'success'); setOpenMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-all text-left">
                            <Eye className="h-3.5 w-3.5" /> Feature
                          </button>
                          <button onClick={() => { if (confirm('Delete this event?')) { deleteEvent({ firebaseUid: user?.id, eventId: event._id }); toast('Event deleted', 'success'); setOpenMenu(null); } }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/5 transition-all text-left">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-dark-500 text-sm">No events found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
