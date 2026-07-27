import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Radio, Trophy, Users, Settings, Vote,
  Presentation, TrendingUp, LogOut, Menu, X, Bell, Search,
  User, ArrowLeft, Gavel, Image, Ticket, Bookmark, Handshake,
  Award, Palette, ChevronDown, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { NotificationPopover } from '../components/dashboard/NotificationPopover';
import { useToast } from '../lib/toast';
import { useAuth } from '../lib/convex-auth';

const personalNavItems = [
  { icon: LayoutDashboard, label: 'Home', to: '/dashboard', end: true },
  { icon: Trophy, label: 'My Awards', to: '/dashboard/my-awards' },
  { icon: Vote, label: 'My Nominations', to: '/dashboard/my-nominations' },
  { icon: Ticket, label: 'My Tickets', to: '/dashboard/my-tickets' },
  { icon: Bookmark, label: 'Saved Events', to: '/dashboard/saved' },
];

const orgNavItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard/org' },
  { icon: Presentation, label: 'Community', to: '/dashboard/feed' },
  { icon: Trophy, label: 'Events & Awards', to: '/dashboard/events' },
  { icon: Ticket, label: 'Ticketing', to: '/dashboard/ticketing' },
  { icon: Vote, label: 'Voting', to: '/dashboard/voting' },
  { icon: Gavel, label: 'Judges', to: '/dashboard/judges' },
  { icon: Users, label: 'Team', to: '/dashboard/team' },
  { icon: TrendingUp, label: 'Analytics', to: '/dashboard/analytics' },
  { icon: TrendingUp, label: 'Monetization', to: '/dashboard/monetization' },
  { icon: Image, label: 'Media Center', to: '/dashboard/media' },
  { icon: Globe, label: 'Website', to: '/dashboard/website' },
  { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
];

type WorkspaceMode = 'personal' | 'org';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    return localStorage.getItem('awwardly-workspace-mode') as WorkspaceMode || 'personal';
  });
  const location = useLocation();
  const { toast } = useToast();
  const { currentOrg, organizations, switchOrg, user, signOut } = useAuth();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    localStorage.setItem('awwardly-workspace-mode', workspaceMode);
  }, [workspaceMode]);

  const handleSwitchToOrg = (orgId: string) => {
    switchOrg(orgId);
    setWorkspaceMode('org');
  };

  const handleBackToPersonal = () => {
    setWorkspaceMode('personal');
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b border-white/5 bg-dark-950/40">
        <BrandLogo className="scale-90 origin-left" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        {workspaceMode === 'personal' ? (
          <PersonalSidebar />
        ) : (
          <OrgSidebar />
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-dark-950/30">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to sign out?')) {
              signOut();
              window.location.href = '/auth/login';
            }
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-dark-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  const PersonalSidebar = () => (
    <>
      <div className="mb-2 px-3 text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">Personal</div>
      {personalNavItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          className={({ isActive }) => cn(
            "group flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 text-[13px]",
            isActive 
              ? "bg-gold-500 text-dark-950 font-bold shadow-lg shadow-gold-500/20" 
              : "text-dark-400 hover:text-white hover:bg-white/5"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn(
                "mr-3 h-4 w-4 transition-colors",
                isActive ? "text-dark-950" : "text-dark-500 group-hover:text-gold-500"
              )} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}

      <div className="mt-6 mb-2 px-3 text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">Organizations</div>
      {organizations.map((org) => (
        <button
          key={org.id}
          onClick={() => handleSwitchToOrg(org.id)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-dark-400 hover:text-white hover:bg-white/5 transition-all text-left group"
        >
          {org.logoUrl ? (
            <img src={org.logoUrl} className="h-5 w-5 rounded-md object-cover shrink-0" alt="" />
          ) : (
            <div className="h-5 w-5 rounded-md flex items-center justify-center shrink-0 text-[8px] font-bold" style={{ backgroundColor: org.primaryColor + '20', color: org.primaryColor }}>
              {org.name[0]}
            </div>
          )}
          <span className="truncate flex-1">{org.name}</span>
          <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-dark-600 group-hover:text-dark-400 transition-colors" />
        </button>
      ))}
      <Link
        to="/onboarding"
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-dark-500 hover:text-gold-500 hover:bg-gold-500/5 transition-all mt-1"
      >
        <span className="h-5 w-5 rounded-md flex items-center justify-center shrink-0 bg-white/5 text-xs">+</span>
        Create Organization
      </Link>
    </>
  );

  const OrgSidebar = () => currentOrg && (
    <>
      {/* Back to Personal — TOP */}
      <button
        onClick={handleBackToPersonal}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] text-dark-400 hover:text-gold-500 hover:bg-gold-500/5 transition-all w-full text-left mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Personal
      </button>

      <div className="h-px bg-white/5 my-2" />

      {/* Org Header */}
      <div className="px-3 mb-4">
        <div className="flex items-center gap-3">
          {currentOrg.logoUrl ? (
            <img src={currentOrg.logoUrl} className="h-9 w-9 rounded-lg object-cover shrink-0" alt="" />
          ) : (
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: currentOrg.primaryColor + '20' }}>
              <span className="text-sm font-bold" style={{ color: currentOrg.primaryColor }}>{currentOrg.name[0]}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentOrg.name}</p>
            <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-0.5">Media Hub</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5 mb-2" />

      {/* Org Nav Items */}
      {orgNavItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) => cn(
            "group flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 text-[13px]",
            isActive 
              ? "bg-gold-500/10 text-gold-500 font-bold" 
              : "text-dark-400 hover:text-white hover:bg-white/5"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn(
                "mr-3 h-4 w-4 transition-colors",
                isActive ? "text-gold-500" : "text-dark-500 group-hover:text-gold-500"
              )} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <aside className="w-72 hidden md:flex flex-col border-r border-white/5 bg-dark-950 shadow-2xl relative z-30">
        <SidebarContent />
      </aside>

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
              className="fixed inset-y-0 left-0 w-72 bg-dark-950 border-r border-white/10 z-[70] md:hidden flex flex-col shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-dark-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 hidden md:flex items-center justify-between px-8 border-b border-white/5 bg-dark-950/40 backdrop-blur-xl sticky top-0 z-20">
            <div className="flex items-center gap-4 text-dark-400">
               <Link
                 to="/dashboard/search"
                 className="h-10 w-96 rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 gap-3 focus-within:border-gold-500/50 transition-all cursor-pointer group hover:border-white/10"
               >
                  <Search className="h-4 w-4 text-dark-500 group-hover:text-gold-500 transition-colors" />
                  <span className="text-xs font-medium">Search anything...</span>
                  <div className="ml-auto flex gap-1">
                     <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] border border-white/10">⌘</kbd>
                     <kbd className="px-1.5 py-0.5 rounded bg-dark-800 text-[10px] border border-white/10">K</kbd>
                  </div>
               </Link>
            </div>
            
            <div className="flex items-center gap-4">
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
               <Link to="/dashboard/profile" className="h-10 w-10 rounded-xl bg-gold-500 flex items-center justify-center text-dark-950 font-bold border-2 border-white/10 hover:border-white/20 transition-all overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  ) : (
                    user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'
                  )}
               </Link>
            </div>
        </header>

        <header className="h-14 flex md:hidden items-center justify-between px-6 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-20">
            <BrandLogo className="scale-75 origin-left" />
            <button onClick={() => setIsMobileMenuOpen(true)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 text-dark-300 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar pb-32 md:pb-10">
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
