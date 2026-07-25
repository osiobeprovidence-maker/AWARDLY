export interface TicketEvent {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'sold_out' | 'live' | 'completed' | 'archived';
  ticketsSold: number;
  revenue: number;
  currency: string;
  guestCount: number;
  ticketUrl: string;
}

export interface CreateTicketEventInput {
  name: string;
  date: string;
  time?: string;
  venue?: string;
  capacity?: number;
  description?: string;
}

export interface TicketProvider {
  readonly name: string;
  readonly displayName: string;

  createEvent(input: CreateTicketEventInput): Promise<TicketEvent>;
  getEvent(eventId: string): Promise<TicketEvent>;
  syncStats(eventId: string): Promise<{ ticketsSold: number; revenue: number; guestCount: number }>;
}
