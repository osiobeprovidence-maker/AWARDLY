import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../lib/toast';
import { ShieldCheck, Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react';

export function AdminVerifications() {
  const { user } = useAuth();
  const { toast } = useToast();

  const requests = useQuery(
    api.admin.queries.getVerificationRequests,
    user?.id ? { firebaseUid: user.id, status: 'pending' } : 'skip'
  );

  const allRequests = useQuery(
    api.admin.queries.getVerificationRequests,
    user?.id ? { firebaseUid: user.id, status: 'all' } : 'skip'
  );

  const approveVerification = useMutation(api.admin.mutations.approveVerification);
  const rejectVerification = useMutation(api.admin.mutations.rejectVerification);

  if (!requests || !allRequests) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-gold-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Verifications</h1>
        <p className="text-dark-400 text-sm mt-1">Review organization verification requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Pending</p>
            <h3 className="text-2xl font-serif text-amber-400">{requests.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Total Requests</p>
            <h3 className="text-2xl font-serif text-white">{allRequests.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2">Approved</p>
            <h3 className="text-2xl font-serif text-emerald-400">{allRequests.filter((r: any) => r.status === 'approved').length}</h3>
          </CardContent>
        </Card>
      </div>

      {requests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif text-white">Pending Requests</h2>
          {requests.map((req: any) => (
            <Card key={req._id}>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{req.orgName}</h4>
                    <p className="text-dark-500 text-xs">{req.documentType.replace(/_/g, ' ')} — Requested by {req.requesterName}</p>
                    <p className="text-dark-600 text-xs mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm"
                    onClick={() => { approveVerification({ firebaseUid: user?.id, requestId: req._id }); toast('Verification approved', 'success'); }}
                    className="h-8 px-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => { rejectVerification({ firebaseUid: user?.id, requestId: req._id }); toast('Verification rejected', 'success'); }}
                    className="h-8 px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-none text-xs">
                    <XCircle className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldCheck className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400 text-sm">No pending verification requests</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
