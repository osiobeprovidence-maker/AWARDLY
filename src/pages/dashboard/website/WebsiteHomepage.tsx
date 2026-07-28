import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  GripVertical, ChevronUp, ChevronDown, Trash2, Check, Loader2, Home,
  Image, Type, Megaphone, Newspaper, Trophy, Calendar, Users, MessageSquare,
  Video, MapPin, Phone, Star, Ticket, Mail, Layout, FileText,
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

export function WebsiteHomepage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const updateHomepageSections = useMutation(api.websites.mutations.updateHomepageSections);

  const [items, setItems] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);

  const sections = items ?? website?.homepageSections ?? [];

  const addSection = (type: string) => {
    const def = AVAILABLE_SECTIONS.find(s => s.type === type);
    if (!def) return;
    setItems([...sections, {
      id: `${type}-${Date.now()}`,
      type,
      isEnabled: true,
      order: sections.length,
      title: def.label,
    }]);
  };

  const removeSection = (id: string) => {
    setItems(sections.filter(s => s.id !== id));
  };

  const toggleSection = (id: string) => {
    setItems(sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newItems = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    newItems.forEach((s, i) => s.order = i);
    setItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHomepageSections({ firebaseUid: user?.id, orgId: user?.currentOrg?.id as any, sections });
      toast('Homepage updated', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to save', 'error');
    }
    setSaving(false);
  };

  if (website === undefined) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

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
          {sections.sort((a: any, b: any) => a.order - b.order).map((section: any, index: number) => {
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
                  <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}
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
            {AVAILABLE_SECTIONS.filter(s => !sections.find((i: any) => i.type === s.type)).map((def) => {
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

      <Button onClick={handleSave} className="w-full" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
        Save Homepage
      </Button>
    </div>
  );
}
