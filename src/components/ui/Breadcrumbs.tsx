import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', to: '/dashboard' }];

  let path = '';
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    path += '/' + seg;

    if (seg === 'dashboard' && i === 0) continue;
    if (seg === 'events' && i <= 1) {
      crumbs.push({ label: 'Events & Awards', to: '/dashboard/events' });
      continue;
    }
    if (seg === 'create') {
      crumbs.push({ label: 'Create Event' });
      continue;
    }
    if (seg === 'manage') {
      crumbs.push({ label: 'Manage Event' });
      continue;
    }
    if (seg === 'categories') {
      crumbs.push({ label: 'Categories' });
      continue;
    }
    if (seg === 'nominees') {
      crumbs.push({ label: 'Nominees' });
      continue;
    }
    if (seg === 'criteria') {
      crumbs.push({ label: 'Criteria' });
      continue;
    }
    if (seg === 'branding') {
      crumbs.push({ label: 'Branding' });
      continue;
    }
    if (seg === 'rules') {
      crumbs.push({ label: 'Rules' });
      continue;
    }
    if (seg === 'feed') {
      crumbs.push({ label: 'Community Feed', to: '/dashboard/feed' });
      continue;
    }
    if (seg === 'voting') {
      crumbs.push({ label: 'Nominations & Voting', to: '/dashboard/voting' });
      if (segments[i + 1] === 'settings') {
        crumbs.push({ label: 'Nomination Settings' });
      }
      continue;
    }
    if (seg === 'monetization') {
      crumbs.push({ label: 'Monetization', to: '/dashboard/monetization' });
      continue;
    }
    if (seg === 'live') {
      crumbs.push({ label: 'Live Broadcasts', to: '/dashboard/live' });
      continue;
    }
    if (seg === 'media') {
      crumbs.push({ label: 'Media Center', to: '/dashboard/media' });
      continue;
    }
    if (seg === 'followers') {
      crumbs.push({ label: 'Followers', to: '/dashboard/followers' });
      continue;
    }
    if (seg === 'analytics') {
      crumbs.push({ label: 'Analytics', to: '/dashboard/analytics' });
      continue;
    }
    if (seg === 'settings') {
      crumbs.push({ label: 'Settings', to: '/dashboard/settings' });
      continue;
    }
    if (seg === 'events' && segments[i - 1] !== 'dashboard') {
      crumbs.push({ label: 'Events', to: '/dashboard/events' });
      continue;
    }
  }

  return crumbs;
}

export function Breadcrumbs() {
  const location = useLocation();
  const crumbs = React.useMemo(() => buildBreadcrumbs(location.pathname), [location.pathname]);

  if (crumbs.length <= 1 && location.pathname === '/dashboard') return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs mb-6 flex-wrap">
      <Link to="/dashboard" className="flex items-center gap-1 text-dark-500 hover:text-gold-500 transition-colors">
        <Home className="h-3 w-3" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="h-3 w-3 text-dark-600" />
          {crumb.to ? (
            <Link to={crumb.to} className="text-dark-400 hover:text-gold-500 transition-colors font-medium">
              {crumb.label}
            </Link>
          ) : (
            <span className={cn(
              "font-medium",
              i === crumbs.length - 1 ? "text-white" : "text-dark-400"
            )}>
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
