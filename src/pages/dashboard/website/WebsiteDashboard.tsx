import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Globe, Eye, ExternalLink, Copy, Check, Loader2,
  Palette, Navigation, Home, FileText, Calendar,
  Rocket, Clock, ArrowUpRight,
} from 'lucide-react';

export function WebsiteDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const pages = useQuery(
    api.websites.queries.getPagesByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );

  const togglePublish = useMutation(api.websites.mutations.togglePublish);

  const loading = website === undefined;
  const slug = user?.currentOrg?.slug;
  const siteUrl = slug ? `${window.location.origin}/org/${slug}` : '';

  const handlePublish = async () => {
    if (!website) return;
    try {
      await togglePublish({ firebaseUid: user?.id, orgId: user?.currentOrg?.id as any, isPublished: !website.isPublished });
      toast(website.isPublished ? 'Website unpublished' : 'Website is now live!', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to update', 'error');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  if (!website) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Globe className="h-16 w-16 text-dark-600 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-white mb-3">No Website Found</h2>
          <p className="text-dark-400 text-sm mb-8 max-w-md mx-auto">
            A website was automatically created when your organization was set up. If you don't see it, try refreshing.
          </p>
        </CardContent>
      </Card>
    );
  }

  const nav = website.navigation ?? [];
  const sections = website.homepageSections ?? [];
  const publishedPages = pages?.filter((p: any) => p.isPublished) ?? [];
  const draftPages = pages?.filter((p: any) => !p.isPublished) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                  Last published {new Date(website.lastPublishedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {website.isPublished && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-dark-400 font-mono">{siteUrl}</span>
                <button onClick={copyUrl} className="text-dark-500 hover:text-gold-500 transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="text-dark-500 hover:text-gold-500 transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
        <Button onClick={handlePublish} variant={website.isPublished ? 'secondary' : 'primary'}>
          <Rocket className="h-4 w-4 mr-2" />
          {website.isPublished ? 'Unpublish' : 'Publish Now'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4 text-dark-500" />
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Theme</p>
            </div>
            <p className="text-lg font-serif text-white capitalize">{website.theme}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-4 w-4 text-dark-500" />
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Nav Items</p>
            </div>
            <p className="text-lg font-serif text-white">{nav.filter((n: any) => n.isEnabled).length} / {nav.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-dark-500" />
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Sections</p>
            </div>
            <p className="text-lg font-serif text-white">{sections.filter((s: any) => s.isEnabled).length} / {sections.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-dark-500" />
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Pages</p>
            </div>
            <p className="text-lg font-serif text-white">{publishedPages.length} <span className="text-sm text-dark-500">published</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href={`/dashboard/website/navigation`} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-white/5 hover:border-gold-500/30 transition-all group">
              <Navigation className="h-4 w-4 text-dark-500 group-hover:text-gold-500" />
              <span className="text-sm text-dark-400 group-hover:text-white transition-colors">Edit Navigation</span>
            </a>
            <a href={`/dashboard/website/homepage`} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-white/5 hover:border-gold-500/30 transition-all group">
              <Home className="h-4 w-4 text-dark-500 group-hover:text-gold-500" />
              <span className="text-sm text-dark-400 group-hover:text-white transition-colors">Build Homepage</span>
            </a>
            <a href={`/dashboard/website/theme`} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-white/5 hover:border-gold-500/30 transition-all group">
              <Palette className="h-4 w-4 text-dark-500 group-hover:text-gold-500" />
              <span className="text-sm text-dark-400 group-hover:text-white transition-colors">Change Theme</span>
            </a>
            <a href={`/dashboard/website/seo`} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-white/5 hover:border-gold-500/30 transition-all group">
              <Globe className="h-4 w-4 text-dark-500 group-hover:text-gold-500" />
              <span className="text-sm text-dark-400 group-hover:text-white transition-colors">Configure SEO</span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Page Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pages?.map((page: any) => (
              <div key={page.pageId} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-dark-500" />
                  <span className="text-sm text-white">{page.title}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  page.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-700 text-dark-500'
                }`}>
                  {page.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
