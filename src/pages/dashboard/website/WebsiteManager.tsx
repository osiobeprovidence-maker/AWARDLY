import React, { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import {
  Globe, Eye, ExternalLink, Copy, Check, Loader2, Rocket, Clock,
  Monitor, Tablet, Smartphone, ArrowLeft, ChevronRight,
  Palette, Navigation, Home, FileText, Settings, Search, BarChart3,
  Image, Type, Megaphone, Newspaper, Trophy, Calendar, Users,
  MessageSquare, Video, MapPin, Phone, Star, Ticket, Mail,
  Save, Undo2, Link as LinkIcon,
} from 'lucide-react';

const SECTIONS_META: Record<string, { label: string; icon: any; description: string }> = {
  hero: { label: 'Hero Banner', icon: Image, description: 'Full-width hero with image, title, and CTA' },
  about: { label: 'About', icon: FileText, description: 'Organization story, mission, and vision' },
  featured_events: { label: 'Featured Awards', icon: Trophy, description: 'Showcase featured events' },
  sponsors: { label: 'Sponsors', icon: Star, description: 'Showcase sponsors and partners' },
  gallery: { label: 'Gallery', icon: Image, description: 'Photo gallery grid' },
  newsletter: { label: 'Newsletter', icon: Mail, description: 'Email subscription form' },
  faq: { label: 'FAQ', icon: MessageSquare, description: 'Frequently asked questions' },
  contact: { label: 'Contact', icon: Phone, description: 'Contact form and info' },
  countdown: { label: 'Countdown', icon: Calendar, description: 'Countdown to event date' },
  open_nominations: { label: 'Nominations', icon: Users, description: 'Open nomination categories' },
  call_for_entry: { label: 'Call for Entry', icon: Megaphone, description: 'Promote entry submissions' },
  ticket_sales: { label: 'Ticket Sales', icon: Ticket, description: 'Sell event tickets' },
  featured_winners: { label: 'Winners', icon: Trophy, description: 'Display past winners' },
  video: { label: 'Video', icon: Video, description: 'Embed video content' },
  latest_news: { label: 'Latest News', icon: Newspaper, description: 'Recent posts and updates' },
  testimonials: { label: 'Testimonials', icon: MessageSquare, description: 'Quotes and reviews' },
  upcoming_events: { label: 'Upcoming Events', icon: Calendar, description: 'List of upcoming events' },
  map: { label: 'Map', icon: MapPin, description: 'Embedded map' },
  partners: { label: 'Partners', icon: Users, description: 'Partner organizations' },
};

const DEVICE_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '375px' };

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type EditorTab = 'sections' | 'settings';

