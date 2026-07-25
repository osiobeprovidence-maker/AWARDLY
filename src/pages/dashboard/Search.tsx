import React, { useState, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Search as SearchIcon, Users, Building2, Trophy, FileText, X, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'users' | 'organizations' | 'events' | 'posts';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'users', label: 'People', icon: Users },
  { key: 'organizations', label: 'Organizations', icon: Building2 },
  { key: 'events', label: 'Events', icon: Trophy },
  { key: 'posts', label: 'Posts', icon: FileText },
];

const RECENT_SEARCHES_KEY = 'awardly_recent_searches';

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  const searches = getRecentSearches().filter((s) => s !== q);
  searches.unshift(q);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 8)));
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [submitted, setSubmitted] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);

  const users = useQuery(
    api.users.queries.searchUsers,
    submitted ? { query: submitted } : 'skip'
  );
  const orgs = useQuery(
    api.organizations.queries.search,
    submitted ? { query: submitted } : 'skip'
  );
  const events = useQuery(
    api.events.queries.search,
    submitted ? { query: submitted } : 'skip'
  );

  const handleSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSubmitted(trimmed);
    saveRecentSearch(trimmed);
    setRecentSearches(getRecentSearches());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  const resultCounts: Record<Tab, number | undefined> = {
    users: users?.length,
    organizations: orgs?.length,
    events: events?.length,
    posts: undefined,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-serif text-white tracking-tight italic mb-2">Search</h1>
        <p className="text-dark-500 text-xs font-bold uppercase tracking-widest">
          Discover people, organizations, events, and posts
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full h-14 pl-12 pr-14 rounded-2xl bg-dark-900/80 border border-white/10 text-white text-sm placeholder:text-dark-500 focus:outline-none focus:border-gold-500/50 transition-all"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSubmitted(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-dark-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Recent Searches (show when no query) */}
      {!submitted && recentSearches.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-dark-500 uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Recent Searches
              </p>
              <button onClick={clearRecent} className="text-[11px] text-dark-600 hover:text-red-400 transition-colors">
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(s); handleSearch(s); }}
                  className="px-3 py-1.5 rounded-xl bg-dark-800/60 border border-white/5 text-xs text-dark-300 hover:text-gold-500 hover:border-gold-500/20 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {submitted && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 bg-dark-900/60 rounded-2xl p-1 border border-white/5 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count = resultCounts[tab.key];
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-gold-500/20 text-gold-500 border border-gold-500/20'
                      : 'text-dark-400 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {count !== undefined && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-gold-500/20' : 'bg-dark-800'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <Card>
            <CardContent className="p-0">
              {activeTab === 'users' && (
                <div>
                  {!users ? (
                    <div className="py-20 text-center">
                      <div className="h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-dark-400 text-xs">Searching people...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="py-20 text-center">
                      <Users className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                      <p className="text-dark-400 text-sm font-medium">No people found</p>
                      <p className="text-dark-600 text-[11px] mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    users.map((u) => (
                      <Link
                        key={u._id}
                        to={u.username ? `/u/${u.username}` : `/profile/${u.firebaseUid}`}
                        className="flex items-center gap-4 px-5 py-4 border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                      >
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} className="h-12 w-12 rounded-xl object-cover border border-white/10" alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold text-sm border border-gold-500/20">
                            {u.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{u.name}</p>
                          <p className="text-[11px] text-dark-500 truncate">
                            {u.headline || u.email}
                            {u.username && <span className="ml-2 text-dark-600">@{u.username}</span>}
                          </p>
                        </div>
                        {u.reputationScore ? (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">
                            {u.reputationScore} pts
                          </span>
                        ) : null}
                      </Link>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'organizations' && (
                <div>
                  {!orgs ? (
                    <div className="py-20 text-center">
                      <div className="h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-dark-400 text-xs">Searching organizations...</p>
                    </div>
                  ) : orgs.length === 0 ? (
                    <div className="py-20 text-center">
                      <Building2 className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                      <p className="text-dark-400 text-sm font-medium">No organizations found</p>
                      <p className="text-dark-600 text-[11px] mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    orgs.map((o) => (
                      <Link
                        key={o._id}
                        to={`/org/${o.slug}`}
                        className="flex items-center gap-4 px-5 py-4 border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                      >
                        {o.logoUrl ? (
                          <img src={o.logoUrl} className="h-12 w-12 rounded-xl object-cover border border-white/10" alt="" />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm border border-white/10"
                            style={{ backgroundColor: (o.primaryColor || '#D4AF37') + '20', color: o.primaryColor || '#D4AF37' }}
                          >
                            {o.name[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{o.name}</p>
                          <p className="text-[11px] text-dark-500 truncate">{o.description || 'No description'}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div>
                  {!events ? (
                    <div className="py-20 text-center">
                      <div className="h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-dark-400 text-xs">Searching events...</p>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="py-20 text-center">
                      <Trophy className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                      <p className="text-dark-400 text-sm font-medium">No events found</p>
                      <p className="text-dark-600 text-[11px] mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    events.map((e) => (
                      <Link
                        key={e._id}
                        to={`/events/${e._id}`}
                        className="flex items-center gap-4 px-5 py-4 border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                      >
                        {e.coverUrl ? (
                          <img src={e.coverUrl} className="h-12 w-12 rounded-xl object-cover border border-white/10" alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                            <Trophy className="h-5 w-5 text-gold-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{e.title}</p>
                          <p className="text-[11px] text-dark-500 truncate">{e.description || 'No description'}</p>
                        </div>
                        {e.date && (
                          <span className="text-[10px] text-dark-500 whitespace-nowrap">
                            {new Date(e.date).toLocaleDateString()}
                          </span>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="py-20 text-center">
                  <FileText className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-400 text-sm font-medium">Community posts search</p>
                  <p className="text-dark-600 text-[11px] mt-1 max-w-xs mx-auto">
                    Posts are searched within individual organizations. Visit an organization's feed to search posts.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state when no query */}
      {!submitted && (
        <div className="py-16 text-center">
          <TrendingUp className="h-12 w-12 text-dark-700 mx-auto mb-4" />
          <p className="text-dark-400 text-sm font-medium mb-1">Start typing to search</p>
          <p className="text-dark-600 text-[11px]">
            Find people, organizations, and events across the platform
          </p>
        </div>
      )}
    </div>
  );
}
