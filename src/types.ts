// ─── User ───────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin' | 'platform_admin';
  followingOrgIds: string[];
  createdAt: string;
};

// ─── Organization ───────────────────────────────────────────────────────────
export type OrganizationType =
  | 'company' | 'government' | 'nonprofit' | 'university'
  | 'community' | 'media' | 'individual' | 'other';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: OrganizationType;
  logoUrl?: string;
  coverUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  website?: string;
  country: string;
  headquarters?: string;
  foundedYear?: number;
  contactEmail: string;
  phone?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  isVerified: boolean;
  verificationStatus: 'none' | 'pending' | 'verified';
  followerCount: number;
  memberCount: number;
  eventCount: number;
  createdAt: string;
};

// ─── Organization Member ────────────────────────────────────────────────────
export type MemberRole = 'owner' | 'admin' | 'event_manager' | 'judge' | 'moderator' | 'finance' | 'content_editor';

export type RolePermissions = {
  manageOrg: boolean;
  manageEvents: boolean;
  manageCategories: boolean;
  manageVoting: boolean;
  manageTeam: boolean;
  manageBilling: boolean;
  manageBranding: boolean;
  viewAnalytics: boolean;
  broadcast: boolean;
  moderateContent: boolean;
};

export const ROLE_PERMISSIONS: Record<MemberRole, RolePermissions> = {
  owner: {
    manageOrg: true, manageEvents: true, manageCategories: true, manageVoting: true,
    manageTeam: true, manageBilling: true, manageBranding: true, viewAnalytics: true,
    broadcast: true, moderateContent: true,
  },
  admin: {
    manageOrg: true, manageEvents: true, manageCategories: true, manageVoting: true,
    manageTeam: true, manageBilling: false, manageBranding: true, viewAnalytics: true,
    broadcast: true, moderateContent: true,
  },
  event_manager: {
    manageOrg: false, manageEvents: true, manageCategories: true, manageVoting: true,
    manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: true,
    broadcast: false, moderateContent: false,
  },
  judge: {
    manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: true,
    manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: false,
    broadcast: false, moderateContent: false,
  },
  moderator: {
    manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
    manageTeam: false, manageBilling: false, manageBranding: false, viewAnalytics: false,
    broadcast: false, moderateContent: true,
  },
  finance: {
    manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
    manageTeam: false, manageBilling: true, manageBranding: false, viewAnalytics: true,
    broadcast: false, moderateContent: false,
  },
  content_editor: {
    manageOrg: false, manageEvents: false, manageCategories: false, manageVoting: false,
    manageTeam: false, manageBilling: false, manageBranding: true, viewAnalytics: false,
    broadcast: false, moderateContent: true,
  },
};

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  event_manager: 'Event Manager',
  judge: 'Judge',
  moderator: 'Moderator',
  finance: 'Finance',
  content_editor: 'Content Editor',
};

export type OrganizationMember = {
  id: string;
  userId: string;
  orgId: string;
  role: MemberRole;
  invitedBy?: string;
  joinedAt: string;
};

// ─── Post ───────────────────────────────────────────────────────────────────
export type Post = {
  id: string;
  orgId: string;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  createdAt: string;
};

// ─── Event ──────────────────────────────────────────────────────────────────
export type Event = {
  id: string;
  orgId: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time?: string;
  coverUrl?: string;
  bannerUrl?: string;
  venue?: string;
  theme?: string;
  tagline?: string;
  themeColor?: string;
  status: 'draft' | 'published' | 'ended';
  isVotingActive: boolean;
  votingType?: 'public' | 'judge' | 'both';
  nominationStart?: string;
  nominationEnd?: string;
  votingStart?: string;
  votingEnd?: string;
  youtubeVideoId?: string;
  categoryCount?: number;
  nomineeCount?: number;
  totalVotes?: number;
  createdAt: string;
};

// ─── Category ───────────────────────────────────────────────────────────────
export type Category = {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  rulesSource: 'global' | 'custom';
  customRules?: VotingRules;
};

// ─── Voting Rules ───────────────────────────────────────────────────────────
export type VotingRules = {
  title: string;
  description: string;
  eligibility: string;
  dailyLimit: number;
  isPaid: boolean;
  verificationRequired: boolean;
  duplicatePolicy: string;
  fraudPrevention: string;
  startDate: string;
  endDate: string;
  terms: string;
  notes?: string;
};

// ─── Nominee ────────────────────────────────────────────────────────────────
export type Nominee = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  voteCount: number;
};

// ─── Wizard Draft (localStorage persistence) ────────────────────────────────
export type OrgWizardDraft = {
  step: number;
  name: string;
  slug: string;
  description: string;
  type: OrganizationType | '';
  logoUrl: string;
  coverUrl: string;
  primaryColor: string;
  secondaryColor: string;
  website: string;
  country: string;
  headquarters: string;
  foundedYear: string;
  contactEmail: string;
  phone: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
};

export const EMPTY_ORG_WIZARD: OrgWizardDraft = {
  step: 0,
  name: '',
  slug: '',
  description: '',
  type: '',
  logoUrl: '',
  coverUrl: '',
  primaryColor: '#c68a35',
  secondaryColor: '#1a1a1a',
  website: '',
  country: '',
  headquarters: '',
  foundedYear: '',
  contactEmail: '',
  phone: '',
  socialLinks: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: '' },
};

// ─── Helper: Country list ───────────────────────────────────────────────────
export const COUNTRIES = [
  'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Egypt', 'Morocco',
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
  'Brazil', 'India', 'Japan', 'Australia', 'United Arab Emirates', 'Other',
];

export const ORG_TYPES: { value: OrganizationType; label: string }[] = [
  { value: 'company', label: 'Company' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'university', label: 'University' },
  { value: 'community', label: 'Community' },
  { value: 'media', label: 'Media' },
  { value: 'individual', label: 'Individual Brand' },
  { value: 'other', label: 'Other' },
];
