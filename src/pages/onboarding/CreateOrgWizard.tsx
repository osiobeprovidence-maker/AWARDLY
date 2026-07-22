import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Building2, Palette, Globe, Link2, ShieldCheck, CheckCircle2,
  ChevronRight, ChevronLeft, FileText, Camera, Phone, Mail,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Plus, X
} from 'lucide-react';
import {
  COUNTRIES, ORG_TYPES, EMPTY_ORG_WIZARD, type OrgWizardDraft, type Organization, type OrganizationType
} from '../../types';
import { useAuth } from '../../lib/auth';
import { ImageUpload } from '../../components/ImageUpload';

const STEPS = [
  { label: 'Basic Info', icon: Building2 },
  { label: 'Branding', icon: Palette },
  { label: 'Details', icon: Globe },
  { label: 'Social Links', icon: Link2 },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Review', icon: CheckCircle2 },
];

const DRAFT_KEY = 'awardly_org_draft';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function CreateOrgWizard() {
  const navigate = useNavigate();
  const { createOrganization, user } = useAuth();
  const [draft, setDraft] = useState<OrgWizardDraft>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* noop */ }
    return { ...EMPTY_ORG_WIZARD };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const step = draft.step;
  const setStep = (s: number) => setDraft(d => ({ ...d, step: s }));

  // Auto-save
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const update = <K extends keyof OrgWizardDraft>(key: K, value: OrgWizardDraft[K]) => {
    setDraft(d => {
      const next = { ...d, [key]: value };
      if (key === 'name' && !d.slug) next.slug = slugify(value as string);
      return next;
    });
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validateStep = useCallback((s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!draft.name.trim()) errs.name = 'Organization name is required';
      if (!draft.slug.trim()) errs.slug = 'Username is required';
      if (draft.slug.length < 3) errs.slug = 'Username must be at least 3 characters';
      if (!draft.type) errs.type = 'Organization type is required';
      if (!draft.description.trim()) errs.description = 'Description is required';
    }
    if (s === 2) {
      if (!draft.contactEmail.trim()) errs.contactEmail = 'Contact email is required';
      if (!draft.country) errs.country = 'Country is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [draft]);

  const next = () => {
    if (validateStep(step)) setStep(step + 1);
  };
  const prev = () => setStep(step - 1);

  const finish = () => {
    const org: Organization = {
      id: `org_${Date.now()}`,
      name: draft.name,
      slug: draft.slug,
      description: draft.description,
      type: draft.type as OrganizationType,
      logoUrl: draft.logoUrl || undefined,
      coverUrl: draft.coverUrl || undefined,
      primaryColor: draft.primaryColor,
      secondaryColor: draft.secondaryColor,
      website: draft.website || undefined,
      country: draft.country,
      headquarters: draft.headquarters || undefined,
      foundedYear: draft.foundedYear ? parseInt(draft.foundedYear) : undefined,
      contactEmail: draft.contactEmail,
      phone: draft.phone || undefined,
      socialLinks: draft.socialLinks,
      isVerified: false,
      verificationStatus: 'none',
      followerCount: 0,
      memberCount: 1,
      eventCount: 0,
      createdAt: new Date().toISOString(),
    };
    createOrganization(org);
    localStorage.removeItem(DRAFT_KEY);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-gold-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 bg-gold-500/10 rounded-2xl border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-7 w-7 text-gold-500" />
        </motion.div>
        <h1 className="text-2xl font-serif text-white mb-1">Create Organization</h1>
        <p className="text-dark-400 text-sm">Set up your public profile and community hub</p>
      </div>

      {/* Step Indicator */}
      <div className="relative z-10 px-6 mb-8">
        <div className="flex items-center justify-center gap-1 max-w-2xl mx-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  i === step
                    ? 'bg-gold-500 text-dark-950'
                    : i < step
                    ? 'bg-gold-500/10 text-gold-500 cursor-pointer hover:bg-gold-500/20'
                    : 'bg-white/5 text-dark-500'
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < step ? 'bg-gold-500/40' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="relative z-10 flex-1 px-6 pb-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-8 rounded-2xl border border-white/10"
            >
              {step === 0 && <StepBasicInfo draft={draft} update={update} errors={errors} />}
              {step === 1 && <StepBranding draft={draft} update={update} />}
              {step === 2 && <StepDetails draft={draft} update={update} errors={errors} />}
              {step === 3 && <StepSocialLinks draft={draft} update={update} />}
              {step === 4 && <StepVerification draft={draft} />}
              {step === 5 && <StepReview draft={draft} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <div>
              {step > 0 && (
                <Button variant="ghost" onClick={prev}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-500">
              <span className="font-bold text-gold-500">{step + 1}</span> / {STEPS.length}
            </div>
            <div>
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>
                  Continue <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={finish} className="shadow-xl shadow-gold-500/20">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Create Organization
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Basic Info ─────────────────────────────────────────────────────
function StepBasicInfo({ draft, update, errors }: { draft: OrgWizardDraft; update: <K extends keyof OrgWizardDraft>(k: K, v: OrgWizardDraft[K]) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-white">Basic Information</h2>
      <p className="text-dark-400 text-sm">Tell us about your organization</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Organization Name *</label>
          <Input icon={Building2} placeholder="e.g. African Music Awards" value={draft.name} onChange={e => update('name', e.target.value)} error={errors.name} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Username *</label>
          <div className="relative flex items-center">
            <span className="absolute text-dark-500 text-sm left-4">awardly.com/</span>
            <Input className="pl-28" placeholder="orgname" value={draft.slug} onChange={e => update('slug', slugify(e.target.value))} error={errors.slug} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Organization Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ORG_TYPES.map(t => (
              <button key={t.value} onClick={() => update('type', t.value)} className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                draft.type === t.value ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-white/5 bg-white/[0.02] text-dark-400 hover:border-gold-500/30 hover:text-white'
              }`}>
                {t.label}
              </button>
            ))}
          </div>
          {errors.type && <p className="text-xs text-red-400">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Short Description *</label>
          <textarea
            className="w-full min-h-[100px] rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none resize-none"
            placeholder="What does your organization do?"
            value={draft.description}
            onChange={e => update('description', e.target.value)}
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Branding ───────────────────────────────────────────────────────
function StepBranding({ draft, update }: { draft: OrgWizardDraft; update: <K extends keyof OrgWizardDraft>(k: K, v: OrgWizardDraft[K]) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-white">Branding</h2>
      <p className="text-dark-400 text-sm">Customize your visual identity</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUpload label="Logo (Square)" aspectRatio="square" value={draft.logoUrl} onImageSelect={(url) => update('logoUrl', url)} className="max-w-[180px]" />

          <div className="space-y-2">
            <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Primary Color</label>
            <div className="flex gap-2">
              {['#c68a35', '#2563eb', '#db2777', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map(c => (
                <button key={c} onClick={() => update('primaryColor', c)} className={`h-8 w-8 rounded-lg transition-all ${draft.primaryColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-950 scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="color" value={draft.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer bg-transparent border-0" />
              <Input value={draft.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="flex-1 h-8 text-xs font-mono" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ImageUpload label="Cover Banner (Wide)" aspectRatio="video" value={draft.coverUrl} onImageSelect={(url) => update('coverUrl', url)} />

          <div className="space-y-2">
            <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={draft.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer bg-transparent border-0" />
              <Input value={draft.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} className="flex-1 h-8 text-xs font-mono" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-3">Preview</p>
        <div className="rounded-xl overflow-hidden border border-white/10">
          {draft.coverUrl && <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${draft.coverUrl})` }} />}
          <div className="p-4 flex items-center gap-3 bg-dark-900">
            {draft.logoUrl ? (
              <img src={draft.logoUrl} className="h-10 w-10 rounded-lg object-cover" alt="" />
            ) : (
              <div className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: draft.primaryColor + '20', color: draft.primaryColor }}>
                {draft.name ? draft.name[0] : <Building2 className="h-4 w-4" />}
              </div>
            )}
            <div>
              <p className="text-white font-bold text-sm">{draft.name || 'Organization Name'}</p>
              <p className="text-dark-400 text-xs">awards.com/{draft.slug || '...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Details ────────────────────────────────────────────────────────
function StepDetails({ draft, update, errors }: { draft: OrgWizardDraft; update: <K extends keyof OrgWizardDraft>(k: K, v: OrgWizardDraft[K]) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-white">Organization Details</h2>
      <p className="text-dark-400 text-sm">Provide additional information</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Contact Email *</label>
          <Input icon={Mail} placeholder="hello@organization.com" value={draft.contactEmail} onChange={e => update('contactEmail', e.target.value)} error={errors.contactEmail} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Phone (optional)</label>
          <Input icon={Phone} placeholder="+234 801 234 5678" value={draft.phone} onChange={e => update('phone', e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Country *</label>
          <select value={draft.country} onChange={e => update('country', e.target.value)} className="w-full h-11 rounded-xl border border-white/5 bg-white/[0.02] px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none">
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="text-xs text-red-400">{errors.country}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Headquarters (optional)</label>
          <Input placeholder="City" value={draft.headquarters} onChange={e => update('headquarters', e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Website (optional)</label>
          <Input icon={Globe} placeholder="https://..." value={draft.website} onChange={e => update('website', e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Founded Year (optional)</label>
          <Input icon={FileText} placeholder="e.g. 2006" value={draft.foundedYear} onChange={e => update('foundedYear', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Social Links ───────────────────────────────────────────────────
function StepSocialLinks({ draft, update }: { draft: OrgWizardDraft; update: <K extends keyof OrgWizardDraft>(k: K, v: OrgWizardDraft[K]) => void }) {
  const socialFields = [
    { key: 'facebook' as const, icon: Facebook, label: 'Facebook', placeholder: 'facebook.com/...' },
    { key: 'twitter' as const, icon: Twitter, label: 'X / Twitter', placeholder: '@handle' },
    { key: 'instagram' as const, icon: Instagram, label: 'Instagram', placeholder: '@handle' },
    { key: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn', placeholder: 'linkedin.com/...' },
    { key: 'youtube' as const, icon: Youtube, label: 'YouTube', placeholder: 'youtube.com/@...' },
    { key: 'tiktok' as const, icon: Plus, label: 'TikTok', placeholder: '@handle' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-white">Social Links</h2>
      <p className="text-dark-400 text-sm">Connect your social media accounts (all optional)</p>

      <div className="grid md:grid-cols-2 gap-4">
        {socialFields.map(f => (
          <div key={f.key} className="space-y-2">
            <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">{f.label}</label>
            <Input icon={f.icon} placeholder={f.placeholder} value={draft.socialLinks[f.key]} onChange={e => update('socialLinks', { ...draft.socialLinks, [f.key]: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 5: Verification ───────────────────────────────────────────────────
function StepVerification({ draft }: { draft: OrgWizardDraft }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-white">Verification</h2>
      <p className="text-dark-400 text-sm">Verify your organization to build trust (optional)</p>

      <div className="p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.01] text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="h-8 w-8 text-gold-500" />
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">Upload Verification Documents</h3>
          <p className="text-dark-400 text-sm max-w-md mx-auto">
            You can upload a business registration, government ID, or organization certificate.
          </p>
        </div>
        <Button variant="outline" onClick={() => {}}>
          <Camera className="h-4 w-4 mr-2" /> Choose File
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/10">
        <p className="text-sm text-gold-500/80">
          <strong>Note:</strong> Verification can also be completed later from your organization settings.
        </p>
      </div>
    </div>
  );
}

// ─── Step 6: Review ─────────────────────────────────────────────────────────
function StepReview({ draft }: { draft: OrgWizardDraft }) {
  const typeLabel = ORG_TYPES.find(t => t.value === draft.type)?.label || draft.type;
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-white">Review & Create</h2>
      <p className="text-dark-400 text-sm">Review your organization details before publishing</p>

      {/* Live preview card */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        {draft.coverUrl && <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${draft.coverUrl})` }} />}
        <div className="p-6 bg-dark-900">
          <div className="flex items-center gap-4 mb-4">
            {draft.logoUrl ? (
              <img src={draft.logoUrl} className="h-14 w-14 rounded-xl object-cover" alt="" />
            ) : (
              <div className="h-14 w-14 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: draft.primaryColor + '20', color: draft.primaryColor }}>
                {draft.name ? draft.name[0] : <Building2 className="h-5 w-5" />}
              </div>
            )}
            <div>
              <h3 className="text-white font-serif text-lg">{draft.name}</h3>
              <p className="text-dark-400 text-sm">awards.com/{draft.slug}</p>
            </div>
            {draft.type && <span className="ml-auto px-2 py-1 rounded bg-gold-500/10 text-gold-500 text-[10px] font-bold uppercase tracking-widest">{typeLabel}</span>}
          </div>
          <p className="text-dark-300 text-sm">{draft.description}</p>
        </div>
      </div>

      {/* Details summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: 'Country', value: draft.country },
          { label: 'Headquarters', value: draft.headquarters },
          { label: 'Contact Email', value: draft.contactEmail },
          { label: 'Phone', value: draft.phone },
          { label: 'Website', value: draft.website },
          { label: 'Founded', value: draft.foundedYear },
          { label: 'Primary Color', value: draft.primaryColor, isColor: true },
        ].filter(f => f.value).map(f => (
          <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            {f.isColor && <div className="h-4 w-4 rounded-full" style={{ backgroundColor: f.value }} />}
            <div>
              <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{f.label}</p>
              <p className="text-white text-sm">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social links */}
      {Object.entries(draft.socialLinks).filter(([, v]) => v).length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-2">Social Links</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(draft.socialLinks).filter(([, v]) => v).map(([k, v]) => (
              <span key={k} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-dark-300">{k}: {v}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
