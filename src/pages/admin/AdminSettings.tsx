import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../lib/toast';
import { Settings, Globe, DollarSign, Shield, Database, Save } from 'lucide-react';

export function AdminSettings() {
  const { toast } = useToast();
  const [platformName, setPlatformName] = useState('Awardly');
  const [platformEmail, setPlatformEmail] = useState('admin@awardly.com');
  const [currency, setCurrency] = useState('NGN');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [platformFee, setPlatformFee] = useState('5');

  const handleSave = () => {
    toast('Platform settings saved', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight">Platform Settings</h1>
        <p className="text-dark-400 text-sm mt-1">Configure platform-wide settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-gold-500" /> General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Platform Name</label>
              <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Contact Email</label>
              <Input value={platformEmail} onChange={(e) => setPlatformEmail(e.target.value)} className="h-10 text-xs" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none">
                <option value="NGN">NGN (Nigerian Naira)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="GBP">GBP (British Pound)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none">
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-gold-500" /> Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-2 block">Platform Fee (%)</label>
              <Input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} className="h-10 text-xs" />
            </div>
            <div className="p-4 rounded-xl bg-dark-900/50 space-y-2">
              <p className="text-xs text-dark-400">Payment Gateways</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Paystack</span>
                <span className="text-xs text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Flutterwave</span>
                <span className="text-xs text-dark-500 font-medium">Not configured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-gold-500" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Two-Factor Auth</span>
              <span className="text-xs text-emerald-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">API Key Rotation</span>
              <span className="text-xs text-dark-500 font-medium">Every 90 days</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Session Timeout</span>
              <span className="text-xs text-dark-500 font-medium">24 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-gold-500" /> Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Upload Limit</span>
              <span className="text-xs text-white font-medium">50 MB</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Backup Frequency</span>
              <span className="text-xs text-white font-medium">Daily</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50">
              <span className="text-xs text-dark-400">Auto-delete Trash</span>
              <span className="text-xs text-white font-medium">30 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
