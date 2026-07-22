import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockOrgs, mockEvents, mockPosts, mockNominees, cocaColaBanner, awardStage } from '../../data';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { 
  CheckCircle2, Link as LinkIcon, Calendar, Trophy, PlayCircle, 
  Share2, MessageSquare, Heart, Info, Radio, Globe, Twitter, Instagram, Users,
  ArrowRight, ShieldCheck, MousePointer2, Clock
} from 'lucide-react';

export function OrgProfile() {
  const { orgId } = useParams();
  const org = mockOrgs.find(o => o.id === orgId) || mockOrgs[0];
  const events = mockEvents.filter(e => e.orgId === org.id);
  const posts = mockPosts.filter(p => p.orgId === org.id);
  const activeVotingEvents = events.filter(e => e.isVotingActive);

  const [activeTab, setActiveTab] = React.useState('home');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [selectedVotingEventId, setSelectedVotingEventId] = React.useState(activeVotingEvents[0]?.id || '');

  React.useEffect(() => {
    if (activeVotingEvents.length > 0 && !selectedVotingEventId) {
      setSelectedVotingEventId(activeVotingEvents[0].id);
    }
  }, [activeVotingEvents, selectedVotingEventId]);

  const selectedEvent = activeVotingEvents.find(e => e.id === selectedVotingEventId);
  const eventCategories = mockNominees && selectedVotingEventId ? 
    ['Best Male Artist', 'Album of the Year', 'Next Rated'] : []; // For now using simple strings but can be expanded

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!org) return <div className="text-white">Organization not found</div>;

  return (
    <div className="w-full flex-1 bg-dark-950 font-sans">
      {/* Sticky Secondary Header for Mobile/Desktop */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-20 left-0 right-0 z-[40] bg-dark-900/80 backdrop-blur-2xl border-b border-white/5 px-6 sm:px-12 py-3 hidden md:flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <img src={org.logoUrl} className="h-10 w-10 rounded-xl object-cover" alt="logo" />
               <div>
                  <h4 className="text-white font-serif text-base leading-none mb-1">{org.name}</h4>
                  <p className="text-gold-500 text-[10px] font-bold uppercase tracking-widest flex items-center">
                    <span className="h-1 w-1 bg-green-500 rounded-full mr-2 animate-pulse" /> Live Now
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-dark-400 text-xs font-bold uppercase tracking-widest">{org.followerCount.toLocaleString()} Followers</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover Banner */}
      <div className="relative h-[25vh] sm:h-[35vh] w-full">
        {org.coverUrl ? (
          <img 
            src={org.coverUrl} 
            alt="Cover" 
            className="h-full w-full object-cover" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-dark-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 sm:-mt-24 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-8 group">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl border-4 border-dark-950 bg-dark-900 overflow-hidden shrink-0 relative shadow-2xl transition-transform group-hover:scale-105 duration-500">
              {org.logoUrl ? (
                <img 
                  src={org.logoUrl} 
                  alt="Logo" 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-4xl text-dark-500 font-serif flex h-full w-full justify-center items-center">{org.name[0]}</span>
              )}
            </div>
            
            <div className="mb-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-4xl font-serif text-white font-medium">
                  {org.name}
                </h1>
                <CheckCircle2 className="h-6 w-6 text-gold-500" />
              </div>
              <p className="text-dark-400 text-lg flex items-center justify-center md:justify-start gap-3">
                <span>@{org.username}</span>
                <span className="h-1 w-1 bg-dark-600 rounded-full" />
                <span className="text-gold-500/80 font-bold text-xs uppercase tracking-widest">{org.category} Hub</span>
              </p>
            </div>
          </div>
        </div>

        {/* Global Hub Stats */}
        <div className="bg-dark-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-6">
                 <div className="flex -space-x-3">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop'
                    ].map((src, i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-dark-950 overflow-hidden ring-1 ring-white/10 shadow-xl">
                        <img src={src} className="h-full w-full object-cover" alt="Member" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-dark-950 bg-gold-500 flex items-center justify-center ring-1 ring-white/10 shadow-xl">
                       <span className="text-[8px] font-black text-dark-950">+2M</span>
                    </div>
                 </div>
                 <div>
                    <p className="text-white font-serif text-xl leading-none">{org.followerCount.toLocaleString()}</p>
                    <p className="text-[10px] text-dark-500 uppercase font-black tracking-[0.2em] mt-1">Community Members</p>
                 </div>
              </div>
              
              <div className="hidden lg:block w-px h-8 bg-white/5" />

              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1578267153661-595357ed46ad?w=100&auto=format&fit=crop" 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" 
                      alt="Awards" 
                      referrerPolicy="no-referrer"
                    />
                    <Trophy className="h-4 w-4 text-gold-500 relative z-10" />
                 </div>
                 <div>
                    <p className="text-white font-serif text-xl leading-none">{events.length}</p>
                    <p className="text-[10px] text-dark-500 uppercase font-black tracking-[0.2em] mt-1">Active Awards</p>
                 </div>
              </div>

              <div className="hidden lg:block w-px h-8 bg-white/5" />

              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=100&auto=format&fit=crop" 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" 
                      alt="Global" 
                      referrerPolicy="no-referrer"
                    />
                    <Globe className="h-4 w-4 text-dark-400 relative z-10" />
                 </div>
                 <div>
                    <p className="text-white font-serif text-xl leading-none">Global</p>
                    <p className="text-[10px] text-dark-500 uppercase font-black tracking-[0.2em] mt-1">Audience Scope</p>
                 </div>
              </div>
           </div>

           <div className="hidden md:block w-px h-12 bg-white/5" />

           <div className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-all">
              <div className="text-right">
                 <p className="text-[10px] text-dark-500 uppercase font-black tracking-[0.2em] mb-1">Strategic Partner</p>
                 <p className="text-white font-serif text-sm italic">The Coca-Cola Company</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center overflow-hidden group-hover:border-red-500/30 transition-all">
                  <img 
                    src={cocaColaBanner} 
                    className="h-full w-full object-cover rounded-lg" 
                    alt="Coca-Cola" 
                    referrerPolicy="no-referrer" 
                  />
              </div>
           </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
           <TabsList className="bg-transparent h-auto border-b border-white/5 w-full rounded-none justify-start px-0 gap-8 overflow-x-auto scrollbar-hide">
              {['Home', 'Events', 'Voting', 'Live Feed', 'Broadcast', 'About'].map(tab => (
                <TabsTrigger 
                  key={tab}
                  value={tab.toLowerCase().replace(' ', '-')} 
                  className="bg-transparent px-0 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:bg-transparent text-dark-400 data-[state=active]:text-white text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  {tab === 'Voting' && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  )}
                  {tab}
                </TabsTrigger>
              ))}
           </TabsList>

           <TabsContent value="home" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-2 space-y-12">
                    {/* Featured Voting Section */}
                    {activeVotingEvents.length > 0 && (
                      <Card className="p-0 overflow-hidden border-gold-500/30 bg-dark-900/40 backdrop-blur-sm group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent pointer-events-none" />
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-48 md:h-auto relative">
                             <img 
                               src={activeVotingEvents[0].coverUrl} 
                               className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                               alt="Voting"
                               referrerPolicy="no-referrer"
                             />
                             <div className="absolute inset-0 bg-dark-950/20" />
                             <div className="absolute top-4 left-4">
                                <span className="px-2 py-1 bg-gold-500 text-dark-950 text-[8px] font-black uppercase tracking-widest rounded shadow-lg">Official Polls</span>
                             </div>
                          </div>
                          <div className="p-8 flex-1">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="h-6 w-6 rounded bg-white/5 border border-white/10 p-1 flex items-center justify-center">
                                    <img 
                                      src={cocaColaBanner} 
                                      className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all" 
                                      alt="Coke" 
                                      referrerPolicy="no-referrer" 
                                    />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-dark-500">Presented by The Coca-Cola Company</span>
                             </div>
                             <h3 className="text-2xl font-serif text-white italic mb-3">{activeVotingEvents[0].title}</h3>
                             <p className="text-dark-400 text-xs mb-6 max-w-md">The polls are open. Influence the outcome of the year's most prestigious awards by supporting your favorite nominees.</p>
                             <div className="flex items-center gap-4">
                                <Button 
                                  onClick={() => setActiveTab('voting')}
                                  className="px-8 h-10 rounded-full shadow-xl shadow-gold-500/20 group/btn"
                                >
                                  View Voting Info
                                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                                <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{mockNominees.length} Categories Active</span>
                             </div>
                          </div>
                        </div>
                      </Card>
                    )}
                    {/* Featured Live Banner */}
                    {org.isLive && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="p-0 overflow-hidden border-gold-500/20 group relative cursor-pointer">
                           <div className="aspect-video relative">
                              <img src={org.coverUrl} className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-transform duration-700" alt="live" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-all" />
                              <div className="absolute top-4 left-4 flex gap-2">
                                 <span className="px-3 py-1 bg-red-600 text-[10px] font-bold text-white rounded flex items-center uppercase tracking-widest">
                                    <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse mr-2" /> Live Now
                                 </span>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlayCircle className="h-10 w-10 text-white" />
                                 </div>
                              </div>
                           </div>
                           <CardContent className="p-6">
                              <h3 className="text-2xl font-serif text-white mb-2">The Headies 2026: Live from Lagos</h3>
                              <p className="text-dark-400 text-sm">Join the global broadcast as we celebrate the best in African excellence.</p>
                           </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Active Events */}
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-serif text-white">Active Award Hubs</h2>
                          <Button variant="ghost" className="text-gold-500 text-xs font-bold uppercase tracking-widest">View All Events</Button>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {events.map((event) => (
                            <Link to={`/org/${org.id}/events/${event.id}`} key={event.id}>
                              <Card className="p-0 overflow-hidden group hover:border-gold-500/30 transition-all border-white/5 h-full flex flex-col">
                                 <div className="h-40 overflow-hidden relative">
                                    <img src={event.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 h-full" alt="event" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                       <span className="px-2 py-0.5 bg-gold-500 text-dark-950 text-[8px] font-bold uppercase rounded tracking-widest">
                                          {event.isVotingActive ? 'Voting Live' : 'Coming Soon'}
                                       </span>
                                    </div>
                                 </div>
                                 <CardContent className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg text-white font-serif mb-2 group-hover:text-gold-400 transition-colors">{event.title}</h3>
                                    <p className="text-xs text-dark-400 line-clamp-2 mb-6 leading-relaxed">{event.description}</p>
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                                       <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-dark-500">
                                          <Calendar className="h-3 w-3" /> Sept 4
                                       </div>
                                       <span className="text-xs font-bold text-gold-500">Visit Hub →</span>
                                    </div>
                                 </CardContent>
                              </Card>
                            </Link>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Sidebar */}
                 <div className="space-y-8">
                    <Card className="bg-dark-900/50 border-white/5">
                       <h3 className="text-white font-serif text-lg mb-4">About the Organization</h3>
                       <p className="text-sm text-dark-400 leading-relaxed mb-6">{org.description}</p>
                       <div className="space-y-4 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors cursor-pointer group">
                             <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                                <LinkIcon className="h-4 w-4" />
                             </div>
                             <span className="text-sm">Official Website</span>
                          </div>
                          <div className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors cursor-pointer group">
                             <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-sky-500/10 transition-colors">
                                <Twitter className="h-4 w-4" />
                             </div>
                             <span className="text-sm">X (Twitter)</span>
                          </div>
                          <div className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors cursor-pointer group">
                             <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                                <Instagram className="h-4 w-4" />
                             </div>
                             <span className="text-sm">Instagram</span>
                          </div>
                       </div>
                    </Card>

                    <Card className="bg-gold-500/5 border-gold-500/10">
                       <div className="text-center">
                          <Trophy className="h-10 w-10 text-gold-500 mx-auto mb-4" />
                          <h4 className="text-white font-serif text-lg mb-2">Excellence Awaits</h4>
                          <p className="text-xs text-dark-400 mb-6">Support your favorite candidates and influence the most prestigious awards in the industry.</p>
                       </div>
                    </Card>
                 </div>
              </div>
           </TabsContent>

           <TabsContent value="events" className="pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[...events, ...events, ...events].map((event, i) => (
                   <Card key={i} className="p-0 overflow-hidden group hover:border-gold-500/20 transition-all border-white/5">
                      <div className="aspect-video relative overflow-hidden">
                         <img src={event.coverUrl} className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-all duration-700" alt="event" referrerPolicy="no-referrer" />
                         <div className="absolute top-4 right-4 px-3 py-1 bg-dark-950/80 backdrop-blur text-[10px] font-bold text-gold-500 rounded uppercase tracking-widest border border-gold-500/20">
                            {event.status}
                         </div>
                      </div>
                      <CardContent className="p-6">
                         <h3 className="text-xl text-white font-serif mb-2">{event.title}</h3>
                         <p className="text-xs text-dark-400 mb-6 leading-relaxed line-clamp-2">{event.description}</p>
                         <Button variant="outline" className="w-full border-white/10 group-hover:bg-gold-500 group-hover:text-dark-950 transition-all">Go to Event Hub</Button>
                      </CardContent>
                   </Card>
                 ))}
              </div>
           </TabsContent>

           <TabsContent value="voting" className="space-y-12 pb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                    <h2 className="text-3xl font-serif text-white italic mb-2">Voting Gateway</h2>
                    <p className="text-dark-400 text-sm">Official information hub for the current awards season.</p>
                 </div>
                 
                 {activeVotingEvents.length > 1 && (
                    <div className="flex bg-dark-900/60 p-1 rounded-xl border border-white/5 self-end">
                      {activeVotingEvents.map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedVotingEventId(event.id)}
                          className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            selectedVotingEventId === event.id 
                              ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20' 
                              : 'text-dark-400 hover:text-white'
                          }`}
                        >
                          {event.title.split(' ').slice(-1)}
                        </button>
                      ))}
                    </div>
                 )}
              </div>

              {selectedEvent ? (
                <div className="space-y-16">
                   {/* Hero Info Card */}
                   <Card className="relative overflow-hidden p-0 border-white/5 bg-dark-900/40">
                      <div className="absolute inset-0 bg-gradient-to-r from-dark-950 to-transparent z-10" />
                      <div className="absolute inset-0 opacity-40">
                         <img src={selectedEvent.coverUrl} className="w-full h-full object-cover grayscale" alt="hero" />
                      </div>
                      
                      <div className="relative z-20 p-8 md:p-16 max-w-2xl space-y-6">
                         <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gold-500 text-dark-950 text-[10px] font-black uppercase tracking-widest rounded-full">Voting is Open</span>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ends in 12 Days 4 Hours</span>
                         </div>
                         <h3 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">{selectedEvent.title}</h3>
                         <p className="text-dark-400 text-sm md:text-base leading-relaxed">
                            Support your favorite talents. Every vote counts towards shaping the future of African music excellence.
                         </p>
                         <div className="pt-4">
                            <Link to={`/org/${org.id}/events/${selectedEvent.id}`}>
                               <Button className="h-14 px-10 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-gold-500/20 group">
                                  Enter Voting Portal
                                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                               </Button>
                            </Link>
                         </div>
                      </div>
                   </Card>

                   {/* Informational Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-6">
                         <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-gold-500" />
                         </div>
                         <h4 className="text-xl text-white font-serif italic">Before You Vote</h4>
                         <ul className="space-y-3">
                            {[
                              'One account = one verified voter',
                              'Daily vote limits apply per category',
                              'Premium votes available for verified fans',
                              'Votes cannot be reversed after confirmation',
                              'Suspicious voting activity will be flagged'
                            ].map((rule, idx) => (
                               <li key={idx} className="flex items-start gap-3 text-[11px] text-dark-400 leading-relaxed">
                                  <div className="h-1.5 w-1.5 rounded-full bg-gold-500/30 mt-1.5 shrink-0" />
                                  {rule}
                               </li>
                            ))}
                         </ul>
                      </div>

                      <div className="space-y-6">
                         <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <MousePointer2 className="h-6 w-6 text-gold-500" />
                         </div>
                         <h4 className="text-xl text-white font-serif italic">How Voting Works</h4>
                         <div className="space-y-4">
                            {[
                              { step: '01', title: 'Choose Category', desc: 'Browse through active award categories.' },
                              { step: '02', title: 'Select Nominee', desc: 'Pick your favorite candidate from the list.' },
                              { step: '03', title: 'Confirm Vote', desc: 'Use your free or premium votes to support.' }
                            ].map((s, idx) => (
                               <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                  <span className="text-gold-500 font-serif italic text-lg">{s.step}</span>
                                  <div>
                                     <h5 className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">{s.title}</h5>
                                     <p className="text-[10px] text-dark-500">{s.desc}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-gold-500" />
                         </div>
                         <h4 className="text-xl text-white font-serif italic">Statistics</h4>
                         <div className="grid grid-cols-1 gap-4">
                            <Card className="p-4 bg-dark-900/60 border-white/5">
                               <p className="text-gold-500 font-serif text-3xl mb-1">4</p>
                               <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Active Categories</p>
                            </Card>
                            <Card className="p-4 bg-dark-900/60 border-white/5">
                               <p className="text-white font-serif text-3xl mb-1">2.4M</p>
                               <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Global Votes Cast</p>
                            </Card>
                            <Card className="p-4 bg-dark-900/60 border-white/5">
                               <p className="text-white font-serif text-3xl mb-1">112</p>
                               <p className="text-[9px] font-bold text-dark-500 uppercase tracking-widest">Global Hubs Participating</p>
                            </Card>
                         </div>
                      </div>
                   </div>

                   {/* FAQ Section */}
                   <div className="pt-16 border-t border-white/5">
                      <h4 className="text-2xl text-white font-serif italic mb-8">Frequently Asked Questions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                         {[
                           { q: 'Can I vote more than once?', a: 'Yes, each fan has a daily free vote quota per category. Premium votes allow for additional support.' },
                           { q: 'Do I need an account?', a: 'To ensure voting integrity and prevent fraud, a verified account is required to cast votes.' },
                           { q: 'Is voting free?', a: 'Every category includes a free voting allowance. Additional "Influence Packages" can be purchased via Paystack.' },
                           { q: 'How are winners selected?', a: 'Winners are determined by a combination of public voting (70%) and technical committee review (30%).' }
                         ].map((item, idx) => (
                           <div key={idx} className="space-y-3">
                              <h5 className="text-white text-sm font-medium">{item.q}</h5>
                              <p className="text-dark-400 text-xs leading-relaxed">{item.a}</p>
                           </div>
                         ))}
                      </div>
                   </div>                   {/* Strategic Partners */}
                   <div className="pt-16 border-t border-white/5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500 mb-10">Strategic Partners & Sponsors</p>
                      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 p-1.5 flex items-center justify-center">
                               <img 
                                 src={cocaColaBanner} 
                                 className="h-full w-full object-contain" 
                                 alt="Coca-Cola" 
                                 referrerPolicy="no-referrer" 
                               />
                            </div>
                            <span className="text-white font-serif text-lg italic tracking-tight">Coca-Cola</span>
                         </div>
                         <div className="h-8 w-px bg-white/10 hidden md:block" />
                         <span className="text-white font-serif text-2xl italic opacity-60">V-Bank</span>
                         <div className="h-8 w-px bg-white/10 hidden md:block" />
                         <span className="text-white font-serif text-2xl italic opacity-60">Netflix</span>
                         <div className="h-8 w-px bg-white/10 hidden md:block" />
                         <span className="text-white font-serif text-2xl italic opacity-60">Paystack</span>
                      </div>
                   </div>

                   {/* Final CTA */}
                   <div className="bg-gold-500 rounded-3xl p-12 text-center space-y-8 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <img 
                           src={cocaColaBanner} 
                           className="h-32 w-32 object-contain" 
                           alt="Coke Bg" 
                         />
                      </div>
                      <div className="relative z-10 space-y-6">
                         <h4 className="text-dark-950 text-3xl md:text-5xl font-serif italic tracking-tight">Ready to make your voice heard?</h4>
                         <p className="text-dark-950/60 max-w-xl mx-auto text-sm">Join millions of fans across the globe in deciding the next generation of music icons. Secure, fair, and transparent.</p>
                         <div className="pt-4">
                            <Link to={`/org/${org.id}/events/${selectedEvent.id}`}>
                               <Button className="bg-dark-950 text-white hover:bg-dark-900 h-16 px-12 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-2xl group/btn">
                                  Start Voting Now
                                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                               </Button>
                            </Link>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <Card className="p-12 text-center border-dashed border-white/10">
                   <Trophy className="h-12 w-12 text-dark-600 mx-auto mb-4 opacity-20" />
                   <h3 className="text-xl text-white font-serif mb-2">No Active Voting</h3>
                   <p className="text-dark-500 text-sm">There are currently no open categories for this organization.</p>
                </Card>
              )}
           </TabsContent>

           <TabsContent value="live-feed" className="max-w-3xl mx-auto space-y-8">
              {posts.map((post) => (
                <motion.div layout key={post.id}>
                  <Card className="hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <img src={org.logoUrl} className="h-12 w-12 rounded-xl border border-white/5" alt="avatar" referrerPolicy="no-referrer" />
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="text-white font-medium">{org.name}</h4>
                             <CheckCircle2 className="h-3.5 w-3.5 text-gold-500" />
                          </div>
                          <p className="text-dark-500 text-xs">Today at 10:45 AM</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-dark-500 hover:text-white"><Share2 className="h-4 w-4" /></Button>
                    </div>
                    
                    <p className="text-dark-200 text-base leading-relaxed mb-6">{post.content}</p>
                    
                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                      <div className="rounded-2xl overflow-hidden mb-6 border border-white/10 aspect-video relative shadow-2xl">
                         <img src={post.mediaUrls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="media" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    
                    <div className="flex items-center pt-6 border-t border-white/5 gap-8">
                       <button className="flex items-center text-dark-400 hover:text-gold-500 transition-colors gap-2 text-sm font-medium">
                          <Heart className="h-5 w-5" /> {post.likesCount.toLocaleString()}
                       </button>
                       <button className="flex items-center text-dark-400 hover:text-white transition-colors gap-2 text-sm font-medium">
                          <MessageSquare className="h-5 w-5" /> {post.commentsCount.toLocaleString()}
                       </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
           </TabsContent>

           <TabsContent value="broadcast">
              <Card className="p-0 overflow-hidden border-white/10 bg-dark-900/50">
                 <div className="aspect-video bg-black flex items-center justify-center relative">
                    <div className="absolute top-6 left-6 z-10 flex gap-3">
                       <span className="px-3 py-1 bg-red-600 text-xs font-bold text-white rounded flex items-center uppercase tracking-widest shadow-xl">
                          <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-2" /> Live
                       </span>
                    </div>
                     <img 
                       src={awardStage} 
                       className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-0" 
                       alt="Broadcast cover" 
                       referrerPolicy="no-referrer"
                     />
                    <div className="relative z-10 text-center">
                       <Button variant="glass" size="icon" className="h-20 w-20 rounded-full border-2 border-white/20 hover:scale-110 transition-transform">
                          <PlayCircle className="h-10 w-10 text-white fill-white" />
                       </Button>
                    </div>
                 </div>
                 <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-serif text-white mb-2">Headies Main Stage: Live Performance</h3>
                        <p className="text-dark-400 flex items-center gap-3">
                           <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 124,520 watching</span>
                           <span className="h-1 w-1 bg-dark-600 rounded-full" />
                           <span>Started 2 hours ago</span>
                        </p>
                    </div>
                 </div>
              </Card>
           </TabsContent>

           <TabsContent value="about" className="max-w-3xl mx-auto space-y-12">
              <div className="space-y-6">
                 <h2 className="text-3xl font-serif text-white">Our Mission</h2>
                 <p className="text-dark-300 text-lg leading-relaxed">{org.description}</p>
                 <p className="text-dark-400 leading-relaxed">
                    Headies Official has been at the forefront of the music industry for over two decades, providing a transparent and prestigious platform for recognizing the dedication and talent of artists who shape our cultural landscape. Our hub serves as a central point for fans to connect with their favorite organizations and participate in a fair, community-driven award process.
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                 <div className="space-y-4">
                    <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">History</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Founded in 2006, the platform has grown into Africa's most anticipated music awards ceremony, reaching millions of viewers globally each year.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Governance</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">Operated by a board of seasoned industry professionals ensuring strict adherence to global award standards and transparency in voting.</p>
                 </div>
              </div>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
