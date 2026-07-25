import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../../lib/toast';
import { cn } from '../../lib/utils';
import {
  Users, UserPlus, Mail, Calendar, Trophy, ChevronDown, X,
  Trash2, Clock, CheckCircle, AlertCircle, Settings, Send,
} from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';

export function JudgeManagement() {
  const { currentOrg } = useAuth();
  const { toast } = useToast();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignJudgeId, setAssignJudgeId] = useState<string | null>(null);
  const [assignCategoryIds, setAssignCategoryIds] = useState<string[]>([]);

  // Fetch events for this org (with categories)
  const events = useQuery(
    api.events.queries.getByOrgWithCategories,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  // Fetch judges for this org
  const judges = useQuery(
    api.judges.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as Id<'organizations'> } : 'skip'
  ) ?? [];

  // Fetch categories for selected event
  const selectedEvent = events.find((e: any) => e._id === selectedEventId);
  const categories = (selectedEvent as any)?.categories ?? [];

  const inviteJudge = useMutation(api.judges.mutations.invite);
  const assignCategories = useMutation(api.judges.mutations.assignCategories);
  const updateDeadline = useMutation(api.judges.mutations.updateDeadline);
  const removeJudge = useMutation(api.judges.mutations.remove);

  const handleInvite = async () => {
    if (!inviteEmail || !selectedEventId || !currentOrg) return;
    setIsInviting(true);
    try {
      await inviteJudge({
        orgId: currentOrg.id as Id<'organizations'>,
        eventId: selectedEventId as Id<'events'>,
        email: inviteEmail,
        categoryIds: selectedCategoryIds as Id<'categories'>[],
        deadline: deadline || undefined,
        notes: notes || undefined,
      });
      toast('Judge invited successfully', 'success');
      setShowInviteModal(false);
      setInviteEmail('');
      setSelectedEventId(null);
      setSelectedCategoryIds([]);
      setDeadline('');
      setNotes('');
    } catch (e: any) {
      toast(e.message || 'Failed to invite judge', 'error');
    } finally {
      setIsInviting(false);
    }
  };

  const handleAssignCategories = async () => {
    if (!assignJudgeId) return;
    try {
      await assignCategories({
        judgeId: assignJudgeId as Id<'judges'>,
        categoryIds: assignCategoryIds as Id<'categories'>[],
      });
      toast('Categories updated', 'success');
      setShowAssignModal(false);
      setAssignJudgeId(null);
      setAssignCategoryIds([]);
    } catch (e: any) {
      toast(e.message || 'Failed to update categories', 'error');
    }
  };

  const handleRemoveJudge = async (judgeId: string) => {
    if (!confirm('Remove this judge?')) return;
    try {
      await removeJudge({ judgeId: judgeId as Id<'judges'> });
      toast('Judge removed', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to remove judge', 'error');
    }
  };

  const handleUpdateDeadline = async (judgeId: string, newDeadline: string) => {
    try {
      await updateDeadline({
        judgeId: judgeId as Id<'judges'>,
        deadline: newDeadline,
      });
      toast('Deadline updated', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to update deadline', 'error');
    }
  };

  const statusColors: Record<string, string> = {
    invited: 'text-amber-500 bg-amber-500/10',
    accepted: 'text-emerald-500 bg-emerald-500/10',
    declined: 'text-rose-500 bg-rose-500/10',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Judge Management</h1>
          <p className="text-dark-400 text-sm">Invite judges, assign categories, and track progress.</p>
        </div>
        <Button variant="primary" onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Invite Judge
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Total Judges</p>
            <p className="text-2xl font-serif text-white">{judges.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Accepted</p>
            <p className="text-2xl font-serif text-emerald-500">{judges.filter((j: any) => j.status === 'accepted').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-2xl font-serif text-amber-500">{judges.filter((j: any) => j.status === 'invited').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Declined</p>
            <p className="text-2xl font-serif text-rose-500">{judges.filter((j: any) => j.status === 'declined').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Judges List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gold-500" />
            All Judges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {judges.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-white mb-2">No judges yet</h3>
              <p className="text-sm text-dark-400 mb-4">Invite judges to evaluate nominees in your events.</p>
              <Button variant="primary" onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 mx-auto">
                <UserPlus className="h-4 w-4" /> Invite First Judge
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {judges.map((judge: any) => (
                <div key={judge._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 text-xs font-bold border border-gold-500/20">
                      {judge.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{judge.user?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-dark-400">{judge.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-dark-400">{judge.event?.title ?? 'Unknown Event'}</p>
                      <p className="text-xs text-dark-500">{judge.categoryIds.length} categories</p>
                    </div>

                    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full", statusColors[judge.status] ?? 'text-dark-400 bg-dark-800')}>
                      {judge.status}
                    </span>

                    {judge.deadline && (
                      <div className="flex items-center gap-1 text-xs text-dark-400">
                        <Clock className="h-3 w-3" />
                        {new Date(judge.deadline).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setAssignJudgeId(judge._id);
                          setAssignCategoryIds(judge.categoryIds);
                          setShowAssignModal(true);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Assign categories"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveJudge(judge._id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove judge"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Invite Judge</h2>
              <button onClick={() => setShowInviteModal(false)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-white block mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="judge@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <p className="text-xs text-dark-500 mt-1">They must already have an Awwardly account.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Event</label>
                <select
                  value={selectedEventId ?? ''}
                  onChange={(e) => { setSelectedEventId(e.target.value); setSelectedCategoryIds([]); }}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 appearance-none"
                >
                  <option value="" className="bg-dark-900">Select event...</option>
                  {events.map((event: any) => (
                    <option key={event._id} value={event._id} className="bg-dark-900">{event.title}</option>
                  ))}
                </select>
              </div>

              {selectedEventId && categories.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-white block mb-2">Categories</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map((cat: any) => (
                      <label key={cat._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(cat._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategoryIds([...selectedCategoryIds, cat._id]);
                            } else {
                              setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat._id));
                            }
                          }}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50"
                        />
                        <span className="text-sm text-white">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-white block mb-2">Deadline (optional)</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any instructions for the judge..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-white/5">
              <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleInvite}
                disabled={!inviteEmail || !selectedEventId || isInviting}
                className="flex items-center gap-2"
              >
                {isInviting ? (
                  <span className="h-4 w-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Categories Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Assign Categories</h2>
              <button onClick={() => setShowAssignModal(false)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-dark-400 mb-4">Select categories for this judge to evaluate.</p>
              {/* We need to show categories from the judge's event */}
              {(() => {
                const judge = judges.find((j: any) => j._id === assignJudgeId);
                if (!judge) return <p className="text-dark-500">Judge not found</p>;
                const event = events.find((e: any) => e._id === judge.eventId);
                const eventCategories = (event as any)?.categories ?? [];
                if (eventCategories.length === 0) return <p className="text-dark-500">No categories available</p>;
                return (
                  <div className="space-y-2">
                    {eventCategories.map((cat: any) => (
                      <label key={cat._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-white/5">
                        <input
                          type="checkbox"
                          checked={assignCategoryIds.includes(cat._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignCategoryIds([...assignCategoryIds, cat._id]);
                            } else {
                              setAssignCategoryIds(assignCategoryIds.filter(id => id !== cat._id));
                            }
                          }}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50"
                        />
                        <div>
                          <span className="text-sm text-white">{cat.name}</span>
                          <span className="text-xs text-dark-500 ml-2">({cat.nomineeCount} nominees)</span>
                        </div>
                      </label>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-white/5">
              <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAssignCategories} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
