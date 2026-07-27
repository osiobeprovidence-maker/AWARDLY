import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trophy, Globe } from 'lucide-react';

interface WebsiteHeaderProps {
  org: any;
  navigation: any[];
  activePage: string;
  onNavigate: (pageId: string) => void;
  liveBroadcast?: any;
}

export function WebsiteHeader({ org, navigation, activePage, onNavigate, liveBroadcast }: WebsiteHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enabledNav = navigation
    .filter((n) => n.isEnabled)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="relative h-[25vh] sm:h-[35vh] w-full">
        {org.coverUrl ? (
          <img src={org.coverUrl} alt="Cover" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="h-full w-full bg-dark-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 sm:-mt-24">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-8 group">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl border-4 border-dark-950 bg-dark-900 overflow-hidden shrink-0 relative shadow-2xl transition-transform group-hover:scale-105 duration-500">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt="Logo" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-4xl text-dark-500 font-serif flex h-full w-full justify-center items-center">{org.name[0]}</span>
              )}
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-4xl font-serif text-white font-medium">{org.name}</h1>
                {org.isVerified && <CheckCircle2 className="h-6 w-6 text-gold-500" />}
              </div>
              <p className="text-dark-400 text-lg flex items-center justify-center md:justify-start gap-3">
                <span>@{org.slug}</span>
                <span className="h-1 w-1 bg-dark-600 rounded-full" />
                <span className="text-gold-500/80 font-bold text-xs uppercase tracking-widest">{org.type} Hub</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide w-full md:w-auto">
              {enabledNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.pageId)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    activePage === item.pageId
                      ? 'bg-gold-500 text-dark-950'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.pageId === 'voting' && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
                  )}
                  {item.pageId === 'live-feed' && liveBroadcast && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <span className="text-dark-400 text-xs font-bold uppercase tracking-widest">
                {org.followerCount.toLocaleString()} Members
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-16 left-0 right-0 z-[40] bg-dark-900/90 backdrop-blur-2xl border-b border-white/5 px-6 py-2 hidden md:block"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                {org.logoUrl ? (
                  <img src={org.logoUrl} className="h-8 w-8 rounded-lg object-cover" alt="logo" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">
                    {org.name[0]}
                  </div>
                )}
                <span className="text-white font-serif text-sm">{org.name}</span>
                {liveBroadcast && (
                  <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center">
                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse" /> Live
                  </span>
                )}
              </div>
              <nav className="flex items-center gap-1">
                {enabledNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.pageId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activePage === item.pageId
                        ? 'bg-gold-500 text-dark-950'
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
