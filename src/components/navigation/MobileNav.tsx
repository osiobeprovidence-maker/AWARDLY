import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Radio, Bell, User, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav() {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-dark-950/80 backdrop-blur-2xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors px-4 py-2",
            isActive ? "text-gold-500" : "text-dark-400 hover:text-white"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </NavLink>
        
        <NavLink 
          to="/discover" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors px-4 py-2",
            isActive ? "text-gold-500" : "text-dark-400 hover:text-white"
          )}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Explore</span>
        </NavLink>

        <div className="relative -mt-8 flex flex-col items-center">
          <button 
            onClick={() => navigate('/dashboard/events/create')}
            className="h-14 w-14 bg-gold-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/20 border-4 border-dark-950 text-dark-950 ring-4 ring-gold-500/10 active:scale-95 transition-transform"
          >
            <PlusCircle className="h-7 w-7" />
          </button>
        </div>

        <NavLink 
          to="/dashboard/live" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors px-4 py-2 relative",
            isActive ? "text-gold-500" : "text-dark-400 hover:text-white"
          )}
        >
          <Radio className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
          <span className="absolute top-2 right-4 h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse" />
        </NavLink>

        <NavLink 
          to="/auth/login" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors px-4 py-2",
            isActive ? "text-gold-500" : "text-dark-400 hover:text-white"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </NavLink>
      </div>
    </div>
  );
}
