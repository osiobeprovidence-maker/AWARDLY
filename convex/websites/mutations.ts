import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from '../shared/helpers';

async function requireOrgAdmin(ctx: any, firebaseUid: string | undefined, orgId: string) {
  const user = await getAuthenticatedUser(ctx, firebaseUid);
  if (user.role === 'platform_admin') return user;
  const membership = await ctx.db
    .query('organizationMembers')
    .withIndex('by_orgId_userId', (q) => q.eq('orgId', orgId).eq('userId', user._id))
    .unique();
  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Access denied: organization admin required');
  }
  return user;
}

const ORG_TYPE_LABELS: Record<string, string> = {
  company: 'organization', government: 'government body', nonprofit: 'nonprofit',
  university: 'university', community: 'community', media: 'media outlet',
  individual: 'initiative', other: 'organization',
};

function buildStarterContent(org: any) {
  const name = org.name;
  const typeLabel = ORG_TYPE_LABELS[org.type] ?? 'organization';
  const location = [org.city, org.country].filter(Boolean).join(', ') || '';
  const locationPhrase = location ? ` based in ${location}` : '';

  return {
    navigation: [
      { id: 'home', label: 'Home', pageId: 'home', isEnabled: true, order: 0 },
      { id: 'about', label: 'About', pageId: 'about', isEnabled: true, order: 1 },
      { id: 'events', label: 'Events', pageId: 'events', isEnabled: true, order: 2 },
      { id: 'winners', label: 'Winners', pageId: 'winners', isEnabled: true, order: 3 },
      { id: 'media', label: 'Media', pageId: 'media', isEnabled: true, order: 4 },
      { id: 'voting', label: 'Voting', pageId: 'voting', isEnabled: false, order: 5 },
      { id: 'live-feed', label: 'Live Feed', pageId: 'live-feed', isEnabled: false, order: 6 },
      { id: 'contact', label: 'Contact', pageId: 'contact', isEnabled: true, order: 7 },
    ],
    homepageSections: [
      {
        id: 'hero', type: 'hero', isEnabled: true, order: 0,
        title: name,
        subtitle: org.description || `Welcome to ${name}`,
        content: org.description || `A premier ${typeLabel}${locationPhrase} celebrating excellence and innovation.`,
        ctaText: 'Explore Awards',
        ctaUrl: '/events',
        backgroundImage: org.coverUrl || '',
      },
      {
        id: 'about', type: 'about', isEnabled: true, order: 1,
        title: `About ${name}`,
        subtitle: 'Our Story',
        content: org.description
          || `${name} is a leading ${typeLabel}${locationPhrase} dedicated to recognizing outstanding achievements and fostering a community of excellence. Since ${org.foundedYear || 'our founding'}, we have been committed to honoring the best and brightest in our field.`,
        metadata: {
          mission: `To empower and celebrate excellence within the ${typeLabel} community through meaningful recognition and connection.`,
          vision: `To be the most respected platform for honoring achievement and driving innovation in our industry.`,
        },
      },
      {
        id: 'featured-events', type: 'featured_events', isEnabled: true, order: 2,
        title: 'Featured Awards',
        subtitle: 'Discover our flagship programs',
        content: '',
      },
      {
        id: 'sponsors', type: 'sponsors', isEnabled: true, order: 3,
        title: 'Our Partners',
        subtitle: 'Proudly supported by industry leaders',
      },
      {
        id: 'gallery', type: 'gallery', isEnabled: true, order: 4,
        title: 'Gallery',
        subtitle: 'Moments from our events',
      },
      {
        id: 'newsletter', type: 'newsletter', isEnabled: true, order: 5,
        title: 'Stay Updated',
        subtitle: `Subscribe to receive the latest news and updates from ${name}.`,
      },
      {
        id: 'faq', type: 'faq', isEnabled: true, order: 6,
        title: 'Frequently Asked Questions',
        subtitle: 'Common questions about our programs',
      },
      {
        id: 'contact', type: 'contact', isEnabled: true, order: 7,
        title: 'Get in Touch',
        subtitle: `We'd love to hear from you`,
      },
    ],
    seo: {
      title: `${name} - Awards & Recognition`,
      description: org.description || `Official website of ${name}. Explore our awards, events, and programs.`,
      keywords: [name, 'awards', 'recognition', org.type, location].filter(Boolean),
    },
    footerContent: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };
}

