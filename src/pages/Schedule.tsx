import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Search, Calendar, Clock, MapPin, Trophy, ArrowRight, ChevronDown, List, Grid3X3, Filter, Radio, Star, Users, Vote, Award, Target, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicNav } from '../components/navigation/PublicNav';

const categories = ['All', 'Entertainment', 'Corporate', 'Government', 'Non-Profit', 'Tech'];
const statuses = ['All', 'Upcoming', 'Nominations Open', 'Voting Live', 'Winners Announced'];
const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const scheduleData = [
  {
    id: 'headies',
    name: 'The 17th Headies',
    org: 'Headies Official',
    category: 'Entertainment',
    status: 'Voting Live',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
    location: 'Eko Convention Center, Lagos',
    dates: {
      nominationsOpen: '2026-03-01',
      nominationsClose: '2026-05-31',
      publicVoting: '2026-06-01',
      finalJudging: '2026-08-15',
      ceremony: '2026-09-04',
    },
    nextMilestone: 'Voting Ends',
    nextDate: '2026-08-31',
    categoriesCount: 24,
    nomineesCount: 120,
  },
  {
    id: 'oscars',
    name: 'Cinema Excellence Awards',
    org: 'Academy of Cinema',
    category: 'Entertainment',
    status: 'Nominations Open',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    location: 'Dolby Theatre, Los Angeles',
    dates: {
      nominationsOpen: '2026-04-01',
      nominationsClose: '2026-07-31',
      publicVoting: '2026-08-15',
      finalJudging: '2026-10-01',
      ceremony: '2026-11-15',
    },
    nextMilestone: 'Nominations Close',
    nextDate: '2026-07-31',
    categoriesCount: 18,
    nomineesCount: 90,
  },
  {
    id: 'banking',
    name: 'Global Banking Awards',
    org: 'Global Banking Association',
    category: 'Corporate',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800',
    location: 'Marina Bay Sands, Singapore',
    dates: {
      nominationsOpen: '2026-06-01',
      nominationsClose: '2026-08-31',
      publicVoting: '2026-09-15',
      finalJudging: '2026-11-01',
      ceremony: '2026-12-10',
    },
    nextMilestone: 'Nominations Open',
    nextDate: '2026-06-01',
    categoriesCount: 12,
    nomineesCount: 60,
  },
  {
    id: 'fintech',
    name: 'Fintech Innovation Awards',
    org: 'Tech Excellence Foundation',
    category: 'Tech',
    status: 'Voting Live',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    location: 'Virtual Event',
    dates: {
      nominationsOpen: '2026-02-01',
      nominationsClose: '2026-04-30',
      publicVoting: '2026-05-01',
      finalJudging: '2026-06-15',
      ceremony: '2026-07-20',
    },
    nextMilestone: 'Final Judging',
    nextDate: '2026-06-15',
    categoriesCount: 8,
    nomineesCount: 40,
  },
  {
    id: 'ngo',
    name: 'Impact Global Recognition',
    org: 'United Nations Foundation',
    category: 'Non-Profit',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800',
    location: 'Geneva, Switzerland',
    dates: {
      nominationsOpen: '2026-07-01',
      nominationsClose: '2026-09-30',
      publicVoting: '2026-10-15',
      finalJudging: '2026-11-30',
      ceremony: '2026-12-15',
    },
    nextMilestone: 'Nominations Open',
    nextDate: '2026-07-01',
    categoriesCount: 15,
    nomineesCount: 75,
  },
  {
    id: 'govt',
    name: 'National Honors GH',
    org: 'Government of Ghana',
    category: 'Government',
    status: 'Winners Announced',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
    location: 'Accra International Conference Center',
    dates: {
      nominationsOpen: '2025-10-01',
      nominationsClose: '2025-12-31',
      publicVoting: '2026-01-15',
      finalJudging: '2026-02-28',
      ceremony: '2026-03-15',
    },
    nextMilestone: 'Completed',
    nextDate: '2026-03-15',
    categoriesCount: 10,
    nomineesCount: 50,
  },
];

