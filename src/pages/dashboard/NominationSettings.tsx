import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Shield, Users, Clock, ArrowLeft, Save, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

export function NominationSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pubNom, setPubNom] = React.useState(true);
  const [emailVerify, setEmailVerify] = React.useState(false);
  const [ipLimit, setIpLimit] = React.useState(false);
  const [mediaReq, setMediaReq] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div>
        <Breadcrumbs />
        <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/voting')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight">Nomination Settings</h1>
          <p className="text-dark-400">Configure how the public can nominate candidates for your awards.</p>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Nominations</CardTitle>
              <CardDescription>Control visibility and access for nomination forms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                     <Globe className="h-5 w-5 text-gold-500" />
                     <div>
                        <h4 className="text-white font-medium text-sm">Open Public Nominations</h4>
                        <p className="text-xs text-dark-500">Allow anyone with a link to submit nominations.</p>
                     </div>
                  </div>
                   <div className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors ${pubNom ? 'bg-gold-500' : 'bg-dark-800'}`} onClick={() => setPubNom(!pubNom)}>
                      <div className={`absolute top-1 h-4 w-4 bg-dark-950 rounded-full transition-all ${pubNom ? 'right-1' : 'left-1'}`} />
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Start Date</label>
                     <Input type="date" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">End Date</label>
                     <Input type="date" />
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Rules</CardTitle>
              <CardDescription>Set requirements for valid nominations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: 'Require Email Verification', desc: 'Nominators must confirm their email address.', icon: Shield, state: emailVerify, toggle: () => setEmailVerify(!emailVerify) },
                 { label: 'Limit per IP Address', desc: 'Prevent multiple submissions from the same network.', icon: Shield, state: ipLimit, toggle: () => setIpLimit(!ipLimit) },
                 { label: 'Require Media Evidence', desc: 'Nominators must upload supporting documents or links.', icon: Clock, state: mediaReq, toggle: () => setMediaReq(!mediaReq) },
               ].map((rule, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <rule.icon className="h-4 w-4 text-dark-400" />
                       <div className="text-sm">
                          <p className="text-white font-medium">{rule.label}</p>
                          <p className="text-xs text-dark-500">{rule.desc}</p>
                       </div>
                    </div>
                    <div className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${rule.state ? 'bg-gold-500' : 'bg-dark-800'}`} onClick={rule.toggle}>
                       <div className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${rule.state ? 'right-0.5 bg-dark-950' : 'left-0.5 bg-dark-500'}`} />
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-white">Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-dark-400 leading-relaxed">
                  Clearly define your nomination criteria to ensure high-quality submissions. Changes to these settings take effect immediately on your public hub.
               </p>
                <Button className="w-full mt-6" onClick={() => toast('Nomination settings saved', 'success')}>
                  <Save className="h-4 w-4 mr-2" /> Save Settings
                </Button>
            </CardContent>
          </Card>

          <Card className="bg-gold-500/5 border-gold-500/10">
             <CardContent className="pt-6">
                <Users className="h-8 w-8 text-gold-500 mb-4" />
                <h4 className="text-white font-medium mb-1">Moderation Queue</h4>
                <p className="text-xs text-dark-400 leading-relaxed mb-4">You have 128 nominations waiting for approval before they appear on the public voting list.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/voting')}>View Queue</Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
