import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Settings, Check, Loader2, Globe, Share2,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
} from 'lucide-react';

export function WebsiteAppearance() {
  const { user } = useAuth();
  const { toast } = useToast();

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const updateWebsiteSettings = useMutation(api.websites.mutations.updateWebsiteSettings);
  const updateSocialLinks = useMutation(api.websites.mutations.updateSocialLinks);

  const [hStyle, setHStyle] = useState(website?.headerStyle || 'default');
  const [fStyle, setFStyle] = useState(website?.footerStyle || 'default');
  const [fContent, setFContent] = useState(website?.footerContent || '');
  const [domain, setDomain] = useState(website?.customDomain || '');
  const [social, setSocial] = useState({
    facebook: website?.socialLinks?.facebook || '',
    twitter: website?.socialLinks?.twitter || '',
    instagram: website?.socialLinks?.instagram || '',
    linkedin: website?.socialLinks?.linkedin || '',
    youtube: website?.socialLinks?.youtube || '',
    tiktok: website?.socialLinks?.tiktok || '',
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (website) {
      setHStyle(website.headerStyle || 'default');
      setFStyle(website.footerStyle || 'default');
      setFContent(website.footerContent || '');
      setDomain(website.customDomain || '');
      setSocial({
        facebook: website.socialLinks?.facebook || '',
        twitter: website.socialLinks?.twitter || '',
        instagram: website.socialLinks?.instagram || '',
        linkedin: website.socialLinks?.linkedin || '',
        youtube: website.socialLinks?.youtube || '',
        tiktok: website.socialLinks?.tiktok || '',
      });
    }
  }, [website]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateWebsiteSettings({
        firebaseUid: user?.id,
        orgId: user?.currentOrg?.id as any,
        headerStyle: hStyle as any,
        footerStyle: fStyle as any,
        footerContent: fContent,
        customDomain: domain,
      });
      toast('Settings updated', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to save', 'error');
    }
    setSaving(false);
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      await updateSocialLinks({
        firebaseUid: user?.id,
        orgId: user?.currentOrg?.id as any,
        socialLinks: {
          facebook: social.facebook || undefined,
          twitter: social.twitter || undefined,
          instagram: social.instagram || undefined,
          linkedin: social.linkedin || undefined,
          youtube: social.youtube || undefined,
          tiktok: social.tiktok || undefined,
        },
      });
      toast('Social links updated', 'success');
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
            <Settings className="h-5 w-5 text-gold-500" /> Appearance
          </CardTitle>
          <p className="text-dark-400 text-xs">Configure header, footer, custom domain, and social links</p>
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
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-gold-500" /> Social Links
          </CardTitle>
          <p className="text-dark-400 text-xs">Add social media profiles to your website footer</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 block">
                <Facebook className="h-3.5 w-3.5" /> Facebook
              </label>
              <Input value={social.facebook} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} placeholder="https://facebook.com/..." className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 block">
                <Twitter className="h-3.5 w-3.5" /> Twitter / X
              </label>
              <Input value={social.twitter} onChange={(e) => setSocial({ ...social, twitter: e.target.value })} placeholder="https://x.com/..." className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 block">
                <Instagram className="h-3.5 w-3.5" /> Instagram
              </label>
              <Input value={social.instagram} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} placeholder="https://instagram.com/..." className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 block">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </label>
              <Input value={social.linkedin} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} placeholder="https://linkedin.com/..." className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 block">
                <Youtube className="h-3.5 w-3.5" /> YouTube
              </label>
              <Input value={social.youtube} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} placeholder="https://youtube.com/..." className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 block">
                TikTok
              </label>
              <Input value={social.tiktok} onChange={(e) => setSocial({ ...social, tiktok: e.target.value })} placeholder="https://tiktok.com/..." className="h-10 text-xs" />
            </div>
          </div>
          <Button onClick={handleSaveSocial} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Save Social Links
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
