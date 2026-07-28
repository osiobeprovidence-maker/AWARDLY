import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Search, Check, Loader2 } from 'lucide-react';

export function WebsiteSeo() {
  const { user } = useAuth();
  const { toast } = useToast();

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const updateSeo = useMutation(api.websites.mutations.updateSeo);

  const [title, setTitle] = useState(website?.seo?.title || '');
  const [description, setDescription] = useState(website?.seo?.description || '');
  const [keywords, setKeywords] = useState(website?.seo?.keywords?.join(', ') || '');
  const [ogImage, setOgImage] = useState(website?.seo?.ogImage || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (website?.seo) {
      setTitle(website.seo.title || '');
      setDescription(website.seo.description || '');
      setKeywords(website.seo.keywords?.join(', ') || '');
      setOgImage(website.seo.ogImage || '');
    }
  }, [website?.seo]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSeo({
        firebaseUid: user?.id,
        orgId: user?.currentOrg?.id as any,
        seo: {
          title,
          description,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          ogImage: ogImage || undefined,
        },
      });
      toast('SEO updated', 'success');
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
            <Search className="h-5 w-5 text-gold-500" /> SEO Settings
          </CardTitle>
          <p className="text-dark-400 text-xs">Optimize your website for search engines</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Meta Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your organization name - Awards Platform" className="h-10 text-xs" />
            <p className="text-[10px] text-dark-600 mt-1">{title.length}/60 characters</p>
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Meta Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your organization for search engines..."
              className="w-full h-24 rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none resize-none" />
            <p className="text-[10px] text-dark-600 mt-1">{description.length}/160 characters</p>
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Keywords</label>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="awards, ceremony, excellence, nominees" className="h-10 text-xs" />
            <p className="text-[10px] text-dark-600 mt-1">Comma-separated keywords</p>
          </div>
          <div>
            <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">OG Image URL</label>
            <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/og-image.jpg" className="h-10 text-xs" />
            <p className="text-[10px] text-dark-600 mt-1">Recommended: 1200x630px for social sharing previews</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Save SEO
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Search Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-blue-400 text-sm font-medium mb-0.5">{title || 'Your Organization Name'}</p>
            <p className="text-emerald-400 text-xs mb-1">awardly.com/org/{user?.currentOrg?.slug}</p>
            <p className="text-dark-400 text-xs">{description || 'Your meta description will appear here...'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
