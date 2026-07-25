import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BookOpen, AlertTriangle, CheckCircle, Scale, FileText, Star } from 'lucide-react';

interface JudgeContext {
  selectedAssignment: any;
  currentEvent: any;
  currentOrg: any;
}

export function JudgeGuidelines() {
  const { currentEvent, currentOrg } = useOutletContext<JudgeContext>();

  const guidelines = currentEvent?.judgingGuidelines;
  const rules = currentEvent?.judgingRules;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Judging Guidelines</h1>
        <p className="text-dark-400 text-sm">Review the rules and criteria for this event.</p>
      </div>

      {/* Event Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-gold-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentEvent?.title}</h2>
              <p className="text-sm text-dark-400">{currentOrg?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Rules */}
      {rules && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-gold-500" />
              Scoring Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-dark-500 uppercase tracking-widest mb-1">Score Range</p>
                <p className="text-lg font-bold text-white">{rules.scoreRange?.min ?? 0} — {rules.scoreRange?.max ?? 10}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-dark-500 uppercase tracking-widest mb-1">Lock After Deadline</p>
                <p className="text-lg font-bold text-white">{rules.lockAfterDeadline ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-dark-500 uppercase tracking-widest mb-1">Allow Draft Saving</p>
                <p className="text-lg font-bold text-white">{rules.allowDraftSaving ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-dark-500 uppercase tracking-widest mb-1">Public vs Judge Weight</p>
                <p className="text-lg font-bold text-white">{rules.publicWeight ?? 50}% / {rules.judgeWeight ?? 50}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guidelines Text */}
      {guidelines && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold-500" />
              Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-sm text-dark-300 leading-relaxed whitespace-pre-wrap">
              {guidelines}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Default Guidelines */}
      {!guidelines && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold-500" />
              Standard Judging Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Be Fair and Impartial</p>
                  <p className="text-xs text-dark-400 mt-1">Judge each nominee based solely on their merits and the established criteria.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Use the Full Score Range</p>
                  <p className="text-xs text-dark-400 mt-1">Utilize the complete scoring range to differentiate between nominees effectively.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Provide Constructive Feedback</p>
                  <p className="text-xs text-dark-400 mt-1">Include meaningful comments to help nominees understand their evaluation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Meet Deadlines</p>
                  <p className="text-xs text-dark-400 mt-1">Submit all scores before the deadline to ensure timely results.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
