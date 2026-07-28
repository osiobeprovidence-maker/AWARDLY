import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { GripVertical, ChevronUp, ChevronDown, Check, Loader2, Navigation } from 'lucide-react';

export function WebsiteNavigation() {
  const { user } = useAuth();
  const { toast } = useToast();

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const updateNavigation = useMutation(api.websites.mutations.updateNavigation);

  const [items, setItems] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);

  const navigation = items ?? website?.navigation ?? [];

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navigation];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    newItems.forEach((item, i) => item.order = i);
    setItems(newItems);
  };

  const toggleItem = (id: string) => {
    setItems(navigation.map(item => item.id === id ? { ...item, isEnabled: !item.isEnabled } : item));
  };

  const updateLabel = (id: string, label: string) => {
    setItems(navigation.map(item => item.id === id ? { ...item, label } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNavigation({ firebaseUid: user?.id, orgId: user?.currentOrg?.id as any, navigation: navigation });
      toast('Navigation updated', 'success');
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
            <Navigation className="h-5 w-5 text-gold-500" /> Website Navigation
          </CardTitle>
          <p className="text-dark-400 text-xs">Enable, disable, reorder, and rename navigation items</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {navigation.sort((a: any, b: any) => a.order - b.order).map((item: any, index: number) => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              item.isEnabled ? 'bg-dark-900/50 border-white/10' : 'bg-dark-900/20 border-white/5 opacity-50'
            }`}>
              <GripVertical className="h-4 w-4 text-dark-600 cursor-grab shrink-0" />
              <button onClick={() => toggleItem(item.id)}
                className={`h-5 w-9 rounded-full transition-all relative shrink-0 ${
                  item.isEnabled ? 'bg-gold-500' : 'bg-dark-700'
                }`}>
                <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
                  style={{ left: item.isEnabled ? '18px' : '2px' }} />
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
                <button onClick={() => moveItem(index, 'down')} disabled={index === navigation.length - 1}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          <Button onClick={handleSave} className="w-full mt-4" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Save Navigation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
