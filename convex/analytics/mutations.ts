import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const track = mutation({
  args: {
    orgId: v.id('organizations'),
    eventId: v.optional(v.id('events')),
    type: v.union(
      v.literal('page_view'), v.literal('profile_visit'), v.literal('vote_cast'),
      v.literal('broadcast_view'), v.literal('follow'), v.literal('unfollow'),
      v.literal('share'), v.literal('search'), v.literal('download'),
    ),
    userId: v.optional(v.id('users')),
    metadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('analyticsEvents', {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});