export const ensureWebsite = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx, args.firebaseUid);

    const existing = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (existing) return { websiteId: existing._id, created: false };

    const org = await ctx.db.get(args.orgId);
    if (!org) throw new Error('Organization not found');

    const membership = await ctx.db
      .query('organizationMembers')
      .withIndex('by_orgId_userId', (q) => q.eq('orgId', args.orgId).eq('userId', user._id))
      .unique();
    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      if (user.role !== 'platform_admin') {
        throw new Error('Access denied: organization admin required');
      }
    }

    const starter = buildStarterContent(org);
    const now = new Date().toISOString();

    const websiteId = await ctx.db.insert('organizationWebsites', {
      orgId: args.orgId,
      theme: 'classic',
      navigation: starter.navigation,
      homepageSections: starter.homepageSections,
      seo: starter.seo,
      footerContent: starter.footerContent,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    });

    const defaultPages = [
      { pageId: 'home', title: 'Home', published: true },
      { pageId: 'about', title: 'About', published: true },
      { pageId: 'events', title: 'Events', published: true },
      { pageId: 'winners', title: 'Winners', published: false },
      { pageId: 'media', title: 'Media', published: true },
      { pageId: 'voting', title: 'Voting', published: false },
      { pageId: 'live-feed', title: 'Live Feed', published: false },
      { pageId: 'contact', title: 'Contact', published: true },
    ];
    for (const p of defaultPages) {
      let content = '';
      if (p.pageId === 'about') {
        content = `<h2>About ${org.name}</h2><p>${org.description || `${org.name} is a leading organization dedicated to recognizing excellence and innovation.`}</p><h3>Our Mission</h3><p>To empower and celebrate excellence through meaningful recognition and connection.</p><h3>Our Vision</h3><p>To be the most respected platform for honoring achievement in our industry.</p>`;
      } else if (p.pageId === 'contact') {
        content = `<h2>Contact Us</h2><p>Email: ${org.contactEmail || 'contact@example.com'}</p>${org.phone ? `<p>Phone: ${org.phone}</p>` : ''}${location ? `<p>Location: ${location}</p>` : ''}`;
      } else if (p.pageId === 'home') {
        content = `<h1>Welcome to ${org.name}</h1><p>${org.description || `A premier organization celebrating excellence.`}</p>`;
      }

      await ctx.db.insert('websitePages', {
        orgId: args.orgId,
        websiteId,
        pageId: p.pageId,
        title: p.title,
        slug: p.pageId,
        content,
        sections: [],
        isPublished: p.published,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { websiteId, created: true };
  },
});

export const createWebsite = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);

    const existing = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (existing) throw new Error('Website already exists for this organization');

    const org = await ctx.db.get(args.orgId);
    if (!org) throw new Error('Organization not found');
    const starter = buildStarterContent(org);
    const now = new Date().toISOString();

    const websiteId = await ctx.db.insert('organizationWebsites', {
      orgId: args.orgId,
      theme: 'classic',
      navigation: starter.navigation,
      homepageSections: starter.homepageSections,
      seo: starter.seo,
      footerContent: starter.footerContent,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    });

    const defaultPages = [
      { pageId: 'home', title: 'Home', published: true },
      { pageId: 'about', title: 'About', published: true },
      { pageId: 'events', title: 'Events', published: true },
      { pageId: 'winners', title: 'Winners', published: false },
      { pageId: 'media', title: 'Media', published: true },
      { pageId: 'voting', title: 'Voting', published: false },
      { pageId: 'live-feed', title: 'Live Feed', published: false },
      { pageId: 'contact', title: 'Contact', published: true },
    ];
    for (const p of defaultPages) {
      let content = '';
      if (p.pageId === 'about') {
        content = `<h2>About ${org.name}</h2><p>${org.description || `${org.name} is a leading organization.`}</p>`;
      } else if (p.pageId === 'contact') {
        content = `<h2>Contact Us</h2><p>Email: ${org.contactEmail}</p>`;
      }
      await ctx.db.insert('websitePages', {
        orgId: args.orgId, websiteId, pageId: p.pageId, title: p.title,
        slug: p.pageId, content, sections: [], isPublished: p.published,
        createdAt: now, updatedAt: now,
      });
    }

    return { success: true, websiteId };
  },
});

