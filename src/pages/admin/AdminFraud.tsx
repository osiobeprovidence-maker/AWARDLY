import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { AlertTriangle, Loader2, Shield, Wifi, Globe } from 'lucide-react';

export function AdminFraud() {
  const { user } = useAuth();
  const fraud = useQuery(
    api.admin.queries.getFraudAlerts,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  if (!fraud) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Fraud Center</h1>
        <p className="text-dark-400 text-sm mt-1">Detect and prevent suspicious voting activity</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Suspicious IPs</p>
                <h3 className="text-2xl font-serif text-rose-400">{fraud.totalSuspicious}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-rose-500/10">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">High Risk</p>
                <h3 className="text-2xl font-serif text-amber-400">{fraud.highRisk}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/10">
                <Shield className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Medium Risk</p>
                <h3 className="text-2xl font-serif text-sky-400">{fraud.mediumRisk}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-sky-500/10">
                <Wifi className="h-5 w-5 text-sky-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suspicious IP Addresses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Total Votes</th>
                  <th className="px-6 py-3">Unique Users</th>
                  <th className="px-6 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fraud.alerts.map((alert: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 text-sm text-white font-mono">{alert.ipAddress}</td>
                    <td className="px-6 py-3 text-sm text-dark-300">{alert.totalVotes}</td>
                    <td className="px-6 py-3 text-sm text-dark-300">{alert.uniqueUsers}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        alert.riskScore === 'high' ? 'bg-rose-500/10 text-rose-400' :
                        alert.riskScore === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {alert.riskScore}
                      </span>
                    </td>
                  </tr>
                ))}
                {fraud.alerts.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-dark-500 text-sm">No suspicious activity detected</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
