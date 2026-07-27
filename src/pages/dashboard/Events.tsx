import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Trophy, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../lib/convex-auth';
import { useToast } from '../../lib/toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { EventStatusBadge, EventStatus, STATUS_CONFIG } from '../../components/dashboard/EventStatusBadge';
import { EventActionsDropdown } from '../../components/dashboard/EventActionsDropdown';
import { StatusChangeConfirmModal } from '../../components/dashboard/StatusChangeConfirmModal';

type TabKey = 'all' | EventStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'ready_for_review', label: 'In Review' },
  { key: 'published', label: 'Published' },
  { key: 'live', label: 'Live' },
  { key: 'voting_ended', label: 'Voting Ended' },
  { key: 'winners_announced', label: 'Winners' },
  { key: 'archived', label: 'Archived' },
];

export function DashboardEvents() {
  const { currentOrg, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [transitionModal, setTransitionModal] = useState<{
    eventId: string;
    eventTitle: string;
    fromStatus: EventStatus;
    toStatus: EventStatus;
  } | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const allEvents = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const draftEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'draft' } : 'skip'
  );

  const readyForReviewEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'ready_for_review' } : 'skip'
  );

  const publishedEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'published' } : 'skip'
  );

  const liveEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'live' } : 'skip'
  );

  const votingEndedEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'voting_ended' } : 'skip'
  );

  const winnersAnnouncedEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'winners_announced' } : 'skip'
  );

  const closedEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'closed' } : 'skip'
  );

  const archivedEvents = useQuery(
    api.events.queries.getByOrgAndStatus,
    currentOrg ? { orgId: currentOrg.id as any, status: 'archived' } : 'skip'
  );

  const deleteEvent = useMutation(api.events.mutations.deleteEvent);
  const transitionStatus = useMutation(api.events.mutations.transitionStatus);
  const duplicateEvent = useMutation(api.events.mutations.duplicateEvent);

  const isLoading = allEvents === undefined;

  const tabCounts = useMemo(() => ({
    all: allEvents?.length ?? 0,
    draft: draftEvents?.length ?? 0,
    ready_for_review: readyForReviewEvents?.length ?? 0,
    published: publishedEvents?.length ?? 0,
    live: liveEvents?.length ?? 0,
    voting_ended: votingEndedEvents?.length ?? 0,
    winners_announced: winnersAnnouncedEvents?.length ?? 0,
    archived: archivedEvents?.length ?? 0,
  }), [allEvents, draftEvents, readyForReviewEvents, publishedEvents, liveEvents, votingEndedEvents, winnersAnnouncedEvents, archivedEvents]);

  const filteredEvents = useMemo(() => {
    let list: any[] = [];
    if (activeTab === 'all') list = allEvents ?? [];
    else if (activeTab === 'draft') list = draftEvents ?? [];
    else if (activeTab === 'ready_for_review') list = readyForReviewEvents ?? [];
    else if (activeTab === 'published') list = publishedEvents ?? [];
    else if (activeTab === 'live') list = liveEvents ?? [];
    else if (activeTab === 'voting_ended') list = votingEndedEvents ?? [];
    else if (activeTab === 'winners_announced') list = winnersAnnouncedEvents ?? [];
    else if (activeTab === 'archived') list = archivedEvents ?? [];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q));
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeTab, search, allEvents, draftEvents, readyForReviewEvents, publishedEvents, liveEvents, votingEndedEvents, winnersAnnouncedEvents, archivedEvents]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteEvent({ eventId: deleteId as any, firebaseUid: user?.id });
      setDeleteId(null);
      toast.toast('Event deleted successfully', 'success');
    } catch (e: any) {
      const msg = e?.data?.message || e?.message || 'Delete failed';
      toast.toast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleTransitionRequest = (eventId: string, eventTitle: string, fromStatus: EventStatus, toStatus: EventStatus) => {
    setTransitionModal({ eventId, eventTitle, fromStatus, toStatus });
  };

  const handleTransitionConfirm = async () => {
    if (!transitionModal) return;
    setTransitioning(true);
    try {
      await transitionStatus({
        eventId: transitionModal.eventId as any,
        toStatus: transitionModal.toStatus,
        firebaseUid: user?.id,
      });
      toast.toast(`Event moved to "${STATUS_CONFIG[transitionModal.toStatus].label}"`, 'success');
      setTransitionModal(null);
    } catch (e: any) {
      toast.toast(e.message || 'Status change failed', 'error');
    } finally {
      setTransitioning(false);
    }
  };

  const handleDuplicate = async (eventId: string) => {
    try {
      const newId = await duplicateEvent({ eventId: eventId as any, firebaseUid: user?.id });
      toast.toast('Event duplicated as draft', 'success');
      navigate(`/dashboard/events/${newId}/manage`);
    } catch (e: any) {
      toast.toast(e.message || 'Duplication failed', 'error');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const emptyMessages: Record<TabKey, { title: string; subtitle: string }> = {
    all: { title: 'No events yet', subtitle: 'Create your first award event to start managing categories and nominees.' },
    draft: { title: 'No draft events', subtitle: 'Events you start creating will appear here as drafts.' },
    ready_for_review: { title: 'No events in review', subtitle: 'Submit a draft for review to see it here.' },
    published: { title: 'No published events', subtitle: 'Publish a draft event to make it visible to your audience.' },
    live: { title: 'No live events', subtitle: 'Go live from an event to start receiving votes in real-time.' },
    voting_ended: { title: 'No events with voting ended', subtitle: 'Events where voting has ended will appear here.' },
    winners_announced: { title: 'No winners announced', subtitle: 'Announce winners to see them here.' },
    closed: { title: 'No closed events', subtitle: 'Events that have ended will appear here.' },
    archived: { title: 'No archived events', subtitle: 'Events you archive will appear here.' },
  };

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Events & Awards</h1>
          <p className="text-dark-400">Manage your ceremonies, nominees, and categories.</p>
        </div>
        <Link to="/dashboard/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create New Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 lg:max-w-md">
                <Input
                  icon={Search}
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-1 border-b border-white/5 -mb-px overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'text-gold-500'
                      : 'text-dark-400 hover:text-dark-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-gold-500/10 text-gold-500' : 'bg-white/5 text-dark-500'
                    }`}>
                      {tabCounts[tab.key]}
                    </span>
                  </span>
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="events-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 text-gold-500 animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Trophy className="h-10 w-10 text-dark-600" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">{emptyMessages[activeTab].title}</h3>
              <p className="text-sm text-dark-500 max-w-sm mb-6">{emptyMessages[activeTab].subtitle}</p>
              {activeTab === 'all' && (
                <Link to="/dashboard/events/create">
                  <Button><Plus className="h-4 w-4 mr-2" /> Create Your First Event</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-medium text-dark-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Voting</th>
                    <th className="px-6 py-4">Categories</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {(event.bannerUrl || event.coverUrl) ? (
                            <img
                              src={event.bannerUrl || event.coverUrl}
                              className="h-12 w-20 rounded-lg object-cover"
                              alt=""
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div
                              className="h-12 w-20 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: (event.themeColor || '#c68a35') + '15' }}
                            >
                              <Trophy className="h-5 w-5" style={{ color: event.themeColor || '#c68a35' }} />
                            </div>
                          )}
                          <div>
                            <h4 className="text-white font-medium text-sm">{event.title}</h4>
                            {event.tagline && (
                              <p className="text-xs text-dark-500 mt-0.5 truncate max-w-[200px]">{event.tagline}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <EventStatusBadge
                          status={event.status as EventStatus}
                          onTransition={(toStatus) => handleTransitionRequest(
                            event._id,
                            event.title,
                            event.status as EventStatus,
                            toStatus
                          )}
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 w-1.5 rounded-full ${event.isVotingActive ? 'bg-emerald-400' : 'bg-dark-600'}`} />
                          <span className={`text-xs font-medium ${event.isVotingActive ? 'text-emerald-400' : 'text-dark-500'}`}>
                            {event.isVotingActive ? 'Active' : 'Off'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-dark-400">
                          {event.categoryCount ?? 0} categories
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {formatDate(event.date) ? (
                          <span className="text-sm text-dark-300">{formatDate(event.date)}</span>
                        ) : (
                          <span className="text-sm text-dark-600">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/dashboard/events/${event._id}/manage`}>
                            <Button variant="glass" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 bg-white/5 hover:bg-white/10">
                              Manage
                            </Button>
                          </Link>
                          <EventActionsDropdown
                            status={event.status as EventStatus}
                            eventId={event._id}
                            orgSlug={currentOrg?.slug}
                            onEdit={() => navigate(`/dashboard/events/${event._id}/manage`)}
                            onPreview={() => navigate(`/org/${currentOrg?.slug || event.orgId}/events/${event._id}`)}
                            onTransition={(toStatus) => handleTransitionRequest(
                              event._id,
                              event.title,
                              event.status as EventStatus,
                              toStatus
                            )}
                            onDuplicate={() => handleDuplicate(event._id)}
                            onDelete={() => setDeleteId(event._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Transition Confirmation Modal */}
      <StatusChangeConfirmModal
        open={!!transitionModal}
        fromStatus={transitionModal?.fromStatus || 'draft'}
        toStatus={transitionModal?.toStatus || 'draft'}
        eventTitle={transitionModal?.eventTitle || ''}
        onConfirm={handleTransitionConfirm}
        onCancel={() => setTransitionModal(null)}
        loading={transitioning}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteId(null)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <h2 className="text-2xl font-serif text-white mb-2">Delete Event?</h2>
              <p className="text-dark-400 text-sm mb-8">This action is permanent and will delete all categories, nominees, and voting history for this event.</p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full bg-rose-600 hover:bg-rose-700 border-rose-600 text-white"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setDeleteId(null)} disabled={deleting}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
