import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Calendar, Users, Trophy, ExternalLink, MoreVertical, Trash2, Edit3, X, AlertTriangle } from 'lucide-react';
import { mockEvents, mockOrganizations } from '../../data';
import { Input } from '../../components/ui/Input';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../lib/auth';

export function DashboardEvents() {
  const { currentOrg } = useAuth();
  const allOrgEvents = currentOrg ? mockEvents.filter(e => e.orgId === currentOrg.id) : mockEvents;
  const [events, setEvents] = React.useState(allOrgEvents);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEvents(currentOrg ? mockEvents.filter(e => e.orgId === currentOrg.id) : mockEvents);
  }, [currentOrg]);

  const handleDelete = () => {
    if (deleteId) {
      setEvents(events.filter(e => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Events & Awards</h1>
          <p className="text-dark-400">Manage your ceremonies, nominees, and categories.</p>
        </div>
        <Link to="/dashboard/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create New Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 lg:max-w-md">
              <Input icon={Search} placeholder="Search events..." />
            </div>
            <select className="bg-dark-900 border border-white/10 rounded-lg px-4 h-12 text-white text-sm outline-none focus:ring-1 focus:ring-gold-500">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Ended</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-medium text-dark-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-4 py-4">Event Details</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Voting</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((event) => (
                  <tr key={event.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={event.coverUrl} 
                          className="h-12 w-20 rounded-lg object-cover" 
                          alt="cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">{event.title}</h4>
                          <div className="flex items-center text-xs text-dark-500">
                            <Trophy className="h-3 w-3 mr-1 text-gold-500" /> 12 Categories • 84 Nominees
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 font-serif">
                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                         event.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-dark-800 text-dark-400 border-white/5'
                       }`}>
                         {event.status}
                       </span>
                    </td>
                    <td className="px-4 py-5">
                       <span className={`text-xs font-medium ${event.isVotingActive ? 'text-emerald-400' : 'text-dark-500'}`}>
                         {event.isVotingActive ? 'Active' : 'Disabled'}
                       </span>
                    </td>
                    <td className="px-4 py-5">
                       <div className="text-sm text-dark-300">Sept 4, 2026</div>
                       <div className="text-xs text-dark-500">18:00 UTC</div>
                    </td>
                    <td className="px-4 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Link to={`/dashboard/events/${event.id}/manage`}>
                           <Button variant="glass" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 bg-white/5 hover:bg-white/10">
                             Manage
                           </Button>
                         </Link>
                          <Link to={`/org/${currentOrg?.slug || event.orgId}/events/${event.id}`} target="_blank">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-dark-500 hover:text-white">
                             <ExternalLink className="h-4 w-4" />
                           </Button>
                         </Link>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => setDeleteId(event.id)}
                           className="h-8 w-8 text-dark-500 hover:text-rose-500 hover:bg-rose-500/10"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <h2 className="text-2xl font-serif text-white mb-2">Delete Event?</h2>
              <p className="text-dark-400 text-sm mb-8">This action is permanent and will delete all categories, nominees, and voting history for this event.</p>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full bg-rose-600 hover:bg-rose-700 border-rose-600 text-white" onClick={handleDelete}>Delete Permanently</Button>
                <Button variant="ghost" className="w-full" onClick={() => setDeleteId(null)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
