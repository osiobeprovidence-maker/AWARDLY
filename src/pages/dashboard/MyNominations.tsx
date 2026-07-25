import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/convex-auth';
import {
  Medal, ArrowUpRight, Clock, CheckCircle2, XCircle, Star,
  Calendar, ArrowRight, Loader2, Search,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  rejected: { label: 'Not Selected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  shortlisted: { label: 'Shortlisted', icon: Star, color: 'text-gold-500', bg: 'bg-gold-500/10' },
} as const;

export function MyNominations() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const nominations = useQuery(
    api.nominations.queries.getBySubmitterEmail,
    user?.email ? { email: user.email } : 'skip'
  );

  const isLoading = nominations === undefined;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">My Nominations</h1>
          <p className="text-dark-400 text-sm">Nominations you've submitted across all events.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/discover')}
        >
          <Search className="h-3.5 w-3.5 mr-1.5" />
          Find Events
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <Loader2 className="h-8 w-8 text-dark-600 mx-auto mb-3 animate-spin" />
          <p className="text-dark-400 text-sm">Loading nominations...</p>
        </Card>
      ) : !nominations || nominations.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <Medal className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No nominations yet</h3>
          <p className="text-dark-400 text-sm mb-4">Submit a nomination to get started.</p>
          <button
            onClick={() => navigate('/discover')}
            className="text-xs font-bold text-gold-500 uppercase tracking-widest hover:underline"
          >
            Browse Events <ArrowUpRight className="h-3 w-3 inline ml-1" />
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {nominations.map((nom) => {
            const config = STATUS_CONFIG[nom.status];
            const StatusIcon = config.icon;

            return (
              <Card key={nom._id} className="p-5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white truncate">{nom.nomineeName}</p>
                      {nom.isSelfNomination && (
                        <span className="px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-500 text-[9px] font-black uppercase tracking-widest">Self</span>
                      )}
                    </div>
                    <p className="text-xs text-dark-400 truncate">
                      {nom.nomineeOrganization ? `${nom.nomineeOrganization} • ` : ''}{config.label}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-dark-500 mb-1">
                      {new Date(nom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                {nom.reviewNotes && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-1">Review Notes</p>
                    <p className="text-xs text-dark-300">{nom.reviewNotes}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
