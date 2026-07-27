import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Globe, Palette, Layout, FileText, Settings, Eye, GripVertical,
  Plus, Trash2, ChevronUp, ChevronDown, ExternalLink, Check, Loader2,
  Navigation, Home, Image, Type, Megaphone, Newspaper, Trophy, Calendar,
  Users, MessageSquare, Video, MapPin, Phone, Search, Star, Ticket,
  BarChart3, Mail, Share2, Link as LinkIcon
} from 'lucide-react';

const AVAILABLE_SECTIONS = [
  { type: 'hero', label: 'Hero Banner', icon: Image, description: 'Full-width hero with image, title, and CTA' },
  { type: 'countdown', label: 'Countdown Timer', icon: Calendar, description: 'Countdown to event date' },
  { type: 'featured_events', label: 'Featured Awards', icon: Trophy, description: 'Showcase featured events' },
  { type: 'open_nominations', label: 'Open Nominations', icon: Users, description: 'Display open nomination categories' },
  { type: 'call_for_entry', label: 'Call for Entry', icon: Megaphone, description: 'Promote entry submissions' },
  { type: 'ticket_sales', label: 'Ticket Sales', icon: Ticket, description: 'Sell event tickets' },
  { type: 'sponsors', label: 'Sponsors', icon: Star, description: 'Showcase sponsors and partners' },
  { type: 'featured_winners', label: 'Featured Winners', icon: Trophy, description: 'Display past winners' },
  { type: 'video', label: 'Video Section', icon: Video, description: 'Embed video content' },
  { type: 'gallery', label: 'Gallery', icon: Image, description: 'Photo gallery grid' },
  { type: 'latest_news', label: 'Latest News', icon: Newspaper, description: 'Recent posts and updates' },
  { type: 'newsletter', label: 'Newsletter Signup', icon: Mail, description: 'Email subscription form' },
  { type: 'testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Quotes and reviews' },
  { type: 'upcoming_events', label: 'Upcoming Events', icon: Calendar, description: 'List of upcoming events' },
  { type: 'faq', label: 'FAQ', icon: FileText, description: 'Frequently asked questions' },
  { type: 'contact', label: 'Contact', icon: Phone, description: 'Contact form and info' },
  { type: 'map', label: 'Map', icon: MapPin, description: 'Embedded map' },
  { type: 'partners', label: 'Partners', icon: Users, description: 'Partner organizations' },
];

const THEMES = [
  { id: 'classic', label: 'Classic Awards', description: 'Elegant gold & dark theme', colors: ['#D4AF37', '#0A0A0A', '#1A1A2E'] },
  { id: 'modern', label: 'Modern', description: 'Clean, minimal design', colors: ['#3B82F6', '#FFFFFF', '#111827'] },
  { id: 'luxury', label: 'Luxury', description: 'Rich, premium feel', colors: ['#8B5CF6', '#0F0F0F', '#1E1B4B'] },
  { id: 'festival', label: 'Festival', description: 'Vibrant and energetic', colors: ['#F59E0B', '#1C1917', '#451A03'] },
  { id: 'corporate', label: 'Corporate', description: 'Professional and polished', colors: ['#059669', '#FFFFFF', '#064E3B'] },
  { id: 'entertainment', label: 'Entertainment', description: 'Bold and dramatic', colors: ['#DC2626', '#0A0A0A', '#450A0A'] },
];