function getTimeRemaining(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 30) return `${Math.floor(days / 30)}mo ${days % 30}d`;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Voting Live': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    case 'Nominations Open': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    case 'Upcoming': return 'bg-gold-500/10 border-gold-500/20 text-gold-500';
    case 'Winners Announced': return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
    default: return 'bg-dark-800 border-white/10 text-dark-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Voting Live': return <Radio className="h-3 w-3" />;
    case 'Nominations Open': return <Target className="h-3 w-3" />;
    case 'Upcoming': return <Clock className="h-3 w-3" />;
    case 'Winners Announced': return <CheckCircle2 className="h-3 w-3" />;
    default: return <Calendar className="h-3 w-3" />;
  }
}

export function Schedule() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedStatus, setSelectedStatus] = React.useState('All');
  const [selectedMonth, setSelectedMonth] = React.useState('All Months');
  const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');

  const filtered = scheduleData.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.org.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus;
    const eventMonth = new Date(event.dates.ceremony).getMonth();
    const monthIndex = months.indexOf(selectedMonth);
    const matchesMonth = selectedMonth === 'All Months' || eventMonth === monthIndex - 1;
    return matchesSearch && matchesCategory && matchesStatus && matchesMonth;
  });

  const liveEvents = scheduleData.filter(e => e.status === 'Voting Live');
  const upcomingEvents = scheduleData.filter(e => e.status === 'Upcoming');
  const nominationEvents = scheduleData.filter(e => e.status === 'Nominations Open');

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero */}
        <div className="relative mb-12 sm:mb-20 text-center space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4"
          >
            <span className="h-px w-6 sm:w-8 bg-gold-500/50" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gold-500">Awards Calendar</span>
            <span className="h-px w-6 sm:w-8 bg-gold-500/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl font-serif text-white leading-[1] italic tracking-tighter"
          >
            Awards <span className="text-gold-500">Schedule.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-dark-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2"
          >
            Discover upcoming award ceremonies, nomination deadlines, voting periods, and winner announcements from around the world.
          </motion.p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {[
            { label: 'Live Now', value: liveEvents.length, icon: Radio, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Nominations Open', value: nominationEvents.length, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Upcoming', value: upcomingEvents.length, icon: Clock, color: 'text-gold-500', bg: 'bg-gold-500/10' },
            { label: 'Total Events', value: scheduleData.length, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-gold-500/20 transition-all">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-serif text-white italic">{stat.value}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-dark-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <input
                type="text"
                placeholder="Search awards..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white text-sm focus:border-gold-500/50 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm appearance-none outline-none focus:border-gold-500/50 transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {categories.map(c => <option key={c} value={c} className="bg-dark-950">{c}</option>)}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm appearance-none outline-none focus:border-gold-500/50 transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {statuses.map(s => <option key={s} value={s} className="bg-dark-950">{s}</option>)}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm appearance-none outline-none focus:border-gold-500/50 transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {months.map(m => <option key={m} value={m} className="bg-dark-950">{m}</option>)}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-dark-500 font-bold uppercase tracking-widest">{filtered.length} events found</p>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setViewMode('list')}
                className={`h-8 px-3 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === 'list' ? 'bg-gold-500 text-dark-950' : 'text-dark-400 hover:text-white'
                }`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`h-8 px-3 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === 'calendar' ? 'bg-gold-500 text-dark-950' : 'text-dark-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="h-3.5 w-3.5" /> Calendar
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4 sm:space-y-6">
            {filtered.map((event, i) => {
              const countdown = getTimeRemaining(event.nextDate);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-0 overflow-hidden border-white/5 hover:border-gold-500/20 transition-all group">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-72 lg:w-80 h-48 md:h-auto relative shrink-0">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-950/80 hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent md:hidden" />
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(event.status)}`}>
                            {getStatusIcon(event.status)}
                            {event.status}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{event.category}</span>
                            <span className="h-1 w-1 bg-dark-600 rounded-full" />
                            <span className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{event.org}</span>
                          </div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-white italic mb-3 group-hover:text-gold-500 transition-colors">{event.name}</h3>

                          {/* Dates Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
                            {[
                              { label: 'Noms Open', date: event.dates.nominationsOpen },
                              { label: 'Noms Close', date: event.dates.nominationsClose },
                              { label: 'Voting', date: event.dates.publicVoting },
                              { label: 'Judging', date: event.dates.finalJudging },
                              { label: 'Ceremony', date: event.dates.ceremony },
                            ].map((d) => (
                              <div key={d.label} className="bg-white/[0.02] border border-white/5 rounded-lg p-2">
                                <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest mb-0.5">{d.label}</p>
                                <p className="text-[11px] text-dark-300 font-medium">{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] text-dark-500">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                            <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-gold-500" /> {event.categoriesCount} Categories</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.nomineesCount} Nominees</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                          {countdown ? (
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                              </span>
                              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{event.nextMilestone} in {countdown}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Completed</span>
                          )}
                          <Link to={`/org/${event.id}`}>
                            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-dark-400 hover:text-gold-500 group/btn">
                              View Details <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-4">
                <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Calendar className="h-8 w-8 text-dark-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white mb-2 italic">No events found</h3>
                <p className="text-dark-500 text-xs sm:text-sm max-w-sm">Try adjusting your filters to discover more award events.</p>
                <Button variant="ghost" className="mt-6 text-[10px] font-bold uppercase tracking-widest text-gold-500" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); setSelectedMonth('All Months'); }}>Reset Filters</Button>
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((event, i) => {
              const countdown = getTimeRemaining(event.nextDate);
              const ceremonyDate = new Date(event.dates.ceremony);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-0 overflow-hidden border-white/5 hover:border-gold-500/20 transition-all group h-full flex flex-col">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          {event.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-[10px] text-dark-300">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">{event.category}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-serif text-white italic mb-3 group-hover:text-gold-500 transition-colors">{event.name}</h3>

                      {/* Ceremony Date */}
                      <div className="bg-gold-500/5 border border-gold-500/10 rounded-xl p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-gold-500 uppercase tracking-widest mb-0.5">Ceremony</p>
                            <p className="text-sm text-white font-medium">{ceremonyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          {countdown && (
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest mb-0.5">Countdown</p>
                              <p className="text-sm font-serif text-gold-500 italic font-bold">{countdown}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-dark-500 mb-4">
                        <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-gold-500" /> {event.categoriesCount} Categories</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.nomineesCount} Nominees</span>
                      </div>

                      <div className="mt-auto">
                        <Link to={`/org/${event.id}`}>
                          <Button variant="outline" className="w-full h-10 border-white/10 text-[10px] font-bold uppercase tracking-widest hover:border-gold-500/30 hover:text-gold-500">
                            View Details <ArrowRight className="h-3 w-3 ml-1.5" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Timeline Section */}
        <div className="mt-16 sm:mt-24">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white italic mb-3">Award Timeline</h2>
            <p className="text-dark-400 text-xs sm:text-sm">Major award events in chronological order.</p>
          </div>

          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-white/5 sm:-translate-x-px" />

            <div className="space-y-8 sm:space-y-12">
              {scheduleData
                .sort((a, b) => new Date(a.dates.ceremony).getTime() - new Date(b.dates.ceremony).getTime())
                .map((event, i) => {
                  const isLeft = i % 2 === 0;
                  const ceremonyDate = new Date(event.dates.ceremony);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative flex items-start gap-4 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                    >
                      {/* Dot */}
                      <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-gold-500 border-4 border-dark-950 -translate-x-1.5 sm:-translate-x-1.5 z-10 shrink-0 mt-1" />

                      {/* Spacer for mobile */}
                      <div className="w-8 sm:hidden shrink-0" />

                      {/* Content */}
                      <div className={`flex-1 sm:w-[calc(50%-2rem)] ${isLeft ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                        <Card className="p-4 sm:p-5 border-white/5 hover:border-gold-500/20 transition-all inline-block w-full">
                          <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${getStatusColor(event.status)}`}>
                              {getStatusIcon(event.status)}
                              {event.status}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-serif text-white italic mb-1">{event.name}</h4>
                          <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-2">{event.org}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gold-500 font-bold">
                            <Calendar className="h-3 w-3" />
                            {ceremonyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </Card>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-12 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-xs">
            <p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">The world's leading platform for award management, secure voting, and community recognition.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/discover" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Explore</Link>
            <Link to="/pricing" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Pricing</Link>
            <Link to="/resources" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors">Resources</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
