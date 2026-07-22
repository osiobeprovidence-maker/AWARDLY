import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../lib/auth';
import { ROLE_LABELS, ROLE_PERMISSIONS, type MemberRole } from '../../types';
import { mockUsers } from '../../data';
import { Users, Plus, Shield, Trash2, ChevronDown, X, Search, UserPlus, Crown, Settings } from 'lucide-react';

const ALL_ROLES: MemberRole[] = ['owner', 'admin', 'event_manager', 'judge', 'moderator', 'finance', 'content_editor'];

export function TeamManagement() {
  const { currentOrg, members, currentRole, addMember, removeMember, updateMemberRole } = useAuth();
  const { toast } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('event_manager');
  const [showPermissions, setShowPermissions] = useState<string | null>(null);

  const isOwner = currentRole === 'owner';
  const isAdmin = currentRole === 'admin' || isOwner;

  const getMemberInfo = (userId: string) => mockUsers.find(u => u.id === userId);

  const handleInvite = () => {
    const user = mockUsers.find(u => u.email === inviteEmail);
    if (!user) {
      toast('No user found with that email. In production, an invite would be sent.', 'info');
      return;
    }
    if (members.some(m => m.userId === user.id)) {
      toast('This user is already a team member.', 'info');
      return;
    }
    addMember({
      id: `mem_${Date.now()}`,
      userId: user.id,
      orgId: currentOrg!.id,
      role: inviteRole,
      invitedBy: 'current',
      joinedAt: new Date().toISOString(),
    });
    toast(`${user.name} has been added as ${ROLE_LABELS[inviteRole]}!`, 'success');
    setInviteEmail('');
    setInviteRole('event_manager');
    setShowInvite(false);
  };

  const handleRemove = (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from this organization?`)) return;
    removeMember(memberId);
    toast(`${name} has been removed from the team.`, 'success');
  };

  const handleRoleChange = (memberId: string, newRole: MemberRole, name: string) => {
    updateMemberRole(memberId, newRole);
    toast(`${name}'s role changed to ${ROLE_LABELS[newRole]}.`, 'success');
  };

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumbs />
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Team Management</h1>
          <p className="text-dark-400">Manage who has access to {currentOrg.name}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowInvite(true)}>
            <Plus className="h-4 w-4 mr-2" /> Invite Member
          </Button>
        )}
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['owner', 'admin', 'event_manager', 'moderator'] as MemberRole[]).map(role => {
          const count = members.filter(m => m.role === role).length;
          return (
            <Card key={role} className="hover:border-gold-500/20 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {role === 'owner' ? <Crown className="h-4 w-4 text-gold-500" /> : <Shield className="h-4 w-4 text-dark-500" />}
                  <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{ROLE_LABELS[role]}</span>
                </div>
                <p className="text-2xl font-serif text-white">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>{members.length} member{members.length !== 1 ? 's' : ''} in this organization</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-400">No team members yet</p>
            </div>
          ) : (
            members.map(member => {
              const info = getMemberInfo(member.userId);
              if (!info) return null;
              return (
                <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.02] rounded-xl transition-colors border-b border-white/5 last:border-0 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-500 shrink-0">
                      {info.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{info.name}</p>
                        {member.role === 'owner' && <Crown className="h-3 w-3 text-gold-500" />}
                      </div>
                      <p className="text-xs text-dark-500">{info.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-15 sm:ml-0">
                    {/* Role badge / changer */}
                    {isAdmin && member.role !== 'owner' ? (
                      <div className="relative group">
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-dark-400 hover:text-white hover:border-gold-500/30 transition-all">
                          {ROLE_LABELS[member.role]}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 z-40 w-48 bg-dark-900 border border-white/10 rounded-xl shadow-2xl hidden group-hover:block">
                          {ALL_ROLES.filter(r => r !== 'owner').map(r => (
                            <button
                              key={r}
                              onClick={() => handleRoleChange(member.id, r, info.name)}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                r === member.role ? 'text-gold-500 bg-gold-500/10' : 'text-dark-300 hover:bg-white/5 hover:text-white'
                              } first:rounded-t-xl last:rounded-b-xl`}
                            >
                              {ROLE_LABELS[r]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        member.role === 'owner' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'bg-white/5 text-dark-400 border border-white/5'
                      }`}>
                        {ROLE_LABELS[member.role]}
                      </span>
                    )}

                    {/* Remove */}
                    {isAdmin && member.role !== 'owner' && (
                      <button onClick={() => handleRemove(member.id, info.name)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-500/10 text-dark-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gold-500" /> Role Permissions
          </CardTitle>
          <CardDescription>What each role can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-3 text-dark-500 font-bold uppercase tracking-widest">Permission</th>
                  {ALL_ROLES.map(r => (
                    <th key={r} className="text-center py-3 px-2 text-dark-500 font-bold uppercase tracking-widest min-w-[60px]">{ROLE_LABELS[r].slice(0, 6)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Object.keys(ROLE_PERMISSIONS.owner) as (keyof typeof ROLE_PERMISSIONS.owner)[]).map(perm => (
                  <tr key={perm} className="border-b border-white/[0.02]">
                    <td className="py-2.5 px-3 text-dark-300 capitalize">{perm.replace(/([A-Z])/g, ' $1')}</td>
                    {ALL_ROLES.map(r => (
                      <td key={r} className="text-center py-2.5 px-2">
                        {ROLE_PERMISSIONS[r][perm] ? (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/10" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="h-4 w-4 text-dark-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Email Address</label>
                <Input icon={Search} placeholder="member@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-dark-500 uppercase tracking-widest">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_ROLES.filter(r => r !== 'owner').map(r => (
                    <button key={r} onClick={() => setInviteRole(r)} className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      inviteRole === r ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-white/5 bg-white/[0.02] text-dark-400 hover:border-gold-500/30'
                    }`}>
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowInvite(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleInvite}>
                  <UserPlus className="h-4 w-4 mr-2" /> Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
