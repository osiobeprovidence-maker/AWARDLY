import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { BarChart3, Trophy, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

export function JudgeProgress() {
  const { user } = useAuth();
  const { selectedAssignment, currentEvent } = useOutletContext<JudgeContext>();

  const progress = useQuery(
    api.judges.queries.getMyProgress,
    user && user.convexUserId && currentEvent
      ? { userId: user.convexUserId as any, eventId: currentEvent._id || selectedAssignment?.eventId }
      : 'skip'
  );

  const scores = useQuery(
    api.judgeScores.queries.getByJudge,
    selectedAssignment ? { judgeId: selectedAssignment._id } : 'skip'
  ) ?? [];

  const categories = selectedAssignment?.categories ?? [];

  const getDeadlineWarning = () => {
    if (!progress?.deadline) return null;
    const deadline = new Date(progress.deadline);
    const now = new Date();
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursLeft < 0) return { text: 'Deadline has passed', type: 'overdue' as const };
    if (hoursLeft < 24) return { text: `${Math.round(hoursLeft)} hours remaining`, type: 'urgent' as const };
    if (hoursLeft < 72) return { text: `${Math.round(hoursLeft / 24)} days remaining`, type: 'warning' as const };
    return null;
  };

  const deadlineWarning = getDeadlineWarning();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">My Progress</h1>
        <p className="text-dark-400 text-sm">Track your judging progress across all assigned categories.</p>
      </div>

      {/* Deadline Warning */}
      {deadlineWarning && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          deadlineWarning.type === 'overdue' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
          deadlineWarning.type === 'urgent' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
          'bg-gold-500/10 border-gold-500/30 text-gold-500'
        }`}>
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{deadlineWarning.text}</span>
        </div>
      )}

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-bold text-white">Overall Progress</p>
              <p className="text-sm text-dark-400 mt-1">
                {progress?.completed ?? 0} of {progress?.assigned ?? 0} nominees scored
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-serif text-gold-500">{progress?.percentage ?? 0}%</p>
            </div>
          </div>
          <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-700"
              style={{ width: `${progress?.percentage ?? 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-dark-500">
            <span>Started</span>
            <span>{progress?.percentage ?? 0}% Complete</span>
            <span>Finished</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Category Breakdown</h2>
        {categories.map((cat: any) => {
          const catScores = scores.filter((s: any) => s.categoryId === cat._id);
          const submitted = catScores.filter((s: any) => s.status === 'submitted' || s.status === 'locked').length;
          const drafts = catScores.filter((s: any) => s.status === 'draft').length;
          const total = cat.nomineeCount || 0;
          const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;

          return (
            <Card key={cat._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{cat.name}</h3>
                  <span className="text-sm font-bold text-gold-500">{pct}%</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-dark-400">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" /> {submitted} submitted</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /> {drafts} drafts</span>
                  <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-dark-500" /> {total} total</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Average Score Given</p>
            <p className="text-2xl font-serif text-white">
              {scores.length > 0
                ? (scores.reduce((sum: number, s: any) => sum + (s.totalScore / s.maxTotalScore), 0) / scores.length * 100).toFixed(1) + '%'
                : '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Total Reviews</p>
            <p className="text-2xl font-serif text-white">{scores.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
