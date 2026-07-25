import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Trophy, Users, Eye, ArrowUpRight, TrendingUp, 
  Medal, Ticket, Bookmark, Building2, Star, Zap, User
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function DashboardOverview() {
  const navigate = useNavigate();
  const { user, currentOrg, organizations } = useAuth();

  const convexUser = useQuery(
    api.users.queries.getUserByFirebaseUid,
    user?.id ? { firebaseUid: user.id } : 'skip'
  );

  const memberships = useQuery(
    api.organizationMembers.queries.getMyMemberships,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  const bookmarks = useQuery(
    api.feeds.queries.getMyBookmarks,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  const userPosts = useQuery(
    api.feeds.queries.getByAuthor,
    convexUser ? { authorId: convexUser._id } : 'skip'
  );

  const completion = useQuery(
    api.users.queries.getProfileCompletion,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  const stats = [
    { label: 'Reputation', value: convexUser?.reputationScore ?? 0, icon: Star, color: 'text-gold-500', to: '/dashboard/profile' },
    { label: 'Awards', value: convexUser?.awardsCount ?? 0, icon: Trophy, color: 'text-gold-500', to: '/dashboard/my-awards' },
    { label: 'Nominations', value: convexUser?.nominationsCount ?? 0, icon: Medal, color: 'text-amber-400', to: '/dashboard/my-nominations' },
    { label: 'Followers', value: convexUser?.followerCount ?? 0, icon: Users, color: 'text-sky-400', to: '/dashboard/profile' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} className="h-16 w-16 rounded-2xl object-cover border-2 border-white/10" alt="" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
              <User className="h-8 w-8 text-gold-500" />
            </div>
          )}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-serif text-white tracking-tight italic"
            >
              Welcome back, {user?.name?.split(' ')[0] || 'there'}
            </motion.h1>
            <p className="text-dark-400 text-sm mt-1">
              {currentOrg 
                ? `Managing ${currentOrg.name}` 
                : organizations.length > 0 
                  ? `${organizations.length} organization${organizations.length !== 1 ? 's' : ''} available`
                  : 'Your personal award management hub'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {completion && completion.percentage < 100 && (
        <Card className="p-5 bg-gold-500/5 border-gold-500/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-white">Complete Your Profile</p>
            <span className="text-xs font-bold text-gold-500">{completion.percentage}%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion.percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gold-500 rounded-full"
            />
          </div>
          {completion.suggestions.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-dark-400">{completion.suggestions[0]}</p>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/profile')} className="text-[10px] font-bold uppercase tracking-widest text-gold-500">
                Complete <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
          >
            <Card 
              className="hover:border-gold-500/30 transition-all group cursor-pointer overflow-hidden relative"
              onClick={() => navigate(stat.to)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-serif text-white">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Edit Profile', icon: User, to: '/dashboard/profile', desc: 'Update your personal information' },
                { label: 'Browse Events', icon: Trophy, to: '/dashboard/events', desc: 'Discover awards and competitions' },
                { label: 'Community Feed', icon: Zap, to: '/dashboard/feed', desc: 'See what\'s happening' },
                ...(organizations.length === 0 ? [{ label: 'Create Organization', icon: Building2, to: '/onboarding', desc: 'Start managing your own awards' }] : []),
              ].map(action => (
                <button 
                  key={action.label} 
                  onClick={() => navigate(action.to)} 
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors shrink-0">
                    <action.icon className="h-5 w-5 text-dark-500 group-hover:text-gold-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white group-hover:text-gold-500 transition-colors">{action.label}</p>
                    <p className="text-[10px] text-dark-500">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-dark-500 group-hover:text-gold-500 shrink-0" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Recent Activity</CardTitle>
              {userPosts && userPosts.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/profile')} className="text-[10px] font-bold uppercase tracking-widest text-dark-500">
                  View All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!userPosts || userPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400">No activity yet</p>
                  <p className="text-[10px] text-dark-500 mt-1">Your posts and interactions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.slice(0, 3).map((post: any) => (
                    <div key={post._id} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-gold-500 mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-dark-300 line-clamp-2">{post.content}</p>
                        <p className="text-[10px] text-dark-500 mt-1">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Organizations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Organizations</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/onboarding')} className="text-[10px] font-bold uppercase tracking-widest text-gold-500">
                <Building2 className="h-3 w-3 mr-1" /> Create
              </Button>
            </CardHeader>
            <CardContent>
              {organizations.length === 0 ? (
                <div className="text-center py-6">
                  <Building2 className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400 mb-3">No organizations yet</p>
                  <Button size="sm" onClick={() => navigate('/onboarding')} className="text-[10px]">
                    Create Your First
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {organizations.slice(0, 4).map((org: any) => (
                    <button
                      key={org.id}
                      onClick={() => navigate('/dashboard/events')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                    >
                      {org.logoUrl ? (
                        <img src={org.logoUrl} className="h-8 w-8 rounded-lg object-cover shrink-0" alt="" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-dark-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate group-hover:text-gold-500 transition-colors">{org.name}</p>
                        <p className="text-[10px] text-dark-500">{org.eventCount} events</p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-dark-500 group-hover:text-gold-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Saved Events</CardTitle>
              {bookmarks && bookmarks.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/saved')} className="text-[10px] font-bold uppercase tracking-widest text-dark-500">
                  View All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!bookmarks || bookmarks.length === 0 ? (
                <div className="text-center py-6">
                  <Bookmark className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-dark-400">No saved events</p>
                  <p className="text-[10px] text-dark-500 mt-1">Events you save will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.slice(0, 3).map((bm: any) => (
                    <div key={bm._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <Bookmark className="h-4 w-4 text-gold-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{bm.targetId}</p>
                        <p className="text-[10px] text-dark-500">Saved event</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
