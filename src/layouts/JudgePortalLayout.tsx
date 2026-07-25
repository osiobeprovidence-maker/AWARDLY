import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Trophy, Users, ClipboardList, BarChart3,
  BookOpen, Bell, Settings, LogOut, Menu, X, ChevronDown, Award,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useAuth } from '../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/judge' },
  { icon: Trophy, label: 'Assigned Categories', to: '/judge/categories' },
  { icon: ClipboardList, label: 'Scorecards', to: '/judge/scorecards' },
  { icon: BarChart3, label: 'My Progress', to: '/judge/progress' },
  { icon: BookOpen, label: 'Judging Guidelines', to: '/judge/guidelines' },
  { icon: Bell, label: 'Notifications', to: '/judge/notifications' },
  { icon: Settings, label: 'Profile', to: '/judge/profile' },
];

export function JudgePortalLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Get judge assignments for event switching
  const assignments = useQuery(
    api.judges.queries.getMyAssignments,
    user?.convexUserId ? { userId: user.convexUserId as any } : 'skip'
  ) ?? [];

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  const selectedAssignment = assignments.find((a) => a._id === selectedEventId) ?? assignments[0] ?? null;

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (assignments.length > 0 && !selectedEventId) {
      setSelectedEventId(assignments[0]._id);
    }
  }, [assignments, selectedEventId]);

  const currentEvent = selectedAssignment?.event;
  const currentOrg = selectedAssignment?.org;

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center px-6 border-b border-white/5 bg-dark-950/40">
        <BrandLogo className="scale-90 origin-left" />
      </div>

      {/* Event Switcher */}
      {assignments.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <button
              onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold-500/20 transition-all"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: (currentOrg?.primaryColor ?? '#c68a35') + '20' }}>
                <Award className="h-4 w-4" style={{ color: currentOrg?.primaryColor ?? '#c68a35' }} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-white truncate">{currentEvent?.title ?? 'Event'}</p>
                <p className="text-[10px] text-dark-500 truncate">{currentOrg?.name ?? 'Organization'}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-dark-500 transition-transform", isEventDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isEventDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-1 z-50 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-1 max-h-[240px] overflow-y-auto">
                    {assignments.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => { setSelectedEventId(a._id); setIsEventDropdownOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                          a._id === selectedEventId ? "bg-gold-500/10" : "hover:bg-white/5"
                        )}
                      >
                        <div className="h-7 w-7 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ backgroundColor: (a.org?.primaryColor ?? '#c68a35') + '20', color: a.org?.primaryColor ?? '#c68a35' }}>
                          {a.event?.title?.[0] ?? 'E'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-medium truncate", a._id === selectedEventId ? "text-gold-500" : "text-white")}>{a.event?.title}</p>
                          <p className="text-[10px] text-dark-500">{a.categories.length} categories</p>
                        </div>
                        {a._id === selectedEventId && <span className="h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1 custom-scrollbar">
        <div className="mb-2 px-3 text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">Judge Portal</div>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/judge'}
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
      </div>

      <div className="p-6 border-t border-white/5 bg-dark-950/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 text-xs font-bold border border-gold-500/20">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-dark-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to sign out?')) {
              signOut();
              window.location.href = '/auth/login';
            }
          }}
          className="flex w-full items-center px-4 py-3 text-xs font-bold uppercase tracking-widest text-dark-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <aside className="w-80 hidden md:flex flex-col border-r border-white/5 bg-dark-950 shadow-2xl relative z-30">
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
              className="fixed inset-y-0 left-0 w-80 bg-dark-950 border-r border-white/10 z-[70] md:hidden flex flex-col shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-6 right-6">
                <button onClick={() => setIsMobileMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 flex md:hidden items-center justify-between px-6 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-20">
          <BrandLogo className="scale-75 origin-left" />
          <button onClick={() => setIsMobileMenuOpen(true)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-300 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative custom-scrollbar pb-32 md:pb-10">
          <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none -mr-96 -mt-96 animate-pulse duration-[10s]" />

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-5xl mx-auto relative z-10 h-full"
          >
            <Outlet context={{ selectedAssignment, currentEvent, currentOrg }} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
