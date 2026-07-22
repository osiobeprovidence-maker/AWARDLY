import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockEvents, mockCategories, mockNominees, mockOrganizations } from '../../data';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { 
  ArrowLeft, Clock, Info, ShieldCheck, Trophy, CreditCard, 
  ChevronRight, Share2, Sparkles, TrendingUp, Zap, MousePointer2
} from 'lucide-react';

export function EventDetails() {
  const { eventId, orgId } = useParams();
  const event = mockEvents.find(e => e.id === eventId) || mockEvents[0];
  const org = mockOrganizations.find(o => o.slug === (orgId || '')) || mockOrganizations.find(o => o.id === (orgId || event.orgId));
  const categories = mockCategories.filter(c => c.eventId === event.id);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const nominees = mockNominees.filter(n => n.categoryId === activeCategory);
  
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('10');
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const packagePrices: Record<string, number> = {
    '10': 2500,
    '50': 10000,
    '100': 18000
  };

  const handleVote = () => {
    setIsVoting(true);
    setTimeout(() => {
      setIsVoting(false);
      setSelectedNominee(null);
    }, 2000);
  };

  return (
    <div className="w-full flex-1 bg-dark-950 pb-32">
      {/* Cinematic Hero */}
      <div className="relative h-[40vh] sm:h-[60vh] w-full overflow-hidden">
        {event.coverUrl && (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={event.coverUrl} 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="event cover" 
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-16 z-10">
          <Link to={`/org/${org?.slug || org?.id}`} className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-dark-400 hover:text-white mb-8 transition-colors group">
            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-gold-500/10 transition-colors">
               <ArrowLeft className="h-4 w-4" />
            </div>
            Back to {org?.name} Hub
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
               <div className="px-4 py-1 bg-gold-500 text-dark-950 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gold-500/20">
                  Broadcast Live
               </div>
               <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Clock className="h-3 w-3" /> Ends in 12:45:02
               </div>
            </div>
            
            <h1 className="text-3xl sm:text-7xl lg:text-8xl font-serif text-white tracking-tighter italic leading-[0.9]">
              {event.title}
            </h1>
            
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pt-4">
               <div className="grid grid-cols-2 md:flex flex-wrap items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2 md:gap-3">
                     <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <Trophy className="h-4 w-4 md:h-5 md:w-5 text-gold-500" />
                     </div>
                     <div>
                        <p className="text-[7px] md:text-[8px] font-bold text-dark-500 uppercase tracking-widest leading-none mb-1">Total Categories</p>
                        <p className="text-sm md:text-base text-white font-bold leading-none">{categories.length}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                     <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <Zap className="h-4 w-4 md:h-5 md:w-5 text-gold-500" />
                     </div>
                     <div>
                        <p className="text-[7px] md:text-[8px] font-bold text-dark-500 uppercase tracking-widest leading-none mb-1">Live Global Votes</p>
                        <p className="text-sm md:text-base text-white font-bold leading-none">2.4M+</p>
                     </div>
                  </div>
               </div>

               <Button 
                  onClick={copyToClipboard}
                  variant="outline" 
                  className="h-10 md:h-12 border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 bg-white/5 hover:bg-gold-500 hover:text-dark-950 transition-all group"
               >
                  <Share2 className={`h-4 w-4 mr-3 transition-transform ${isCopied ? 'scale-0' : 'group-hover:scale-110'}`} />
                  <Sparkles className={`h-4 w-4 mr-3 absolute left-6 transition-transform ${isCopied ? 'scale-100' : 'scale-0'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isCopied ? 'Link Copied' : 'Share Voting Link'}</span>
               </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-20">
        
        {/* Category Navigation - Desktop Sidebar */}
        <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
           <h3 className="text-[10px] font-bold text-dark-500 uppercase tracking-[0.3em] mb-8 px-4">Award Categories</h3>
           <div className="space-y-2">
             {categories.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => {
                   setActiveCategory(cat.id);
                   setSelectedNominee(null);
                 }}
                 className={`group w-full text-left px-5 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-between ${
                   activeCategory === cat.id 
                     ? 'bg-gold-500 text-dark-950 shadow-xl shadow-gold-500/10' 
                     : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'
                 }`}
               >
                 {cat.name}
                 <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`} />
               </button>
             ))}
           </div>
           
           <div className="mt-12 p-6 rounded-3xl bg-dark-900 border border-white/5 space-y-4">
              <h4 className="text-white font-serif text-lg">Partner Sponsors</h4>
              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-square rounded-xl bg-white/5 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity">
                      <Sparkles className="h-5 w-5" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Voting & Interaction Area */}
        <div className="lg:col-span-3 space-y-12">
          {/* Mobile Category Scroll */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide py-2 flex gap-3 sticky top-16 bg-dark-950/80 backdrop-blur-xl z-20 border-b border-white/5">
             {categories.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`whitespace-nowrap px-6 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
                   activeCategory === cat.id 
                     ? 'bg-gold-500 text-dark-950' 
                     : 'bg-white/5 text-dark-400 border border-white/10'
                 }`}
               >
                 {cat.name}
               </button>
             ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
               <span className="text-gold-500/50 text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Currently Voting</span>
               <h2 className="text-4xl font-serif text-white italic">{categories.find(c => c.id === activeCategory)?.name}</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-dark-950 bg-dark-800" />
                  ))}
               </div>
               <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest whitespace-nowrap">+2k others voted recently</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
            {nominees.map((nominee, idx) => (
              <motion.div 
                key={nominee.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedNominee(nominee.id)}
                className="group relative"
              >
                <div className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-gold-500/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${selectedNominee === nominee.id ? 'opacity-100' : 'group-hover:opacity-30'}`} />
                <Card className={`relative h-full border-white/5 bg-dark-900 group-hover:bg-dark-900/100 transition-all duration-300 p-0 overflow-hidden cursor-pointer rounded-3xl ${selectedNominee === nominee.id ? 'ring-2 ring-gold-500/50' : ''}`}>
                   <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-32 aspect-square relative shrink-0">
                         <img src={nominee.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={nominee.name} />
                         <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent sm:hidden" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                         <div>
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="text-xl font-serif text-white group-hover:text-gold-500 transition-colors uppercase italic">{nominee.name}</h4>
                               <span className="text-[10px] font-bold text-gold-500">#{idx + 1} Trending</span>
                            </div>
                            <div className="flex items-center gap-1.5 mb-6 text-[10px] font-bold text-dark-500 uppercase tracking-widest">
                               <TrendingUp className="h-3 w-3 text-emerald-500" />
                               {nominee.voteCount.toLocaleString()} Verified Votes
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.random() * 60 + 20}%` }}
                                 transition={{ duration: 1.5, ease: "easeOut" }}
                                 className="h-full bg-gold-500" 
                               />
                            </div>
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-dark-600">
                               <span>Power Index</span>
                               <span>Active Hub</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {/* Selection Indicator Overlay */}
                   <div className={`absolute top-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedNominee === nominee.id ? 'bg-gold-500 border-gold-500' : 'border-white/10 group-hover:border-white/30'}`}>
                      {selectedNominee === nominee.id && <Sparkles className="h-3 w-3 text-dark-950" />}
                   </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sticky Checkout/Voting Panel */}
          <AnimatePresence>
            {selectedNominee && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-24 left-0 right-0 z-50 px-4 md:px-0 lg:left-auto lg:right-6 lg:w-[480px] lg:bottom-12"
              >
                <Card className="p-4 md:p-8 bg-dark-950/90 backdrop-blur-2xl border-gold-500/50 shadow-[0_30px_100px_-20px_rgba(198,138,53,0.3)] relative overflow-hidden rounded-[24px] md:rounded-[40px]">
                   <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10">
                      <Zap className="h-16 w-16 md:h-32 md:w-32 text-gold-500" />
                   </div>
                   
                   <div className="relative z-10 space-y-4 md:space-y-8">
                      <div className="flex items-center gap-3 md:gap-4">
                         <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-gold-500 flex items-center justify-center text-dark-950 shadow-xl shadow-gold-500/20">
                            <MousePointer2 className="h-6 w-6 md:h-8 md:w-8" />
                         </div>
                         <div>
                            <span className="text-[8px] md:text-[10px] font-bold text-gold-500 uppercase tracking-[0.4em] block mb-1">Confirming Vote</span>
                            <h3 className="text-lg md:text-2xl font-serif text-white italic">Casting support for {nominees.find(n => n.id === selectedNominee)?.name}</h3>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                         <div className="space-y-1.5 md:space-y-2">
                            <label className="text-[7px] md:text-[8px] font-bold text-dark-500 uppercase tracking-widest ml-1">Select Influence Package</label>
                            <select 
                              value={selectedPackage}
                              onChange={(e) => setSelectedPackage(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl h-12 md:h-14 px-4 md:px-5 text-xs md:text-sm text-white focus:border-gold-500 transition-all outline-none cursor-pointer"
                            >
                               <option value="10">10 Votes — ₦2,500</option>
                               <option value="50">50 Votes — ₦10,000</option>
                               <option value="100">100 Votes — ₦18,000</option>
                            </select>
                         </div>
                         <div className="flex items-end">
                            <Button 
                              onClick={handleVote}
                              disabled={isVoting}
                              className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-gold-500/20 relative overflow-hidden"
                            >
                               {isVoting ? (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 animate-spin" /> Verifying...
                                 </motion.div>
                               ) : (
                                 <><CreditCard className="h-4 w-4 mr-3" /> Pay with Paystack</>
                               )}
                            </Button>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                         <p className="text-[8px] text-dark-500 uppercase font-bold tracking-widest max-w-[200px]">By Proceeding, you agree to the voting integrity guidelines.</p>
                         <div className="flex gap-4">
                            <ShieldCheck className="h-5 w-5 text-emerald-500/50" />
                            <Trophy className="h-5 w-5 text-gold-500/50" />
                         </div>
                      </div>
                   </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
