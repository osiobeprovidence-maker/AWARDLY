import { Organization, Event, Post, Nominee, Category } from './types';

export const mockOrgs: Organization[] = [
  {
    id: 'headies',
    name: 'Headies Official',
    username: 'headies',
    description: 'The Headies (originally called the Hip Hop World Awards) is a music awards show established in 2006 to recognize outstanding achievements in the Nigerian music industry.',
    logoUrl: '/src/assets/images/headies_logo_gold_1784644513476.jpg',
    coverUrl: '/src/assets/images/headies_banner_crowd_1784644528540.jpg',
    followerCount: 154200,
    category: 'Entertainment',
    socialLinks: { twitter: '@headies', instagram: '@headies' },
    isLive: true,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'banking',
    name: 'Global Banking Awards',
    username: 'bankingawards',
    description: 'Celebrating the brightest minds and most innovative startups across the African continent.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&h=200&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&h=400&auto=format&fit=crop',
    followerCount: 45000,
    category: 'Corporate',
    createdAt: '2021-05-12T00:00:00Z',
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    orgId: 'headies',
    title: 'The 17th Headies 2026',
    description: 'Global Edition featuring top talents across Africa and the diaspora.',
    date: '2026-09-04T18:00:00Z',
    coverUrl: '/src/assets/images/cinematic_award_stage_1784642261177.jpg',
    status: 'published',
    isVotingActive: true,
  },
  {
    id: 'evt2',
    orgId: 'headies',
    title: 'Headies Next Rated 2026',
    description: 'A special spotlight on the breakout stars of the year. Who will take home the gold?',
    date: '2026-10-15T19:00:00Z',
    coverUrl: '/src/assets/images/headies_banner_crowd_1784644528540.jpg',
    status: 'draft',
    isVotingActive: false,
  },
  {
    id: 'evt3',
    orgId: 'headies',
    title: 'Global Music Festival',
    description: 'The ultimate celebration of sounds from the continent. 3 Days of pure magic.',
    date: '2026-12-20T12:00:00Z',
    coverUrl: '/src/assets/images/cinematic_award_stage_1784642261177.jpg',
    status: 'published',
    isVotingActive: false,
  }
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    orgId: 'headies',
    content: 'We are LIVE! The 17th Headies nomination list is officially out. Head over to the voting portal to support your faves! #17thHeadies',
    mediaUrls: ['/src/assets/images/cinematic_award_stage_1784642261177.jpg'],
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
  }
];

export const mockCategories: Category[] = [
  { id: 'cat1', eventId: 'evt1', name: 'Artiste of the Year', description: 'Most critically and commercially adjudged artiste in the year under review.', rulesSource: 'global' },
  { id: 'cat2', eventId: 'evt1', name: 'Next Rated', description: 'Most promising upcoming act.', rulesSource: 'global' },
  { id: 'cat3', eventId: 'evt1', name: 'Best Male Vocalist', description: 'Most outstanding male vocal performance.', rulesSource: 'global' },
  { id: 'cat4', eventId: 'evt1', name: 'Album of the Year', description: 'Best full-length studio album.', rulesSource: 'global' },
];

export const mockNominees: Nominee[] = [
  { id: 'nom1', categoryId: 'cat1', name: 'Adekunle Gold', voteCount: 45210, imageUrl: '/src/assets/images/nominee_artist_male_1784644541891.jpg' },
  { id: 'nom2', categoryId: 'cat1', name: 'Asake', voteCount: 52140, imageUrl: 'https://images.unsplash.com/photo-1521112376370-0a3b01544af1?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'nom3', categoryId: 'cat1', name: 'Burna Boy', voteCount: 61000, imageUrl: '/src/assets/images/nominee_artist_male_1784644541891.jpg' },
  { id: 'nom4', categoryId: 'cat1', name: 'Wizkid', voteCount: 58900, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'nom5', categoryId: 'cat2', name: 'Ayra Starr', voteCount: 34200, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'nom6', categoryId: 'cat2', name: 'Rema', voteCount: 41000, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop' },
];
