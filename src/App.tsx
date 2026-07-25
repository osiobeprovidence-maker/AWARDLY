/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthLayout } from './layouts/AuthLayout';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { PostAuthRedirect } from './pages/auth/PostAuthRedirect';
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
import { Billing } from './pages/dashboard/Billing';
import { SearchPage } from './pages/dashboard/Search';
import { AwardCeremony } from './pages/dashboard/AwardCeremony';
import { TicketingLayout, TicketingDashboard, TicketingEvents, CreateTicket, TicketOrders, TicketCustomers, CheckIn, TicketDiscounts, TicketingAnalytics, TicketingSettings } from './pages/dashboard/ticketing';
import { CreateEvent } from './pages/dashboard/CreateEvent';
import { CategoryNominees } from './pages/dashboard/CategoryNominees';
import { CategoryCriteria } from './pages/dashboard/CategoryCriteria';
import { CategoryDetail } from './pages/dashboard/CategoryDetail';
import { ManageRules } from './pages/dashboard/ManageRules';
import { ManageNominees } from './pages/dashboard/ManageNominees';
import { ManageCriteria } from './pages/dashboard/ManageCriteria';
import { CategoryBranding } from './pages/dashboard/CategoryBranding';
import { Followers } from './pages/dashboard/Followers';
import { TeamManagement } from './pages/dashboard/Team';
import { JudgeManagement } from './pages/dashboard/JudgeManagement';
import { NotificationsPage } from './pages/dashboard/Notifications';
import { UserProfile } from './pages/profile/UserProfile';
import { Pricing } from './pages/Pricing';
import { Resources } from './pages/Resources';
import { ArticlePage } from './pages/resources/ArticlePage';
import { VideoPage } from './pages/resources/VideoPage';
import { CaseStudyPage } from './pages/resources/CaseStudyPage';
import { TemplatePage } from './pages/resources/TemplatePage';
import { OrgLayout } from './layouts/OrgLayout';
import { OrgProfile } from './pages/org/OrgProfile';
import { Discover } from './pages/Discover';
import { Schedule } from './pages/Schedule';
import { AwardDetails } from './pages/AwardDetails';
import { AwardPortal } from './pages/AwardPortal';
import { EventHub } from './pages/EventHub';
import { EventDetails } from './pages/org/EventDetails';
import { LiveFeed } from './pages/LiveFeed';
import { ShareView } from './pages/ShareView';
import { CreateOrgWizard } from './pages/onboarding/CreateOrgWizard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { JudgePortalLayout } from './layouts/JudgePortalLayout';
import { JudgeDashboard, AssignedCategories, NomineeReview, Scorecards, JudgeProgress, JudgeGuidelines, JudgeProfile, JudgeNotifications } from './pages/judge';

import { ToastProvider } from './lib/toast';
import { AuthProvider } from './lib/convex-auth';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="relative min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/awards/:awardId" element={<AwardDetails />} />
              <Route path="/awards/:awardId/portal" element={<AwardPortal />} />
              <Route path="/events/:eventId" element={<EventHub />} />
              <Route path="/events/:eventId/live" element={<LiveFeed />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/articles/:slug" element={<ArticlePage />} />
              <Route path="/resources/videos/:slug" element={<VideoPage />} />
              <Route path="/resources/case-studies/:slug" element={<CaseStudyPage />} />
              <Route path="/resources/templates/:slug" element={<TemplatePage />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="redirect" element={<PostAuthRedirect />} />
              </Route>

              <Route path="/onboarding" element={<CreateOrgWizard />} />
              
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
                <Route path="team" element={<TeamManagement />} />
                <Route path="judges" element={<JudgeManagement />} />
                <Route path="voting" element={<DashboardVoting />} />
                <Route path="monetization" element={<Monetization />} />
                <Route path="voting/settings" element={<NominationSettings />} />
                <Route path="live" element={<DashboardLive />} />
                <Route path="media" element={<DashboardMedia />} />
                <Route path="analytics" element={<DashboardAnalytics />} />
                <Route path="billing" element={<Billing />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="ceremony/:eventId" element={<AwardCeremony />} />
                <Route path="ticketing" element={<TicketingLayout />}>
                  <Route index element={<TicketingDashboard />} />
                  <Route path="events" element={<TicketingEvents />} />
                  <Route path="create" element={<CreateTicket />} />
                  <Route path="orders" element={<TicketOrders />} />
                  <Route path="customers" element={<TicketCustomers />} />
                  <Route path="check-in" element={<CheckIn />} />
                  <Route path="discounts" element={<TicketDiscounts />} />
                  <Route path="analytics" element={<TicketingAnalytics />} />
                  <Route path="settings" element={<TicketingSettings />} />
                </Route>
                <Route path="settings" element={<DashboardSettings />} />
              </Route>

              {/* Public Org Routes */}
              <Route path="/org" element={<OrgLayout />}>
                <Route path=":orgId" element={<OrgProfile />} />
                <Route path=":orgId/events/:eventId" element={<EventDetails />} />
              </Route>

              {/* User Profiles */}
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/u/:username" element={<UserProfile />} />

              {/* Judge Portal */}
              <Route path="/judge" element={<JudgePortalLayout />}>
                <Route index element={<JudgeDashboard />} />
                <Route path="categories" element={<AssignedCategories />} />
                <Route path="nominees/:categoryId" element={<NomineeReview />} />
                <Route path="scorecards" element={<Scorecards />} />
                <Route path="progress" element={<JudgeProgress />} />
                <Route path="guidelines" element={<JudgeGuidelines />} />
                <Route path="notifications" element={<JudgeNotifications />} />
                <Route path="profile" element={<JudgeProfile />} />
              </Route>

              {/* Platform Admin */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Public Share View */}
              <Route path="/share/:token" element={<ShareView />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
