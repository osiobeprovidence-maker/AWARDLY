import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { Button } from '../ui/Button';

const navLinks = [
  { label: 'Explore', to: '/discover' },
  { label: 'Features', to: '/#features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Learning', to: '/resources' },
];

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (to: string) => {
    if (to.startsWith('/#')) return location.pathname === '/' && location.hash === to.slice(1);
    return location.pathname === to;
  };

  return (
    <>
      <nav className="h-20 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center group">
            <BrandLogo />
          </Link>
          <div className="hidden lg:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-gold-500'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" onClick={() => window.location.href = '/auth/login'} className="text-dark-300 hover:text-white">
            Sign In
          </Button>
          <Link to="/auth/signup">
            <Button className="shadow-lg shadow-gold-500/10">Create Hub</Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-dark-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            <div className="flex flex-col h-full p-12">
              <div className="flex justify-between items-center mb-24">
                <BrandLogo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-5xl font-serif italic tracking-tighter transition-colors ${
                      isActive(link.to) ? 'text-gold-500' : 'text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-12 border-t border-white/5 flex flex-col gap-4">
                <Button onClick={() => { setMobileMenuOpen(false); window.location.href = '/auth/login'; }} variant="outline" className="h-16 text-lg">Sign In</Button>
                <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="h-16 w-full text-lg">Create Hub</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
