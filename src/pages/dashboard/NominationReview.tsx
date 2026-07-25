import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useAuth } from '../../lib/convex-auth';
import { useToast } from '../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  CheckCircle2, XCircle, Star, Clock, Loader2, ChevronDown, ChevronUp,
  Globe, Twitter, Instagram, Linkedin, Youtube, Filter, Inbox,
} from 'lucide-react';

type NominationStatus = 'pending' | 'approved' | 'rejected' | 'shortlisted';

const STATUS_CONFIG: Record<NominationStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  shortlisted: { label: 'Shortlisted', icon: Star, color: 'text-gold-500', bg: 'bg-gold-500/10' },
};

export function NominationReview() {
  const { toast } = useToast();
  const { currentOrg } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState<Id<'events'> | null>(null);
  const [filterStatus, setFilterStatus] = useState<NominationStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<Id<'nominations'> | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewingId, setReviewingId] = useState<Id<'nominations'> | null>(null);

  const events = useQuery(
    api.events.queries.getByOrg,
    currentOrg?.id ? { orgId: currentOrg.id } : 'skip'
  );

  const nominations = useQuery(
    api.nominations.queries.getByEvent,
    selectedEventId ? { eventId: selectedEventId } : 'skip'
  );

  const reviewNomination = useMutation(api.nominations.mutations.review);

  const filtered = nominations?.filter(n =>
    filterStatus === 'all' || n.status === filterStatus
  ) || [];

  const counts = nominations ? {
    all: nominations.length,
    pending: nominations.filter(n => n.status === 'pending').length,
    approved: nominations.filter(n => n.status === 'approved').length,
    rejected: nominations.filter(n => n.status === 'rejected').length,
    shortlisted: nominations.filter(n => n.status === 'shortlisted').length,
  } : { all: 0, pending: 0, approved: 0, rejected: 0, shortlisted: 0 };

  const handleReview = async (nominationId: Id<'nominations'>, status: 'approved' | 'rejected' | 'shortlisted') => {
    setReviewingId(nominationId);
    try {
      await reviewNomination({
        nominationId,
        status,
        reviewNotes: reviewNote || undefined,
        firebaseUid: '',
      });
      toast(`Nomination ${status}`, 'success');
      setExpandedId(null);
      setReviewNote('');
    } catch (e: any) {
      toast(e.message || 'Failed to review', 'error');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Nomination Review</h1>
        <p className="text-dark-400 text-sm">Review and approve submitted nominations.</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Event:</span>
          </div>
          <select
            value={selectedEventId || ''}
            onChange={e => setSelectedEventId((e.target.value || null) as Id<'events'> | null)}
            className="bg-dark-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/30 min-w-[200px]"
          >
            <option value="">Select an event...</option>
            {events?.map(evt => (
              <option key={evt._id} value={evt._id}>{evt.title}</option>
            ))}
          </select>
        </div>
      </Card>

      {selectedEventId && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'pending', 'approved', 'rejected', 'shortlisted'] as const).map(status => {
            const config = status === 'all' ? null : STATUS_CONFIG[status];
            const count = counts[status];
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  filterStatus === status
                    ? 'bg-gold-500 text-dark-950'
                    : 'bg-white/5 text-dark-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {config && <config.icon className="h-3.5 w-3.5" />}
                {status === 'all' ? 'All' : config?.label}
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {!selectedEventId ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <Inbox className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">Select an event</h3>
          <p className="text-dark-400 text-sm">Choose an event above to review nominations.</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <CheckCircle2 className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No nominations found</h3>
          <p className="text-dark-400 text-sm">
            {filterStatus === 'all' ? 'No nominations submitted yet.' : `No ${filterStatus} nominations.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(nom => {
            const config = STATUS_CONFIG[nom.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedId === nom._id;

            return (
              <Card key={nom._id} className="overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-white/[0.01] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : nom._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-white truncate">{nom.nomineeName}</p>
                        {nom.isSelfNomination && (
                          <span className="px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-500 text-[9px] font-black uppercase tracking-widest">Self</span>
                        )}
                      </div>
                      <p className="text-xs text-dark-400 truncate">
                        {nom.nomineeOrganization ? `${nom.nomineeOrganization} • ` : ''}
                        Submitted by {nom.submitterEmail}
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-dark-500 hidden sm:block">
                        {new Date(nom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-dark-500" /> : <ChevronDown className="h-4 w-4 text-dark-500" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/5 p-5 space-y-4 bg-white/[0.01]">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1">About</p>
                      <p className="text-sm text-dark-200 leading-relaxed">{nom.nomineeBio}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1">Key Achievements</p>
                      <p className="text-sm text-dark-200 leading-relaxed">{nom.achievementSummary}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1">Why Nominated</p>
                      <p className="text-sm text-dark-200 leading-relaxed">{nom.whyNominated}</p>
                    </div>

                    {nom.nomineeLinks && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-2">Links</p>
                        <div className="flex flex-wrap gap-2">
                          {nom.nomineeLinks.website && (
                            <a href={nom.nomineeLinks.website} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-dark-300 hover:text-gold-500 transition-colors">
                              <Globe className="h-3 w-3" /> Website
                            </a>
                          )}
                          {nom.nomineeLinks.twitter && (
                            <a href={`https://twitter.com/${nom.nomineeLinks.twitter}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-dark-300 hover:text-sky-400 transition-colors">
                              <Twitter className="h-3 w-3" /> Twitter
                            </a>
                          )}
                          {nom.nomineeLinks.linkedin && (
                            <a href={nom.nomineeLinks.linkedin} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-dark-300 hover:text-blue-400 transition-colors">
                              <Linkedin className="h-3 w-3" /> LinkedIn
                            </a>
                          )}
                          {nom.nomineeLinks.instagram && (
                            <a href={`https://instagram.com/${nom.nomineeLinks.instagram}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-dark-300 hover:text-pink-400 transition-colors">
                              <Instagram className="h-3 w-3" /> Instagram
                            </a>
                          )}
                          {nom.nomineeLinks.youtube && (
                            <a href={nom.nomineeLinks.youtube} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-dark-300 hover:text-red-400 transition-colors">
                              <Youtube className="h-3 w-3" /> YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1.5 block">Review Notes (optional)</label>
                      <textarea
                        value={reviewNote}
                        onChange={e => setReviewNote(e.target.value)}
                        placeholder="Add notes for this review decision..."
                        rows={2}
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 resize-none placeholder:text-dark-600"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" disabled={reviewingId === nom._id} onClick={() => handleReview(nom._id, 'approved')}>
                        {reviewingId === nom._id ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10" disabled={reviewingId === nom._id} onClick={() => handleReview(nom._id, 'shortlisted')}>
                        <Star className="h-3.5 w-3.5 mr-1.5" />
                        Shortlist
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" disabled={reviewingId === nom._id} onClick={() => handleReview(nom._id, 'rejected')}>
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
