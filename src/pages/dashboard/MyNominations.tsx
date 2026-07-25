import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Medal, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function MyNominations() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.queries.getUserByFirebaseUid,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const nominationsCount = convexUser?.nominationsCount ?? 0;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">My Nominations</h1>
        <p className="text-dark-400 text-sm">Nominations you've received across all organizations.</p>
      </div>

      {nominationsCount === 0 ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <Medal className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No nominations yet</h3>
          <p className="text-dark-400 text-sm mb-4">Nominations from events will appear here.</p>
          <button onClick={() => navigate('/dashboard/events')} className="text-xs font-bold text-gold-500 uppercase tracking-widest hover:underline">
            Browse Events <ArrowUpRight className="h-3 w-3 inline ml-1" />
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: Math.min(nominationsCount, 10) }).map((_, i) => (
            <Card key={i} className="p-5 hover:border-amber-400/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                  <Medal className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Nominated</p>
                  <p className="text-xs text-dark-400">Recognized for outstanding contribution</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
