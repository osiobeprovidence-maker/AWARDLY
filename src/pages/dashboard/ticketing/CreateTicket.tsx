import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import {
  Ticket, Loader2, DollarSign, Hash, Calendar, Eye, FileText, Users,
} from 'lucide-react';

const TICKET_TYPES = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'vip', label: 'VIP' },
  { value: 'vvip', label: 'VVIP' },
  { value: 'early_bird', label: 'Early Bird' },
  { value: 'student', label: 'Student' },
  { value: 'group', label: 'Group' },
  { value: 'table', label: 'Table Reservation' },
  { value: 'donation', label: 'Donation' },
] as const;

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'invite_only', label: 'Invite Only' },
] as const;

export function CreateTicket() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentOrg } = useAuth();
  const createTicketType = useMutation(api.ticketing.mutations.createTicketType);

  const orgEvents = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const [submitting, setSubmitting] = useState(false);
  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('paid');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [maxPerCustomer, setMaxPerCustomer] = useState('10');
  const [salesStart, setSalesStart] = useState('');
  const [salesEnd, setSalesEnd] = useState('');
  const [visibility, setVisibility] = useState<string>('public');
  const [refundPolicy, setRefundPolicy] = useState('');

  const isFree = type === 'free';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg || !eventId || !name.trim()) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await createTicketType({
        orgId: currentOrg.id as any,
        eventId: eventId as any,
        name: name.trim(),
        description: description.trim() || undefined,
        type: type as any,
        price: isFree ? 0 : parseFloat(price) || 0,
        currency: 'NGN',
        quantity: parseInt(quantity) || 100,
        maxPerCustomer: parseInt(maxPerCustomer) || 10,
        salesStart: salesStart || undefined,
        salesEnd: salesEnd || undefined,
        visibility: visibility as any,
        refundPolicy: refundPolicy.trim() || undefined,
      });
      toast('Ticket type created successfully', 'success');
      navigate('/dashboard/ticketing/orders');
    } catch (error: any) {
      toast(error.message || 'Failed to create ticket type', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentOrg) {
    return <div className="text-center py-20 text-dark-400">Select an organization first.</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Create Ticket</h1>
        <p className="text-dark-400">Set up a new ticket type for an event.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-gold-500" /> Ticket Details
            </CardTitle>
            <CardDescription>Basic information about this ticket type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Event *</label>
              <select
                className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                required
              >
                <option value="">Select an event</option>
                {orgEvents.map((event) => (
                  <option key={event._id} value={event._id}>{event.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Ticket Name *</label>
              <Input
                icon={Ticket}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard Pass"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Description</label>
              <textarea
                className="w-full min-h-[80px] rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what's included with this ticket..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold-500" /> Pricing & Quantity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Ticket Type *</label>
              <div className="grid grid-cols-3 gap-2">
                {TICKET_TYPES.map((tt) => (
                  <button
                    key={tt.value}
                    type="button"
                    onClick={() => setType(tt.value)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                      type === tt.value
                        ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                        : 'bg-dark-900/50 border-white/10 text-dark-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {tt.label}
                  </button>
                ))}
              </div>
            </div>

            {!isFree && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Price (₦) *</label>
                <Input
                  icon={DollarSign}
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required={!isFree}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Quantity Available *</label>
                <Input
                  icon={Hash}
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Max Per Customer *</label>
                <Input
                  icon={Users}
                  type="number"
                  min="1"
                  value={maxPerCustomer}
                  onChange={(e) => setMaxPerCustomer(e.target.value)}
                  placeholder="10"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold-500" /> Sales Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Sales Start</label>
                <input
                  type="datetime-local"
                  className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                  value={salesStart}
                  onChange={(e) => setSalesStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Sales End</label>
                <input
                  type="datetime-local"
                  className="flex h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                  value={salesEnd}
                  onChange={(e) => setSalesEnd(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gold-500" /> Visibility & Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Visibility</label>
              <div className="flex gap-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setVisibility(opt.value)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                      visibility === opt.value
                        ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                        : 'bg-dark-900/50 border-white/10 text-dark-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Refund Policy</label>
              <textarea
                className="w-full min-h-[80px] rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                placeholder="e.g. Full refund up to 7 days before event..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Ticket
          </Button>
        </div>
      </form>
    </div>
  );
}