export function WebsiteBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'navigation' | 'homepage' | 'pages' | 'theme' | 'seo' | 'appearance'>('overview');

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );

  const pages = useQuery(
    api.websites.queries.getPagesByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );

  const createWebsite = useMutation(api.websites.mutations.createWebsite);
  const updateNavigation = useMutation(api.websites.mutations.updateNavigation);
  const updateHomepageSections = useMutation(api.websites.mutations.updateHomepageSections);
  const updateTheme = useMutation(api.websites.mutations.updateTheme);
  const updatePage = useMutation(api.websites.mutations.updatePage);
  const updateSeo = useMutation(api.websites.mutations.updateSeo);
  const updateWebsiteSettings = useMutation(api.websites.mutations.updateWebsiteSettings);

  const loading = website === undefined;
  const orgId = user?.currentOrg?.id as any;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  if (!website && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight">Website Builder</h1>
          <p className="text-dark-400 text-sm mt-1">Create a professional website for your organization</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <Globe className="h-16 w-16 text-dark-600 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-white mb-3">No Website Yet</h2>
            <p className="text-dark-400 text-sm mb-8 max-w-md mx-auto">
              Create a professional website for your organization. Customize navigation, build your homepage, and choose a theme.
            </p>
            <Button onClick={() => { createWebsite({ firebaseUid: user?.id, orgId }); toast('Website created!', 'success'); }}>
              <Globe className="h-4 w-4 mr-2" /> Create Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nav = website?.navigation ?? [];
  const sections = website?.homepageSections ?? [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'appearance', label: 'Appearance', icon: Settings },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight">Website Builder</h1>
          <p className="text-dark-400 text-sm mt-1">Customize your organization's public website</p>
        </div>
        {user?.currentOrg && (
          <a href={`/org/${user.currentOrg.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors">
            <Eye className="h-4 w-4" /> Preview <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-gold-500 text-dark-950' : 'bg-white/5 text-dark-400 hover:text-white hover:bg-white/10'
            }`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Theme</p>
                <p className="text-lg font-serif text-white capitalize">{website?.theme}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Nav Items</p>
                <p className="text-lg font-serif text-white">{nav.filter((n: any) => n.isEnabled).length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Sections</p>
                <p className="text-lg font-serif text-white">{sections.filter((s: any) => s.isEnabled).length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Pages</p>
                <p className="text-lg font-serif text-white">{pages?.length ?? 0}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'navigation' && (
        <NavigationManager
          navigation={nav}
          onSave={(newNav) => { updateNavigation({ firebaseUid: user?.id, orgId, navigation: newNav }); toast('Navigation updated', 'success'); }}
        />
      )}

      {activeTab === 'homepage' && (
        <HomepageBuilder
          sections={sections}
          onSave={(newSections) => { updateHomepageSections({ firebaseUid: user?.id, orgId, sections: newSections }); toast('Homepage updated', 'success'); }}
        />
      )}

      {activeTab === 'pages' && (
        <PagesManager
          pages={pages ?? []}
          onUpdatePage={(pageId, data) => { updatePage({ firebaseUid: user?.id, orgId, pageId, ...data }); toast('Page updated', 'success'); }}
        />
      )}

      {activeTab === 'theme' && (
        <ThemeSelector
          currentTheme={website?.theme ?? 'classic'}
          onSelect={(theme) => { updateTheme({ firebaseUid: user?.id, orgId, theme: theme as any }); toast('Theme updated', 'success'); }}
        />
      )}

      {activeTab === 'seo' && (
        <SeoSettings
          seo={website?.seo}
          onSave={(seo) => { updateSeo({ firebaseUid: user?.id, orgId, seo }); toast('SEO updated', 'success'); }}
        />
      )}

      {activeTab === 'appearance' && (
        <AppearanceSettings
          headerStyle={website?.headerStyle}
          footerStyle={website?.footerStyle}
          footerContent={website?.footerContent}
          customDomain={website?.customDomain}
          onSave={(data) => { updateWebsiteSettings({ firebaseUid: user?.id, orgId, ...data }); toast('Settings updated', 'success'); }}
        />
      )}
    </div>
  );
}

function NavigationManager({ navigation, onSave }: { navigation: any[]; onSave: (nav: any[]) => void }) {
  const [items, setItems] = useState(navigation);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[swapIndex];
    newItems[swapIndex] = temp;
    newItems.forEach((item, i) => item.order = i);
    setItems(newItems);
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isEnabled: !item.isEnabled } : item));
  };

  const updateLabel = (id: string, label: string) => {
    setItems(items.map(item => item.id === id ? { ...item, label } : item));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Navigation className="h-5 w-5 text-gold-500" /> Website Navigation
        </CardTitle>
        <p className="text-dark-400 text-xs">Enable, disable, reorder, and rename navigation items</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.sort((a, b) => a.order - b.order).map((item, index) => (
          <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            item.isEnabled ? 'bg-dark-900/50 border-white/10' : 'bg-dark-900/20 border-white/5 opacity-50'
          }`}>
            <GripVertical className="h-4 w-4 text-dark-600 cursor-grab shrink-0" />
            <button onClick={() => toggleItem(item.id)}
              className={`h-5 w-9 rounded-full transition-all relative shrink-0 ${
                item.isEnabled ? 'bg-gold-500' : 'bg-dark-700'
              }`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                item.isEnabled ? 'left-4.5' : 'left-0.5'
              }`} style={{ left: item.isEnabled ? '18px' : '2px' }} />
            </button>
            <input
              value={item.label}
              onChange={(e) => updateLabel(item.id, e.target.value)}
              className="flex-1 bg-transparent text-sm text-white border-b border-transparent hover:border-white/10 focus:border-gold-500/50 focus:outline-none transition-colors py-1"
            />
            <span className="text-[10px] text-dark-500 uppercase tracking-wider shrink-0">{item.pageId}</span>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => moveItem(index, 'up')} disabled={index === 0}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white disabled:opacity-30 transition-all">
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white disabled:opacity-30 transition-all">
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <Button onClick={() => onSave(items)} className="w-full mt-4">
          <Check className="h-4 w-4 mr-2" /> Save Navigation
        </Button>
      </CardContent>
    </Card>
  );
}

