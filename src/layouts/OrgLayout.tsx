import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Bell, Menu, User, X } from 'lucide-react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { AnimatePresence } from 'motion/react';

export function OrgLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      {/* Global Public Topnav */}
      <nav className="h-20 border-b border-white/5 bg-dark-950/80 backdrop-blur-2xl sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-12">
          <NavLink to="/" className="flex items-center group">
            <BrandLogo />
          </NavLink>
          
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/discover" 
              className="text-dark-400 hover:text-gold-400 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Explore
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center h-10 w-64 rounded-xl bg-white/5 border border-white/5 px-4 gap-3 text-dark-500">
            <Search className="h-4 w-4" />
            <span className="text-xs">Search hubs...</span>
          </div>
          
          <div className="flex items-center gap-3">
             <Link to="/auth/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-dark-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
             <Link to="/auth/signup" className="hidden sm:block bg-gold-500 text-dark-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold-500/20">Get Started</Link>
             
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white"
             >
               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
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

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="w-full border-t border-white/5 py-24 px-6 mt-24 bg-dark-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-6">
             <BrandLogo />
             <p className="text-dark-500 text-sm leading-relaxed">The global standard for recognition and community excellence. Elevating the most prestigious honors through transparent and engaging experiences.</p>
          </div>
          
          <div className="space-y-6">
             <h4 className="text-white font-serif text-lg">Platform</h4>
             <ul className="space-y-4 text-sm text-dark-400">
                <li><Link to="/discover" className="hover:text-gold-500 transition-colors">Explore Hubs</Link></li>
                <li><Link to="/pricing" className="hover:text-gold-500 transition-colors">Pricing & Plans</Link></li>
                <li><Link to="/resources" className="hover:text-gold-500 transition-colors">Creator Resources</Link></li>
             </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-white font-serif text-lg">Legal</h4>
             <ul className="space-y-4 text-sm text-dark-400">
                <li><Link to="#" className="hover:text-gold-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-gold-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-gold-500 transition-colors">Voting Integrity</Link></li>
             </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-white font-serif text-lg">Subscription</h4>
             <p className="text-dark-500 text-xs leading-relaxed">Stay updated with the latest event announcements and community milestones.</p>
             <div className="flex">
                <input type="email" placeholder="Email address" className="bg-white/5 border border-white/5 rounded-l-xl px-4 py-2 text-xs w-full focus:outline-none focus:border-gold-500/50" />
                <button className="bg-gold-500 text-dark-950 px-4 py-2 rounded-r-xl text-[10px] font-bold uppercase tracking-widest">Join</button>
             </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-24 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-dark-500 text-[10px] font-bold uppercase tracking-[0.2em]">Powered by AWARDLY © {new Date().getFullYear()}</p>
           <div className="flex gap-8">
              {['Twitter', 'Instagram', 'Discord', 'YouTube'].map(social => (
                <Link key={social} to="#" className="text-dark-500 hover:text-gold-500 text-[10px] font-bold uppercase tracking-widest transition-colors">{social}</Link>
              ))}
           </div>
        </div>
      </footer>
    </div>
  );
}
