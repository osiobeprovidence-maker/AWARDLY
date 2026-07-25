import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, LayoutDashboard, FileText, Users, Target, Palette, Settings2, Activity,
  TrendingUp, Award, Star, ChevronRight, Eye, EyeOff, GripVertical,
  Plus, Edit3, Save, CheckCircle2, Vote, Globe, ArrowUpRight,
  Search, ChevronDown, Check, Shield, Hash, Clock, Flame
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rules', label: 'Rules', icon: FileText },
  { id: 'nominees', label: 'Nominees', icon: Users },
  { id: 'criteria', label: 'Criteria', icon: Target },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'settings', label: 'Settings', icon: Settings2 },
] as const;

export function CategoryDetail() {
  const { eventId, categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const category = useQuery(
    api.categories.queries.getById,
    categoryId ? { categoryId: categoryId as any } : 'skip'
  );
  const allCategories = useQuery(
    api.categories.queries.getByEvent,
    eventId ? { eventId: eventId as any } : 'skip'
  ) ?? [];
  const nominees = useQuery(
    api.nominees.queries.getByCategory,
    category ? { categoryId: category._id } : 'skip'
  ) ?? [];

  const [settings, setSettings] = React.useState({
    enabled: true,
    displayOrder: 1,
    visibility: 'public' as 'public' | 'private',
    minNominees: 3,
    maxNominees: 20,
  });

  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
  const [categorySearch, setCategorySearch] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredCategories = allCategories.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
        setCategorySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs />
        <Card className="border-dashed border-2 border-white/5 bg-dark-900/40">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-dark-800 flex items-center justify-center">
              <Award className="h-10 w-10 text-dark-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-white italic">Category Not Found</h2>
              <p className="text-sm text-dark-400">The category you are looking for does not exist or has been removed.</p>
            </div>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVotes = nominees.reduce((acc, n) => acc + n.voteCount, 0);
  const avgScore = nominees.length ? (totalVotes / nominees.length / 1000).toFixed(1) : '0';
  const sortedNominees = [...nominees].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl py-6 -mt-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-3.5 w-3.5 text-gold-500" />
              <span className="text-[9px] font-bold text-gold-500 uppercase tracking-[0.2em]">Category Detail</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif text-white tracking-tight italic">
              {category.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Category Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/30 transition-colors text-sm text-white"
            >
              <Award className="h-3.5 w-3.5 text-gold-500" />
              <span className="max-w-[140px] truncate">{category.name}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-dark-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {categoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2 border-b border-white/5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-500" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full h-8 bg-dark-950 border border-white/5 rounded-lg pl-8 pr-3 text-xs text-white placeholder:text-dark-500 outline-none focus:border-gold-500/30"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          navigate(`/dashboard/events/${cat.eventId}/categories/${cat._id}`);
                          setCategoryDropdownOpen(false);
                          setCategorySearch('');
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                          cat._id === category?._id
                            ? 'bg-gold-500/10 text-gold-500'
                            : 'text-dark-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Award className="h-3 w-3 shrink-0" />
                        <span className="truncate flex-1 text-left">{cat.name}</span>
                        {cat._id === category?._id && <Check className="h-3 w-3 shrink-0" />}
                      </button>
                    ))}
                    {filteredCategories.length === 0 && (
                      <p className="text-xs text-dark-500 text-center py-4">No categories found</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            category.rulesSource === 'custom'
              ? 'bg-gold-500/10 border-gold-500/20 text-gold-500'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
          }`}>
            {category.rulesSource === 'custom' ? 'Custom Rules' : 'Global Rules'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* ==================== OVERVIEW TAB ==================== */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-gold-500/30 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                    <Vote className="h-6 w-6 text-gold-500" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-dark-500 group-hover:text-gold-500 transition-colors" />
                </div>
                <div>
                  <p className="text-3xl font-serif text-white italic">{totalVotes.toLocaleString()}</p>
                  <p className="text-[10px] text-dark-400 uppercase tracking-widest mt-1">Total Votes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-gold-500/30 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-dark-500 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div>
                  <p className="text-3xl font-serif text-white italic">{nominees.length}</p>
                  <p className="text-[10px] text-dark-400 uppercase tracking-widest mt-1">Nominees</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-gold-500/30 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-dark-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div>
                  <p className="text-3xl font-serif text-white italic">{avgScore}k</p>
                  <p className="text-[10px] text-dark-400 uppercase tracking-widest mt-1">Avg Score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Name</label>
                  <p className="text-white font-medium">{category.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Type</label>
                  <p className="text-white font-medium capitalize">{category.rulesSource === 'global' ? 'Hybrid (Public + Jury)' : 'Custom Strategy'}</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Description</label>
                  <p className="text-dark-400 text-sm leading-relaxed">{category.description || 'No description provided.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <Activity className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                <p className="text-sm text-dark-400">No activity yet</p>
                <p className="text-xs text-dark-500 mt-1">Changes to this category will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== RULES TAB ==================== */}
        <TabsContent value="rules" className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Voting Rules</CardTitle>
                  <p className="text-sm text-dark-400 mt-1">
                    {category.rulesSource === 'global'
                      ? 'This category follows the global event rules.'
                      : 'This category uses a custom voting strategy.'}
                  </p>
                </div>
                <Button onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/rules`)}>
                  <Edit3 className="h-4 w-4 mr-2" /> Edit Rules
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Voting Method', value: 'Hybrid (Public + Jury)', icon: Vote, color: 'text-gold-500' },
                { label: 'Public Voting', value: 'Enabled', icon: Globe, color: 'text-emerald-500' },
                { label: 'Jury Voting', value: 'Enabled', icon: Shield, color: 'text-blue-500' },
                { label: 'Max Votes per User', value: 'Unlimited', icon: Hash, color: 'text-purple-500' },
                { label: 'Vote Cooldown', value: 'None', icon: Clock, color: 'text-orange-500' },
                { label: 'Voting Period', value: 'Not set', icon: Flame, color: 'text-rose-500' },
              ].map((rule, i) => {
                const Icon = rule.icon;
                return (
                  <motion.div
                    key={rule.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${rule.color}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">{rule.label}</p>
                        <p className="text-sm text-white font-medium mt-0.5">{rule.value}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-dark-600" />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== NOMINEES TAB ==================== */}
        <TabsContent value="nominees" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif text-white italic">{nominees.length} Nominees</h3>
              <p className="text-xs text-dark-400 mt-1">Manage the nominees registered in this category.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/nominees`)}>
                <Users className="h-4 w-4 mr-2" /> Manage Nominees
              </Button>
              <Button onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/nominees`)}>
                <Plus className="h-4 w-4 mr-2" /> Add Nominee
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {sortedNominees.map((nominee, i) => (
              <motion.div
                key={nominee._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-dark-900/40 border border-white/5 hover:border-gold-500/30 transition-all"
              >
                <span className="text-[10px] font-black text-dark-500 w-6 text-center shrink-0">
                  #{i + 1}
                </span>
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  {nominee.imageUrl ? (
                    <img src={nominee.imageUrl} alt={nominee.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-dark-800 flex items-center justify-center">
                      <Users className="h-5 w-5 text-dark-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{nominee.name}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest">Nominee #{i + 1}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-serif text-gold-500 italic">{nominee.voteCount.toLocaleString()}</p>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest">votes</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button variant="glass" size="icon" className="h-9 w-9">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
            {nominees.length === 0 && (
              <Card className="border-dashed border-2 border-white/5">
                <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
                  <Users className="h-10 w-10 text-dark-500" />
                  <p className="text-sm text-dark-400">No nominees in this category yet.</p>
                  <Button size="sm" onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/nominees`)}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add First Nominee
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ==================== CRITERIA TAB ==================== */}
        <TabsContent value="criteria" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif text-white italic">Judging Criteria</h3>
              <p className="text-xs text-dark-400 mt-1">Define how judges score nominees in this category.</p>
            </div>
            <Button onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/criteria`)}>
              <Edit3 className="h-4 w-4 mr-2" /> Manage Criteria
            </Button>
          </div>

          <Card className="border-dashed border-2 border-white/5">
            <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
              <Target className="h-10 w-10 text-dark-500" />
              <p className="text-sm text-dark-400">No criteria defined yet.</p>
              <Button size="sm" onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/criteria`)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add First Criterion
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== BRANDING TAB ==================== */}
        <TabsContent value="branding" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif text-white italic">Category Branding</h3>
              <p className="text-xs text-dark-400 mt-1">Customize the visual identity of this category.</p>
            </div>
            <Button onClick={() => navigate(`/dashboard/events/${eventId}/categories/${categoryId}/branding`)}>
              <Edit3 className="h-4 w-4 mr-2" /> Manage Branding
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Banner Preview */}
            <Card className="hover:border-gold-500/30 transition-all">
              <CardHeader>
                <CardTitle className="text-sm">Banner Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/1] rounded-xl bg-gradient-to-br from-gold-500/20 via-dark-900 to-rose-500/10 border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="text-center space-y-2 p-4">
                    <Star className="h-8 w-8 text-gold-500 mx-auto" />
                    <p className="text-sm font-serif text-white italic">{category.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Theme */}
            <Card className="hover:border-gold-500/30 transition-all">
              <CardHeader>
                <CardTitle className="text-sm">Color Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gold-500 border-2 border-gold-400 shadow-lg shadow-gold-500/20" />
                  <div>
                    <p className="text-xs text-white font-medium">Primary Accent</p>
                    <p className="text-[10px] text-dark-500 uppercase tracking-widest">#C68A35</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gold-500" />
                  <div className="h-8 w-8 rounded-lg bg-dark-900 border border-white/10" />
                  <div className="h-8 w-8 rounded-lg bg-dark-950 border border-white/10" />
                  <div className="h-8 w-8 rounded-lg bg-white" />
                </div>
              </CardContent>
            </Card>

            {/* Icon Preview */}
            <Card className="hover:border-gold-500/30 transition-all">
              <CardHeader>
                <CardTitle className="text-sm">Category Icon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  <Award className="h-10 w-10 text-gold-500" />
                </div>
              </CardContent>
            </Card>

            {/* Theme */}
            <Card className="hover:border-gold-500/30 transition-all">
              <CardHeader>
                <CardTitle className="text-sm">Theme Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-white font-medium">Dark Premium</p>
                  <p className="text-[10px] text-dark-500 mt-1">Gold accents on dark surfaces for a luxury feel.</p>
                </div>
                <div className="flex gap-2">
                  {['Dark Premium', 'Minimal Light', 'Neon'].map(theme => (
                    <div
                      key={theme}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        theme === 'Dark Premium'
                          ? 'bg-gold-500/10 border-gold-500/30 text-gold-500'
                          : 'bg-white/5 border-white/10 text-dark-500'
                      }`}
                    >
                      {theme}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== SETTINGS TAB ==================== */}
        <TabsContent value="settings" className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif text-white italic">Category Settings</h3>
              <p className="text-xs text-dark-400 mt-1">Configure display and visibility options.</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${settings.enabled ? 'bg-emerald-500/10' : 'bg-dark-800'}`}>
                    <CheckCircle2 className={`h-5 w-5 ${settings.enabled ? 'text-emerald-500' : 'text-dark-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Enable Category</p>
                    <p className="text-[10px] text-dark-500">Allow this category to be visible and active.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${settings.enabled ? 'bg-emerald-500' : 'bg-dark-800'}`}
                >
                  <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${settings.enabled ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {/* Display Order */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center">
                    <GripVertical className="h-5 w-5 text-dark-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Display Order</p>
                    <p className="text-[10px] text-dark-500">Set the position of this category in the list.</p>
                  </div>
                </div>
                <input
                  type="number"
                  value={settings.displayOrder}
                  onChange={e => setSettings(s => ({ ...s, displayOrder: Number(e.target.value) }))}
                  className="w-20 h-9 bg-dark-800 border border-white/10 rounded-lg text-center text-white text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                />
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center">
                    {settings.visibility === 'public' ? (
                      <Eye className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Visibility</p>
                    <p className="text-[10px] text-dark-500">Control who can see this category.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, visibility: s.visibility === 'public' ? 'private' : 'public' }))}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border cursor-pointer transition-colors ${
                    settings.visibility === 'public'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                  }`}
                >
                  {settings.visibility}
                </button>
              </div>

              {/* Min/Max Nominees */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center">
                      <Users className="h-5 w-5 text-dark-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Min Nominees</p>
                      <p className="text-[10px] text-dark-500">Minimum required nominees.</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={settings.minNominees}
                    onChange={e => setSettings(s => ({ ...s, minNominees: Number(e.target.value) }))}
                    className="w-full h-9 bg-dark-800 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center">
                      <Users className="h-5 w-5 text-dark-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Max Nominees</p>
                      <p className="text-[10px] text-dark-500">Maximum allowed nominees.</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={settings.maxNominees}
                    onChange={e => setSettings(s => ({ ...s, maxNominees: Number(e.target.value) }))}
                    className="w-full h-9 bg-dark-800 border border-white/10 rounded-lg px-3 text-white text-sm outline-none focus:ring-1 focus:ring-gold-500/50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <Button onClick={() => toast('Settings saved successfully.', 'success')}>
                  <Save className="h-4 w-4 mr-2" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
