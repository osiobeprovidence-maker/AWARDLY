import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function SavedEvents() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.queries.getUserByFirebaseUid,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const bookmarks = useQuery(
    api.feeds.queries.getMyBookmarks,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Saved Events</h1>
        <p className="text-dark-400 text-sm">Events and posts you've saved for later.</p>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-white/10">
          <Bookmark className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No saved items</h3>
          <p className="text-dark-400 text-sm mb-4">Bookmark events and posts to save them here.</p>
          <button onClick={() => navigate('/dashboard/feed')} className="text-xs font-bold text-gold-500 uppercase tracking-widest hover:underline">
            Browse Feed <ArrowUpRight className="h-3 w-3 inline ml-1" />
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm: any) => (
            <Card key={bm._id} className="p-5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Bookmark className="h-6 w-6 text-gold-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{bm.targetType}</p>
                  <p className="text-xs text-dark-400">Saved {bm.createdAt ? new Date(bm.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
