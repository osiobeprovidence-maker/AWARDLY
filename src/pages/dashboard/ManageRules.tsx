import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Save, RotateCcw, X, Shield, Globe, Clock, Scale,
  Users, AlertTriangle, CheckCircle, Vote, Percent, Lock, FileText,
  Timer, Target, Shuffle, Zap, Fingerprint, Ban, Eye, EyeOff,
  ChevronDown, Settings2, Award, Gavel
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../lib/toast';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
}

function Toggle({ enabled, onToggle, label, description }: ToggleProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors cursor-pointer group"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${enabled ? 'bg-gold-500/20 border-gold-500/30' : 'bg-dark-800 border-white/5'}`}>
          {enabled ? (
            <CheckCircle className="h-4 w-4 text-gold-500" />
          ) : (
            <Ban className="h-4 w-4 text-dark-500" />
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase tracking-widest">{label}</p>
          {description && <p className="text-[10px] text-dark-500">{description}</p>}
        </div>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-gold-500' : 'bg-dark-800'}`}>
        <div className={`absolute top-1 h-3 w-3 bg-dark-950 rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );
}

interface RadioGroupProps {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

function RadioGroup({ options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
            value === option.value
              ? 'bg-gold-500/10 border-gold-500/30'
              : 'bg-white/5 border-white/5 hover:bg-white/[0.07]'
          }`}
        >
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            value === option.value ? 'border-gold-500' : 'border-dark-600'
          }`}>
            {value === option.value && (
              <div className="h-2.5 w-2.5 rounded-full bg-gold-500" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">{option.label}</p>
            {option.description && (
              <p className="text-[10px] text-dark-500 mt-0.5">{option.description}</p>
            )}
          </div>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
        </label>
      ))}
    </div>
  );
}

const VOTING_METHODS = [
  { value: 'single', label: 'Single Choice', description: 'Voters select exactly one nominee' },
  { value: 'multiple', label: 'Multiple Choice', description: 'Voters can select multiple nominees' },
  { value: 'ranked', label: 'Ranked Choice', description: 'Voters rank nominees in order of preference' },
  { value: 'weighted', label: 'Weighted', description: 'Voters distribute weight across nominees' },
];

const CALCULATION_METHODS = [
  { value: 'highest', label: 'Highest Votes', description: 'Nominee with the most votes wins' },
  { value: 'weighted', label: 'Weighted Score', description: 'Combines public and judge scores with configurable weights' },
  { value: 'judge', label: 'Judge Panel', description: 'Winner decided exclusively by judge scores' },
  { value: 'hybrid', label: 'Hybrid', description: 'Combines public votes, judge scores, and bonus factors' },
];

const TIEBREAKER_OPTIONS = [
  { value: 'time', label: 'Time-based', description: 'Earlier nominee with equal votes wins' },
  { value: 'judge', label: 'Judge Decision', description: 'Judges cast a tiebreaker vote' },
  { value: 'shared', label: 'Shared Winner', description: 'Multiple winners declared' },
];

const DUPLICATE_POLICIES = [
  { value: 'allow', label: 'Allow', description: 'Permit duplicate submissions' },
  { value: 'block', label: 'Block', description: 'Prevent duplicate submissions outright' },
  { value: 'flag', label: 'Flag', description: 'Allow but mark for manual review' },
];

const DEFAULT_STATE = {
  votingMethod: 'multiple',
  publicVoting: true,
  judgeVoting: false,
  voteWeight: 1,
  maxVotesPerUser: 50,
  minVotesPerUser: 1,
  allowAnonymousVoting: false,
  nominationStart: '2026-06-01',
  nominationEnd: '2026-07-15',
  votingStart: '2026-08-01',
  votingEnd: '2026-09-01',
  eligibilityRequirements: 'Voters must be registered users with verified email addresses. Minimum account age of 30 days required.',
  geographicRestrictions: 'Open worldwide. No geographic restrictions applied.',
  calculationMethod: 'weighted',
  tiebreaker: 'time',
  minimumVotesRequired: 10,
  enableAutoWinner: true,
  duplicatePolicy: 'flag',
  fraudPrevention: true,
  ipLimitation: false,
  deviceFingerprinting: false,
  requireTermsAcceptance: true,
  customTermsUrl: '',
};

export function ManageRules() {
  const { eventId, categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rules, setRules] = React.useState(DEFAULT_STATE);
  const [hasChanges, setHasChanges] = React.useState(false);

  const updateRule = <K extends keyof typeof rules>(key: K, value: (typeof rules)[K]) => {
    setRules((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    toast('Voting rules saved successfully', 'success');
    setTimeout(() => navigate(-1), 600);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleReset = () => {
    if (window.confirm('Reset all rules to default values? This cannot be undone.')) {
      setRules(DEFAULT_STATE);
      setHasChanges(false);
      toast('Rules reset to defaults', 'info');
    }
  };

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl py-6 -mt-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="h-4 w-4 text-gold-500" />
              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Voting Rules</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">
              Manage <span className="text-dark-500 not-italic">Rules</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 animate-pulse">Unsaved</span>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-dark-400 hover:text-white">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button onClick={handleSave} className="shadow-lg shadow-gold-500/20">
            <Save className="h-4 w-4 mr-2" /> Save Rules
          </Button>
        </div>
      </div>

      {/* Voting Configuration */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">01. Voting Configuration</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gold-500/20 flex items-center justify-center border border-gold-500/30">
                <Vote className="h-4 w-4 text-gold-500" />
              </div>
              Voting Method & Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Method</label>
              <RadioGroup
                options={VOTING_METHODS}
                value={rules.votingMethod}
                onChange={(v) => updateRule('votingMethod', v)}
                name="votingMethod"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Visibility</label>
              <Toggle
                enabled={rules.publicVoting}
                onToggle={() => updateRule('publicVoting', !rules.publicVoting)}
                label="Public Voting"
                description="Allow any registered user to vote in this category"
              />
              <Toggle
                enabled={rules.judgeVoting}
                onToggle={() => updateRule('judgeVoting', !rules.judgeVoting)}
                label="Judge Voting"
                description="Allow designated judges to cast expert votes"
              />
              <Toggle
                enabled={rules.allowAnonymousVoting}
                onToggle={() => updateRule('allowAnonymousVoting', !rules.allowAnonymousVoting)}
                label="Allow Anonymous Voting"
                description="Hide voter identity from public results"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Vote Weight</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={rules.voteWeight}
                  onChange={(e) => updateRule('voteWeight', Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                />
                <p className="text-[10px] text-dark-500 italic">Multiplier applied to each vote (1-10).</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Maximum Votes Per User</label>
                <Input
                  type="number"
                  min={1}
                  value={rules.maxVotesPerUser}
                  onChange={(e) => updateRule('maxVotesPerUser', Math.max(1, parseInt(e.target.value) || 1))}
                />
                <p className="text-[10px] text-dark-500 italic">Upper limit per voter.</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Minimum Votes Per User</label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={rules.minVotesPerUser}
                  onChange={(e) => updateRule('minVotesPerUser', Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                />
                <p className="text-[10px] text-dark-500 italic">Required minimum before vote is valid.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Eligibility & Periods */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">02. Eligibility & Periods</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Clock className="h-4 w-4 text-emerald-500" />
              </div>
              Nomination & Voting Periods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Nomination Period Start</label>
                <Input
                  type="date"
                  value={rules.nominationStart}
                  onChange={(e) => updateRule('nominationStart', e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Nomination Period End</label>
                <Input
                  type="date"
                  value={rules.nominationEnd}
                  onChange={(e) => updateRule('nominationEnd', e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Period Start</label>
                <Input
                  type="date"
                  value={rules.votingStart}
                  onChange={(e) => updateRule('votingStart', e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Period End</label>
                <Input
                  type="date"
                  value={rules.votingEnd}
                  onChange={(e) => updateRule('votingEnd', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Eligibility Requirements</label>
              <textarea
                value={rules.eligibilityRequirements}
                onChange={(e) => updateRule('eligibilityRequirements', e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 backdrop-blur-sm transition-colors focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
              />
              <p className="text-[10px] text-dark-500 italic">Define who is eligible to participate in this category.</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Geographic Restrictions</label>
              <textarea
                value={rules.geographicRestrictions}
                onChange={(e) => updateRule('geographicRestrictions', e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 backdrop-blur-sm transition-colors focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
              />
              <p className="text-[10px] text-dark-500 italic">Restrict voting access based on geographical regions.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Winner Calculation */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">03. Winner Calculation</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Award className="h-4 w-4 text-purple-400" />
              </div>
              Scoring & Tiebreakers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Calculation Method</label>
              <RadioGroup
                options={CALCULATION_METHODS}
                value={rules.calculationMethod}
                onChange={(v) => updateRule('calculationMethod', v)}
                name="calculationMethod"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Tiebreaker Policy</label>
              <RadioGroup
                options={TIEBREAKER_OPTIONS}
                value={rules.tiebreaker}
                onChange={(v) => updateRule('tiebreaker', v)}
                name="tiebreaker"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Minimum Votes Required</label>
                <Input
                  type="number"
                  min={0}
                  value={rules.minimumVotesRequired}
                  onChange={(e) => updateRule('minimumVotesRequired', Math.max(0, parseInt(e.target.value) || 0))}
                />
                <p className="text-[10px] text-dark-500 italic">Nominees must receive at least this many votes to qualify.</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-2">Auto-winner Selection</label>
                <Toggle
                  enabled={rules.enableAutoWinner}
                  onToggle={() => updateRule('enableAutoWinner', !rules.enableAutoWinner)}
                  label="Enable Auto-winner"
                  description="Automatically announce winner when voting period ends"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Advanced Rules */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 whitespace-nowrap">04. Advanced Rules</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <Shield className="h-4 w-4 text-rose-400" />
              </div>
              Security & Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Duplicate Submission Policy</label>
              <RadioGroup
                options={DUPLICATE_POLICIES}
                value={rules.duplicatePolicy}
                onChange={(v) => updateRule('duplicatePolicy', v)}
                name="duplicatePolicy"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Fraud Prevention</label>
              <Toggle
                enabled={rules.fraudPrevention}
                onToggle={() => updateRule('fraudPrevention', !rules.fraudPrevention)}
                label="Fraud Prevention"
                description="Enable automated detection of suspicious voting patterns"
              />
              <Toggle
                enabled={rules.ipLimitation}
                onToggle={() => updateRule('ipLimitation', !rules.ipLimitation)}
                label="IP Limitation"
                description="Restrict votes to one per IP address"
              />
              <Toggle
                enabled={rules.deviceFingerprinting}
                onToggle={() => updateRule('deviceFingerprinting', !rules.deviceFingerprinting)}
                label="Device Fingerprinting"
                description="Track device signatures to prevent multi-account voting"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Terms & Compliance</label>
              <Toggle
                enabled={rules.requireTermsAcceptance}
                onToggle={() => updateRule('requireTermsAcceptance', !rules.requireTermsAcceptance)}
                label="Require Terms Acceptance"
                description="Voters must agree to terms before casting a vote"
              />
              {!rules.requireTermsAcceptance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Input
                    placeholder="https://yourdomain.com/terms"
                    value={rules.customTermsUrl}
                    onChange={(e) => updateRule('customTermsUrl', e.target.value)}
                  />
                  <p className="text-[10px] text-dark-500 italic">Enter a URL for your custom terms page.</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-white/5">
        <Button variant="ghost" onClick={handleReset} className="text-dark-400 hover:text-white">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="shadow-lg shadow-gold-500/20">
          <Save className="h-4 w-4 mr-2" /> Save Rules
        </Button>
      </div>
    </div>
  );
}
