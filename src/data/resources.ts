// ─── Types ─────────────────────────────────────────────────────────────────
export type ResourceCategory = 'documentation' | 'tutorials' | 'case-studies' | 'templates' | 'best-practices' | 'monetization' | 'community' | 'security' | 'analytics' | 'api';

export interface Article {
  slug: string;
  title: string;
  description: string;
  cover: string;
  category: ResourceCategory;
  readingTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  authorAvatar: string;
  lastUpdated: string;
  tags: string[];
  content: string[];
}

export interface Video {
  slug: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  duration: string;
  instructor: string;
  instructorAvatar: string;
  views: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: ResourceCategory;
  tags: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  organization: string;
  logo: string;
  cover: string;
  challenge: string;
  solution: string;
  results: string;
  stats: Array<{ label: string; value: string }>;
  category: ResourceCategory;
  readingTime: string;
  tags: string[];
}

export interface Template {
  slug: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  category: ResourceCategory;
  tags: string[];
}

export interface FAQ {
  question: string;
  answer: string;
  category: ResourceCategory;
}

export interface BestPractice {
  slug: string;
  title: string;
  description: string;
  tips: string[];
  category: ResourceCategory;
}

// ─── Categories ────────────────────────────────────────────────────────────
export const categories: Array<{ id: ResourceCategory; label: string; description: string; count: number }> = [
  { id: 'documentation', label: 'Documentation', description: 'Complete guides to every Awardly feature', count: 24 },
  { id: 'tutorials', label: 'Video Tutorials', description: 'Step-by-step video walkthroughs', count: 18 },
  { id: 'case-studies', label: 'Case Studies', description: 'Real success stories from award organizers', count: 8 },
  { id: 'templates', label: 'Templates', description: 'Ready-to-use planning and evaluation templates', count: 15 },
  { id: 'best-practices', label: 'Best Practices', description: 'Expert strategies for running world-class awards', count: 20 },
  { id: 'monetization', label: 'Monetization', description: 'Revenue strategies for award programs', count: 10 },
  { id: 'community', label: 'Community', description: 'Engage and grow your award community', count: 12 },
  { id: 'security', label: 'Security', description: 'Platform security and vote integrity', count: 7 },
  { id: 'analytics', label: 'Analytics', description: 'Data-driven insights and reporting', count: 9 },
  { id: 'api', label: 'API & Integrations', description: 'Developer documentation and webhooks', count: 5 },
];

