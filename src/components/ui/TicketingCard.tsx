import React from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Ticket, ShieldCheck, ExternalLink, CheckCircle, Users, TrendingUp } from 'lucide-react';

interface TicketingCardProps {
  connected?: boolean;
  ticketUrl?: string;
  eventName?: string;
  ticketsSold?: number;
  revenue?: number;
  guestCount?: number;
  variant?: 'compact' | 'full';
  onConnect?: () => void;
}

export function TicketingCard({
  connected = false,
  ticketUrl,
  eventName,
  ticketsSold = 0,
  revenue = 0,
  guestCount = 0,
  variant = 'full',
  onConnect,
}: TicketingCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <Ticket className="h-5 w-5 text-gold-500" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-dark-500 uppercase tracking-widest">Ticketing</p>
          <p className="text-sm text-white">
            {connected ? `${ticketsSold} tickets sold` : 'Not connected'}
          </p>
        </div>
        {connected ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            MyInvite ✓
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-dark-800 text-dark-500">
            Not connected
          </span>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-gold-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ticketing</h3>
              <p className="text-[11px] text-dark-500">Sell tickets for your award ceremony</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">
            Powered by MyInvite
          </span>
        </div>

        {!connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/60 border border-white/5">
              <div className="h-3 w-3 rounded-full bg-dark-600" />
              <p className="text-sm text-white">Registration not yet open</p>
            </div>

            {onConnect && (
              <Button
                onClick={onConnect}
                className="w-full bg-gold-500 hover:bg-gold-600 text-dark-950"
              >
                <Ticket className="h-4 w-4 mr-2" /> Create Ticket Event
              </Button>
            )}

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-dark-400">Secure event registration powered by MyInvite</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm text-white font-medium">{eventName || 'Ticket Event'}</p>
                <p className="text-[11px] text-dark-400">Registration Open</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-lg font-bold text-white">{ticketsSold}</p>
                <p className="text-[10px] font-bold text-dark-500 uppercase">Tickets Sold</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-lg font-bold text-white">{guestCount}</p>
                <p className="text-[10px] font-bold text-dark-500 uppercase">Guests</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-lg font-bold text-white">{revenue.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-dark-500 uppercase">Revenue</p>
              </div>
            </div>

            {ticketUrl && (
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> Get Ticket
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