export function WebsiteManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<EditorTab>('sections');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const orgId = user?.currentOrg?.id as any;
  const slug = user?.currentOrg?.slug;

  const website = useQuery(
    api.websites.queries.getByOrg,
    orgId ? { orgId } : 'skip'
  );
  const pages = useQuery(
    api.websites.queries.getPagesByOrg,
    orgId ? { orgId } : 'skip'
  );

  const ensureWebsite = useMutation(api.websites.mutations.ensureWebsite);
  const updateHomepageSections = useMutation(api.websites.mutations.updateHomepageSections);
  const updateNavigation = useMutation(api.websites.mutations.updateNavigation);
  const updateTheme = useMutation(api.websites.mutations.updateTheme);
  const updateSeo = useMutation(api.websites.mutations.updateSeo);
  const updateWebsiteSettings = useMutation(api.websites.mutations.updateWebsiteSettings);
  const updatePage = useMutation(api.websites.mutations.updatePage);
  const togglePublish = useMutation(api.websites.mutations.togglePublish);

  const [sections, setSections] = useState<any[] | null>(null);
  const [navItems, setNavItems] = useState<any[] | null>(null);

  const currentSections = sections ?? website?.homepageSections ?? [];
  const currentNav = navItems ?? website?.navigation ?? [];

  const siteUrl = slug ? `${window.location.origin}/org/${slug}` : '';

  const ensureLoaded = useCallback(async () => {
    if (!orgId) return;
    if (!website) {
      try {
        await ensureWebsite({ firebaseUid: user?.id, orgId });
      } catch (e: any) {
        toast(e.message || 'Failed to initialize website', 'error');
      }
    }
  }, [orgId, website, user?.id]);

  React.useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  const handleSaveSection = async (sectionId: string, updates: Partial<any>) => {
    if (!orgId) return;
    const updated = currentSections.map(s => s.id === sectionId ? { ...s, ...updates } : s);
    setSections(updated);
    setSaving(true);
    try {
      await updateHomepageSections({ firebaseUid: user?.id, orgId, sections: updated });
      toast('Section updated', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to save', 'error');
    }
    setSaving(false);
  };

  const handleReorderSection = async (index: number, dir: 'up' | 'down') => {
    const items = [...currentSections];
    const swap = dir === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    items.forEach((s, i) => s.order = i);
    setSections(items);
    if (orgId) {
      await updateHomepageSections({ firebaseUid: user?.id, orgId, sections: items });
    }
  };

  const handleToggleSection = async (sectionId: string) => {
    const updated = currentSections.map(s => s.id === sectionId ? { ...s, isEnabled: !s.isEnabled } : s);
    setSections(updated);
    if (orgId) {
      await updateHomepageSections({ firebaseUid: user?.id, orgId, sections: updated });
    }
  };

  const handleSaveNav = async () => {
    if (!orgId) return;
    setSaving(true);
    try {
      await updateNavigation({ firebaseUid: user?.id, orgId, navigation: currentNav });
      toast('Navigation saved', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to save', 'error');
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!website || !orgId) return;
    try {
      await togglePublish({ firebaseUid: user?.id, orgId, isPublished: !website.isPublished });
      toast(website.isPublished ? 'Unpublished' : 'Website is now live!', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed', 'error');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loading = website === undefined;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gold-500/10 flex items-center justify-center">
            <Globe className="h-8 w-8 text-gold-500" />
          </div>
          <Loader2 className="absolute -top-1 -right-1 h-5 w-5 text-gold-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white text-sm font-medium">Setting up your website...</p>
          <p className="text-dark-500 text-xs mt-1">Generating starter content from your organization profile</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Globe className="h-16 w-16 text-dark-600 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-white mb-3">Initializing Website</h2>
          <p className="text-dark-400 text-sm mb-8 max-w-md mx-auto">
            Generating your starter website from your organization profile...
          </p>
          <Button onClick={ensureLoaded}>
            <Globe className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const selectedSection = activeSection ? currentSections.find(s => s.id === activeSection) : null;

  return (
    <div className="space-y-4">
      {/* ─── Top Toolbar ─── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`h-3 w-3 rounded-full ${website.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-dark-600'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                website.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-700 text-dark-400'
              }`}>
                {website.isPublished ? 'Live' : 'Draft'}
              </span>
              {website.lastPublishedAt && (
                <span className="text-[10px] text-dark-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(website.lastPublishedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {website.isPublished && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-dark-400 font-mono">{siteUrl}</span>
                <button onClick={copyUrl} className="text-dark-500 hover:text-gold-500 transition-colors">
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="text-dark-500 hover:text-gold-500 transition-colors">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-dark-900/50 border border-white/5 rounded-lg p-0.5">
            {([
              { mode: 'desktop' as const, icon: Monitor },
              { mode: 'tablet' as const, icon: Tablet },
              { mode: 'mobile' as const, icon: Smartphone },
            ]).map(({ mode, icon: Icon }) => (
              <button key={mode} onClick={() => setDevice(mode)}
                className={`h-8 w-8 flex items-center justify-center rounded-md transition-all ${
                  device === mode ? 'bg-gold-500 text-dark-950' : 'text-dark-500 hover:text-white'
                }`}>
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <a href={`/org/${slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-dark-400 hover:text-white text-xs transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Preview
          </a>
          <Button onClick={handlePublish} size="sm" variant={website.isPublished ? 'secondary' : 'primary'}>
            <Rocket className="h-3.5 w-3.5 mr-1.5" />
            {website.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* ─── Main Layout: Sidebar + Preview ─── */}
      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Left: Section List / Editor */}
        <div className="w-80 shrink-0 flex flex-col bg-dark-900/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="flex border-b border-white/5">
            <button onClick={() => setEditorTab('sections')}
              className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
                editorTab === 'sections' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-dark-500 hover:text-white'
              }`}>
              Sections
            </button>
            <button onClick={() => setEditorTab('settings')}
              className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
                editorTab === 'settings' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-dark-500 hover:text-white'
              }`}>
              Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {editorTab === 'sections' ? (
              <>
                {currentSections.sort((a: any, b: any) => a.order - b.order).map((section: any, index: number) => {
                  const meta = SECTIONS_META[section.type] || { label: section.type, icon: Settings, description: '' };
                  const Icon = meta.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button key={section.id}
                      onClick={() => setActiveSection(isActive ? null : section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-gold-500/10 border border-gold-500/30'
                          : section.isEnabled
                            ? 'bg-dark-900/50 border border-white/5 hover:border-white/10'
                            : 'bg-dark-900/20 border border-white/5 opacity-50'
                      }`}>
                      <Icon className="h-4 w-4 text-dark-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium truncate">{meta.label}</p>
                        <p className="text-[10px] text-dark-500 truncate">{meta.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); handleToggleSection(section.id); }}
                          className={`h-4 w-7 rounded-full transition-all relative ${
                            section.isEnabled ? 'bg-gold-500' : 'bg-dark-700'
                          }`}>
                          <span className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                            style={{ left: section.isEnabled ? '14px' : '2px' }} />
                        </button>
                        <div className="flex flex-col">
                          <button onClick={(e) => { e.stopPropagation(); handleReorderSection(index, 'up'); }}
                            disabled={index === 0}
                            className="text-dark-600 hover:text-white disabled:opacity-30"><ChevronRight className="h-3 w-3 -rotate-90" /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleReorderSection(index, 'down'); }}
                            disabled={index === currentSections.length - 1}
                            className="text-dark-600 hover:text-white disabled:opacity-30"><ChevronRight className="h-3 w-3 rotate-90" /></button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              <SettingsPanel
                website={website}
                navItems={currentNav}
                onNavChange={setNavItems}
                onSaveNav={handleSaveNav}
                onThemeChange={(theme) => updateTheme({ firebaseUid: user?.id, orgId, theme: theme as any })}
                onSeoChange={(seo) => updateSeo({ firebaseUid: user?.id, orgId, seo })}
                onSettingsChange={(data) => updateWebsiteSettings({ firebaseUid: user?.id, orgId, ...data })}
                saving={saving}
              />
            )}
          </div>
        </div>

        {/* Center: Live Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-dark-950 border border-white/5 rounded-xl overflow-hidden flex justify-center">
            <div className="w-full h-full overflow-y-auto">
              <div className="flex justify-center py-4">
                <div ref={previewRef}
                  className="bg-dark-950 border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
                  style={{
                    width: DEVICE_WIDTHS[device],
                    maxWidth: '100%',
                    height: device === 'desktop' ? '100%' : device === 'tablet' ? '1024px' : '812px',
                    transform: device === 'desktop' ? 'none' : `scale(${device === 'tablet' ? 0.75 : 0.6})`,
                    transformOrigin: 'top center',
                  }}>
                  <WebsitePreview
                    org={user?.currentOrg}
                    website={website}
                    sections={currentSections}
                    navigation={currentNav}
                    activeSection={activeSection}
                    onSectionClick={setActiveSection}
                    pages={pages ?? []}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Section Editor (when a section is selected) */}
        {selectedSection && (
          <div className="w-80 shrink-0 flex flex-col bg-dark-900/50 border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h3 className="text-sm text-white font-medium">
                {SECTIONS_META[selectedSection.type]?.label || selectedSection.type}
              </h3>
              <button onClick={() => setActiveSection(null)} className="text-dark-500 hover:text-white text-xs">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SectionEditor
                section={selectedSection}
                org={user?.currentOrg}
                onSave={(updates) => handleSaveSection(selectedSection.id, updates)}
                saving={saving}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Website Preview (renders actual website content inline) ─── */
function WebsitePreview({ org, website, sections, navigation, activeSection, onSectionClick, pages }: {
  org: any; website: any; sections: any[]; navigation: any[];
  activeSection: string | null; onSectionClick: (id: string) => void; pages: any[];
}) {
  const enabledNav = navigation.filter(n => n.isEnabled).sort((a: any, b: any) => a.order - b.order);

  return (
    <div className="min-h-full bg-dark-950 text-white" style={{ fontSize: '14px' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-dark-950/95 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {org?.logoUrl ? (
              <img src={org.logoUrl} alt={org.name} className="h-8 w-8 rounded-lg object-cover border border-white/10" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-serif text-gold-500 text-sm">
                {org?.name?.[0]}
              </div>
            )}
            <span className="text-white font-serif text-sm font-medium">{org?.name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {enabledNav.map((n: any) => (
              <span key={n.id} className="text-xs text-dark-400 hover:text-white transition-colors cursor-pointer">{n.label}</span>
            ))}
          </nav>
        </div>
      </div>

      {/* Sections */}
      {sections.filter(s => s.isEnabled).sort((a: any, b: any) => a.order - b.order).map((section: any) => {
        const meta = SECTIONS_META[section.type];
        const isSelected = activeSection === section.id;
        return (
          <div key={section.id}
            onClick={(e) => { e.stopPropagation(); onSectionClick(section.id); }}
            className={`relative cursor-pointer transition-all group ${
              isSelected ? 'ring-2 ring-gold-500 ring-inset' : 'hover:ring-1 hover:ring-gold-500/50 hover:ring-inset'
            }`}>
            <PreviewSection section={section} org={org} />
            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-opacity ${
              isSelected ? 'bg-gold-500 text-dark-950 opacity-100' : 'bg-dark-950/80 text-dark-400 opacity-0 group-hover:opacity-100'
            }`}>
              {meta?.label || section.type}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="border-t border-white/5 bg-dark-950/80 py-6 px-4 text-center">
        <p className="text-[10px] text-dark-600">{website?.footerContent || `© ${new Date().getFullYear()} ${org?.name}. All rights reserved.`}</p>
        <p className="text-[10px] text-dark-700 mt-1">Powered by Awardly</p>
      </div>
    </div>
  );
}

/* ─── Preview Section Renderer ─── */
function PreviewSection({ section, org }: { section: any; org: any }) {
  switch (section.type) {
    case 'hero':
      return (
        <div className="relative h-80 flex items-center justify-center overflow-hidden"
          style={{ background: section.backgroundImage ? `url(${section.backgroundImage}) center/cover` : `linear-gradient(135deg, ${org?.primaryColor || '#D4AF37'}22, ${org?.secondaryColor || '#0A0A0A'})` }}>
          <div className="absolute inset-0 bg-dark-950/60" />
          <div className="relative text-center px-8 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">{section.title || org?.name}</h1>
            <p className="text-dark-300 text-sm mb-6 max-w-xl mx-auto">{section.subtitle || section.content || org?.description}</p>
            {section.ctaText && (
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-500 text-dark-950 text-sm font-medium">
                {section.ctaText}
              </span>
            )}
          </div>
        </div>
      );
    case 'about':
      return (
        <div className="py-12 px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif text-white mb-2">{section.title || 'About Us'}</h2>
          <div className="w-12 h-0.5 bg-gold-500 mb-6" />
          <p className="text-dark-300 text-sm leading-relaxed mb-6">{section.content || org?.description || 'Organization description goes here.'}</p>
          {section.metadata && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {section.metadata.mission && (
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-2">Our Mission</h3>
                  <p className="text-dark-300 text-xs leading-relaxed">{section.metadata.mission}</p>
                </div>
              )}
              {section.metadata.vision && (
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-2">Our Vision</h3>
                  <p className="text-dark-300 text-xs leading-relaxed">{section.metadata.vision}</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    case 'featured_events':
      return (
        <div className="py-12 px-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif text-white mb-2">{section.title || 'Featured Awards'}</h2>
          <div className="w-12 h-0.5 bg-gold-500 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="h-32 rounded-lg bg-white/5 mb-4 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-dark-600" />
                </div>
                <p className="text-dark-600 text-xs">No events yet</p>
                <p className="text-dark-700 text-[10px] mt-1">Create an event to see it here</p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'sponsors':
      return (
        <div className="py-12 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-2">{section.title || 'Our Partners'}</h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <div className="flex items-center justify-center gap-8 py-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 w-32 rounded-lg bg-white/5 flex items-center justify-center">
                <Star className="h-5 w-5 text-dark-600" />
              </div>
            ))}
          </div>
          <p className="text-dark-600 text-xs">Add sponsors to showcase them here</p>
        </div>
      );
    case 'gallery':
      return (
        <div className="py-12 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-2">{section.title || 'Gallery'}</h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 flex items-center justify-center">
                <Image className="h-6 w-6 text-dark-600" />
              </div>
            ))}
          </div>
          <p className="text-dark-600 text-xs mt-4">Upload photos to build your gallery</p>
        </div>
      );
    case 'newsletter':
      return (
        <div className="py-12 px-8 bg-gold-500/5 border-y border-gold-500/10">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-serif text-white mb-2">{section.title || 'Stay Updated'}</h2>
            <p className="text-dark-400 text-xs mb-6">{section.subtitle || 'Subscribe to our newsletter'}</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <div className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 px-4 flex items-center">
                <span className="text-dark-600 text-xs">your@email.com</span>
              </div>
              <span className="h-10 px-5 rounded-lg bg-gold-500 text-dark-950 text-xs font-medium flex items-center">Subscribe</span>
            </div>
          </div>
        </div>
      );
    case 'faq':
      return (
        <div className="py-12 px-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif text-white mb-2 text-center">{section.title || 'FAQ'}</h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          {['How do I submit a nomination?', 'What are the judging criteria?', 'When will winners be announced?'].map((q, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 mb-3">
              <p className="text-white text-sm font-medium">{q}</p>
              <p className="text-dark-500 text-xs mt-2">Answer goes here. Edit this section to add your FAQ content.</p>
            </div>
          ))}
        </div>
      );
    case 'contact':
      return (
        <div className="py-12 px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif text-white mb-2 text-center">{section.title || 'Get in Touch'}</h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
              <Mail className="h-5 w-5 text-gold-500 mx-auto mb-2" />
              <p className="text-dark-500 text-[10px] uppercase tracking-wider mb-1">Email</p>
              <p className="text-white text-xs">{org?.contactEmail || 'hello@example.com'}</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
              <Phone className="h-5 w-5 text-gold-500 mx-auto mb-2" />
              <p className="text-dark-500 text-[10px] uppercase tracking-wider mb-1">Phone</p>
              <p className="text-white text-xs">{org?.phone || 'Contact us'}</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
              <MapPin className="h-5 w-5 text-gold-500 mx-auto mb-2" />
              <p className="text-dark-500 text-[10px] uppercase tracking-wider mb-1">Location</p>
              <p className="text-white text-xs">{[org?.city, org?.country].filter(Boolean).join(', ') || 'Global'}</p>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="py-12 px-8 text-center">
          <div className="h-16 w-16 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Settings className="h-6 w-6 text-dark-600" />
          </div>
          <p className="text-dark-500 text-xs">{section.title || section.type}</p>
          <p className="text-dark-600 text-[10px] mt-1">Click to configure this section</p>
        </div>
      );
  }
}

/* ─── Section Editor ─── */
function SectionEditor({ section, org, onSave, saving }: {
  section: any; org: any; onSave: (updates: any) => void; saving: boolean;
}) {
  const [title, setTitle] = useState(section.title || '');
  const [subtitle, setSubtitle] = useState(section.subtitle || '');
  const [content, setContent] = useState(section.content || '');
  const [ctaText, setCtaText] = useState(section.ctaText || '');
  const [ctaUrl, setCtaUrl] = useState(section.ctaUrl || '');
  const [bgImage, setBgImage] = useState(section.backgroundImage || '');
  const [mission, setMission] = useState(section.metadata?.mission || '');
  const [vision, setVision] = useState(section.metadata?.vision || '');

  React.useEffect(() => {
    setTitle(section.title || '');
    setSubtitle(section.subtitle || '');
    setContent(section.content || '');
    setCtaText(section.ctaText || '');
    setCtaUrl(section.ctaUrl || '');
    setBgImage(section.backgroundImage || '');
    setMission(section.metadata?.mission || '');
    setVision(section.metadata?.vision || '');
  }, [section.id]);

  const handleSave = () => {
    const updates: any = { title, subtitle, content, ctaText, ctaUrl, backgroundImage: bgImage || undefined };
    if (section.type === 'about') {
      updates.metadata = { mission, vision };
    }
    onSave(updates);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} className="h-9 text-xs" />
      </div>
      <div>
        <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Subtitle</label>
        <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="h-9 text-xs" />
      </div>
      <div>
        <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Description</label>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          className="w-full h-24 rounded-lg border border-white/10 bg-dark-900/50 px-3 py-2 text-xs text-white placeholder:text-dark-600 focus:border-gold-500/50 focus:outline-none resize-none" />
      </div>
      {(section.type === 'hero') && (
        <>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">CTA Button Text</label>
            <Input value={ctaText} onChange={e => setCtaText(e.target.value)} className="h-9 text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">CTA Link</label>
            <Input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} className="h-9 text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Background Image URL</label>
            <Input value={bgImage} onChange={e => setBgImage(e.target.value)} className="h-9 text-xs" placeholder="https://..." />
          </div>
        </>
      )}
      {section.type === 'about' && (
        <>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Mission</label>
            <textarea value={mission} onChange={e => setMission(e.target.value)}
              className="w-full h-20 rounded-lg border border-white/10 bg-dark-900/50 px-3 py-2 text-xs text-white placeholder:text-dark-600 focus:border-gold-500/50 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Vision</label>
            <textarea value={vision} onChange={e => setVision(e.target.value)}
              className="w-full h-20 rounded-lg border border-white/10 bg-dark-900/50 px-3 py-2 text-xs text-white placeholder:text-dark-600 focus:border-gold-500/50 focus:outline-none resize-none" />
          </div>
        </>
      )}
      <Button onClick={handleSave} disabled={saving} className="w-full" size="sm">
        {saving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
        Save Changes
      </Button>
    </div>
  );
}

/* ─── Settings Panel ─── */
function SettingsPanel({ website, navItems, onNavChange, onSaveNav, onThemeChange, onSeoChange, onSettingsChange, saving }: {
  website: any; navItems: any[]; onNavChange: (items: any[]) => void;
  onSaveNav: () => void; onThemeChange: (theme: string) => void;
  onSeoChange: (seo: any) => void; onSettingsChange: (data: any) => void; saving: boolean;
}) {
  const { toast } = useToast();
  const [tab, setTab] = useState<'nav' | 'theme' | 'seo'>('nav');
  const [seoTitle, setSeoTitle] = useState(website?.seo?.title || '');
  const [seoDesc, setSeoDesc] = useState(website?.seo?.description || '');
  const [seoKeywords, setSeoKeywords] = useState(website?.seo?.keywords?.join(', ') || '');

  const THEMES = [
    { id: 'classic', label: 'Classic', colors: ['#D4AF37', '#0A0A0A', '#1A1A2E'] },
    { id: 'modern', label: 'Modern', colors: ['#3B82F6', '#FFFFFF', '#111827'] },
    { id: 'luxury', label: 'Luxury', colors: ['#8B5CF6', '#0F0F0F', '#1E1B4B'] },
    { id: 'festival', label: 'Festival', colors: ['#F59E0B', '#1C1917', '#451A03'] },
    { id: 'corporate', label: 'Corporate', colors: ['#059669', '#FFFFFF', '#064E3B'] },
    { id: 'entertainment', label: 'Entertainment', colors: ['#DC2626', '#0A0A0A', '#450A0A'] },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-0.5 bg-dark-900 rounded-lg">
        {(['nav', 'theme', 'seo'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all ${
              tab === t ? 'bg-gold-500 text-dark-950' : 'text-dark-500 hover:text-white'
            }`}>
            {t === 'nav' ? 'Navigation' : t === 'theme' ? 'Theme' : 'SEO'}
          </button>
        ))}
      </div>

      {tab === 'nav' && (
        <div className="space-y-1">
          {navItems.sort((a: any, b: any) => a.order - b.order).map((item: any) => (
            <div key={item.id} className={`flex items-center gap-2 p-2 rounded-lg ${item.isEnabled ? 'bg-dark-900/50' : 'bg-dark-900/20 opacity-50'}`}>
              <button onClick={() => onNavChange(navItems.map(n => n.id === item.id ? { ...n, isEnabled: !n.isEnabled } : n))}
                className={`h-4 w-7 rounded-full transition-all relative shrink-0 ${item.isEnabled ? 'bg-gold-500' : 'bg-dark-700'}`}>
                <span className="absolute top-0.5 h-3 w-3 rounded-full bg-white" style={{ left: item.isEnabled ? '14px' : '2px' }} />
              </button>
              <input value={item.label}
                onChange={(e) => onNavChange(navItems.map(n => n.id === item.id ? { ...n, label: e.target.value } : n))}
                className="flex-1 bg-transparent text-xs text-white border-b border-transparent hover:border-white/10 focus:border-gold-500/50 focus:outline-none py-0.5" />
            </div>
          ))}
          <Button onClick={onSaveNav} disabled={saving} className="w-full mt-2" size="sm">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Nav
          </Button>
        </div>
      )}

      {tab === 'theme' && (
        <div className="space-y-2">
          {THEMES.map(theme => (
            <button key={theme.id} onClick={() => onThemeChange(theme.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                website?.theme === theme.id ? 'border-gold-500 bg-gold-500/5' : 'border-white/5 bg-dark-900/50 hover:border-white/10'
              }`}>
              <div className="flex gap-1">
                {theme.colors.map((c, i) => (
                  <div key={i} className="h-5 w-5 rounded border border-white/10" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-xs text-white">{theme.label}</span>
              {website?.theme === theme.id && <Check className="h-3.5 w-3.5 text-gold-500 ml-auto" />}
            </button>
          ))}
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1 block">Meta Title</label>
            <Input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="h-8 text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1 block">Meta Description</label>
            <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)}
              className="w-full h-20 rounded-lg border border-white/10 bg-dark-900/50 px-3 py-2 text-xs text-white placeholder:text-dark-600 focus:border-gold-500/50 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1 block">Keywords</label>
            <Input value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} className="h-8 text-xs" placeholder="comma, separated" />
          </div>
          <Button onClick={() => {
            onSeoChange({ title: seoTitle, description: seoDesc, keywords: seoKeywords.split(',').map(k => k.trim()).filter(Boolean) });
            toast('SEO updated', 'success');
          }} disabled={saving} className="w-full" size="sm">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save SEO
          </Button>
        </div>
      )}
    </div>
  );
}
