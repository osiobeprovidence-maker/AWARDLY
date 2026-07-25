import React from 'react';
import { Card } from '../../components/ui/Card';
import { Handshake, Plus, ExternalLink, Globe, Mail } from 'lucide-react';

export function Partners() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Partners</h1>
          <p className="text-dark-400 text-sm">Manage your organization's strategic partnerships.</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold-600 transition-colors">
          <Plus className="h-4 w-4" /> Add Partner
        </button>
      </div>

      <Card className="p-12 text-center border-dashed border-white/10">
        <Handshake className="h-12 w-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-serif text-white mb-2">No partners yet</h3>
        <p className="text-dark-400 text-sm max-w-md mx-auto">
          Partners are organizations or brands that collaborate with you on events, sponsorships, or joint initiatives.
        </p>
      </Card>
    </div>
  );
}
