import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Trophy, Star, Medal, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function MyAwards() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.queries.getUserByFirebaseUid,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const awardsCount = convexUser?.awardsCount ?? 0;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">My Awards</h1>
        <p className="text-dark-400 text-sm">Awards you've won across all organizations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <Trophy className="h-10 w-10 text-gold-500 mx-auto mb-3" />
          <h3 className="text-3xl font-serif text-white mb-1">{awardsCount}</h3>
          <p className="text-xs text-dark-500 uppercase tracking-widest font-bold">Total Awards</p>
        </Card>
        <Card className="p-6 text-center">
          <Star className="h-10 w-10 text-gold-500 mx-auto mb-3" />
          <h3 className="text-3xl font-serif text-white mb-1">{convexUser?.reputationScore ?? 0}</h3>
          <p className="text-xs text-dark-500 uppercase tracking-widest font-bold">Reputation</p>
        </Card>
        <Card className="p-6 text-center">
          <Medal className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-3xl font-serif text-white mb-1">{convexUser?.nominationsCount ?? 0}</h3>
          <p className="text-xs text-dark-500 uppercase tracking-widest font-bold">Nominations</p>
        </Card>
      </div>

      {awardsCount === 0 ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No awards yet</h3>
          <p className="text-dark-400 text-sm mb-4">Participate in events to earn your first recognition.</p>
          <button onClick={() => navigate('/dashboard/events')} className="text-xs font-bold text-gold-500 uppercase tracking-widest hover:underline">
            Browse Events <ArrowUpRight className="h-3 w-3 inline ml-1" />
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: Math.min(awardsCount, 10) }).map((_, i) => (
            <Card key={i} className="p-5 hover:border-gold-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Trophy className="h-6 w-6 text-gold-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Award Recipient</p>
                  <p className="text-xs text-dark-400">Excellence in achievements</p>
                </div>
                <Star className="h-5 w-5 text-gold-500" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
