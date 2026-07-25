import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useAuth } from '../../lib/convex-auth';
import { useToast } from '../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ImageUpload';
import { FeedPostCard } from '../../components/feed/FeedPost';
import {
  User, Mail, MapPin, Globe, Calendar, Edit3, Save, X, Camera,
  Shield, Heart, MessageCircle, BookOpen, Users, Building2,
  LinkIcon, Twitter, Instagram, Linkedin, Youtube, Phone, FileText, Award,
  ChevronRight, Loader2, ExternalLink, Star, Bookmark, Share2, Eye,
  Trophy, Medal, BadgeCheck, CheckCircle, Sparkles, TrendingUp,
  Plus, GripVertical, Trash2, Image as ImageIcon, Video, File,
  ChevronDown, ChevronUp, EyeOff, Zap, Target, Briefcase, GraduationCap,
  Globe2, Lock, Copy, Check, Crown, Flame,
} from 'lucide-react';

const TABS = [
  { id: 'about', label: 'About', icon: User },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'activity', label: 'Activity', icon: ActivityIcon },
  { id: 'social', label: 'Links', icon: Globe2 },
];

function ActivityIcon(props: any) {
  return <Zap {...props} />;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const BADGE_CONFIG: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  verified: { icon: BadgeCheck, label: 'Verified', color: 'text-gold-500', bg: 'bg-gold-500/10 border-gold-500/20' },
  judge: { icon: GavelIcon, label: 'Judge', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  organizer: { icon: Crown, label: 'Organizer', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  nominee: { icon: Star, label: 'Nominee', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  winner: { icon: Trophy, label: 'Winner', color: 'text-gold-500', bg: 'bg-gold-500/10 border-gold-500/20' },
  creator: { icon: Sparkles, label: 'Creator', color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20' },
  rising: { icon: Flame, label: 'Rising Talent', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  early: { icon: Zap, label: 'Early Supporter', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
};

function GavelIcon(props: any) {
  return <Shield {...props} />;
}

const SOCIAL_ICONS: Record<string, any> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Globe,
  portfolio: ExternalLink,
};

const SOCIAL_COLORS: Record<string, string> = {
  twitter: 'text-sky-400 hover:bg-sky-400/10',
  instagram: 'text-pink-400 hover:bg-pink-400/10',
  linkedin: 'text-blue-400 hover:bg-blue-400/10',
  youtube: 'text-red-400 hover:bg-red-400/10',
  github: 'text-dark-300 hover:bg-white/10',
  portfolio: 'text-gold-500 hover:bg-gold-500/10',
};

export function UserProfile() {
  const { userId: urlParam } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: authUser, currentOrg } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Determine if viewing own profile or via username
  const isUsernameRoute = !urlParam?.startsWith('firebase_') && urlParam !== undefined && urlParam !== authUser?.id;
  const targetFirebaseUid = isUsernameRoute ? undefined : (urlParam ?? authUser?.id);

  // Lookups
  const convexUserByUsername = useQuery(
    api.users.queries.getUserByUsername,
    isUsernameRoute && urlParam ? { username: urlParam } : 'skip'
  );
  const convexUserByUid = useQuery(
    api.users.queries.getUserByFirebaseUid,
    targetFirebaseUid ? { firebaseUid: targetFirebaseUid } : 'skip'
  );

  const convexUser = isUsernameRoute ? convexUserByUsername : convexUserByUid;
  const profileUserId = convexUser?.firebaseUid;

  const isOwnProfile = profileUserId === authUser?.id;
  const userConvexId = convexUser?._id;

  // Mutations
  const updateProfile = useMutation(api.users.mutations.updateProfile);
  const incrementViews = useMutation(api.users.mutations.incrementProfileViews);
  const toggleFollow = useMutation(api.userFollows.mutations.toggleFollow);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [editForm, setEditForm] = useState<any>({});

  // Data queries
  const completion = useQuery(
    api.users.queries.getProfileCompletion,
    isOwnProfile && userConvexId ? { userId: userConvexId } : 'skip'
  );
  const isFollowing = useQuery(
    api.userFollows.queries.isFollowing,
    authUser && userConvexId && !isOwnProfile
      ? { followerId: authUser.id as any, followingId: userConvexId }
      : 'skip'
  );
  const userPosts = useQuery(
    api.feeds.queries.getByAuthor,
    userConvexId ? { authorId: userConvexId } : 'skip'
  );
  const memberships = useQuery(
    api.organizationMembers.queries.getMyMemberships,
    userConvexId ? { userId: userConvexId } : 'skip'
  );
  const orgIds = memberships?.map((m: any) => m.orgId) ?? [];
  const userOrgs = useQuery(
    api.organizations.queries.getByIds,
    orgIds.length > 0 ? { ids: orgIds } : 'skip'
  );
  const bookmarks = useQuery(
    api.feeds.queries.getMyBookmarks,
    isOwnProfile && userConvexId ? { userId: userConvexId } : 'skip'
  );
  const portfolio = useQuery(
    api.portfolio.queries.getUserPortfolio,
    userConvexId ? { userId: userConvexId, publicOnly: !isOwnProfile } : 'skip'
  );
  const addPortfolioItem = useMutation(api.portfolio.mutations.addItem);
  const removePortfolioItem = useMutation(api.portfolio.mutations.removeItem);

  // Increment views on public profiles
  useEffect(() => {
    if (convexUser && !isOwnProfile && userConvexId) {
      incrementViews({ userId: userConvexId }).catch(() => {});
    }
  }, [convexUser?._id, isOwnProfile]);

  // Initialize edit form
  useEffect(() => {
    if (convexUser && isEditing) {
      setEditForm({
        name: convexUser.name ?? '',
        username: convexUser.username ?? '',
        headline: convexUser.headline ?? '',
        bio: convexUser.bio ?? '',
        location: convexUser.location ?? '',
        website: convexUser.website ?? '',
        phone: convexUser.phone ?? '',
        industry: convexUser.industry ?? '',
        skills: convexUser.skills?.join(', ') ?? '',
        languages: convexUser.languages?.join(', ') ?? '',
        interests: convexUser.interests?.join(', ') ?? '',
        avatarUrl: convexUser.avatarUrl ?? '',
        coverUrl: convexUser.coverUrl ?? '',
        twitter: convexUser.socialLinks?.twitter ?? '',
        instagram: convexUser.socialLinks?.instagram ?? '',
        linkedin: convexUser.socialLinks?.linkedin ?? '',
        youtube: convexUser.socialLinks?.youtube ?? '',
        github: convexUser.socialLinks?.github ?? '',
        portfolioLink: convexUser.socialLinks?.portfolio ?? '',
      });
    }
  }, [convexUser, isEditing]);

  if (!urlParam && !authUser) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <User className="h-16 w-16 text-dark-600 mx-auto mb-4" />
        <h2 className="text-xl font-serif text-white mb-2">Please log in</h2>
        <p className="text-dark-400 text-sm">Sign in to view your profile.</p>
        <Button onClick={() => navigate('/')} className="mt-6">Go Home</Button>
      </div>
    );
  }

  if (convexUser === undefined) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!convexUser) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <User className="h-16 w-16 text-dark-600 mx-auto mb-4" />
        <h2 className="text-xl font-serif text-white mb-2">User not found</h2>
        <p className="text-dark-400 text-sm">This profile doesn't exist.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editForm.name?.trim()) { toast('Name is required', 'error'); return; }
    try {
      await updateProfile({
        name: editForm.name.trim(),
        username: editForm.username?.trim() || undefined,
        headline: editForm.headline?.trim() || undefined,
        bio: editForm.bio?.trim() || undefined,
        location: editForm.location?.trim() || undefined,
        website: editForm.website?.trim() || undefined,
        phone: editForm.phone?.trim() || undefined,
        industry: editForm.industry?.trim() || undefined,
        avatarUrl: editForm.avatarUrl || undefined,
        coverUrl: editForm.coverUrl || undefined,
        skills: editForm.skills ? editForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
        languages: editForm.languages ? editForm.languages.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
        interests: editForm.interests ? editForm.interests.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
        socialLinks: {
          twitter: editForm.twitter?.trim() || undefined,
          instagram: editForm.instagram?.trim() || undefined,
          linkedin: editForm.linkedin?.trim() || undefined,
          youtube: editForm.youtube?.trim() || undefined,
          github: editForm.github?.trim() || undefined,
          portfolio: editForm.portfolioLink?.trim() || undefined,
        },
      });
      setIsEditing(false);
      toast('Profile updated!', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to update', 'error');
    }
  };

  const handleFollow = async () => {
    if (!authUser || !userConvexId) { toast('Login to follow', 'error'); return; }
    try {
      await toggleFollow({ followingId: userConvexId, firebaseUid: authUser.id });
    } catch (e: any) {
      toast(e.message || 'Failed', 'error');
    }
  };

  const handleShare = () => {
    const url = convexUser?.username
      ? `${window.location.origin}/u/${convexUser.username}`
      : `${window.location.origin}/profile/${profileUserId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast('Profile link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPortfolio = async (type: 'image' | 'video' | 'pdf' | 'link') => {
    const title = prompt('Enter title:');
    if (!title) return;
    let url = '';
    if (type === 'link') {
      url = prompt('Enter URL:') || '';
      if (!url) return;
    } else {
      url = prompt('Enter the URL of your ' + type + ':') || '';
      if (!url) return;
    }
    try {
      await addPortfolioItem({ title, type, url, isPublic: true });
      toast('Added to portfolio!', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed', 'error');
    }
  };

  const handleRemovePortfolio = async (itemId: Id<'portfolioItems'>) => {
    if (!confirm('Remove from portfolio?')) return;
    try {
      await removePortfolioItem({ itemId });
      toast('Removed', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed', 'error');
    }
  };

  const badges = [
    convexUser.verificationStatus?.email && 'verified',
    convexUser.awardsCount && convexUser.awardsCount > 0 && 'winner',
    convexUser.nominationsCount && convexUser.nominationsCount > 0 && 'nominee',
    convexUser.role === 'admin' || convexUser.role === 'platform_admin' ? 'organizer' : null,
  ].filter(Boolean) as string[];

  const socialEntries = convexUser.socialLinks
    ? Object.entries(convexUser.socialLinks).filter(([_, v]) => v)
    : [];

  const getProfileUrl = () => {
    if (convexUser?.username) return `/u/${convexUser.username}`;
    return `/profile/${profileUserId}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-0 pb-32">

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <div className="relative">
        {/* Cover */}
        <div className="h-56 sm:h-72 rounded-b-2xl overflow-hidden bg-dark-800/50 relative">
          {isEditing ? (
            <div className="absolute inset-0 z-10">
              <ImageUpload onImageSelect={(url) => setEditForm({ ...editForm, coverUrl: url ?? '' })} value={editForm.coverUrl} label="" aspectRatio="video" className="h-full" />
            </div>
          ) : convexUser.coverUrl ? (
            <img src={convexUser.coverUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gold-500/15 via-dark-900 to-dark-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
        </div>

        {/* Avatar - overlapping cover */}
        <div className="relative -mt-20 sm:-mt-16 px-6 sm:px-8 flex items-end gap-5">
          <div className="relative shrink-0">
            {isEditing ? (
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl border-4 border-dark-950 overflow-hidden z-20 relative">
                <ImageUpload onImageSelect={(url) => setEditForm({ ...editForm, avatarUrl: url ?? '' })} value={editForm.avatarUrl} label="" aspectRatio="square" className="h-full" />
              </div>
            ) : convexUser.avatarUrl ? (
              <img src={convexUser.avatarUrl} className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover border-4 border-dark-950" alt={convexUser.name} referrerPolicy="no-referrer" />
            ) : (
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl bg-dark-800 border-4 border-dark-950 flex items-center justify-center font-serif text-4xl text-gold-500">
                {convexUser.name?.[0] ?? '?'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-emerald-500 rounded-full border-3 border-dark-950 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-dark-950" />
            </div>
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif text-white tracking-tight">{convexUser.name}</h1>
              {convexUser.verificationStatus?.email && (
                <BadgeCheck className="h-5 w-5 text-gold-500 shrink-0" />
              )}
            </div>
            {convexUser.username && (
              <p className="text-xs text-dark-400 mt-0.5">@{convexUser.username}</p>
            )}
            {convexUser.headline && (
              <p className="text-xs text-dark-300 mt-1">{convexUser.headline}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-dark-500 flex-wrap">
              {convexUser.location && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {convexUser.location}</span>
              )}
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {new Date(convexUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="px-6 sm:px-8 mt-4 flex items-center gap-2 flex-wrap">
            {badges.map((key) => {
              const badge = BADGE_CONFIG[key];
              if (!badge) return null;
              const Icon = badge.icon;
              return (
                <span key={key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${badge.bg} ${badge.color}`}>
                  <Icon className="h-3 w-3" /> {badge.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="px-6 sm:px-8 mt-4 flex items-center gap-2">
          {isOwnProfile ? (
            isEditing ? (
              <>
                <Button onClick={handleSave} className="h-9 rounded-xl text-[11px] font-bold px-5">
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="h-9 rounded-xl text-[11px]">
                  <X className="h-3.5 w-3.5 mr-1.5" /> Discard
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="h-9 rounded-xl text-[11px]">
                  <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
                </Button>
                <Button variant="outline" onClick={handleShare} className="h-9 rounded-xl text-[11px]">
                  {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Share2 className="h-3.5 w-3.5 mr-1.5" />}
                  {copied ? 'Copied!' : 'Share Profile'}
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                onClick={handleFollow}
                variant={isFollowing ? 'outline' : 'primary'}
                className="h-9 rounded-xl text-[11px] font-bold px-5"
              >
                {isFollowing ? (
                  <><Check className="h-3.5 w-3.5 mr-1.5" /> Following</>
                ) : (
                  <><Plus className="h-3.5 w-3.5 mr-1.5" /> Follow</>
                )}
              </Button>
              <Button variant="outline" onClick={handleShare} className="h-9 rounded-xl text-[11px]">
                <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ─── Stats Row ────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-8 mt-6">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: 'Reputation', value: convexUser.reputationScore ?? 0, icon: Star, color: 'text-gold-500' },
            { label: 'Awards', value: convexUser.awardsCount ?? 0, icon: Trophy, color: 'text-gold-500' },
            { label: 'Nominations', value: convexUser.nominationsCount ?? 0, icon: Medal, color: 'text-amber-400' },
            { label: 'Followers', value: convexUser.followerCount ?? 0, icon: Users, color: 'text-sky-400' },
            { label: 'Following', value: convexUser.followingCount ?? 0, icon: Heart, color: 'text-pink-400' },
            { label: 'Views', value: convexUser.profileViews ?? 0, icon: Eye, color: 'text-emerald-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Icon className={`h-4 w-4 ${color} mx-auto mb-1`} />
              <p className="text-lg font-serif text-white">{value}</p>
              <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Profile Completion (own profile only) ─────────────────── */}
      {isOwnProfile && completion && completion.percentage < 100 && (
        <div className="px-6 sm:px-8 mt-4">
          <Card className="p-4 bg-gold-500/5 border-gold-500/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-white">Profile Completion</p>
              <span className="text-[10px] font-bold text-gold-500">{completion.percentage}%</span>
            </div>
            <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gold-500 rounded-full"
              />
            </div>
            {completion.suggestions.length > 0 && (
              <p className="text-[10px] text-dark-400">Suggested: {completion.suggestions.join(' • ')}</p>
            )}
          </Card>
        </div>
      )}

      {/* ─── Edit Form (expanded) ──────────────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 sm:px-8 mt-6 space-y-4">
              <Card className="p-5">
                <h3 className="text-sm font-serif text-white mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Your name' },
                    { key: 'username', label: 'Username', placeholder: '@username' },
                    { key: 'headline', label: 'Headline', placeholder: 'Filmmaker • Creative Director', full: true },
                    { key: 'location', label: 'Location', placeholder: 'Lagos, Nigeria' },
                    { key: 'industry', label: 'Industry', placeholder: 'Entertainment' },
                    { key: 'website', label: 'Website', placeholder: 'https://example.com' },
                    { key: 'phone', label: 'Phone', placeholder: '+234 ...' },
                  ].map(({ key, label, placeholder, full }) => (
                    <div key={key} className={full ? 'sm:col-span-2' : ''}>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1 block">{label}</label>
                      <input
                        value={editForm[key] ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1 block">About</label>
                  <textarea
                    value={editForm.bio ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell the world about yourself..."
                    rows={3}
                    maxLength={1000}
                    className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/30 resize-none placeholder:text-dark-600"
                  />
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-serif text-white mb-4">Skills & Interests</h3>
                <div className="space-y-3">
                  {[
                    { key: 'skills', label: 'Skills', placeholder: 'Filmmaking, Editing, Storytelling' },
                    { key: 'languages', label: 'Languages', placeholder: 'English, Yoruba, French' },
                    { key: 'interests', label: 'Interests', placeholder: 'Film, Technology, AI, Photography' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-dark-500 mb-1 block">{label}</label>
                      <input
                        value={editForm[key] ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/30 placeholder:text-dark-600"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-serif text-white mb-4">Social Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-400' },
                    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
                    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400' },
                    { key: 'github', label: 'GitHub', icon: Globe, color: 'text-dark-300' },
                    { key: 'portfolioLink', label: 'Portfolio', icon: ExternalLink, color: 'text-gold-500' },
                  ].map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="flex items-center gap-2 bg-dark-800/60 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-gold-500/30">
                      <Icon className={`h-4 w-4 ${color} shrink-0`} />
                      <input
                        value={editForm[key] ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        placeholder={label + ' handle/URL'}
                        className="bg-transparent text-sm text-white outline-none w-full placeholder:text-dark-600"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Tabs ─────────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-8 mt-6">
        <div className="flex items-center gap-1 border-b border-white/5 overflow-x-auto scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap shrink-0 ${
                activeTab === tab.id ? 'border-gold-500 text-white' : 'border-transparent text-dark-500 hover:text-dark-300'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ────────────────────────────────────────────── */}
      <div className="px-6 sm:px-8 mt-6 space-y-6">

        {/* ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            {/* Bio */}
            {(convexUser.bio || isEditing) && (
              <Card className="p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-3 flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> About
                </h3>
                <p className="text-sm text-dark-200 leading-relaxed whitespace-pre-line">{convexUser.bio || 'No bio yet.'}</p>
              </Card>
            )}

            {/* Skills */}
            {convexUser.skills && convexUser.skills.length > 0 && (
              <Card className="p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-3 flex items-center gap-2">
                  <Target className="h-3.5 w-3.5" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {convexUser.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-dark-200">{skill}</span>
                  ))}
                </div>
              </Card>
            )}

            {/* Industry + Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {convexUser.industry && (
                <Card className="p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-2 flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" /> Industry
                  </h3>
                  <p className="text-sm text-white">{convexUser.industry}</p>
                </Card>
              )}
              {convexUser.languages && convexUser.languages.length > 0 && (
                <Card className="p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-2 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" /> Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {convexUser.languages.map((l) => (
                      <span key={l} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-dark-200">{l}</span>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Interests */}
            {convexUser.interests && convexUser.interests.length > 0 && (
              <Card className="p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-3 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {convexUser.interests.map((i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-gold-500/10 border border-gold-500/20 text-gold-500">{i}</span>
                  ))}
                </div>
              </Card>
            )}

            {/* Verification */}
            {convexUser.verificationStatus && (
              <Card className="p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-3 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" /> Verification
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'email', label: 'Email Verified', icon: Mail },
                    { key: 'phone', label: 'Phone Verified', icon: Phone },
                    { key: 'identity', label: 'Identity Verified', icon: User },
                    { key: 'organization', label: 'Organization Verified', icon: Building2 },
                  ].map(({ key, label, icon: Icon }) => {
                    const verified = (convexUser.verificationStatus as any)?.[key];
                    return (
                      <div key={key} className={`flex items-center gap-2 p-2 rounded-lg ${verified ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-white/[0.02] border border-white/5'}`}>
                        {verified ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-dark-600 shrink-0" />
                        )}
                        <span className={`text-[11px] ${verified ? 'text-emerald-400' : 'text-dark-500'}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* AWARDS */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-4 flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-gold-500" /> Awards Won
              </h3>
              {(convexUser.awardsCount ?? 0) > 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: Math.min(convexUser.awardsCount!, 10) }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10">
                      <Trophy className="h-5 w-5 text-gold-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">Award Recipient</p>
                        <p className="text-[10px] text-dark-400">Excellence in achievements</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-10 w-10 text-dark-700 mx-auto mb-3" />
                  <p className="text-sm text-dark-400">No awards yet</p>
                  <p className="text-[10px] text-dark-600 mt-1">Participate in events to earn your first recognition</p>
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-4 flex items-center gap-2">
                <Medal className="h-3.5 w-3.5 text-amber-400" /> Nominations
              </h3>
              {(convexUser.nominationsCount ?? 0) > 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: Math.min(convexUser.nominationsCount!, 10) }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
                      <Medal className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">Nominated</p>
                        <p className="text-[10px] text-dark-400">Recognized for outstanding contribution</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Medal className="h-10 w-10 text-dark-700 mx-auto mb-3" />
                  <p className="text-sm text-dark-400">No nominations yet</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleAddPortfolio('image')} className="h-8 rounded-xl text-[10px]">
                  <ImageIcon className="h-3 w-3 mr-1" /> Image
                </Button>
                <Button variant="outline" onClick={() => handleAddPortfolio('video')} className="h-8 rounded-xl text-[10px]">
                  <Video className="h-3 w-3 mr-1" /> Video
                </Button>
                <Button variant="outline" onClick={() => handleAddPortfolio('pdf')} className="h-8 rounded-xl text-[10px]">
                  <File className="h-3 w-3 mr-1" /> PDF
                </Button>
                <Button variant="outline" onClick={() => handleAddPortfolio('link')} className="h-8 rounded-xl text-[10px]">
                  <LinkIcon className="h-3 w-3 mr-1" /> Link
                </Button>
              </div>
            )}

            {!portfolio || portfolio.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-white/10">
                <Briefcase className="h-10 w-10 text-dark-600 mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-serif text-white mb-2">No portfolio items</h3>
                <p className="text-dark-500 text-xs">
                  {isOwnProfile ? 'Showcase your work by adding portfolio items.' : 'This user hasn\'t added any portfolio items yet.'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item: any) => (
                  <Card key={item._id} className="overflow-hidden hover:border-white/10 transition-colors group">
                    {item.type === 'image' && item.url && (
                      <div className="aspect-video bg-dark-800 overflow-hidden">
                        <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          {item.description && <p className="text-[10px] text-dark-400 mt-1">{item.description}</p>}
                        </div>
                        {isOwnProfile && (
                          <button onClick={() => handleRemovePortfolio(item._id)} className="p-1 rounded-lg text-dark-600 hover:text-red-400 hover:bg-dark-800 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                          item.type === 'image' ? 'bg-sky-400/10 text-sky-400' :
                          item.type === 'video' ? 'bg-purple-400/10 text-purple-400' :
                          item.type === 'pdf' ? 'bg-red-400/10 text-red-400' :
                          'bg-gold-500/10 text-gold-500'
                        }`}>
                          {item.type}
                        </span>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-dark-500 hover:text-gold-500 flex items-center gap-1 transition-colors">
                          <ExternalLink className="h-3 w-3" /> View
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORGANIZATIONS */}
        {activeTab === 'organizations' && (
          <div className="space-y-4">
            {!userOrgs || userOrgs.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-white/10">
                <Building2 className="h-10 w-10 text-dark-600 mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-serif text-white mb-2">No organizations</h3>
                <p className="text-dark-500 text-xs">
                  {isOwnProfile ? 'Join an organization to get started.' : 'This user isn\'t part of any organizations.'}
                </p>
              </Card>
            ) : (
              userOrgs.map((org: any) => {
                const membership = memberships?.find((m: any) => m.orgId === org._id);
                return (
                  <Card key={org._id} className="p-4 hover:border-white/10 transition-colors cursor-pointer" onClick={() => navigate(`/org/${org._id}`)}>
                    <div className="flex items-center gap-4">
                      {org.logoUrl ? (
                        <img src={org.logoUrl} className="h-12 w-12 rounded-xl object-cover border border-white/10" alt="" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center font-serif text-gold-500 text-lg">{org.name?.[0]}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-white truncate">{org.name}</p>
                          {org.isVerified && <span className="text-gold-500">✓</span>}
                        </div>
                        <p className="text-[10px] text-dark-500 truncate">{org.description || 'Organization'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {membership && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-gold-500/10 text-gold-500 border border-gold-500/20">
                            {membership.role}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-dark-600" />
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {!userPosts || userPosts.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-white/10">
                <FileText className="h-10 w-10 text-dark-600 mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-serif text-white mb-2">No activity yet</h3>
                <p className="text-dark-500 text-xs">
                  {isOwnProfile ? 'Share your first post to get started.' : 'This user hasn\'t posted yet.'}
                </p>
              </Card>
            ) : (
              userPosts.map((post: any) => (
                <FeedPostCard key={post._id} post={post} isPublic />
              ))
            )}
          </div>
        )}

        {/* SOCIAL */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            {socialEntries.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-white/10">
                <Globe2 className="h-10 w-10 text-dark-600 mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-serif text-white mb-2">No links yet</h3>
                <p className="text-dark-500 text-xs">
                  {isOwnProfile ? 'Add your social links in Edit Profile.' : 'This user hasn\'t added any links.'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialEntries.map(([key, url]) => {
                  const Icon = SOCIAL_ICONS[key] ?? Globe;
                  const color = SOCIAL_COLORS[key] ?? 'text-dark-300 hover:bg-white/10';
                  const href = key === 'portfolio' || key === 'github'
                    ? (url.startsWith('http') ? url : `https://${url}`)
                    : key === 'twitter' ? `https://twitter.com/${url}`
                    : key === 'instagram' ? `https://instagram.com/${url}`
                    : key === 'linkedin' ? `https://linkedin.com/in/${url}`
                    : key === 'youtube' ? `https://youtube.com/@${url}`
                    : url;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-4 rounded-xl border border-white/5 transition-all ${color}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white capitalize">{key}</p>
                        <p className="text-[10px] text-dark-400 truncate">{url}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-dark-600 shrink-0" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Contact Info */}
            {(convexUser.email || convexUser.website) && (
              <Card className="p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 mb-3">Contact</h3>
                <div className="space-y-2">
                  {convexUser.email && (
                    <a href={`mailto:${convexUser.email}`} className="flex items-center gap-2 text-sm text-dark-200 hover:text-gold-500 transition-colors">
                      <Mail className="h-4 w-4 text-dark-500" /> {convexUser.email}
                    </a>
                  )}
                  {convexUser.website && (
                    <a href={convexUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-dark-200 hover:text-gold-500 transition-colors">
                      <Globe className="h-4 w-4 text-dark-500" /> {convexUser.website}
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
