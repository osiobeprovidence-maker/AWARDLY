import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getById = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('events')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
    return results[0] ?? null;
  },
});

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('events')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getByOrgAndStatus = query({
  args: {
    orgId: v.id('organizations'),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('live'), v.literal('closed'), v.literal('archived')),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('events')
      .withIndex('by_orgId_status', (q) => q.eq('orgId', args.orgId).eq('status', args.status))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('events')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const getLive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('events')
      .withIndex('by_status', (q) => q.eq('status', 'live'))
      .filter((q) => q.eq(q.field('isDeleted'), false))
      .collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.toLowerCase();
    const all = await ctx.db
      .query('events')
      .withIndex('by_isDeleted', (q) => q.eq('isDeleted', false))
      .collect();
    return all
      .filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .slice(0, 20);
  },
});

export const getWithOrg = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;
    const org = await ctx.db.get(event.orgId);
    return { event, org };
  },
});
