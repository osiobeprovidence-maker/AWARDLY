import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { FileText, Check, Loader2, Edit3 } from 'lucide-react';

export function WebsitePages() {
  const { user } = useAuth();
  const { toast } = useToast();

  const pages = useQuery(
    api.websites.queries.getPagesByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const updatePage = useMutation(api.websites.mutations.updatePage);

  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (page: any) => {
    setEditingPage(page.pageId);
    setTitle(page.title);
    setContent(page.content || '');
  };

  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);
    try {
      await updatePage({ firebaseUid: user?.id, orgId: user?.currentOrg?.id as any, pageId: editingPage, title, content });
      toast('Page updated', 'success');
      setEditingPage(null);
    } catch (e: any) {
      toast(e.message || 'Failed to save', 'error');
    }
    setSaving(false);
  };

  const handleTogglePublish = async (page: any) => {
    try {
      await updatePage({ firebaseUid: user?.id, orgId: user?.currentOrg?.id as any, pageId: page.pageId, isPublished: !page.isPublished });
      toast(page.isPublished ? 'Page unpublished' : 'Page published', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to update', 'error');
    }
  };

  if (pages === undefined) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-gold-500" /> Pages
          </CardTitle>
          <p className="text-dark-400 text-xs">Manage your website pages, edit content, and control publishing</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {pages.map((page: any) => (
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
                  <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleTogglePublish(page)} className="h-8 text-xs">
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
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                Save Page
              </Button>
              <Button variant="ghost" onClick={() => setEditingPage(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
