import React from 'react';
import { Card } from '../../components/ui/Card';
import { Award, Plus, ExternalLink, Globe, Trophy } from 'lucide-react';

export function Sponsors() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Sponsors</h1>
          <p className="text-dark-400 text-sm">Manage sponsors for your events and awards.</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold-600 transition-colors">
          <Plus className="h-4 w-4" /> Add Sponsor
        </button>
      </div>

      <Card className="p-12 text-center border-dashed border-white/10">
        <Award className="h-12 w-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-serif text-white mb-2">No sponsors yet</h3>
        <p className="text-dark-400 text-sm max-w-md mx-auto">
          Sponsors provide financial or in-kind support for your events. Add sponsors to display them on your event pages.
        </p>
      </Card>
    </div>
  );
}
