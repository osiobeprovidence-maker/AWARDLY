import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import {
  LayoutDashboard, CalendarDays, ShoppingCart, Users,
  QrCode, Percent, BarChart3, Settings, Ticket,
} from 'lucide-react';

const tabs = [
  { label: 'Dashboard', to: '/dashboard/ticketing', icon: LayoutDashboard, end: true },
  { label: 'Events', to: '/dashboard/ticketing/events', icon: CalendarDays },
  { label: 'Orders', to: '/dashboard/ticketing/orders', icon: ShoppingCart },
  { label: 'Customers', to: '/dashboard/ticketing/customers', icon: Users },
  { label: 'Check-in', to: '/dashboard/ticketing/check-in', icon: QrCode },
  { label: 'Discounts', to: '/dashboard/ticketing/discounts', icon: Percent },
  { label: 'Analytics', to: '/dashboard/ticketing/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/dashboard/ticketing/settings', icon: Settings },
];

export function TicketingLayout() {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
          <Ticket className="h-5 w-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-white tracking-tight">Ticketing</h1>
          <p className="text-xs text-dark-500">Manage tickets, orders, and check-ins</p>
        </div>
      </div>

      <nav className="flex gap-1 p-1 bg-dark-900/50 border border-white/5 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