// ─── Articles ──────────────────────────────────────────────────────────────
export const articles: Article[] = [
  {
    slug: 'getting-started-with-awardly',
    title: 'Getting Started with Awardly',
    description: 'A complete walkthrough of setting up your first award program on Awardly, from creating your hub to announcing winners.',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    category: 'documentation',
    readingTime: '8 min read',
    difficulty: 'Beginner',
    author: 'Awardly Team',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-07-15',
    tags: ['setup', 'getting-started', 'basics'],
    content: [
      'Awardly is the world\'s leading platform for award management, secure voting, and community recognition. This guide will walk you through everything you need to know to launch your first award program.',
      '## Step 1: Create Your Hub\n\nYour hub is the central command center for your award program. Navigate to the dashboard and click "Create Event" to get started. You\'ll need to provide your event name, description, and dates.',
      '## Step 2: Define Your Categories\n\nCategories are the heart of your award program. Each category represents a specific award that nominees can compete for. We recommend starting with 5-10 categories for your first event.',
      '## Step 3: Set Up Nomination Rules\n\nDefine who can nominate, what criteria nominees must meet, and the nomination window. Awardly supports flexible rules including peer nominations, self-nominations, and committee selections.',
      '## Step 4: Configure Voting\n\nChoose between public voting, judge-only scoring, or a hybrid approach. Awardly supports ranked choice, simple majority, and weighted scoring systems.',
      '## Step 5: Launch and Promote\n\nOnce everything is configured, publish your event and share it with your audience. Use Awardly\'s built-in social features to maximize engagement.',
    ],
  },
  {
    slug: 'voting-best-practices',
    title: 'Voting Best Practices',
    description: 'Proven strategies for maximizing voter turnout and maintaining integrity in your award voting process.',
    cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    category: 'best-practices',
    readingTime: '12 min read',
    difficulty: 'Intermediate',
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-07-10',
    tags: ['voting', 'engagement', 'strategy'],
    content: [
      'Voter engagement is the single most important factor in a successful award program. This guide covers proven strategies used by the world\'s top award organizations.',
      '## Create Urgency\n\nSet clear voting deadlines and countdown timers. Awardly automatically displays remaining time to create urgency. Studies show that deadlines increase participation by 40%.',
      '## Leverage Social Proof\n\nShow real-time vote counts and trending nominees. When voters see others participating, they\'re more likely to join. Awardly\'s live feed makes this seamless.',
      '## Multi-Channel Promotion\n\nDon\'t rely on a single channel. Use email, social media, SMS, and your website to remind voters. Awardly provides shareable links and embeddable widgets.',
      '## Prevent Fraud\n\nAwardly\'s anti-fraud system detects duplicate votes, bot activity, and suspicious patterns. Enable rate limiting and device fingerprinting for maximum security.',
      '## Reward Voters\n\nConsider gamification: badges, leaderboards, and recognition for active voters. This creates a community around your awards.',
    ],
  },
  {
    slug: 'monetization-blueprint',
    title: 'The Monetization Blueprint',
    description: 'A comprehensive guide to generating revenue from your award programs through paid voting, sponsorships, and premium packages.',
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    category: 'monetization',
    readingTime: '15 min read',
    difficulty: 'Advanced',
    author: 'Michael Torres',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-07-08',
    tags: ['monetization', 'revenue', 'business'],
    content: [
      'Award programs can be highly profitable when structured correctly. This blueprint covers every revenue stream available on Awardly.',
      '## Paid Voting Campaigns\n\nOffer supporters the ability to cast premium votes at $1-5 each. Awardly handles payment processing, receipts, and reporting. Organizations typically generate 60% of revenue from paid voting.',
      '## Sponsor Packages\n\nCreate tiered sponsorship packages (Platinum, Gold, Silver, Bronze) with corresponding benefits: logo placement, speaking slots, booth space, and VIP access.',
      '## Ticket Sales\n\nSell ceremony tickets directly through Awardly. Support early bird, VIP, and group pricing. Integrated check-in and badge printing.',
      '## Merchandise\n\nSell branded merchandise through your award hub. Awardly integrates with major print-on-demand services.',
      '## Data Insights\n\nOffer sponsors anonymized, aggregated audience data. Understand demographics, engagement patterns, and voting behavior.',
    ],
  },
  {
    slug: 'category-design-guide',
    title: 'Designing the Perfect Categories',
    description: 'How to structure award categories that are fair, engaging, and reflect the full spectrum of your industry.',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    category: 'documentation',
    readingTime: '10 min read',
    difficulty: 'Intermediate',
    author: 'Awardly Team',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-07-12',
    tags: ['categories', 'design', 'strategy'],
    content: [
      'Well-designed categories are the foundation of a credible award program. This guide covers the principles of effective category design.',
      '## Balance Breadth and Specificity\n\nToo many categories dilute the prestige. Too few exclude worthy nominees. Aim for 8-25 categories depending on your event size.',
      '## Avoid Overlap\n\nEnsure nominees can only compete in one category per submission. Clear boundaries prevent confusion and maintain fairness.',
      '## Include Discovery Categories\n\n"Next Rated" or "Rising Star" categories generate excitement and attract new audiences. They also help discover emerging talent.',
      '## Consider Audience Voting vs. Judge Scoring\n\nSome categories work better with public voting (fan favorites) while others need expert judging (technical excellence). Awardly supports both.',
    ],
  },
  {
    slug: 'judge-management-complete-guide',
    title: 'Judge Management: The Complete Guide',
    description: 'Everything you need to know about recruiting, managing, and scoring with judges on Awardly.',
    cover: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800',
    category: 'documentation',
    readingTime: '14 min read',
    difficulty: 'Intermediate',
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-07-05',
    tags: ['judges', 'scoring', 'management'],
    content: [
      'A strong judging panel elevates your award\'s credibility. This guide covers every aspect of judge management.',
      '## Recruiting Judges\n\nTarget industry leaders, past winners, and respected professionals. Awardly provides a judge invitation system with custom messaging.',
      '## Scoring Criteria\n\nDefine clear criteria for each category. Awardly supports weighted scoring, rubrics, and custom evaluation forms.',
      '## Conflict of Interest\n\nAwardly automatically detects conflicts when judges have relationships with nominees. Judges can self-recuse with one click.',
      '## Transparency\n\nDecide how much scoring data to publish. Awardly supports full transparency, aggregated scores, or winner-only disclosure.',
    ],
  },
  {
    slug: 'anti-fraud-security-guide',
    title: 'Vote Security & Anti-Fraud',
    description: 'How Awardly protects the integrity of your voting process with enterprise-grade security measures.',
    cover: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
    category: 'security',
    readingTime: '11 min read',
    difficulty: 'Advanced',
    author: 'David Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-07-01',
    tags: ['security', 'fraud', 'integrity'],
    content: [
      'Vote integrity is paramount. Awardly employs multiple layers of security to ensure every vote counts fairly.',
      '## Device Fingerprinting\n\nEach device is uniquely identified to prevent duplicate voting from the same browser. This catches most casual fraud attempts.',
      '## Rate Limiting\n\nVotes are throttled per IP, per device, and per account. Configurable limits let you balance security with user experience.',
      '## Bot Detection\n\nMachine learning algorithms identify automated voting patterns, CAPTCHA challenges, and suspicious behavior in real-time.',
      '## Audit Trail\n\nEvery vote is logged with timestamp, device info, and verification status. Export complete audit reports for transparency.',
    ],
  },
  {
    slug: 'analytics-deep-dive',
    title: 'Analytics Deep Dive',
    description: 'How to use Awardly\'s analytics dashboard to understand engagement, optimize campaigns, and prove ROI to sponsors.',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    category: 'analytics',
    readingTime: '13 min read',
    difficulty: 'Intermediate',
    author: 'Michael Torres',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    lastUpdated: '2026-06-28',
    tags: ['analytics', 'data', 'insights'],
    content: [
      'Data-driven decisions separate good award programs from great ones. Awardly\'s analytics suite provides actionable insights at every stage.',
      '## Real-Time Dashboard\n\nMonitor votes, views, and engagement in real-time. See which categories are trending and where to focus promotion efforts.',
      '## Audience Demographics\n\nUnderstand who your voters are: age, location, device, referral source. This data is invaluable for sponsors.',
      '## Campaign Performance\n\nTrack the impact of each marketing channel. See which emails, social posts, and ads drive the most votes.',
      '## Export & Reporting\n\nGenerate PDF reports for sponsors, stakeholders, and media. Custom date ranges and metric selection.',
    ],
  },
];

