import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';

export const publishScheduledPosts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const scheduledPosts = await ctx.db
      .query('feedPosts')
      .withIndex('by_status', (q) => q.eq('status', 'scheduled'))
      .collect();

    let published = 0;
    for (const post of scheduledPosts) {
      if (post.scheduledAt && post.scheduledAt <= now) {
        await ctx.db.patch(post._id, {
          status: 'published',
          publishedAt: now,
          updatedAt: now,
        });

        const org = await ctx.db.get(post.orgId);
        if (post.visibility === 'public') {
          const followers = await ctx.db
            .query('followers')
            .withIndex('by_orgId', (q) => q.eq('orgId', post.orgId))
            .collect();
          for (const f of followers) {
            if (f.userId !== post.authorId) {
              await ctx.db.insert('notifications', {
                userId: f.userId,
                type: 'nomination',
                title: `New post from ${org?.name ?? 'Organization'}`,
                body: post.content.slice(0, 100),
                link: `/org/${org?.slug}`,
                orgId: post.orgId,
                isRead: false,
                createdAt: now,
              });
            }
          }
        }
        published++;
      }
    }
    return published;
  },
});
