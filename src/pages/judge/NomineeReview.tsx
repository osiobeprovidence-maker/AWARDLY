import React, { useState } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../../lib/toast';
import { cn } from '../../lib/utils';
import type { Id } from '../../../convex/_generated/dataModel';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

export function NomineeReview() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { selectedAssignment, currentEvent, currentOrg } = useOutletContext<JudgeContext>();

  const nominees = useQuery(
    api.judgeScores.queries.getByJudgeAndCategory,
    selectedAssignment && categoryId
      ? { judgeId: selectedAssignment._id as Id<'judges'>, categoryId: categoryId as Id<'categories'> }
      : 'skip'
  ) ?? [];

  const existingScores = nominees;

  const category = selectedAssignment?.categories?.find((c: any) => c._id === categoryId);

  const submitScore = useMutation(api.judgeScores.mutations.submitScore);
  const saveDraft = useMutation(api.judgeScores.mutations.saveDraft);

  const [currentNomineeIndex, setCurrentNomineeIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentNominee = nominees[currentNomineeIndex];

  const criteria = category?.judgingCriteria ?? [];

  const existingScore = existingScores.find(
    (s: any) => s.nomineeId === currentNominee?.nomineeId && s.status !== 'draft'
  );

  React.useEffect(() => {
    if (currentNominee?.nomineeId) {
      const existing = existingScores.find(
        (s: any) => s.nomineeId === currentNominee.nomineeId
      );
      if (existing?.criteriaScores) {
        const newScores: Record<string, string> = {};
        existing.criteriaScores.forEach((cs: any) => {
          newScores[cs.criteriaId] = String(cs.score);
        });
        setScores(newScores);
        setComment(existing.comment || '');
      } else {
        setScores({});
        setComment('');
      }
    }
  }, [currentNominee?.nomineeId, existingScores]);

  const handleScoreChange = (criteriaId: string, value: string) => {
    setScores(prev => ({ ...prev, [criteriaId]: value }));
  };

  const totalScore: number = (Object.values(scores) as string[]).reduce<number>((sum, val) => sum + (parseFloat(val) || 0), 0);
  const maxTotal: number = (criteria as any[]).reduce<number>((sum, c) => sum + (c.maxScore || 10), 0);

  const handleSubmit = async () => {
    if (!currentNominee || !currentEvent || !categoryId) return;
    setIsSubmitting(true);
    try {
      const criteriaScores = criteria.map((c: any) => ({
        criteriaId: c.id,
        label: c.label,
        score: parseFloat(scores[c.id] || '0') || 0,
        maxScore: c.maxScore || 10,
      }));

      await submitScore({
        judgeId: selectedAssignment._id as Id<'judges'>,
        categoryId: categoryId as Id<'categories'>,
        nomineeId: currentNominee.nomineeId as Id<'nominees'>,
        criteriaScores,
        totalScore,
        maxTotalScore: maxTotal,
        comment,
      });

      toast('Score submitted!', 'success');
      if (currentNomineeIndex < nominees.length - 1) {
        setCurrentNomineeIndex(currentNomineeIndex + 1);
      }
    } catch (e: any) {
      toast(e.message || 'Failed to submit score', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentNominee || !currentEvent || !categoryId) return;
    try {
      const criteriaScores = criteria.map((c: any) => ({
        criteriaId: c.id,
        label: c.label,
        score: parseFloat(scores[c.id] || '0') || 0,
        maxScore: c.maxScore || 10,
      }));

      await saveDraft({
        judgeId: selectedAssignment._id as Id<'judges'>,
        categoryId: categoryId as Id<'categories'>,
        nomineeId: currentNominee.nomineeId as Id<'nominees'>,
        criteriaScores,
        totalScore,
        maxTotalScore: maxTotal,
        comment,
      });

      toast('Draft saved', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to save draft', 'error');
    }
  };

  if (nominees.length === 0) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/judge/categories')} className="flex items-center gap-2 text-dark-400 hover:text-white text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to categories
        </button>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-dark-400">No nominees to review in this category.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/judge/categories')} className="flex items-center gap-2 text-dark-400 hover:text-white text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to categories
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">{category?.name ?? 'Category'}</h1>
          <p className="text-sm text-dark-400 mt-1">
            Nominee {currentNomineeIndex + 1} of {nominees.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentNomineeIndex(Math.max(0, currentNomineeIndex - 1))}
            disabled={currentNomineeIndex === 0}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentNomineeIndex(Math.min(nominees.length - 1, currentNomineeIndex + 1))}
            disabled={currentNomineeIndex === nominees.length - 1}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Nominee Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            {currentNominee?.nomineePhoto && (
              <img src={currentNominee.nomineePhoto} alt="" className="h-20 w-20 rounded-xl object-cover border border-white/10" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{currentNominee?.nomineeName}</h2>
              {currentNominee?.nomineeDescription && (
                <p className="text-sm text-dark-400 mt-1">{currentNominee.nomineeDescription}</p>
              )}
              {existingScore && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">Already scored: {existingScore.totalScore}/{existingScore.maxTotalScore}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {criteria.map((c: any) => (
              <div key={c.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-white">{c.label}</label>
                  {c.description && <p className="text-xs text-dark-500 mt-1">{c.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={c.maxScore || 10}
                    step="0.5"
                    value={scores[c.id] || ''}
                    onChange={(e) => handleScoreChange(c.id, e.target.value)}
                    className="w-20 h-10 px-3 text-center rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                  <span className="text-sm text-dark-500">/ {c.maxScore || 10}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Total Score</span>
            <span className="text-lg font-bold text-gold-500">{totalScore} / {maxTotal}</span>
          </div>

          {/* Comment */}
          <div className="mt-4">
            <label className="text-sm font-medium text-white block mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any notes about this nominee..."
              className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={handleSaveDraft}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit Score
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nominee Navigation Dots */}
      <div className="flex justify-center gap-2">
        {nominees.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => setCurrentNomineeIndex(i)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all",
              i === currentNomineeIndex ? "bg-gold-500 w-6" : "bg-dark-600 hover:bg-dark-500"
            )}
          />
        ))}
      </div>
    </div>
  );
}