// ─── Videos ────────────────────────────────────────────────────────────────
export const videos: Video[] = [
  {
    slug: 'setting-up-your-first-event',
    title: 'Setting Up Your First Event',
    description: 'A complete walkthrough of creating your first award event on Awardly, from basic settings to advanced configuration.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    duration: '12:34',
    instructor: 'Awardly Team',
    instructorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    views: 15420,
    difficulty: 'Beginner',
    category: 'tutorials',
    tags: ['setup', 'beginner', 'walkthrough'],
  },
  {
    slug: 'advanced-voting-configuration',
    title: 'Advanced Voting Configuration',
    description: 'Master weighted scoring, ranked choice voting, hybrid models, and anti-fraud settings.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    duration: '18:22',
    instructor: 'Sarah Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    views: 8930,
    difficulty: 'Advanced',
    category: 'tutorials',
    tags: ['voting', 'advanced', 'configuration'],
  },
  {
    slug: 'monetization-setup-walkthrough',
    title: 'Monetization Setup Walkthrough',
    description: 'Step-by-step guide to setting up paid voting, sponsor packages, and ticket sales.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    duration: '15:47',
    instructor: 'Michael Torres',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    views: 12100,
    difficulty: 'Intermediate',
    category: 'monetization',
    tags: ['monetization', 'revenue', 'setup'],
  },
  {
    slug: 'branding-and-customization',
    title: 'Branding & Customization',
    description: 'Customize your award hub with your brand colors, logos, banners, and custom domains.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    duration: '10:15',
    instructor: 'Awardly Team',
    instructorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    views: 6750,
    difficulty: 'Beginner',
    category: 'tutorials',
    tags: ['branding', 'customization', 'design'],
  },
  {
    slug: 'judge-scoring-deep-dive',
    title: 'Judge Scoring Deep Dive',
    description: 'Configure evaluation criteria, weighted rubrics, conflict detection, and scoring aggregation.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    duration: '22:10',
    instructor: 'Sarah Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    views: 4320,
    difficulty: 'Advanced',
    category: 'tutorials',
    tags: ['judges', 'scoring', 'advanced'],
  },
  {
    slug: 'social-feed-and-engagement',
    title: 'Social Feed & Engagement',
    description: 'Leverage Awardly\'s social features to build community and drive engagement during your event.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    duration: '14:30',
    instructor: 'Michael Torres',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    views: 7890,
    difficulty: 'Intermediate',
    category: 'community',
    tags: ['social', 'engagement', 'community'],
  },
];

