import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { cn } from '../../../lib/utils';
import {
  Percent, Plus, Trash2, Loader2, Tag, Calendar, Hash,
} from 'lucide-react';

export function TicketDiscounts() {
  const { currentOrg } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createDiscount = useMutation(api.ticketing.mutations.createDiscount);
  const deleteDiscount = useMutation(api.ticketing.mutations.deleteDiscount);

  const orgEvents = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const [eventId, setEventId] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const discounts = useQuery(
    api.ticketing.mutations.getDiscountsByEvent,
    eventId ? { eventId: eventId as any } : 'skip'
  ) ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg || !eventId || !code.trim()) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await createDiscount({
        orgId: currentOrg.id as any,
        eventId: eventId as any,
        code: code.trim(),
        description: description.trim() || undefined,
        type,
        value: parseFloat(value) || 0,
        maxUses: parseInt(maxUses) || 100,
        validFrom: validFrom || new Date().toISOString(),
        validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      toast('Discount created successfully', 'success');
      setCode('');
      setDescription('');
      setValue('');
      setMaxUses('');
      setValidFrom('');
      setValidUntil('');
      setShowForm(false);
    } catch (error: any) {
      toast(error.message || 'Failed to create discount', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (discountId: string) => {
    try {
      await deleteDiscount({ discountId: discountId as any });
      toast('Discount deleted', 'success');
    } catch (error: any) {
      toast(error.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Breadcrumbs />
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Discounts</h1>
          <p className="text-dark-400">Create and manage promotional discount codes.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Create Discount
        </Button>
      </div>

      {showForm && (
        <Card className="border-gold-500/20">
          <CardHeader>
            <CardTitle>New Discount Code</CardTitle>
            <CardDescription>Set up a new promotional discount</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Event *</label>
                  <select
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    required
                  >
                    <option value="">Select event</option>
                    {orgEvents.map((ev) => (
                      <option key={ev._id} value={ev._id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Code *</label>
                  <Input
                    icon={Tag}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. EARLYBIRD20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType('percentage')}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                        type === 'percentage'
                          ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                          : 'bg-dark-900/50 border-white/10 text-dark-400 hover:text-white'
                      }`}
                    >
                      Percentage
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('fixed')}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                        type === 'fixed'
                          ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                          : 'bg-dark-900/50 border-white/10 text-dark-400 hover:text-white'
                      }`}
                    >
                      Fixed Amount
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Value *</label>
                  <Input
                    icon={Percent}
                    type="number"
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === 'percentage' ? '10' : '5000'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Max Uses</label>
                  <Input
                    icon={Hash}
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Valid From</label>
                  <input
                    type="datetime-local"
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Valid Until</label>
                  <input
                    type="datetime-local"
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Discount
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {!eventId ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Select Event to View Discounts</label>
                <select
                  className="flex h-12 w-full max-w-md rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                >
                  <option value="">Choose an event</option>
                  {orgEvents.map((ev) => (
                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        ) : discounts.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Percent className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-white mb-2">No discounts yet</h3>
                <p className="text-sm text-dark-400">Create a discount code to boost ticket sales.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discounts.map((discount) => {
              const now = new Date();
              const isActive = discount.isActive && now >= new Date(discount.validFrom) && now <= new Date(discount.validUntil);
              const usagePercent = discount.maxUses > 0 ? (discount.usedCount / discount.maxUses) * 100 : 0;

              return (
                <Card key={discount._id} className={cn(!isActive && 'opacity-60')}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gold-500" />
                        <span className="font-mono text-sm font-bold text-gold-500">{discount.code}</span>
                      </div>
                      <span className={cn(
                        'px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full',
                        isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-800 text-dark-500'
                      )}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {discount.description && (
                      <p className="text-xs text-dark-400">{discount.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                        <p className="text-lg font-bold text-white">
                          {discount.type === 'percentage' ? `${discount.value}%` : `₦${discount.value}`}
                        </p>
                        <p className="text-[10px] text-dark-500 uppercase">{discount.type}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                        <p className="text-lg font-bold text-white">{discount.usedCount}/{discount.maxUses}</p>
                        <p className="text-[10px] text-dark-500 uppercase">Used</p>
                      </div>
                    </div>

                    <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full"
                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-dark-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(discount.validFrom).toLocaleDateString()} — {new Date(discount.validUntil).toLocaleDateString()}
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDelete(discount._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
