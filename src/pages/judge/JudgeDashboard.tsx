import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Trophy, ClipboardList, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

function formatDeadline(deadline?: string) {
  if (!deadline) return 'No deadline set';
  const d = new Date(deadline);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function JudgeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedAssignment, currentEvent, currentOrg } = useOutletContext<JudgeContext>();

  const progress = useQuery(
    api.judges.queries.getMyProgress,
    user && user.convexUserId && currentEvent
      ? { userId: user.convexUserId as any, eventId: currentEvent._id ?? selectedAssignment?.eventId }
      : 'skip'
  );

  const assignedCategories = selectedAssignment?.categories ?? [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-dark-400 mb-1">{getGreeting()}, {user?.name ?? 'Judge'}</p>
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">
          {currentEvent?.title ?? 'Judge Dashboard'}
        </h1>
        <p className="text-dark-500 mt-2 text-sm">Evaluate nominees and submit your scores.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-gold-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Assigned Categories</p>
            <p className="text-2xl font-serif text-white">{assignedCategories.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Pending Reviews</p>
            <p className="text-2xl font-serif text-white">{progress?.remaining ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Completed Reviews</p>
            <p className="text-2xl font-serif text-white">{progress?.completed ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-violet-500" />
              </div>
            </div>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Submission Deadline</p>
            <p className="text-lg font-serif text-white">{formatDeadline(progress?.deadline)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {progress && progress.assigned > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">Overall Progress</p>
              <p className="text-sm text-gold-500 font-bold">{progress.percentage}%</p>
            </div>
            <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-dark-500 mt-2">{progress.completed} of {progress.assigned} nominees scored</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/judge/categories')}
          className="p-6 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-500/5 border border-gold-500/20 hover:border-gold-500/40 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white mb-1">Continue Judging</p>
              <p className="text-xs text-dark-400">Review nominees and submit scores</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gold-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => navigate('/judge/guidelines')}
          className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white mb-1">Judging Guidelines</p>
              <p className="text-xs text-dark-400">Review rules and scoring criteria</p>
            </div>
            <ArrowRight className="h-5 w-5 text-dark-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
}
