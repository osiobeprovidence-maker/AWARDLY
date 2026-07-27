import React from 'react';
import { Outlet } from 'react-router-dom';

export function OrgLayout() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
