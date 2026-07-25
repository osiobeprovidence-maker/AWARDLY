import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useToast } from '../../../lib/toast';
import { useAuth } from '../../../lib/convex-auth';
import {
  Settings, DollarSign, Percent, FileText, Building2,
  Mail, Phone, MapPin, Palette, Upload, QrCode, ToggleLeft,
  Loader2, Shield, Key,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const CURRENCIES = [
  { value: 'NGN', label: '₦ NGN - Nigerian Naira' },
  { value: 'USD', label: '$ USD - US Dollar' },
  { value: 'GBP', label: '£ GBP - British Pound' },
  { value: 'EUR', label: '€ EUR - Euro' },
];

const QR_STYLES = [
  { value: 'standard', label: 'Standard' },
  { value: 'fancy', label: 'Fancy' },
  { value: 'minimal', label: 'Minimal' },
];

export function TicketingSettings() {
  const { toast } = useToast();
  const { currentOrg } = useAuth();
  const [saving, setSaving] = useState(false);

  const [currency, setCurrency] = useState('NGN');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState('7.5');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#c68a35');
  const [confirmEmail, setConfirmEmail] = useState(true);
  const [reminderEmail, setReminderEmail] = useState(true);
  const [qrStyle, setQrStyle] = useState('standard');
  const [allowReentry, setAllowReentry] = useState(true);
  const [requireId, setRequireId] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      toast('Settings saved successfully', 'success');
    } catch {
      toast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Breadcrumbs />
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Settings</h1>
          <p className="text-dark-400">Configure your ticketing preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold-500" /> Currency & Tax
            </CardTitle>
            <CardDescription>Set your default currency and tax rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Default Currency</label>
              <select
                className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Percent className="h-4 w-4 text-dark-400" />
                <div>
                  <p className="text-sm text-white font-medium">Enable Tax</p>
                  <p className="text-xs text-dark-500">Add tax to ticket purchases</p>
                </div>
              </div>
              <button
                onClick={() => setTaxEnabled(!taxEnabled)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  taxEnabled ? 'bg-gold-500' : 'bg-dark-700'
                )}
              >
                <div className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                  taxEnabled ? 'translate-x-6' : 'translate-x-1'
                )} />
              </button>
            </div>

            {taxEnabled && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Tax Rate (%)</label>
                <Input
                  icon={Percent}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Default Refund Policy</label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                placeholder="e.g. Full refund up to 7 days before the event. No refunds within 48 hours..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gold-500" /> Invoice Settings
            </CardTitle>
            <CardDescription>Information for ticket invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Company Name</label>
              <Input
                icon={Building2}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={currentOrg?.name ?? 'Your Organization'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Email</label>
              <Input
                icon={Mail}
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder={currentOrg?.contactEmail ?? 'info@company.com'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Phone</label>
              <Input
                icon={Phone}
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="+234..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Address</label>
              <Input
                icon={MapPin}
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="123 Main Street, Lagos"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-gold-500" /> Ticket Branding
            </CardTitle>
            <CardDescription>Customize the look of your tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Logo</label>
              <div className="h-32 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-gold-500/30 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-dark-500 mb-2" />
                <p className="text-xs text-dark-500">Click to upload logo</p>
                <p className="text-[10px] text-dark-600">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3">Preview</p>
              <div className="h-20 rounded-lg overflow-hidden border border-white/10" style={{ backgroundColor: primaryColor + '20' }}>
                <div className="h-full flex items-center px-4 gap-3">
                  <div className="h-8 w-8 rounded bg-white/10" />
                  <div>
                    <div className="h-2 w-20 bg-white/20 rounded mb-1" />
                    <div className="h-1.5 w-12 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gold-500" /> Email Templates
            </CardTitle>
            <CardDescription>Configure automated email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-dark-400" />
                <div>
                  <p className="text-sm text-white font-medium">Confirmation Email</p>
                  <p className="text-xs text-dark-500">Send receipt after ticket purchase</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmEmail(!confirmEmail)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  confirmEmail ? 'bg-gold-500' : 'bg-dark-700'
                )}
              >
                <div className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                  confirmEmail ? 'translate-x-6' : 'translate-x-1'
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-dark-400" />
                <div>
                  <p className="text-sm text-white font-medium">Reminder Email</p>
                  <p className="text-xs text-dark-500">Send reminder 24h before event</p>
                </div>
              </div>
              <button
                onClick={() => setReminderEmail(!reminderEmail)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  reminderEmail ? 'bg-gold-500' : 'bg-dark-700'
                )}
              >
                <div className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                  reminderEmail ? 'translate-x-6' : 'translate-x-1'
                )} />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-gold-500" /> QR Code Style
            </CardTitle>
            <CardDescription>Choose how QR codes appear on tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {QR_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setQrStyle(style.value)}
                  className={cn(
                    'p-4 rounded-xl border text-center transition-all',
                    qrStyle === style.value
                      ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                      : 'bg-dark-900/50 border-white/10 text-dark-400 hover:border-white/20'
                  )}
                >
                  <QrCode className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-xs font-medium">{style.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold-500" /> Check-in Rules
            </CardTitle>
            <CardDescription>Control attendee check-in behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-dark-400" />
                <div>
                  <p className="text-sm text-white font-medium">Allow Re-entry</p>
                  <p className="text-xs text-dark-500">Let attendees leave and return</p>
                </div>
              </div>
              <button
                onClick={() => setAllowReentry(!allowReentry)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  allowReentry ? 'bg-gold-500' : 'bg-dark-700'
                )}
              >
                <div className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                  allowReentry ? 'translate-x-6' : 'translate-x-1'
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-dark-400" />
                <div>
                  <p className="text-sm text-white font-medium">Require ID</p>
                  <p className="text-xs text-dark-500">Ask for valid ID at check-in</p>
                </div>
              </div>
              <button
                onClick={() => setRequireId(!requireId)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  requireId ? 'bg-gold-500' : 'bg-dark-700'
                )}
              >
                <div className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                  requireId ? 'translate-x-6' : 'translate-x-1'
                )} />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
