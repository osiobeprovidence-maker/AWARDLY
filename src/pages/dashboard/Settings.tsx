import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building2, User, Lock, Bell, Globe, Palette, Shield, CreditCard, Mail, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { ImageUpload } from '../../components/ImageUpload';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

export function DashboardSettings() {
  const { toast } = useToast();
  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Settings</h1>
        <p className="text-dark-400">Configure your organization and account preferences.</p>
      </div>

      <Tabs defaultValue="org">
        <TabsList>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="billing">Billing & Plans</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>Public Information</CardTitle>
                 <CardDescription>This information will be displayed on your public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Organization Name</label>
                       <Input defaultValue="Headies Official" icon={Building2} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Support Email</label>
                       <Input defaultValue="awards@headies.com" icon={Mail} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Bio</label>
                    <textarea 
                      className="w-full min-h-[120px] bg-dark-900 border border-white/10 rounded-lg p-4 text-white text-sm outline-none focus:ring-1 focus:ring-gold-500"
                      defaultValue="Recognizing outstanding achievements in the Nigerian music industry since 2006."
                    />
                 </div>
                 <div className="flex justify-end pt-4">
                    <Button onClick={() => toast('Organization settings saved', 'success')}>Save Changes</Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-gold-500/10">
              <CardHeader>
                 <CardTitle>Social Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Input placeholder="X / Twitter Handle" icon={Globe} />
                 <Input placeholder="Instagram Handle" icon={Globe} />
                 <Input placeholder="Official Website" icon={Globe} />
                 <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={() => toast('Social profiles updated', 'success')}>Update Socials</Button>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="branding">
           <Card>
              <CardHeader>
                 <CardTitle>Branding & Visual Identity</CardTitle>
                 <CardDescription>Customize how your organization appears to the public.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-4">
                 <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <ImageUpload 
                          label="Logo (Square)"
                          aspectRatio="square"
                          value="https://api.dicebear.com/7.x/initials/svg?seed=H&backgroundColor=c68a35"
                          onImageSelect={(file) => console.log("Logo selected:", file)}
                          className="max-w-[200px]"
                       />
                       
                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Brand Color</label>
                          <div className="flex gap-3">
                             {['#c68a35', '#2563eb', '#db2777', '#10b981', '#f59e0b', '#ef4444'].map(c => (
                               <div key={c} className="h-10 w-10 rounded-xl cursor-pointer border-2 border-transparent hover:border-white/20 transition-all hover:scale-110 shadow-lg" style={{ backgroundColor: c }} />
                             ))}
                             <div className="h-10 w-10 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer text-dark-400 hover:text-white hover:border-white/30 transition-all font-mono text-xs">+</div>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Typography Style</label>
                          <select className="w-full h-11 bg-dark-900 border border-white/10 rounded-lg px-4 text-white text-sm outline-none">
                             <option>Serif (Classic & Prestigious)</option>
                             <option>Sans-Serif (Modern & Clean)</option>
                             <option>Mono (Technical & Bold)</option>
                          </select>
                       </div>
                    </div>
                    
                    <ImageUpload 
                       label="Cover Banner (Wide)"
                       aspectRatio="video"
                       value="https://images.unsplash.com/photo-1540039155732-684735035727?q=80&w=1200&h=400&auto=format&fit=crop"
                       onImageSelect={(file) => console.log("Banner selected:", file)}
                    />
                 </div>
                 
                 <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gold-500/5 border border-gold-500/20">
                       <div>
                          <h4 className="text-white font-medium text-sm">Preview Hub</h4>
                          <p className="text-xs text-dark-400">See how your changes look in real-time on your public page.</p>
                       </div>
                        <Button variant="outline" size="sm" onClick={() => toast('Opening hub preview...', 'info')}>Open Hub Preview</Button>
                    </div>
                    <div className="flex justify-end mt-8">
                       <Button onClick={() => toast('Branding updated successfully', 'success')}>Update Branding</Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
           <Card className="bg-gold-500/5 border-gold-500/20">
              <CardContent className="flex flex-col md:flex-row items-center gap-8 justify-between pt-6">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-white">Starter Plan</h3>
                    <p className="text-dark-400">Your organization is currently on the free tier.</p>
                 </div>
                 <Button variant="primary" size="lg" onClick={() => toast('Redirecting to upgrade page...', 'info')}>Upgrade Now</Button>
              </CardContent>
           </Card>
           
           <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                       <div className="h-10 w-12 bg-dark-800 rounded border border-white/5 flex items-center justify-center text-xs font-bold">VISA</div>
                       <div className="flex-1">
                          <p className="text-sm text-white font-medium">•••• 4242</p>
                          <p className="text-xs text-dark-500">Exp 12/28</p>
                       </div>
                       <Button variant="ghost" size="sm" className="text-rose-400" onClick={() => toast('Payment method removed', 'success')}>Remove</Button>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-xs font-bold uppercase tracking-widest" onClick={() => toast('Card form opened', 'info')}><CreditCard className="h-4 w-4 mr-2" /> Add New Card</Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage who has access to your organization dashboard.</CardDescription>
                 </div>
                  <Button size="sm" onClick={() => toast('Invite form opened', 'info')}><Plus className="h-4 w-4 mr-2" /> Invite Member</Button>
              </CardHeader>
              <CardContent className="space-y-1">
                 {[
                   { name: 'Jackson Hartwells', email: 'jackson@headies.com', role: 'Owner', avatar: 'JH' },
                   { name: 'Sarah Miller', email: 'sarah@headies.com', role: 'Editor', avatar: 'SM' },
                   { name: 'David Chen', email: 'david@headies.com', role: 'Viewer', avatar: 'DC' },
                 ].map((member, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/0 hover:bg-white/5 rounded-xl transition-colors group border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-dark-800 rounded-full flex items-center justify-center text-xs font-bold text-gold-500 border border-white/10">{member.avatar}</div>
                         <div>
                            <p className="text-sm font-medium text-white">{member.name}</p>
                            <p className="text-xs text-dark-500">{member.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-dark-400 bg-white/5 px-2 py-1 rounded-md">{member.role}</span>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-dark-500 hover:text-white"><div className="h-4 w-4">...</div></Button>
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>Security & Access</CardTitle>
                 <CardDescription>Manage your passwords and session security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Current Password</label>
                       <Input type="password" icon={Lock} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">New Password</label>
                       <Input type="password" icon={Lock} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="flex items-center gap-4">
                          <Shield className="h-5 w-5 text-emerald-500" />
                          <div>
                             <h4 className="text-white font-medium text-sm">Two-Factor Authentication</h4>
                             <p className="text-xs text-dark-500">Add an extra layer of security to your account.</p>
                          </div>
                       </div>
                        <Button variant="outline" size="sm" onClick={() => toast('2FA setup initiated', 'info')}>Enable 2FA</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="flex items-center gap-4">
                          <Lock className="h-5 w-5 text-dark-400" />
                          <div>
                             <h4 className="text-white font-medium text-sm">Active Sessions</h4>
                             <p className="text-xs text-dark-500">You are currently logged in on 2 devices.</p>
                          </div>
                       </div>
                        <Button variant="ghost" size="sm" className="text-rose-400" onClick={() => toast('All sessions terminated', 'success')}>Logout Everywhere</Button>
                    </div>
                 </div>
                 
                 <div className="flex justify-end pt-4">
                     <Button onClick={() => toast('Security settings updated', 'success')}>Update Security</Button>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