export const updateNavigation = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    navigation: v.array(v.object({
      id: v.string(),
      label: v.string(),
      pageId: v.string(),
      isEnabled: v.boolean(),
      order: v.number(),
      isExternal: v.optional(v.boolean()),
      externalUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    await ctx.db.patch(website._id, {
      navigation: args.navigation,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updateHomepageSections = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    sections: v.array(v.object({
      id: v.string(),
      type: v.string(),
      isEnabled: v.boolean(),
      order: v.number(),
      title: v.optional(v.string()),
      subtitle: v.optional(v.string()),
      content: v.optional(v.string()),
      backgroundColor: v.optional(v.string()),
      backgroundImage: v.optional(v.string()),
      ctaText: v.optional(v.string()),
      ctaUrl: v.optional(v.string()),
      mediaUrl: v.optional(v.string()),
      metadata: v.optional(v.record(v.string(), v.string())),
    })),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    await ctx.db.patch(website._id, {
      homepageSections: args.sections,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updateTheme = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    theme: v.union(
      v.literal('classic'), v.literal('modern'), v.literal('luxury'),
      v.literal('festival'), v.literal('corporate'), v.literal('entertainment'),
    ),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    await ctx.db.patch(website._id, {
      theme: args.theme,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updatePage = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    pageId: v.string(),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    sections: v.optional(v.array(v.object({
      id: v.string(),
      type: v.string(),
      isEnabled: v.boolean(),
      order: v.number(),
      title: v.optional(v.string()),
      subtitle: v.optional(v.string()),
      content: v.optional(v.string()),
      backgroundColor: v.optional(v.string()),
      backgroundImage: v.optional(v.string()),
      ctaText: v.optional(v.string()),
      ctaUrl: v.optional(v.string()),
      mediaUrl: v.optional(v.string()),
      metadata: v.optional(v.record(v.string(), v.string())),
    }))),
    isPublished: v.optional(v.boolean()),
    seo: v.optional(v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      keywords: v.optional(v.array(v.string())),
      ogImage: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const page = await ctx.db
      .query('websitePages')
      .withIndex('by_orgId_pageId', (q) => q.eq('orgId', args.orgId).eq('pageId', args.pageId))
      .unique();
    if (!page) throw new Error('Page not found');

    const patches: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (args.title !== undefined) patches.title = args.title;
    if (args.content !== undefined) patches.content = args.content;
    if (args.sections !== undefined) patches.sections = args.sections;
    if (args.isPublished !== undefined) patches.isPublished = args.isPublished;
    if (args.seo !== undefined) patches.seo = args.seo;

    await ctx.db.patch(page._id, patches);
    return { success: true };
  },
});

export const updateSeo = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    seo: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      keywords: v.optional(v.array(v.string())),
      ogImage: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    await ctx.db.patch(website._id, {
      seo: args.seo,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const updateWebsiteSettings = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    headerStyle: v.optional(v.union(v.literal('default'), v.literal('centered'), v.literal('minimal'))),
    footerStyle: v.optional(v.union(v.literal('default'), v.literal('centered'), v.literal('minimal'))),
    footerContent: v.optional(v.string()),
    customDomain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    const patches: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (args.headerStyle !== undefined) patches.headerStyle = args.headerStyle;
    if (args.footerStyle !== undefined) patches.footerStyle = args.footerStyle;
    if (args.footerContent !== undefined) patches.footerContent = args.footerContent;
    if (args.customDomain !== undefined) patches.customDomain = args.customDomain;

    await ctx.db.patch(website._id, patches);
    return { success: true };
  },
});

export const togglePublish = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    const now = new Date().toISOString();
    const patches: Record<string, any> = {
      isPublished: args.isPublished,
      updatedAt: now,
    };
    if (args.isPublished) {
      patches.publishedAt = website.publishedAt ?? now;
      patches.lastPublishedAt = now;
    }

    await ctx.db.patch(website._id, patches);
    return { success: true };
  },
});

export const updateSocialLinks = mutation({
  args: {
    firebaseUid: v.optional(v.string()),
    orgId: v.id('organizations'),
    socialLinks: v.object({
      facebook: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);
    const website = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (!website) throw new Error('Website not found');

    await ctx.db.patch(website._id, {
      socialLinks: args.socialLinks,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});
