import { User, Organization, OrganizationMember, Event, Post, Nominee, Category } from './types';

import headiesLogo from './assets/images/headies_logo_gold_1784644513476.jpg';
import headiesBanner from './assets/images/headies_banner_crowd_1784644528540.jpg';
import awardStage from './assets/images/cinematic_award_stage_1784642261177.jpg';
import nomineeArtist from './assets/images/nominee_artist_male_1784644541891.jpg';
import cocaColaBanner from './assets/images/coca_cola_sponsor_banner_1784649889595.jpg';

export { headiesLogo, headiesBanner, awardStage, nomineeArtist, cocaColaBanner };

// ─── Users ──────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Jackson Hartwells',
    email: 'jackson@headies.com',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=JH&backgroundColor=c68a35',
    role: 'admin',
    followingOrgIds: ['headies', 'banking'],
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'user2',
    name: 'Sarah Miller',
    email: 'sarah@headies.com',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=2563eb',
    role: 'user',
    followingOrgIds: ['headies'],
    createdAt: '2023-06-20T00:00:00Z',
  },
  {
    id: 'user3',
    name: 'David Chen',
    email: 'david@bankingawards.com',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DC&backgroundColor=10b981',
    role: 'user',
    followingOrgIds: ['banking'],
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'user4',
    name: 'Amara Osei',
    email: 'amara@headies.com',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AO&backgroundColor=db2777',
    role: 'user',
    followingOrgIds: ['headies', 'fintech'],
    createdAt: '2024-03-05T00:00:00Z',
  },
];

// ─── Organizations ──────────────────────────────────────────────────────────
export const mockOrganizations: Organization[] = [
  {
    id: 'headies',
    name: 'Headies Official',
    slug: 'headies',
    description: 'The Headies (originally called the Hip Hop World Awards) is a music awards show established in 2006 to recognize outstanding achievements in the Nigerian music industry.',
    type: 'media',
    logoUrl: headiesLogo,
    coverUrl: headiesBanner,
    primaryColor: '#c68a35',
    secondaryColor: '#1a1a1a',
    website: 'https://theheadies.com',
    country: 'Nigeria',
    headquarters: 'Lagos',
    foundedYear: 2006,
    contactEmail: 'info@headies.com',
    phone: '+234 801 234 5678',
    socialLinks: { twitter: '@headies', instagram: '@headies', youtube: '@HeadiesAwards', facebook: 'HeadiesAwards' },
    isVerified: true,
    verificationStatus: 'verified',
    followerCount: 154200,
    memberCount: 8,
    eventCount: 3,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'banking',
    name: 'Global Banking Awards',
    slug: 'bankingawards',
    description: 'Celebrating the brightest minds and most innovative institutions in global banking and finance.',
    type: 'corporate',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&h=200&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&h=400&auto=format&fit=crop',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    website: 'https://globalbankingawards.com',
    country: 'United Kingdom',
    headquarters: 'London',
    foundedYear: 2018,
    contactEmail: 'info@globalbankingawards.com',
    isVerified: true,
    verificationStatus: 'verified',
    followerCount: 45000,
    memberCount: 4,
    eventCount: 2,
    createdAt: '2021-05-12T00:00:00Z',
  },
  {
    id: 'fintech',
    name: 'FinTech Awards Africa',
    slug: 'fintechafrica',
    description: 'Recognizing the most innovative financial technology solutions transforming Africa.',
    type: 'nonprofit',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&h=200&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?q=80&w=1200&h=400&auto=format&fit=crop',
    primaryColor: '#10b981',
    secondaryColor: '#022c22',
    website: 'https://fintechafrica.com',
    country: 'Nigeria',
    headquarters: 'Lagos',
    foundedYear: 2022,
    contactEmail: 'hello@fintechafrica.com',
    isVerified: false,
    verificationStatus: 'none',
    followerCount: 12800,
    memberCount: 3,
    eventCount: 1,
    createdAt: '2022-08-20T00:00:00Z',
  },
];

// ─── Organization Members ───────────────────────────────────────────────────
export const mockMembers: OrganizationMember[] = [
  // Headies members
  { id: 'mem1', userId: 'user1', orgId: 'headies', role: 'owner', joinedAt: '2020-01-01T00:00:00Z' },
  { id: 'mem2', userId: 'user2', orgId: 'headies', role: 'admin', invitedBy: 'user1', joinedAt: '2021-03-15T00:00:00Z' },
  { id: 'mem3', userId: 'user4', orgId: 'headies', role: 'event_manager', invitedBy: 'user1', joinedAt: '2023-06-10T00:00:00Z' },
  // Banking members
  { id: 'mem4', userId: 'user3', orgId: 'banking', role: 'owner', joinedAt: '2021-05-12T00:00:00Z' },
  // FinTech members
  { id: 'mem5', userId: 'user1', orgId: 'fintech', role: 'admin', invitedBy: 'user4', joinedAt: '2023-01-20T00:00:00Z' },
  { id: 'mem6', userId: 'user4', orgId: 'fintech', role: 'owner', joinedAt: '2022-08-20T00:00:00Z' },
];

