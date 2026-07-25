import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getMyAssignments = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query('judges')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const result = [];
    for (const assignment of assignments) {
      const event = await ctx.db.get(assignment.eventId);
      const org = await ctx.db.get(assignment.orgId);
      const categories = await Promise.all(
        assignment.categoryIds.map((id) => ctx.db.get(id))
      );
      result.push({
        ...assignment,
        event: event ? { title: event.title, slug: event.slug, status: event.status, judgingDeadline: event.judgingDeadline } : null,
        org: org ? { name: org.name, slug: org.slug, logoUrl: org.logoUrl, primaryColor: org.primaryColor } : null,
        categories: categories.filter(Boolean).map((c) => ({
          _id: c!._id,
          name: c!.name,
          nomineeCount: c!.nomineeCount,
        })),
      });
    }
    return result;
  },
});

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    const judges = await ctx.db
      .query('judges')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .collect();

    const result = [];
    for (const judge of judges) {
      const user = await ctx.db.get(judge.userId);
      const categories = await Promise.all(
        judge.categoryIds.map((id) => ctx.db.get(id))
      );
      result.push({
        ...judge,
        user: user ? { name: user.name, email: user.email, avatarUrl: user.avatarUrl } : null,
        categories: categories.filter(Boolean).map((c) => ({
          _id: c!._id,
          name: c!.name,
        })),
      });
    }
    return result;
  },
});

export const getById = query({
  args: { judgeId: v.id('judges') },
  handler: async (ctx, args) => {
    const judge = await ctx.db.get(args.judgeId);
    if (!judge) return null;

    const user = await ctx.db.get(judge.userId);
    const event = await ctx.db.get(judge.eventId);
    const org = await ctx.db.get(judge.orgId);
    const categories = await Promise.all(
      judge.categoryIds.map((id) => ctx.db.get(id))
    );

    return {
      ...judge,
      user: user ? { name: user.name, email: user.email, avatarUrl: user.avatarUrl } : null,
      event: event ? { title: event.title, slug: event.slug, status: event.status, judgingDeadline: event.judgingDeadline, judgingRules: event.judgingRules, judgingGuidelines: event.judgingGuidelines } : null,
      org: org ? { name: org.name, slug: org.slug, logoUrl: org.logoUrl, primaryColor: org.primaryColor } : null,
      categories: categories.filter(Boolean).map((c) => ({
        _id: c!._id,
        name: c!.name,
        nomineeCount: c!.nomineeCount,
        judgingCriteria: c!.judgingCriteria,
      })),
    };
  },
});

export const getMyProgress = query({
  args: { userId: v.id('users'), eventId: v.id('events') },
  handler: async (ctx, args) => {
    const judge = await ctx.db
      .query('judges')
      .withIndex('by_userId_eventId', (q) => q.eq('userId', args.userId).eq('eventId', args.eventId))
      .unique();

    if (!judge) return null;

    // Count total nominees across assigned categories
    let totalNominees = 0;
    for (const catId of judge.categoryIds) {
      const cat = await ctx.db.get(catId);
      if (cat) totalNominees += cat.nomineeCount;
    }

    // Count scored nominees
    const scores = await ctx.db
      .query('judgeScores')
      .withIndex('by_judgeId', (q) => q.eq('judgeId', judge._id))
      .collect();

    const submittedCount = scores.filter((s) => s.status === 'submitted' || s.status === 'locked').length;
    const draftCount = scores.filter((s) => s.status === 'draft').length;

    return {
      assigned: totalNominees,
      completed: submittedCount,
      drafts: draftCount,
      remaining: totalNominees - submittedCount,
      percentage: totalNominees > 0 ? Math.round((submittedCount / totalNominees) * 100) : 0,
      deadline: judge.deadline,
    };
  },
});

export const getByOrg = query({
  args: { orgId: v.id('organizations') },
  handler: async (ctx, args) => {
    const judges = await ctx.db
      .query('judges')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const result = [];
    for (const judge of judges) {
      const user = await ctx.db.get(judge.userId);
      const event = await ctx.db.get(judge.eventId);
      result.push({
        ...judge,
        user: user ? { name: user.name, email: user.email, avatarUrl: user.avatarUrl } : null,
        event: event ? { title: event.title } : null,
      });
    }
    return result;
  },
});