// ─── Case Studies ──────────────────────────────────────────────────────────
export const caseStudies: CaseStudy[] = [
  {
    slug: 'headies-success-story',
    title: 'The Headies: Africa\'s Premier Music Awards',
    organization: 'Headies Official',
    logo: '',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    challenge: 'The Headies needed a secure, scalable platform to handle millions of votes across 24 categories while maintaining transparency and preventing fraud.',
    solution: 'Implemented Awardly\'s hybrid voting system with public voting (60%) and judge scoring (40%), combined with enterprise-grade anti-fraud measures.',
    results: 'Achieved 2.3M votes across 18 countries with zero fraud incidents. Revenue increased 340% through paid voting campaigns and sponsor packages.',
    stats: [
      { label: 'Total Votes', value: '2.3M' },
      { label: 'Countries', value: '18' },
      { label: 'Revenue Growth', value: '+340%' },
      { label: 'Fraud Incidents', value: '0' },
    ],
    category: 'case-studies',
    readingTime: '6 min read',
    tags: ['music', 'large-scale', 'hybrid-voting'],
  },
  {
    slug: 'innovation-awards-case-study',
    title: 'Innovation Awards: From Spreadsheet to Platform',
    organization: 'Tech Innovation Council',
    logo: '💡',
    cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
    challenge: 'The Innovation Awards were managing nominations and voting through spreadsheets and email, leading to errors, delays, and lack of transparency.',
    solution: 'Migrated to Awardly\'s fully digital platform with automated nomination workflows, real-time voting, and instant results calculation.',
    results: 'Processing time reduced from 3 weeks to 2 days. Voter participation increased 520%. Sponsors received real-time engagement data for the first time.',
    stats: [
      { label: 'Processing Time', value: '-85%' },
      { label: 'Voter Increase', value: '+520%' },
      { label: 'Satisfaction', value: '98%' },
      { label: 'Categories', value: '12' },
    ],
    category: 'case-studies',
    readingTime: '5 min read',
    tags: ['technology', 'digital-transformation', 'efficiency'],
  },
  {
    slug: 'fintech-excellence-case-study',
    title: 'FinTech Excellence Awards: Building Industry Credibility',
    organization: 'FinTech Africa',
    logo: '💳',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    challenge: 'A new award program needed to establish credibility quickly while attracting quality nominees and sponsors in a competitive market.',
    solution: 'Used Awardly\'s judge management system with 50+ industry experts, transparent scoring criteria, and a public nomination process.',
    results: 'Attracted 200+ nominations from 15 countries in the first year. Secured 3 Platinum sponsors before the voting period began.',
    stats: [
      { label: 'Nominations', value: '200+' },
      { label: 'Countries', value: '15' },
      { label: 'Judges', value: '50+' },
      { label: 'Sponsors Secured', value: '3 Platinum' },
    ],
    category: 'case-studies',
    readingTime: '4 min read',
    tags: ['fintech', 'credibility', 'new-launch'],
  },
  {
    slug: 'corporate-leadership-case-study',
    title: 'Corporate Leadership Awards: Employee Engagement',
    organization: 'Global Corp',
    logo: '🏢',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    challenge: 'A multinational corporation wanted to recognize employee excellence across 12 countries but lacked a unified platform.',
    solution: 'Deployed Awardly with multi-language support, regional categories, and a combination of peer voting and manager scoring.',
    results: 'Employee participation reached 78% globally. The program became the #1 internal engagement initiative with 95% positive feedback.',
    stats: [
      { label: 'Participation', value: '78%' },
      { label: 'Countries', value: '12' },
      { label: 'Positive Feedback', value: '95%' },
      { label: 'Categories', value: '20' },
    ],
    category: 'case-studies',
    readingTime: '5 min read',
    tags: ['corporate', 'employee-engagement', 'multi-national'],
  },
];

