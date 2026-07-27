import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
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
    <div className="w-full flex-1 bg-dark-950 font-sans min-h-screen">
      <WebsiteHeader
        org={org}
        navigation={navigation}
        activePage={activePage}
        onNavigate={(pageId) => { setActivePage(pageId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        liveBroadcast={liveBroadcast}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderPage()}
      </div>

      <footer className="w-full border-t border-white/5 py-16 px-6 mt-24">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-dark-500 text-xs">
            {website?.footerContent || `${org.name} — Powered by Awardly`}
          </p>
          <p className="text-dark-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
