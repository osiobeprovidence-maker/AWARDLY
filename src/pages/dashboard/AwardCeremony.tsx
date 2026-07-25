import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import {
  Building2, MapPin, Calendar, Clock, Users, Mic, Shirt, Car,
  Accessibility, Video, Ticket, Megaphone, Settings, ExternalLink,
  ArrowLeft, CheckCircle, AlertCircle, TrendingUp, DollarSign,
  Link as LinkIcon, ShieldCheck, Eye, Plus, Star,
} from 'lucide-react';

type Tab = 'overview' | 'venue' | 'schedule' | 'speakers' | 'livestream' | 'ticketing' | 'guests' | 'announcements';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'overview', label: 'Overview', icon: Eye },
  { key: 'venue', label: 'Venue', icon: MapPin },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
  { key: 'speakers', label: 'Speakers', icon: Mic },
  { key: 'livestream', label: 'Livestream', icon: Video },
  { key: 'ticketing', label: 'Ticketing', icon: Ticket },
  { key: 'guests', label: 'Guests', icon: Users },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
];

export function AwardCeremony() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const ceremony = useQuery(
    api.ticketing.mutations.getCeremonyOverview,
    eventId ? { eventId: eventId as any } : 'skip'
  );

  if (!ceremony) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-dark-800 rounded" />
          <div className="h-4 w-96 bg-dark-800 rounded" />
          <div className="h-64 bg-dark-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const hasPhysical = ceremony.awardFormat === 'physical' || ceremony.awardFormat === 'hybrid';
  const hasOnline = ceremony.awardFormat === 'online' || ceremony.awardFormat === 'hybrid';
  const isTicketed = !!ceremony.ticketing;
  const ticketStatus = ceremony.ticketing?.ticketStatus;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <Breadcrumbs />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-white tracking-tight italic mb-2">Award Ceremony</h1>
            <p className="text-dark-500 text-xs font-bold uppercase tracking-widest">{ceremony.title}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5"
            onClick={() => navigate(`/dashboard/events/${eventId}/manage`)}
          >
            <Settings className="h-4 w-4 mr-2" /> Edit Ceremony
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gold-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Format</p>
                <p className="text-sm text-white font-medium capitalize">{ceremony.awardFormat || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Status</p>
                <p className="text-sm text-white font-medium capitalize">{ceremony.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Votes</p>
                <p className="text-sm text-white font-medium">{ceremony.totalVotes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isTicketed ? 'bg-emerald-500/10' : 'bg-dark-800'}`}>
                <Ticket className={`h-5 w-5 ${isTicketed ? 'text-emerald-400' : 'text-dark-600'}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Ticketing</p>
                <p className="text-sm text-white font-medium">
                  {isTicketed ? `${ceremony.ticketing?.ticketSales ?? 0} sold` : 'Not connected'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-900/60 rounded-2xl p-1 border border-white/5 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gold-500/20 text-gold-500 border border-gold-500/20'
                  : 'text-dark-400 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold-500" /> Ceremony Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-xs text-dark-500">Format</span>
                <span className="text-sm text-white font-medium capitalize">{ceremony.awardFormat || 'Not set'}</span>
              </div>
              {ceremony.date && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-dark-500">Date</span>
                  <span className="text-sm text-white font-medium">
                    {new Date(ceremony.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              {ceremony.time && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-dark-500">Time</span>
                  <span className="text-sm text-white font-medium">{ceremony.time}</span>
                </div>
              )}
              {ceremony.ceremony?.venueName && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-dark-500">Venue</span>
                  <span className="text-sm text-white font-medium">{ceremony.ceremony.venueName}</span>
                </div>
              )}
              {ceremony.ceremony?.host && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-dark-500">Host / MC</span>
                  <span className="text-sm text-white font-medium">{ceremony.ceremony.host}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-xs text-dark-500">Categories</span>
                <span className="text-sm text-white font-medium">{ceremony.categoryCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-gold-500" /> Ticketing Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTicketed ? (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm text-white font-medium">Connected</p>
                      <p className="text-[11px] text-dark-400">Powered by MyInvite</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-bold text-dark-500 uppercase">Tickets Sold</p>
                      <p className="text-lg text-white font-bold mt-1">{ceremony.ticketing?.ticketSales ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-bold text-dark-500 uppercase">Revenue</p>
                      <p className="text-lg text-white font-bold mt-1">
                        {(ceremony.ticketing?.ticketRevenue ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                    <a href={ceremony.ticketing?.ticketUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Manage on MyInvite
                    </a>
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="h-10 w-10 text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-400 text-sm font-medium">No ticketing configured</p>
                  <p className="text-dark-600 text-[11px] mt-1 mb-4">Set up ticketing in the event creation wizard</p>
                  <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5" asChild>
                    <Link to={`/dashboard/events/${eventId}/manage`}>
                      <Settings className="h-4 w-4 mr-2" /> Configure
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'venue' && (
        <Card>
          <CardContent className="p-8">
            {hasPhysical && ceremony.ceremony?.venueName ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                    <MapPin className="h-7 w-7 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">{ceremony.ceremony?.venueName}</h3>
                    <p className="text-sm text-dark-400">{ceremony.ceremony?.venueAddress}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ceremony.ceremony?.capacity && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <Users className="h-5 w-5 text-dark-500 mb-2" />
                      <p className="text-[10px] font-bold text-dark-500 uppercase">Capacity</p>
                      <p className="text-sm text-white font-medium">{ceremony.ceremony.capacity}</p>
                    </div>
                  )}
                  {ceremony.ceremony?.parkingInfo && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <Car className="h-5 w-5 text-dark-500 mb-2" />
                      <p className="text-[10px] font-bold text-dark-500 uppercase">Parking</p>
                      <p className="text-sm text-white font-medium">{ceremony.ceremony.parkingInfo}</p>
                    </div>
                  )}
                  {ceremony.ceremony?.accessibilityNotes && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <Accessibility className="h-5 w-5 text-dark-500 mb-2" />
                      <p className="text-[10px] font-bold text-dark-500 uppercase">Accessibility</p>
                      <p className="text-sm text-white font-medium">{ceremony.ceremony.accessibilityNotes}</p>
                    </div>
                  )}
                </div>
                {ceremony.ceremony?.description && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-dark-500 mb-2">About the Venue</p>
                    <p className="text-sm text-dark-300">{ceremony.ceremony.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                <p className="text-dark-400 text-sm font-medium">No venue information</p>
                <p className="text-dark-600 text-[11px] mt-1">Configure venue details in the ceremony settings</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'livestream' && (
        <Card>
          <CardContent className="p-8">
            {hasOnline && ceremony.ceremony?.livestreamUrl ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <Video className="h-7 w-7 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">Livestream Configured</h3>
                    <p className="text-sm text-dark-400 truncate max-w-md">{ceremony.ceremony.livestreamUrl}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-gold-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">YouTube Integration</p>
                    <p className="text-xs text-dark-400 mt-1">Your livestream will be embedded on the public event page and broadcast tab.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                <p className="text-dark-400 text-sm font-medium">No livestream configured</p>
                <p className="text-dark-600 text-[11px] mt-1">Add a livestream URL in the ceremony settings</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'ticketing' && (
        <Card>
          <CardContent className="p-8">
            {isTicketed ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <Ticket className="h-7 w-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">{ceremony.ticketing?.eventName}</h3>
                    <p className="text-sm text-dark-400 flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${ticketStatus === 'connected' ? 'bg-emerald-400' : 'bg-dark-600'}`} />
                      {ticketStatus === 'connected' ? 'Connected' : ticketStatus}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">Powered by MyInvite</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-3xl font-bold text-white">{ceremony.ticketing?.ticketSales ?? 0}</p>
                    <p className="text-[10px] font-bold text-dark-500 uppercase mt-1">Tickets Sold</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-3xl font-bold text-white">{(ceremony.ticketing?.ticketRevenue ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-dark-500 uppercase mt-1">Revenue</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-3xl font-bold text-white">{ceremony.ticketing?.guestCount ?? 0}</p>
                    <p className="text-[10px] font-bold text-dark-500 uppercase mt-1">Guests</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                  <a href={ceremony.ticketing?.ticketUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Manage Event on MyInvite
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-dark-700 mx-auto mb-3" />
                <p className="text-dark-400 text-sm font-medium">No ticketing configured</p>
                <p className="text-dark-600 text-[11px] mt-1 max-w-sm mx-auto">
                  Ticketing is available for physical and hybrid ceremonies. Configure it in the event creation wizard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'schedule' && (
        <Card>
          <CardContent className="p-8 text-center py-16">
            <Calendar className="h-12 w-12 text-dark-700 mx-auto mb-3" />
            <p className="text-dark-400 text-sm font-medium">Schedule management coming soon</p>
            <p className="text-dark-600 text-[11px] mt-1">Create and manage your ceremony timeline</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'speakers' && (
        <Card>
          <CardContent className="p-8 text-center py-16">
            <Mic className="h-12 w-12 text-dark-700 mx-auto mb-3" />
            <p className="text-dark-400 text-sm font-medium">Speaker management coming soon</p>
            <p className="text-dark-600 text-[11px] mt-1">Add speakers, hosts, and presenters</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'guests' && (
        <Card>
          <CardContent className="p-8 text-center py-16">
            <Users className="h-12 w-12 text-dark-700 mx-auto mb-3" />
            <p className="text-dark-400 text-sm font-medium">Guest management powered by MyInvite</p>
            <p className="text-dark-600 text-[11px] mt-1 max-w-sm mx-auto">
              {isTicketed
                ? 'Guest lists, RSVPs, and check-in are managed through MyInvite.'
                : 'Connect ticketing to enable guest management.'}
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'announcements' && (
        <Card>
          <CardContent className="p-8 text-center py-16">
            <Megaphone className="h-12 w-12 text-dark-700 mx-auto mb-3" />
            <p className="text-dark-400 text-sm font-medium">Announcements coming soon</p>
            <p className="text-dark-600 text-[11px] mt-1">Send updates to attendees</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
