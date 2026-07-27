import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { BrandLogo } from '../../components/brand/BrandLogo';
import {
  WebsiteHeader,
  OrgWebsiteHome,
  OrgWebsiteAbout,
  OrgWebsiteEvents,
  OrgWebsiteWinners,
  OrgWebsiteMedia,
  OrgWebsiteContact,
  OrgWebsiteVoting,
  OrgWebsiteLiveFeed,
} from './website';

const DEFAULT_NAVIGATION = [
  { id: 'home', label: 'Home', pageId: 'home', isEnabled: true, order: 0 },
  { id: 'about', label: 'About', pageId: 'about', isEnabled: true, order: 1 },
  { id: 'events', label: 'Events', pageId: 'events', isEnabled: true, order: 2 },
  { id: 'winners', label: 'Winners', pageId: 'winners', isEnabled: true, order: 3 },
  { id: 'media', label: 'Media', pageId: 'media', isEnabled: true, order: 4 },
  { id: 'voting', label: 'Voting', pageId: 'voting', isEnabled: false, order: 5 },
  { id: 'live-feed', label: 'Live Feed', pageId: 'live-feed', isEnabled: false, order: 6 },
  { id: 'contact', label: 'Contact', pageId: 'contact', isEnabled: true, order: 7 },
];

const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: 'hero', type: 'hero', isEnabled: true, order: 0, title: 'Welcome', subtitle: 'Celebrating Excellence' },
  { id: 'featured-events', type: 'featured_events', isEnabled: true, order: 1, title: 'Featured Awards' },
  { id: 'sponsors', type: 'sponsors', isEnabled: true, order: 2, title: 'Our Sponsors' },
  { id: 'newsletter', type: 'newsletter', isEnabled: true, order: 3, title: 'Stay Updated', subtitle: 'Subscribe to our newsletter' },
];

export function OrgProfile() {
  const { orgId } = useParams();
  const [activePage, setActivePage] = React.useState('home');

  const org = useQuery(api.organizations.queries.getBySlug, orgId ? { slug: orgId } : 'skip');
  const website = useQuery(
    api.websites.queries.getByOrg,
    org ? { orgId: org._id } : 'skip'
  );
  const events = useQuery(
    api.events.queries.getByOrg,
    org ? { orgId: org._id } : 'skip'
  ) ?? [];
  const posts = useQuery(
    api.feeds.queries.getPublicByOrg,
    org ? { orgId: org._id } : 'skip'
  ) ?? [];
  const sponsors = useQuery(
    api.sponsors.queries.getActiveByOrg,
    org ? { orgId: org._id } : 'skip'
  ) ?? [];
  const broadcasts = useQuery(
    api.broadcasts.queries.getByOrg,
    org ? { orgId: org._id } : 'skip'
  ) ?? [];

  if (!org) {
    return <div className="text-white p-12 text-center min-h-screen bg-dark-950">Loading...</div>;
  }

  const navigation = website?.navigation ?? DEFAULT_NAVIGATION;
  const homepageSections = website?.homepageSections ?? DEFAULT_HOMEPAGE_SECTIONS;
  const liveBroadcast = broadcasts.find((b: any) => b.status === 'live');
  const orgNav = website?.navigation ?? DEFAULT_NAVIGATION;
  const enabledOrgNav = orgNav.filter((n: any) => n.isEnabled).sort((a: any, b: any) => a.order - b.order);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <OrgWebsiteHome
            org={org}
            events={events}
            sponsors={sponsors}
            posts={posts}
            broadcasts={broadcasts}
            sections={homepageSections}
            onNavigate={setActivePage}
          />
        );
      case 'about':
        return <OrgWebsiteAbout org={org} sponsors={sponsors} />;
      case 'events':
        return <OrgWebsiteEvents org={org} events={events} />;
      case 'winners':
        return <OrgWebsiteWinners org={org} events={events} />;
      case 'media':
        return <OrgWebsiteMedia org={org} posts={posts} broadcasts={broadcasts} />;
      case 'voting':
        return <OrgWebsiteVoting org={org} events={events} />;
      case 'live-feed':
        return <OrgWebsiteLiveFeed org={org} posts={posts} />;
      case 'contact':
        return <OrgWebsiteContact org={org} />;
      default:
        return (
          <OrgWebsiteHome
            org={org}
            events={events}
            sponsors={sponsors}
            posts={posts}
            broadcasts={broadcasts}
            sections={homepageSections}
            onNavigate={setActivePage}
          />
        );
    }
  };

  return (
    <div className="w-full flex-1 bg-dark-950 font-sans min-h-screen flex flex-col">
      {/* Org branded header — replaces Awardly nav */}
      <WebsiteHeader
        org={org}
        navigation={navigation}
        activePage={activePage}
        onNavigate={(pageId) => { setActivePage(pageId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        liveBroadcast={liveBroadcast}
      />

      {/* Cover banner (only if cover image exists, and not on home page where hero section shows it) */}
      {activePage !== 'home' && org.coverUrl && (
        <div className="relative h-[20vh] sm:h-[28vh] w-full">
          <img src={org.coverUrl} alt="Cover" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
        </div>
      )}

      {/* Page content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {renderPage()}
      </div>

      {/* ─── Footer: Organization links + Awardly branding ─── */}
      <footer className="w-full border-t border-white/5 bg-dark-950">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Org info */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                {org.logoUrl ? (
                  <img src={org.logoUrl} className="h-8 w-8 rounded-lg object-cover" alt={org.name} referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">
                    {org.name[0]}
                  </div>
                )}
                <span className="text-white font-serif text-sm font-medium">{org.name}</span>
              </div>
              <p className="text-dark-500 text-xs leading-relaxed">{org.description || 'Excellence in every detail.'}</p>
            </div>

            {/* Org nav links */}
            <div className="space-y-4">
              <h4 className="text-white font-serif text-sm">Navigation</h4>
              <ul className="space-y-3 text-xs text-dark-400">
                {enabledOrgNav.map((item: any) => (
                  <li key={item.id}>
                    <button onClick={() => { setActivePage(item.pageId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="hover:text-gold-500 transition-colors text-left">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sponsors / Partners */}
            <div className="space-y-4">
              <h4 className="text-white font-serif text-sm">Partners</h4>
              {sponsors.length > 0 ? (
                <ul className="space-y-3 text-xs text-dark-400">
                  {sponsors.slice(0, 5).map((s: any) => (
                    <li key={s._id}>
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">{s.name}</a>
                      ) : (
                        <span>{s.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-dark-600 text-xs italic">No partners yet</p>
              )}
            </div>

            {/* Awardly */}
            <div className="space-y-4">
              <h4 className="text-white font-serif text-sm">Platform</h4>
              <ul className="space-y-3 text-xs text-dark-400">
                <li><Link to="/discover" className="hover:text-gold-500 transition-colors">Explore Hubs</Link></li>
                <li><Link to="/pricing" className="hover:text-gold-500 transition-colors">Pricing</Link></li>
                <li><Link to="/resources" className="hover:text-gold-500 transition-colors">Resources</Link></li>
                <li><Link to="#" className="hover:text-gold-500 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Powered by Awardly bar */}
        <div className="border-t border-white/5 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandLogo className="scale-75 origin-left opacity-50" />
            </div>
            <div className="text-center sm:text-right">
              <p className="text-dark-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                Powered by Awardly — The Global Stage for Awards
              </p>
              <p className="text-dark-600 text-[9px] mt-1">
                <Link to="/onboarding" className="hover:text-gold-500 transition-colors">Create your own award website</Link>
                {' · '}© {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
