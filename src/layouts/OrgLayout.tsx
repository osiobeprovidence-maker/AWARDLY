import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { PublicNav } from '../components/navigation/PublicNav';

export function OrgLayout() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      <PublicNav />

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
