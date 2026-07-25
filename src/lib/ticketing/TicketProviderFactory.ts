import { TicketProvider } from './TicketProvider';
import { MyInviteProvider } from './MyInviteProvider';

const providers = new Map<string, TicketProvider>();

export function registerProvider(name: string, provider: TicketProvider) {
  providers.set(name, provider);
}

export function getProvider(name: string): TicketProvider {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`Ticket provider "${name}" not registered. Available: ${Array.from(providers.keys()).join(', ')}`);
  }
  return provider;
}

export function getMyInviteProvider(): MyInviteProvider {
  const existing = providers.get('myinvite');
  if (existing) return existing as MyInviteProvider;

  const apiKey = import.meta.env.VITE_MYINVITE_API_KEY ?? '';
  const provider = new MyInviteProvider(apiKey);
  registerProvider('myinvite', provider);
  return provider;
}
