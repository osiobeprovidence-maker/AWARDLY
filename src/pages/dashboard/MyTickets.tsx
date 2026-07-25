import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Ticket, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';

export function MyTickets() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">My Tickets</h1>
        <p className="text-dark-400 text-sm">Tickets you've purchased across all events.</p>
      </div>

      <Card className="p-12 text-center border-dashed border-white/10">
        <Ticket className="h-12 w-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-serif text-white mb-2">My Ticket History</h3>
        <p className="text-dark-400 text-sm mb-4">
          Your purchased tickets and event registrations will appear here.
        </p>
        <button onClick={() => navigate('/dashboard/events')} className="text-xs font-bold text-gold-500 uppercase tracking-widest hover:underline">
          Browse Events <ArrowUpRight className="h-3 w-3 inline ml-1" />
        </button>
      </Card>
    </div>
  );
}
