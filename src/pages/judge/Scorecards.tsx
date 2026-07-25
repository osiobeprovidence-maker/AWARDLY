import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ClipboardList, CheckCircle, Clock, Lock, ArrowRight, Trophy } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { cn } from '../../lib/utils';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

export function Scorecards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedAssignment, currentEvent } = useOutletContext<JudgeContext>();

  const scores = useQuery(
    api.judgeScores.queries.getByJudge,
    selectedAssignment ? { judgeId: selectedAssignment._id } : 'skip'
  ) ?? [];

  const categories = selectedAssignment?.categories ?? [];

  // Group scores by category
  const scoresByCategory = categories.map((cat: any) => ({
    category: cat,
    scores: scores.filter((s: any) => s.categoryId === cat._id),
  }));

  const submittedScores = scores.filter((s: any) => s.status === 'submitted' || s.status === 'locked');
  const draftScores = scores.filter((s: any) => s.status === 'draft');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Scorecards</h1>
        <p className="text-dark-400 text-sm">View all your submitted and draft scores.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Submitted</p>
            <p className="text-2xl font-serif text-emerald-500">{submittedScores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Drafts</p>
            <p className="text-2xl font-serif text-amber-500">{draftScores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Total</p>
            <p className="text-2xl font-serif text-white">{scores.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Scorecards by Category */}
      <div className="space-y-6">
        {scoresByCategory.map(({ category, scores: catScores }) => (
          <Card key={category._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold-500" />
                  {category.name}
                </CardTitle>
                <button
                  onClick={() => navigate(`/judge/nominees/${category._id}`)}
                  className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-1"
                >
                  Judge <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {catScores.length === 0 ? (
                <p className="text-sm text-dark-500 py-4 text-center">No scores yet for this category.</p>
              ) : (
                <div className="space-y-2">
                  {catScores.map((score: any) => (
                    <div key={score._id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        {score.status === 'submitted' || score.status === 'locked' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : score.status === 'locked' ? (
                          <Lock className="h-4 w-4 text-dark-500 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm text-white">{score.nomineeName}</p>
                          <p className="text-xs text-dark-500">
                            {score.status === 'draft' ? 'Draft' : 'Submitted'}
                            {score.submittedAt && ` · ${new Date(score.submittedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gold-500">{score.totalScore}/{score.maxTotalScore}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