function HomepageBuilder({ sections, onSave }: { sections: any[]; onSave: (sections: any[]) => void }) {
  const [items, setItems] = useState(sections);

  const addSection = (type: string) => {
    const def = AVAILABLE_SECTIONS.find(s => s.type === type);
    if (!def) return;
    setItems([...items, {
      id: `${type}-${Date.now()}`,
      type,
      isEnabled: true,
      order: items.length,
      title: def.label,
    }]);
  };

  const removeSection = (id: string) => {
    setItems(items.filter(s => s.id !== id));
  };

  const toggleSection = (id: string) => {
    setItems(items.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    newItems.forEach((s, i) => s.order = i);
    setItems(newItems);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5 text-gold-500" /> Homepage Sections
          </CardTitle>
          <p className="text-dark-400 text-xs">Add, remove, reorder, and configure homepage sections</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.sort((a, b) => a.order - b.order).map((section, index) => {
            const def = AVAILABLE_SECTIONS.find(s => s.type === section.type);
            const Icon = def?.icon || Layout;
            return (
              <div key={section.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                section.isEnabled ? 'bg-dark-900/50 border-white/10' : 'bg-dark-900/20 border-white/5 opacity-50'
              }`}>
                <GripVertical className="h-4 w-4 text-dark-600 cursor-grab shrink-0" />
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-gold-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{def?.label || section.type}</p>
                  <p className="text-[10px] text-dark-500">{def?.description}</p>
                </div>
                <button onClick={() => toggleSection(section.id)}
                  className={`h-5 w-9 rounded-full transition-all relative shrink-0 ${
                    section.isEnabled ? 'bg-gold-500' : 'bg-dark-700'
                  }`}>
                  <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
                    style={{ left: section.isEnabled ? '18px' : '2px' }} />
                </button>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0}
                    className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white disabled:opacity-30 transition-all">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === items.length - 1}
                    className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white disabled:opacity-30 transition-all">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => removeSection(section.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 text-rose-400 hover:bg-rose-500/10 transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AVAILABLE_SECTIONS.filter(s => !items.find(i => i.type === s.type)).map((def) => {
              const Icon = def.icon;
              return (
                <button key={def.type} onClick={() => addSection(def.type)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-900/50 border border-white/5 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all text-center group">
                  <Icon className="h-6 w-6 text-dark-500 group-hover:text-gold-500 transition-colors" />
                  <span className="text-xs text-dark-400 group-hover:text-white transition-colors">{def.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => onSave(items)} className="w-full">
        <Check className="h-4 w-4 mr-2" /> Save Homepage
      </Button>
    </div>
  );
}

function PagesManager({ pages, onUpdatePage }: { pages: any[]; onUpdatePage: (pageId: string, data: any) => void }) {
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const startEdit = (page: any) => {
    setEditingPage(page.pageId);
    setTitle(page.title);
    setContent(page.content || '');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-gold-500" /> Pages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pages.map((page) => (
            <div key={page.pageId} className="flex items-center justify-between p-4 rounded-xl bg-dark-900/50 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-dark-400" />
                <div>
                  <p className="text-sm text-white">{page.title}</p>
                  <p className="text-[10px] text-dark-500">/{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  page.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-700 text-dark-500'
                }`}>
                  {page.isPublished ? 'Published' : 'Draft'}
                </span>
                <Button size="sm" variant="ghost" onClick={() => startEdit(page)} className="h-8 text-xs">
                  Edit
                </Button>
                <Button size="sm" variant="ghost"
                  onClick={() => onUpdatePage(page.pageId, { isPublished: !page.isPublished })}
                  className="h-8 text-xs">
                  {page.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingPage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edit: {title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" className="h-10 text-xs" />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Page content (HTML supported)..."
              className="w-full h-48 rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none font-mono"
            />
            <div className="flex gap-3">
              <Button onClick={() => { onUpdatePage(editingPage, { title, content }); setEditingPage(null); }}>
                <Check className="h-4 w-4 mr-2" /> Save Page
              </Button>
              <Button variant="ghost" onClick={() => setEditingPage(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ThemeSelector({ currentTheme, onSelect }: { currentTheme: string; onSelect: (theme: string) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-gold-500" /> Choose Theme
          </CardTitle>
          <p className="text-dark-400 text-xs">Select a theme that matches your organization's brand</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((theme) => (
              <button key={theme.id} onClick={() => onSelect(theme.id)}
                className={`p-6 rounded-xl border text-left transition-all ${
                  currentTheme === theme.id
                    ? 'border-gold-500 bg-gold-500/5 ring-1 ring-gold-500/30'
                    : 'border-white/10 bg-dark-900/50 hover:border-white/20'
                }`}>
                <div className="flex gap-2 mb-4">
                  {theme.colors.map((color, i) => (
                    <div key={i} className="h-8 w-8 rounded-lg border border-white/10" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <h4 className="text-white text-sm font-medium mb-1">{theme.label}</h4>
                <p className="text-dark-500 text-xs">{theme.description}</p>
                {currentTheme === theme.id && (
                  <div className="mt-3 flex items-center gap-1.5 text-gold-500 text-xs font-medium">
                    <Check className="h-3.5 w-3.5" /> Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SeoSettings({ seo, onSave }: { seo: any; onSave: (seo: any) => void }) {
  const [title, setTitle] = useState(seo?.title || '');
  const [description, setDescription] = useState(seo?.description || '');
  const [keywords, setKeywords] = useState(seo?.keywords?.join(', ') || '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-gold-500" /> SEO Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meta title" className="h-10 text-xs" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Meta description..."
          className="w-full h-24 rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none resize-none" />
        <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (comma separated)" className="h-10 text-xs" />
        <Button onClick={() => onSave({ title, description, keywords: keywords.split(',').map(k => k.trim()).filter(Boolean) })}>
          <Check className="h-4 w-4 mr-2" /> Save SEO
        </Button>
      </CardContent>
    </Card>
  );
}

function AppearanceSettings({ headerStyle, footerStyle, footerContent, customDomain, onSave }: {
  headerStyle?: string; footerStyle?: string; footerContent?: string; customDomain?: string;
  onSave: (data: any) => void;
}) {
  const [hStyle, setHStyle] = useState(headerStyle || 'default');
  const [fStyle, setFStyle] = useState(footerStyle || 'default');
  const [fContent, setFContent] = useState(footerContent || '');
  const [domain, setDomain] = useState(customDomain || '');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-gold-500" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-3 block">Header Style</label>
            <div className="grid grid-cols-3 gap-3">
              {['default', 'centered', 'minimal'].map((style) => (
                <button key={style} onClick={() => setHStyle(style)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    hStyle === style ? 'border-gold-500 bg-gold-500/5' : 'border-white/10 bg-dark-900/50 hover:border-white/20'
                  }`}>
                  <span className="text-sm text-white capitalize">{style}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-3 block">Footer Style</label>
            <div className="grid grid-cols-3 gap-3">
              {['default', 'centered', 'minimal'].map((style) => (
                <button key={style} onClick={() => setFStyle(style)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    fStyle === style ? 'border-gold-500 bg-gold-500/5' : 'border-white/10 bg-dark-900/50 hover:border-white/20'
                  }`}>
                  <span className="text-sm text-white capitalize">{style}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Footer Content</label>
            <textarea value={fContent} onChange={(e) => setFContent(e.target.value)}
              placeholder="Custom footer text..."
              className="w-full h-24 rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Custom Domain</label>
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="www.yourdomain.com" className="h-10 text-xs" />
            <p className="text-[10px] text-dark-600 mt-1">Connect your own domain (coming soon)</p>
          </div>
          <Button onClick={() => onSave({ headerStyle: hStyle, footerStyle: fStyle, footerContent: fContent, customDomain: domain })}>
            <Check className="h-4 w-4 mr-2" /> Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
