/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthLayout } from './layouts/AuthLayout';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/Overview';
import { DashboardFeed } from './pages/dashboard/Feed';
import { DashboardEvents } from './pages/dashboard/Events';
import { DashboardVoting } from './pages/dashboard/Voting';
import { Monetization } from './pages/dashboard/Monetization';
import { NominationSettings } from './pages/dashboard/NominationSettings';
import { DashboardLive } from './pages/dashboard/Live';
import { DashboardMedia } from './pages/dashboard/Media';
import { DashboardAnalytics } from './pages/dashboard/Analytics';
import { DashboardSettings } from './pages/dashboard/Settings';
import { CreateEvent } from './pages/dashboard/CreateEvent';
import { CategoryNominees } from './pages/dashboard/CategoryNominees';
import { CategoryCriteria } from './pages/dashboard/CategoryCriteria';
import { CategoryDetail } from './pages/dashboard/CategoryDetail';
import { ManageRules } from './pages/dashboard/ManageRules';
import { ManageNominees } from './pages/dashboard/ManageNominees';
import { ManageCriteria } from './pages/dashboard/ManageCriteria';
import { CategoryBranding } from './pages/dashboard/CategoryBranding';
import { Followers } from './pages/dashboard/Followers';
import { Pricing } from './pages/Pricing';
import { Resources } from './pages/Resources';
import { OrgLayout } from './layouts/OrgLayout';
import { OrgProfile } from './pages/org/OrgProfile';
import { Discover } from './pages/Discover';
import { Schedule } from './pages/Schedule';
import { AwardDetails } from './pages/AwardDetails';
import { EventDetails } from './pages/org/EventDetails';
import { CreateOrg } from './pages/onboarding/CreateOrg';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { ToastProvider } from './lib/toast';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="relative min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/awards/:awardId" element={<AwardDetails />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resources" element={<Resources />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            <Route path="/onboarding" element={<CreateOrg />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="feed" element={<DashboardFeed />} />
              <Route path="events" element={<DashboardEvents />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="events/:eventId/manage" element={<CreateEvent />} />
              <Route path="events/:eventId/categories/:categoryId/nominees" element={<ManageNominees />} />
              <Route path="events/:eventId/categories/:categoryId/criteria" element={<ManageCriteria />} />
              <Route path="events/:eventId/categories/:categoryId/branding" element={<CategoryBranding />} />
              <Route path="events/:eventId/categories/:categoryId/rules" element={<ManageRules />} />
              <Route path="events/:eventId/categories/:categoryId/detail" element={<CategoryDetail />} />
              <Route path="events/:eventId/categories/:categoryId" element={<CategoryDetail />} />
              <Route path="followers" element={<Followers />} />
              <Route path="voting" element={<DashboardVoting />} />
              <Route path="monetization" element={<Monetization />} />
              <Route path="voting/settings" element={<NominationSettings />} />
              <Route path="live" element={<DashboardLive />} />
              <Route path="media" element={<DashboardMedia />} />
              <Route path="analytics" element={<DashboardAnalytics />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>

            {/* Public Org Routes */}
            <Route path="/org" element={<OrgLayout />}>
              <Route path=":orgId" element={<OrgProfile />} />
              <Route path=":orgId/events/:eventId" element={<EventDetails />} />
            </Route>

            {/* Platform Admin */}
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
