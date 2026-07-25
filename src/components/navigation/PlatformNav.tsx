import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Search } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/convex-auth';

const platformLinks = [
  { label: 'Discover', to: '/discover' },
  { label: 'Awards', to: '/schedule' },
  { label: 'Events', to: '/discover' },
  { label: 'Organizations', to: '/discover' },
];

export function PlatformNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      <nav className="h-16 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center group shrink-0">
            <BrandLogo className="scale-90 origin-left" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {platformLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-gold-500 bg-gold-500/10'
                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/discover"
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-dark-400 hover:text-gold-500 hover:border-gold-500/30 transition-all"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gold-500 flex items-center justify-center text-dark-950 text-xs font-bold overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                ) : (
                  user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'
                )}
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => window.location.href = '/auth/login'} className="text-dark-300 hover:text-white h-9 px-4 text-[13px]">
                Sign In
              </Button>
              <Link to="/auth/signup">
                <Button className="h-9 px-4 text-[13px] shadow-lg shadow-gold-500/10">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-dark-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] lg:hidden bg-dark-950/98 backdrop-blur-2xl"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-16">
                <BrandLogo className="scale-90 origin-left" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {platformLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                      isActive(link.to) ? 'text-gold-500 bg-gold-500/10' : 'text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-3">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="h-12 w-full text-sm">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Button onClick={() => { setMobileMenuOpen(false); window.location.href = '/auth/login'; }} variant="outline" className="h-12 text-sm">Sign In</Button>
                    <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="h-12 w-full text-sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
