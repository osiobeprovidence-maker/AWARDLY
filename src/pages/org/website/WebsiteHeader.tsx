import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trophy, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../../lib/convex-auth';

interface WebsiteHeaderProps {
  org: any;
  navigation: any[];
  activePage: string;
  onNavigate: (pageId: string) => void;
  liveBroadcast?: any;
}

export function WebsiteHeader({ org, navigation, activePage, onNavigate, liveBroadcast }: WebsiteHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enabledNav = navigation
    .filter((n) => n.isEnabled)
    .sort((a, b) => a.order - b.order);

  const handleNav = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── Top Bar: Org branding + Nav + Auth ─── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl'
          : 'bg-dark-950/60 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Org Logo + Name */}
            <Link to={`/org/${org.slug}`} onClick={() => handleNav('home')}
              className="flex items-center gap-3 shrink-0 group">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name}
                  className="h-9 w-9 rounded-lg object-cover border border-white/10 group-hover:border-gold-500/30 transition-colors"
                  referrerPolicy="no-referrer" />
              ) : (
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-serif text-gold-500 text-sm group-hover:border-gold-500/30 transition-colors">
                  {org.name[0]}
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-white font-serif text-sm font-medium group-hover:text-gold-400 transition-colors">
                  {org.name}
                </span>
                {org.isVerified && <CheckCircle2 className="h-4 w-4 text-gold-500" />}
                {liveBroadcast && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1 w-1 bg-red-500 rounded-full animate-pulse" /> Live
                  </span>
                )}
              </div>
            </Link>

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {enabledNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.pageId)}
                  className={`relative px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    activePage === item.pageId
                      ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.pageId === 'voting' && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
                  )}
                  {item.pageId === 'live-feed' && liveBroadcast && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right: Auth */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {user ? (
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-lg bg-gold-500 flex items-center justify-center text-dark-950 text-xs font-bold overflow-hidden border-2 border-white/10 group-hover:border-gold-500/50 transition-colors">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth/login"
                    className="px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                    Sign In
                  </Link>
                  <Link to="/auth/signup"
                    className="px-4 py-1.5 rounded-lg bg-gold-500 text-dark-950 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/10">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-dark-300 hover:text-white">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-80 bg-dark-950 border-l border-white/10 flex flex-col shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} className="h-8 w-8 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">
                      {org.name[0]}
                    </div>
                  )}
                  <span className="text-white font-serif text-sm">{org.name}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {enabledNav.map((item) => (
                  <button key={item.id} onClick={() => handleNav(item.pageId)}
                    className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      activePage === item.pageId
                        ? 'bg-gold-500/10 text-gold-500 font-bold'
                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                    }`}>
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-white/5">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 h-10 rounded-xl bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center">
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 h-10 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center hover:bg-white/5 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 h-10 rounded-xl bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
