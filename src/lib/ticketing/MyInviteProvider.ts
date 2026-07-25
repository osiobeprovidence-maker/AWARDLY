import { TicketProvider, TicketEvent, CreateTicketEventInput } from './TicketProvider';

const MYINVITE_API_BASE = 'https://api.myinvite.co/v1';

export class MyInviteProvider implements TicketProvider {
  readonly name = 'myinvite';
  readonly displayName = 'MyInvite';

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createEvent(input: CreateTicketEventInput): Promise<TicketEvent> {
    const res = await fetch(`${MYINVITE_API_BASE}/events`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        name: input.name,
        date: input.date,
        time: input.time,
        venue: input.venue,
        capacity: input.capacity,
        description: input.description,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `MyInvite API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      status: data.status,
      ticketsSold: data.tickets_sold ?? 0,
      revenue: data.revenue ?? 0,
      currency: data.currency ?? 'NGN',
      guestCount: data.guest_count ?? 0,
      ticketUrl: data.ticket_url ?? '',
    };
  }

  async getEvent(eventId: string): Promise<TicketEvent> {
    const res = await fetch(`${MYINVITE_API_BASE}/events/${eventId}`, {
      headers: this.headers(),
    });

    if (!res.ok) {
      throw new Error(`MyInvite API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      status: data.status,
      ticketsSold: data.tickets_sold ?? 0,
      revenue: data.revenue ?? 0,
      currency: data.currency ?? 'NGN',
      guestCount: data.guest_count ?? 0,
      ticketUrl: data.ticket_url ?? '',
    };
  }

  async syncStats(eventId: string): Promise<{ ticketsSold: number; revenue: number; guestCount: number }> {
    const event = await this.getEvent(eventId);
    return {
      ticketsSold: event.ticketsSold,
      revenue: event.revenue,
      guestCount: event.guestCount,
    };
  }
}
