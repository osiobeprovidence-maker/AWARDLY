import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Trophy, Users, Star, ArrowRight, ShieldCheck, Globe, Radio, Sparkles, TrendingUp, Filter, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { headiesLogo, awardStage } from '../data';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const filteredHubs = hubs.filter(hub => {
    const matchesCategory = selectedCategory === 'All' || hub.category === selectedCategory;
    const matchesSearch = hub.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark-950 font-sans pb-32">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-white/5 bg-dark-950/80 backdrop-blur-2xl sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center group">
          <BrandLogo />
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link 
            to="/discover" 
            className="text-xs font-bold uppercase tracking-[0.2em] transition-colors text-gold-500"
          >
            Explore
          </Link>
        </div>

        <div className="flex items-center gap-6">
           <Link to="/auth/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-dark-300 hover:text-white transition-colors">Log In</Link>
           <Link to="/auth/signup" className="hidden sm:block bg-gold-500 text-dark-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20">Get Started</Link>
           
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white"
           >
             {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-dark-950/95 backdrop-blur-xl pt-24 px-6">
              <div className="flex flex-col gap-6">
                <Link 
                  to="/discover" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-white italic tracking-tight"
                >
                  Explore
                </Link>
                <div className="h-px w-full bg-white/5 my-4" />
                <Link to="/auth/login" className="text-lg font-bold uppercase tracking-widest text-gold-500">Log In</Link>
                <Link to="/auth/signup" className="text-lg font-bold uppercase tracking-widest text-white">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Cinematic Header */}
        <div className="relative mb-24 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
             <span className="h-px w-8 bg-gold-500/50" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-500">The Global Stage</span>
             <span className="h-px w-8 bg-gold-500/50" />
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
            className="text-dark-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Connect with the world's most prestigious honor societies and participate in the legacy of achievement.
          </motion.p>
        </div>

        {/* Global Live Bar */}
        <div className="mb-16 bg-white/5 border border-white/5 rounded-[32px] p-2 flex flex-col md:flex-row items-center gap-4 group">
           <div className="flex items-center gap-4 px-6 py-3 bg-red-600/10 border border-red-600/20 rounded-[24px] shrink-0">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">3 Broadcasts Live</span>
           </div>
           <div className="flex-1 px-4 overflow-hidden">
              <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
                 {[1,2,3,4].map(i => (
                    <span key={i} className="text-xs text-dark-300 font-medium whitespace-nowrap inline-block mr-8">
                       <span className="text-gold-500">HEADIES 2026:</span> Main Stage Performance starting in 12m • <span className="text-white">OSCARS:</span> Preliminary Voting ends today
                    </span>
                 ))}
              </div>
           </div>
           <Button variant="ghost" className="px-8 rounded-[24px] text-[10px] font-bold uppercase tracking-widest hidden md:flex">View Schedule</Button>
        </div>

        {/* Search & Selection */}
        <div className="space-y-8 mb-16 px-2">
          <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-500 group-hover:text-gold-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search organizations, events, or categories..." 
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-16 text-white text-sm focus:border-gold-500/50 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/10 flex items-center gap-3">
                <Filter className="h-4 w-4" /> 
                <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
             </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat 
                ? 'bg-gold-500 text-dark-950 shadow-xl shadow-gold-500/20' 
                : 'bg-white/5 text-dark-400 border border-white/10 hover:border-gold-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top Tier Spotlight */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card className="aspect-[21/9] p-0 overflow-hidden relative group cursor-pointer border-gold-500/20">
                 <img src={awardStage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Featured" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                   <span className="px-3 py-1 bg-gold-500 text-dark-950 text-[8px] font-black uppercase tracking-widest rounded mb-4 inline-block">Featured Awards Hub</span>
                   <h3 className="text-2xl sm:text-4xl font-serif text-white italic mb-2">The 17th Headies</h3>
                   <p className="text-dark-300 text-xs sm:text-sm max-w-md">Global recognition for the brightest stars in African music. Voting is now live across all categories.</p>
                   <Link to="/org/headies">
                      <Button className="mt-6 px-10 h-12 rounded-xl uppercase text-[10px] font-black tracking-widest">Enter Portal</Button>
                   </Link>
                </div>
             </Card>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Card className="bg-dark-900 border-white/5 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-all">
                   <TrendingUp className="h-8 w-8 text-gold-500 mb-6" />
                   <div>
                      <h4 className="text-white font-serif text-xl mb-2 italic tracking-tight uppercase">Trending Votes</h4>
                      <p className="text-dark-500 text-xs leading-relaxed uppercase tracking-widest font-bold">Cinema Excellence Hub: Best Director has reached 450k votes today.</p>
                   </div>
                </Card>
                <Card className="bg-dark-900 border-white/5 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-all">
                   <Sparkles className="h-8 w-8 text-gold-500 mb-6" />
                   <div>
                      <h4 className="text-white font-serif text-xl mb-2 italic tracking-tight uppercase">New Excellence</h4>
                      <p className="text-dark-500 text-xs leading-relaxed uppercase tracking-widest font-bold">Fintech Innovators just updated their nomination list for 2026.</p>
                   </div>
                </Card>
             </div>
          </div>
        )}

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                  <Card className="p-0 overflow-hidden border-white/5 group-hover:border-gold-500/30 transition-all duration-700 bg-dark-950 rounded-[32px] h-full flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-1000">
                      <img 
                        src={hub.image} 
                        alt={hub.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                      {hub.isLive && (
                        <div className="absolute top-6 left-6">
                           <span className="px-3 py-1 bg-red-600 text-[10px] font-black text-white rounded-full flex items-center uppercase tracking-widest shadow-xl">
                              <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-2" /> Live Now
                           </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-2xl font-serif text-white italic transition-colors uppercase tracking-tight group-hover:text-gold-500">{hub.name}</h3>
                              <ShieldCheck className="h-4 w-4 text-sky-400/50" />
                            </div>
                            <span className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.3em]">{hub.category} Hub</span>
                         </div>
                         <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <Star className="h-3 w-3 text-gold-500 fill-gold-500" />
                            <span className="text-xs font-bold text-white">{hub.rating}</span>
                         </div>
                      </div>
                      
                      <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div>
                               <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest mb-1">Followers</p>
                               <p className="text-white text-xs font-bold">{hub.followers}</p>
                            </div>
                            <div>
                               <p className="text-[8px] font-bold text-dark-600 uppercase tracking-widest mb-1">Hiring Status</p>
                               <p className="text-gold-500 text-xs font-bold">Active</p>
                            </div>
                         </div>
                         <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-dark-950 transition-all">
                            <ArrowRight className="h-5 w-5" />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-40 text-center">
               <div className="h-24 w-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/5">
                 <Search className="h-10 w-10 text-dark-600" />
               </div>
               <h3 className="text-3xl font-serif text-white mb-3 italic">Threshold reached.</h3>
               <p className="text-dark-500 text-sm max-w-sm">We couldn't find any hubs matching your current criteria. Broaden your horizons.</p>
               <Button variant="ghost" className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-gold-500" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Reset Explorer</Button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 py-24 px-12 mt-24">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6 max-w-xs">
              <BrandLogo />
              <p className="text-xs text-dark-500 leading-relaxed uppercase tracking-widest font-bold">Decentralized recognition for global excellence. Built for communities who celebrate their best.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
               {['Platform', 'Connect', 'Resources', 'Identity'].map(col => (
                 <div key={col} className="space-y-4">
                    <h5 className="text-white text-xs font-bold uppercase tracking-widest">{col}</h5>
                    <ul className="space-y-3 text-[10px] uppercase tracking-widest text-dark-500">
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
