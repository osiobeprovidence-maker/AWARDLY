import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { BarChart3, Eye, FileText, TrendingUp, Loader2 } from 'lucide-react';

export function WebsiteAnalytics() {
  const { user } = useAuth();

  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );
  const pages = useQuery(
    api.websites.queries.getPagesByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );

  if (website === undefined) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-gold-500" /> Website Analytics
          </CardTitle>
          <p className="text-dark-400 text-xs">Track your website's performance and visitor engagement</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-dark-900/50 border border-white/5 text-center">
              <Eye className="h-8 w-8 text-dark-500 mx-auto mb-3" />
              <p className="text-2xl font-serif text-white mb-1">--</p>
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Total Views</p>
            </div>
            <div className="p-6 rounded-xl bg-dark-900/50 border border-white/5 text-center">
              <TrendingUp className="h-8 w-8 text-dark-500 mx-auto mb-3" />
              <p className="text-2xl font-serif text-white mb-1">--</p>
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Unique Visitors</p>
            </div>
            <div className="p-6 rounded-xl bg-dark-900/50 border border-white/5 text-center">
              <FileText className="h-8 w-8 text-dark-500 mx-auto mb-3" />
              <p className="text-2xl font-serif text-white mb-1">{pages?.length ?? 0}</p>
              <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Total Pages</p>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-dark-900/50 border border-white/5 text-center">
            <BarChart3 className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-white mb-2">Analytics Coming Soon</h3>
            <p className="text-dark-400 text-sm max-w-md mx-auto">
              Detailed analytics including page views, visitor demographics, referral sources, and engagement metrics
              will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
