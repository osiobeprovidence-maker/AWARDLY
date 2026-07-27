import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Activity, Loader2, FileText, User, Building2 } from 'lucide-react';

export function AdminAudit() {
  const { user } = useAuth();

  const logs = useQuery(
    api.admin.queries.getAuditLogs,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  if (!logs) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Audit Logs</h1>
        <p className="text-dark-400 text-sm mt-1">Complete history of admin actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Total Actions</p>
            <h3 className="text-2xl font-serif text-white">{logs.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Today</p>
            <h3 className="text-2xl font-serif text-white">{logs.filter((l: any) => l.createdAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Organizations Affected</p>
            <h3 className="text-2xl font-serif text-white">{new Set(logs.map((l: any) => l.orgName)).size}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="p-0">
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {logs.map((log: any) => (
            <div key={log._id} className="px-6 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5 text-dark-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-dark-500 uppercase tracking-wider">{log.targetType}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-dark-400">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {log.userName}</span>
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {log.orgName}</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(log.metadata).map(([key, value]) => (
                        <span key={key} className="text-[10px] bg-dark-900/50 text-dark-400 px-2 py-0.5 rounded">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="px-6 py-12 text-center text-dark-500 text-sm">No audit logs yet</div>
          )}
        </div>
      </Card>
    </div>
  );
}
