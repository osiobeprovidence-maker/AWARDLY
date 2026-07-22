import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Trophy, Users, Star, ArrowRight, ShieldCheck, Globe, Radio, Filter, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { headiesLogo, awardStage } from '../data';
import { PublicNav } from '../components/navigation/PublicNav';

const categories = ['All', 'Entertainment', 'Corporate', 'Government', 'Non-Profit', 'Tech'];

const hubs = [
  { id: 'headies', name: 'Headies Official', category: 'Entertainment', followers: '1.4M', events: '14 Active', rating: 4.9, image: headiesLogo, isLive: true },
  { id: 'banking', name: 'Global Banking Awards', category: 'Corporate', followers: '450K', events: '2 Active', rating: 4.8, image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800', isLive: false },
  { id: 'oscars', name: 'Cinema Excellence', category: 'Entertainment', followers: '5.2M', events: '1 Active', rating: 5.0, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', isLive: true },
  { id: 'un-sdg', name: 'Impact Global', category: 'Non-Profit', followers: '890K', events: '8 Active', rating: 4.7, image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800', isLive: false },
  { id: 'fintech', name: 'Fintech Innovators', category: 'Tech', followers: '120K', events: '1 Active', rating: 4.6, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', isLive: false },
  { id: 'govt-gh', name: 'National Honors GH', category: 'Government', followers: '2.1M', events: '4 Active', rating: 4.8, image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800', isLive: true },
];

export function Discover() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHubs = hubs.filter(hub => {
    const matchesCategory = selectedCategory === 'All' || hub.category === selectedCategory;
    const matchesSearch = hub.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark-950 font-sans">
      <PublicNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Cinematic Header */}
        <div className="relative mb-12 sm:mb-20 lg:mb-24 text-center space-y-4 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4"
          >
             <span className="h-px w-6 sm:w-8 bg-gold-500/50" />
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gold-500">The Global Stage</span>
             <span className="h-px w-6 sm:w-8 bg-gold-500/50" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1] italic tracking-tighter"
          >
            Explore <span className="text-gold-500 italic">Excellence.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-dark-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2"
          >
            Connect with the world's most prestigious honor societies and participate in the legacy of achievement.
          </motion.p>
        </div>

        {/* Global Live Bar */}
        <div className="mb-10 sm:mb-16 bg-dark-900/60 border border-white/5 rounded-2xl sm:rounded-[32px] overflow-hidden">
          <div className="flex flex-col sm:flex-row items-stretch">
            {/* Live Header */}
            <div className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-0 sm:h-14 bg-red-600/10 border-b sm:border-b-0 sm:border-r border-red-600/20 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Live</span>
              <span className="h-3 w-px bg-red-500/20" />
              <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">3 Events</span>
            </div>

            {/* Scrolling Ticker */}
            <div className="flex-1 overflow-hidden min-h-[44px] sm:min-h-[48px] flex items-center relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-dark-900/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-dark-900/80 to-transparent z-10 pointer-events-none" />
              <div className="flex animate-ticker whitespace-nowrap">
                {[
                  { event: 'HEADIES 2026', text: 'nominations close in 12 minutes' },
                  { event: 'OSCARS', text: 'public voting ends today' },
                  { event: 'TECH EXCELLENCE', text: 'voting is now open' },
                  { event: 'GRAMMY FAN CHOICE', text: 'has reached 2M votes' },
                  { event: 'CORPORATE AWARDS', text: 'finalists announced' },
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center text-[11px] sm:text-xs text-dark-300 font-medium">
                    <span className="text-gold-500 font-bold">{item.event}</span>
                    <span className="mx-1.5 text-dark-600">•</span>
                    <span>{item.text}</span>
                    <span className="mx-4 sm:mx-6 text-dark-700">|</span>
                  </span>
                ))}
                {[
                  { event: 'HEADIES 2026', text: 'nominations close in 12 minutes' },
                  { event: 'OSCARS', text: 'public voting ends today' },
                  { event: 'TECH EXCELLENCE', text: 'voting is now open' },
                  { event: 'GRAMMY FAN CHOICE', text: 'has reached 2M votes' },
                  { event: 'CORPORATE AWARDS', text: 'finalists announced' },
                ].map((item, i) => (
                  <span key={`dup-${i}`} className="inline-flex items-center text-[11px] sm:text-xs text-dark-300 font-medium">
                    <span className="text-gold-500 font-bold">{item.event}</span>
                    <span className="mx-1.5 text-dark-600">•</span>
                    <span>{item.text}</span>
                    <span className="mx-4 sm:mx-6 text-dark-700">|</span>
                  </span>
                ))}
              </div>
            </div>

            {/* View Schedule */}
            <div className="flex items-center px-4 sm:px-6 py-3 sm:py-0 sm:h-14 border-t sm:border-t-0 sm:border-l border-white/5 shrink-0">
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-400 hover:text-gold-500 transition-colors group">
                View Schedule
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Selection */}
        <div className="space-y-4 sm:space-y-8 mb-10 sm:mb-16">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
             <div className="flex-1 relative">
                <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-dark-500" />
                <input 
                  type="text"
                  placeholder="Search hubs..." 
                  className="w-full h-12 sm:h-14 lg:h-16 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl pl-12 sm:pl-16 pr-4 text-white text-sm focus:border-gold-500/50 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button variant="outline" className="h-12 sm:h-14 lg:h-16 px-6 sm:px-8 rounded-xl sm:rounded-2xl border-white/10 flex items-center justify-center gap-3 shrink-0">
                <Filter className="h-4 w-4" /> 
                <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
             </Button>
          </div>
          
          <div className="hidden sm:flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap shrink-0 ${
                  selectedCategory === cat 
                ? 'bg-gold-500 text-dark-950 shadow-xl shadow-gold-500/20' 
                : 'bg-white/5 text-dark-400 border border-white/10 hover:border-gold-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sm:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm font-bold uppercase tracking-widest appearance-none outline-none focus:border-gold-500/50 transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-950 text-white">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Tier Spotlight */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="mb-12 sm:mb-20 lg:mb-24">
             <Card className="aspect-video sm:aspect-[21/9] p-0 overflow-hidden relative group cursor-pointer border-gold-500/20">
                 <img src={awardStage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Featured" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                   <span className="px-2 sm:px-3 py-1 bg-gold-500 text-dark-950 text-[8px] font-black uppercase tracking-widest rounded mb-2 sm:mb-4 inline-block">Featured</span>
                   <h3 className="text-xl sm:text-2xl lg:text-4xl font-serif text-white italic mb-1 sm:mb-2">The 17th Headies</h3>
                   <p className="text-dark-300 text-xs sm:text-sm max-w-md hidden sm:block">Global recognition for the brightest stars in African music. Voting is now live.</p>
                   <Link to="/org/headies">
                      <Button className="mt-3 sm:mt-6 px-6 sm:px-10 h-10 sm:h-12 rounded-xl uppercase text-[10px] font-black tracking-widest">Enter Portal</Button>
                   </Link>
                </div>
             </Card>
          </div>
        )}

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
          {filteredHubs.length > 0 ? (
            filteredHubs.map((hub, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={hub.id}
                className="group"
              >
                <Link to={`/org/${hub.id}`}>
                  <Card className="p-0 overflow-hidden border-white/5 group-hover:border-gold-500/30 transition-all duration-700 bg-dark-950 rounded-2xl sm:rounded-[32px] h-full flex flex-col">
                    <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-1000">
                      <img 
                        src={hub.image} 
                        alt={hub.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                      {hub.isLive && (
                        <div className="absolute top-3 sm:top-6 left-3 sm:left-6">
                           <span className="px-2 sm:px-3 py-1 bg-red-600 text-[9px] sm:text-[10px] font-black text-white rounded-full flex items-center uppercase tracking-widest shadow-xl">
                              <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-1.5 sm:mr-2" /> Live
                           </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3 sm:mb-6 gap-2">
                         <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                               <h3 className="text-base sm:text-xl lg:text-2xl font-serif text-white italic transition-colors tracking-tight group-hover:text-gold-500 truncate">{hub.name}</h3>
                               <ShieldCheck className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-sky-400/50 shrink-0" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">{hub.category}</span>
                         </div>
                         <div className="flex items-center gap-1 sm:gap-1.5 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/5 shrink-0">
                            <Star className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-gold-500 fill-gold-500" />
                            <span className="text-[10px] sm:text-xs font-bold text-white">{hub.rating}</span>
                         </div>
                      </div>
                      
                      <div className="mt-auto pt-4 sm:pt-6 lg:pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-4 sm:gap-6">
                            <div>
                               <p className="text-[7px] sm:text-[8px] font-bold text-dark-600 uppercase tracking-widest mb-0.5 sm:mb-1">Followers</p>
                               <p className="text-white text-[11px] sm:text-xs font-bold">{hub.followers}</p>
                            </div>
                            <div>
                               <p className="text-[7px] sm:text-[8px] font-bold text-dark-600 uppercase tracking-widest mb-0.5 sm:mb-1">Events</p>
                               <p className="text-gold-500 text-[11px] sm:text-xs font-bold">{hub.events}</p>
                            </div>
                         </div>
                         <div className="h-8 sm:h-9 lg:h-10 w-8 sm:w-9 lg:w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-dark-950 transition-all">
                            <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 sm:py-40 text-center px-4">
               <div className="h-16 sm:h-24 w-16 sm:w-24 bg-white/5 rounded-2xl sm:rounded-[32px] flex items-center justify-center mb-6 sm:mb-8 border border-white/5">
                 <Search className="h-7 sm:h-10 w-7 sm:w-10 text-dark-600" />
               </div>
               <h3 className="text-xl sm:text-3xl font-serif text-white mb-2 sm:mb-3 italic">No results found.</h3>
               <p className="text-dark-500 text-xs sm:text-sm max-w-sm">We couldn't find any hubs matching your criteria. Try broadening your search.</p>
               <Button variant="ghost" className="mt-6 sm:mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-gold-500" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Reset</Button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-12 mt-16 sm:mt-24">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
            <div className="space-y-4 sm:space-y-6 max-w-xs">
              <BrandLogo />
              <p className="text-[10px] sm:text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">Decentralized recognition for global excellence.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12">
               {['Platform', 'Connect', 'Resources', 'Identity'].map(col => (
                 <div key={col} className="space-y-3 sm:space-y-4">
                    <h5 className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">{col}</h5>
                    <ul className="space-y-2 sm:space-y-3 text-[9px] sm:text-[10px] uppercase tracking-widest text-dark-500">
                       <li className="hover:text-gold-500 transition-colors cursor-pointer">Directory</li>
                       <li className="hover:text-gold-500 transition-colors cursor-pointer">Live Events</li>
                       <li className="hover:text-gold-500 transition-colors cursor-pointer">Governance</li>
                    </ul>
                 </div>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
}
