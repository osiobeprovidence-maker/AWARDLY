import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Trophy, Users, ShieldCheck, Vote,
  TrendingUp, Settings, Menu, X, Bell, Search, LogOut, DollarSign,
  AlertTriangle, FileText, Megaphone, BarChart3, Eye, Activity, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useAuth } from '../lib/convex-auth';

const adminNavItems = [
  { section: 'Overview', items: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: BarChart3, label: 'Analytics', to: '/admin/analytics' },
  ]},
  { section: 'Management', items: [
    { icon: Building2, label: 'Organizations', to: '/admin/organizations' },
    { icon: Trophy, label: 'Events', to: '/admin/events' },
    { icon: Users, label: 'Users', to: '/admin/users' },
    { icon: Vote, label: 'Voting Center', to: '/admin/voting' },
  ]},
  { section: 'Finance', items: [
    { icon: DollarSign, label: 'Revenue', to: '/admin/revenue' },
    { icon: FileText, label: 'Transactions', to: '/admin/transactions' },
    { icon: TrendingUp, label: 'Payouts', to: '/admin/payouts' },
  ]},
  { section: 'Platform', items: [
    { icon: ShieldCheck, label: 'Fraud Center', to: '/admin/fraud' },
    { icon: Megaphone, label: 'Notifications', to: '/admin/notifications' },
    { icon: Activity, label: 'Audit Logs', to: '/admin/audit' },
    { icon: Zap, label: 'Verifications', to: '/admin/verifications' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
  ]},
];

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b border-white/5 bg-dark-950/40">
        <BrandLogo className="scale-90 origin-left" />
        <span className="ml-2 text-[9px] font-bold text-emerald-400 uppercase tracking-[0.15em] bg-emerald-500/10 px-2 py-0.5 rounded">Admin</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        {adminNavItems.map((group) => (
          <div key={group.section} className="mb-4">
            <div className="mb-2 px-3 text-[10px] font-bold text-dark-500 uppercase tracking-[0.2em]">{group.section}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/admin'}
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
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-dark-950/30">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-dark-400 hover:text-gold-500 hover:bg-gold-500/5 transition-all w-full text-left mb-2"
        >
          <Eye className="h-4 w-4" />
          Back to Dashboard
        </button>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              Platform Admin
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-dark-400 hover:text-gold-500 transition-all cursor-pointer">
              <Bell className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 rounded-xl bg-gold-500 flex items-center justify-center text-dark-950 font-bold border-2 border-white/10 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              ) : (
                user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SA'
              )}
            </div>
          </div>
        </header>

        <header className="h-14 flex md:hidden items-center justify-between px-6 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-20">
          <BrandLogo className="scale-75 origin-left" />
          <button onClick={() => setIsMobileMenuOpen(true)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 text-dark-300 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar pb-32 md:pb-10">
          <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -mr-96 -mt-96 animate-pulse duration-[10s]" />
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
