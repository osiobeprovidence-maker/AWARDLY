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

export const createWebsite = mutation({
  args: { firebaseUid: v.optional(v.string()), orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.firebaseUid, args.orgId);

    const existing = await ctx.db
      .query('organizationWebsites')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .unique();
    if (existing) throw new Error('Website already exists for this organization');

    const now = new Date().toISOString();
    const websiteId = await ctx.db.insert('organizationWebsites', {
      orgId: args.orgId,
      theme: 'classic',
      navigation: DEFAULT_NAVIGATION,
      homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
      createdAt: now,
      updatedAt: now,
    });

    const defaultPages = ['home', 'about', 'events', 'winners', 'media', 'voting', 'live-feed', 'contact'];
    for (const pageId of defaultPages) {
      await ctx.db.insert('websitePages', {
        orgId: args.orgId,
        websiteId,
        pageId,
        title: pageId.charAt(0).toUpperCase() + pageId.slice(1).replace(/-/g, ' '),
        slug: pageId,
        content: '',
        sections: [],
        isPublished: pageId === 'home' || pageId === 'about',
        createdAt: now,
        updatedAt: now,
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
