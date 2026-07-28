import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../../lib/convex-auth';
import { cn } from '../../../lib/utils';
import {
  Globe, LayoutDashboard, Navigation, Home, FileText,
  Palette, Search, Settings, BarChart3, ExternalLink,
} from 'lucide-react';

const tabs = [
  { label: 'Dashboard', to: '/dashboard/website', icon: LayoutDashboard, end: true },
  { label: 'Navigation', to: '/dashboard/website/navigation', icon: Navigation },
  { label: 'Homepage', to: '/dashboard/website/homepage', icon: Home },
  { label: 'Pages', to: '/dashboard/website/pages', icon: FileText },
  { label: 'Theme', to: '/dashboard/website/theme', icon: Palette },
  { label: 'SEO', to: '/dashboard/website/seo', icon: Search },
  { label: 'Appearance', to: '/dashboard/website/appearance', icon: Settings },
  { label: 'Analytics', to: '/dashboard/website/analytics', icon: BarChart3 },
];

export function WebsiteLayout() {
  const { user } = useAuth();
  const website = useQuery(
    api.websites.queries.getByOrg,
    user?.currentOrg?.id ? { orgId: user.currentOrg.id as any } : 'skip'
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-white tracking-tight">Website Manager</h1>
            <p className="text-xs text-dark-500">Build your organization's public website</p>
          </div>
        </div>
        {user?.currentOrg && (
          <a
            href={`/org/${user.currentOrg.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Preview Site
          </a>
        )}
      </div>

      {website && !website.isPublished && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Globe className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            Your site is in <span className="font-bold">draft mode</span>. Publish it to make it live at{' '}
            <span className="font-mono text-amber-200">awardly.com/org/{user?.currentOrg?.slug}</span>
          </p>
        </div>
      )}

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
