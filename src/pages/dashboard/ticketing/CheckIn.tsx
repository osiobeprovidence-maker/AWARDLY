import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { useAuth } from '../../../lib/convex-auth';
import { useToast } from '../../../lib/toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import {
  QrCode, Camera, Search, CheckCircle, AlertTriangle,
  Loader2, Users, Clock, ScanLine, Ticket,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export function CheckIn() {
  const { currentOrg, user } = useAuth();
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const verifyTicket = useQuery(
    api.ticketing.mutations.verifyTicket,
    ticketCode.trim().length > 5 ? { ticketCode: ticketCode.trim() } : 'skip'
  );

  const checkinAttendee = useMutation(api.ticketing.mutations.checkinAttendee);

  const orgEvents = useQuery(
    api.events.queries.getByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const checkins = useQuery(
    api.ticketing.mutations.getCheckinsByEvent,
    selectedEventId ? { eventId: selectedEventId as any } : 'skip'
  ) ?? [];

  const orders = useQuery(
    api.ticketing.mutations.getOrdersByOrg,
    currentOrg ? { orgId: currentOrg.id as any } : 'skip'
  ) ?? [];

  const eventOrders = selectedEventId
    ? orders.filter(o => o.eventId === selectedEventId && o.paymentStatus === 'successful')
    : [];
  const totalCheckedIn = eventOrders.filter(o => o.checkinStatus === 'checked_in').length;
  const totalAttendees = eventOrders.length;

  const handleCheckIn = async () => {
    if (!verifyTicket?.order) return;

    const order = verifyTicket.order;
    if (order.checkinStatus === 'checked_in') {
      toast('This ticket has already been checked in', 'error');
      return;
    }
    if (order.paymentStatus !== 'successful') {
      toast('This ticket has not been paid for', 'error');
      return;
    }

    try {
      setVerifying(true);
      await checkinAttendee({
        orderId: order.orderId as any,
        checkedInBy: user ? (user as any).convexUserId ?? '' : '',
        method: 'manual',
      });
      toast(`${order.customerName} checked in successfully!`, 'success');
      setTicketCode('');
    } catch (error: any) {
      toast(error.message || 'Check-in failed', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const recentCheckins = checkins.slice(0, 20);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Check-in</h1>
        <p className="text-dark-400">Scan tickets and manage attendee check-ins.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-dark-500 uppercase tracking-widest">Select Event</label>
        <select
          className="flex h-12 w-full max-w-md rounded-lg border border-white/10 bg-dark-900/50 px-4 py-2 text-sm text-white focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">Choose an event</option>
          {orgEvents.map((event) => (
            <option key={event._id} value={event._id}>{event.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-gold-500" /> QR Scanner
              </CardTitle>
              <CardDescription>Point camera at attendee's QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video max-h-64 rounded-2xl bg-dark-950 border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                <Camera className="h-16 w-16 text-dark-700 mb-4" />
                <p className="text-sm text-dark-500 font-medium">Camera viewfinder</p>
                <p className="text-xs text-dark-600 mt-1">Position QR code within frame</p>
                <div className="absolute inset-8 border-2 border-gold-500/30 rounded-xl pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-500 rounded-br-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gold-500" /> Manual Check-in
              </CardTitle>
              <CardDescription>Enter ticket code manually to verify and check in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    icon={Ticket}
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Enter ticket code (e.g. TKT-...)"
                  />
                </div>
                <Button
                  onClick={handleCheckIn}
                  disabled={!verifyTicket?.order || verifying || verifyTicket.order.checkinStatus === 'checked_in'}
                >
                  {verifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Check In
                </Button>
              </div>

              {ticketCode.trim().length > 5 && verifyTicket && (
                <div className={cn(
                  'p-4 rounded-xl border',
                  verifyTicket.order
                    ? verifyTicket.order.checkinStatus === 'checked_in'
                      ? 'bg-yellow-500/10 border-yellow-500/20'
                      : verifyTicket.order.paymentStatus === 'successful'
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    : 'bg-dark-800 border-white/10'
                )}>
                  {verifyTicket.order ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {verifyTicket.order.checkinStatus === 'checked_in' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        ) : verifyTicket.order.paymentStatus === 'successful' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        )}
                        <span className="text-sm font-bold text-white">
                          {verifyTicket.order.checkinStatus === 'checked_in'
                            ? 'Duplicate Scan Detected'
                            : verifyTicket.order.paymentStatus === 'successful'
                              ? 'Valid Ticket'
                              : 'Invalid Ticket'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-dark-500">Name:</span>
                          <span className="text-white ml-2">{verifyTicket.order.customerName}</span>
                        </div>
                        <div>
                          <span className="text-dark-500">Email:</span>
                          <span className="text-white ml-2">{verifyTicket.order.customerEmail}</span>
                        </div>
                        {verifyTicket.event && (
                          <>
                            <div>
                              <span className="text-dark-500">Event:</span>
                              <span className="text-white ml-2">{verifyTicket.event.title}</span>
                            </div>
                            <div>
                              <span className="text-dark-500">Venue:</span>
                              <span className="text-white ml-2">{verifyTicket.event.venue ?? 'N/A'}</span>
                            </div>
                          </>
                        )}
                        {verifyTicket.ticketType && (
                          <div>
                            <span className="text-dark-500">Type:</span>
                            <span className="text-white ml-2">{verifyTicket.ticketType.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-dark-400">No ticket found with this code.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-gold-500/20">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gold-500" />
              </div>
              <p className="text-4xl font-serif text-white mb-1">{totalCheckedIn}</p>
              <p className="text-xs text-dark-500 uppercase tracking-widest font-bold">
                of {totalAttendees} attendees checked in
              </p>
              {totalAttendees > 0 && (
                <div className="mt-4 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all"
                    style={{ width: `${(totalCheckedIn / totalAttendees) * 100}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4 text-gold-500" /> Live Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCheckins.length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400">No check-ins yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentCheckins.map((log) => (
                    <div key={log._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02]">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{log.orderId}</p>
                        <p className="text-[10px] text-dark-500">
                          {log.method === 'qr_scan' ? 'QR Scan' : log.method === 'manual' ? 'Manual' : 'Search'} — {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