// ─── Templates ─────────────────────────────────────────────────────────────
export const templates: Template[] = [
  { slug: 'event-planning-checklist', title: 'Event Planning Checklist', description: 'A comprehensive 90-day countdown checklist for planning your award ceremony.', fileType: 'PDF', fileSize: '2.4 MB', downloads: 8420, category: 'templates', tags: ['planning', 'checklist'] },
  { slug: 'award-timeline-template', title: 'Award Timeline Template', description: 'Visual timeline template for mapping your entire award lifecycle from conception to ceremony.', fileType: 'PDF', fileSize: '1.8 MB', downloads: 6340, category: 'templates', tags: ['timeline', 'planning'] },
  { slug: 'sponsor-proposal-template', title: 'Sponsor Proposal Template', description: 'Professional pitch deck template for attracting sponsors to your award program.', fileType: 'PPTX', fileSize: '5.2 MB', downloads: 4210, category: 'templates', tags: ['sponsors', 'pitch'] },
  { slug: 'judge-evaluation-form', title: 'Judge Evaluation Form', description: 'Standardized scoring form with weighted criteria for consistent judge evaluation.', fileType: 'XLSX', fileSize: '890 KB', downloads: 3890, category: 'templates', tags: ['judges', 'scoring'] },
  { slug: 'marketing-toolkit', title: 'Marketing Toolkit', description: 'Email templates, social media copy, and press release templates for promoting your awards.', fileType: 'ZIP', fileSize: '12.5 MB', downloads: 5670, category: 'templates', tags: ['marketing', 'promotion'] },
  { slug: 'social-media-kit', title: 'Social Media Kit', description: 'Ready-to-post graphics, stories, and video templates for all major social platforms.', fileType: 'ZIP', fileSize: '28.3 MB', downloads: 7890, category: 'templates', tags: ['social-media', 'graphics'] },
];

// ─── Best Practices ────────────────────────────────────────────────────────
export const bestPractices: BestPractice[] = [
  { slug: 'increasing-nominations', title: 'Increasing Nominations', description: 'Strategies to attract more high-quality nominations for your award program.', tips: ['Open nominations early (3-6 months before ceremony)', 'Simplify the nomination form to under 5 minutes', 'Allow self-nominations to increase participation', 'Promote across multiple channels simultaneously', 'Highlight past winners to demonstrate prestige'], category: 'best-practices' },
  { slug: 'boosting-voter-engagement', title: 'Boosting Voter Engagement', description: 'Proven tactics to maximize voter participation and create excitement.', tips: ['Use countdown timers to create urgency', 'Send reminder emails at strategic intervals', 'Enable social sharing for each nominee', 'Create a live leaderboard visible to all voters', 'Offer incentives for voter participation'], category: 'best-practices' },
  { slug: 'managing-judges-effectively', title: 'Managing Judges Effectively', description: 'Best practices for recruiting, briefing, and coordinating your judging panel.', tips: ['Recruit judges 2-3 months before scoring begins', 'Provide clear criteria and scoring rubrics', 'Set expectations for response times', 'Use Awardly\'s conflict detection system', 'Send regular reminders during the scoring window'], category: 'best-practices' },
  { slug: 'preventing-vote-fraud', title: 'Preventing Vote Fraud', description: 'How to maintain voting integrity while keeping the process accessible.', tips: ['Enable device fingerprinting in Awardly settings', 'Set reasonable rate limits (e.g., 5 votes per category per day)', 'Monitor real-time analytics for suspicious patterns', 'Require account verification for high-stakes categories', 'Publish your anti-fraud policy for transparency'], category: 'best-practices' },
  { slug: 'attracting-sponsors', title: 'Attracting Sponsors', description: 'How to build compelling sponsorship packages that attract quality partners.', tips: ['Create tiered packages with clear ROI metrics', 'Offer exclusive access to audience demographics', 'Provide branded touchpoints throughout the event', 'Share real-time engagement data during voting', 'Deliver post-event impact reports within 48 hours'], category: 'best-practices' },
  { slug: 'marketing-your-awards', title: 'Marketing Your Awards', description: 'A comprehensive marketing playbook for maximizing awareness and participation.', tips: ['Start marketing 3 months before nominations open', 'Leverage past winners as brand ambassadors', 'Create shareable nominee announcement content', 'Use email sequences with clear CTAs', 'Partner with media outlets for coverage'], category: 'best-practices' },
];

