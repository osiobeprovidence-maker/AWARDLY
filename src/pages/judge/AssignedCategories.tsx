import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trophy, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

export function AssignedCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedAssignment } = useOutletContext<JudgeContext>();

  const categories = selectedAssignment?.categories ?? [];

  // Get scores for each category to show completion status
  const allScores = useQuery(
    api.judgeScores.queries.getByJudge,
    selectedAssignment ? { judgeId: selectedAssignment._id } : 'skip'
  ) ?? [];

  const getCompletedCount = (categoryId: string) => {
    return allScores.filter(
      (s) => s.categoryId === categoryId && (s.status === 'submitted' || s.status === 'locked')
    ).length;
  };

  if (categories.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Assigned Categories</h1>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-white mb-2">No categories assigned</h3>
            <p className="text-sm text-dark-400">You haven't been assigned to any categories yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Assigned Categories</h1>
        <p className="text-dark-400 text-sm">Select a category to start reviewing nominees.</p>
      </div>

      <div className="grid gap-4">
        {categories.map((cat: any) => {
          const completed = getCompletedCount(cat._id);
          const isComplete = cat.nomineeCount > 0 && completed >= cat.nomineeCount;
          return (
            <button
              key={cat._id}
              onClick={() => navigate(`/judge/nominees/${cat._id}`)}
              className="w-full text-left"
            >
              <Card className="hover:border-gold-500/30 transition-all group cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isComplete ? 'bg-emerald-500/10' : 'bg-gold-500/10'}`}>
                        {isComplete ? (
                          <CheckCircle className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <Trophy className="h-6 w-6 text-gold-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{cat.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-dark-400 flex items-center gap-1">
                            <Users className="h-3 w-3" /> {cat.nomineeCount} nominees
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-widest ${isComplete ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {isComplete ? 'Completed' : `${completed}/${cat.nomineeCount} scored`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-dark-500 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