// ─── Events ─────────────────────────────────────────────────────────────────
export const mockEvents: Event[] = [
  {
    id: 'evt1',
    orgId: 'headies',
    title: 'The 17th Headies 2026',
    slug: '17th-headies-2026',
    description: 'Global Edition featuring top talents across Africa and the diaspora.',
    date: '2026-09-04T18:00:00Z',
    time: '18:00',
    coverUrl: awardStage,
    bannerUrl: headiesBanner,
    venue: 'Eko Convention Centre, Lagos',
    theme: 'Global Sounds, African Roots',
    tagline: 'Celebrating African Music Excellence',
    themeColor: '#c68a35',
    status: 'published',
    isVotingActive: true,
    votingType: 'both',
    nominationStart: '2026-03-01T00:00:00Z',
    nominationEnd: '2026-05-30T23:59:59Z',
    votingStart: '2026-06-01T00:00:00Z',
    votingEnd: '2026-09-03T23:59:59Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    categoryCount: 4,
    nomineeCount: 6,
    totalVotes: 2401900,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'evt2',
    orgId: 'headies',
    title: 'Headies Next Rated 2026',
    slug: 'headies-next-rated-2026',
    description: 'A special spotlight on the breakout stars of the year. Who will take home the gold?',
    date: '2026-10-15T19:00:00Z',
    time: '19:00',
    coverUrl: headiesBanner,
    venue: 'Federal Palace Hotel, Lagos',
    theme: 'The Future is Now',
    themeColor: '#c68a35',
    status: 'draft',
    isVotingActive: false,
    votingType: 'public',
    categoryCount: 2,
    nomineeCount: 0,
    totalVotes: 0,
    createdAt: '2026-05-20T00:00:00Z',
  },
  {
    id: 'evt3',
    orgId: 'headies',
    title: 'Global Music Festival',
    slug: 'global-music-festival',
    description: 'The ultimate celebration of sounds from the continent. 3 Days of pure magic.',
    date: '2026-12-20T12:00:00Z',
    time: '12:00',
    coverUrl: awardStage,
    venue: 'Tafawa Balewa Square, Lagos',
    theme: 'One Stage, Every Sound',
    themeColor: '#c68a35',
    status: 'published',
    isVotingActive: false,
    categoryCount: 0,
    nomineeCount: 0,
    totalVotes: 0,
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'evt4',
    orgId: 'banking',
    title: 'Global Banking Awards 2026',
    slug: 'global-banking-awards-2026',
    description: 'Celebrating excellence and innovation in global banking.',
    date: '2026-11-10T19:00:00Z',
    time: '19:00',
    coverUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&h=400&auto=format&fit=crop',
    venue: 'The Savoy, London',
    theme: 'Banking Reimagined',
    themeColor: '#2563eb',
    status: 'published',
    isVotingActive: true,
    votingType: 'judge',
    categoryCount: 0,
    nomineeCount: 0,
    totalVotes: 0,
    createdAt: '2026-02-01T00:00:00Z',
  },
];

// ─── Posts ──────────────────────────────────────────────────────────────────
export const mockPosts: Post[] = [
  {
    id: 'post1',
    orgId: 'headies',
    content: 'We are LIVE! The 17th Headies nomination list is officially out. Head over to the voting portal to support your faves! #17thHeadies',
    mediaUrls: [awardStage],
    likesCount: 12400,
    commentsCount: 3200,
    isPinned: true,
    createdAt: '2026-05-25T10:00:00Z',
  },
  {
    id: 'post2',
    orgId: 'headies',
    content: 'A huge thank you to our sponsors for making this year\'s edition possible.',
    likesCount: 5600,
    commentsCount: 430,
    createdAt: '2026-05-26T14:30:00Z',
  },
  {
    id: 'post3',
    orgId: 'banking',
    content: 'Nominations are now open for the Global Banking Awards 2026. Submit your institution today!',
    likesCount: 2100,
    commentsCount: 180,
    createdAt: '2026-03-01T09:00:00Z',
  },
];

// ─── Categories ─────────────────────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id: 'cat1', eventId: 'evt1', name: 'Artiste of the Year', description: 'Most critically and commercially adjudged artiste in the year under review.', rulesSource: 'global' },
  { id: 'cat2', eventId: 'evt1', name: 'Next Rated', description: 'Most promising upcoming act.', rulesSource: 'global' },
  { id: 'cat3', eventId: 'evt1', name: 'Best Male Vocalist', description: 'Most outstanding male vocal performance.', rulesSource: 'global' },
  { id: 'cat4', eventId: 'evt1', name: 'Album of the Year', description: 'Best full-length studio album.', rulesSource: 'global' },
];

// ─── Nominees ───────────────────────────────────────────────────────────────
export const mockNominees: Nominee[] = [
  { id: 'nom1', categoryId: 'cat1', name: 'Adekunle Gold', voteCount: 45210, imageUrl: nomineeArtist },
  { id: 'nom2', categoryId: 'cat1', name: 'Asake', voteCount: 52140, imageUrl: 'https://images.unsplash.com/photo-1521112376370-0a3b01544af1?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'nom3', categoryId: 'cat1', name: 'Burna Boy', voteCount: 61000, imageUrl: nomineeArtist },
  { id: 'nom4', categoryId: 'cat1', name: 'Wizkid', voteCount: 58900, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'nom5', categoryId: 'cat2', name: 'Ayra Starr', voteCount: 34200, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'nom6', categoryId: 'cat2', name: 'Rema', voteCount: 41000, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop' },
];
