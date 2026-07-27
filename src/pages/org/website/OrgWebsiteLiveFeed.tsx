import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FeedPostCard } from '../../../components/feed/FeedPost';
import { CommentSection } from '../../../components/feed/CommentSection';
import { MessageSquare } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';

interface OrgWebsiteLiveFeedProps {
  org: any;
  posts: any[];
}

export function OrgWebsiteLiveFeed({ org, posts }: OrgWebsiteLiveFeedProps) {
  const [commentPostId, setCommentPostId] = React.useState<Id<'feedPosts'> | null>(null);

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" />
        <h3 className="text-xl text-white font-serif mb-2">No Posts Yet</h3>
        <p className="text-dark-500 text-sm">This organization hasn't posted any updates yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Live Feed</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Latest Updates</h2>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="space-y-2">
            <FeedPostCard
              post={post}
              org={post.org}
              showOrgHeader
              isPublic
              onCommentToggle={(id) => setCommentPostId(commentPostId === id ? null : id)}
              showComments={commentPostId === post._id}
            />
            {commentPostId === post._id && (
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <CommentSection postId={post._id} isPublic />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
