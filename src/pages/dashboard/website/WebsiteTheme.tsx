import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Palette, Check, Loader2 } from 'lucide-react';

const THEMES = [
  { id: 'classic', label: 'Classic Awards', description: 'Elegant gold & dark theme', colors: ['#D4AF37', '#0A0A0A', '#1A1A2E'] },
  { id: 'modern', label: 'Modern', description: 'Clean, minimal design', colors: ['#3B82F6', '#FFFFFF', '#111827'] },
  { id: 'luxury', label: 'Luxury', description: 'Rich, premium feel', colors: ['#8B5CF6', '#0F0F0F', '#1E1B4B'] },
  { id: 'festival', label: 'Festival', description: 'Vibrant and energetic', colors: ['#F59E0B', '#1C1917', '#451A03'] },
  { id: 'corporate', label: 'Corporate', description: 'Professional and polished', colors: ['#059669', '#FFFFFF', '#064E3B'] },
  { id: 'entertainment', label: 'Entertainment', description: 'Bold and dramatic', colors: ['#DC2626', '#0A0A0A', '#450A0A'] },
];

export function WebsiteTheme() {
  const { user } = useAuth();
  const { toast } = useToast();

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const updateTheme = useMutation(api.websites.mutations.updateTheme);

  const handleSelect = async (theme: string) => {
    try {
      await updateTheme({ firebaseUid: user?.id, orgId: user?.currentOrg?.id as any, theme: theme as any });
      toast('Theme updated', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to update theme', 'error');
    }
  };

  if (website === undefined) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  const currentTheme = website?.theme ?? 'classic';

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
              <button key={theme.id} onClick={() => handleSelect(theme.id)}
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
