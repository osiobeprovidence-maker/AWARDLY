import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/convex-auth';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../lib/toast';
import { Megaphone, Loader2, Send, Users } from 'lucide-react';

export function AdminNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetUserId, setTargetUserId] = useState('');

  const users = useQuery(
    api.admin.queries.getUserDirectory,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const sendNotification = useMutation(api.admin.mutations.sendPlatformNotification);

  const handleSend = async () => {
    if (!title.trim() || !body.trim() || !targetUserId) {
      toast('Please fill in all fields', 'error');
      return;
    }
    try {
      await sendNotification({
        firebaseUid: user?.id,
        userId: targetUserId as any,
        title: title.trim(),
        body: body.trim(),
      });
      toast('Notification sent', 'success');
      setTitle('');
      setBody('');
      setTargetUserId('');
    } catch (err: any) {
      toast(err.message || 'Failed to send', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Notifications</h1>
        <p className="text-dark-400 text-sm mt-1">Send platform-wide notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-serif text-white flex items-center gap-2">
              <Send className="h-5 w-5 text-gold-500" /> Send Notification
            </h3>
            <Input placeholder="Notification title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 text-xs" />
            <textarea
              placeholder="Notification body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-24 rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
            />
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Target User</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none"
              >
                <option value="">Select a user...</option>
                {users?.map((u: any) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <Button onClick={handleSend} className="w-full">
              <Send className="h-4 w-4 mr-2" /> Send Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gold-500" /> Recent Users
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {users?.slice(0, 20).map((u: any) => (
                <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 hover:bg-dark-800/50 transition-colors">
                  <div>
                    <p className="text-sm text-white">{u.name}</p>
                    <p className="text-xs text-dark-500">{u.email}</p>
                  </div>
                  <button
                    onClick={() => setTargetUserId(u._id)}
                    className="text-xs text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
