import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-950 flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-gold-900/10 blur-[100px] pointer-events-none" />
      
      {/* Visual side for large screens */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative z-10 border-r border-white/5 bg-dark-900/30 backdrop-blur-3xl">
        <BrandLogo />
        
        <div className="max-w-md">
          <h1 className="font-serif text-5xl font-medium leading-tight mb-6 mt-12">
            The premium standard for <span className="text-gold-500 italic">award management</span>.
          </h1>
          <p className="text-dark-300 text-lg leading-relaxed">
            Build your community, run secure paid campaigns, host live events, and celebrate excellence—all on one platform.
          </p>
        </div>
        
        <div className="text-dark-500 text-sm">
          © {new Date().getFullYear()} AWARDLY. All rights reserved.
        </div>
      </div>
      
      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-md lg:hidden flex items-center mb-12">
          <BrandLogo />
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
