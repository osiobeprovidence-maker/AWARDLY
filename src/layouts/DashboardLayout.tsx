import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  Building2, LayoutDashboard, Radio, Trophy, Users, 
  Settings, Image, Vote, Presentation, TrendingUp, LogOut, Menu, X, DollarSign,
  Bell, Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { NotificationPopover } from '../components/dashboard/NotificationPopover';
import { useToast } from '../lib/toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
  { icon: Presentation, label: 'Community Feed', to: '/dashboard/feed' },
  { icon: Trophy, label: 'Events & Awards', to: '/dashboard/events' },
  { icon: Vote, label: 'Nominations & Voting', to: '/dashboard/voting' },
  { icon: DollarSign, label: 'Monetization', to: '/dashboard/monetization' },
  { icon: Radio, label: 'Live Broadcasts', to: '/dashboard/live' },
  { icon: Image, label: 'Media Center', to: '/dashboard/media' },
  { icon: Users, label: 'Followers', to: '/dashboard/followers' },
  { icon: TrendingUp, label: 'Analytics', to: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
];

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  // Close menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center px-6 border-b border-white/5 bg-dark-950/40">
        <BrandLogo className="scale-90 origin-left" />
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-1 custom-scrollbar">
        <div className="mb-4 px-3 text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">Management Hub</div>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => cn(
              "group flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-sm",
              isActive 
                ? "bg-gold-500 text-dark-950 font-bold shadow-lg shadow-gold-500/20" 
                : "text-dark-400 hover:text-white hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-dark-950" : "text-dark-500 group-hover:text-gold-500"
                )} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
        
        <div className="mt-12 mb-4 px-3 text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">Public Context</div>
        <Link
            to="/org/headies"
            className="flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-sm text-dark-400 hover:text-gold-400 hover:bg-gold-500/5 group"
        >
            <Building2 className="mr-3 h-5 w-5 text-dark-500 group-hover:text-gold-500" />
            View Public Hub
        </Link>
      </div>
      
      <div className="p-6 border-t border-white/5 bg-dark-950/30">
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to sign out?')) {
              window.location.href = '/auth/login';
            }
          }}
          className="flex w-full items-center px-4 py-3 text-sm font-bold uppercase tracking-widest text-dark-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-80 hidden md:flex flex-col border-r border-white/5 bg-dark-950 shadow-2xl relative z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-dark-950 border-r border-white/10 z-[70] md:hidden flex flex-col shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Desktop Top Header Bar */}
        <header className="h-20 hidden md:flex items-center justify-between px-10 border-b border-white/5 bg-dark-950/40 backdrop-blur-xl sticky top-0 z-20">
            <div className="flex items-center gap-4 text-dark-400">
               <div
                 onClick={() => toast('Search functionality coming soon. You can search for events, nominees, or settings.', 'info')}
                 className="h-10 w-96 rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 gap-3 focus-within:border-gold-500/50 transition-all cursor-text group hover:border-white/10"
               >
                  <Search className="h-4 w-4 text-dark-500 group-hover:text-gold-500 transition-colors" />
                  <span className="text-xs font-medium">Search anything...</span>
                  <div className="ml-auto flex gap-1">
                     <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] border border-white/10">⌘</kbd>
                     <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] border border-white/10">K</kbd>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-dark-400 hover:text-gold-500 transition-all relative"
                  >
                     <Bell className="h-5 w-5" />
                     <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-gold-500 rounded-full ring-4 ring-dark-950" />
                  </button>
                  <NotificationPopover isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
               </div>
               <div className="h-10 w-10 rounded-xl bg-gold-500 flex items-center justify-center text-dark-950 font-bold border-2 border-white/10">
                  HO
               </div>
            </div>
        </header>

        {/* Mobile Header */}
        <header className="h-16 flex md:hidden items-center justify-between px-6 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-20">
            <BrandLogo className="scale-75 origin-left" />
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-300 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative custom-scrollbar pb-32 md:pb-10">
          {/* Subtle animated gradient background for the dashboard */}
          <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none -mr-96 -mt-96 animate-pulse duration-[10s]" />
          <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-dark-900/40 blur-[100px] rounded-full pointer-events-none -ml-72 -mb-72" />
          
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto relative z-10 h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