// ─── FAQs ──────────────────────────────────────────────────────────────────
export const faqs: FAQ[] = [
  { question: 'How do I create an award on Awardly?', answer: 'Navigate to your dashboard and click "Create Event." Follow the step-by-step wizard to set up your categories, nomination rules, voting configuration, and ceremony details. The entire process takes about 15-20 minutes.', category: 'documentation' },
  { question: 'How does voting work on Awardly?', answer: 'Awardly supports multiple voting models: public voting (anyone can vote), judge-only scoring, and hybrid models. You can configure rate limits, voting windows, and anti-fraud measures for each category.', category: 'best-practices' },
  { question: 'Can I monetize my awards?', answer: 'Yes! Awardly supports paid voting campaigns ($1-5 per vote), sponsor packages with tiered benefits, ticket sales, merchandise, and data insights packages. Most organizers generate revenue from multiple streams.', category: 'monetization' },
  { question: 'How do judges score nominees?', answer: 'Judges access a dedicated scoring portal where they evaluate nominees against your predefined criteria. Awardly supports weighted scoring, rubrics, and automatic aggregation. Scores are kept confidential until you choose to publish.', category: 'documentation' },
  { question: 'How do I invite sponsors?', answer: 'Create sponsor packages in your dashboard with tiered benefits (logo placement, speaking slots, booth space, VIP access). Share the sponsorship prospectus directly from Awardly or export it as a PDF.', category: 'monetization' },
  { question: 'Is voting secure on Awardly?', answer: 'Absolutely. Awardly uses device fingerprinting, rate limiting, CAPTCHA challenges, and machine learning-based fraud detection. Every vote is logged with a complete audit trail. We maintain a 0% fraud rate across all events.', category: 'security' },
  { question: 'Can I customize the look of my award hub?', answer: 'Yes! Upload your brand logo, set custom colors, add banners, and even use a custom domain. Awardly\'s branding tools ensure your award hub matches your organization\'s identity.', category: 'documentation' },
  { question: 'What analytics are available?', answer: 'Awardly provides real-time analytics including vote counts, voter demographics, engagement metrics, category performance, referral sources, and campaign ROI. Export PDF reports for sponsors and stakeholders.', category: 'analytics' },
  { question: 'How many categories can I create?', answer: 'There\'s no limit. However, we recommend 8-25 categories for most events. Too many categories can dilute the prestige, while too few may exclude worthy nominees.', category: 'documentation' },
  { question: 'Can I integrate Awardly with other tools?', answer: 'Awardly offers webhooks, API access, and integrations with popular tools like Mailchimp, Zapier, Google Analytics, and social media platforms. More integrations are added regularly.', category: 'api' },
];

// ─── Helper ────────────────────────────────────────────────────────────────
export function searchResources(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { articles: [], videos: [], caseStudies: [], templates: [], bestPractices: [], faqs: [] };
  return {
    articles: articles.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some(t => t.includes(q))),
    videos: videos.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.tags.some(t => t.includes(q))),
    caseStudies: caseStudies.filter(c => c.title.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q) || c.tags.some(t => t.includes(q))),
    templates: templates.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(t => t.includes(q))),
    bestPractices: bestPractices.filter(b => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)),
    faqs: faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)),
  };
}
