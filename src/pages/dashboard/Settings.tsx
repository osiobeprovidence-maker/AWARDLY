import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Building2, Globe, Palette, Shield, Lock, Mail, Phone, MapPin, Calendar, User,
  Loader2, ExternalLink, Plus, Trash2, Link2, Instagram, Facebook, Twitter,
  Linkedin, Youtube, MessageCircle, Send, Hash, AtSign, Video, Smartphone,
  HandHeart, GripVertical, Award,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { ImageUpload } from '../../components/ImageUpload';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../lib/convex-auth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username', color: 'text-pink-500' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/page', color: 'text-blue-500' },
  { key: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: '@handle', color: 'text-sky-500' },
  { key: 'tiktok', label: 'TikTok', icon: Video, placeholder: '@username', color: 'text-white' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/company/...', color: 'text-blue-600' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: '@channel', color: 'text-red-500' },
  { key: 'threads', label: 'Threads', icon: AtSign, placeholder: '@username', color: 'text-white' },
  { key: 'snapchat', label: 'Snapchat', icon: Smartphone, placeholder: 'username', color: 'text-yellow-500' },
  { key: 'whatsapp', label: 'WhatsApp Business', icon: MessageCircle, placeholder: '+1234567890', color: 'text-emerald-500' },
  { key: 'telegram', label: 'Telegram', icon: Send, placeholder: '@channel', color: 'text-blue-400' },
  { key: 'discord', label: 'Discord', icon: Hash, placeholder: 'discord.gg/...', color: 'text-indigo-500' },
  { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://...', color: 'text-dark-400' },
];

const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Brazil', 'India', 'Canada', 'Australia', 'Other'];

const TIMEZONES = ['Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'Africa/Cairo', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney', 'UTC'];

const ORG_CATEGORIES = ['Entertainment', 'Music', 'Film & TV', 'Sports', 'Technology', 'Education', 'Non-Profit', 'Government', 'Media', 'Fashion', 'Art & Design', 'Business', 'Other'];

export function DashboardSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentOrg, currentRole } = useAuth();
  const [saving, setSaving] = useState(false);

  const updateOrg = useMutation(api.organizations.mutations.update);
  const updateBranding = useMutation(api.organizations.mutations.updateBranding);
  const updateSocialLinks = useMutation(api.organizations.mutations.updateSocialLinks);
  const createSponsor = useMutation(api.sponsors.mutations.create);
  const updateSponsor = useMutation(api.sponsors.mutations.update);
  const removeSponsor = useMutation(api.sponsors.mutations.remove);

  const orgMembers = useQuery(
    api.organizationMembers.queries.getOrgMembers,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const subscription = useQuery(
    api.subscriptions.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  );

  const canManage = currentRole === 'owner' || currentRole === 'admin';

  // Sponsors
  const sponsors = useQuery(
    api.sponsors.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [sponsorForm, setSponsorForm] = useState({
    name: '', logoUrl: '', website: '', level: 'gold' as 'strategic' | 'gold' | 'silver' | 'bronze',
  });

  // Org form state
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [audienceScope, setAudienceScope] = useState('');
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('');
  const [orgCategory, setOrgCategory] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [supportEmail, setSupportEmail] = useState('');

  // Social links state (all 12 platforms)
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  // Branding state
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#c68a35');
  const [secondaryColor, setSecondaryColor] = useState('#0a0a0a');

  // Hydrate from Convex
  useEffect(() => {
    if (currentOrg) {
      setOrgName(currentOrg.name);
      setDescription(currentOrg.description ?? '');
      setContactEmail(currentOrg.contactEmail ?? '');
      setWebsite(currentOrg.website ?? '');
      setPhone((currentOrg as any).phone ?? '');
      setCountry((currentOrg as any).country ?? '');
      setAudienceScope((currentOrg as any).audienceScope ?? '');
      setCity((currentOrg as any).city ?? '');
      setTimezone((currentOrg as any).timezone ?? '');
      setOrgCategory((currentOrg as any).category ?? '');
      setFoundedYear((currentOrg as any).foundedYear?.toString() ?? '');
      setSupportEmail((currentOrg as any).supportEmail ?? '');
      setLogoUrl(currentOrg.logoUrl ?? null);
      setCoverUrl(currentOrg.coverUrl ?? null);
      setPrimaryColor(currentOrg.primaryColor ?? '#c68a35');
      setSecondaryColor(currentOrg.secondaryColor ?? '#0a0a0a');

      const links: Record<string, string> = {};
      const sl = (currentOrg as any).socialLinks;
      if (sl) {
        SOCIAL_PLATFORMS.forEach((p) => {
          links[p.key] = sl[p.key] ?? '';
        });
      }
      setSocialLinks(links);
    }
  }, [currentOrg]);

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  const handleSaveOrg = async () => {
    try {
      setSaving(true);
      await updateOrg({
        orgId: currentOrg.id as any,
        name: orgName,
        description,
        contactEmail,
        website: website || undefined,
        phone: phone || undefined,
        country: country || undefined,
        audienceScope: audienceScope as any || undefined,
        city: city || undefined,
        timezone: timezone || undefined,
        supportEmail: supportEmail || undefined,
        foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
      });
      toast('Organization settings saved', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocials = async () => {
    try {
      setSaving(true);
      const payload: Record<string, string | undefined> = {};
      SOCIAL_PLATFORMS.forEach((p) => {
        payload[p.key] = socialLinks[p.key] || undefined;
      });
      await updateSocialLinks({
        orgId: currentOrg.id as any,
        socialLinks: payload as any,
      });
      toast('Social profiles updated', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBranding = async () => {
    try {
      setSaving(true);
      await updateBranding({
        orgId: currentOrg.id as any,
        logoUrl: logoUrl ?? undefined,
        coverUrl: coverUrl ?? undefined,
        primaryColor,
        secondaryColor,
      });
      toast('Branding updated successfully', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const planLabels: Record<string, string> = {
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  };

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Settings</h1>
        <p className="text-dark-400">Configure your organization and account preferences.</p>
      </div>

      <Tabs defaultValue="org">
        <TabsList>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="socials">Social Profiles</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ── Organization Tab ─────────────────────────────────────── */}
        <TabsContent value="org" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Information</CardTitle>
              <CardDescription>This information will be displayed on your public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Organization Name</label>
                  <Input icon={Building2} value={orgName} onChange={e => setOrgName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Contact Email</label>
                  <Input icon={Mail} type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Bio</label>
                <textarea
                  className="w-full min-h-[120px] bg-dark-900 border border-white/10 rounded-lg p-4 text-white text-sm outline-none focus:ring-1 focus:ring-gold-500 resize-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell people about your organization..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Phone Number</label>
                  <Input icon={Phone} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Support Email</label>
                  <Input icon={Mail} type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} placeholder="support@..." />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Country</label>
                  <select
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">City</label>
                  <Input icon={MapPin} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lagos" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Audience Scope</label>
                  <select
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={audienceScope}
                    onChange={e => setAudienceScope(e.target.value)}
                  >
                    <option value="">Not set (defaults to Global)</option>
                    <option value="local">Local</option>
                    <option value="national">National</option>
                    <option value="regional">Regional</option>
                    <option value="international">International</option>
                    <option value="global">Global</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Time Zone</label>
                  <select
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                  >
                    <option value="">Select timezone</option>
                    {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Category</label>
                  <select
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={orgCategory}
                    onChange={e => setOrgCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {ORG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Year Founded</label>
                  <Input icon={Calendar} type="number" min="1900" max="2099" value={foundedYear} onChange={e => setFoundedYear(e.target.value)} placeholder="e.g. 2024" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Public Website</label>
                  <Input icon={Globe} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              {canManage && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveOrg} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Social Profiles Tab ──────────────────────────────────── */}
        <TabsContent value="socials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>Connect your organization's social media presence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className={`h-10 w-10 rounded-lg bg-dark-800 border border-white/5 flex items-center justify-center ${platform.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white uppercase tracking-widest">{platform.label}</p>
                        <input
                          className="w-full bg-transparent border-b border-white/10 text-white text-sm py-1 outline-none focus:border-gold-500/50 transition-colors placeholder:text-dark-600"
                          placeholder={platform.placeholder}
                          value={socialLinks[platform.key] ?? ''}
                          onChange={e => setSocialLinks(prev => ({ ...prev, [platform.key]: e.target.value }))}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {canManage && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSocials} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Update Socials
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Branding Tab ─────────────────────────────────────────── */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Visual Identity</CardTitle>
              <CardDescription>Customize how your organization appears to the public.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <ImageUpload
                    label="Logo (Square)"
                    aspectRatio="square"
                    value={logoUrl ?? undefined}
                    onImageSelect={setLogoUrl}
                    className="max-w-[200px]"
                  />

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Primary Brand Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="h-10 w-10 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
                      />
                      <Input
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="flex-1 font-mono text-xs"
                        placeholder="#c68a35"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Secondary Brand Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="h-10 w-10 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="flex-1 font-mono text-xs"
                        placeholder="#0a0a0a"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <ImageUpload
                    label="Cover Banner (Wide)"
                    aspectRatio="video"
                    value={coverUrl ?? undefined}
                    onImageSelect={setCoverUrl}
                  />

                  {/* Live Preview */}
                  <div className="p-4 rounded-xl border border-white/10 bg-dark-800/50 space-y-3">
                    <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Live Preview</p>
                    <div className="h-20 rounded-lg overflow-hidden" style={{ backgroundColor: secondaryColor }}>
                      {coverUrl && <img src={coverUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/10" style={{ backgroundColor: primaryColor }}>
                        {logoUrl && <img src={logoUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{currentOrg.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                          <span className="text-[10px] text-dark-500">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {canManage && (
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <Button onClick={handleSaveBranding} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Update Branding
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Sponsors Tab ──────────────────────────────────────── */}
        <TabsContent value="sponsors" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sponsors & Partners</CardTitle>
                <CardDescription>Manage sponsors that appear on your public profile.</CardDescription>
              </div>
              {canManage && (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAddSponsor(true);
                    setEditingSponsorId(null);
                    setSponsorForm({ name: '', logoUrl: '', website: '', level: 'gold' });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Sponsor
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {(showAddSponsor || editingSponsorId) && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                    {editingSponsorId ? 'Edit Sponsor' : 'New Sponsor'}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Name</label>
                      <Input
                        value={sponsorForm.name}
                        onChange={e => setSponsorForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Coca-Cola"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Level</label>
                      <select
                        className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                        value={sponsorForm.level}
                        onChange={e => setSponsorForm(p => ({ ...p, level: e.target.value as any }))}
                      >
                        <option value="strategic">Strategic</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Logo URL</label>
                      <Input
                        value={sponsorForm.logoUrl}
                        onChange={e => setSponsorForm(p => ({ ...p, logoUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Website</label>
                      <Input
                        value={sponsorForm.website}
                        onChange={e => setSponsorForm(p => ({ ...p, website: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddSponsor(false);
                        setEditingSponsorId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={!sponsorForm.name.trim() || saving}
                      onClick={async () => {
                        try {
                          setSaving(true);
                          if (editingSponsorId) {
                            await updateSponsor({
                              sponsorId: editingSponsorId as any,
                              name: sponsorForm.name,
                              logoUrl: sponsorForm.logoUrl || undefined,
                              website: sponsorForm.website || undefined,
                              level: sponsorForm.level,
                              firebaseUid: undefined,
                            });
                            toast('Sponsor updated', 'success');
                          } else {
                            await createSponsor({
                              orgId: currentOrg!.id as any,
                              name: sponsorForm.name,
                              logoUrl: sponsorForm.logoUrl || undefined,
                              website: sponsorForm.website || undefined,
                              level: sponsorForm.level,
                              displayOrder: sponsors.length,
                              firebaseUid: undefined,
                            });
                            toast('Sponsor added', 'success');
                          }
                          setShowAddSponsor(false);
                          setEditingSponsorId(null);
                          setSponsorForm({ name: '', logoUrl: '', website: '', level: 'gold' });
                        } catch (error: any) {
                          toast(error.message || 'Failed to save', 'error');
                        } finally {
                          setSaving(false);
                        }
                      }}
                    >
                      {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                      {editingSponsorId ? 'Update' : 'Add Sponsor'}
                    </Button>
                  </div>
                </div>
              )}

              {sponsors.length === 0 ? (
                <div className="text-center py-12">
                  <HandHeart className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400 mb-1">No sponsors yet</p>
                  <p className="text-xs text-dark-500">Add sponsors to showcase them on your public profile.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sponsors.map((sponsor: any) => (
                    <div
                      key={sponsor._id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
                    >
                      {sponsor.logoUrl ? (
                        <img
                          src={sponsor.logoUrl}
                          className="h-10 w-10 rounded-lg object-cover"
                          alt={sponsor.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">
                          {sponsor.name[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{sponsor.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                            sponsor.level === 'strategic' ? 'bg-gold-500/10 text-gold-500' :
                            sponsor.level === 'gold' ? 'bg-yellow-500/10 text-yellow-400' :
                            sponsor.level === 'silver' ? 'bg-gray-400/10 text-gray-300' :
                            'bg-orange-500/10 text-orange-400'
                          }`}>
                            {sponsor.level}
                          </span>
                          {sponsor.website && (
                            <span className="text-[10px] text-dark-500 truncate">{sponsor.website}</span>
                          )}
                        </div>
                      </div>
                      {canManage && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingSponsorId(sponsor._id);
                              setShowAddSponsor(false);
                              setSponsorForm({
                                name: sponsor.name,
                                logoUrl: sponsor.logoUrl ?? '',
                                website: sponsor.website ?? '',
                                level: sponsor.level,
                              });
                            }}
                          >
                            <Award className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-400"
                            onClick={async () => {
                              if (confirm('Remove this sponsor?')) {
                                try {
                                  await removeSponsor({ sponsorId: sponsor._id as any, firebaseUid: undefined });
                                  toast('Sponsor removed', 'success');
                                } catch (error: any) {
                                  toast(error.message || 'Failed to remove', 'error');
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Billing Tab ──────────────────────────────────────────── */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-gold-500/5 border-gold-500/20">
            <CardContent className="flex flex-col md:flex-row items-center gap-8 justify-between pt-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-white">{planLabels[subscription?.plan ?? 'starter'] ?? 'Starter'} Plan</h3>
                <p className="text-dark-400">
                  {subscription?.plan === 'enterprise'
                    ? 'Unlimited access to all features.'
                    : subscription?.plan === 'professional'
                      ? 'Advanced features for growing organizations.'
                      : 'Your organization is currently on the free tier.'}
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={() => navigate('/dashboard/billing')}>
                Manage Billing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Team Tab ─────────────────────────────────────────────── */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage who has access to your organization dashboard.</CardDescription>
              </div>
              {canManage && (
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/team')}>
                  Manage Team
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-1">
              {orgMembers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400 mb-1">No team members found</p>
                  <p className="text-xs text-dark-500">Invite team members to collaborate</p>
                </div>
              ) : (
                orgMembers.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-dark-800 rounded-full flex items-center justify-center text-xs font-bold text-gold-500 border border-white/10">
                        {member.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? '??'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{member.user?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-dark-500">{member.user?.email ?? ''}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-dark-400 bg-white/5 px-2 py-1 rounded-md">{member.role}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security Tab ─────────────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>Manage your session security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    <div>
                      <h4 className="text-white font-medium text-sm">Two-Factor Authentication</h4>
                      <p className="text-xs text-dark-500">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast('2FA setup coming soon', 'info')}>Enable 2FA</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <Lock className="h-5 w-5 text-dark-400" />
                    <div>
                      <h4 className="text-white font-medium text-sm">Active Sessions</h4>
                      <p className="text-xs text-dark-500">You are currently logged in on this device.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
